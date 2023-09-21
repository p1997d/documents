const { Router }  = require( 'express' );
const router      = Router();
const mongo       = require( '../modules/mongodb' );
const jwt         = require( 'jsonwebtoken' );
const privateKey  = process.env.privateKey;

router.use( '/list', ( req, res ) => {
let token = req.headers.cookie.split( '; ' ).find( el => el.startsWith( 'auth._token.local=Bearer%20' )).replace( 'auth._token.local=Bearer%20', '' );
jwt.verify( token, privateKey, function( err, decoded ) {
    mongo.connect( function ( err, mongo ) {
      const db = mongo.db( 'documents' );
      const collection = db.collection( 'documents' );

      if ( err ) return console.log( err );

      collection.find().toArray(function ( err, results ) {
        list = [];
        results.forEach( function ( item, i ) {
          if ( item.users.indexOf( decoded.id ) != -1 ){
            let file = {
              'id': item.id,
              'title': item.title,
              'text': item.text        
            };
            list.push( file );
          };
        });
        res.json( list );
        mongo.close();
      });
    });  
  });
});

module.exports = router;
