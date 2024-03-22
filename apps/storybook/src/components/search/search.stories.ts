import SearchDefault from "./examples/search.twig?url";
import SearchLarge from "./examples/search-large.twig?url";
import SearchIconButton from "./examples/search-icon-button.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Search",
};

export const Default = {
  render: () => renderTwig({path: SearchDefault}),
};

export const Large = {
  render: () => renderTwig({path: SearchLarge}),
};

export const IconButton = {
  render: () => renderTwig({path: SearchIconButton}),
};
