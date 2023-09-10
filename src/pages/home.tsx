import Header from '@/components/header'
import { Sidebar } from '@/components/sidebar-nav'
import { Outlet } from 'react-router-dom'
const Home = () => {
    return (
        <>
            <Header />
            <div className='flex'>
                <Sidebar className='w-64' />
                <Outlet />
            </div>
        </>
    )
}

export default Home
