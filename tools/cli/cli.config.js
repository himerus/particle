/**
 * Default data for Particle CLI.
 */

module.exports = {
  // The types of objects that can be created with the tool.
  TYPES: [
    {
      // name is the text displayed initially during prompt.
      name: 'Create a new Component in an existing Design System',
      // value is the actual value passed to later prompts/actions.
      value: 'component',
      // short is the friendly versions show after selection in the prompt.
      short: 'Component',
    },
    {
      name: 'Create a new Design System',
      value: 'system',
      short: 'Design System',
    },
  ],
  // The types of partials we allow user to select from.
  // Others would be automatically added.
  PARTIALS: [
    {
      name: 'Twig (.twig)',
      value: 'twig',
      short: 'twig',
    },
    {
      name: 'SCSS (.scss)',
      value: 'scss',
      short: 'scss',
    },
    // The JS additions are pretty much required.
    // Test by using the original npm run new without js selected.
    // {
    //   name: 'JavaScript (.js)',
    //   value: 'js',
    //   short: 'js',
    // },
    {
      name: 'Demonstration folder/pattern(s) for Pattern Lab.',
      value: 'demo',
      short: 'demo',
    },
    {
      name: 'Sample Jest Test(s).',
      value: 'tests',
      short: 'tests',
    },
  ],
  // The partials that are initially selected in the CLI prompt.
  SELECTED_PARTIALS: [
    'twig',
    'scss',
    // 'js',
    'demo',
    'tests',
  ],
  // The 'default' namespaces are mapped to something that may look different,
  // but need to be referenced in the templates like `import @{{ PROTON_VAR_NAME }}`
  DEFAULT_NAMESPACES: [
    'protons',
    'atoms',
    'molecules',
    'organisms',
    'templates',
    'pages',
  ],
};
