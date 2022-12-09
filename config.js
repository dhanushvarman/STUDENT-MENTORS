var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var dotenv = require('dotenv').config();
let db;
let connection;

async function connectDb(){
    connection = await mongoClient.connect(process.env.DB);
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