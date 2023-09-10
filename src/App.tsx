import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import Main from '@/routes/main'
import { BrowserRouter } from 'react-router-dom'

function App() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <BrowserRouter>
                <Main />
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App

// function App() {
//     return (
//         <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
//             {children}
//         </ThemeProvider>
//     )
// }

// export default App
