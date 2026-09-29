import type { AccordionTheme } from './accordion-styles'
import * as accordion from '@uswds-tailwind/accordion-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'
import { accordionStyles } from './accordion-styles'

interface Props {
  theme: AccordionTheme
  startingProps: Pick<accordion.Props, 'multiple' | 'defaultValue'>
  onValueChange: (details: accordion.ValueChangeDetails) => void
}

const accordionItems = [
  { value: 'one', label: 'How does an item open?', content: 'Select a button to update the expanded value and reveal its panel.' },
  { value: 'two', label: 'How are buttons and panels connected?', content: 'Each button identifies its panel and reports whether it is open.' },
]

export default function HeadlessAccordion({ theme, startingProps, onValueChange }: Props) {
  const id = useId()
  const service = useMachine(accordion.machine, { id, ...startingProps, onValueChange })
  const api = accordion.connect(service, normalizeProps)
  const styles = accordionStyles({ styled: theme !== 'styleless', theme })

  return (
    <div {...api.getRootProps()} className={styles.root()}>
      {accordionItems.map(item => (
        <div {...api.getItemProps(item)} key={item.value}>
          <button {...api.getItemTriggerProps(item)} className={styles.trigger()}>
            <span>{item.label}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.icon()}>
              <path className={styles.plus()} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              <path className={styles.minus()} d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
          <div {...api.getItemContentProps(item)} className={styles.panel()} aria-labelledby={api.getItemTriggerProps(item).id}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  )
}
