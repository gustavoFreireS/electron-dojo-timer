import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../../stylesheets/timer.scss';

const Timer = () => {
  const [currentState, setCurrentState] = useState('stopped');
  const [duration, setDuration] = useState(0);

  const play = () => {
    setCurrentState('playing')
  }

  const stop = () => {
    setDuration(0)
    setCurrentState('stopped')
  }

  const pause = () => {
    setCurrentState('paused')
  }

  useEffect(() => {
    var timerID = setInterval( () => tick(), 1000 );
   
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    if (currentState === 'playing') { 
      setDuration(duration + 1000)
    }
  }

  if (currentState === 'playing' && duration >= 5 * 60 * 1000) {
    setCurrentState('ended')
    setDuration(0)
  }

  return (
    <div className="timer__container">
      <div className="timer__stopwatch">
        {currentState === 'ended' && 'TIMEOVER'}
        {currentState !== 'ended' && moment.utc(duration).format('mm:ss')}
      </div>
      <div className="timer__actions">
        {(currentState === 'stopped' || currentState === 'paused' || currentState === 'ended') && (
          <button type="button" className="timer__button timer__button--play" onClick={play}><i className="fa fa-play" /></button>
        )}
        {currentState === 'playing' && (
          <button type="button" className="timer__button timer__button--pause" onClick={pause}><i className="fa fa-pause" /></button>
        )}
        {(currentState === 'paused'|| currentState === 'playing') && (
          <button type="button" className="timer__button timer__button--stop" onClick={stop}><i className="fa fa-stop" /></button>
        )}
        <button className="timer__button timer__button--test"><i className="fa fa-bolt" /></button>
      </div>
    </div>
  );
};


export default Timer;