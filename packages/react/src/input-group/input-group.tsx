import * as React from 'react'
import { cx } from '../cva.config'

type InputGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  startElement?: React.ReactNode
  endElement?: React.ReactNode
}

export interface InputGroupContextProps {
  hasStartElement?: boolean
  hasEndElement?: boolean
  // startElement?: React.ReactNode
  // endElement?: React.ReactNode
}

const InputGroupContext = React.createContext<InputGroupContextProps | null>(null)

export function useInputGroupContext() {
  return React.useContext(InputGroupContext)
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, startElement, endElement, ...props }, forwardedRef) => {
    return (
      <InputGroupContext.Provider
        value={{
          hasStartElement: Boolean(startElement),
          hasEndElement: Boolean(endElement),
        }}
      >
        <div
          ref={forwardedRef}
          {...props}
          className={cx('mt-2 max-w-mobile-lg relative flex items-center', className)}
        >
          {startElement ?? null}
          {children}
          {endElement ?? null}
        </div>
      </InputGroupContext.Provider>
    )
  },
)
