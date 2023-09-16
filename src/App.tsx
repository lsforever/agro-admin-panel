import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import Main from '@/routes/main'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'react-auth-kit'

import { Toaster } from '@/components/ui/toaster'

import { QueryClient, QueryClientProvider } from 'react-query'
const queryClient = new QueryClient()

function App() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider
                        authType={'cookie'}
                        authName={'_auth'}
                        cookieDomain={window.location.hostname}
                        cookieSecure={window.location.protocol === 'https:'}
                    >
                        <Main />
                        <Toaster />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App
