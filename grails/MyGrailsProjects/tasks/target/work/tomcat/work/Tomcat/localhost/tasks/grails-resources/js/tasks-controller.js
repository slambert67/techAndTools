// wait for completion of DOM construction
//$(document).ready( function() {
//    $('[required="required"]').prev('label').append('<span>*<span>').children('span').addClass('required');
//    $('tbody tr:even').addClass('even');
//
//    // display task creation on button click
//    $('#btnAddTask').click( function(evt) {
//        // evt.target returns DOM element - not wrapped jquery element
//        // prevent default hyperlink action ie. refresh page
//        evt.preventDefault();
//        $('#taskCreation').removeClass('not');
//    });
//
//    // highlight a selected row
//    $('tbody tr').click( function(evt) {
//        $(evt.target).closest('td').siblings().andSelf().toggleClass('rowHighlight');
//    });
//
//    // add event listeners to items not yet in DOM but which may be added dynamically
//    // specify type of event listener, type of element and callback
//    $('#tblTasks tbody').on('click', '.deleteRow', function(evt) {
//        evt.preventDefault();
//        $(evt.target).parents('tr').remove();
//    });
//
//
//
//    // save a task
//    $('#saveTask').click( function(evt) {
//        evt.preventDefault();
//        var task = $('form').toObject();
//        // build HTML using template
//        $('#taskRow').tmpl(task).appendTo( $('#tblTasks tbody') );
//    });
//});

// tasksController in global scope so only one instance. ie. singleton
// singleton needed so we can maintain state
tasksController = function() {

    var taskPage;
    var initialised = false;

    function taskCountChanged() {
        var count = $(taskPage).find('#tblTasks tbody tr').length;
        $('footer').find('#taskCount').text(count);
    };

    function errorLogger(errorCode, errorMessage) {
        console.log(errorCode + ':' + errorMessage);
    };

    return {
        init: function(page) {

            if (!initialised) {

                // initObjectStore can only be called when init has completed in asynchronous implementation
                // so we need to chain together these function calls / callbacks
                storageEngine.init(
                    // success callback
                    function() {
                        storageEngine.initObjectStore(
                            'task',
                            // success callback
                            function() {},
                            // error callback
                            errorLogger
                        )
                    },
                    // error callback
                    errorLogger
                );

                taskPage = page;
                $(taskPage).find('[required="required"]').prev('label').append('<span>*<span>').children('span').addClass('required');
                $(taskPage).find('tbody tr:even').addClass('even');

                // display task creation on button click
                $(taskPage).find('#btnAddTask').click( function(evt) {
                    // evt.target returns DOM element - not wrapped jquery element
                    // prevent default hyperlink action ie. refresh page
                    evt.preventDefault();
                    $('#taskCreation').removeClass('not');
                });

                // highlight a selected row
                $(taskPage).find('tbody tr').click( function(evt) {
                    $(evt.target).closest('td').siblings().andSelf().toggleClass('rowHighlight');
                });

                // add event listeners to items not yet in DOM but which may be added dynamically
                // specify type of event listener, type of element and callback
                $(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', function(evt) {
                    // .data() retrieves all data attributes associated with element```
                    storageEngine.delete('task', $(evt.target).data().taskId,
                        function() {
                            $(evt.target).parents('tr').remove();
                            taskCountChanged();
                        },
                        errorLogger
                    );
                });

                // save a task
                $(taskPage).find('#saveTask').click( function(evt) {
                    evt.preventDefault();

                    // if .valid() fails jquery.validation adds label denoting error
                    if ( $(taskPage).find('form').valid() ) {
                        var task = $('form').toObject();
                        storageEngine.save('task', task,
                            // success callback
                            function() {
                                $(taskPage).find('#tblTasks tbody').empty();
                                tasksController.loadTasks();
                                $(':input').val('');
                                $(taskPage).find('#taskCreation').addClass('not');
                                // build HTML using template
                                //$('#taskRow').tmpl(savedTask).appendTo($(taskPage).find('#tblTasks tbody'));
                            },
                            // error callback
                            errorLogger
                        );
                    }

                });

                // edit a task
                $(taskPage).find('#tblTasks tbody').on('click', '.editRow',
                    function(evt) {
                        $(taskPage).find('#taskCreation').removeClass('not');
                        storageEngine.findById('task', $(evt.target).data().taskId,
                            function(task) {
                                $(taskPage).find('form').fromObject(task);
                            }, errorLogger);
                    });
                initialised = true;
            }
        },
        loadTasks: function() {
            storageEngine.findAll('task', function(tasks) {
                $.each(tasks, function(index, task) {
                    // build HTML using template
                    $('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
                });
                taskCountChanged();
            }, errorLogger);
        }
    }
}();

