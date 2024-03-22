import CheckboxDefault from "../../components/checkbox/examples/checkbox.twig";
import CheckboxTile from "../../components/checkbox/examples/checkbox-tile.twig";
import props from "./checkbox-props.json";

export default {
  title: "Checkbox",
};

export const Default = {
  render: () => CheckboxDefault(props),
};

export const Tile = {
  render: () => CheckboxTile(props),
};
