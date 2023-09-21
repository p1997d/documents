const express           = require( 'express' );
const app               = express();
const list              = require( './routes/list' );
const getDocument       = require( './routes/getDocument' );
const saveDocument      = require( './routes/saveDocument' );
const newDocument       = require( './routes/newDocument' );
const removeDocument    = require( './routes/removeDocument' );
const auth              = require( './routes/auth' );

app.use( list );
app.use( getDocument );
app.use( saveDocument );
app.use( newDocument );
app.use( removeDocument );
app.use( auth );

module.exports = app;
