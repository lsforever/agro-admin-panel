import Home from '@/pages/home'
import Login from '@/pages/login'
import CropPage from '@/views/crops'
import CategoryPage from '@/views/categories'
import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from 'react-auth-kit'

import CropEdit from '@/views/crops/edit'
import CropCreate from '@/views/crops/create'
import CategoryCreate from '@/views/categories/create'
import CategoryEdit from '@/views/categories/edit'

import Dashboard from '@/views/dashboard'
import Loading from '@/components/custom/loading'
import UsersView from '@/views/users'

import AnalyticsPage from '@/views/analytics'

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

        <Route path='analytics' element={<AnalyticsPage />} />

        <Route path='crops' element={<CropPage />} />
        <Route path='crops/edit' element={<CropEdit />} />
        <Route path='crops/create' element={<CropCreate />} />
        <Route path='crops/:cropId' element={<Loading />} />

        <Route path='categories' element={<CategoryPage />} />
        <Route path='categories/create' element={<CategoryCreate />} />
        <Route path='categories/edit/:categoryId' element={<CategoryEdit />} />

        <Route path='users' element={<UsersView />} />
      </Route>
      <Route path='/login' element={<Login />} />

      {/* <Route path='/signup' element={<h1>Signup</h1>} /> */}
    </Routes>
  )
}

export default Main
