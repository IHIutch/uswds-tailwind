import type { VariantProps } from 'cva'
import type { ButtonProps, buttonVariants } from '../button/button'
import React from 'react'
import { Button } from '../button/button'
import { cva, cx } from '../cva.config'

const buttonGroupRootVariant = cva({
  base: 'flex @container',
  variants: {
    segmented: {
      // We use a container query and a media query, in case the parent doesn't set a container, but it would be nice to not need both
      false: '@max-mobile-lg:flex-col max-mobile-lg:flex-col flex-row gap-2',
    },
  },
  defaultVariants: {
    segmented: false,
  },
})

export type ButtonGroupContextProps = VariantProps<typeof buttonGroupRootVariant> & VariantProps<typeof buttonVariants>

const ButtonGroupContext = React.createContext<ButtonGroupContextProps | null>(null)

export function useButtonGroupContext() {
  return React.useContext(ButtonGroupContext)
}

type ButtonGroupRootProps = React.HTMLAttributes<HTMLDivElement> & ButtonGroupContextProps

export const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <ButtonGroupContext.Provider value={props}>
        <div
          {...props}
          role="group"
          className={cx(
            buttonGroupRootVariant({
              segmented: Boolean(props.segmented),
              className,
            }),
          )}
          ref={forwardedRef}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    )
  },
)

const buttonGroupButtonVariant = cva({
  base: 'grow @tablet:grow-0',
  variants: {
    segmented: {
      true: 'first:rounded-s-sm first:border-s-0 last:rounded-e-sm last:border-e-0 rounded-none hover:z-10 focus:z-10',
    },
    outline: {
      true: 'not-first:-ms-0.5',
      false: 'not-first:-ms-px',
    },
  },
  compoundVariants: [{
    segmented: true,
    outline: false,
    className: 'border-x',
  }],
  defaultVariants: {
    segmented: false,
    outline: false,
  },
})

export const ButtonGroupButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, forwardedRef) => {
    const buttonGroup = useButtonGroupContext()

    return (
      <Button
        {...props}
        variant={props.variant ?? buttonGroup?.variant}
        size={props.size ?? buttonGroup?.size}
        unstyled={Boolean(props.unstyled ?? buttonGroup?.unstyled)}
        className={cx(
          buttonGroupButtonVariant({
            segmented: Boolean(buttonGroup?.segmented),
            outline: Boolean(buttonGroup?.variant === 'outline' || buttonGroup?.variant === 'inverse'),
            className,
          }),
        )}
        ref={forwardedRef}
      />
    )
  },
)

export const ButtonGroup = {
  Root: ButtonGroupRoot,
  Button: ButtonGroupButton,
}

export default ButtonGroup
