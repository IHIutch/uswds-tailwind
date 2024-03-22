import AccordionDefault from "./examples/accordion.twig?url";
import AccordionBordered from "./examples/accordion-bordered.twig?url";
import AccordionMultiple from "./examples/accordion-multiple.twig?url";
import props from "./accordion-props.json";

import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Accordion",
};

export const Default = {
  render: () => renderTwig({path: AccordionDefault, props}),
};

export const Bordered = {
  render: () => renderTwig({path: AccordionBordered, props}),
};

export const Multiple = {
  render: () => renderTwig({path: AccordionMultiple, props}),
};
