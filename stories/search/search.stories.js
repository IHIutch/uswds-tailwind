import SearchDefault from './templates/search.twig';
import SearchLarge from './templates/search-large.twig';
import SearchIconButton from './templates/search-icon-button.twig';

export default {
  title: 'Search',
};

export const Default = {
  render: () => SearchDefault()
};

export const Large = {
  render: () => SearchLarge()
};

export const IconButton = {
  render: () => SearchIconButton()
};
