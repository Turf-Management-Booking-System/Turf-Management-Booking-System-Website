import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index.js';
import './index.css'
import App from './App.jsx'
const store = configureStore({
  reducer:rootReducer,
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
     <Toaster/>
    </Provider>
    
  </StrictMode>,
)
