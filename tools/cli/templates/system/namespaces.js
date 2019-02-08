/**
 * Share atomic concepts with Webpack, Gulp, Pattern Lab, Drupal, etc
 */

const path = require('path');

const namespaceMaker = require('../../tools/namespace-maker');

const sets = {
  {{ snakeCase name}}_protons: path.resolve(__dirname, '_patterns', '00-protons'),
  {{ snakeCase name}}_atoms: path.resolve(__dirname, '_patterns', '01-atoms'),
  {{ snakeCase name}}_organisms: path.resolve(__dirname, '_patterns', '03-organisms'),
  {{ snakeCase name}}_templates: path.resolve(__dirname, '_patterns', '04-templates'),
  {{ snakeCase name}}_pages: path.resolve(__dirname, '_patterns', '05-pages'),
};

const namespaces = namespaceMaker(path.resolve(__dirname, '_patterns'), sets);

module.exports = {
  sets,
  namespaces,
};
