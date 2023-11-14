import AlertDefault from './templates/alert.twig';
import AlertSlim from './templates/alert-slim.twig';
import AlertNoIcon from './templates/alert-no-icon.twig';

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
