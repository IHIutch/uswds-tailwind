import StepIndicatorDefault from './templates/step-indicator.twig';
import StepIndicatorNoLabels from './templates/step-indicator-no-labels.twig';
import StepIndicatorCentered from './templates/step-indicator-centered.twig';
import StepIndicatorCounters from './templates/step-indicator-counters.twig';
import StepIndicatorCountersSmall from './templates/step-indicator-counters-small.twig';
import props from "./step-indicator-props.json";

export default {
  title: 'Step Indicator',
};

export const Default = {
  render: () => StepIndicatorDefault(props)
};

export const NoLabels = {
  render: () => StepIndicatorNoLabels(props)
};

export const Centered = {
  render: () => StepIndicatorCentered(props)
};

export const Counters = {
  render: () => StepIndicatorCounters(props)
};

export const CountersSmall = {
  render: () => StepIndicatorCountersSmall(props)
};
