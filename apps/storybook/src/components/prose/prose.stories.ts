import { renderTwig } from "../../utils/render-twig";
import ProseDefault from "./examples/prose.twig?url";

export default {
  title: "Prose",
};

export const Default = {
  render: () => renderTwig({path: ProseDefault}),
};
