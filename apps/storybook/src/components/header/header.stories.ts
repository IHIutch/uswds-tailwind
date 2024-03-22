import { renderTwig } from "../../utils/render-twig";
import HeaderDefault from "./examples/header.twig?url";
import props from "./header-props.json";

export default {
  title: "Header",
};

export const Default = {
  render: () => renderTwig({path: HeaderDefault, props}),
};
