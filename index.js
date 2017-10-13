#!/usr/bin/env node
var program = require('commander');
var chalk = require('chalk');
var app = require('./app/bin');


program
    .arguments('<directory>')
    .option('-d, --destination <destination> [optional]', 'The destination dir name or path - if not provided create new dir on source dir')
    .option('-s, --sensitive-duplicate <sensitiveDuplicate> [optional]', 'If you use this option when found duplicate key in one language show an error')
    .option('-r, --replace-existing <replaceExisting> [optional]', 'If you use this option results with replaced on existing files otherwise new dir created')
    .action(function (directory) {

        app.changeLocalStringFormatFromAndroidToUnity(
            directory,
            program.destination,
            !program.sensitiveDuplicate,
            program.replaceExisting,
            function (err, data) {
                if(err)
                    console.log(chalk.bold.red('Error: ') + err);
                else
                    console.log(chalk.bold.green('Language converted: ') + data.languageName + '('+ data.filePath +')');
            }
        )
    })

    .description("pass directory that have values directories, like: your-android-project/app/src/main/res ")
    .parse(process.argv);