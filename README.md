# DevToolbox

A modern Vue 3 application built with Vite, featuring state management with Pinia, routing with Vue Router, and comprehensive testing setup.

## Features

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Pinia** - Intuitive state management
- **Vue Router** - Official router for Vue.js
- **TypeScript-ready** - Configured for TypeScript development
- **Testing** - Vitest for unit tests, Playwright for E2E tests
- **Linting** - ESLint + Oxlint for code quality
- **Formatting** - Prettier for code formatting

## Prerequisites

- Node.js `^22.18.0 || >=24.12.0`
- npm, yarn, or pnpm

## Getting Started

### Installation

```sh
npm install
```

### Development

Start the development server with hot-reload:

```sh
npm run dev
```

### Build for Production

Compile and minify for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Testing

### Unit Tests with Vitest

```sh
npm run test:unit
```

### End-to-End Tests with Playwright

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e

# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium

# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts

# Runs the tests in debug mode
npm run test:e2e -- --debug
```

## Code Quality

### Linting

```sh
npm run lint
```

This runs both Oxlint and ESLint with auto-fix.

### Formatting

```sh
npm run format
```

Format code with Prettier.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Project Structure

```
devtoolbox/
├── public/          # Static assets
├── src/
│   ├── assets/      # CSS, images, etc.
│   ├── components/  # Vue components
│   ├── router/      # Vue Router configuration
│   ├── stores/      # Pinia stores
│   ├── App.vue      # Root component
│   └── main.js      # Application entry point
├── e2e/             # Playwright E2E tests
└── package.json     # Dependencies and scripts
```

## Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for more details on customizing the build configuration.

## License

This project is private.
