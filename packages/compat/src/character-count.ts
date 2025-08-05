import type { CharacterCountSchema } from '@uswds-tailwind/character-count-compat'
import * as characterCount from '@uswds-tailwind/character-count-compat'
import { Component } from './component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './normalize-props'
import { spreadProps } from './spread-props'

export class CharacterCount extends Component<characterCount.Props, characterCount.Api> {
    initMachine(context: characterCount.Props): VanillaMachine<CharacterCountSchema> {
        return new VanillaMachine(characterCount.machine, {
            ...context,
        })
    }

    initApi() {
        return characterCount.connect(this.machine.service, normalizeProps)
    }

    render() {
        spreadProps(this.rootEl, this.api.getRootProps())

        if (this.label) {
            this.renderLabel(this.label)
        }
        this.renderInput(this.input)
        this.renderStatus(this.status)
        this.renderSrStatus(this.srStatus)
    }

    private get label() {
        return this.rootEl.querySelector<HTMLElement>(`[data-part="character-count-label"]`)
    }

    private get input() {
        const inputEl = this.rootEl.querySelector<HTMLInputElement>(`[data-part="character-count-input"]`)
        if (!inputEl)
            throw new Error('Expected inputEl to be defined')
        return inputEl
    }

    private get status() {
        const statusEl = this.rootEl.querySelector<HTMLElement>(`[data-part="character-count-status"]`)
        if (!statusEl)
            throw new Error('Expected statusEl to be defined')
        return statusEl
    }

    private get srStatus() {
        const srStatusEl = this.rootEl.querySelector<HTMLElement>(`[data-part="character-count-sr-status"]`)
        if (!srStatusEl)
            throw new Error('Expected srStatusEl to be defined')
        return srStatusEl
    }

    private renderLabel(labelEl: HTMLElement) {
        spreadProps(labelEl, this.api.getLabelProps())
    }

    private renderInput(inputEl: HTMLElement) {
        spreadProps(inputEl, this.api.getInputProps())
    }

    private renderStatus(statusEl: HTMLElement) {
        spreadProps(statusEl, this.api.getStatusProps())
    }

    private renderSrStatus(srStatusEl: HTMLElement) {
        spreadProps(srStatusEl, this.api.getSrStatusProps())
    }
}

export function characterCountInit() {
    document.querySelectorAll<HTMLElement>('[data-part="character-count-root"]').forEach((targetEl) => {
        const characterCount = new CharacterCount(targetEl, {
            id: targetEl.id || 'character-count',
            maxLength: 25,
            getStatusText: (count, max) => {
                const diff = Math.abs(max - count);
                const characters = diff === 1 ? 'character' : 'characters';
                const guidance =
                    count === 0 ? 'allowed' : count > max ? 'over limit' : 'left';
                return `${diff} ${characters} ${guidance}`;
            },
        })
        characterCount.init()
    })
}

if (typeof window !== 'undefined') {
    window.CharacterCount = CharacterCount
    window.characterCountInit = characterCountInit
}
