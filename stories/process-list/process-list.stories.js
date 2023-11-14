import ProcessListDefault from './templates/process-list.twig';
import ProcessListNoText from './templates/process-list-no-text.twig';
import ProcessListCustomSizing from './templates/process-list-custom-sizing.twig';

export default {
  title: 'Process List',
};

export const Default = {
  render: () => ProcessListDefault()
};

export const NoText = {
  render: () => ProcessListNoText()
};

export const CustomSizing = {
  render: () => ProcessListCustomSizing()
};
