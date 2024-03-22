import SideNavigationDefault from "./examples/side-navigation.twig?url";
import SideNavigationNested from "./examples/side-navigation-nested.twig?url";
import props from "./side-navigation-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Side Navigation",
};

export const Default = {
  render: () => renderTwig({path: SideNavigationDefault, props}),
};

export const Nested = {
  render: () => renderTwig({path: SideNavigationNested, props}),
};
