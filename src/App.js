import React, { Component } from 'react';
import { PitchGrid, TonnetzGrid } from './pitchGrid.js';
import * as constants from './constants.js';
import './index.css';

import WebMidi from '../node_modules/webmidi/webmidi.min.js';

function SelectOption(props){
  var text = '';
  if (props.text){
    text = props.text;
  } else {
    text = props.value;
  }
  return (
      <option value={props.value}>{text}</option>
    )
}

class SelectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.props.handleChange;
  }

  render() {
    var selectOptions = [];
    if(this.props.options){
      for(var i = 0; i < this.props.options.length; i++){
        selectOptions.push( 
          <SelectOption value={this.props.options[i]}/>
        );
      }
    }
    return (
          <select
            value={this.props.value}
            onChange={this.handleChange}
          >
            {selectOptions}
          </select>
    );
  }
}

const inputModes = {
  'Default': {
    'down': (midiNumber, state) => {
      if (state.noteState[midiNumber - 48] === 0){
        state.noteState[midiNumber - 48] = 1;
        state.output.playNote(midiNumber, state.channel);
      }
      return state;
    },
    'up': (midiNumber, state) => {
      state.noteState[midiNumber - 48] = 0;
      state.output.stopNote(midiNumber, state.channel);
      return state;
    }
  },
  'Reverse': {
    'down': (midiNumber, state) => {
      if (state.noteState[72 - midiNumber] === 0){
        state.noteState[72 - midiNumber] = 1;
        state.output.playNote(72 - midiNumber + 48, state.channel);
      }
      return state;
    },
    'up': (midiNumber, state) => {
      console.log(midiNumber, 72 - midiNumber)
      state.noteState[72 - midiNumber] = 0;
      state.output.stopNote(72 - midiNumber + 48, state.channel);
      return state;
    }
  },
  'Sticky': {
    'down': (midiNumber, state) => {
      const n = midiNumber - 48;
      if(state.noteState[n] === 0){
        state.noteState[n] = 1;
        state.output.playNote(midiNumber, state.channel);
      } else if(state.noteState[n] === 2){
        state.noteState[n] = 0;
        state.output.stopNote(midiNumber, state.channel);
      }
      return state;
    },
    'up':  (midiNumber, state) => {
      if(state.noteState[midiNumber - 48] === 1){
        state.noteState[midiNumber - 48] = 2;
      }
      return state;
    }
  },
  'Pulse': { // held down keys play those chords at 120 bmp
    'down': (midiNumber, state) => {
      if(state.noteState[midiNumber - 48] === 0){
        state = pulseNote(midiNumber, state);
      }
      return state;
    },
    'up': (midiNumber, state) => {
      clearInterval(state.noteState[midiNumber - 48]);
      state.output.stopNote(midiNumber, state.channel);
      state.noteState[midiNumber - 48] = 0;
      return state;
    }
  },
  'Chords': {
    'down': (midiNumber, state) => {
      var note = 0;
      const offset = Math.floor(midiNumber / 12) * 12;
      const i = mod(midiNumber, 12);
      if(state.noteState[midiNumber - 48 + 12] === 0){
        for(var j = 0; j < constants.pieces[state.piece][i].length; j++){
          note = offset + constants.pieces[state.piece][i][j] - 48;
          state.noteState[note] = 1;
          state.output.playNote(note + 48, state.channel);
        }
      }
      return state;
    },
    'up': (midiNumber, state) => {
      const offset = Math.floor(midiNumber / 12) * 12;
      var note = 0;
      const i = mod(midiNumber, 12);
      for(var j = 0; j < constants.pieces[state.piece][i].length; j++){
        note = offset + constants.pieces[state.piece][i][j] - 48;
        state.output.stopNote(note + 48, state.channel);
        state.noteState[note] = 0;
      }
      return state;
    }
  },
  'Chord Pulse': {
    // this one looks less like an instrument configuration
    // and more like a composition on its own
    'down': (midiNumber, state) => {
      const offset = Math.floor(midiNumber / 12) * 12;
      const i = mod(midiNumber, 12);
      if(state.noteState[midiNumber - 48 + 12] === 0){
        for(var j = 0; j < constants.pieces[state.piece][i].length; j++){
          state = pulseNote(offset + constants.pieces[state.piece][i][j], state);
        }
      }
      return state;
    },
    'up': (midiNumber, state) => {
      const offset = Math.floor(midiNumber / 12) * 12;
      var note = 0;
      const i = mod(midiNumber, 12);
      for(var j = 0; j < constants.pieces[state.piece][i].length; j++){
        note = offset + constants.pieces[state.piece][i][j] - 48;
        clearInterval(state.noteState[note]);
        state.output.stopNote(note + 48, state.channel);
        state.noteState[note] = 0;
      }
      return state;
    }
  },
  'Relative Pitch': {
    'down': (midiNumber, state) => {
      const currentNotes = getCurrentNotes(state);
      if (currentNotes.length === 0){
        return shepardTone(mod(midiNumber, 12), state);
      } else {
        const currentPitchClass = currentNotes[0].number;
        // figure out new note
        const newPitchClass = mod(currentPitchClass + mod(midiNumber, 12), 12);
        if(state.noteState[newPitchClass] === 0){
          // turn off current notes
          for (var i = 0; i < currentNotes.length; i++){
            state.noteState[currentNotes[i].number] = 0;
            state.output.stopNote(currentNotes[i].number + 48, state.channel);
            if(currentNotes[i].intervalId > 1) {
              clearInterval(currentNotes[i].intervalId);
            }
          }
          return shepardTone(newPitchClass, state);
        } else {
          return state;
        }
      }
    },
    'up': (midiNumber, state) => {
      const currentNotes = getCurrentNotes(state);
      // turn off current notes
      for (var i = 0; i < currentNotes.length; i++){
        state.noteState[currentNotes[i].number] = 0;
        state.output.stopNote(currentNotes[i].number + 48, state.channel);
        if(currentNotes[i].intervalId > 1) {
          clearInterval(currentNotes[i].intervalId);
        }
      }
      return state;
    }
  },
  'Riemann': {
    // TODO: figure out how to avoid awkward non-synchronized pitches, either restart everything or do it differently
    'down': (midiNumber, state) => {
      const currentNotes = getCurrentNotes(state);
      if (currentNotes.length === 0){
        pulseNote(60, state);
        pulseNote(64, state);
        pulseNote(67, state);
      } else {
        const transformation = mod(midiNumber, 3);
        const firstInterval = currentNotes[1].number - currentNotes[0].number;
        const secondInterval = currentNotes[2].number - currentNotes[1].number;
        var root = null;
        var third = null;
        var fifth = null;
        if(firstInterval === 5){
          // second inversion
          root = currentNotes[1];
          third = currentNotes[2];
          fifth = currentNotes[0];
        } else if(secondInterval === 5){
          // first inversion
          root = currentNotes[2];
          third = currentNotes[0];
          fifth = currentNotes[1];
        } else {
          root = currentNotes[0];
          third = currentNotes[1];
          fifth = currentNotes[2];
        }
        const minor = (mod(third.number - root.number, 12) === 3);

        clearInterval(root.intervalId);
        clearInterval(third.intervalId);
        clearInterval(fifth.intervalId);

        if (transformation === 0){
          //tranform to parallel
          if(minor){
            state.noteState[third.number] = 0;
            state = pulseNote(third.number + 1 + 48, state);
          } else {
            state.noteState[third.number] = 0;
            state = pulseNote(third.number - 1 + 48, state);
          }
          state = pulseNote(root.number + 48, state);
          state = pulseNote(fifth.number + 48, state);
        } else if (transformation === 1){
          // transform to relative major/minor
          if(minor){
            
            state.noteState[root.number] = 0;
            state = pulseNote(root.number - 2 + 48, state);
            state = pulseNote(fifth.number + 48, state);
          } else {
            state.noteState[fifth.number] = 0;
            state = pulseNote(fifth.number + 2 + 48, state);
            state = pulseNote(root.number + 48, state);
          }
          state = pulseNote(third.number + 48, state);
        } else if (transformation === 2){
          // leading tone exchange
          if(minor){
            state.noteState[fifth.number] = 0;
            state = pulseNote(fifth.number + 1 + 48, state);
            state = pulseNote(root.number + 48, state);
          } else {
            state.noteState[root.number] = 0;
            state = pulseNote(root.number - 1 + 48, state);
            state = pulseNote(fifth.number + 48, state);
          }
          state = pulseNote(third.number + 48, state);
        }
      }
    },
    'up': (midiNumber, state) => {
      return state;
    }
  }
}


