"use strict";
// invoke node server. E:\myStuff\technologies\javascript\node\code\firstJSONServer\load_albums

var myXHR = ( function() {
    console.log("myxhr");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http:\\localhost:8080', true);

    xhr.onload = function() {
        var responseObj = JSON.parse(this.response);
        console.log(responseObj.data.albums[0]);

    };

    xhr.onerror = function () {
        console.log("error");
    };

    xhr.send();
})();

var myFetch = (function () {
    console.log("my fetch with arrow funcs");
    fetch('http:\\localhost:8080')
    .then((resp) => resp.json())
    .then ( function(data) {
        console.log("data = ", data);
    })
    .catch( function(error) {
        console.log("2fail");
    });
})();

var myFetch = (function () {
    console.log("my fetch without arrow funcs");
    fetch('http:\\localhost:8080')
        .then( function(response) {
            console.log("status = " + response.status);
            return response.json();
        })
        .then(function (data) {
            console.log("data = ", data);
        })
        .catch(function (error) {
            console.log("3fail");
        });
})();