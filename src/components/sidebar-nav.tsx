import { cn } from '@/lib/utils'

// interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
//     playlists: Playlist[]
// }

import { SidebarNavItem } from '@/components/sidebar-nav-item'
import {
  LeafyGreen,
  LayoutDashboard,
  Gauge,
  Group,
  UserCircle,
} from 'lucide-react'

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-r pb-12', className)}>
      <div className='space-y-4 py-4'>
        <div className='px-3 py-2'>
          <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            Main
          </h2>
          <div className='space-y-1'>
            <SidebarNavItem path='/' text='Dashboard' Icon={LayoutDashboard} />
            <SidebarNavItem path='/analytics' text='Analytics' Icon={Gauge} />
          </div>
        </div>
        <div className='px-3 py-2'>
          <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            Data
          </h2>
          <div className='space-y-1'>
            <SidebarNavItem path='/crops' text='Crops' Icon={LeafyGreen} />
            <SidebarNavItem path='/categories' text='Categories' Icon={Group} />
          </div>
        </div>
        <div className='px-3 py-2'>
          <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            Manage
          </h2>
          <div className='space-y-1'>
            <SidebarNavItem path='/users' text='Users' Icon={UserCircle} />
          </div>
        </div>
      </div>
    </div>
  )
}
