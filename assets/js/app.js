import React from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';

console.log('Hello Webpack !!!');

const App = () => {
    return <h1>Bonjour à tous</h1>;
};

const rootElement = document.getElementById('app');
ReactDOM.render(<App />, rootElement);