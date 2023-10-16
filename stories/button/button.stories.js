import Twig from 'twig';
import { ctx as ButtonDefault } from './templates/button.twig';
import { ctx as ButtonGroup } from './templates/button-group.twig';
import { ctx as ButtonGroupSegmented } from './templates/button-group-segmented.twig';

export default {
  title: 'Button',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: ButtonDefault }).render()
  },
};

export const Group = {
  render: () => {
    return Twig.twig({ data: ButtonGroup }).render()
  },
};

export const GroupSegmented = {
  render: () => {
    return Twig.twig({ data: ButtonGroupSegmented }).render()
  },
};
