import Twig from 'twig';
import { ctx as MemorableDateDefault } from './templates/memorable-date.twig';

export default {
  title: 'Memorable Date',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: MemorableDateDefault }).render()
  },
};
