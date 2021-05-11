const config = require("../config/db-config");
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);


const restaurantNameSearch = (req, res) => {
  var name = req.params.name;
  console.log("restaurantNameSearch: search for ", name)
  var query = `
  SELECT name
  FROM restaurants
  WHERE UPPER(name) LIKE UPPER('%${name}%')
  LIMIT 50;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log("restaurantNameSearch return result: ", rows);
      res.json(rows);
    }
  });
};


const generalizedSearch = (req, res) => {
    var name = req.params.name;
    console.log("restaurantNameSearch: search for ", name)
    var query = `
    SELECT name
    FROM restaurants
    WHERE UPPER(name) LIKE UPPER('%${name}%') OR UPPER(categories) LIKE UPPER('%${name}%') 
    LIMIT 50;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("restaurantNameSearch return result: ", rows);
        res.json(rows);
      }
    });
  };


  const restaurantReviewSearchAdvanced = (req, res) => {
    var review1 = req.params.review1;
    var review2 = req.params.review2;
    var review3 = req.params.review3;
    console.log("restaurantReviewSearchAdvanced: search for ", review1)
    var query = `
    SELECT R.name, R.address
    FROM restaurants R JOIN reviews R2 ON R.business_id = R2.business_id
    WHERE R2.text LIKE '%${review1}%' 
        AND R2.text LIKE '%${review2}%'
        AND R2.text LIKE '%${review3}%'
    ;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("restaurantReviewSearchAdvanced return result: ", rows);
        res.json(rows);
      }
    });
  };



  const restaurantReviewSearch = (req, res) => {
    var name = req.params.name;
    
    console.log("restaurantReviewSearch: search for ", name)
    var query = `
    SELECT R.name, R.address
    FROM restaurants R JOIN reviews R2 ON R.business_id = R2.business_id
    WHERE R2.text LIKE '%${name}%' 
    ;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        console.log("restaurantReviewSearch return result: ", rows);
        res.json(rows);
      }
    });
  };

 
  const restaurantRatingLocationSearch = (req, res) => {
    var cityName = req.params.cityName;
    var ratingStar = req.params.ratingStar;
    var reviewCount = req.params.inputReview;
    console.log("restaurantRatingLocationSearch: search for ", cityName)
    var query = `
    SELECT R.name, R.city, R.address, R.stars
    FROM restaurants R
    WHERE review_count >= '${reviewCount}' AND stars >= '${ratingStar}' AND city = '${cityName}'
    ORDER BY stars DESC;

    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("restaurantRatingLocationSearch return result: ", rows);
        res.json(rows);
      }
    });
  };



  const restaurantRecommendationSearch = (req, res) => {
    //var category = req.params.category;
    var restaurantId = req.params.restaurantId;
    console.log("restaurantRecommendationSearch: search for ", restaurantId)
    var query = `
    
    WITH temp1 AS
    (SELECT *
    FROM restaurants R
    WHERE R.business_id = '${restaurantId}'),
    
    temp2 AS
    (SELECT temp1.business_id, temp1.name, temp1.address, temp1.city, temp1.state, temp1.postal_code, temp1.stars, temp1.review_count, 
    temp1.hours, TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(temp1.categories, ',', numbers.n), ',', -1)) categories
    FROM
      (SELECT 1 n UNION ALL SELECT 2
       UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN temp1
      ON CHAR_LENGTH(temp1.categories)
         -CHAR_LENGTH(REPLACE(temp1.categories, ',', ''))>=numbers.n-1),
         
    temp3 AS
    (SELECT restaurants.business_id, restaurants.name, restaurants.address, restaurants.city, restaurants.state, restaurants.postal_code, 
    restaurants.stars, restaurants.review_count, restaurants.hours,
    TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(restaurants.categories, ',', numbers.n), ',', -1)) categories
    FROM
      (SELECT 1 n UNION ALL SELECT 2
       UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN restaurants
      ON CHAR_LENGTH(restaurants.categories)
         -CHAR_LENGTH(REPLACE(restaurants.categories, ',', ''))>=numbers.n-1)
         
        
    SELECT temp3.business_id, temp3.name, restaurants.categories, COUNT(temp3.name) AS overlap,
    temp3.name, temp3.address, temp3.city, temp3.state, temp3.postal_code, temp3.stars, temp3.review_count, temp3.hours
    FROM temp2 JOIN temp3 ON temp2.categories = temp3.categories
    JOIN restaurants ON temp3.business_id = restaurants.business_id
    WHERE temp2.name <> temp3.name
    GROUP BY temp3.business_id
    ORDER BY overlap DESC
    LIMIT 10
    ;
    
    
    
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("restaurantRecommendationSearch return result: ", rows);
        res.json(rows);
      }
    });
  }


// example http://localhost:8081/top10SafestRestaurant/TX, http://localhost:8081/top10SafestRestaurant/TX/Austin
// city name can be null, but state name can't be null, because there can be cities with same names
  const getSafestRestaurants = (req, res) => {
    var state = req.params.state;
    var city = req.params.city;
    console.log("getSafestRestaurant: search for ", state, city)
    var whereStatement = 'WHERE';
    if (state!=null){
      whereStatement += ` r.state = '${state}' ${(city==null) ? '':' AND'}`;
    }
    if(city!=null){
      whereStatement += ` city = '${city}'`
    }
    if (state == null && city == null){
      whereStatement = ''
    }

    var query = `
    SELECT *
    FROM restaurants r
    JOIN safetyindex  s ON r.postal_code = s.zipcode
    ${whereStatement}
    ORDER BY safety_index
    LIMIT 100;
    `;
    //console.log("getSafestRestaurants: search for ", query)
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("getSafestRestaurants return result: ", rows);
        res.json(rows);
      }
    });
  };


