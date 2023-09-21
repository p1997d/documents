const { Router }    = require( 'express' );
const router        = Router();
const mongo         = require( '../modules/mongodb' );
const firebase      = require( 'firebase' );
const db            = mongo.db( 'documents' );
const collection    = db.collection( 'documents' );
let title, documentText, fileID;

const firebaseConfig = {
	apiKey: 			process.env.Firebase_apiKey,
	authDomain:			"documents-58867.firebaseapp.com",
	databaseURL:		"https://documents-58867-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: 			"documents-58867",
	storageBucket: 		"documents-58867.appspot.com",
	messagingSenderId:	"632180671538",
	appId: 				"1:632180671538:web:409c8afca57c102cc2e82b"
};

firebase.initializeApp( firebaseConfig );
var fireDb = firebase.database();

router.get( '/saveDocument/:id', function ( req, res, next ) {
    fireDb.ref( 'CyberPashka/document-' +  parseInt( req.params.id ) ).get().then( ( snapshot ) => {
        if ( snapshot.exists() ) {
          title         = snapshot.val().title;
          documentText  = snapshot.val().text;
          fileID        = 'document-' +  parseInt( req.params.id );
        }
    }).then( () => {
        mongo.connect( function ( err, mongo ) {
            if ( err ) return console.log( err );
            collection.findOneAndUpdate (
                { id: fileID },
                { $set: {
                    title: title,
                    text: documentText
                }},
                function ( err, result ) {
                    mongo.close();
                    res.json({ status: 'OK' });
                }
            );
        });
    });    
});

module.exports = router;