import IconListDefault from "./examples/icon-list.twig";
import IconListSimpleContent from "./examples/icon-list-simple-content.twig";
import IconListRichContent from "./examples/icon-list-rich-content.twig";
import IconListCustomSizeRichContent from "./examples/icon-list-custom-size-rich-content.twig";
import IconListCustomSize from "./examples/icon-list-custom-size.twig";

export default {
  title: "Icon List",
};

export const Default = {
  render: () => IconListDefault(),
};

export const SimpleContent = {
  render: () => IconListSimpleContent(),
};

export const RichContent = {
  render: () => IconListRichContent(),
};

export const CustomSizeWithRichContent = {
  render: () => IconListCustomSizeRichContent(),
};

export const CustomSize = {
  render: () => IconListCustomSize(),
};
