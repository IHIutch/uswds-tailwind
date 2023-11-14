import ModalDefault from './templates/modal.twig';
import ModalLarge from './templates/modal-large.twig';
import ModalForcedAction from './templates/modal-forced-action.twig';

export default {
  title: 'Modal',
};

export const Default = {
  render: () => ModalDefault()
};

export const Large = {
  render: () => ModalLarge()
};

export const ForcedAction = {
  render: () => ModalForcedAction()
};
