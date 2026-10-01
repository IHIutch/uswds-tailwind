import assert from 'node:assert/strict'
// This validator runs in the Node-only coverage gate, without the browser test runner.
// eslint-disable-next-line test/no-import-node-test
import { test } from 'node:test'
import { libraryHref, resolveLibrary, switchLibraryHref } from '../src/utils/library.ts'
import { getPageLinks } from '../src/utils/metadata.ts'
import { checkReactPreviews } from './check-react-previews.mjs'

const coverage = {
  button: { examples: [{ heading: 'Examples', react: { status: 'covered' } }] },
}
const source = `---
title: Button
description: Button examples
---

import ReactPreview from '#components/react-preview.astro'
import Demo from '../../../examples/button-demo'

### Examples

<ReactPreview variant="Examples" example="button-demo" title="React usage">
  <Demo client:load />
</ReactPreview>`

function check(page = source, overrides = {}) {
  return checkReactPreviews({
    coverage,
    pageSources: { button: page },
    exampleNames: new Set(['button-demo', 'other-demo']),
    ...overrides,
  })
}

test('matches coverage by variant while allowing a different visible title with Markdown prose outside the preview', () => {
  assert.deepEqual(check(), [])
})

test('missing pages and missing registrations cannot remain covered', () => {
  assert.match(check('', { pageSources: {} }).join('\n'), /no React MDX document/)
  assert.match(check(source.replace(/<ReactPreview[\s\S]*<\/ReactPreview>/, '')).join('\n'), /no preview registration/)
})

test('rejects duplicate and unknown variants and unknown pages', () => {
  const registration = source.slice(source.indexOf('<ReactPreview'))
  assert.match(check(`${source}\n${registration}`).join('\n'), /duplicate/)
  assert.match(check(source.replace('variant="Examples"', 'variant="Missing"')).join('\n'), /unknown variant/)
  assert.match(check(source, { pageSources: { missing: source } }).join('\n'), /no coverage entry/)
})

test('a rendered variant must be marked covered, rather than deferred or unsupported', () => {
  for (const status of ['deferred', 'unsupported']) {
    assert.match(check(source, {
      coverage: { button: { examples: [{ heading: 'Examples', react: { status } }] } },
    }).join('\n'), /not marked covered/)
  }
})

test('rejects missing source and an island imported from a different source', () => {
  assert.match(check(source.replace('example="button-demo"', 'example="missing"')).join('\n'), /unknown React example source/)
  assert.match(check(source.replace('../../../examples/button-demo', '../../../examples/other-demo')).join('\n'), /rendered island does not match/)
  assert.deepEqual(check(source.replace('../../../examples/button-demo', '../../../examples/button-demo.tsx')), [])
})

test('rejects absent, multiple, or unhydrated demos', () => {
  for (const demo of ['', '<Demo client:load /><Demo client:load />', '<Demo />']) {
    assert.match(check(source.replace('<Demo client:load />', demo)).join('\n'), /needs one directly imported/)
  }
})

test('rejects islands outside registrations and dynamic registration attributes', () => {
  assert.match(check(`${source}<Demo client:load />`).join('\n'), /no React preview registration/)
  assert.match(check(source.replace('variant="Examples"', 'variant={selected}')).join('\n'), /unknown variant/)
  assert.match(check(source.replace('title="React usage">', 'title="React usage" {...props}>')).join('\n'), /must be explicit/)
})

test('commented registrations do not satisfy coverage', () => {
  const commented = source.replace('<ReactPreview', '{/* <ReactPreview').replace('</ReactPreview>', '</ReactPreview> */}')
  assert.match(check(commented).join('\n'), /no preview registration/)
})

test('conditional registrations cannot claim an always available preview', () => {
  const conditional = source.replace('<ReactPreview', '{false && <ReactPreview').replace('</ReactPreview>', '</ReactPreview>}')
  assert.match(check(conditional).join('\n'), /no preview registration/)
})

test('library route templates preserve explicit selection, canonical URLs, query parameters, and anchors', () => {
  for (const library of ['react', 'vanilla']) {
    const url = new URL(`https://docs.example/components/${library}/accordion?campaign=test#bordered`)
    const opposite = library === 'react' ? 'vanilla' : 'react'
    assert.equal(resolveLibrary(url, opposite), library)
    assert.equal(libraryHref(url.href, library), `/docs/${library}/components/accordion?campaign=test#bordered`)
    assert.equal(switchLibraryHref(url, opposite), `/docs/${opposite}/components/accordion?campaign=test`)
    const links = getPageLinks(`${url.pathname}.md`, url)
    assert.equal(links.canonical.pathname, `/docs/${library}/components/accordion`)
    assert.equal(links.markdown.pathname, `/docs/${library}/components/accordion.md`)
  }
})

test('existing docs paths and legacy component links keep their URL policy', () => {
  const url = new URL('https://docs.example/docs/react/components/accordion?library=vanilla#default')
  assert.equal(resolveLibrary(url, 'vanilla'), 'react')
  assert.equal(getPageLinks(url.pathname, url).canonical.pathname, url.pathname)
  assert.equal(libraryHref('/components/accordion#default', 'vanilla'), '/docs/vanilla/components/accordion#default')
})
