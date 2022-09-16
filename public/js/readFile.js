let rows = "";
let data = []; //1d array
let matrix = []; //2d array

/*
* UPLOAD FROM CSV
* Uploads from a CSV file with splits
* 
*/
function csvToArray(str, delimiter = ",") {
  console.log("Hello");
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  rows = str.slice(str.indexOf("\n") + 1).split("\n");
  //console.log(rows);
  //document.getElementById("CSVOutput").value = rows;

  return rows;

}

/*
* ATHLETIC.NET DATA
* Copied and pasted from Athletic.net
* 
*/

function csvToArrayAN(delimiter = " ") {

  //Takes the copied text and saves it to a string
  //Then removes all \n from the text
  str = document.getElementById("txtInput").value;
  str = str.replace(/(\r\n|\n|\r)/gm, "");

  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  //const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  data = str.slice(str.indexOf("\t") + 1).split("\t");

  console.log(data);

  /*
  //Make a 2d array from a 1d array
  while (data.length > 0) {
    matrix.push(data.splice(0, 5));
  }

  //Clear out the place number at the end of the School
  for (let i = 0; i < matrix.length; i++) {

    for (let j = 4; j < matrix[i].length; j++) {

      let temp = matrix[i][j];
      let nbr = temp.lastIndexOf(".")
      if (i < 9) {
        matrix[i][j] = temp.slice(0, nbr - 1);
      } else if (i < matrix.length - 1) {
        matrix[i][j] = temp.slice(0, nbr - 2);
      }
      console.log(matrix[i][j]);
    }
  }

  //console.log(rows);
  //document.getElementById("CSVOutput").value = rows;
  return matrix;
  //document.getElementById("CSVOutput").innerHTML = matrix;
  */

  return data;

}