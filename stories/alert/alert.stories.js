import Twig from 'twig';
import AlertDefault from './templates/alert.twig';
import AlertSlim from './templates/alert-slim.twig';
import AlertNoIcon from './templates/alert-no-icon.twig';

export default {
  title: 'Alert',
};

export const Default = {
  render: () => {
    return AlertDefault()
  },
};

export const Slim = {
  render: () => {
    return AlertSlim()
  },
};

export const NoIcon = {
  render: () => {
    return AlertNoIcon()
  },
};
