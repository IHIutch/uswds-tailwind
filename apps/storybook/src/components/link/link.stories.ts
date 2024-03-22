import { renderTwig } from "../../utils/render-twig";
import LinkDefault from "./examples/link.twig?url";

export default {
  title: "Link",
};

export const Default = {
  render: () => renderTwig({path: LinkDefault}),
};
