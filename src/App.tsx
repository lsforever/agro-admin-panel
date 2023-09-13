import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import Main from '@/routes/main'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'react-auth-kit'

function App() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <BrowserRouter>
                <AuthProvider
                    authType={'cookie'}
                    authName={'_auth'}
                    cookieDomain={window.location.hostname}
                    cookieSecure={window.location.protocol === 'https:'}
                >
                    <Main />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
