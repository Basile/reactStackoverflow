import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import StackoverflowApi from './util/StackoverflowApi';

ReactDOM.render(<App api={new StackoverflowApi()} />, document.getElementById('root'));
registerServiceWorker();
