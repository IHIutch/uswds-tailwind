import type { VariantProps } from 'cva'
import type { ButtonProps, buttonVariants } from '../button/button'
import React from 'react'
import { Button } from '../button/button'
import { cva, cx } from '../cva.config'

const buttonGroupRootVariant = cva({
  base: 'flex',
  variants: {
    segmented: {
      true: '@container',
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

type ButtonGroupRootProps = React.HTMLAttributes<HTMLUListElement> & ButtonGroupContextProps

export const ButtonGroupRoot = React.forwardRef<HTMLUListElement, ButtonGroupRootProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <ButtonGroupContext.Provider value={props}>
        <ul
          {...props}
          className={cx(
            buttonGroupRootVariant({
              segmented: Boolean(props.segmented),
              className,
            }),
          )}
          data-segmented={props.segmented}
          ref={forwardedRef}
        >
          {React.Children.map(children, (child, index) => (
            <li
              key={index}
              className={cx(
                'flex',
                props.segmented ? 'grow @tablet:grow-0 group' : '',
              )}
            >
              {child}
            </li>
          ))}
        </ul>
      </ButtonGroupContext.Provider>
    )
  },
)

const buttonGroupButtonVariant = cva({
  base: 'grow',
  variants: {
    segmented: {
      true: 'group-first:rounded-s-sm group-first:border-s-0 group-last:rounded-e-sm group-last:border-e-0 rounded-none hover:z-10 focus:z-10',
    },
    outline: {
      true: 'group-not-first:-ms-0.5',
      false: 'group-not-first:-ms-px',
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
