const mysql = require('mysql')

const connection = mysql.createConnection
({
    host: "localhost",
    user: "root",
    password: "",
    database: "express"
})

connection.connect((err)=>
{
    if (err)
    {
        console.error('Error connecting to mysql database' + err.stack)
        return;
    }
    console.log('Connected to mysql databse as ID' + connection.threadId)
})

module.exports = connection;