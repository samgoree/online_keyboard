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

  renderPitchMonitor(i){
  	var white = true;
  	for (var octave = 0; octave < constants.N_OCTAVES; octave++){
  		if(this.props.noteState[i + 12 * octave] !== 0){
  			white = false;
  		}
  	}
    return (
      <PitchMonitor
        noteName={noteName(i)}
        color={white ? constants.WHITE : constants.LIGHT_BLUE}
        key={i}
      />
    );
  }

  render() {
    var rows = [];
    rows.push(this.renderPitchMonitor(3));
    rows.push(this.renderPitchMonitor(10));
    rows.push(this.renderPitchMonitor(5));
    rows.push(this.renderPitchMonitor(0));
    rows.push(this.renderPitchMonitor(7));
    rows.push(this.renderPitchMonitor(2));
    rows.push(this.renderPitchMonitor(9));

    rows.push(this.renderPitchMonitor(0));
    rows.push(this.renderPitchMonitor(7));
    rows.push(this.renderPitchMonitor(2));
    rows.push(this.renderPitchMonitor(9));
    rows.push(this.renderPitchMonitor(4));
    rows.push(this.renderPitchMonitor(11));
    rows.push(this.renderPitchMonitor(6));

	rows.push(this.renderPitchMonitor(9));
    rows.push(this.renderPitchMonitor(4));
    rows.push(this.renderPitchMonitor(11));
    rows.push(this.renderPitchMonitor(6));
    rows.push(this.renderPitchMonitor(1));
    rows.push(this.renderPitchMonitor(8));
    rows.push(this.renderPitchMonitor(3));

    rows.push(this.renderPitchMonitor(6));
    rows.push(this.renderPitchMonitor(1));
    rows.push(this.renderPitchMonitor(8));
    rows.push(this.renderPitchMonitor(3));
	rows.push(this.renderPitchMonitor(10));
    rows.push(this.renderPitchMonitor(5));
    rows.push(this.renderPitchMonitor(0));
    rows.push(this.renderPitchMonitor(7));

    
    return (
      <div>
        <ul id="grid" className="clear">
          {rows}
        </ul>
      </div>
    );
  }
}