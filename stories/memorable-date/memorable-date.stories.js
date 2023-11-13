import Twig from 'twig';
import MemorableDateDefault from './templates/memorable-date.twig';

export default {
  title: 'Memorable Date',
};

export const Default = {
  render: () => {
    return MemorableDateDefault()
  },
};
