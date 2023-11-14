import ButtonDefault from './templates/button.twig';
import ButtonGroup from './templates/button-group.twig';
import ButtonGroupSegmented from './templates/button-group-segmented.twig';

export default {
  title: 'Button',
};

export const Default = {
  render: () => ButtonDefault()
};

export const Group = {
  render: () => ButtonGroup()
};

export const GroupSegmented = {
  render: () => ButtonGroupSegmented()
};
