import Twig from 'twig';
import { ctx as ComboboxDefault } from './templates/combobox.twig';
import props from "./combobox-props.json";

export default {
  title: 'Combobox',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: ComboboxDefault }).render(props)
  },
};
