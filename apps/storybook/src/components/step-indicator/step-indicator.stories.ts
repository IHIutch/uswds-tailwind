import StepIndicatorDefault from "./examples/step-indicator.twig?url";
import StepIndicatorNoLabels from "./examples/step-indicator-no-labels.twig?url";
import StepIndicatorCentered from "./examples/step-indicator-centered.twig?url";
import StepIndicatorCounters from "./examples/step-indicator-counters.twig?url";
import StepIndicatorCountersSmall from "./examples/step-indicator-counters-small.twig?url";
import props from "./step-indicator-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Step Indicator",
};

export const Default = {
  render: () => renderTwig({path: StepIndicatorDefault, props}),
};

export const NoLabels = {
  render: () => renderTwig({path: StepIndicatorNoLabels, props}),
};

export const Centered = {
  render: () => renderTwig({path: StepIndicatorCentered, props}),
};

export const Counters = {
  render: () => renderTwig({path: StepIndicatorCounters, props}),
};

export const CountersSmall = {
  render: () => renderTwig({path: StepIndicatorCountersSmall, props}),
};
