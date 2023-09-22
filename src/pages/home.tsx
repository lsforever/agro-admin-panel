import Header from '@/components/header'
import { Sidebar } from '@/components/sidebar-nav'
import { Outlet } from 'react-router-dom'
const Home = () => {
  return (
    <div className='h-screen'>
      <Header />
      <div className='flex h-[calc(100vh-65px)]'>
        <Sidebar className='w-64 shrink-0 grow-0 selection:flex-none' />
        <Outlet />
      </div>
    </div>
  )
}

export default Home
