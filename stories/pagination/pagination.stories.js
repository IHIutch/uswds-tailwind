import PaginationDefault from './templates/pagination.twig';
import PaginationUnbounded from './templates/pagination-unbounded.twig';
import props from "./pagination-props.json";

export default {
  title: 'Pagination',
};

export const Default = {
  render: () => PaginationDefault(props)
};

export const Unbounded = {
  render: () => PaginationUnbounded(props)
};
