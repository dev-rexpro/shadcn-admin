import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Root as Radio, Item } from '@radix-ui/react-radio-group'
import { CircleCheck, RotateCcw } from 'lucide-react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { fonts } from '@/config/fonts'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { useDirection } from '@/context/direction-provider'
import { useFont } from '@/context/font-provider'
import { useSidebar } from '@/components/ui/sidebar'
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@/assets/custom/icon-layout-full'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@/assets/custom/icon-theme-system'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup as _RadioGroup, RadioGroupItem as _RadioGroupItem } from '@/components/ui/radio-group'

const appearanceFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  sidebar: z.enum(['inset', 'floating', 'sidebar']),
  layout: z.enum(['default', 'icon', 'offcanvas']),
  direction: z.enum(['ltr', 'rtl']),
  font: z.enum(fonts),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

function ConfigRadioItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string
    label: string
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
}) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary',
          'group-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'size-6 fill-primary stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />
        <item.icon
          className={cn(
            !isTheme &&
              'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'
          )}
          aria-hidden='true'
        />
      </div>
      <div className='mt-1 text-xs' id={`${item.value}-description`} aria-live='polite'>
        {item.label}
      </div>
    </Item>
  )
}

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const { theme, setTheme, defaultTheme } = useTheme()
  const { variant, setVariant, defaultVariant: _defaultVariant, defaultCollapsible, collapsible, setCollapsible } = useLayout()
  const { dir, setDir, defaultDir } = useDirection()
  const { open, setOpen } = useSidebar()

  const radioState = open ? 'default' : collapsible

  const defaultValues: Partial<AppearanceFormValues> = {
    theme: theme as 'system' | 'light' | 'dark',
    sidebar: variant,
    layout: radioState,
    direction: dir,
    font,
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  function onSubmit(data: AppearanceFormValues) {
    if (data.font != font) setFont(data.font)

    showSubmittedData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='theme'
          render={({ field: _field }) => (
            <FormItem>
              <div className='mb-2 flex items-center justify-between'>
                <FormLabel>Theme</FormLabel>
                <Button
                  type='button'
                  size='icon'
                  variant='secondary'
                  className='size-4 rounded-full'
                  onClick={() => setTheme(defaultTheme)}
                  aria-label='Reset theme preference to default'
                >
                  <RotateCcw className='size-3' />
                </Button>
              </div>
              <FormDescription>
                Choose between system preference, light mode, or dark mode
              </FormDescription>
              <FormMessage />
                <Radio
                  value={theme}
                  onValueChange={setTheme}
                  className='grid w-full max-w-md grid-cols-3 gap-4'
                  aria-label='Select theme preference'
                  aria-describedby='theme-description'
                >
                {[
                  { value: 'system', label: 'System', icon: IconThemeSystem },
                  { value: 'light', label: 'Light', icon: IconThemeLight },
                  { value: 'dark', label: 'Dark', icon: IconThemeDark },
                ].map((item) => (
                  <ConfigRadioItem key={item.value} item={item} isTheme />
                ))}
              </Radio>
              <div id='theme-description' className='sr-only'>
                Choose between system preference, light mode, or dark mode
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sidebar'
          render={({ field: _field }) => (
            <FormItem>
              <div className='mb-2 flex items-center justify-between'>
                <FormLabel>Sidebar</FormLabel>
                <Button
                  type='button'
                  size='icon'
                  variant='secondary'
                  className='size-4 rounded-full'
                  onClick={() => setVariant('sidebar')}
                  aria-label='Reset sidebar style to default'
                >
                  <RotateCcw className='size-3' />
                </Button>
              </div>
              <FormDescription className='sr-only'>
                Choose between inset, floating, or standard sidebar layout
              </FormDescription>
              <FormMessage />
                <Radio
                  value={variant}
                  onValueChange={setVariant}
                  className='grid w-full max-w-md grid-cols-3 gap-4'
                  aria-label='Select sidebar style'
                  aria-describedby='sidebar-description'
                >
                {[
                  { value: 'inset', label: 'Inset', icon: IconSidebarInset },
                  { value: 'floating', label: 'Floating', icon: IconSidebarFloating },
                  { value: 'sidebar', label: 'Sidebar', icon: IconSidebarSidebar },
                ].map((item) => (
                  <ConfigRadioItem key={item.value} item={item} />
                ))}
              </Radio>
              <div id='sidebar-description' className='sr-only'>
                Choose between inset, floating, or standard sidebar layout
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='layout'
          render={({ field: _field }) => (
            <FormItem>
              <div className='mb-2 flex items-center justify-between'>
                <FormLabel>Layout</FormLabel>
                <Button
                  type='button'
                  size='icon'
                  variant='secondary'
                  className='size-4 rounded-full'
                  onClick={() => {
                    setOpen(true)
                    setCollapsible(defaultCollapsible)
                  }}
                  aria-label='Reset layout options to default'
                >
                  <RotateCcw className='size-3' />
                </Button>
              </div>
              <FormDescription className='sr-only'>
                Choose between default expanded, compact icon-only, or full layout mode
              </FormDescription>
              <FormMessage />
                <Radio
                  value={radioState}
                  onValueChange={(v) => {
                    if (v === 'default') {
                      setOpen(true)
                    } else {
                      setOpen(false)
                      setCollapsible(v)
                    }
                  }}
                  className='grid w-full max-w-md grid-cols-3 gap-4'
                  aria-label='Select layout style'
                  aria-describedby='layout-description'
                >
                {[
                  { value: 'default', label: 'Default', icon: IconLayoutDefault },
                  { value: 'icon', label: 'Compact', icon: IconLayoutCompact },
                  { value: 'offcanvas', label: 'Full layout', icon: IconLayoutFull },
                ].map((item) => (
                  <ConfigRadioItem key={item.value} item={item} />
                ))}
              </Radio>
              <div id='layout-description' className='sr-only'>
                Choose between default expanded, compact icon-only, or full layout mode
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='direction'
          render={({ field: _field }) => (
            <FormItem>
              <div className='mb-2 flex items-center justify-between'>
                <FormLabel>Direction</FormLabel>
                <Button
                  type='button'
                  size='icon'
                  variant='secondary'
                  className='size-4 rounded-full'
                  onClick={() => setDir(defaultDir)}
                  aria-label='Reset text direction to default'
                >
                  <RotateCcw className='size-3' />
                </Button>
              </div>
              <FormDescription className='sr-only'>
                Choose between left-to-right or right-to-left site direction
              </FormDescription>
              <FormMessage />
                <Radio
                  value={dir}
                  onValueChange={setDir}
                  className='grid w-full max-w-md grid-cols-3 gap-4'
                  aria-label='Select site direction'
                  aria-describedby='direction-description'
                >
                {[
                  {
                    value: 'ltr',
                    label: 'Left to Right',
                    icon: (props: React.SVGProps<SVGSVGElement>) => (
                      <IconDir dir='ltr' {...props} />
                    ),
                  },
                  {
                    value: 'rtl',
                    label: 'Right to Left',
                    icon: (props: React.SVGProps<SVGSVGElement>) => (
                      <IconDir dir='rtl' {...props} />
                    ),
                  },
                ].map((item) => (
                  <ConfigRadioItem key={item.value} item={item} />
                ))}
              </Radio>
              <div id='direction-description' className='sr-only'>
                Choose between left-to-right or right-to-left site direction
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='font'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <div className='relative w-max'>
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-50 appearance-none font-normal capitalize',
                      'dark:bg-background dark:hover:bg-background'
                    )}
                    {...field}
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDownIcon className='absolute inset-e-3 top-2.5 h-4 w-4 opacity-50' />
              </div>
              <FormDescription className='font-manrope'>
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Update preferences</Button>
      </form>
    </Form>
  )
}
