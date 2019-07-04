import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../../stylesheets/timer.scss';

class Timer extends React.Component {
  constructor(props){
    super(props);
    this.ONE_SECOND = 1000
    this.THRESHOLD = 5 * 60 * ONE_SECOND
    this.currentState, this.setCurrentState = useState('stopped');
    this.counter, this.setCounter = useState(THRESHOLD);
  }

  componentDidMount() {
    useEffect(() => {
        return function cleanup() {
            clearInterval(setInterval(() => this.tick(), this.ONE_SECOND));
        };
    });
    if (currentState === 'playing' && this.counter === 0) {
        this.setCurrentState('ended');
        this.setCounter(THRESHOLD);
    }
  }

  play() {
    setCurrentState('playing');
  }

  stop() {
    this.setCounter(THRESHOLD);
    this.setCurrentState('stopped');
  }

  pause() {
    this.setCurrentState('paused');
  }

  tick() {
    if (currentState === 'playing') {
      this.setCounter(this.counter - this.ONE_SECOND);
    }
  }

  render(){
    return (
        <div className="timer__container">
        <div className="timer__stopwatch">
            {currentState === 'ended' && 'TIMEOVER'}
            {currentState !== 'ended' && moment.utc(this.counter).format('mm:ss')}
        </div>
        <div className="timer__actions">
            {(currentState === 'stopped' || currentState === 'paused' || currentState === 'ended') && (
            <button type="button" className="timer__button timer__button--play" onClick={this.play}><i className="fa fa-play" /></button>
            )}
            {currentState === 'playing' && (
            <button type="button" className="timer__button timer__button--pause" onClick={this.pause}><i className="fa fa-pause" /></button>
            )}
            {(currentState === 'paused'|| currentState === 'playing') && (
            <button type="button" className="timer__button timer__button--stop" onClick={this.stop}><i className="fa fa-stop" /></button>
            )}
            <button className="timer__button timer__button--test"><i className="fa fa-bolt" /></button>
        </div>
        </div>
    );
  }
};


export default Timer;
