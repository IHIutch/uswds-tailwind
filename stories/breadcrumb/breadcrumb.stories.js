import BreadcrumbDefault from './templates/breadcrumb.twig';
import BreadcrumbWrapping from './templates/breadcrumb-wrapping.twig';
import props from "./breadcrumb-props.json";

export default {
  title: 'Breadcrumb',
};

export const Default = {
  render: () => BreadcrumbDefault(props)
};

export const Wrapping = {
  render: () => BreadcrumbWrapping(props)
};
