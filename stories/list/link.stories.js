import Twig from 'twig';
import ListDefault from './templates/list.twig';

export default {
  title: 'List',
};

export const Default = {
  render: () => {
    return ListDefault()
  },
};
