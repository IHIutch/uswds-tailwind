import type { VariantProps } from 'cva'
import { cva } from '../cva.config'

export const iconVariants = cva({
  variants: {
    icon: {
      'check-circle': 'icon-[material-symbols--check-circle]',
      'warning': 'icon-[material-symbols--warning]',
      'error': 'icon-[material-symbols--error]',
      'info': 'icon-[material-symbols--info]',
    },
  },
})

export type IconVariantProps = VariantProps<typeof iconVariants>
export type IconProps = Omit<IconVariantProps, 'icon'>
  & Required<Pick<IconVariantProps, 'icon'>> & React.HTMLAttributes<HTMLElement>

export function Icon({ icon, className, ...props }: IconProps) {
  return <div {...props} className={iconVariants({ icon, className })} />
}
