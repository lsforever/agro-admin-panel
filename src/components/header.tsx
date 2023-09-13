//import { MainNav } from '@/components/main-nav'
import { Search } from '@/components/search'
//import TeamSwitcher from '@/app/examples/dashboard/components/team-switcher'
import { UserNav } from '@/components/user-nav'
import { ModeToggle } from '@/components/mode-toggle'

export default function Header() {
    return (
        <>
            <div className='border-b'>
                {/* <div className='flex h-16 items-center px-8'>
                    <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
                        Agro Admin
                    </h4>
                    <MainNav className='mx-6' />
                    <div className='ml-auto flex items-center space-x-4'>
                        <Search />
                        <ModeToggle />
                        <UserNav />
                    </div>
                </div> */}

                <div className='flex h-16 items-center px-4'>
                    <h4 className='scroll-m-20 text-xl font-bold tracking-tight ml-4'>
                        Agro Admin
                    </h4>
                    {/* <MainNav className='mx-6' /> */}
                    <div className='ml-auto flex items-center space-x-4'>
                        <Search />
                        <ModeToggle />
                        <UserNav />
                    </div>
                </div>
            </div>
        </>
    )
}
