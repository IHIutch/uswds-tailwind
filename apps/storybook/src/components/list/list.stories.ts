import ListDefault from "./examples/list.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "List",
};

export const Default = {
  render: () => renderTwig({path: ListDefault}),
};
