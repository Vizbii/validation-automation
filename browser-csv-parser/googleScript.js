function transferReactionData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var dataSheet = sheets[0];
  // var expDataSheet = sheets[1];
  var sheet = ss.getActiveSheet();

  function f(range)
  {
    var r = dataSheet.getRange(range);
    var aValues = r.getValues();
    return aValues;
  }

  var allData = f("A2:L259");
  Logger.log(allData.length);
   var expDataSheet = ss.insertSheet("Expanded Data", 1);
   expDataSheet.appendRow(["respID", "submitTime", "targetId", "targetConstruct", "targetIntensity", "constructImage", "constructImagePosition", "foilImage", "foilConstruct", "foilIntensity", "foilImagePosition", "userSelection", "correct?", "answerBreakdown", "numResponses","percentCorrect", "count"]);

  for (j = 0; j < allData.length; j++) {
    var respId = allData[j][0];
    var submitTime = allData[j][2];
    // var zip = allData[j][8];
    var ethnicity, gender, zip, age, marketCubeID;
    var numComplete = allData[j][9];
    var percentCorrect = allData[j][11];
    var responseJSON = allData[j][8];


    var dataAll = JSON.parse(responseJSON);
    var dataSet = dataAll;
    var rows = [],
      data;
    var count = 0;
    var type;

    for (i = 0; i < dataSet.length; i++) {
      count++;
      data = dataSet[i];
      var correct;
      var answerBreakdown;

      var tiArray = data.target.CONSTRUCT_IMAGE.split("_");
      var targetIntensity = tiArray[1];
      var foilArray = data.target.FOIL_IMAGE.split("_");
      var foilConstruct = foilArray[0];
      var foilIntensity = foilArray[1];

      if(data.target.USER_SELECTION === data.target.CONSTRUCT_IMAGE_POSITION){
        correct = 1;
        answerBreakdown = 1;
      } else if (data.target.USER_SELECTION != data.target.CONSTRUCT_IMAGE_POSITION && data.target.USER_SELECTION === 1){
        correct = 0;
        answerBreakdown = 2;
      } else if (data.target.USER_SELECTION != data.target.CONSTRUCT_IMAGE_POSITION && data.target.USER_SELECTION != 1){
        correct = 0;
        answerBreakdown = 0;
      };


      expDataSheet.appendRow([respId, submitTime, data.id, data.target.CONSTRUCT, targetIntensity, data.target.CONSTRUCT_IMAGE, data.target.CONSTRUCT_IMAGE_POSITION, data.target.FOIL_IMAGE, foilConstruct, foilIntensity, data.target.FOIL_IMAGE_POSITION, data.target.USER_SELECTION, correct, answerBreakdown, numComplete, percentCorrect, count]);
    }

  }

}
