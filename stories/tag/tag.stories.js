import TagDefault from './templates/tag.twig';
import TagLarge from './templates/tag-large.twig';

export default {
  title: 'Tag',
};

export const Default = {
  render: () => TagDefault()
};

export const Large = {
  render: () => TagLarge()
};
