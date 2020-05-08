const mysql = require('promise-mysql');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, "../.env") });
/*mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    password : 'iceman07',
    database : 'moviemania_basic'
}).then((conn) => {
    return db = conn.connection;
}).catch((err) => {
    throw err;
});*/
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  });

  module.exports = pool;

/*console.log(db);
module.exports = db;*/