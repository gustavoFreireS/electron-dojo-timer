import React from 'react';
import '../../stylesheets/timer.scss';
import PropTypes from 'prop-types';

const Timer = props => {
  return (
    <div className="timer__container">
      <p>11:30</p>
      <div className="button__section">
        <button>▶</button><button>||</button>
        <button className="testButton">Run Tests</button>
      </div>
    </div>
  );
};

Timer.propTypes = {
  
};

export default Timer;