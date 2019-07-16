import React, { useState, useEffect } from 'react';
import '../../stylesheets/timer.scss';

const TestConfig = () => {
  const [config, setConfig] = useState({});
  const remote = require('electron').remote;
  const remoteObj = remote.getGlobal('sharedObject');
  useEffect(() => {
    setConfig({
      command: remoteObj.testCommand,
      path: remoteObj.testPath
    })
    console.log(config);
  }, []);
  const save = () => {
    const remote = require('electron').remote;
    const remoteObj =  remote.getGlobal('sharedObject');
    remoteObj.testCommand = config.command;
    remoteObj.testPath = config.path;
  }
  const change = (e) =>{
    const newConfig = config;
    console.log(e.target.id);
    newConfig[e.target.id] = e.target.value;
    setConfig(newConfig);
    console.log(config);
  }
  const style = {
    button: {
      marginTop: '20px',
      display: 'block',
      padding: '3px 5px',
    }
  }
  return (
    <div className="config">
      <p>Digite o path do teste</p>
      <input key="path" defaultValue={config.path} id="path" onChange={change}/>
      <p>Digite o comando de teste</p>
      <input key ="command" defaultValue={config.command} id="command" onChange={change}/>
      <button style={style.button}onClick={save}>salvar</button>
    </div>
  );
};

export default TestConfig;