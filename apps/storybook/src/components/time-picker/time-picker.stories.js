import TimePickerDefault from '../../components/time-picker/examples/time-picker.twig';
import props from "./time-picker-props.json";

export default {
  title: 'Time Picker',
};

export const Default = {
  render: () => TimePickerDefault(props)
};
