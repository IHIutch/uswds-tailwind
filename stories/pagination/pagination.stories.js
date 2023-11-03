import Twig from 'twig';
import { ctx as PaginationDefault } from './templates/pagination.twig';
import props from "./pagination-props.json";


export default {
  title: 'Pagination',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: PaginationDefault }).render(props)
  },
};
