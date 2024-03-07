import SiteAlertDefault from '../../components/site-alert/examples/site-alert.twig';
import SiteAlertEmergency from '../../components/site-alert/examples/site-alert-emergency.twig';
import SiteAlertNoHeader from '../../components/site-alert/examples/site-alert-no-header.twig';
import SiteAlertNoIcon from '../../components/site-alert/examples/site-alert-no-icon.twig';
import SiteAlertSlim from '../../components/site-alert/examples/site-alert-slim.twig';
import SiteAlertList from '../../components/site-alert/examples/site-alert-list.twig';

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
