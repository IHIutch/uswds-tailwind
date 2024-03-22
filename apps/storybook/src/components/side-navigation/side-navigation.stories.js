import SideNavigationDefault from "../../components/side-navigation/examples/side-navigation.twig";
import SideNavigationNested from "../../components/side-navigation/examples/side-navigation-nested.twig";
import props from "./side-navigation-props.json";

export default {
  title: "Side Navigation",
};

export const Default = {
  render: () => SideNavigationDefault(props),
};

export const Nested = {
  render: () => SideNavigationNested(props),
};
