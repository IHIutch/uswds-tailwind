import Twig from 'twig';
import ComboboxDefault from './templates/combobox.twig';
import props from "./combobox-props.json";

export default {
  title: 'Combobox',
};

export const Default = {
  render: () => {
    return ComboboxDefault(props)
  },
};
