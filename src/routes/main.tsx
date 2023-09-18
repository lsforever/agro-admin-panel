import Home from '@/pages/home'
import Login from '@/pages/login'
import CropPage from '@/views/crops'
import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from 'react-auth-kit'

import CropEdit from '@/views/crops/edit'
import CropCreate from '@/views/crops/create'
import Dashboard from '@/views/dashboard'
import Loading from '@/components/custom/loading'

const Main = () => {
    return (
        <Routes>
            {/* <Route
                path={'/'}
                element={
                    <RequireAuth loginPath={'/login'}>
                        <Home />
                    </RequireAuth>
                }
            /> */}
            <Route
                path='/'
                element={
                    <RequireAuth loginPath={'/login'}>
                        <Home />
                    </RequireAuth>
                }
            >
                <Route path='' element={<Dashboard />} />

                <Route path='analytics' element={<h1>Analytics</h1>} />

                <Route path='crops' element={<CropPage />} />
                <Route path='crops/edit' element={<CropEdit />} />
                <Route path='crops/create' element={<CropCreate />} />
                <Route path='crops/:id' element={<Loading />} />

                <Route
                    path='categories'
                    element={<h1 className='w-full'>Categories</h1>}
                />

                <Route path='users' element={<h1>Users</h1>} />
            </Route>
            <Route path='/login' element={<Login />} />
            {/* <Route path='/signup' element={<h1>Signup</h1>} /> */}
        </Routes>
    )
}

export default Main
