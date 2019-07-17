import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import '../../stylesheets/timer.scss';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as pty from 'node-pty';
import * as os from 'os';
import { Terminal } from 'xterm';
import { exec } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import TestConfig from './TestConfig';

const Timer = () => {
  const ONE_SECOND = 1000;
  const THRESHOLD = 5 * 60 * ONE_SECOND;

  const [currentState, setCurrentState] = useState('stopped');
  const [counter, setCounter] = useState(THRESHOLD);
  const [color, setColor] = useState('');

  const play = () => {
    setCurrentState('playing');
  };

  const stop = () => {
    setCounter(THRESHOLD);
    setCurrentState('stopped');
  };

  const pause = () => {
    setCurrentState('paused');
  };

  const tick = () => {
    if (currentState === 'playing') {
      setCounter(counter - ONE_SECOND);
    }
  };

  useEffect(() => {
    const timerID = setInterval(tick, ONE_SECOND);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  if (currentState === 'playing' && counter === 0) {
    setCurrentState('ended');
    setCounter(THRESHOLD);
  }
  const config = () => {
    const modal = window.open('', 'modal');
    modal.document.write('<div id="modal"/>');
    ReactDOM.render(<TestConfig />, modal.document.getElementById('modal'));
  };
  const test = () => {
    const remoteObj = remote.getGlobal('sharedObject');
    Terminal.applyAddon(fit);
    const term = new Terminal({
      fontFamily: 'Fira Code, Iosevka, monospace',
      fontSize: 12,
      experimentalCharAtlas: 'dynamic',
    });
    const terminal = window.open('', 'modal');
    terminal.document.write(
      `
        <link rel="stylesheet" href="node_modules/xterm/lib/xterm.css" />
        <style>
        html, body, #term {
          margin: 0;
          height: 100%;
          width: 100%;
          background-color: black;
      }
      
      *, *::before, *::after {
          box-sizing: border-box;
      }
      
        </style>
        <div id="term"></div>
      `,
    );
    const terminalElem = terminal.document.getElementById('term');
    term.open(terminalElem);
    const ptyProc = pty.spawn(
      os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash',
      [],
      {
        cols: term.cols,
        rows: term.rows,
      },
    );
    term.on('data', data => {
      ptyProc.write(data);
    });
    ptyProc.on('data', data => {
      term.write(data);
    });
    term.on('resize', size => {
      ptyProc.resize(
        Math.max(size ? size.cols : term.cols, 1),
        Math.max(size ? size.rows : term.rows, 1),
      );
    });
    ptyProc.write(`cd '${remoteObj.testPath}' && ${remoteObj.testCommand} \r`);
    exec(`cd '${remoteObj.testPath}' && ${remoteObj.testCommand}`, error => {
      if (!error) {
        setColor('#4daf7c');
      } else {
        setColor('red');
      }
    });
  };

  return (
    <div className="timer__container" style={{ background: color }}>
      <div className="timer__stopwatch">
        {currentState === 'ended' && 'TIMEOVER'}
        {currentState !== 'ended' && moment.utc(counter).format('mm:ss')}
      </div>
      <div className="timer__actions">
        {(currentState === 'stopped' || currentState === 'paused' || currentState === 'ended') && (
          <button type="button" className="timer__button timer__button--play" onClick={play}>
            <i className="fa fa-play" />
          </button>
        )}
        {currentState === 'playing' && (
          <button type="button" className="timer__button timer__button--pause" onClick={pause}>
            <i className="fa fa-pause" />
          </button>
        )}
        {(currentState === 'paused' || currentState === 'playing') && (
          <button type="button" className="timer__button timer__button--stop" onClick={stop}>
            <i className="fa fa-stop" />
          </button>
        )}
        <button type="button" className="timer__button timer__button--test" onClick={test}>
          <i className="fa fa-bolt" />
        </button>
        <button type="button" className="timer__button timer__button--test" onClick={config}>
          <i className="fa fa-cog" />
        </button>
      </div>
    </div>
  );
};

export default Timer;
