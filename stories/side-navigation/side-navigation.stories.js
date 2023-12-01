import SideNavigationDefault from './templates/side-navigation.twig';
import SideNavigationNested from './templates/side-navigation-nested.twig';
import props from "./side-navigation-props.json";

export default {
  title: 'Side Navigation',
};

export const Default = {
  render: () => SideNavigationDefault(props)
};

export const Nested = {
  render: () => SideNavigationNested(props)
};
