import SiteAlertDefault from "./examples/site-alert.twig?url";
import SiteAlertEmergency from "./examples/site-alert-emergency.twig?url";
import SiteAlertNoHeader from "./examples/site-alert-no-header.twig?url";
import SiteAlertNoIcon from "./examples/site-alert-no-icon.twig?url";
import SiteAlertSlim from "./examples/site-alert-slim.twig?url";
import SiteAlertList from "./examples/site-alert-list.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Site Alert",
};

export const Default = {
  render: () => renderTwig({path: SiteAlertDefault}),
};

export const Emergency = {
  render: () => renderTwig({path: SiteAlertEmergency}),
};

export const EmergencyList = {
  render: () => renderTwig({path: SiteAlertList}),
};

export const EmergencyNoHeader = {
  render: () => renderTwig({path: SiteAlertNoHeader}),
};

export const EmergencyNoIcon = {
  render: () => renderTwig({path: SiteAlertNoIcon}),
};

export const EmergencySlim = {
  render: () => renderTwig({path: SiteAlertSlim}),
};
