import RangeSlider from "./examples/range-slider.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Range Slider",
};

export const Default = {
  render: () => renderTwig({path: RangeSlider}),
};
