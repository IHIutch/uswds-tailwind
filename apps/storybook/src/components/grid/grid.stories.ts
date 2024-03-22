import GridDefault from "./examples/grid.twig?url";
import GridResponsiveBreakpoints from "./examples/grid-responsive-breakpoints.twig?url";
import GridOffset from "./examples/grid-offset.twig?url";
import GridWrapping from "./examples/grid-wrapping.twig?url";
import GridGutters from "./examples/grid-gutters.twig?url";
import GridFlex from "./examples/grid-flex.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Grid",
};

export const Default = {
  render: () => renderTwig({path: GridDefault}),
};

export const ResponsiveBreakpoints = {
  render: () => renderTwig({path: GridResponsiveBreakpoints}),
};

export const Offset = {
  render: () => renderTwig({path: GridOffset}),
};

export const Wrapping = {
  render: () => renderTwig({path: GridWrapping}),
};

export const Gutters = {
  render: () => renderTwig({path: GridGutters}),
};

export const Flex = {
  render: () => renderTwig({path: GridFlex}),
};
