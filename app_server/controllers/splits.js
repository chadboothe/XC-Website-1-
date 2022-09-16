let splitOne = 0;
let splitTwo = 0;

/*
* SPLIT CALCULATOR
* Description: Determines the user splits
* called from 'upload_results.js' file
*/
module.exports = {
  
  determineSplits: function (beginTime, endTime) {

    //beginTime into seconds
    beginTime = beginTime.trim();
    var colon = beginTime.indexOf(":");
    var secondsOne = parseInt(beginTime.substring(0, colon));
    secondsOne = (secondsOne * 60) + parseInt(beginTime.substring(colon + 1, beginTime.length));
    //console.log(secondsOne);

    //endTime into seconds
    endTime = endTime.trim();
    var colon = endTime.indexOf(":");
    var secondsTwo = parseInt(endTime.substring(0, colon));
    secondsTwo = (secondsTwo * 60) + parseInt(endTime.substring(colon + 1, endTime.length));
    //console.log(secondsTwo);

    //beginTime and endTime split time
    splitOne = secondsTwo - secondsOne;
    //console.log(splitOne);

    var splitOneMinute = Math.floor(splitOne / 60);
    if (splitOne % 60 == 0) {

      splitOne = splitOneMinute + ":00";

    } else if (splitOne % 60 < 10) {

      splitOne = splitOneMinute + ":0" + (splitOne % 60);
    
    } else {

      splitOne = splitOneMinute + ":" + (splitOne % 60);

    }

    //console.log(splitOne);

    return splitOne;


  },

  /*
  * PR TIME TRIMMER
  * Description: Trims the 'final_split' time and
  * returns the value to the 'upload_results.js' file
  */
  stringToTime: function (beginTime) {

    //beginTime into seconds
    beginTime = beginTime.trim();
    var colon = beginTime.indexOf(":");
    var secondsOne = parseInt(beginTime.substring(0, colon));
    secondsOne = (secondsOne * 60) + parseInt(beginTime.substring(colon + 1, beginTime.length));
    //console.log(secondsOne);

    return beginTime;
    
  }

}