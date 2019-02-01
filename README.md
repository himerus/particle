# Particle: A design system integrating to Pattern Lab and a Drupal 8 theme

[![GitHub (pre-)release](https://img.shields.io/github/release/phase2/particle/all.svg)](https://github.com/phase2/particle/releases) [![Build Status](https://travis-ci.org/phase2/particle.svg?branch=master)](https://travis-ci.org/phase2/particle) [![Greenkeeper badge](https://badges.greenkeeper.io/phase2/particle.svg)](https://greenkeeper.io/)

![Particle mascot: Astrogoat](source/default/_patterns/01-atoms/image/demo/astrogoat.png?raw=true 'Astrogoat')

Particle is an opinionated set of tools and examples to:

1.  Build an application-agnostic **design system**
1.  Apply that design system to a locally-served **Pattern Lab** for rapid prototyping
1.  Apply that design system to a **Drupal theme**

In depth documentation about frontend approach using this project at [Phase2 Frontend Docs](https://phase2.gitbook.io/frontend/)

## Prerequisites

- [Node `^6`, `^8`, `^10`](https://nodejs.org)
- [NPM `^5`, `^6`](https://www.npmjs.com/)
- [PHP `5.6`, `^7.0.0`](https://php.net)
- [Composer `^1.0.0`](https://getcomposer.org)

[Step-by-step instructions to install all dependencies for OSX can be found in this Gist.](https://gist.github.com/illepic/efd6ab9f452af2a99b7ade78257e6b96)

## Provides

- Drupal theme, Grav theme, and Pattern Lab app
- Strict [Atomic Design](http://atomicdesign.bradfrost.com/) component structure
- Webpack bundling of all CSS, javascript, font, and static image assets for multiple targets (Drupal theme, Grav theme, Pattern Lab)
- [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) for local hosting and hot reloading of assets into Pattern Lab
- [Twig namespaced paths](https://symfony.com/doc/current/templating/namespaced_paths.html) automatically added into Drupal theme and Pattern Lab config. Within any twig file, `@default_atoms/thing.twig` means the same thing to Drupal theme and Pattern Lab.
- Iconfont auto-generation
- Bootstrap 4 integration, used for all starting example components
- Auto-linting against the [AirBnB JavaScript Style Guide](https://github.com/airbnb/javascript) and sane Sass standards
- All Webpack and Gulp files are fully configurable
- Simple [Yeoman](http://yeoman.io/) generator for Design System component creation

## Quickstart

Particle builds design systems in dev mode for local hosting, or production mode for optimized asset generation.

### Quickstart A

1. Simply run:

   ```bash
   npm create @phase2/particle particle
   ```

1. Then `cd particle/` and run:

   ```bash
   npm start
   ```

### Quickstart B

1.  [Download the latest release](https://github.com/phase2/particle/releases)
1.  Extract anywhere (i.e. this readme should be at `any/where/particle/README.md`)
1.  Within the extracted folder run:

```bash
npm install
npm run setup
npm start
```
Simply wait until the webpack bundle output appears then visit [http://0.0.0.0:8080/pl](http://0.0.0.0:8080/pl) (or [http://localhost:8080/pl](http://localhost:8080/pl)) and start working.

###  Quickstart C (Docksal)
> This method is intended specifically to provide a [Docksal](https://docksal.io/) setup to host the PatternLab instance(s) during local development.

1.  Ensure you have [Docksal](https://docksal.io/installation) installed locally.
    > **Note**: For previous Outrigger users, Docksal may complain of a conflict when first starting the VM. You will need to edit you `/etc/exports` file accordingly, and also likely update `DOCKSAL_NFS_PATH` in `~/.docksal/docksal.env` if you use a directory outside of `/Users`.
1.  Checkout the latest [Particle code](https://github.com/phase2/particle)
1.  Extract anywhere (i.e. this readme should be at `any/where/particle/README.md`)
1.  Within the extracted folder run:
```bash
fin vm start && fin start
fin init
fin watch
```

**Other available Docksal `fin` commands:**
* `fin generate`: Generate `dist` folder for all design systems.
* `fin generate SYSTEM`: Generate `dist` folder for specific design system. (`default`)
* `fin nuke`: wipe out the `node_modules` directory and reinstall npm packages.
* `fin npm COMMAND`: Pass any normal npm commands into the container to run. (`fin npm run build:pl`)

Simply wait until the Webpack bundle output appears then visit [dev.particle.docksal/pl-default/](http://dev.particle.docksal/pl-default) and start working.


That's it. For **much** greater detail on the frontend approach using this project, check out the [Phase2 Frontend Docs](https://phase2.gitbook.io/frontend/).
