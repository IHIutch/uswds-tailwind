import InputDefault from '../../components/input/examples/input.twig';
import InputGroup from '../../components/input/examples/input-group.twig';
import InputMask from '../../components/input/examples/input-mask.twig';

export default {
  title: 'Input',
};

export const Default = {
  render: () => InputDefault()
};

export const Group = {
  render: () => InputGroup()
};

export const Mask = {
  render: () => InputMask()
};
