var fs = require('fs');

module.exports = {

    writeLangFileFromObject: function (langName, path, data, callback) {

        var rawFileText = '';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                rawFileText += key + " = " + data[key] + '\n';
            }
        }


        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }


        fs.writeFile(path + '/' + langName + '.txt', rawFileText, function (err) {


            if (err)
                callback(err, null);

            // success, the file was saved
            callback(null, true);
        });



    }
};