//Import
var splits = require('./splits');



/* GET upload page */
module.exports.upload = async function(req, res) {

  let courseList;

  //Populate the course option list
  try {

        courseList = await db.query('SELECT course FROM courses');
        //console.log(courseList);
        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  //Show page
  try {

    res.render('upload_results', { 

      courseList : courseList

    });

  } catch (e) {

    console.log("Error: " + e);

  }
  

};

/*
* Uploads the data from the Upload CSV Data option
*/
module.exports.upload_post = async function(req, res) {

  let distance = "";

  //Course
  let course = req.body.course;
  course = String(course);
  console.log(course);

  //Date
  let raceDate = req.body.raceDate;
  raceDate = String(raceDate);

  console.log(raceDate);

  //Content
  let content = req.body.CSVOutput;
  content = String(content);
  //console.log(content);

  let contentArr = content.split(",");

  //Calculate Splits
  for (var i=0; i < contentArr.length-1; i+=6) {
    
    //console.log(contentArr[i]);
    //2nd mile
    let beginTime = contentArr[i + 2];
    let endTime = contentArr[i + 3];
    contentArr[i + 3] = splits.determineSplits(beginTime, endTime);
    
    //3rd mile
    beginTime = endTime;
    endTime = contentArr[i + 4];
    contentArr[i + 4] = splits.determineSplits(beginTime, endTime);

    //Add the final time as a new element in the array
    contentArr.splice(i + 5, 0, endTime);
        
  }

  for (var i=0; i < contentArr.length; i++) {
    console.log(contentArr[i]);
  }


  //Populate the distance option list
  try {

    distance = await db.query('SELECT distance FROM courses WHERE course = ${Course}', {
      Course : course
      }
    
    );

        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  //Convert the distance object to a String
  distance = JSON.stringify(distance[0]);
  distance = distance.substring(distance.length-4,distance.length-2);
  //console.log(distance);

  //Upload to the races table
  try {

    for (let i = 0; i < contentArr.length-1; i+=6) {
      await db.none('INSERT INTO races(first_name, last_name, course, race_date, mile_split, two_split, three_split, final_split, distance) VALUES ( ${First_Name}, ${Last_Name}, ${Course}, ${Race_Date}, ${Mile_Split}, ${Two_Split}, ${Three_Split}, ${Final_Split}, ${Distance} )', {
          First_Name : contentArr[i],
          Last_Name : contentArr[i + 1],
          Course : course,
          Race_Date : raceDate,
          Mile_Split : contentArr[i + 2],
          Two_Split : contentArr[i + 3],
          Three_Split : contentArr[i + 4],
          Final_Split : contentArr[i + 5],
          Distance : distance
          }
      );
    }

        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }
  

  //res.render('upload_results', { });

};

/*
* Uploads the data from the Athletic.net Data option
*/
module.exports.athleticnet_post = async function(req, res) {

  let distance = "";

  //Course
  let course = req.body.course;
  course = String(course);
  console.log(course);

  //Date
  let raceDate = req.body.raceDate;
  raceDate = String(raceDate);

  console.log(raceDate);
  
  //Gender
  let gender = req.body.gender;
  gender = String(gender);
  console.log("Gender " + gender)

  //Content
  let content = req.body.CSVOutputAN;
  content = String(content);
  //console.log("Athletic" + content);

  let contentArr = content.split(",");
  console.log(contentArr);

  

  //Populate the distance option list
  try {

    distance = await db.query('SELECT distance FROM courses WHERE course = ${Course}', {
      Course : course
      }
    
    );

        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  //Convert the distance object to a String
  distance = JSON.stringify(distance[0]);
  distance = distance.substring(distance.length-4,distance.length-2);
  //console.log(distance);

  


  //Upload to the races table
  try {
    
    for (let i = 0; i < contentArr.length-1; i+=6) {

      //substring first name and last name
      let Name = contentArr[i+2];
      //console.log(Name);
      let space = Name.indexOf(" ");
      let firstName = Name.substring(0,space);
      //console.log(firstName);
      let lastName = Name.substring(space+1);
      //console.log(lastName);

      
      await db.none('INSERT INTO races(first_name, last_name, gender, course, race_date, final_split, distance) VALUES ( ${First_Name}, ${Last_Name}, ${Gender}, ${Course}, ${Race_Date}, ${Final_Split}, ${Distance} )', {
          First_Name : firstName,
          Last_Name : lastName,
          Gender : gender,
          Course : course,
          Race_Date : raceDate,
          Final_Split : contentArr[i + 4],
          Distance : distance
          }
      
      );
      
    }

    //break;
    

        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  

  res.render('home', { });

};

/* 
* Update Personnel Records
*/
module.exports.prUpdate = async function(req, res) {

  let prArray = [];
  let prCourse = [];
  let runnerArray = [];
  

  /*
  * RUNNER QUERY COUNT
  * Query for all race results for the last 4 years
  * Determine how many runners
  * distinct on first_name, last_name, and course
  */
  try {
  
      runnerQuery = await db.query('SELECT distinct first_name, last_name, course FROM races WHERE now()::date > now()::date - 1460 ORDER BY first_name DESC, last_name DESC, course DESC');
      
      /*
      * Converts the query to a JSON string
      * Parses the string to an array
      */
      let stringRunnerResults = JSON.stringify(runnerQuery);
      runnerArray = JSON.parse(stringRunnerResults); 
        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  /*
  * COURSE PR
  * Description: Query race results for specific 
  * runners and course based upon previous query to 
  * determine PR on a course
  * Updates 'races' table 'pr_course' 
  */
  try {

      for (var i = 0; i < runnerArray.length; i++) {
     
        //Reset all values
        raceResults = [];
        prCourse = [];

        raceResults = await db.query('SELECT id, first_name, last_name, course, final_split FROM races WHERE now()::date > now()::date - 1460 AND first_name = ${First_Name} AND last_name = ${Last_Name} AND course = ${Course} ORDER BY first_name DESC, last_name DESC, course DESC;', {
            First_Name : runnerArray[i].first_name,
            Last_Name : runnerArray[i].last_name,
            Course : runnerArray[i].course
          }
          
        );

        //console.log(raceResults);

        for(var j = 0; j < raceResults.length; j++) {
          /*
          * Converts the query to a JSON string
          * Parses the string to an array
          */
          let stringRaceResults = JSON.stringify(raceResults);
          prArray = JSON.parse(stringRaceResults); 

          //Final split per person for a course
          let prString = "";

          if (prArray[j].final_split == undefined) {
            prString = 0;
          } else {
            prString = prArray[j].final_split;
            prString = prString.substring(0,5);
            prCourse.push(splits.stringToTime(prString));
          }
          
          //Organize by highest to lowest
          prCourse.sort();

          //console.log(prCourse);
        
        }

        //Update 'races' table with pr_course
        await db.query('UPDATE races SET pr_course = true WHERE final_split LIKE ${Final_Split} AND first_name = ${First_Name} AND last_name = ${Last_Name} AND course = ${Course}', {
            Final_Split : prCourse[0] + '%',
            First_Name : runnerArray[i].first_name,
            Last_Name : runnerArray[i].last_name,
            Course : runnerArray[i].course
          }
        );

  
      }

      
        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  /*
  * BEST PR OVERALL
  * Description: Query race results for specific 
  * runners to update 'pr_overall' column in 'races'
  */
  try {

      for (var i = 0; i < runnerArray.length; i++) {
     
        //Reset all values
        raceResults = [];
        prCourse = [];

        raceResults = await db.query('SELECT id, first_name, last_name, course, final_split FROM races WHERE now()::date > now()::date - 1460 AND first_name = ${First_Name} AND last_name = ${Last_Name} ORDER BY first_name DESC, last_name DESC, course DESC;', {
            First_Name : runnerArray[i].first_name,
            Last_Name : runnerArray[i].last_name
          }
          
        );

        //console.log(raceResults);

        for(var j = 0; j < raceResults.length; j++) {
          /*
          * Converts the query to a JSON string
          * Parses the string to an array
          */
          let stringRaceResults = JSON.stringify(raceResults);
          prArray = JSON.parse(stringRaceResults); 

          //Final split per person for a course
          let prString = "";

          if (prArray[j].final_split == undefined) {
            prString = 0;
          } else {
            prString = prArray[j].final_split;
            prString = prString.substring(0,5);
            prCourse.push(splits.stringToTime(prString));
          }
          
          //Organize by highest to lowest
          prCourse.sort();

          //console.log(prCourse);
        
        }

        //Update 'races' table with pr_course
        await db.query('UPDATE races SET pr_overall = true WHERE final_split LIKE ${Final_Split} AND first_name = ${First_Name} AND last_name = ${Last_Name}', {
            Final_Split : prCourse[0] + '%',
            First_Name : runnerArray[i].first_name,
            Last_Name : runnerArray[i].last_name
          }
        );

  
      }

      
        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }


  
  try {



  } catch (e) {

    console.log("Error: " + e);

  }
  

};

