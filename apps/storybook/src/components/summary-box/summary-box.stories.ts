import { renderTwig } from "../../utils/render-twig";
import SummaryBoxDefault from "./examples/summary-box.twig?url";

export default {
  title: "Summary Box",
};

export const Default = {
  render: () => renderTwig({path:SummaryBoxDefault}),
};
