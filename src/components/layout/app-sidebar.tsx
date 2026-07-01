import { useLayout } from '@/context/layout-provider'
import { Logo } from '@/assets/logo'
import { X } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

type AppSidebarProps = {
  side?: 'left' | 'right'
}

export function AppSidebar({ side = 'left' }: AppSidebarProps) {
  const { collapsible, variant, ghostSidebar } = useLayout()
  const sidebarCollapsible = side === 'right' ? 'offcanvas' : collapsible

  if (side === 'right') {
    const { toggleSidebar } = useSidebar()

    return (
      <Sidebar
        side={side}
        collapsible={sidebarCollapsible}
        variant={variant}
        ghost={ghostSidebar}
      >
        <SidebarHeader>
          <div className='flex items-center justify-between gap-2 h-7'>
            <Button
              variant='outline'
              size='sm'
              className='h-7 rounded-md px-2 text-sm font-semibold'
              onClick={() => undefined}
            >
              Controls
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-7 w-7 rounded-md'
              onClick={toggleSidebar}
            >
              <X className='size-4' />
              <span className='sr-only'>Close Controls</span>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar
      side={side}
      collapsible={collapsible}
      variant={variant}
      ghost={ghostSidebar}
    >
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
