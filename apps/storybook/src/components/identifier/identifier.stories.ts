import IdentifierDefault from "./examples/identifier.twig?url";
import props from "./identifier-props.json";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Identifier",
};

export const Default = {
  render: () => renderTwig({path: IdentifierDefault, props}),
};
