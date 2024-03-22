import InputDefault from "./examples/input.twig?url";
import InputGroup from "./examples/input-group.twig?url";
import InputMask from "./examples/input-mask.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Input",
};

export const Default = {
  render: () => renderTwig({path: InputDefault}),
};

export const Group = {
  render: () => renderTwig({path: InputGroup}),
};

export const Mask = {
  render: () => renderTwig({path: InputMask}),
};
