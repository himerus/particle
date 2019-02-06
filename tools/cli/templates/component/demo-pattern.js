/**
 * Demo of {{ camelCaseName }}. Pulls in {{ camelCaseName }} assets, and provides demo-only assets.
 *
 * (This file is NOT imported by the design system, but is included as part of
 * a Pattern Lab app.)
 */

// Import component assets
import '{{ cleanPatternType }}/{{ dashCase name }}';

// Import demo assets
import twig from './{{ dashCase name }}s.twig';
import yaml from './{{ dashCase name }}s.yml';
import markdown from './{{ dashCase name }}s.md';

export default {
  twig,
  yaml,
  markdown,
};
