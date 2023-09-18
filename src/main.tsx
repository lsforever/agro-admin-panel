import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

const ci_b =
    '148267645714-aantr2crekp5pjokud80s426fb7lb7sg.apps.googleusercontent.com'

const ci_web =
    '148267645714-5iq43m9ekje8vh7u80jf545448d4gko8.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={ci_web}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
)
