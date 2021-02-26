/*******************************************************************************
 Copyright 2015 Ellucian Company L.P. and its affiliates.
 ******************************************************************************/

// xe namespace is for providing eXtensible Environment functionality.
// this will likely be provided as a service and injected
var xe = (function (xe) {
    //Attributes
    xe.typePrefix = 'xe-';                                                       //prefix for xe specific html attributes
    xe.type = {field: 'field',section: 'section'};                               //logical type names
    xe.attr = {field: xe.typePrefix+'field', section: xe.typePrefix+'section', labelledBy: 'aria-labelledby', describedBy: 'aria-describedby'};   //html attribute names
    xe.replaceAttr = ['placeholder', 'title', 'label', 'buttonText', 'tabLabel', 'html'];
    xe.attrInh = {section: xe.typePrefix+'section-inh'};                         //html attribute name for section inherited
    xe.forAttribute = 'xe-for';
    xe.errors = [];
    xe.sections;
    xe.extensionsFound = false;

    //Logging
    xe.logging = {none: 0, debug: 1, verbose: 2};
    xe.logging.level = xe.logging.none;
    if ( window.location.search.indexOf("xeLogging=debug")!=-1 )
        xe.logging.level=xe.logging.debug;
    if ( window.location.search.indexOf("xeLogging=verbose")!=-1 )
        xe.logging.level=xe.logging.verbose;

    $.fn.editable.defaults.placeholder = '';

    xe.log = function () {
        if (xe.logging.level>xe.logging.none) {
            //probably can implement this more elegantly...
            if (arguments.length == 1)
                console.log(arguments[0]);
            if (arguments.length == 2)
                console.log(arguments[0], arguments[1]);
            if (arguments.length == 3)
                console.log(arguments[0], arguments[1], arguments[2]);
            if (arguments.length == 4)
                console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
    };

    //I18N - we use extensibility specific resource loading. We should investigate if we can
    //extend the baseline properties loading as done for ZK pages
    xe.loadResources = function(){
        //load resources synchronously to make sure they are available when needed.
        $.ajax({
            url: extensibilityInfo.url + 'internal/resources',
            dataType: 'json',
            data: {application: xe.page.application,page: xe.page.name,hash:location.hash},
            async: false,
            success: function(json){
                xe.log('resources loaded');
                var resources=json[0]; //data used for extending page
                for (var key in resources) {
                    $.i18n.map[key] = resources[key];
                }
            }
        });
    };

    // item is a string or an object with a key attribute
    // for now we don't support args
    xe.i18n = function (item, args) {
        return (typeof item == 'string')?item: $.i18n.prop(item.key, args);
    };

    //Check if we are in developer mode
    xe.devMode = function() {
        return !!window.extensibilityAdmin;
    };

    //This gets called several times, is it worth to refactor and eveluate URL parameters only once?
    //Don't bother for now, we may remove this from release as it is not a userstory to have enable/disable extensions
    xe.enableExtensions = function() {
        return window.location.search.indexOf("baseline=y")==-1;
    };


    // create a selector for an element - specify a name or a selector for all with a specific type
    xe.selector = function( elementType, name ) {
        if (name)
            return '['+ xe.typePrefix + elementType + '=' + name + ']';
        else
            return '['+ xe.typePrefix + elementType+']';
    };

    xe.selectorFor = function( name ) {
      return '[' + xe.forAttribute + (name ? '=' + name: '') + ']';
    };

    // Create a selector for removing an element and its associated labels, etc.
    xe.selectorToRemove = function( elementType, name ) {
        return xe.selector( elementType, name) + ', ' + xe.selectorFor( name ); //['+xe.typePrefix+'="' + name + '"]';
    };

    // get a simple selector for the group (well, nothing specific for a group so far)
    // might want to assure it has a child section
    xe.getGroupSelector = function(element) {
        var res = element[0].tagName;
        if (element[0].id) {
            res += '#' + element[0].id;
        }
        if (element[0].className) {
            res += '.' + element[0].className;
        }
        return res;
    };

    xe.getFields = function(section) {
        var fields = $(xe.selector(xe.type.field),section);
        var res = [];
        $.each(fields, function(i,field ){
            res.push({name:field.attributes[xe.typePrefix+xe.type.field].value, html:field.outerHTML});
        });
        return res;
    };

    xe.getPageName = function() {
        return extensibilityInfo.page;
    };
    xe.getApplication = function() {
        return extensibilityInfo.application;
    };

    // Metadata definition for page parsing - for now just for showing as a help for extension developers
    // Basic structure (example, Sections can be nested but don't have to):
    // Page
    //      Section1
    //          Section 1.1
    //              Field 1.1.1
    //              ...
    //          Section 1.2
    //          ...

    xe.Page = function(description) {
        return {
            description: description,
            application: xe.getApplication(),
            name: xe.getPageName(),
            groups:[],
            addGroup: function (group,sections) {
                var xeType=xe.type.section;
                var res=[];
                $.each(sections, function(i,section ){
                    res.push({name:section.attributes[xe.typePrefix+xeType].value, fields:xe.getFields(section)});
                });
                this.groups.push({name: xe.getGroupSelector(group), sections: res});
            },
            // Refactoring page structure parsing for Angular
            // Leaving Groups in case it is used for JQuery pages
            //elements:[], //sections and fields are added here
            dom:{children:[]},
            level: 0,
            count: 0,
            addNode: function (node,element){
                function equ(left,right) {
                    return (left.section && left.section == right.section) || left.field && left.field == right.field;
                }
                var found=false;
                this.level++;
                this.count++;
                if (this.level>50 || this.count>100000)
                    throw ('Recursion / endless loop error '+this.level + '/' + this.count );
                if (equ(element.parent,node)) {
                    if (!node.children)
                        node.children=[];
                    node.children.push(element);

                    xe.log('Added Element',element.section || element.field, 'To child of ',node.section || node.field);
                    found = true;
                }
                //If not found, recurse children
                for (var i = 0; !found && node.children && i < node.children.length; i++) {
                    found = this.addNode(node.children[i], element);
                }
                this.level--;
                return found;
            },
            addElement: function (element) {
                //this.elements.push(element);
                if (element.parent==null)
                    this.dom.children.push(element);
                else {
                    this.addNode(this.dom, element);
                }
            }
        }
    };

    //metadata for baseline page
    xe.page = new xe.Page('Baseline Page');
    //metadata for  page after extension - just do Baseline for now
    // xe.extendedPage = new xe.Page('Extended Page');

    // xe.extensions = {} // load extensions for each page from server-side config

    // templates define how to create each type of widget

    xe.templates = {

        // should probably convert these to a string templating mechanism, ...${field.name}..., etc.
        'static': function( field ) {
            return '<div data-xe-for="' + field.name + '"><label>' + (field.label||'Empty Label') + '</label><span title="title text" title="title text" data-xe-field="' + field.name + '">{{' + field.name + '}}</span></div>';
        },
        'literal': function( field ) {
            return '<div data-xe-for="' + field.name + '"><label>' + (field.label||'Empty Label') + '</label><span title="title text" title="title text" data-xe-field="' + field.name + '">' + field.value + '</span></div>';
        },
        'input': function( field ) {
            return '<div data-xe-for="' + field.name + '"><label>' + (field.label||'Empty Label') + '</label><input title="title text" data-xe-field="' + field.name + '" ng-model="' + field.name + '"></input></div>';
        },
        'text': function( field ) {
            return '<div data-xe-for="' + field.name + '"><label>' + (field.label||'Empty Label') + '</label><text title="title text" data-xe-field="' + field.name + '" ng-model="' + field.name + '"></text></div>';
        }
    };

    // utility function to generate the HTML for a specific field
    xe.generateField = function(field) {
        var template = xe.templates[field.template] || xe.templates['static'];
        xe.log( 'using template ' + field.template + '=' + template);
        return template( field );
    };


    /*******************************************************************************************************
    Element positioning information relies on the correct order of repositioning due to dependencies
    This routine reorders positioning meta data accordingly
    *******************************************************************************************************/
    xe.reorderMetadata = function( extensions ) {

        function getDependency ( extension, extensions ){

            var complete = false;
            var dependency;

            while ( !complete ) {

                dependency = _.find( extensions, function(n){
                    return (n["name"] == extension.nextSibling) && n.processed == false;
                });

                if (!dependency) {
                    complete = true;
                }
                else {
                    extension = dependency;
                }
            }
            return extension;
        }

        var orderedMoves = [];
        var allExtensionsApplied = false;
        var extension;

        // mark all item positioning extensions as currently unprocessed
        _.each( extensions, function(n) {
            n.processed = false;
        });

        while ( !allExtensionsApplied ) {

            // find an unapplied extension
            extension = _.find( extensions, function(n){ return n.processed == false });

            if ( extension ) {

                extension = getDependency( extension, extensions );
                orderedMoves.push( extension );

                // reorder fields if this is a section
                if ( extension.fields ) {
                    extension.orderedFields = xe.reorderMetadata( extension.fields );
                }

                extension.processed = true;

            } else {
                allExtensionsApplied = true;
            }
        }
        return orderedMoves;
    };


    /*******************************************************************************************************
    Apply extensions to all sections within rootElement
    Note that rootElement may itself be a section
    *******************************************************************************************************/
    xe.extend = function ( rootElement ) {

        /*******************************************************************************************************
         Replace the label text on a tab
         *******************************************************************************************************/
        function replaceTabLabel( extensions ) {
            $(xe.selectorFor(extensions.name)).find("a").html(xe.i18n(extensions.tabLabel));
        }


        /*******************************************************************************************************
        Determine any associated elements of the given element
        *******************************************************************************************************/
        function findAriaLinkedElements(ariaType, elementList) {
            var linkedElements = $();
            elementList.each(function() {
                var ariaLabels = $(this).attr(ariaType);
                if (ariaLabels) {
                    $.merge(linkedElements,$('#' + ariaLabels.split(' ').join(',#')));
                }
            });
            return linkedElements;
        }


        /*******************************************************************************************************
        Remove a section or field from the page
        *******************************************************************************************************/
        function removeElement( type, element ) {
            var elementsToRemove = $(element).add( $(xe.selectorFor(element.attributes[xe.typePrefix + type].value) ) );

            // include elements linked to this by aria-labelledby and aria-describedby ids
            $.merge(elementsToRemove,findAriaLinkedElements(xe.attr.labelledBy,elementsToRemove));
            $.merge(elementsToRemove,findAriaLinkedElements(xe.attr.describedBy,elementsToRemove));

            elementsToRemove.addClass('xe-exclude');
        }


        /*******************************************************************************************************
        Reposition a section or field
         *******************************************************************************************************/
        function moveElement( elementType, extension ) {
            var to;
            var elementToMove = $(extension.element).addClass("xe-moved");
            var lastElement;
            var selector;

            if ( extension.nextSibling ) {
                to = $(xe.selector(elementType, extension.nextSibling));
                if (to.length==0) {
                    xe.errors.push('Unable to find target element. '+JSON.stringify(extension.nextSibling));
                    return null;
                } else {
                    elementToMove.insertBefore(to);
                }
            } else {
                // nextSibling specified as null so is positioned after it's last sibling of elementType if one exists
                selector = "[" + xe.typePrefix + elementType + "]";
                lastElement = elementToMove.siblings(selector).last();
                if ( lastElement.length > 0 ) {
                    elementToMove.insertAfter( lastElement );
                } else {
                    elementToMove.parent().append(elementToMove);
                }
            }
        }


        /*******************************************************************************************************
        Ensures siblings (sections or fields) are correctly ordered on the page as specified by any
        extensions.

        This routine:
        - determines an elements siblings which are of the same type as the element itself (section or field)
        - retrieves ordered extensibility information for element type
        - reorders the siblings according to this metadata
        *******************************************************************************************************/
        function orderSiblings( elementType, element, orderedExtensions ) {

            var siblings = $(element).add( $(element).siblings(xe.selector(elementType)) );
            _.each( orderedExtensions, function(extension) {

                var sibling = siblings.filter( xe.selector(elementType, extension.name) );
                if ( sibling ) {
                    extension.element = sibling;
                    moveElement(elementType, extension);
                }
            });
        }


		/*******************************************************************************************************
        Replace an attribute on a field
        *******************************************************************************************************/
        function replaceAttribute(fieldElement,attributeName,attributeValue) {
            $(fieldElement).attr(attributeName,xe.i18n(attributeValue));
        }


        /*******************************************************************************************************
        Replace the HTML of a field
        *******************************************************************************************************/
        function replaceHTML( fieldExtension ) {

            var newHTML;
            var fieldElement = $( xe.selectorToRemove(xe.type.field, fieldExtension.name) );
            if (fieldExtension.component) {
                newHTML = xe.renderComponent(fieldExtension.component);
            } else { //if param.html is set, use it otherwise generate from template
                newHTML = fieldExtension.attributes["html"] ? fieldExtension.attributes["html"] : xe.generateField(fieldExtension);
            }
            fieldElement.html(newHTML);
            fieldElement.addClass("xe-replaced");
        }

        /*******************************************************************************************************
        Replace the label text on a button item
        *******************************************************************************************************/
        function replaceButtonText( fieldElement, fieldExtension ) {

            if ( $(fieldElement).is("input") ) {
                $(fieldElement).attr("value",xe.i18n(fieldExtension.attributes["buttonText"]));
            } else if ( $(fieldElement).is("button") ) {
                $(fieldElement).html(xe.i18n(fieldExtension.attributes["buttonText"]));
            }
        }


        /*******************************************************************************************************
        Replace any labels associated with a field
        *******************************************************************************************************/
        function replaceLabel( fieldElement, fieldExtension ) {

            var labelElement;
            var itemId = fieldElement.attributes["id"] ? fieldElement.attributes["id"].value : '';

            if ( fieldElement.attributes[xe.attr.labelledBy] ) {
                labelElement = $('#' + fieldElement.attributes[xe.attr.labelledBy].value);
            } else {
                //get label inside item
                labelElement = $('label', fieldElement);
                if (!labelElement.length) {
                    // check if parent element is a label
                    labelElement = $(fieldElement).parent().is('label') ? $(fieldElement).parent() : $();
                }
                if (!labelElement.length && itemId)  {
                    // check for label element marked as for this item id
                    labelElement = $("label[for='" + itemId + "']");
                }
            }
            if (labelElement.length) {
                // replace the text in the first text node of the label
                var labelTextNode = labelElement.contents().filter(function() { return this.nodeType == 3})[0];
                if ( labelTextNode ) {
                    labelTextNode.nodeValue = xe.i18n(fieldExtension.attributes["label"]);
                }
            } else {
                xe.errors.push('Unable to find and replace label for '+ fieldExtension.name);
            }
        }


        /*******************************************************************************************************
        Extend field attributes
        *******************************************************************************************************/
        function extendFieldAttributes( fieldElement, fieldExtension ) {

            // Replace any attributes where new value provided
            _.each(xe.replaceAttr,function(attributeName) {

                if ( fieldExtension.attributes[attributeName] != undefined) {

                    switch(attributeName) {
                        case "html":
                            replaceHTML(fieldExtension);
                            break;
                        case "label":
                            replaceLabel(fieldElement, fieldExtension);
                            break;
                        case "buttonText":
                            replaceButtonText(fieldElement, fieldExtension);
                            break;
                        default:
                            replaceAttribute(fieldElement,attributeName,fieldExtension.attributes[attributeName]);
                    }
                }
            });
        }


        /*******************************************************************************************************
        Apply any extensions to each section field in turn
        *******************************************************************************************************/
        function extendSectionFields( section, extensions ) {

            _.each( extensions.fields, function( fieldExtension ) {
                var fieldElement = $(xe.selector(xe.type.field, fieldExtension.name ), section)[0];

                if ( fieldElement ) {

                    // exclude field
                    if ( fieldExtension.exclude ) {
                        removeElement(xe.type.field, fieldElement );
                        return;
                    }

                    // reposition field
                    if ( _.has(fieldExtension, "nextSibling") &&
                        !$(fieldElement).hasClass("xe-moved")
                        ) {
                        orderSiblings( xe.type.field, fieldElement, extensions.orderedFields );
                    }

                    // add new field - not yet implemented?

                    // extend field attributes
                    if ( fieldExtension.attributes ) {
                        extendFieldAttributes( fieldElement, fieldExtension)
                    }
                } else {
                    xe.errors.push('Unable to find element ' + fieldExtension.name);
                }
            })
        }


        /*******************************************************************************************************
        Retrieve the metadata for a section and apply the extensions
        *******************************************************************************************************/
        function extendSection( section ) {
            var sectionName = section.attributes[xe.typePrefix + xe.type.section].value;

            // retrieve section metadata
            var extensions = _.find(xe.extensions.sections, function( sectionExtension ) {
                return sectionName == sectionExtension.name;
            });

            if ( extensions ) {

                // exclude section
                if ( extensions.exclude ) {
                    removeElement( xe.type.section, section );
                    return;
                }

                // reposition section
                if ( _.has(extensions, "nextSibling") &&
                     !xe.sections.filter(xe.selector(xe.type.section, sectionName )).hasClass("xe-moved")
                    ) {
                    orderSiblings(xe.type.section, section, xe.extensions.orderedSections);
                }

                // modify tab label
                if ( _.has(extensions, "tabLabel") ) {
                    replaceTabLabel(extensions);
                }

                // apply any defined extensions to the fields of this section
                extendSectionFields( section, extensions );
            }
        }

        // determine list of sections to be processed
        var $rootElement = $(rootElement);
        var sectionSelector = xe.selector( xe.type.section );
        xe.sections = $(sectionSelector, $rootElement);
        if ( $rootElement.is(sectionSelector)) {
            xe.sections = xe.sections.add( $rootElement );
        }

        // apply extensions to each section
        _.each( xe.sections, function(section) {
            extendSection( section );
        });

    };  // end xe.extend


    //This function searches element children for sections
    xe.parseGroups = function(element,attributes){
        var sections = element.children(xe.selector(xe.type.section));
        if ( sections.length > 0) {
            xe.page.addGroup( element, sections);
            xe.log("Parsed group: ",xe.page);
        }
    };

    //This function does group level changes on a page or part of a page (ng-include, ui-view or a handlebars template)
    xe.extendPagePart = function(element,attributes){
        var xeType = xe.type.section;
        var sections = $(xe.selector(xeType),element);
        if ( sections.length > 0) {
            if (xe.enableExtensions() ) {
                $.each(sections, function(i,section ){
                    var sectionName = section.attributes[xe.typePrefix+xeType].value;
                    var actions = xe.extensions.groups.sections[sectionName];
                    if (actions)
                        xe.extend(element, attributes, actions);
                });
            }
        }
    };


    //HTML rendering support
    xe.isVoidElement = function(tag) {
        //xe.voidElements is a map to specify the html element types that are 'void' (have no content)
        if (!xe.voidElements) {
            xe.voidElements = {};
            //Initialize voidElements map
            ["area", "base", "br", "col", "command", "embed", "hr", "img", "input",
                "keygen", "link", "meta", "param", "source", "track", "wbr"].forEach(function (val, idx, array) {
                    xe.voidElements[val] = true;
                }
            );
        }
        return xe.voidElements[tag.toLowerCase()];
    };

    //Render a generic component as HTML (a component is a simplified representation of HTML DOM element)
    xe.renderComponent = function ( component ) {
        //Note: void elements don't need </tag> and have no content
        var result="";
        if (component.tagName) {
            result="<"+component.tagName;
            Object.getOwnPropertyNames(component.attributes).forEach(function(val,idx,array) {
                    result+=' '+val+'="'+component.attributes[val]+'"';
                }
            );
            result += ">";
            //recursively add the child nodes
            if (component.childNodes && !xe.isVoidElement(component.tagName) ) {
                component.childNodes.forEach(function (val, idx, array) {
                        result += ' ' + xe.renderComponent(val);
                    }
                );
            }
        }
        if (component.textContent && (!component.tagName || !xe.isVoidElement(component.tagName))) {
            result += component.textContent;
        }
        if (component.tagName && !xe.isVoidElement(component.tagName)){
            result += "</" + component.tagName + ">";
        }
        return result;
    };


    // Page Editor - well, just show for now just show a simple node hierarchy
    xe.renderPageStructure = function(page){
        var count = 0;
        function renderNode(node, html) {
            count++;
            if (count>10000)
                throw ('Recursion error');
            if (node.section) {
                html += "<li>Section: " + node.section + "</li>\n";
            }
            else if (node.field) {
                html += "<li>Field: " + node.field + "</li>\n";
            }
            if (node.children) {
                html+="<ul>";
                for (var i = 0; i < node.children.length; i++) {
                    html  = renderNode(node.children[i], html);
                }
                html+="</ul>";
            }
            return html;
        }

        var result = "Page Structure "+page.description+" "+page.application+"/"+page.name;
        result = renderNode(page.dom, result);
        return result;
    };

    xe.popups = [null,null,null];


    xe.showPageStructure = function (page, popup){
        if (!popup) {
            popup = $('<div id="pageStructure'+page.description+'" ></div>');
            popup.dialog({appendTo: "#content", width: 600, height:"auto"});
            popup.append(xe.renderPageStructure(page));
        }
        popup.dialog("open");
        return popup;
    };

    xe.stats = {};

    xe.showStats = function (page, popup) {
        xe.renderStats = function(page){
            var res = $.i18n.prop("xe.page.status", [page.name]);
            for (var key in xe.stats) {
                res += '<li>'+key+'='+xe.stats[key];
            }
            if (xe.errors && xe.errors.length)
                res+='<br>'+ $.i18n.prop("xe.page.errors")+'<br>'+xe.errors;
            return res;
        };

        if (!popup) {
            popup = $('<div id="pageStats.' + page.name + '" ></div>');
            popup.dialog({appendTo: "#content", width: 600, height: "auto"});
            popup.append(xe.renderStats(page));
        }
        popup.dialog("open");
        return popup;
    };

    xe.extensionsEditor = function(page,popup) {
        if (!popup) {
            popup = $('<div id="extensionsEditor.' + page.name + '" ></div>');
            popup.dialog({
                dialogClass: "xe-extensions-editor",
                title: $.i18n.prop("xe.extension.editor.window.title"),
                appendTo: "#content", width: 600, height: "auto",
                buttons: [
                    {text: $.i18n.prop("xe.btn.label.cancel"), click: function() {$( this ).dialog( "close" );} },
                    {text: $.i18n.prop("xe.btn.label.save"), click: function(){ xe.saveExtensions();} }
                ]
            });

            popup.load(extensibilityPluginPath+'/templates/extedit.html',
                       function(x){
                           $('#extensions-edit-input',popup).text(JSON.stringify(xe.page.metadata,null,2));
                       }
            );
        }
        popup.dialog("open");
        return popup;
    };

    //Post updated extensions to the database
    xe.saveExtensions=function(){
        //var md = JSON.parse(xe.page.metadata);
        var data={application: xe.page.application, page:xe.page.name, metadata: xe.page.metadata } ;
        $.ajax({
            url: extensibilityInfo.url + 'webadmin/extensions',
            type:'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            processData: true,
            success: function(data){
                notifications.addNotification( new Notification({
                    message: $.i18n.prop("xe.alert.msg.saved"),
                    type: "success",
                    flash: true
                }));
                xe.log('Data Saved',data);
            }
        });
    };

    //Update the model with modifed extensions
    xe.setExtensions = function (value) {
        xe.page.metadata = JSON.parse(value);
    };

    //Add the tools menu item Extensibility if we are in developer mode
    xe.addExtensibilityMenu = function () {
        if (xe.devMode()) {
            ToolsMenu.addSection("extensibility", $.i18n.prop("xe.menu.section.extensibility"));

            /* Following item needs to be implemented for non Angular pages. Disable.
            ToolsMenu.addItem("pagestructurebase", "Show Baseline Page Structure", "extensibility", function () {
                xe.popups[0] = xe.showPageStructure(xe.page, xe.popups[0])
            });
             */
            /*
            ToolsMenu.addItem("pagestats", $.i18n.prop("xe.menu.extensions.status"), "extensibility", function () {
                xe.popups[1] = xe.showStats(xe.page, xe.popups[1])
            });
            */

            ToolsMenu.addItem("extensionseditor", $.i18n.prop("xe.menu.extensions.edit"), "extensibility", function () {
                xe.popups[2] = xe.extensionsEditor(xe.page, xe.popups[2])
            });
            ToolsMenu.addSection("base", $.i18n.prop("xe.menu.section.other"));
        }
    };

    xe.startup = function(){


        xe.log('Startup - fetching metadata...');
        //load meta-data synchronously to make sure it is available before compile needs it.
        $.ajax({
            url: extensibilityInfo.url + 'internal/extensions',
            dataType: 'json',
            data: {application: xe.page.application,page: xe.page.name,hash:location.hash},
            async: false,
            success: function(json){
                    xe.log('data loaded');
                    xe.extensions=json[0]; //data used for extending page
                    if ((xe.extensions !== undefined)) {
                        xe.extensionsFound = true;
                        if (xe.devMode()){
                            xe.page.metadata=[$.extend(true,{},xe.extensions)];  //clone of extensions used for editor
                        }
                        xe.extensions.orderedSections = xe.reorderMetadata(xe.extensions.sections);
                        xe.extendFunctions();
                    }
            }
        });
        if (xe.extensionsFound) {
            xe.log(xe.extensions);
            xe.loadResources();
        } else {
            xe.log('No Extensibility definitions found!');
        }
        xe.addExtensibilityMenu();
    };

    $(xe.startup);

    return xe;
})(xe || {});
