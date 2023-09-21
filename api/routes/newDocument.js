const { Router }    = require( 'express' );
const router        = Router();
const mongo         = require( '../modules/mongodb' );
const jwt           = require( 'jsonwebtoken' );
const privateKey    = process.env.privateKey;

router.get( '/newDocument/', function ( req, res, next ) {
    let token = req.headers.cookie.split( '; ' ).find( el => el.startsWith( 'auth._token.local=Bearer%20' )).replace( 'auth._token.local=Bearer%20', '' );
    jwt.verify( token, privateKey, function( err, decoded ) {  
        fileID       = `document-${Date.now()}`;
        title        = 'Новый документ';
        documentText = "";	
        mongo.connect(function ( err, mongo ) {
            const db = mongo.db( 'documents' );
            const collection = db.collection( 'documents' );
            let personDocument = {
                "id": fileID,
                "title": title,
                "text": documentText,
                "users": [decoded.id]
            };
            collection.insertOne( personDocument, function ( err, result ) {				
                mongo.close();
                res.json({ status: 'OK' });
            });
        });
    });
});

module.exports = router;