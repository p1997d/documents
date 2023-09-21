const { MongoClient } = require( 'mongodb' ),
    url			      = `mongodb+srv://${process.env.MONGODB_LOGIN}:${process.env.MONGODB_PASSWORD}@cluster0.omikn.mongodb.net/documents?retryWrites=true&w=majority`,
    client		      = new MongoClient( url );

module.exports = client;