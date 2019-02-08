/**
 * Commands for Plop based CLI tool for creating new design systems and components.
 * @see https://plopjs.com/documentation
 * @param plop
 */
const { join } = require('path');

const { readdirSync, statSync, existsSync } = require('fs');

const del = require('del');

const { PATH_SOURCE: sourceDirectory } = require('../../particle.root.config');
const {
  TYPES: generatorTypes,
  PARTIALS: availableFeatures,
  SELECTED_PARTIALS: selectedFeatures,
  DEFAULT_NAMESPACES: defaultNamespaces,
} = require('./cli.config');

module.exports = function(plop) {
  plop.setGenerator('particle', {
    description:
      'Generator for adding components and adding & removing design systems.',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to create?',
        choices: generatorTypes,
        default: 'system',
      },
      {
        type: 'list',
        name: 'system',
        message(input) {
          if (input.type === 'component') {
            // Get more data from our TYPES variable about this type.
            const type = generatorTypes.find(t => t.value === input.type);
            return `To which design system would you like to add this new ${
              type.short
            }?`;
          }

          if (input.type === 'deleteSystem') {
            return `Which design system would you like to delete?`;
          }

          return '';
        },
        choices: readdirSync(sourceDirectory, 'utf8').filter(folder =>
          statSync(join(sourceDirectory, folder)).isDirectory()
        ),
        // Only when we are adding a Component.
        when(input) {
          return input.type === 'component' || input.type === 'deleteSystem';
        },
      },
      {
        type: 'confirm',
        name: 'confirmDelete',
        message(input) {
          return `Are you sure you want to delete ${input.system}?`;
        },
        // Only when we are adding a Component.
        when(input) {
          return input.type === 'deleteSystem';
        },
      },
      {
        type: 'list',
        name: 'componentPath',
        message(input) {
          // Get more data from our TYPES variable about this type.
          const type = generatorTypes.find(t => t.value === input.type);
          return `Where should the new ${type.short} reside?`;
        },
        choices(input) {
          /**
           * Here, we need to load up the namespaces.js file in the design system
           * we are adding a component to. This is so that we no longer rely on 00-protons
           * directory name meaning that it is a proton in the namespace file. We could as
           * easily point `default_protons` to a `00-protons` directory or a
           * `00-really-tiny-sized-thingies` directory, and if we don't look up
           * that it is actually @protons many of our templated includes would be broken.
           *
           * We also disable the linting that tells us not to require in the middle of a file. #idowhatiwant.
           */
          // eslint-disable-next-line global-require,import/no-dynamic-require
          const { sets: atomicPaths } = require(`${join(
            sourceDirectory,
            input.system
          )}/namespaces.js`);

          return Object.keys(atomicPaths).map(atomicElement => ({
            name: atomicElement,
            value: atomicPaths[atomicElement]
              .replace(
                join(
                  sourceDirectory, // Path (absolute) to source directory.
                  input.system, // The name of the design system.
                  '_patterns'
                ),
                ''
              )
              .replace('/', ''), // We are here returning ONLY the '00-protons' value for directory name.
            short: atomicElement,
          }));
        },
        // Only when we are adding a Component.
        when(input) {
          return input.type === 'component';
        },
      },
      {
        type: 'list',
        name: 'componentSubPath',
        message: 'Where in here?',
        choices(input) {
          const patternSubPath = join(
            sourceDirectory, // Path (absolute) to source directory.
            input.system, // The name of the design system.
            '_patterns', // The _patterns folder in the design system.
            input.componentPath // The type of item it is (atom, molecule, etc.)
          );
          const subfolders = readdirSync(patternSubPath, 'utf8').filter(
            folder => statSync(join(patternSubPath, folder)).isDirectory()
          );
          return ['./'].concat(subfolders);
        },
        // Only when we are adding a Component.
        when(input) {
          return input.type === 'component';
        },
      },
      {
        type: 'checkbox',
        name: 'selections',
        message(input) {
          // Get more data from our TYPES variable about this type.
          const type = generatorTypes.find(t => t.value === input.type);
          return `What should be included in the new ${type.short}?`;
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
        choices: readdirSync(sourceDirectory, 'utf8').filter(folder =>
          statSync(join(sourceDirectory, folder)).isDirectory()
        ),
        validate(input, data) {
          // @todo: Provide better validation.
          // Handle if a name is too short.
          if (input.length <= 3) {
            return 'The name should be longer than 3 characters.';
          }

          // If this is a component we are adding ADD the directory already exists, we should error out.
          if (data.type === 'component') {
            /**
             * Compute what the 'system' name will look like when it is actually created.
             * This dashCase (and other helpers) seem to only be available in the {{ handlebars }}
             * templates and paths parsed through Plop. There has to be an easier way to do this than
             * also require node-plop to get access to the root functions.
             */
            // @todo: Create a better regex to handle the same format as dashCase.
            const newComponentPath = input
              .trim()
              .replace('/(?!\\w|\\s)./g', '-')
              .trim(' ', '-')
              .replace('/\\s+/g', '-')
              .toLowerCase();
            // const newComponentPath = plop.dashCase(input);
            const destinationPath = join(
              sourceDirectory,
              data.system,
              '_patterns',
              data.componentPath,
              data.componentSubPath,
              newComponentPath
            );

            if (existsSync(destinationPath.trim())) {
              return `The component ${newComponentPath} already exists at ${destinationPath}`;
            }
          }

          if (data.type === 'system') {
            // @todo: Create a better regex to handle the same format as dashCase.
            const newSystemPath = input
              .trim()
              .replace('/(?!\\w|\\s)./g', '-')
              .trim(' ', '-')
              .replace('/\\s+/g', '-')
              .toLowerCase();
            // const newComponentPath = plop.dashCase(input);
            const destinationPath = join(sourceDirectory, newSystemPath);

            if (existsSync(destinationPath.trim())) {
              return `The design system ${newSystemPath} already exists at ${destinationPath}`;
            }
          }

          // If no tests failed and exited early, return true.
          return true;
        },
        when(input) {
          return input.type === 'component' || input.type === 'system';
        },
      },
    ],
    actions: function notify(input) {
      // Debug the entire input object.
      // console.log(input);

      const actions = [];

      // Get more data from our TYPES variable about this type.
      const type = generatorTypes.find(t => t.value === input.type);

      // eslint-disable-next-line no-unused-vars
      const deleteSystemPath =
        type.value === 'deleteSystem'
          ? `${sourceDirectory}/${input.system}`
          : false;

      const newSystemPath =
        type.value === 'system'
          ? `${sourceDirectory}/{{ dashCase name }}`
          : false;

      const newComponentPath =
        type.value === 'component'
          ? `${sourceDirectory}/{{ system }}/_patterns/{{ componentPath }}/{{ componentSubPath }}/{{ dashCase name }}`
          : false;

      switch (type.value) {
        default:
          break;
        /**
         * component: Create design system.
         */
        case 'component':
          // Pass a string to Plop to return to console.
          actions.push(`Initializing Component Builder...`);

          // eslint-disable-next-line global-require,import/no-dynamic-require, no-case-declarations
          const { sets: atomicPaths } = require(`${join(
            sourceDirectory,
            input.system
          )}/namespaces.js`);

          // eslint-disable-next-line no-case-declarations
          const atomicNamespaces = Object.keys(atomicPaths);

          // @todo: Need to somehow produce an object like below to attach to input.namespaces.
          // [protons: 'default_protons', atoms: 'default_atoms', ...]

          // eslint-disable-next-line no-param-reassign
          input.namespaces = atomicNamespaces.reduce((acc, atomic) => {
            defaultNamespaces.map(namespace => {
              if (atomic.includes(namespace)) {
                acc[namespace] = atomic;
              }
              return null;
            });
            return acc;
          }, {});

          // @todo: Maybe reduce() is incorrect here. I only want the last static value which should be the only match.
          // eslint-disable-next-line no-param-reassign
          input.componentNamespace = atomicNamespaces.reduce((acc, atomic) => {
            if (atomicPaths[atomic].includes(input.componentPath)) {
              actions.push(`${atomic}: ${atomicPaths[atomic]}`);
              // eslint-disable-next-line no-param-reassign
              acc = atomic;
            }

            return acc;
          });

          // Create a README.md file.
          actions.push({
            type: 'add',
            path: `${newComponentPath}/README.md`,
            templateFile: 'templates/component/pattern.md',
            skipIfExists: true,
            abortOnFail: true,
          });

          actions.push({
            type: 'add',
            path: `${newComponentPath}/index.js`,
            templateFile: 'templates/component/pattern.js',
            skipIfExists: true,
            abortOnFail: true,
          });

          // Add in a twig template if the user opted for it.
          if (input.selections.includes('twig')) {
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
            actions.push({
              type: 'add',
              path: `${newComponentPath}/_{{dashCase name}}.scss`,
              templateFile: 'templates/component/_pattern.scss',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          // Add in a demo template if the user opted for it.
          if (input.selections.includes('demo')) {
            // Create a README.md file.
            actions.push({
              type: 'add',
              path: `${newComponentPath}/demo/README.md`,
              templateFile: 'templates/component/pattern.md',
              skipIfExists: true,
              abortOnFail: true,
            });
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
            // Create a .yml file for pattern data.
            actions.push({
              type: 'add',
              path: `${newComponentPath}/demo/{{dashCase name}}.yml`,
              templateFile: 'templates/component/pattern.yml',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          // Add in sample Jest tests if the user opted for it.
          if (input.selections.includes('tests')) {
            // Pass a message to the console.
            actions.push({
              type: 'add',
              path: `${newComponentPath}/__tests__/≈.test.js`,
              templateFile: 'templates/component/pattern-test.js',
              skipIfExists: true,
              abortOnFail: true,
            });
          }

          break;

        /**
         * system: Create design system.
         */
        case 'system':
          // Pass a string to Plop to return to console.
          actions.push(`Initializing design system creation tool...`);
          // Add a whole boatload of files.
          actions.push({
            type: 'addMany',
            destination: `${newSystemPath}/`,
            templateFiles: 'templates/system/**',
            base: 'templates/system',
            skipIfExists: false,
            abortOnFail: true,
            force: true,
            verbose: true,
          });

          break;

        /**
         * deleteSystem: Delete design system.
         */
        case 'deleteSystem':
          // Pass a string to Plop to return to console.
          actions.push(`Initializing design system deletion tool...`);

          if (input.confirmDelete) {
            del.sync([`${deleteSystemPath}`], {
              dryRun: false, // Set this to true to debug without deleting anything.
            });

            actions.push(`The design system ${input.system} has been deleted.`);
          }
          break;
      }

      if (input.type === 'component' || input.type === 'system') {
        // Let users know we've reached the end of our journey.
        actions.push(
          `Your new ${type.short}, ${input.name} has been generated.`
        );
      }
      // @todo: This would be a great spot for additional info about the created item like a URL or something even?
      // Debug the entire input object.
      // console.log(input);
      return actions;
    },
  });
};
