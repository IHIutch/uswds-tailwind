import BreadcrumbDefault from "./examples/breadcrumb.twig?url";
import BreadcrumbWrapping from "./examples/breadcrumb-wrapping.twig?url";
import props from "./breadcrumb-props.json";

import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Breadcrumb",
};

export const Default = {
  render: () => renderTwig({path: BreadcrumbDefault, props}),
};

export const Wrapping = {
  render: () => renderTwig({path: BreadcrumbWrapping, props}),
};
