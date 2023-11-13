import Twig from 'twig';
import PaginationDefault from './templates/pagination.twig';
import PaginationUnbounded from './templates/pagination-unbounded.twig';
import props from "./pagination-props.json";



const hey = PaginationUnbounded()

console.log({ hey })

export default {
  title: 'Pagination',
};

export const Default = {
  render: () => {
    return PaginationDefault(props)
  },
};

export const Unbounded = {
  render: () => {
    return PaginationUnbounded(props)
  },
};
