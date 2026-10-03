import type { CharacterCountSchema } from './character-count.types'
import { createMachine } from '@zag-js/core'
import * as dom from './character-count.dom'

const isOverLimit = (value: string, maxLength: number) => maxLength > 0 && value.length > maxLength

function getCountMessage(currentLength: number, maxLength: number, statusLabel: string) {
  if (currentLength === 0)
    return `${maxLength} ${statusLabel}`

  const difference = Math.abs(maxLength - currentLength)
  const characters = `character${difference === 1 ? '' : 's'}`
  const guidance = currentLength > maxLength ? 'over limit' : 'left'
  return `${difference} ${characters} ${guidance}`
}

export const machine = createMachine<CharacterCountSchema>({
  props({ props }) {
    return {
      defaultValue: '',
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
      srStatusText: bindable<string>(() => ({
        defaultValue: getCountMessage(
          prop('maxLength') ? (prop('value') ?? prop('defaultValue')).length : 0,
          prop('maxLength') ?? 0,
          prop('statusLabel'),
        ),
      })),
      srStatusPoliteness: bindable<'polite' | 'assertive'>(() => ({
        defaultValue: 'polite',
      })),
      srLiveEnabled: bindable<boolean>(() => ({
        defaultValue: false,
      })),
      wasOverLimit: bindable<boolean>(() => ({
        defaultValue: isOverLimit(prop('value') ?? prop('defaultValue'), prop('maxLength') ?? 0),
      })),
      isHintRendered: bindable<boolean>(() => ({
        defaultValue: false,
      })),
    }
  },

  computed: {
    isOverLimit: ({ context, prop }) => isOverLimit(context.get('value'), prop('maxLength') ?? 0),
    statusText: ({ context, prop }) => {
      const maxLength = prop('maxLength') ?? 0
      return getCountMessage(maxLength ? context.get('value').length : 0, maxLength, prop('statusLabel'))
    },
  },

  refs({ context }) {
    return {
      srAnnouncementOwner: {},
      hintRef(node: HTMLElement | null) {
        const hint = Boolean(node)
        if (context.get('isHintRendered') !== hint)
          context.set('isHintRendered', hint)
      },
    }
  },

  watch({ track, action, context, prop }) {
    track([() => context.get('value'), () => prop('maxLength')], () => {
      action(['syncValidity', 'scheduleSrMessage'])
    })
    track([() => prop('errorText')], () => {
      action(['syncValidity'])
    })
  },

  effects: ['cleanupTimers', 'enableSrLive'],

  states: {
    idle: {
      on: {
        'INPUT.CHANGE': { actions: ['updateValue'] },
        'VALUE.SET': { actions: ['updateValue'] },
        'SR.COMMIT': { actions: ['commitSrMessage'] },
        'SR.LIVE.ENABLE': { actions: ['enableSrLive'] },
      },
    },
  },

  implementations: {
    actions: {
      updateValue({ context, event }) {
        context.set('value', event.value)
      },
      syncValidity({ context, prop, scope }) {
        const input = dom.getInputEl(scope)
        if (input)
          dom.applyOwnedValidity(input, isOverLimit(context.get('value'), prop('maxLength') ?? 0), prop('errorText'))
      },
      scheduleSrMessage({ context, computed, prop, scope, refs, send }) {
        if (!prop('maxLength'))
          return
        const overLimit = computed('isOverLimit')
        const recovering = context.get('wasOverLimit') && !overLimit
        context.set('wasOverLimit', overLimit)
        dom.scheduleSrAnnouncement(
          scope.getDoc(),
          scope.getWin(),
          refs.get('srAnnouncementOwner'),
          () => send({ type: 'SR.COMMIT' }),
          recovering ? dom.AT_DEFER_MS : dom.SR_STATUS_DEBOUNCE_MS,
        )
      },
      commitSrMessage({ context, computed }) {
        const overLimit = computed('isOverLimit')
        context.set('srStatusPoliteness', overLimit ? 'assertive' : 'polite')
        context.set('srStatusText', overLimit
          ? `Character limit exceeded. ${computed('statusText')}`
          : computed('statusText'))
      },
      enableSrLive({ context }) {
        context.set('srLiveEnabled', true)
      },
    },
    effects: {
      enableSrLive({ scope, send }) {
        const win = scope.getWin()
        const timer = win.setTimeout(() => send({ type: 'SR.LIVE.ENABLE' }), dom.AT_DEFER_MS)
        return () => win.clearTimeout(timer)
      },
      cleanupTimers({ refs, scope }) {
        return () => dom.cancelSrAnnouncement(scope.getDoc(), scope.getWin(), refs.get('srAnnouncementOwner'))
      },
    },
  },
})
