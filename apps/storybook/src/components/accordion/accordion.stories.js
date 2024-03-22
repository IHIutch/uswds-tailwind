import AccordionDefault from "../../components/accordion/examples/accordion.twig";
import AccordionBordered from "../../components/accordion/examples/accordion-bordered.twig";
import AccordionMultiple from "../../components/accordion/examples/accordion-multiple.twig";
import props from "./accordion-props.json";

export default {
  title: "Accordion",
};

export const Default = {
  render: () => AccordionDefault(props),
};

export const Bordered = {
  render: () => AccordionBordered(props),
};

export const Multiple = {
  render: () => AccordionMultiple(props),
};
