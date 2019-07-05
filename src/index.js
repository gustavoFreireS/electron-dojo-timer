import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './containers/HomePage/HomePage';

const App = () => {
  return <HomePage />;
};

ReactDOM.render(<App />, document.getElementById('app'));
export default App;
