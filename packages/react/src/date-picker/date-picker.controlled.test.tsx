import type { DatePickerRootProps } from './date-picker'
import * as React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { DatePicker } from './date-picker'

function DayGrid() {
  return (
    <DatePicker.Content>
      <DatePicker.View view="day">
        {({ api }) => (
          <DatePicker.Table>
            <DatePicker.TableBody>
              {api.weeks.map((week, row) => (
                <DatePicker.TableRow key={row}>
                  {week.map(cell => (
                    <DatePicker.TableCell key={cell.toISOString()} value={cell}>
                      <DatePicker.TableCellTrigger value={cell}>
                        {cell.getDate()}
                      </DatePicker.TableCellTrigger>
                    </DatePicker.TableCell>
                  ))}
                </DatePicker.TableRow>
              ))}
            </DatePicker.TableBody>
          </DatePicker.Table>
        )}
      </DatePicker.View>
    </DatePicker.Content>
  )
}

// A parent that owns the value, accepting or rejecting each proposal.
function ControlledDatePicker({ initial, accept = true, onValueChange, ...props }: DatePickerRootProps & {
  initial: (Date | undefined)[]
  accept?: boolean
}) {
  const [value, setValue] = React.useState<(Date | undefined)[]>(initial)
  return (
    <>
      <DatePicker.Root
        {...props}
        value={value}
        onValueChange={(details) => {
          onValueChange?.(details)
          if (accept)
            setValue(details.value)
        }}
      >
        <DatePicker.Control>
          <DatePicker.Input aria-label="Date" />
          <DatePicker.Trigger />
        </DatePicker.Control>
        <DayGrid />
      </DatePicker.Root>
      <button type="button" onClick={() => setValue([new Date(2024, 6, 4)])}>Set July 4</button>
    </>
  )
}

it('shows the chosen date when the parent accepts it', async () => {
  const screen = await render(<ControlledDatePicker initial={[new Date(2024, 5, 15)]} />)
  await expect.element(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('06/15/2024')

  await userEvent.click(screen.getByRole('button', { name: 'Toggle calendar' }))
  await userEvent.click(screen.getByRole('button', { name: '20 June 2024 Thursday' }))
  await expect.element(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('06/20/2024')
})

it('keeps the parent\'s date when the parent rejects the change', async () => {
  const onValueChange = vi.fn()
  const screen = await render(<ControlledDatePicker initial={[new Date(2024, 5, 15)]} accept={false} onValueChange={onValueChange} />)

  await userEvent.click(screen.getByRole('button', { name: 'Toggle calendar' }))
  await userEvent.click(screen.getByRole('button', { name: '15 June 2024 Saturday' }))
  expect(onValueChange).not.toHaveBeenCalled()

  await userEvent.click(screen.getByRole('button', { name: 'Toggle calendar' }))
  await userEvent.click(screen.getByRole('button', { name: '20 June 2024 Thursday' }))
  await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ valueAsString: ['2024-06-20'] })))
  await new Promise(resolve => setTimeout(resolve, 250))
  await expect.element(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('06/15/2024')
})

it('shows a date the parent sets on its own', async () => {
  const screen = await render(<ControlledDatePicker initial={[new Date(2024, 5, 15)]} />)
  await expect.element(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('06/15/2024')

  await userEvent.click(screen.getByRole('button', { name: 'Set July 4' }))
  await expect.element(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('07/04/2024')
})

it('reports a typed date through onValueChange', async () => {
  const onValueChange = vi.fn()
  const screen = await render(
    <DatePicker.Root onValueChange={onValueChange}>
      <DatePicker.Control>
        <DatePicker.Input aria-label="Date" />
      </DatePicker.Control>
    </DatePicker.Root>,
  )

  await userEvent.fill(screen.getByRole('textbox', { name: 'Date' }), 'bad date')
  await userEvent.fill(screen.getByRole('textbox', { name: 'Date' }), 'still invalid')
  expect(onValueChange).not.toHaveBeenCalled()

  await userEvent.fill(screen.getByRole('textbox', { name: 'Date' }), '06/20/2024')
  await vi.waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ valueAsString: ['2024-06-20'] })))
  expect(onValueChange.mock.lastCall![0].value).toEqual([new Date(2024, 5, 20)])
})

