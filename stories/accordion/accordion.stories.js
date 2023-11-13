import Twig from 'twig';
import AccordionDefault from './templates/accordion.twig';
import AccordionBordered from './templates/accordion-bordered.twig';
import AccordionMultiple from './templates/accordion-multiple.twig';
import props from "./accordion-props.json";

export default {
  title: 'Accordion',
};

export const Default = {
  render: () => {
    return AccordionDefault(props)
  },
};

export const Bordered = {
  render: () => {
    return AccordionBordered(props)
  },
};

export const Multiple = {
  render: () => {
    return AccordionMultiple(props)
  },
};
