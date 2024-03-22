import AlertDefault from "./examples/alert.twig?url";
import AlertSlim from "./examples/alert-slim.twig?url";
import AlertNoIcon from "./examples/alert-no-icon.twig?url";

import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Alert",
};

export const Default = {
  render: () => renderTwig({path: AlertDefault}),
};

export const Slim = {
  render: () => renderTwig({path: AlertSlim}),
};

export const NoIcon = {
  render: () => renderTwig({path: AlertNoIcon}),
};
