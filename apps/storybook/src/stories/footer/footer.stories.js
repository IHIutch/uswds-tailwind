import FooterDefault from '../../components/footer/examples/footer.twig'
import FooterMedium from '../../components/footer/examples/medium.twig'
import FooterSlim from '../../components/footer/examples/slim.twig'
// import props from "./footer-props.json";

export default {
  title: 'Footer',
};

export const Default = {
  render: () => FooterDefault()
};
export const Medium = {
  render: () => FooterMedium()
};
export const Slim = {
  render: () => FooterSlim()
};

