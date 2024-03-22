import ModalDefault from "./examples/modal.twig?url";
import ModalLarge from "./examples/modal-large.twig?url";
import ModalForcedAction from "./examples/modal-forced-action.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Modal",
};

export const Default = {
  render: () => renderTwig({path: ModalDefault}),
};

export const Large = {
  render: () => renderTwig({path: ModalLarge}),
};

export const ForcedAction = {
  render: () => renderTwig({path: ModalForcedAction}),
};
