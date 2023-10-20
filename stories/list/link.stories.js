import Twig from 'twig';
import { ctx as ListDefault } from './templates/list.twig';

export default {
  title: 'List',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: ListDefault }).render()
  },
};
