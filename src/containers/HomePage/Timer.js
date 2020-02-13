import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import '../../stylesheets/timer.scss';
import * as pty from 'node-pty';
import * as os from 'os';
import { Terminal } from 'xterm';
import { exec } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import TestConfig from './TestConfig';


// what you want

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
    const term = new Terminal({
      fontFamily: 'Fira Code, Iosevka, monospace',
      fontSize: 12,
      experimentalCharAtlas: 'dynamic',
    });
    const terminal = window.open('', 'modal');
    terminal.document.write(
      `
        <style>
        .xterm {
          font-feature-settings: "liga" 0;
          position: relative;
          user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
      }

      .xterm.focus,
      .xterm:focus {
          outline: none;
      }

      .xterm .xterm-helpers {
          position: absolute;
          top: 0;
          /**
           * The z-index of the helpers must be higher than the canvases in order for
           * IMEs to appear on top.
           */
          z-index: 5;
      }

      .xterm .xterm-helper-textarea {
          /*
           * HACK: to fix IE's blinking cursor
           * Move textarea out of the screen to the far left, so that the cursor is not visible.
           */
          position: absolute;
          opacity: 0;
          left: -9999em;
          top: 0;
          width: 0;
          height: 0;
          z-index: -5;
          /** Prevent wrapping so the IME appears against the textarea at the correct position */
          white-space: nowrap;
          overflow: hidden;
          resize: none;
      }

      .xterm .composition-view {
          /* TODO: Composition position got messed up somewhere */
          background: #000;
          color: #FFF;
          display: none;
          position: absolute;
          white-space: nowrap;
          z-index: 1;
      }

      .xterm .composition-view.active {
          display: block;
      }

      .xterm .xterm-viewport {
          /* On OS X this is required in order for the scroll bar to appear fully opaque */
          background-color: #000;
          overflow-y: scroll;
          cursor: default;
          position: absolute;
          right: 0;
          left: 0;
          top: 0;
          bottom: 0;
      }

      .xterm .xterm-screen {
          position: relative;
      }

      .xterm .xterm-screen canvas {
          position: absolute;
          left: 0;
          top: 0;
      }

      .xterm .xterm-scroll-area {
          visibility: hidden;
      }

      .xterm-char-measure-element {
          display: inline-block;
          visibility: hidden;
          position: absolute;
          top: 0;
          left: -9999em;
          line-height: normal;
      }

      .xterm {
          cursor: text;
      }

      .xterm.enable-mouse-events {
          /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
          cursor: default;
      }

      .xterm.xterm-cursor-pointer {
          cursor: pointer;
      }

      .xterm.column-select.focus {
          /* Column selection mode */
          cursor: crosshair;
      }

      .xterm .xterm-accessibility,
      .xterm .xterm-message {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          z-index: 10;
          color: transparent;
      }

      .xterm .live-region {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
      }

      .xterm-dim {
          opacity: 0.5;
      }

      .xterm-underline {
          text-decoration: underline;
      }
        </style>
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
