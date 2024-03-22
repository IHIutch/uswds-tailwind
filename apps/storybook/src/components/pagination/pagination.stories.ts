import PaginationDefault from "./examples/pagination.twig?url";
import PaginationUnbounded from "./examples/pagination-unbounded.twig?url";
import props from "./pagination-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Pagination",
};

export const Default = {
  render: () => renderTwig({path: PaginationDefault, props}),
};

export const Unbounded = {
  render: () => renderTwig({path: PaginationUnbounded, props}),
};
