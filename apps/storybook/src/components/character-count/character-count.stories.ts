import { renderTwig } from "../../utils/render-twig";
import CharacterCountDefault from "./examples/character-count.twig?url";

export default {
  title: "Character Count",
};

export const Default = {
  render: () => renderTwig({path: CharacterCountDefault}),
};
