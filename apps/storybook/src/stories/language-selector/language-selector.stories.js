import LanguageSelectorDefault from '../../components/language-selector/examples/language-selector.twig'
import LanguageSelectorMenu from '../../components/language-selector/examples/menu.twig'
import props from "./language-selector-props.json";

export default {
  title: 'Language Selector',
};

export const Default = {
  render: () => LanguageSelectorDefault()
};

export const Menu = {
  render: () => LanguageSelectorMenu(props)
};

