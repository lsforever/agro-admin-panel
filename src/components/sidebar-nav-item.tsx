import * as React from 'react'

import { ElementType } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
type NavItemProps = {
    path: string
    text: string
    Icon: ElementType
} & React.HTMLAttributes<HTMLDivElement>

function SidebarNavItem({ className, path, text, Icon }: NavItemProps) {
    return (
        <NavLink
            to={path}
            className={className}
            children={({ isActive }) => (
                <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className='w-full justify-start'
                >
                    <Icon className='mr-2 h-4 w-4' />
                    {text}
                </Button>
            )}
        />
    )
}

export { SidebarNavItem }
