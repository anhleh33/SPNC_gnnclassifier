'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
        className={cn(
          'group peer data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-5 w-10 shrink-0 items-center rounded-full border border-border border-opacity-30 shadow-xs transition-all duration-150 ease-out outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-md hover:scale-105 hover:data-[state=checked]:bg-white-600 dark:hover:data-[state=checked]:bg-orange-700',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={
          'bg-white dark:bg-white pointer-events-none block h-5 w-5 rounded-full ring-0 transform-gpu transition-all duration-200 ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 flex items-center justify-center shadow-sm ring-0 border-2 border-white z-10 group-hover:scale-110'
        }
      >
        {children}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
