import Twig from 'twig';
import { ctx as InputMaskDefault } from './templates/input-mask.twig';

export default {
  title: 'Input Mask',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: InputMaskDefault }).render()
  },
};
