import './App.css'
import Header from './components/header'
import { Sidebar } from './components/sidebar-nav'

function App() {
    return (
        <>
            <Header />
            <div className='flex w-1/6'>
                <Sidebar />
            </div>
        </>
    )
}

export default App
