import AlertDefault from '../../components/alert/examples/alert.twig';
import AlertSlim from '../../components/alert/examples/alert-slim.twig';
import AlertNoIcon from '../../components/alert/examples/alert-no-icon.twig';

export default {
  title: 'Alert',
};

export const Default = {
  render: () => AlertDefault()
};

export const Slim = {
  render: () => AlertSlim()
};

export const NoIcon = {
  render: () => AlertNoIcon()
};
