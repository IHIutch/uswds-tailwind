import BreadcrumbDefault from "../../components/breadcrumb/examples/breadcrumb.twig";
import BreadcrumbWrapping from "../../components/breadcrumb/examples/breadcrumb-wrapping.twig";
import props from "./breadcrumb-props.json";

export default {
  title: "Breadcrumb",
};

export const Default = {
  render: () => BreadcrumbDefault(props),
};

export const Wrapping = {
  render: () => BreadcrumbWrapping(props),
};
