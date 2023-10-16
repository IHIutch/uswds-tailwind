import Twig from 'twig';
import { ctx as CheckboxDefault } from './templates/checkbox.twig';
import { ctx as CheckboxTile } from './templates/checkbox-tile.twig';
import props from "./checkbox-props.json";

export default {
  title: 'Checkbox',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: CheckboxDefault }).render(props)
  },
};

export const Tile = {
  render: () => {
    return Twig.twig({ data: CheckboxTile }).render(props)
  },
};
