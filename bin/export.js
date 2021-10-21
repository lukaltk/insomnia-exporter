#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer')
const chalk = require('chalk');
const { exportInsomniaToJSON } = require('../src/export.insomnia');

async function promptForMissingOptions(options) {
  
  const questions = [];

  if(!options.input) {
    questions.push({
      type: 'input',
      name: 'input',
      message: 'Please enter the path of ' + chalk.blue.bold('.insomnia') + ' directory:\n'
    });

    if(!options.output) {
      questions.push({
        type: 'input',
        name: 'output',
        message: 'Please enter the'+ 
          chalk.blue.bold(' relative path ') + 
          'of the file to export or press' + 
          chalk.blue.bold(' Enter ') + 
          'to use the current path:\n',
      });
    }
  }

  const answers = await inquirer.prompt(questions);
  return {
    input: options.input || answers.input,
    output: options.output || answers.output
  }
}

function configureExporter(configPath) {
  return JSON.parse(fs.readFileSync(configPath));
}

program
  .option('-i, --input <path>', 'Location of' + chalk.blue.bold(' .insomnia ') + 'directory')
  .option('-o, --output <path>', 'Where to save the' + chalk.blue.bold(' file') + '(defaults to current working directory)')
  .option('-c, --config <path>', 'Location of config' + chalk.blue.bold(' file ') + '(JSON)')
  .action(async options => {

    const answers = await promptForMissingOptions(options);
    const config = {};

    if(!answers.input) {
      console.log('You must provide' + chalk.bold.red(' .insomnia ') + 'folder');
      process.exit(1);
    };

    const outputPath = answers.output ? path.join(process.cwd(), answers.output) :  path.join(process.cwd(), 'insomnia.json');

    if(options.config) {
      try {
        Object.assign(config, configureExporter(options.config));      
      } catch (error) {
        console.log(error);
        console.log('Error Message: ' +
          chalk.bgRed('It was not possible to configure the exporter, so it remained with the default settings')
        );
      }
    }

    try {
      const exportedJSON = exportInsomniaToJSON(answers.input, config);
    
      fs.writeFileSync(outputPath, exportedJSON, err => {
        if (err) return console.warn(`Failed to write export file. ${err}`);
      });
    
      console.log('\n * * *' + chalk.bold.greenBright(' Done! ')  + '* * *\n' +
        '===================================================================\n' +
        'Your documentation has been created and it\'s ready to be deployed!\n' +
        '===================================================================\n'
      );
    
    } catch(error) {
      console.log(error);
      process.exit(1);
    }

  })
  .parse(process.argv);
