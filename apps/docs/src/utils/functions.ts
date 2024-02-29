import Twig from "twig"

export const renderTwigTemplate = ({ path, props }: { path: string, props: {} }) => {
  return new Promise((resolve, reject) => {
    Twig.renderFile(path, props,
      (err, html) => {
        if (err) {
          reject(err)
        } else {
          resolve(html)
        }
      })
  })
}
