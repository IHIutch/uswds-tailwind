import TableDefault from "./examples/table.twig?url";
import TableStriped from "./examples/table-striped.twig?url";
import TableBorderless from "./examples/table-borderless.twig?url";
import TableCompact from "./examples/table-compact.twig?url";
import TableScrollable from "./examples/table-scrollable.twig?url";
import TableStickyHeader from "./examples/table-sticky-header.twig?url";
import TableStickyColumn from "./examples/table-sticky-column.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Table",
};

export const Default = {
  render: () => renderTwig({ path: TableDefault }),
};

export const Striped = {
  render: () => renderTwig({ path: TableStriped }),
};

export const Borderless = {
  render: () => renderTwig({ path: TableBorderless }),
};

export const Compact = {
  render: () => renderTwig({ path: TableCompact }),
};

export const Scrollable = {
  render: () => renderTwig({ path: TableScrollable }),
};

export const StickyHeader = {
  render: () => renderTwig({ path: TableStickyHeader }),
};

export const StickyColumn = {
  render: () => renderTwig({ path: TableStickyColumn }),
};
