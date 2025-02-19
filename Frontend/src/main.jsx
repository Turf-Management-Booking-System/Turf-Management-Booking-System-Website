import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index.js';
import { PersistGate } from 'redux-persist/integration/react'; // Add this import
import { persistStore } from 'redux-persist'; // Add this import

import './index.css'
import App from './App.jsx'
const store = configureStore({
  reducer:rootReducer,
})
const persistor = persistStore(store);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <PersistGate persistor={persistor}>
    <App/>
    </PersistGate>
    </BrowserRouter>
     <Toaster/>
    </Provider>
    
  </StrictMode>,
)
