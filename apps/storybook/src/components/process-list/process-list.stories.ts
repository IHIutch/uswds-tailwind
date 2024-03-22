import ProcessListDefault from "./examples/process-list.twig?url";
import ProcessListNoText from "./examples/process-list-no-text.twig?url";
import ProcessListCustomSizing from "./examples/process-list-custom-sizing.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Process List",
};

export const Default = {
  render: () => renderTwig({path: ProcessListDefault}),
};

export const NoText = {
  render: () => renderTwig({path: ProcessListNoText}),
};

export const CustomSizing = {
  render: () => renderTwig({path: ProcessListCustomSizing}),
};
