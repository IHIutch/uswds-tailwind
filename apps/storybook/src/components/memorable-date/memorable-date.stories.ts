import MemorableDateDefault from "./examples/memorable-date.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Memorable Date",
};

export const Default = {
  render: () => renderTwig({path: MemorableDateDefault}),
};
