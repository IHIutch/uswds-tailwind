import SearchDefault from "../../components/search/examples/search.twig";
import SearchLarge from "../../components/search/examples/search-large.twig";
import SearchIconButton from "../../components/search/examples/search-icon-button.twig";

export default {
  title: "Search",
};

export const Default = {
  render: () => SearchDefault(),
};

export const Large = {
  render: () => SearchLarge(),
};

export const IconButton = {
  render: () => SearchIconButton(),
};