// example http://localhost:8081/restaurantReivewKeywordListSearch/chinese,mexican
  const restaurantReivewKeywordListSearch = (req, res) => {
    var keywords = req.params.keywords.split(',');
    var order = req.params.order;
    var secondOrder = (order === 'Stars' ? 'review_count' : 'stars');
    var whereStatement = 'WHERE ';
    
    for (let i = 0; i < keywords.length; i++){
      word = keywords[i].toLowerCase()
      whereStatement += `${(i==0) ? '':'AND'} (txt.combined_text LIKE '% ${word} %' 
        OR txt.combined_text LIKE '% ${word}'
        OR txt.combined_text LIKE '${word} %')`;
    }

    console.log("restaurantReivewKeywordListSearch: search for ", keywords)
    var query = `
    SET SESSION group_concat_max_len = 1000000;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("restaurantReivewKeywordListSearch return result: ", rows);
      }
    });

    var query = `
    SELECT business_id, name, address, city, state, postal_code, stars, review_count, categories, hours
    FROM(
    SELECT rt.*, LOWER(GROUP_CONCAT( rv.text SEPARATOR ' ' )) as combined_text
    FROM restaurants rt
    JOIN reviews rv ON rt.business_id = rv.business_id
    GROUP BY rt.business_id) txt
    ${whereStatement}
    ORDER BY ${order} DESC, ${secondOrder} DESC
    LIMIT 100;
    `;
    console.log("restaurantReivewKeywordListSearch: search for ", query)

    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("restaurantReivewKeywordListSearch return result: ", rows);
        res.json(rows);
      }
    });

  };


  // example http://localhost:8081/restaurantGeneralSearch/sugar/TX/Austin/78702/4.5/true/'Restaurants','Bakeries'/true
  // example http://localhost:8081/restaurantGeneralSearch/sugar/null/null/null/4.5/true/'Restaurants','Bakeries'/true
  // example http://localhost:8081/restaurantGeneralSearch/null/null/null/null/4.5/false/'Restaurants','Chinese'/true
  const restaurantGeneralSearch = (req, res) => {
    var searchWord = req.params.searchWord;
    var state = req.params.state;
    var city = req.params.city;
    var zipcode = req.params.zipcode;
    var rating = req.params.rating;
    var covidSafe = req.params.covidSafe;
    var categoryList = req.params.categoryList;
    var categoryHit = 1;
    if (categoryList.includes(',')){
      categoryHit = categoryList.split(',').length
    }

    var whereStatement = `WHERE stars >= ${rating} `;

    if(city!=='null'){
      console.log("not equal to city")
      whereStatement += `AND res.state = '${state}' AND res.city='${city}' AND res.postal_code='${zipcode}' `
    }
    if(covidSafe!=='null'){
      whereStatement += `AND safety_index <= 0.5 `
    }

    if(searchWord!=='null'){
      whereStatement += `AND UPPER(res.name) LIKE UPPER('%${searchWord}%') OR UPPER(res.categories) LIKE UPPER('%${searchWord}%') `
    }


    var query = `
    SELECT *
    FROM  restaurants res
    JOIN safetyindex sf ON sf.zipcode = res.postal_code
    ${whereStatement}
    ORDER BY stars DESC;
    `;


    if(categoryList!=='null'){
      if (categoryList.length==1){
        categoryList
      }
      whereStatement += `AND categories_hit = ${categoryHit}`
      query = `
      WITH categoryTable AS(
        WITH res_with_cat AS(     
        SELECT 
        TRIM(substring_index(
        substring_index(r.categories, ',', n), 
        ',', 
        -1
        )) AS single_category, r.*
        FROM restaurants r
        JOIN numbers
        ON char_length(r.categories) 
        - char_length(REPLACE(r.categories, ',', '')) 
        >= n - 1 
        )
        SELECT *, COUNT(business_id) AS categories_hit
        FROM res_with_cat res
        WHERE single_category IN (${categoryList}) 
        GROUP BY business_id)
        SELECT *
        FROM categoryTable res
        JOIN safetyindex sf ON sf.zipcode = res.postal_code
        ${whereStatement}
        ORDER BY stars DESC, safety_index ASC;
      `
    }
    console.log("restaurantGeneralSearch: search for ", query)

    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("restaurantGeneralSearch return result: ", rows);
        res.json(rows);
      }
    });
  };

module.exports = {
	restaurantNameSearch: restaurantNameSearch,
    generalizedSearch: generalizedSearch,
    restaurantReviewSearchAdvanced: restaurantReviewSearchAdvanced,
    restaurantReviewSearch: restaurantReviewSearch,
    restaurantRatingLocationSearch: restaurantRatingLocationSearch,
    restaurantRecommendationSearch: restaurantRecommendationSearch,
    getSafestRestaurants: getSafestRestaurants,
    restaurantReivewKeywordListSearch: restaurantReivewKeywordListSearch,
    restaurantGeneralSearch: restaurantGeneralSearch,
};