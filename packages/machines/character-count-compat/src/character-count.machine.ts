import type { CharacterCountSchema } from './character-count.types'
import { createMachine } from '@zag-js/core'
import * as dom from './character-count.dom'

const isOverLimit = (value: string, maxLength: number) => maxLength > 0 && value.length > maxLength

function getStatusText(currentLength: number, maxLength: number, charactersAllowed: string) {
  if (!maxLength)
    return ''
  if (currentLength === 0)
    return `${maxLength} ${charactersAllowed}`

  const difference = Math.abs(maxLength - currentLength)
  const characters = `character${difference === 1 ? '' : 's'}`
  const guidance = currentLength > maxLength ? 'over limit' : 'left'
  return `${difference} ${characters} ${guidance}`
}

export const machine = createMachine<CharacterCountSchema>({
  props({ props }) {
    return {
      defaultValue: '',
      maxLength: 0,
      errorText: 'The content is too long.',
      statusLabel: 'characters allowed',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    return {
      value: bindable<string>(() => ({
        defaultValue: prop('defaultValue'),
        value: prop('value'),
        onChange(value) {
          prop('onValueChange')?.({ value })
        },
      })),
      srStatus: bindable<CharacterCountSchema['context']['srStatus']>(() => ({
        defaultValue: {
          text: getStatusText(
            (prop('value') ?? prop('defaultValue')).length,
            prop('maxLength'),
            prop('statusLabel'),
          ),
          politeness: undefined,
        },
      })),
      isDescriptionRendered: bindable<boolean>(() => ({
        defaultValue: false,
      })),
    }
  },

  computed: {
    isOverLimit: ({ context, prop }) => isOverLimit(context.get('value'), prop('maxLength')),
    statusText: ({ context, prop }) =>
      getStatusText(context.get('value').length, prop('maxLength'), prop('statusLabel')),
  },

  refs({ context, prop }) {
    return {
      srAnnouncementCleanup: undefined,
      previousOverLimit: isOverLimit(context.get('value'), prop('maxLength')),
      descriptionRef(node: HTMLElement | null) {
        context.set('isDescriptionRendered', Boolean(node))
      },
    }
  },

  watch({ track, action, context, prop }) {
    track([() => context.get('value'), () => prop('maxLength')], () => {
      action(['syncInputValidity', 'announceValue'])
    })
    track([() => prop('errorText')], () => {
      action(['syncInputValidity'])
    })
  },

  effects: ['trackSrStatus'],

  states: {
    idle: {
      on: {
        'VALUE.SET': { actions: ['setValue'] },
      },
    },
  },

  implementations: {
    actions: {
      setValue({ context, event, scope }) {
        context.set('value', event.value)
        dom.setInputValue(scope, context.get('value'))
      },
      syncInputValidity({ computed, prop, scope }) {
        const input = dom.getInputEl(scope)
        if (input) {
          dom.cancelValiditySync(input)
          dom.applyOwnedValidity(input, computed('isOverLimit'), prop('errorText'))
        }
      },
      announceValue({ context, computed, prop, scope, refs }) {
        if (!prop('maxLength'))
          return
        const overLimit = computed('isOverLimit')
        const recovering = refs.get('previousOverLimit') && !overLimit
        refs.set('previousOverLimit', overLimit)
        refs.set('srAnnouncementCleanup', dom.scheduleSrAnnouncement(
          scope,
          () => {
            const overLimit = computed('isOverLimit')
            const text = computed('statusText')
            context.set('srStatus', {
              text: overLimit ? `Character limit exceeded. ${text}` : text,
              politeness: overLimit ? 'assertive' : 'polite',
            })
          },
          recovering ? dom.AT_DEFER_MS : dom.SR_STATUS_DEBOUNCE_MS,
        ))
      },
    },
    effects: {
      trackSrStatus({ context, refs, scope }) {
        const win = scope.getWin()
        const timer = win.setTimeout(() => {
          context.set('srStatus', status => ({ ...status, politeness: status.politeness ?? 'polite' }))
        }, dom.AT_DEFER_MS)
        return () => {
          win.clearTimeout(timer)
          refs.get('srAnnouncementCleanup')?.()
          const input = dom.getInputEl(scope)
          if (input)
            dom.cancelValiditySync(input)
        }
      },
    },
  },
})
