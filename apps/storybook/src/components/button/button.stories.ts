import ButtonDefault from "./examples/button.twig?url";
import ButtonGroup from "./examples/button-group.twig?url";
import ButtonGroupSegmented from "./examples/button-group-segmented.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Button",
};

export const Default = {
  render: () => renderTwig({path: ButtonDefault}),
};

export const Group = {
  render: () => renderTwig({path: ButtonGroup}),
};

export const GroupSegmented = {
  render: () => renderTwig({path: ButtonGroupSegmented}),
};
