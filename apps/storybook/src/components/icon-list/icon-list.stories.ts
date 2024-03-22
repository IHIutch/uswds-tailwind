import IconListDefault from "./examples/icon-list.twig?url";
import IconListSimpleContent from "./examples/icon-list-simple-content.twig?url";
import IconListRichContent from "./examples/icon-list-rich-content.twig?url";
import IconListCustomSizeRichContent from "./examples/icon-list-custom-size-rich-content.twig?url";
import IconListCustomSize from "./examples/icon-list-custom-size.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Icon List",
};

export const Default = {
  render: () => renderTwig({path: IconListDefault}),
};

export const SimpleContent = {
  render: () => renderTwig({path: IconListSimpleContent}),
};

export const RichContent = {
  render: () => renderTwig({path: IconListRichContent}),
};

export const CustomSizeWithRichContent = {
  render: () => renderTwig({path: IconListCustomSizeRichContent}),
};

export const CustomSize = {
  render: () => renderTwig({path: IconListCustomSize}),
};
