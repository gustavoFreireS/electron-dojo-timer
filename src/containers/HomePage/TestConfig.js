import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';

import '../../stylesheets/timer.scss';

const TestConfig = () => {
  const [config, setConfig] = useState({});
  const remoteObj = remote.getGlobal('sharedObject');
  useEffect(() => {
    setConfig({
      command: remoteObj.testCommand,
      path: remoteObj.testPath,
    });
  }, []);
  const save = () => {
    remoteObj.testCommand = config.command;
    remoteObj.testPath = config.path;
  };
  const change = e => {
    const newConfig = config;
    newConfig[e.target.id] = e.target.value;
    setConfig(newConfig);
  };
  const style = {
    button: {
      marginTop: '20px',
      display: 'block',
      padding: '3px 5px',
    },
  };
  return (
    <div className="config">
      <p>Digite o path do teste</p>
      <input key="path" defaultValue={config.path} id="path" onChange={change} />
      <p>Digite o comando de teste</p>
      <input key="command" defaultValue={config.command} id="command" onChange={change} />
      <button type="button" style={style.button} onClick={save}>
        salvar
      </button>
    </div>
  );
};

export default TestConfig;
