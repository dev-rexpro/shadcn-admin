import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import {
  SidebarControllersProvider,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const defaultRightOpen = getCookie('right_sidebar_state') === 'true'

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarControllersProvider>
          <SidebarProvider defaultOpen={defaultOpen} cookieName='sidebar_state'>
          <SkipToMain />
          <div className='flex min-h-svh w-full'>
            <AppSidebar />
            <SidebarInset
              className={cn(
                // Set content container, so we can use container queries
                '@container/content',

                // If layout is fixed, set the height
                // to 100svh to prevent overflow
                'has-data-[layout=fixed]:h-svh',

                // If layout is fixed and sidebar is inset,
                // set the height to 100svh - spacing (total margins) to prevent overflow
                'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
              )}
            >
              {children ?? <Outlet />}
            </SidebarInset>
            <SidebarProvider
              defaultOpen={defaultRightOpen}
              cookieName='right_sidebar_state'
              side='right'
              className='w-auto flex-none'
              width='320px'
            >
              <AppSidebar side='right' />
            </SidebarProvider>
          </div>
        </SidebarProvider>
        </SidebarControllersProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
