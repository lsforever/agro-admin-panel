import Home from '@/pages/home'
import Login from '@/pages/login/page'
import DemoPage from '@/views/crops/page'
import { Routes, Route } from 'react-router-dom'

const Main = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />}>
                <Route path='crops' element={<DemoPage />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<h1>Signup</h1>} />
        </Routes>
    )
}

export default Main
