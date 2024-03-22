import CollectionDefault from "./examples/collection.twig?url";
import CollectionMediaThumbnail from "./examples/collection-media-thumbnail.twig?url";
import CollectionCalendarDisplay from "./examples/collection-calendar-display.twig?url";
import CollectionHeadingsOnly from "./examples/collection-headings-only.twig?url";
import { renderTwig } from "../../utils/render-twig";

export default {
  title: "Collection",
};

export const Default = {
  render: () => renderTwig({path: CollectionDefault}),
};

export const MediaThumbnail = {
  render: () => renderTwig({path: CollectionMediaThumbnail}),
};

export const CalendarDisplay = {
  render: () => renderTwig({path: CollectionCalendarDisplay}),
};

export const HeadingsOnly = {
  render: () => renderTwig({path: CollectionHeadingsOnly}),
};