class App extends Component {
  constructor(props){
    super(props);
    var noteStateArr = [];
    for (var i = 0; i < constants.N_OCTAVES * 12; i++){
      noteStateArr.push(0)
    }
    // input/output should be midi connections
    // inputName/outputName should be strings
    // inputOptions/outputOptions should be arrays of strings
    this.state = {
      noteState: noteStateArr,
      input: null,
      output: null,
      channel: 1,
      mode: 'Default',
      inputName: '',
      outputName: '',
      inputOptions: null,
      outputOptions: null,
      piece: 'None',
    };
    var self = this;
    WebMidi.enable(function (err) {

      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
      }
      var state = self.state;
      state.inputOptions = WebMidi.inputs.map((i) => i.name);
      state.inputName = state.inputOptions[0];
      state.input = WebMidi.getInputByName(state.inputName);
      state.outputOptions = WebMidi.outputs.map((i) => i.name);
      state.outputName = state.outputOptions[0];
      state.output = WebMidi.getOutputByName(state.outputName);
      console.log(WebMidi.inputs);
      console.log(WebMidi.outputs);
      self.setState(state);
    });
    document.addEventListener("keydown", (event) =>{
      var note = keyToNote(event.key);
      if (note){
        var state = handleNotePress(note, self.state);
        self.setState(state);
      }
    });
    document.addEventListener("keyup", (event) =>{
      var note = keyToNote(event.key);
      if (note){
        var state = handleNoteRelease(note, self.state);
        self.setState(state);
      }
    });
  }
  handleInputChange(e){
    const value = e.target.value;
    // update state
    var state = this.state;
    state.inputName = value;
    state.input = WebMidi.getInputByName(state.inputName);
    // add listeners for note on and off
    var self = this;
    state.input.addListener('noteon', "all", function(e) {
      var state = self.state;
      state = handleNotePress(e.note.number, state);
      self.setState(state);
    });
    state.input.addListener('noteoff', "all", function(e) {
      var state = self.state;
      state = handleNoteRelease(e.note.number, state);
      self.setState(state);
    });
    this.setState(state);
  }
  handleOutputChange(e){
    const value = e.target.value;
    var state = this.state;
    state.outputName = value;
    state.output = WebMidi.getOutputByName(state.outputName);

    this.setState(state);
  }
  handleChannelChange(e){
    var state = this.state;
    state.channel = e.target.value;
    this.setState(state);
  }
  handleModeChange(e){
    var state = this.state;
    state.mode = e.target.value;
    var noteStateArr = [];
    for (var i = 0; i < constants.N_OCTAVES * 12; i++){
      noteStateArr.push(0);
      if(this.state.noteState[i] > 2){
        clearInterval(this.state.noteState[i]);
      }
    }
    state.noteState = noteStateArr;
    this.setState(state);
  }
  handlePieceChange(e){
    var state = this.state;
    state.piece = e.target.value;
    var noteStateArr = [];
    for (var i = 0; i < constants.N_OCTAVES * 12; i++){
      noteStateArr.push(0);
      if(this.state.noteState[i] > 2){
        clearInterval(this.state.noteState[i]);
      }
    }
    state.noteState = noteStateArr;
    this.setState(state);
  }
  render() {
    const menuTextStyle = {color:"#F5EDF9", border: "1px solid #191818"};
    const divStyle = {padding: "8px"};
    var pieceChooser = null;
    // figure out if we need a piece chooser option
    if(this.state.mode === 'Chords' || this.state.mode === 'Chord Pulse'){
      pieceChooser = (
        <div style={divStyle}>
        <p style={menuTextStyle}>Choose a Piece:</p>
        <SelectMenu
          value={this.state.piece}
          options={Object.keys(constants.pieces)}
          handleChange={(e) => this.handlePieceChange(e)}
        /></div>);
    } else {
      pieceChooser = (<div/>);
    }

    // figure out if we want the standard layout or the Tonnetz
    var grid = null;
    if(this.state.mode === 'Riemann'){
      grid = (
        <TonnetzGrid
          noteState={this.state.noteState}
        />
      );
    } else {
      grid = (
        <PitchGrid
          noteState={this.state.noteState}
        />
      );
    }

    return (
      <div id="layout">
        <a href="#menu" id="menuLink" class="menu-link">
          <span></span>
        </a>
        <div id="menu">
          <div style={divStyle}>
            <p style={menuTextStyle}>MIDI Input:</p>
            <SelectMenu
              value={this.state.inputName}
              options={this.state.inputOptions}
              handleChange={(e) => this.handleInputChange(e)}
            />
          </div>
          <div style={divStyle}>
            <p style={menuTextStyle}>MIDI Output:</p>
            <SelectMenu
              value={this.state.outputName}
              options={this.state.outputOptions}
              handleChange={(e) => this.handleOutputChange(e)}
            />
          </div>
          <div style={divStyle}>
            <p style={menuTextStyle}>Synth Channel:</p>
            <SelectMenu
              value={this.state.channel}
              options={[...Array(16).keys()]}
              handleChange={(e) => this.handleChannelChange(e)}
            />
          </div>
          <div style={divStyle}>
            <p style={menuTextStyle}>Input Mode:</p>
            <SelectMenu
              value={this.state.mode}
              options={Object.keys(inputModes)}
              handleChange={(e) => this.handleModeChange(e)}
            />
          </div>
          {pieceChooser}
        </div>
        <div id="main">
          <div class="header">
            <h2>Midi Keyboard</h2>
          </div>
          <div class="content">
            <div class="pure-g">
              <div class="pure-u-1-3">
                {grid}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// Helper functions

function handleNotePress(midiNumber, state){
  return inputModes[state.mode]['down'](midiNumber, state);
}

function handleNoteRelease(midiNumber, state){
  return inputModes[state.mode]['up'](midiNumber, state);
}

function keyToNote(character){
  var value = constants.keyboardCharacterMap[character];
  if (!isNaN(value)) {
    return value + 48;
  } else {
    return null;
  }
}


function pulseNote(midiNumber, state){
  state.output.playNote(
    midiNumber,
    state.channel,
    {duration: 250},
  );
  if(state.noteState[midiNumber - 48] > 2){
    clearInterval(state.noteState[midiNumber - 48]);
  }
  state.noteState[midiNumber - 48] = setInterval(
    () => state.output.playNote(
      midiNumber,
      state.channel,
      {duration: 250},
    ), 500
  );
  console.log(state.noteState[midiNumber - 48]);
  return state;
}


function shepardTone(pitchNumber, state){
  console.log(pitchNumber);
  if (pitchNumber > 11){
    console.log("Warning: shepardTone pitch was greater than 12");
    pitchNumber %= 12;
  }
  for(var i = 0; i < constants.N_OCTAVES; i++){
    const velocity = 0.5 - Math.pow(
      (i - (constants.N_OCTAVES/2)),
      2
    ) / Math.pow(
      (constants.N_OCTAVES/2),
      2
    );
    const noteNumber = pitchNumber + i * 12
    state.output.playNote(
      noteNumber + 48,
      state.channel,
      {velocity: velocity}
    );
    state.noteState[noteNumber] = 1;
  }
  return state;
}


function getCurrentNotes(state){
  var result = [];
  for(var i = 0; i < state.noteState.length; i++){
    if(state.noteState[i] !== 0){
      result.push({number: i, intervalId: state.noteState[i]});
    }
  }
  return result;
}


function mod(n, m) {
  return ((n % m) + m) % m;
}