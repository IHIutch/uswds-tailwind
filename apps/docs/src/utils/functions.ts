import Twig from "twig"
import fs from "node:fs"

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

export const getComponentData = async (component: string, variant: string) => {
  const propsPath = `./src/__demos__/${component}/${component}-props.json`;
  const componentPath = `./src/__demos__/${component}/examples/${variant}.twig`;

  let componentProps = "";
  if (fs.existsSync(propsPath)) {
    componentProps = JSON.parse(fs.readFileSync(propsPath, "utf8"));
  }

  const componentCode = fs.readFileSync(componentPath, "utf-8");
  
  // Pre-render the template at build time
  const template = await renderTwigTemplate({
    path: componentPath,
    props: componentProps || "",
  });

  return {
    props: componentProps,
    code: componentCode,
    path: componentPath,
    template: template
  };
}
