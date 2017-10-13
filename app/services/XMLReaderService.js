var parser = require('xml2json');
var fs = require('fs');

module.exports = {

    readXMLFilesAndMergeAsKeyValue: function (baseDir, xmlFileNames, ignoreDuplicateKeys, callback) {

        this.parseXMLFiles(baseDir, xmlFileNames, function (err, parsedFiles) {

            if (err)
                callback(err, null);
            else {

                var error = false;
                var result = {};

                //merge files
                parsedFiles.forEach(function (file) {

                    if (error)
                        return;

                    for (var key in file.data) {
                        if (file.data.hasOwnProperty(key)) {

                            var value = file.data[key];

                            //change formatted strings
                            var index = 0;
                            value = value.replace(/%(?:\d+\$)?[+-]?(?:[ 0]|'.{1})?-?\d*(?:\.\d+)?[bcdeEufFgGosxX]/g, function () {
                                return '{' + (index++) +'}';
                            });
                            //////


                            if (result[key] === undefined)
                                result[key] = value;

                            else if (!ignoreDuplicateKeys) {
                                error = true;
                                const path = baseDir + '/' + file.name;
                                callback('Duplicate key(' + key + ') found when parsing file: ' + path, null);
                            }
                        }
                    }
                });

                if (!error)
                    callback(null, result);
            }

        })
    },


    parseXMLFiles: function (baseDir, xmlFileNames, callback) {

        var parsedFiles = [];
        var error = false;

        xmlFileNames.forEach(function (fileName) {

            if (error)
                return;

            const path = baseDir + '/' + fileName;
            fs.readFile(path, function (err, data) {

                if (error)
                    return;

                if (err) {
                    error = true;
                    callback('Error on reading file: ' + path, null);
                }
                else {

                    var json = JSON.parse(parser.toJson(data));
                    if (!json || !json.resources) {
                        error = true;
                        callback('Error on parsing file: ' + path, null);
                    }
                    else if(json.resources.string){
                        try {
                            var fileData = {};
                            json.resources.string.forEach(function (stringData) {
                                if (stringData.name && stringData.$t)
                                    fileData[stringData.name] = stringData.$t
                            });
                            parsedFiles.push({
                                name: fileName,
                                data: fileData
                            })
                        }
                        catch (e) {
                            error = true;
                            callback('Error on parsing file: ' + path + ' ' + e, null);
                        }
                    }
                }

                if (parsedFiles.length === xmlFileNames.length && !error)
                    callback(null, parsedFiles);
            });
        });


    }

};