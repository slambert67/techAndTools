var fs = require('fs');

fs.open(
    'info.txt', 'r',
	function(err, handle) {
		if (err) {
			console.log("ERROR: " + err.code + " (" + err.message + ")");
		} else {
		    var buf = new Buffer(100000);
		    fs.read(
		        handle, buf, 0, 100000, null,
			    function(err, length) {
				    console.log(buf.toString('utf8', 0 , length));
				    fs.close(handle, function(){});
			    }
		    );			
		}		
	}
);
