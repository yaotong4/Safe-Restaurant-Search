const config = require("../config/db-config");
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

const reviewsByBusinessId = (req, res) => {
  var businessId = req.params.businessId;
//   businessId = "SD1QV-zfhMGHNOGOzuPTkQ";
  console.log("reviewsByBusinessId: search for ", businessId)
  var query = `
  SELECT *
  FROM reviews 
  WHERE business_id = '${businessId}'
  ORDER BY date DESC;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log("reviewsByBusinessId return result: ", rows);
      res.json(rows);
    }
  });
};


const tipsByBusinessId = (req, res) => {
    var businessId = req.params.businessId;
  //   businessId = "SD1QV-zfhMGHNOGOzuPTkQ";
    console.log("reviewsByBusinessId: search for ", businessId)
    var query = `
    SELECT *
    FROM tips 
    WHERE business_id = '${businessId}'
    ORDER BY date DESC;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("tipsByBusinessId return result: ", rows);
        res.json(rows);
      }
    });
  };


  const getTop100Categories = (req, res) => {
    console.log("getTop100Categories: inside")
    var query = `
    WITH numbers as (
        select 1 as n
        union select 2 as n
          union select 3 as n
            union select 4 as n
              union select 5 as n
                union select 6 as n
      
      )
      SELECT DISTINCT single_category, count(1) AS frequency from ( 
        SELECT 
          TRIM(substring_index(
            substring_index(r.categories, ',', n), 
            ',', 
            -1
          )) AS single_category
        FROM restaurants r
        JOIN numbers
          ON char_length(r.categories) 
            - char_length(REPLACE(r.categories, ',', '')) 
            >= n - 1
      ) t1
      GROUP BY 1
      ORDER BY frequency DESC
      LIMIT 100;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("getTop100Categories return result: ", rows);
        res.json(rows);
      }
    });
  };


  
  const getTop5SafetestStates = (req, res) => {
    console.log("getTop5SafetestStates: inside")
    var query = `
    WITH temp1 AS
      (SELECT DISTINCT C.county, C.cases, C.state
      FROM covid C JOIN locations L ON C.fips = L.fips
      GROUP BY C.county),
        
    temp2 AS        
      (SELECT T.state, SUM(T.cases) AS sum
      FROM temp1 T
      GROUP BY T.state)

    SELECT * 
    FROM temp2 T
    GROUP BY T.sum
    ORDER BY T.sum ASC
    LIMIT 5;

    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("getTop5SafetestStates return result: ", rows);
        res.json(rows);
      }
    });
  };


  const covidInfoByBusinessId = (req, res) => {
    var businessId = req.params.businessId;
  //   businessId = "SD1QV-zfhMGHNOGOzuPTkQ";
    console.log("covidInfoByBusinessId: search for ", businessId)
    // var query = `
    // WITH restaurant_info AS(
    //   SELECT states.name AS state, locations.fips AS fips
    //   FROM restaurants, states, locations
    //   WHERE business_id = '${businessId}' AND restaurants.state = states.code AND restaurants.postal_code = locations.zipcode
    //   ),
    //   today AS (
    //   SELECT sum(cases) AS today_cases, sum(deaths) AS today_deaths
    //   FROM covid, restaurant_info
    //   WHERE covid.state = restaurant_info.state AND  STR_TO_DATE(date, '%Y-%m-%d') = DATE(NOW())-INTERVAL 39 DAY
    //   ),
    //   state_case AS (
    //   SELECT today.today_cases - sum(cases) AS state_7_day_cases,  today.today_deaths - sum(deaths) AS state_7_day_deaths
    //   FROM covid, today, restaurant_info
    //   WHERE covid.state = restaurant_info.state AND  STR_TO_DATE(date, '%Y-%m-%d') = DATE(NOW())-INTERVAL 40 DAY)
    //   ,
    //   today_zip AS (
    //   SELECT sum(cases) AS today_cases, sum(deaths) AS today_deaths
    //   FROM covid, restaurant_info
    //   WHERE covid.fips = restaurant_info.fips AND  STR_TO_DATE(date, '%Y-%m-%d') = DATE(NOW())-INTERVAL 39 DAY
    //   ),
    //   state_case_zip AS (
    //   SELECT today_zip.today_cases - sum(cases) AS zip_7_day_cases,  today_zip.today_deaths - sum(deaths) AS zip_7_day_deaths, covid.fips AS fips
    //   FROM covid, restaurant_info, today_zip
    //   WHERE covid.fips = restaurant_info.fips AND  STR_TO_DATE(date, '%Y-%m-%d') = DATE(NOW())-INTERVAL 40 DAY)
      
    //   SELECT DISTINCT zip_7_day_cases, zip_7_day_deaths,state_7_day_cases,state_7_day_deaths, safety_index  FROM state_case_zip, state_case, safetyindex
    //   WHERE state_case_zip.fips = safetyindex.fips;
    // `;
    // var query = `
    // with c1 as (select fips, date from covid),
    //   c2 as (select fips, date from covid),
    //   week as(
    //       select distinct c1.date as date, c2.date as same_week
    //       from c1 join c2 on c1.fips = c2.fips
    //       where date_sub(str_to_date(c1.date, '%Y-%m-%d'), interval 7 day) <= str_to_date(c2.date, '%Y-%m-%d')
    //       and str_to_date(c1.date, '%Y-%m-%d') >=str_to_date(c2.date, '%Y-%m-%d')
    //       order by date
    //   ),
    //   kinou as (
    //       select fips, cases, deaths, str_to_date(date, '%Y-%m-%d') - interval 1 day as yesterday from covid
    //   ),
    //   daily as(
    //       select covid.date, covid.county, kinou.cases-covid.cases as daily_cases, greatest(kinou.deaths-covid.deaths, 0) as daily_deaths, covid.fips
    //       from covid
    //       join kinou
    //       on covid.date = kinou.yesterday
    //       and covid.fips = kinou.fips
    //   ),
    //   sevenDays as (
    //       select d.date, d.daily_cases, d.daily_deaths, d.fips
    //       from (select * from daily) d
    //       join (select * from week where date in (select max(date) from week)) w
    //       on w.same_week = d.date
    //   ),
    //   result as (
    //       select s.date, s.daily_cases, s.daily_deaths
    //       from sevenDays s
    //       join locations on s.fips = locations.fips
    //       join (select postal_code, name from restaurants where business_id = '${businessId}') r
    //       on r.postal_code = locations.zipcode
    //   )
    //   select date_format(r.date, '%m-%d') as Day, "case" as category, r.daily_cases as Count from result r
    //   union
    //   select date_format(r.date, '%m-%d') as Day, "death" as category, r.daily_deaths as Count from result r;`
    var query = `
    with targetFips as(
          select l.fips
          from restaurants  r
          join locations l 
          on r.postal_code = l.zipcode
          where business_id = '${businessId}'
      ),
      c1 as (select fips, date from covid where fips in (select fips from targetFips)),
      c2 as (select fips, date from covid where fips in (select fips from targetFips)),
      week as(
          select distinct c1.date as date, c2.date as same_week
          from c1 join c2 on c1.fips = c2.fips
          where date_sub(str_to_date(c1.date, '%Y-%m-%d'), interval 7 day) <= str_to_date(c2.date, '%Y-%m-%d')
          and str_to_date(c1.date, '%Y-%m-%d') >=str_to_date(c2.date, '%Y-%m-%d')
          order by date
      ),
      kinou as (
          select fips, cases, deaths, str_to_date(date, '%Y-%m-%d') - interval 1 day as yesterday from covid
          where fips in (select fips from targetFips)
      ),
      kyou as (
          select date, cases, deaths, fips from covid where fips in (select fips from targetFips)
      ),
      daily as(
          select kyou.date, kinou.cases-kyou.cases as daily_cases, greatest(kinou.deaths-kyou.deaths, 0) as daily_deaths, kyou.fips
          from kyou
          join kinou
          on kyou.date = kinou.yesterday
          and kyou.fips = kinou.fips
      ),
      sevenDays as (
          select d.date, d.daily_cases, d.daily_deaths, d.fips
          from (select * from daily) d
          join (select * from week where date in (select max(date) from week)) w
          on w.same_week = d.date
      )
      select date_format(s.date, '%m-%d') as Date, "Cases" as category, s.daily_cases as Count from sevenDays s
      union
      select date_format(s.date, '%m-%d') as Date, "Deaths" as category, s.daily_deaths as Count from sevenDays s;
      `
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        //console.log("reviewsByBusinessId return result: ", rows);
        res.json(rows);
      }
    });
  };
  


module.exports = {
	reviewsByBusinessId: reviewsByBusinessId,
    tipsByBusinessId: tipsByBusinessId,
    getTop100Categories: getTop100Categories,
    getTop5SafetestStates: getTop5SafetestStates,
    covidInfoByBusinessId:covidInfoByBusinessId,
};
