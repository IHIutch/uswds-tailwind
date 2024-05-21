import { attrs } from '#utils/attrs';
import { normalizeProps } from '#utils/normalize-props';
import * as splitter from '@zag-js/splitter';
import { nanoid } from 'nanoid';
import invariant from 'tiny-invariant';

const SPLITTER_ROOT_SELECTOR = '[data-part="splitter-root"]';
const SPLITTER_PANEL_SELECTOR = '[data-part="splitter-panel"]';
const SPLITTER_TRIGGER_SELECTOR = '[data-part="splitter-resizer"]';

function init(splitterRootEl: HTMLElement) {
  const splitterPanels = Array.from(
    splitterRootEl.querySelectorAll<HTMLElement>(SPLITTER_PANEL_SELECTOR)
  ).map(splitterEl => {
    return {
      el: splitterEl,
      id: splitterEl.getAttribute('data-value') || '',
      size: splitterEl.getAttribute('data-size') || 50,
    }
  })

  const splitterTriggers = Array.from(
    splitterRootEl.querySelectorAll<HTMLButtonElement>(
      SPLITTER_TRIGGER_SELECTOR
    )).map(triggerEl => {
      return {
        el: triggerEl,
        id: triggerEl.getAttribute('data-value') || '',
      }
    });

  const service = splitter.machine({
    id: nanoid(),
    size: splitterPanels.map((item) => ({
      id: item.id,
      size: Number(item.size),
    }))
  });

  let prev: () => void;
  function render(api: splitter.Api) {
    splitterTriggers.forEach(item => {
      return invariant(item, `Cannot find trigger element with attribute: ${SPLITTER_TRIGGER_SELECTOR}`);
    })
    splitterPanels.forEach(item => {
      return invariant(item, `Cannot find panel element with attribute: ${SPLITTER_PANEL_SELECTOR}`);
    })

    if (prev) prev();
    let cleanups = [
      attrs(splitterRootEl, api.rootProps),
      ...splitterPanels.map(item => attrs(item.el, api.getPanelProps({ id: item.id }))),
      ...splitterTriggers.map(item => attrs(item.el, api.getResizeTriggerProps({ id: item.id as `${string}:${string}` })))
    ];
    prev = () => {
      cleanups.forEach((fn) => fn());
    };
  }

  service.subscribe(() => {
    const api = splitter.connect(
      service.state,
      service.send,
      normalizeProps
    );
    render(api);
  });

  service._created()
  service.start()
}

export function initSplitter() {
  Array.from(
    document.querySelectorAll<HTMLElement>(SPLITTER_ROOT_SELECTOR)
  ).forEach(init);
}

