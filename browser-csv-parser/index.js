function runPapaParse(files) {
    // console.log(files);
    var reactionRecords = [];
    var headers = ["respId", /*"submitTime",*/ "marketCubeId", "zip", "age", "gender", "ethnicity", "targetId", "targetConstruct", "targetIntensity", "constructImage", "constructImagePosition", "foilImage", "foilConstruct", "foilIntensity", "foilImagePosition", "userSelection", "correct", "answerBreakdown", "numResponses", "percentCorrect", "count"];
    console.log(headers.length);
    reactionRecords.push(headers);
    for (i = 0; i < files.length; i++) {
        console.log("i is " + files[i]);
        var results = Papa.parse(files[i], {
            header: true,
            complete: function(results) {
                console.log("Finished:", results.data);

                //all records in the csv
                var records = results.data;

                for (j = 0; j < records.length; j++) {

                    var respId = records[j]["Response ID"];
                    // var submitTime = records[j]["Time Started"];
                    var zip = records[j]["URL Variable: zip"] || 'undefined';
                    var age = records[j]["URL Variable: age"] || 'undefined';
                    var gender = records[j]["URL Variable: gender"] || 'undefined';
                    // var ethnicity = records[j]["URL Variable: ethnicity_ii"];
                    var ethnicity = records[j]["URL Variable: ethnicity_ii"] || 'undefined';

                    var marketCubeId = records[j]["URL Variable: id"]|| 'undefined';
                    var numComplete = records[j]["Number Questions Answered"];
                    var percentCorrect = records[j]["Percentage Correct"];
                    var reactions = records[j].reactions;

                    // ensure that reactions is not an empty string
                    if (reactions) {
                        console.log("NOT empty string");
                        var rxnRec = expandReactions(reactions);

                        for (t = 0; t < rxnRec.length; t++) {

                            var rxnObj = {
                                "respId": respId,
                                // "submitTime": submitTime,
                                "marketCubeId": marketCubeId,
                                "zip": zip,
                                "age": age,
                                "gender": gender,
                                "ethnicity": ethnicity,
                                "targetId": rxnRec[t].target_id,
                                "targetConstruct": rxnRec[t].target_construct,
                                "targetIntensity": rxnRec[t].target_intensity,
                                "constructImage": rxnRec[t].construct_image,
                                "constructImagePosition": rxnRec[t].construct_image_position,
                                "foilImage": rxnRec[t].foil_image,
                                "foilConstruct": rxnRec[t].foil_construct,
                                "foilIntensity": rxnRec[t].foil_intensity,
                                "foilImagePosition": rxnRec[t].foil_image_position,
                                "userSelection": rxnRec[t].user_selection,
                                "correct": rxnRec[t].correct,
                                "answerBreakdown": rxnRec[t].answer_breakdown,
                                "numResponses": numComplete,
                                "percentCorrect": percentCorrect,
                                "count": rxnRec[t].count
                            }

                            reactionRecords.push(rxnObj);
                        }
                    } else {
                        console.log("reactions is an empty string");
                    }
                }

                // stringified version
                var jsonString = JSON.stringify(reactionRecords);
                var csvString = ConvertToCSV(jsonString);
                exportToCsvFile(csvString);

            }
        });
    }
}


function expandReactions(reaction) {
    var jsonReaction = JSON.parse(reaction);
    var count = 0;
    var allreactions = [];
    for (i = 0; i < jsonReaction.length; i++) {
        count++;
        data = jsonReaction[i];
        var correct;
        var answerBreakdown;

        var tiArray = data.target.CONSTRUCT_IMAGE.split("_");
        var targetIntensity = tiArray[1];
        var foilArray = data.target.FOIL_IMAGE.split("_");
        var foilConstruct = foilArray[0];
        var foilIntensity = foilArray[1];

        if (data.target.USER_SELECTION === data.target.CONSTRUCT_IMAGE_POSITION) {
            correct = 1;
            answerBreakdown = 1;
        } else if (data.target.USER_SELECTION != data.target.CONSTRUCT_IMAGE_POSITION && data.target.USER_SELECTION === 1) {
            correct = 0;
            answerBreakdown = 2;
        } else if (data.target.USER_SELECTION != data.target.CONSTRUCT_IMAGE_POSITION && data.target.USER_SELECTION != 1) {
            correct = 0;
            answerBreakdown = 0;
        };

        var reactionRecord = {
            "target_id": data.id,
            "target_construct": data.target.CONSTRUCT,
            "target_intensity": targetIntensity,
            "construct_image": data.target.CONSTRUCT_IMAGE,
            "construct_image_position": data.target.CONSTRUCT_IMAGE_POSITION,
            "foil_image": data.target.FOIL_IMAGE,
            "foil_construct": foilConstruct,
            "foil_intensity": foilIntensity,
            "foil_image_position": data.target.FOIL_IMAGE_POSITION,
            "user_selection": data.target.USER_SELECTION,
            "correct": correct,
            "answer_breakdown": answerBreakdown,
            "count": count
        };

        allreactions.push(reactionRecord);
    }
    return allreactions;
};

// JSON to CSV Converter
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    // return str;
    return encodeURIComponent(str);
}

function exportToCsvFile(csvStr) {
    //let csvStr = parseJSONToCSVStr(jsonData);
    let dataUri = 'data:text/csv;charset=utf-8,' + csvStr;

    let exportFileDefaultName = 'validation-data.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
