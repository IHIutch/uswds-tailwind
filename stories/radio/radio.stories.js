import RadioDefault from './templates/radio.twig';
import RadioTile from './templates/radio-tile.twig';
import props from "./radio-props.json";

export default {
  title: 'Radio',
};

export const Default = {
  render: () => RadioDefault(props)
};

export const Tile = {
  render: () => RadioTile(props)
};
