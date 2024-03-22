import TagDefault from "./examples/tag.twig?url";
import TagLarge from "./examples/tag-large.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Tag",
};

export const Default = {
  render: () => renderTwig({path: TagDefault}),
};

export const Large = {
  render: () => renderTwig({path: TagLarge}),
};
