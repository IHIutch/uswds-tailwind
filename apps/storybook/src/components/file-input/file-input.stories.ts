import FileInputDefault from "./examples/file-input.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "File Input",
};

export const Default = {
  render: () => renderTwig({path: FileInputDefault}),
};
