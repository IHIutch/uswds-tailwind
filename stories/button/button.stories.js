import Twig from 'twig';
import ButtonDefault from './templates/button.twig';
import ButtonGroup from './templates/button-group.twig';
import ButtonGroupSegmented from './templates/button-group-segmented.twig';

export default {
  title: 'Button',
};

export const Default = {
  render: () => {
    return ButtonDefault()
  },
};

export const Group = {
  render: () => {
    return ButtonGroup()
  },
};

export const GroupSegmented = {
  render: () => {
    return ButtonGroupSegmented()
  },
};
