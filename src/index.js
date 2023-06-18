import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { createStore } from "redux";
import App from './App';
import './styles/index.scss';
import rootReducer from "./reducers";

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(rootReducer);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
