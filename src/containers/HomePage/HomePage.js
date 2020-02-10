import React, { Fragment } from 'react';
import Timer from './Timer';
import '../../stylesheets/styles.scss';
import { remote } from 'electron';

const window = remote.getCurrentWindow();

const HomePage = () => {
  return (
    <Fragment>
      <div className="dragBar">
      </div>
      
      <Timer />
      <a href="#" class="close" onClick={() => window.close()} />
    </Fragment>
  );
};

export default HomePage;
