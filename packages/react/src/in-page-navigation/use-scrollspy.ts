import { query } from '@zag-js/dom-query'
import * as React from 'react'

type AnchorHref = `#${string}`

export function useScrollspy({ hrefs, options = {}, onIntersect }: {
  hrefs: AnchorHref[]
  options?: IntersectionObserverInit
  onIntersect?: (href: AnchorHref) => void
}) {
  const { threshold = 1, root = null, rootMargin = '0px 0px 0px 0px' } = options
  const previousObserver = React.useRef<IntersectionObserver | null>(null)

  React.useEffect(() => {
    if (previousObserver.current) {
      previousObserver.current.disconnect()
      previousObserver.current = null
    }

    const elements = hrefs
      .map(href => ({ href, el: query(document, href) }))
      .filter((item): item is { href: AnchorHref, el: HTMLElement } => item.el?.nodeType === Node.ELEMENT_NODE)

    if (elements.length === 0)
      return

    // https://github.com/uswds/uswds/blob/main/packages/usa-in-page-navigation/src/index.js#L36
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          onIntersect?.(`#${entry.target.id}`)
        }
      }
    }, { threshold, root, rootMargin })

    for (const { el } of elements) {
      observer.observe(el)
    }

    previousObserver.current = observer

    return () => observer.disconnect()
  }, [hrefs, threshold, root, rootMargin, onIntersect])
}
