import HeaderDefault from "../../components/header/examples/header.twig";
import props from "./header-props.json";

export default {
  title: "Header",
};

export const Default = {
  render: () => HeaderDefault(props),
};
