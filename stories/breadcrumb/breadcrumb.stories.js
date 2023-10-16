import Twig from 'twig';
import { ctx as BreadcrumbDefault } from './templates/breadcrumb.twig';
import { ctx as BreadcrumbWrapping } from './templates/breadcrumb-wrapping.twig';
import props from "./breadcrumb-props.json";

export default {
  title: 'Breadcrumb',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: BreadcrumbDefault }).render(props)
  },
};

export const Wrapping = {
  render: () => {
    return Twig.twig({ data: BreadcrumbWrapping }).render(props)
  },
};
