import GridDefault from '../../components/grid/examples/grid.twig'
import GridResponsiveBreakpoints from '../../components/grid/examples/responsive-breakpoints.twig'
import GridOffset from '../../components/grid/examples/offset.twig'
import GridWrapping from '../../components/grid/examples/wrapping.twig'
import GridGutters from '../../components/grid/examples/gutters.twig'
import GridFlex from '../../components/grid/examples/flex.twig'

export default {
  title: 'Grid',
};

export const Default = {
  render: () => GridDefault()
};

export const ResponsiveBreakpoints = {
  render: () => GridResponsiveBreakpoints()
};

export const Offset = {
  render: () => GridOffset()
};

export const Gutters = {
  render: () => GridGutters()
};
export const Flex = {
  render: () => GridFlex()
};

