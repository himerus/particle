/**
 * Default data for Particle CLI.
 */

module.exports = {
  // The types of objects that can be created with the tool.
  TYPES: [
    {
      name: 'Create a new Component in an existing Design System',
      value: 'component',
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
    },
    {
      name: 'SCSS (.scss)',
      value: 'scss',
    },
    {
      name: 'JavaScript (.js)',
      value: 'js',
    },
    {
      name: 'Demonstration folder/pattern(s) for Pattern Lab.',
      value: 'demo',
    },
    {
      name: 'Sample Jest Test(s).',
      value: 'tests',
    },
  ],
  // The partials that are initially selected.
  SELECTED_PARTIALS: ['twig', 'scss', 'js', 'demo', 'tests'],
};
