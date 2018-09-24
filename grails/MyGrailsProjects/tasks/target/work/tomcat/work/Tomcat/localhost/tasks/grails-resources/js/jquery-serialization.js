// jquery plugin
( function($) {
        $.fn.extend({
            //new jquery function
            toObject: function() {  // serializes elements into object
                var result = {};
                // $. denotes jquery utility function eg. $.each
                // serializeArray() returns an array where each form field consists of a name and a value
                $.each(this.serializeArray(), function(i,v) {
                    result[v.name] = v.value;
                });
                return result;
            },
            fromObject: function(obj) {  // de-serializes object into elements
                // determine relevant form fields
                $.each( this.find(':input'), function(i,v) {
                    var name = $(v).attr('name');
                    if (obj[name]) {
                        $(v).val(obj[name]);
                    } else {
                        $(v).val('');
                    }
                });
            }
        });
    }
)(jQuery);
