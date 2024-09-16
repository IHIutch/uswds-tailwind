import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import mask from '@alpinejs/mask';
import anchor from '@alpinejs/anchor';

import accordion from "./accordion";
import characterCount from "./character-count";
import collapse from "./collapse";
import combobox from "./combobox";
import dropdown from "./dropdown";
import fileInput from "./file-input";
import inputMask from "./input-mask";
import modal from "./modal";
import tooltip from "./tooltip";

Alpine.plugin(focus);
Alpine.plugin(mask);
Alpine.plugin(anchor);

Alpine.plugin(accordion)
Alpine.plugin(characterCount)
Alpine.plugin(collapse)
Alpine.plugin(combobox)
Alpine.plugin(dropdown)
Alpine.plugin(fileInput)
Alpine.plugin(inputMask)
Alpine.plugin(modal)
Alpine.plugin(tooltip)

if (typeof window.Alpine === "undefined") {
  window.Alpine = Alpine;
  Alpine.start();
}
