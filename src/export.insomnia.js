const fs = require('fs');
const yaml = require('js-yaml');
const { dataToIgnore } = require('../config.json');

const EXPORT_FORMAT =  4;
const EXPORTER_VERSION = 1;

const typeNameMapping = {
  "ApiSpec": "api_spec",
  "Environment": "environment",
  "Request": "request",
  "RequestGroup": "request_group",
  "Workspace": "workspace",
  "UnitTest": "unit_test",
  "UnitTestSuite": "unit_test_suite"
};

function isDataToIgnore(data) {
  if (!data.name) return false;
  if (!dataToIgnore[data._type]) return false;

  const name = data.name.toLowerCase();
  return dataToIgnore[data._type].includes(name);
}

function prettyJson(obj) {
  return JSON.stringify(obj, null, 2);
}

function findInsomniaData(insomina_folder_path) {
  const folders = fs.readdirSync(`${insomina_folder_path}`, {encoding: 'utf8'});
  const subFolders = folders.map(folder => [folder, fs.readdirSync(`${insomina_folder_path}/${folder}`, {encoding: 'utf8'})]);
  const data = Object.fromEntries(subFolders);
  if (data.UnitTest) delete data.UnitTest;
  if (data.UnitTestSuite) delete data.UnitTestSuite;
  return data;
}

function parseInsomniaData(insomina_folder_path, data) {
  const parsedData = [];
  for (const files in data) {
    data[files].forEach(file => {
      const exportFile = yaml.load(fs.readFileSync(`${insomina_folder_path}/${files}/${file}`, {encoding: 'utf8'}));
      exportFile._type = typeNameMapping[exportFile.type];
      delete exportFile.type;
      parsedData.push(exportFile);
    });
  }
  return parsedData;
}

function filterInsomniaData(data) {

  const idToFilter = [];
  const idToSearch = [];

  data.forEach(element => {
    if (isDataToIgnore(element)) {
      idToFilter.push(element._id);
      idToSearch.push(element._id);
    }
  });

  while (idToSearch.length > 0) {
    const id = idToSearch.pop();

    const childIds = data.filter(element => {
      if (element.parentId === id) return true;
    }).map(element => element._id);

    idToFilter.push(...childIds);
    idToSearch.push(...childIds);
  }

  const filteredData = data.filter(element => {
    if (!idToFilter.includes(element._id)) return true;
  });

  return filteredData;

}

module.exports = {
  exportInsomniaToJSON(insomina_folder_path) {
    const data = findInsomniaData(insomina_folder_path);
    const parsedData = parseInsomniaData(insomina_folder_path, data);
    const dataToExport = filterInsomniaData(parsedData);

    const exportData = {
      _type: 'export',
      __export_format: EXPORT_FORMAT,
      __export_date: new Date(),
      __export_source: `export.insomnia:v${EXPORTER_VERSION}`,
      resources: dataToExport,
    };

    const exportJson = prettyJson(exportData);
    
    return exportJson;
  }
}