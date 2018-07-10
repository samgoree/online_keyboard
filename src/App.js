import React, { Component } from 'react';
import '../node_modules/purecss/build/pure-min.css';

import WebMidi from '../node_modules/webmidi/webmidi.min.js';

const WHITE = '#F5EDF9';
const LIGHT_BLUE = '#79ADDC';
const DARK_BLUE = '#5656CE';
const GRAY = '#514F59';
const BLACK = '#1D1128';

const N_OCTAVES = 3;

function PitchMonitor(props) {
  return(
    <td style={{backgroundColor:props.color}}>
      {props.noteName}
    </td>
  );
};

class PitchGrid extends Component {

  renderPitchMonitor(i){
    return (
      <PitchMonitor
        noteName={noteName(i)}
        color={this.props.note_state[i] === 1 ? LIGHT_BLUE : WHITE}
        key={i}
      />
    );
  }

  render() {
    var rows = [];
    for (var i = 0; i < N_OCTAVES; i++){
      rows.push(
        <tr>
          {this.renderPitchMonitor(12 * i)}
          {this.renderPitchMonitor(12 * i + 1)}
          {this.renderPitchMonitor(12 * i + 2)}
          {this.renderPitchMonitor(12 * i + 3)}
        </tr>
      );
      rows.push(
        <tr>
          {this.renderPitchMonitor(12 * i + 4)}
          {this.renderPitchMonitor(12 * i + 5)}
          {this.renderPitchMonitor(12 * i + 6)}
          {this.renderPitchMonitor(12 * i + 7)}
        </tr>
      );
      rows.push(
        <tr>
          {this.renderPitchMonitor(12 * i + 8)}
          {this.renderPitchMonitor(12 * i + 9)}
          {this.renderPitchMonitor(12 * i + 10)}
          {this.renderPitchMonitor(12 * i + 11)}
        </tr>
      );
    }
    return (
      <div>
        <table className="pure-table pure-table-bordered">
          <tbody>
           {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);
    var note_state_arr = [];
    for (var i = 0; i < N_OCTAVES * 12; i++){
      note_state_arr.push(0)
    }
    this.state = {
      note_state: note_state_arr
    };
    var self = this;
    WebMidi.enable(function (err) {

      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
      }
      console.log(WebMidi.inputs);
      console.log(WebMidi.outputs);

      self.input = WebMidi.getInputByName("Impulse MIDI 1");
      self.output = WebMidi.getOutputByName("Synth input port (12206:0)");
      console.log(self.input);
      console.log(self.output);

      self.input.addListener('noteon', "all", function(e) {
          var state = self.state;
          state = handleNotePress(e.note.number, state, self.output);
          self.setState(state);
      });

      self.input.addListener('noteoff', "all", function(e) {
          var state = self.state;
          state = handleNoteRelease(e.note.number, state, self.output);
          self.setState(state);
      });
    });
    document.addEventListener("keydown", (event) =>{
      var note = keyToNote(event.key);
      if (note){
        var state = handleNotePress(note, self.state, self.output);
        self.setState(state);
      }
    });
    document.addEventListener("keyup", (event) =>{
      var note = keyToNote(event.key);
      if (note){
        var state = handleNoteRelease(note, self.state, self.output);
        self.setState(state);
      }
    });
  }
  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1-3"></div>
        <div className="pure-u-3-5">
          <h2>Hell Yeah</h2>
          <PitchGrid
            note_state={this.state.note_state}
          />
        </div>
        <div className="pure-u-1-3"></div>
      </div>
    );
  }
}

export default App;

function handleNotePress(midiNumber, state, output){
  state['note_state'][midiNumber - 48] = 1;
  output.playNote(midiNumber, 2);
  return state;
}

function handleNoteRelease(midiNumber, state, output){
  state['note_state'][midiNumber - 48] = 0;
  output.stopNote(midiNumber, 2);
  return state;
}

const noteNames = [
  'C ',
  'C#',
  'D ',
  'D#',
  'E ',
  'F ',
  'F#',
  'G ',
  'G#',
  'A ',
  'A#',
  'B '
]

function noteName(number){
  var octave = Math.floor(number / 12);
  var name = noteNames[number % 12];
  return name + String(octave);
}

const keyboardCharacterMap = {
    'a': 0,
    'w': 1,
    's': 2,
    'e': 3,
    'd': 4,
    'f': 5,
    't': 6,
    'g': 7,
    'y': 8,
    'h': 9,
    'u': 10,
    'j': 11,
    'k': 12,
    'o': 13,
    'l': 14,
    'p': 15,
    ';': 16,
    'A': 17,
    'W': 18,
    'S': 19,
    'E': 20,
    'D': 21,
    'F': 22,
    'T': 23,
    'G': 24,
    'Y': 25,
    'H': 26,
    'U': 27,
    'J': 28,
    'K': 29,
    'O': 30,
    'L': 31,
    'P': 40
  };

function keyToNote(character){
  var value = keyboardCharacterMap[character];
  if (value !== NaN) {
    return value + 48;
  } else {
    return null;
  }
}