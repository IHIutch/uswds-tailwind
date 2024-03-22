import CheckboxDefault from "./examples/checkbox.twig?url";
import CheckboxTile from "./examples/checkbox-tile.twig?url";
import props from "./checkbox-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Checkbox",
};

export const Default = {
  render: () => renderTwig({path: CheckboxDefault, props}),
};

export const Tile = {
  render: () => renderTwig({path: CheckboxTile, props}),
};
