var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
let db;
let connection;

async function connectDb(){
    connection = await mongoClient.connect("mongodb://127.0.0.1");
    db = connection.db("Assign");
    return db
}

async function closeConnection(){
    if(connection){
        await connection.close()
    }else{
        console.log("No Connection")
    }
}

module.exports = {connectDb,closeConnection,db,connection}