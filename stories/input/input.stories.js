import Twig from 'twig';
import { ctx as InputDefault } from './templates/input.twig';
import { ctx as InputGroup } from './templates/input-group.twig';
import { ctx as InputMask } from './templates/input-mask.twig';

export default {
  title: 'Input',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: InputDefault }).render()
  },
};

export const Group = {
  render: () => {
    return Twig.twig({ data: InputGroup }).render()
  },
};

export const Mask = {
  render: () => {
    return Twig.twig({ data: InputMask }).render()
  },
};
