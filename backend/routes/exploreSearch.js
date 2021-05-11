const config = require("../config/db-config");
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

const getStatesCities= (req, res) => {
    console.log("Calling getStatesCities")
    var query = `
    WITH states AS(
        SELECT DISTINCT state, city FROM restaurants
    )
    SELECT state, group_concat(city separator ',') city
    FROM states
    GROUP BY state;`;
    
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("getStatesCities return result: ", rows);
        res.json(rows);
      }
    });
  };

const getRankByLocation = (req, res) => {
    var state = req.params.state;
    var city = req.params.city;
    var orderBy = req.params.orderBy;
    let query;
    console.log("rankByLocation: search for ", state, city, orderBy)
    if (orderBy == "Stars"){
        if (state == "State"){
            if (city == "City"){
                query = `
                    SELECT *
                    FROM restaurants 
                    ORDER BY stars DESC, review_count DESC LIMIT 100;
                    `;
            }
            else{
                query = `
                    SELECT *
                    FROM restaurants
                    WHERE city = '${city}'
                    ORDER BY stars DESC, review_count DESC LIMIT 100;
                    `;
            }
        }
        else{
            if (city == "City"){
                query = `
                    SELECT *
                    FROM restaurants
                    WHERE state = '${state}' 
                    ORDER BY stars DESC, review_count DESC LIMIT 100;
                    `;
            }
            else{
                query = `
                    SELECT *
                    FROM restaurants
                    WHERE city = '${city}' AND state = '${state}' 
                    ORDER BY stars DESC, review_count DESC LIMIT 100;
                    `;
            }
        }
    }
    else{
        if (state == "State"){
            if (city == "City"){
                query = `
                    SELECT *
                    FROM restaurants 
                    ORDER BY review_count DESC, stars DESC LIMIT 100;
                    `;
            }
            else{
                query = `
                    SELECT *
                    FROM restaurants
                    WHERE city = '${city}'
                    ORDER BY review_count DESC, stars DESC LIMIT 100;
                    `;
            }
        }
        else{
            if (city == "City"){
                query = `
                    SELECT *
                    FROM restaurants
                    WHERE state = '${state}' 
                    ORDER BY review_count DESC, stars DESC LIMIT 100;
                    `;
            }
            else{
                query = `
                    SELECT *
                    FROM restaurants
                    WHERE city = '${city}' AND state = '${state}' 
                    ORDER BY review_count DESC, stars DESC LIMIT 100;
                    `;
            }
        }

    }
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("rankByLocation return result: ", rows);
        res.json(rows);
      }
    });
  };


const getCategoryRank= (req, res) => {
    var category = req.params.category;
    var orderBy = req.params.orderBy;
    let query 
    if (orderBy == "Stars"){
        query = `SELECT * 
        FROM restaurants
        WHERE categories LIKE '%${category}%'
        ORDER BY stars DESC, review_count DESC LIMIT 100;`
    }
    else {
        query = `SELECT *
        FROM restaurants
        WHERE categories LIKE '%${category}%'
        ORDER BY review_count DESC, stars DESC LIMIT 100;`
    }
    
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("categoryRank return result: ", rows);
        res.json(rows);
      }
    });
  };

const getRandRestaurant = (req, res) =>{
    console.log("Calling getRandRestaurant")
    var query = `SElECT * FROM restaurants
    ORDER BY RAND() LIMIT 1
    `;
    
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("getRandRestaurant return result: ", rows);
        res.json(rows);
      }
    });

}
module.exports = {
	getStatesCities: getStatesCities,
    getRankByLocation: getRankByLocation,
    getCategoryRank: getCategoryRank,
    getRandRestaurant: getRandRestaurant,
};
  