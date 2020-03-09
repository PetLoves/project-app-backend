'use strict';
const serverless = require('serverless-http');
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const uuidv4 = require('uuid/v4');
const mysql = require('mysql');


const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_SCHEMA
});


// Retrieving tasks
app.get('/pets', function (req, res) {

  // Reconfigure DB so that taskID is void, uuid is the taskId, and make tasks default to user 1.
  connection.query('SELECT * FROM `pets`', function (error, results, fields) {
    // error will be an Error if one occurred during the query
    if(error) {
      console.error("Your query had a problem with fetching pets", error);
      res.status(500).json({errorMessage: error});
    }
    else {
      // Query was successful
      res.json({petloves: results});
    }
  });
});

module.exports.pets = serverless(app);
