import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import reducer from './redux';

const store = createStore(reducer);


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
)