import Twig from 'twig';
import CheckboxDefault from './templates/checkbox.twig';
import CheckboxTile from './templates/checkbox-tile.twig';
import props from "./checkbox-props.json";

export default {
  title: 'Checkbox',
};

export const Default = {
  render: () => {
    return CheckboxDefault(props)
  },
};

export const Tile = {
  render: () => {
    return CheckboxTile(props)
  },
};
