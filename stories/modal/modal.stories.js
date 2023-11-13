import Twig from 'twig';
import ModalDefault from './templates/modal.twig';
import ModalLarge from './templates/modal-large.twig';
import ModalForcedAction from './templates/modal-forced-action.twig';

export default {
  title: 'Modal',
};

export const Default = {
  render: () => {
    return ModalDefault()
  },
};

export const Large = {
  render: () => {
    return ModalLarge()
  },
};

export const ForcedAction = {
  render: () => {
    return ModalForcedAction()
  },
};
