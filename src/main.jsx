import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';

import { store } from './providers/store.js';
import App from './App.jsx';

import GlobalStyles from './components/GlobalStyles/index.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyles>
            <Provider store={store}>
                <GoogleOAuthProvider clientId="973528131203-6ev1slv3n5f4udef9ene1214jlchb44j.apps.googleusercontent.com">
                    <App />
                </GoogleOAuthProvider>
            </Provider>
        </GlobalStyles>
    </React.StrictMode>,
);
