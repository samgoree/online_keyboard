# Online Keyboard

An in-browser keyboard app.

A pet project I'm doing for two reasons:

1. To explore what happens when ideas from interaction design are applied to musical instruments
2. To practice using React.js and learn more about the web MIDI API

## Setup

Setting up a development environment for this code is easy with npm. First, [make sure you have npm installed](https://www.npmjs.com/get-npm) and run `npm install` in the main project directory. Then, run `npm serve` to run a development server.

To make sound, currently, you need to have a midi synthesizer running on your machine, and a web browser compatable with the web MIDI API. I've had luck using Chromium on Ubuntu with QSynth running in the background, and on Windows 10 with Firefox and the [Jazz-MIDI plugin](https://addons.mozilla.org/en-US/firefox/addon/jazz-midi/) using the default Windows MIDI synthesizer (MS GS Wavetable Synth). In the future, I'd like to add a browser-based option, but I haven't had time to work on that recently.

## Code Breakdown

The application is a React app running entirely in the browser, so there's only frontend code. Most of that code is in `App.js`, which specifies most of the UI. The grid is in `pitchGrid.js` and some other constants (like the pieces for chord and chord pulse mode) are in `constants.js`.

If you want to create a new piece for chord mode, you can add it to the `pieces` list in `constants.js`. The numbers are MIDI numbers minus 48, which means 0 is an octave below middle C, 1 is C# a half step above it and 12 is middle C. Negative numbers work just fine as well.