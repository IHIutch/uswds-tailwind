import type { ButtonProps, buttonVariants } from '../button/button'
import type { VariantProps } from '../tv.config'
import React from 'react'
import { Button } from '../button/button'
import { tv } from '../tv.config'

const buttonGroupVariants = tv({
  slots: {
    root: 'flex',
    button: 'grow mobile-lg:grow-0',
  },
  variants: {
    segmented: {
      true: {
        button:
          'first:rounded-s-sm first:border-s-0 last:rounded-e-sm last:border-e-0 rounded-none hover:z-10 focus:z-10',
      },
      false: {
        root: 'mobile-lg:flex-row flex-col gap-2',
      },
    },
    outline: {
      true: {
        button: 'not-first:-ms-0.5',
      },
      false: {
        button: 'not-first:-ms-px',
      },
    },
  },
  compoundVariants: [
    {
      segmented: true,
      outline: false,
      className: {
        button: 'border-x',
      },
    },
  ],
  defaultVariants: {
    segmented: false,
    outline: false,
  },
})

export type ButtonGroupContextProps = Pick<VariantProps<typeof buttonGroupVariants>, 'segmented'> & VariantProps<typeof buttonVariants>

const ButtonGroupContext = React.createContext<ButtonGroupContextProps | null>(null)

export function useButtonGroupContext() {
  return React.useContext(ButtonGroupContext)
}

export type ButtonGroupRootProps = React.ComponentPropsWithoutRef<'div'> & ButtonGroupContextProps

export const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { root } = buttonGroupVariants({ segmented: Boolean(props.segmented) })
    return (
      <ButtonGroupContext.Provider value={props}>
        <div
          {...props}
          role="group"
          className={root({ className })}
          ref={forwardedRef}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    )
  },
)

export const ButtonGroupButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, forwardedRef) => {
    const buttonGroup = useButtonGroupContext()
    const { button } = buttonGroupVariants({
      segmented: Boolean(buttonGroup?.segmented),
      outline: Boolean(buttonGroup?.variant === 'outline' || buttonGroup?.variant === 'inverse'),
    })

    return (
      <Button
        {...props}
        variant={props.variant ?? buttonGroup?.variant}
        size={props.size ?? buttonGroup?.size}
        unstyled={Boolean(props.unstyled ?? buttonGroup?.unstyled)}
        className={button({ className })}
        ref={forwardedRef}
      />
    )
  },
)

ButtonGroupRoot.displayName = 'ButtonGroup.Root'
ButtonGroupButton.displayName = 'ButtonGroup.Button'

export const ButtonGroup = {
  Root: ButtonGroupRoot,
  Button: ButtonGroupButton,
}
