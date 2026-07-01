import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { LayoutProvider } from '@/context/layout-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'

describe('AppSidebar', () => {
  it('renders a standalone right sidebar when configured', async () => {
    const { container } = await render(
      <LayoutProvider>
        <SidebarProvider defaultOpen>
          <AppSidebar side='right' />
        </SidebarProvider>
      </LayoutProvider>
    )

    expect(container.querySelector('[data-side="right"]')).not.toBeNull()
  })
})
