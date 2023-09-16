import Home from '@/pages/home'
import Login from '@/pages/login'
import CropPage from '@/views/crops'
import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from 'react-auth-kit'

import CropEdit from '@/views/crops/edit'
import CropCreate from '@/views/crops/create'
import Loading from '@/components/custom/loading'

const Main = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />}>
                <Route path='crops' element={<CropPage />} />
                <Route path='crops/edit' element={<CropEdit />} />
                <Route path='crops/create' element={<CropCreate />} />
                <Route path='crops/:id' element={<Loading />} />
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
