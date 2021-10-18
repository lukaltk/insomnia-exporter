#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs');
const { exportInsomniaToJSON } = require('../src/export.insomnia');

program
  .option('-i, --input <location>', 'Location of ".insomnia" folder')
  .option('-o, --output <location>', 'Location of exporter file')
  .parse(process.argv);

const { input, output } = program.opts();

if(!input) {
  console.log('You must provide ".insomnia" folder');
  process.exit(1);
};

const outputPath = output ? path.join(process.cwd(), output) :  path.join(process.cwd(), 'insomnia.json');

try {
  const json = exportInsomniaToJSON(input);

  fs.writeFileSync(outputPath, json, err => {
    if (err) return console.warn(`Failed to write export file. ${err}`);
  });

  console.log('\n * * * Done! * * *\nYour documentation has been created and it\'s ready to be deployed!');

} catch(error) {
  console.log(error);

} finally {
  process.exit();
}