import RadioDefault from "../../components/radio/examples/radio.twig";
import RadioTile from "../../components/radio/examples/radio-tile.twig";
import props from "./radio-props.json";

export default {
  title: "Radio",
};

export const Default = {
  render: () => RadioDefault(props),
};

export const Tile = {
  render: () => RadioTile(props),
};
