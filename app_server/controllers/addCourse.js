//Add a new course to the database
module.exports.addCourse = async function(req, res) {

  //course
  let course = req.body.course;
  course = String(course);
  
  //address
  let address = req.body.address;
  address = String(address);
  
  //distance
  let distance = req.body.distance;
  distance = String(distance);
  
  //site
  let site = req.body.site;
  site = String(site);
  
  //INSERT INTO table_name(column1, column2, …)
  //VALUES (value1, value2, …);

  try {

    await db.none('INSERT INTO courses(course, site, address, distance) VALUES ( ${Course}, ${Site}, ${Address}, ${Distance})', {
        Course : course,
        Site : site,
        Address : address,
        Distance : distance
        }
    );

    console.log(course + " " + site + " " + distance);
        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

};