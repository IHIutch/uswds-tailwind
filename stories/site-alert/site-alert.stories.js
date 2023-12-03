import SiteAlertDefault from './templates/site-alert.twig';
import SiteAlertEmergency from './templates/site-alert-emergency.twig';
import SiteAlertNoHeader from './templates/site-alert-no-header.twig';
import SiteAlertNoIcon from './templates/site-alert-no-icon.twig';
import SiteAlertSlim from './templates/site-alert-slim.twig';
import SiteAlertList from './templates/site-alert-list.twig';

export default {
  title: 'Site Alert',
};

export const Default = {
  render: () => SiteAlertDefault()
};

export const Emergency = {
  render: () => SiteAlertEmergency()
};

export const EmergencyList = {
  render: () => SiteAlertList()
};

export const EmergencyNoHeader = {
  render: () => SiteAlertNoHeader()
};

export const EmergencyNoIcon = {
  render: () => SiteAlertNoIcon()
};

export const EmergencySlim = {
  render: () => SiteAlertSlim()
};
