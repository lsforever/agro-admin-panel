import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
;<GoogleOAuthProvider clientId='<your_client_id>'>...</GoogleOAuthProvider>
ReactDOM.createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId='148267645714-5iq43m9ekje8vh7u80jf545448d4gko8.apps.googleusercontent.com'>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
)
