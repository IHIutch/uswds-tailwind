import TimePickerDefault from "./examples/time-picker.twig?url";
import { renderTwig } from "../../utils/render-twig";
import props from "./time-picker-props.json";

export default {
  title: "Time Picker",
};

export const Default = {
  render: () => renderTwig({path: TimePickerDefault, props}),
};
