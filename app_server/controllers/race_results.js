

/* GET race results page */
module.exports.races = async function(req, res) {

  let perPage = 10;
  let page = req.params.page || 1;
  let count = 0;
  
  let rows;
  let text;
  let values;
  let courseList;
  let first_name = req.body.first_name;
  first_name = String(first_name);
  let last_name = req.body.last_name;
  last_name = String(last_name);
  let gender = req.body.gender;
  gender = String(gender);
  let course = req.body.course;
  course = String(course);
  let race_date = req.body.race_date;
  race_date = String(race_date);

  console.log("Gender " + gender);

  //Populate the course option list
  try {

    courseList = await db.query('SELECT course FROM courses');
        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  /*
   * Determines if a field is blank
   * Post: Returns true if blank
  */
  let boolFirstName = !(first_name == "undefined" || first_name == "");
  
  let boolLastName = !(last_name == "undefined" || last_name == "");

  let boolCourse = !(course == "undefined" || course == "");

  let boolDate = !(race_date == "undefined" || race_date == "");

  //Default Gender
  if (gender == "undefined" || gender == "") {
    gender = "M";
  }

  /*
  * The following is the search criteria for the search query
  */
  try {

    //first_name search critera
    if(boolFirstName & !(boolLastName) & !(boolCourse) & !(boolDate)) {
      
      rows = await db.query('SELECT * FROM races WHERE first_name = ${value} ORDER BY races.final_split', {
        value : first_name
      });
    
    //last_name search criteria
    } else if(!(boolFirstName) & boolLastName & !(boolCourse) & !(boolDate)) {

       rows = await db.query('SELECT * FROM races WHERE last_name = ${value} ORDER BY races.final_split', 
        { value : last_name }
      );
    
      
    //course and gender search criteria
    } else if(!(boolFirstName) & !(boolLastName) & boolCourse & !(boolDate) ) {

      rows = await db.query('SELECT * FROM races WHERE course = ${value} and gender = ${Gender} ORDER BY races.final_split', {
        value : course,
        Gender : gender
        }
      );
    
    //race_date search criteria
    } else if(!(boolFirstName) & !(boolLastName) & !(boolCourse) & boolDate ) {

      rows = await db.query('SELECT * FROM races WHERE race_date = ${value} ORDER BY races.final_split', {
        value : race_date
        }
      );
    
    //first name & last name
    } else if(boolFirstName & boolLastName & !(boolCourse) & !(boolDate)) {

      rows = await db.query('SELECT * FROM races WHERE first_name = ${first} AND last_name = ${last} ORDER BY races.final_split', {
        first : first_name,
        last : last_name
        }
      );
    
    //first_name + last_name + course
    } else if(boolFirstName & boolLastName & boolCourse & !(boolDate)) {

      rows = await db.query('SELECT * FROM races WHERE first_name = ${first} AND last_name = ${last} AND course = ${course} ORDER BY races.final_split', {
        first : first_name,
        last : last_name,
        course : course
        }
      );
    
    //first_name + last_name + course + race_date
    } else if(boolFirstName & boolLastName & boolCourse & boolDate) {


      rows = await db.query('SELECT * FROM races WHERE first_name = ${first} AND last_name = ${last} AND course = ${course} AND race_date = ${date} ORDER BY races.final_split', {
        first : first_name,
        last : last_name,
        course : course,
        date : race_date
        }
      );
    
    //course + race_date
    } else if(!(boolFirstName) & !(boolLastName) & boolCourse & boolDate) {

      rows = await db.query('SELECT * FROM races WHERE course = ${course} AND race_date = ${date} ORDER BY races.final_split', {
        course : course,
        date : race_date
        }
      );
    
    //last_name + course + race_date
    } else if(!(boolFirstName) & boolLastName & boolCourse & boolDate) {


      rows = await db.query('SELECT * FROM races WHERE last_name = ${last} AND course = ${course} AND race_date = ${date} ORDER BY races.final_split', {
        last : last_name,
        course : course,
        date : race_date
        }
      );

    } else {

       rows = await db.query('SELECT * FROM races ORDER BY races.final_split LIMIT 100');

    }

  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  //How many rows are being returned
  for (var i = 0; i < rows.length; i++) {
    count++;
  }


  try {
    
    res.render('race_results', { 
      
      results: rows,
      courseList : courseList,
      current: page,
      pages: Math.ceil(count / perPage)

    });

  } catch (e) {

    console.log("Error: " + e);

  }
};





  
