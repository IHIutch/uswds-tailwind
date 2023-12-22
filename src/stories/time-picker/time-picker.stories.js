import TimePickerDefault from '../../components/time-picker/examples/time-picker.twig';
import TimePickerTest from '../../components/time-picker/examples/time-picker2.twig';
import TimePickerNew from '../../components/time-picker/examples/time-picker3.twig';
import props from "./time-picker-props.json";

export default {
  title: 'Time Picker',
};

export const Default = {
  render: () => TimePickerDefault(props)
};

export const Test = {
  render: () => TimePickerTest(props)
};

export const New = {
  render: () => TimePickerNew(props)
};
