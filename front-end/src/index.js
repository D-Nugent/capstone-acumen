import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/App';
import {BrowserRouter as Router} from 'react-router-dom';
import FirebaseProvider from './provider/FirebaseProvider'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
