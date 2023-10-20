import Twig from 'twig';
import { ctx as ModalDefault } from './templates/modal.twig';
import { ctx as ModalLarge } from './templates/modal-large.twig';
import { ctx as ModalForcedAction } from './templates/modal-forced-action.twig';

export default {
  title: 'Modal',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: ModalDefault }).render()
  },
};

export const Large = {
  render: () => {
    return Twig.twig({ data: ModalLarge }).render()
  },
};

export const ForcedAction = {
  render: () => {
    return Twig.twig({ data: ModalForcedAction }).render()
  },
};
