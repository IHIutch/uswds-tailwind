import PaginationDefault from "../../components/pagination/examples/pagination.twig";
import PaginationUnbounded from "../../components/pagination/examples/pagination-unbounded.twig";
import props from "./pagination-props.json";

export default {
  title: "Pagination",
};

export const Default = {
  render: () => PaginationDefault(props),
};

export const Unbounded = {
  render: () => PaginationUnbounded(props),
};
