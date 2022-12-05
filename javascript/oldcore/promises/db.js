var db = (function() {

    var fdb;
    var maleMembers;
    var sortedMaleMembers;
    var femaleMembers;
    var sortedFemaleMembers;

    function init() {
        firebase.initializeApp({
            apiKey: 'AIzaSyDxgEiXAJEvXAA4CDsF1yXlQaIczU3skgo',
            authDomain: 'nomads-d85b5.firebaseapp.com',
            projectId: 'nomads-d85b5'
        });

        fdb = firebase.firestore();

        fdb.settings({
            timestampsInSnapshots: true
        });  
    }
    
    function getAllData() {
        
        fdb.collection("testData")
        .where("field1", "==", "field1")
        .get()
        .then (
            // fulfillment handler
            function(docs) {
                docs.forEach( function(doc) {
                    console.log(doc.data());
                    
                });
            },
            
            //rejection handler
            function(err) {
                console.error(error);
            }
        )
    }

    return {
        init: init,
        getAllData,
    };
})();
db.init();
db.getAllData();
