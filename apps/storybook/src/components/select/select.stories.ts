import { renderTwig } from "../../utils/render-twig";
import SelectDefault from "./examples/select.twig?url";

export default {
  title: "Select",
};

export const Default = {
  render: () => renderTwig({path: SelectDefault}),
};
