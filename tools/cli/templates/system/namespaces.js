/**
 * Share atomic concepts with Webpack, Gulp, Pattern Lab, Drupal, etc
 */

const path = require('path');

const namespaceMaker = require('../../tools/namespace-maker');

const sets = {
  {{ dashCase name}}_protons: path.resolve(__dirname, '_patterns', '00-protons'),
  {{ dashCase name}}_atoms: path.resolve(__dirname, '_patterns', '01-atoms'),
  {{ dashCase name}}_molecules: path.resolve(__dirname, '_patterns', '02-molecules'),
  {{ dashCase name}}_organisms: path.resolve(__dirname, '_patterns', '03-organisms'),
  {{ dashCase name}}_templates: path.resolve(__dirname, '_patterns', '04-templates'),
  {{ dashCase name}}_pages: path.resolve(__dirname, '_patterns', '05-pages'),
};

const namespaces = namespaceMaker(path.resolve(__dirname, '_patterns'), sets);

module.exports = {
  sets,
  namespaces,
};
