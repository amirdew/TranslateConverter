var DIRReader = require('./services/DIRReaderService');
var XMLReader = require('./services/XMLReaderService');
var LanguageHelper = require('./helpers/LanguageHelper');
var FileWriter = require('./services/FileWriterService');
var fs = require('fs');


module.exports = {


    /*
     * main method that get properties and pass result in callback
     *
     */
    changeLocalStringFormatFromAndroidToUnity: function (directory,
                                                         destination,
                                                         ignoreDuplicate,
                                                         replaceExisting,
                                                         callback) {

        var destinationPath = this._getDestinationPath(directory, destination, replaceExisting);

        DIRReader.getValuesDirectories(directory, function (err, valuesDirectories) {

            if (err)
                callback(err, null);
            else {
                valuesDirectories.forEach(function (valuesDirectory) {

                    const langValueDirectoryPath = directory + '/' + valuesDirectory;
                    const langName = LanguageHelper.getLanguageNameByValuesDirectoryName(valuesDirectory);

                    DIRReader.getXMLFileListFromDir(langValueDirectoryPath, function (err, files) {

                        if (err)
                            callback(err, null);
                        else

                            XMLReader.readXMLFilesAndMergeAsKeyValue(langValueDirectoryPath, files, ignoreDuplicate, function (err, singleFileData) {

                                if (err)
                                    callback(err, null);
                                else {

                                    FileWriter.writeLangFileFromObject(langName, destinationPath, singleFileData, function (err, result) {

                                        if (err)
                                            callback(err, null);
                                        else {
                                            callback(null, {
                                                languageName: langName,
                                                filePath: destinationPath + '/' + langName + '.txt'
                                            });
                                        }

                                    });

                                }
                            })

                    });
                });

            }


        });
    },



    /*
     * private method for calculating destination path
     *
     */
    _getDestinationPath: function (directory, destination, replaceExisting) {

        var destinationPath = directory + '/output';

        if (destination) {
            if (destination.startsWith('/'))
                destinationPath = destination;
            else
                destinationPath = directory + '/' + destination;
        }


        if (!replaceExisting) {
            var finalPath = destinationPath;
            var counter = 1;
            while (fs.existsSync(finalPath)) {
                finalPath = destinationPath + '-' + counter;
                counter++;
            }
            destinationPath = finalPath;
        }

        return destinationPath;
    }


};