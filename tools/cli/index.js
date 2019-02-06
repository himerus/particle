/**
 * Commands for Plop based CLI tool for creating new design systems and components.
 * @see https://plopjs.com/documentation
 * @param plop
 */
const { join } = require('path');

const { readdirSync, statSync, existsSync } = require('fs');
const { PATH_SOURCE: componentPath } = require('../../particle.root.config');
const {
  TYPES: generatorTypes,
  PARTIALS: availableFeatures,
  SELECTED_PARTIALS: selectedFeatures,
} = require('./cli.config');

module.exports = function(plop) {
  plop.setGenerator('particle', {
    description: 'Select the ',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to create?',
        choices: generatorTypes,
      },
      {
        type: 'list',
        name: 'system',
        message(input) {
          // Get more data from our TYPES variable about this type.
          const type = generatorTypes.find(t => t.value === input.type);
          return `To which design system would you like to add this new ${
            type.short
          }?`;
        },
        choices: readdirSync(componentPath, 'utf8').filter(folder =>
          statSync(join(componentPath, folder)).isDirectory()
        ),
        // Only when we are adding a Component.
        when(input) {
          return input.type === 'component';
        },
      },
      {
        type: 'list',
        name: 'componentType',
        message(input) {
          // Get more data from our TYPES variable about this type.
          const type = generatorTypes.find(t => t.value === input.type);
          return `Where should the new ${type.short} reside?`;
        },
        choices(input) {
          const patternPath = join(componentPath, input.system, '_patterns');
          return readdirSync(patternPath, 'utf8').filter(folder =>
            statSync(join(patternPath, folder)).isDirectory()
          );
        },
        // Only when we are adding a Component.
        when(input) {
          return input.type === 'component';
        },
      },
      {
        type: 'list',
        name: 'componentSubType',
        message: 'Where in here?',
        choices(input) {
          const patternSubPath = join(
            componentPath,
            input.system,
            '_patterns',
            input.componentType
          );
          const subfolders = readdirSync(patternSubPath, 'utf8').filter(
            folder => statSync(join(patternSubPath, folder)).isDirectory()
          );
          return ['./'].concat(subfolders);
        },
      },
      {
        type: 'checkbox',
        name: 'selections',
        message(input) {
          // Get more data from our TYPES variable about this type.
          const type = generatorTypes.find(t => t.value === input.type);
          return `What files should be included in the new ${type.short}?`;
        },
        choices: availableFeatures,
        default: selectedFeatures,
        // Only when we are adding a Component.
        when(input) {
          return input.type === 'component';
        },
      },
      {
        type: 'input',
        name: 'name',
        message(input) {
          // Get more data from our TYPES variable about this type.
          const type = generatorTypes.find(t => t.value === input.type);
          return `What should the new ${type.short} be called?`;
        },
        // Read all directories under /source as an option.
        choices: readdirSync(componentPath, 'utf8').filter(folder =>
          statSync(join(componentPath, folder)).isDirectory()
        ),
        validate(input, data) {
          // @todo: Provide better validation.
          // Handle if a name is too short.
          if (input.length <= 3) {
            return 'The name should be longer than 3 characters.';
          }

          // If this is a component we are adding ADD the directory already exists, we should error out.
          if (data.type === 'component') {
            // Compute what the 'system' name will look like when it is actually created.
            // This dashCase (and other helpers) seem to only be available in the {{ handlebars }}
            // templates and paths parsed through Plop. There has to be an easier way to do this than
            // also require node-plop to get access to the root functions.
            const newComponentPath = input.trim().replace(' ', '-');
            // const newComponentPath = plop.dashCase(input);
            const destinationPath = join(
              componentPath,
              data.system,
              '_patterns',
              data.componentType,
              data.componentSubType,
              newComponentPath
            );

            if (existsSync(destinationPath.trim())) {
              return `The component ${newComponentPath} already exists at ${destinationPath}`;
            }
          }

          // If no tests failed and exited early, return true.
          return true;
        },
      },
    ],
    actions: function notify(input) {
      // Debug the entire input object.
      // console.log(input);

      const actions = [];
      // Get more data from our TYPES variable about this type.
      const type = generatorTypes.find(t => t.value === input.type);

      // Pass a string to Plop to return to console.
      actions.push(`Initializing ${type.short} creation tool...`);

      // const newSystemPath = `${componentPath}/{{ dashCase input.name }}`;
      const newComponentPath = `${componentPath}/{{ system }}/_patterns/{{ componentType }}/{{ componentSubType }}/{{ dashCase name }}`;

      switch (type.value) {
        default:
          break;
        case 'component':
          // Pass a message to the console.
          actions.push(`Adding default files.`);
          // Create a README.md file.
          actions.push({
            type: 'add',
            path: `${newComponentPath}/README.md`,
            templateFile: 'templates/component/pattern.md',
            skipIfExists: true,
            abortOnFail: true,
          });

          // Create a .yml file for pattern data.
          actions.push({
            type: 'add',
            path: `${newComponentPath}/{{dashCase name}}.yml`,
            templateFile: 'templates/component/pattern.yml',
            skipIfExists: true,
            abortOnFail: true,
          });

          // Add in a twig template if the user opted for it.
          if (input.selections.includes('twig')) {
            // Pass a message to the console.
            actions.push(`Adding default files for Twig.`);
            actions.push({
              type: 'add',
              path: `${newComponentPath}/_{{dashCase name}}.twig`,
              templateFile: 'templates/component/_pattern.twig',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          // Add in a scss template if the user opted for it.
          if (input.selections.includes('scss')) {
            // Pass a message to the console.
            actions.push(`Adding default files for SCSS.`);
            actions.push({
              type: 'add',
              path: `${newComponentPath}/_{{dashCase name}}.scss`,
              templateFile: 'templates/component/_pattern.scss',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          // Add in a js template if the user opted for it.
          if (input.selections.includes('js')) {
            // Pass a message to the console.
            actions.push(`Adding default files for JavaScript.`);
            actions.push({
              type: 'add',
              path: `${newComponentPath}/{{dashCase name}}.js`,
              templateFile: 'templates/component/pattern.js',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          // Add in a demo template if the user opted for it.
          if (input.selections.includes('demo')) {
            // Pass a message to the console.
            actions.push(`Adding default files for a demo component.`);
            actions.push({
              type: 'add',
              path: `${newComponentPath}/demo/index.js`,
              templateFile: 'templates/component/demo-pattern.js',
              skipIfExists: true,
              abortOnFail: true,
            });
            actions.push({
              type: 'add',
              path: `${newComponentPath}/demo/{{dashCase name}}.twig`,
              templateFile: 'templates/component/demo-pattern.twig',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          // Add in sample Jest tests if the user opted for it.
          if (input.selections.includes('tests')) {
            // Pass a message to the console.
            actions.push(`Adding default Jest test.`);
            actions.push({
              type: 'add',
              path: `${newComponentPath}/__tests__/{{dashCase name}}.test.js`,
              templateFile: 'templates/component/pattern-test.js',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          break;

        case 'system':
          break;
      }
      // Let users know we've reached the end of our journey.
      actions.push(`Your new ${type.short}, ${input.name} has been generated.`);
      // @todo: This would be a great spot for additional info about the created item like a URL or something even?
      return actions;
    },
  });
};
