---
title: Vision
---

# SHIFTY - Vision

A new and intuitive way of controlling intelligent devices developed from first principles for the event industry.

## 🚀 Contribute

Feel free to check out the concepts here on GitHub, lets discuss your own ideas in [Issues](https://github.com/oshifty/vision/issues) or check out code you want to add via [Pull requests](https://github.com/oshifty/vision/pulls) 🥳

- [Type Documentation](https://oshifty.github.io/vision) &rarr; checkout running [locally](http://localhost:8000) (`npm run doc`)
- [WebSocket Demo](/src/routes/webSocketDemo) &rarr; checkout w/ running dev server: [/websocketDemo](http://localhost:5173/webSocketDemo)
- [Fixture Validation](/src/routes/fixtureValidation) &rarr; chechkout w/ running dev server: [/fixtureValidation](http://localhost:5173/fixtureValidation)
- [Visualizer](/src/routes/visualizer) &rarr; checkout w/ running dev server: [/visualizer](http://localhost:5173/visualizer)
  - [Remote](/src/routes/visualizer/remote) &rarr; checkout w/ running dev server: [/visualizer/remote](http://localhost:5173/visualizer/remote)

## 🔥 Run locally

### prerequisites

- [**Node.js®**](https://nodejs.org/) LTS

### download

This can either be done thru downloading the repos as [`*.zip`](https://github.com/LightYourWay/grandMA3-ts-template-plugin/archive/refs/heads/master.zip) and unpacking at said path or directly cloning the repository via cmdline.

```bash
git clone https://github.com/oshifty/vision.git <path>
```

### install dependencies

Open the `<path>` in your IDE

```bash
code <path>
```

and install all dependencies with `npm` in the terminal:

```bash
npm install
```

### run app for development

```bash
npm run dev
```

### run tests for development

```bash
npm run test
```

### build documentation

#### for development

To build the documentation website for development and watch for file changes to automatically recompile run:

```bash
npm run doc
```

#### for production

To build your plugin for production run:

```bash
npm run doc:build
```

### lint

```bash
npm run lint
```

### format

```bash
npm run format
```
