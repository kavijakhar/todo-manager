import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './App.css';
import Todos from './component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={store}>
      <Todos />
      <ToastContainer autoClose={1000} />
    </Provider>
  );
}

export default App;
