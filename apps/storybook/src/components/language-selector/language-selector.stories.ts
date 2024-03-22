import LanguageSelectorDefault from "./examples/language-selector.twig?url";
import LanguageSelectorMenu from "./examples/language-selector-menu.twig?url";
import props from "./language-selector-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Language Selector",
};

export const Default = {
  render: () => renderTwig({path: LanguageSelectorDefault}),
};

export const Menu = {
  render: () => renderTwig({path: LanguageSelectorMenu, props}),
};
