import React, { Component } from 'react';
import './index.css';
import * as constants from './constants.js'

function noteName(number){
  var octave = Math.floor(number / 12);
  var name = constants.noteNames[number % 12];
  return name + String(octave);
}

function PitchMonitor(props) {
  //style={{backgroundColor:props.color}}
  return(
    <li>
      <div class="hexagon" style={{background:props.color}}>
        <p>
          {props.noteName}
        </p>
      </div>
    </li>
  );
};

function BlankHexagon(props){
  return(
    <li>
      <div class="hexagon" style={{background:"white"}}/>
    </li>
  );
}


export class PitchGrid extends Component {

  renderPitchMonitor(i){
    return (
      <PitchMonitor
        noteName={noteName(i)}
        color={this.props.noteState[i] === 0 ? constants.WHITE : constants.LIGHT_BLUE}
        key={i}
      />
    );
  }

  render() {
    var rows = [];
    for (var i = 0; i < constants.N_OCTAVES * 12; i+=12){
      rows.push(BlankHexagon());
      rows.push(this.renderPitchMonitor(i + 1));
      rows.push(this.renderPitchMonitor(i + 3));
      rows.push(BlankHexagon());
      rows.push(this.renderPitchMonitor(i + 6));
      rows.push(this.renderPitchMonitor(i + 8));
      rows.push(this.renderPitchMonitor(i + 10));
      rows.push(this.renderPitchMonitor(i));
      rows.push(this.renderPitchMonitor(i + 2));
      rows.push(this.renderPitchMonitor(i + 4));
      rows.push(this.renderPitchMonitor(i + 5));
      rows.push(this.renderPitchMonitor(i + 7));
      rows.push(this.renderPitchMonitor(i + 9));
      rows.push(this.renderPitchMonitor(i + 11));

    }
    return (
      <div>
        <ul id="grid" className="clear">
          {rows}
        </ul>
      </div>
    );
  }
}

export class TonnetzGrid extends Component {

  renderPitchMonitor(number, pk){
  	var white = true;
  	for (var octave = 0; octave < constants.N_OCTAVES; octave++){
  		if(this.props.noteState[number + 12 * octave] !== 0){
  			white = false;
  		}
  	}
    return (
      <PitchMonitor
        noteName={noteName(number)}
        color={white ? constants.WHITE : constants.LIGHT_BLUE}
        key={pk}
      />
    );
  }

  render() {
    var rows = [];
    rows.push(this.renderPitchMonitor(3, 1));
    rows.push(this.renderPitchMonitor(10, 2));
    rows.push(this.renderPitchMonitor(5, 3));
    rows.push(this.renderPitchMonitor(0, 4));
    rows.push(this.renderPitchMonitor(7, 5));
    rows.push(this.renderPitchMonitor(2, 6));
    rows.push(this.renderPitchMonitor(9, 7));

    rows.push(this.renderPitchMonitor(0, 8));
    rows.push(this.renderPitchMonitor(7, 9));
    rows.push(this.renderPitchMonitor(2, 10));
    rows.push(this.renderPitchMonitor(9, 11));
    rows.push(this.renderPitchMonitor(4, 12));
    rows.push(this.renderPitchMonitor(11, 13));
    rows.push(this.renderPitchMonitor(6, 14));

	  rows.push(this.renderPitchMonitor(9, 15));
    rows.push(this.renderPitchMonitor(4, 16));
    rows.push(this.renderPitchMonitor(11, 17));
    rows.push(this.renderPitchMonitor(6, 18));
    rows.push(this.renderPitchMonitor(1, 19));
    rows.push(this.renderPitchMonitor(8, 20));
    rows.push(this.renderPitchMonitor(3, 21));

    rows.push(this.renderPitchMonitor(6, 22));
    rows.push(this.renderPitchMonitor(1, 23));
    rows.push(this.renderPitchMonitor(8, 24));
    rows.push(this.renderPitchMonitor(3, 25));
	  rows.push(this.renderPitchMonitor(10, 26));
    rows.push(this.renderPitchMonitor(5, 27));
    rows.push(this.renderPitchMonitor(0, 28));
    rows.push(this.renderPitchMonitor(7, 29));

    
    return (
      <div>
        <ul id="grid" className="clear">
          {rows}
        </ul>
      </div>
    );
  }
}

export class CircleOfFifthsGrid extends Component {

  renderPitchMonitor(i){
    return (
      <PitchMonitor
        noteName={noteName(i)}
        color={this.props.noteState[i] === 0 ? constants.WHITE : constants.LIGHT_BLUE}
        key={i}
      />
    );
  }

  render() {
    var rows = [];
    for (var i = 0; i < constants.N_OCTAVES * 12; i+=12){
      rows.push(BlankHexagon());
      rows.push(this.renderPitchMonitor(i + 7));
      rows.push(this.renderPitchMonitor(i + 9));
      rows.push(this.renderPitchMonitor(i + 11));
      rows.push(BlankHexagon());
      rows.push(this.renderPitchMonitor(i + 1));
      rows.push(this.renderPitchMonitor(i + 10));
      
      rows.push(this.renderPitchMonitor(i));
      rows.push(this.renderPitchMonitor(i + 2));
      rows.push(this.renderPitchMonitor(i + 4));
      rows.push(this.renderPitchMonitor(i + 6));
      rows.push(this.renderPitchMonitor(i + 8));
      rows.push(this.renderPitchMonitor(i + 3));
      rows.push(this.renderPitchMonitor(i + 5));

    }
    return (
      <div>
        <ul id="grid" className="clear">
          {rows}
        </ul>
      </div>
    );
  }
}
