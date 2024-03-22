import FooterDefault from "./examples/footer.twig?url";
import FooterMedium from "./examples/medium.twig?url";
import FooterSlim from "./examples/slim.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Footer",
};

export const Default = {
  render: () => renderTwig({path: FooterDefault}),
};
export const Medium = {
  render: () => renderTwig({path: FooterMedium}),
};
export const Slim = {
  render: () => renderTwig({path: FooterSlim}),
};
