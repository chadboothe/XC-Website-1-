/*
const pool = new Pool({
  host: "chunee.db.elephantsql.com",
  user: "qomcsrll",
  database: "qomcsrll",
  password: "s2PJlE_F9ytmfA-clPUr5BRRI84Ualp7",
  port: 5432
});
*/

const initOptions = {
    // global event notification;
    error(error, e) {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};

const pgp = require('pg-promise')(initOptions);

// using an invalid connection string:
//const db = pgp('postgres://qomcsrll:s2PJlE_F9ytmfA-clPUr5BRRI84Ualp7@chunee.db.elephantsql.com/qomcsrll');

//const db = pgp('postgres://john:pass123@localhost:5432/products');

//const db = pgp('postgres://riverhil_cpses_rikonhrg9q:fZYRHnbRB~xS@mi3-ts102.a2hosting.com:5432/riverhil_xcrhhs');


const cn = {
  host: "chunee.db.elephantsql.com",
  user: "qomcsrll",
  database: "qomcsrll",
  password: "s2PJlE_F9ytmfA-clPUr5BRRI84Ualp7",
  port: 5432,
  max: 30 // use up to 30 connections

    // "types" - in case you want to set custom type parsers on the pool level
};

const db = pgp(cn);


db.connect()
    .then(obj => {
        obj.done(); // success, release the connection;
        console.log("Database connected")
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });



global.db = db;
