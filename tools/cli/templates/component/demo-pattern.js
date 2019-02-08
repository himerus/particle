/**
 * Demo of {{ camelCaseName }}. Pulls in {{ camelCaseName }} assets, and provides demo-only assets.
 *
 * (This file is NOT imported by the design system, but is included as part of
 * a Pattern Lab app.)
 */

// Import component assets
import '{{ componentNamespace }}/{{ dashCase name }}';

// Import demo assets
import twig from './{{ dashCase name }}.twig';
import yaml from './{{ dashCase name }}.yml';
import markdown from './README.md';

export default {
  twig,
  yaml,
  markdown,
};
