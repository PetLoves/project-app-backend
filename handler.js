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


// Retrieving pets from DB
app.get('/pets/:garden', function (req, res) {
  const userHasGarden = req.params;
  //IF HAS A GARDEN - HAS GARDEN = TRUE SELECT WHERE GARDEN FOR PET = TRUE
    connection.query('SELECT * FROM `pets` WHERE `needs_garden` = ?', [userHasGarden.garden], function (error, results, fields) {
      if(error) {
        console.error("Your query had a problem with fetching pets", error);
        res.status(500).json({errorMessage: error});
      }
      else {
        res.json({petloves: results});
      }
    });
});

//Adding users answers to DB
app.post('/users', function (req, res) {
  const userToAdd = req.body;
  userToAdd.userId = uuidv4();
  connection.query('INSERT INTO `users` SET ?', userToAdd, function (error, results, fields) {
    if (error) {
      console.error("Failed to add a user", error);
      res.json({ errorMessage: error });
    }
    else {
      res.json({ 
        message: "User successfully added",
        user: userToAdd
      })
    }
  });
});

module.exports.pets = serverless(app);
