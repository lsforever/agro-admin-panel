import Home from '@/pages/home'
import Login from '@/pages/login'
import DemoPage from '@/views/crops'
import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from 'react-auth-kit'

const Main = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />}>
                <Route path='crops' element={<DemoPage />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<h1>Signup</h1>} />
            <Route
                path={'/secure'}
                element={
                    <RequireAuth loginPath={'/login'}>
                        <div>Secure</div>
                    </RequireAuth>
                }
            />
        </Routes>
    )
}

export default Main
