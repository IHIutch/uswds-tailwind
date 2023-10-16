import Twig from 'twig';
import { ctx as AccordionDefault } from './templates/accordion.twig';
import { ctx as AccordionBordered } from './templates/accordion-bordered.twig';
import { ctx as AccordionMultiple } from './templates/accordion-multiple.twig';
import props from "./accordion-props.json";

export default {
  title: 'Accordion',
};

export const Default = {
  render: () => {
    return Twig.twig({ data: AccordionDefault }).render(props)
  },
};

export const Bordered = {
  render: () => {
    return Twig.twig({ data: AccordionBordered }).render(props)
  },
};

export const Multiple = {
  render: () => {
    return Twig.twig({ data: AccordionMultiple }).render(props)
  },
};
