import { renderTwig } from "../../utils/render-twig";
import BannerDefault from "./examples/banner.twig?url";

export default {
  title: "Banner",
};

export const Default = {
  render: () => renderTwig({path: BannerDefault}),
};
