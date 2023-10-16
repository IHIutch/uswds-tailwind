import Twig from 'twig';
import { ctx as AlertDefault } from './templates/alert.twig';
import { ctx as AlertSlim } from './templates/alert-slim.twig';
import { ctx as AlertNoIcon } from './templates/alert-no-icon.twig';

export default {
  title: 'Alert',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: AlertDefault }).render()
  },
};

export const Slim = {
  render: () => {
    return Twig.twig({ data: AlertSlim }).render()
  },
};

export const NoIcon = {
  render: () => {
    return Twig.twig({ data: AlertNoIcon }).render()
  },
};
