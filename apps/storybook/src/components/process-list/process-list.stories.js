import ProcessListDefault from '../../components/process-list/examples/process-list.twig';
import ProcessListNoText from '../../components/process-list/examples/process-list-no-text.twig';
import ProcessListCustomSizing from '../../components/process-list/examples/process-list-custom-sizing.twig';

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
