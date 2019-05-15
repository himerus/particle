<?php

/**
 * @param Twig_Environment $env - The Twig Environment - https://twig.symfony.com/api/1.x/Twig_Environment.html
 * @param $config - Config of `@basalt/twig-renderer`
 */
function addCustomExtension(\Twig_Environment &$env, $config) {

  /**
   * Adding in custom Twig filters.
   */

  // Filter for Drupal t function.
  $env->addFilter(new \Twig_SimpleFilter('t', function ($string) {
    return $string;
  }));

  // Converting rgba to a string.
  $env->addFilter(new \Twig_SimpleFilter('rgba_string', function ($string) {
    $rgba = trim(str_replace(' ', '', $string));
      if (stripos($rgba, 'rgba') !== FALSE) {
        $res = sscanf($rgba, "rgba(%d, %d, %d, %f)");
      }
      else {
        $res = sscanf($rgba, "rgb(%d, %d, %d)");
        $res[] = 1;
      }

      return array_combine(array('r', 'g', 'b', 'a'), $res);
  }));

  // Filter for luma.
  $env->addFilter(new \Twig_SimpleFilter('luma', function ($rgba) {
    // Doesn't handle alpha, yet.
    return 0.2126 * $rgba['r'] + 0.7152 * $rgba['g'] + 0.0722 * $rgba['b'];
  }));

  /**
   * Adding in custom Twig filters.
   */

  $env->addFunction(new \Twig_SimpleFunction('path', function ($string) {
    if ($string === '<front>') {
        return '/';
      }
      else {
        return $string;
      }
  }));

}
