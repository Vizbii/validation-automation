$(document).ready(function(){
    $('#formButton').click(function(){
        var aws_url_root = 'https://s3.amazonaws.com/survey-gizmo-emoji-study';

        var collectionName = $('#collectionName').val().toLowerCase();
        var constructs = $('#constructList').val();

        //turn constructs string to constructList array
        var constructList = constructs.trim().split(/\s*,\s*/);
        var constructObjects = [];

        for (i=0; i < constructList.length; i++){
            var construct = {
                "construct": capitalizeFirstLetter(constructList[i]),
                "1.0_image_url": aws_url_root + '/' + collectionName + '/' + '1.0' + '/' + constructList[i] + '-1.0.png',
                "0.2_image_url": aws_url_root + '/' + collectionName + '/' + '0.2' + '/' + constructList[i] + '-0.2.png'
            };
            constructObjects.push(construct);
        }

        var exportLoad = 'var constructObjects = ' + JSON.stringify(constructObjects);
        exportToJsonFile(exportLoad);
        // exportToJsonFile(constructObjects);
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    function exportToJsonFile(jsonData) {
        // let dataStr = JSON.stringify(jsonData);
        // let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonData);

        let exportFileDefaultName = 'construct-file.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
});