it('reports a calendar pick through onValueChange', async () => {
  const onValueChange = vi.fn()
  const screen = await render(
    <DatePicker.Root defaultValue={[new Date(2024, 5, 15)]} onValueChange={onValueChange}>
      <DatePicker.Control>
        <DatePicker.Input aria-label="Date" />
        <DatePicker.Trigger />
      </DatePicker.Control>
      <DayGrid />
    </DatePicker.Root>,
  )

  await userEvent.click(screen.getByRole('button', { name: 'Toggle calendar' }))
  await userEvent.click(screen.getByRole('button', { name: '20 June 2024 Thursday' }))
  await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ valueAsString: ['2024-06-20'] })))
  expect(onValueChange.mock.lastCall![0].value).toEqual([new Date(2024, 5, 20)])

  await userEvent.click(screen.getByRole('button', { name: 'Toggle calendar' }))
  await userEvent.click(screen.getByRole('button', { name: '20 June 2024 Thursday' }))
  expect(onValueChange).toHaveBeenCalledTimes(1)
})

it('updates only the end input when a controlled range picks a new end date', async () => {
  function ControlledRange() {
    const [value, setValue] = React.useState<(Date | undefined)[]>([new Date(2024, 5, 10), new Date(2024, 5, 20)])
    return (
      <DatePicker.Root selectionMode="range" value={value} onValueChange={details => setValue(details.value)}>
        <DatePicker.Control>
          <DatePicker.Input index={0} aria-label="Start date" />
          <DatePicker.Trigger index={0} />
          <DatePicker.Input index={1} aria-label="End date" />
          <DatePicker.Trigger index={1} />
        </DatePicker.Control>
        <DayGrid />
      </DatePicker.Root>
    )
  }
  const screen = await render(<ControlledRange />)
  await expect.element(screen.getByRole('textbox', { name: 'End date' })).toHaveValue('06/20/2024')

  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))
  await userEvent.click(screen.getByRole('button', { name: '25 June 2024 Tuesday' }))
  await expect.element(screen.getByRole('textbox', { name: 'End date' })).toHaveValue('06/25/2024')
  await expect.element(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('06/10/2024')
})

it.each([0, 1] as const)('revalidates the focused range draft at endpoint %i when its peer changes', async (index) => {
  function Range({ value }: { value: Date[] }) {
    return (
      <DatePicker.Root selectionMode="range" value={value}>
        <DatePicker.Control>
          <DatePicker.Input aria-label="Start date" />
          <DatePicker.Input index={1} aria-label="End date" />
        </DatePicker.Control>
      </DatePicker.Root>
    )
  }
  const initial = [new Date(2024, 5, 10), new Date(2024, 5, 20)]
  const screen = await render(<Range value={initial} />)
  const input = screen.getByRole('textbox', { name: index === 0 ? 'Start date' : 'End date' })
  const element = input.element() as HTMLInputElement
  await userEvent.fill(input, '06/15/2024')
  expect(document.activeElement).toBe(element)

  const crossed = [...initial]
  crossed[1 - index] = new Date(2024, 5, index === 0 ? 12 : 18)
  await screen.rerender(<Range value={crossed} />)
  await vi.waitFor(() => expect(element.validationMessage).toBe('Please enter a valid date'))
  await expect.element(input).toHaveAttribute('aria-invalid', 'true')
  expect(element.value).toBe('06/15/2024')
  expect(document.activeElement).toBe(element)

  await screen.rerender(<Range value={initial} />)
  await vi.waitFor(() => expect(element.validationMessage).toBe(''))
  await expect.element(input).not.toHaveAttribute('aria-invalid')
  expect(element.value).toBe('06/15/2024')
})
