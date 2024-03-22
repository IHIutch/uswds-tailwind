import ModalDefault from "../../components/modal/examples/modal.twig";
import ModalLarge from "../../components/modal/examples/modal-large.twig";
import ModalForcedAction from "../../components/modal/examples/modal-forced-action.twig";

export default {
  title: "Modal",
};

export const Default = {
  render: () => ModalDefault(),
};

export const Large = {
  render: () => ModalLarge(),
};

export const ForcedAction = {
  render: () => ModalForcedAction(),
};
