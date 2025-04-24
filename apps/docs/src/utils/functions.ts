import Twig from 'twig'

export function renderTwigTemplate({ path, props }: { path: string, props: Record<string, any> }) {
  return new Promise((resolve, reject) => {
    Twig.renderFile(path, props, (err, html) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(html)
      }
    })
  })
}
