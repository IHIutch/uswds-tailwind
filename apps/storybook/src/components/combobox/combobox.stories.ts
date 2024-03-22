import ComboboxDefault from "./examples/combobox.twig?url";
import props from "./combobox-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Combobox",
};

export const Default = {
  render: () => renderTwig({path: ComboboxDefault, props}),
};
