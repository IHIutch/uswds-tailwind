import CardDefault from "./examples/card.twig?url";
import CardHorizontal from "./examples/card-horizontal.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Card",
};

export const Default = {
  render: () => renderTwig({path: CardDefault}),
};

export const Horizontal = {
  render: () => renderTwig({path: CardHorizontal}),
};
