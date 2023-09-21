const { Router }    = require( 'express' );
const router        = Router();
const mongo         = require( '../modules/mongodb' );

router.get( '/removeDocument/:id', function ( req, res, next ) {
    let fileID = req.params.id;
    mongo.connect( function ( err, mongo ) {
        const db = mongo.db( 'documents' );
        const collection = db.collection( 'documents' );
        if ( err ) return console.log( err );	
        collection.deleteOne( { id: fileID }, function ( err, result ) {
            mongo.close();
            res.json({ status: 'OK' });
        });
    });
});

module.exports = router;