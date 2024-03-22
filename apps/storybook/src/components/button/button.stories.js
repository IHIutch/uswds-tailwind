import ButtonDefault from "../../components/button/examples/button.twig";
import ButtonGroup from "../../components/button/examples/button-group.twig";
import ButtonGroupSegmented from "../../components/button/examples/button-group-segmented.twig";

export default {
  title: "Button",
};

export const Default = {
  render: () => ButtonDefault(),
};

export const Group = {
  render: () => ButtonGroup(),
};

export const GroupSegmented = {
  render: () => ButtonGroupSegmented(),
};
