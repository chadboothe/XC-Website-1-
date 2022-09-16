/* GET meet info page */
module.exports.meet = async function(req, res) {

  let rows;

  //Populate the meet information
  try {

    rows = await db.query('SELECT m.race_id, c.course, c.site, m.race_date, c.address, m.bus_depart, m.document, m.map FROM meet_info m , courses c WHERE m.race_id = c.id ORDER BY m.race_date asc;');
        
  } catch(e) {
    
    console.log("Error: " + e);
  
  }

  try {
    
    res.render('meet_info', { 
      
      results: rows,


    });

  } catch (e) {

    console.log("Error: " + e);

  }
  
  //res.render('meet_info', { });

}