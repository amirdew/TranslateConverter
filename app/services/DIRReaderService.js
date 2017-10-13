var fs = require('fs');

module.exports = {

    readNotEmptyDir: function (directory, callback) {

        fs.readdir(directory, function (err, items) {

            if (err)
                callback('Error on reading directory: ' + directory, null);
            else if (items.length < 1)
                callback('Directory is empty: '+ directory, null);
            else
                callback(null, items);

        });

    },


    getXMLFileListFromDir: function (directory, callback) {

        this.readNotEmptyDir(directory, function (err, items) {

            var xmlFiles = [];
            var itemsWithXMLExtension = [];
            var parsedItems = 0;

            if (err)
                callback(err, null);
            else {


                for (var i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.split('.').length > 1 && item.split('.')[item.split('.').length - 1].toLowerCase() === 'xml') {
                        itemsWithXMLExtension.push(item);
                    }
                }

                if (itemsWithXMLExtension.length === 0)
                    callback('No xml file founded', null);
                else {

                    itemsWithXMLExtension.forEach(function (itemWithXMLExtension) {

                        fs.lstat(directory + '/' + itemWithXMLExtension, function (err, stats) {

                            parsedItems += 1;

                            if (!err && stats.isFile())
                                xmlFiles.push(itemWithXMLExtension);

                            if (parsedItems === itemsWithXMLExtension.length) {
                                if (xmlFiles.length > 0)
                                    callback(null, xmlFiles);
                                else
                                    callback('No xml file founded', null);
                            }
                        });
                    });


                }


            }
        })


    },


    getValuesDirectories: function (directory, callback) {

        var languages = [];
        var valuesDir = [];
        var parsedValuesDir = 0;

        this.readNotEmptyDir(directory, function (err, items) {

            if (err)
                callback(err, null);
            else {


                for (var i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.startsWith('values')) {
                        valuesDir.push(item);
                    }
                }

                if (valuesDir.length === 0)
                    callback('No values dir founded', null);
                else {

                    valuesDir.forEach(function (valueDirName) {

                        fs.lstat(directory + '/' + valueDirName, function (err, stats) {

                            parsedValuesDir += 1;

                            if (!err && stats.isDirectory())
                                languages.push(valueDirName);

                            if (parsedValuesDir === valuesDir.length) {
                                if (languages.length > 0)
                                    callback(null, languages);
                                else
                                    callback('No values dir founded', null);
                            }
                        });
                    });


                }


            }


        });

    }
};