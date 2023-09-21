const { Router }  = require( 'express' );
const router      = Router();
const mongo       = require( '../modules/mongodb' );
const jwt         = require('jsonwebtoken');
const privateKey  = process.env.privateKey;


router.get('/getDocument/:id', function ( req, res, next ) {
  let token = req.headers.cookie.split( '; ' ).find( el => el.startsWith( 'auth._token.local=Bearer%20' )).replace( 'auth._token.local=Bearer%20', '' );  
  jwt.verify( token, privateKey, function( err, decoded ) {
    mongo.connect( function ( err, mongo ) {
      const db = mongo.db( 'documents' );
      const collection = db.collection( 'documents' );	
      if ( err ) return console.log( err );
      collection.find( { id: 'document-' + parseInt( req.params.id ) } ).toArray( function ( err, results ) {
        if ( results != undefined ){
          if ( results[0] != undefined ){
            if ( results[0].users.indexOf(decoded.id) != -1 ){
              let document = {
                'id': results[0].id,
                'title': results[0].title,
                'text': results[0].text,
                'status': 'Ok'
              };
              res.json( document );
            }
            else {
              let document = {
                'status': 'notAccess'
              };
              res.json( document );
            };
          }
          else {
            let document = {    
              'status': 'notFile'
            };
            res.json( document );
          };
        };
        mongo.close();
      });
    });
  });
});

module.exports = router;
