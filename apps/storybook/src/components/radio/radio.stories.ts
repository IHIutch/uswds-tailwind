import RadioDefault from "./examples/radio.twig?url";
import RadioTile from "./examples/radio-tile.twig?url";
import props from "./radio-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Radio",
};

export const Default = {
  render: () => renderTwig({ path: RadioDefault, props}),
};

export const Tile = {
  render: () => renderTwig({ path: RadioTile, props}),
};
