import { renderTwig } from "../../utils/render-twig";
import TextareaDefault from "./examples/textarea.twig?url";

export default {
  title: "Textarea",
};

export const Default = {
  render: () => renderTwig({path: TextareaDefault}),
};
