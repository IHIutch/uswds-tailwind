import TooltipDefault from "./examples/tooltip.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Tooltip",
};

export const Default = {
  render: () => renderTwig({path: TooltipDefault}),
};
