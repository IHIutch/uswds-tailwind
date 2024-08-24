import './main.css';
import "@fontsource-variable/open-sans";
import "@fontsource-variable/public-sans";
import "@fontsource-variable/roboto-mono";
import '@fontsource-variable/source-sans-3';

import "@fontsource/merriweather/300.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";

import Alpine from "@alpinejs/csp";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";
import anchor from "@alpinejs/anchor";

import accordion from "../components/accordion/accordion";
import inputMask from "../components/input/input-mask";
import modal from "../components/modal/modal";
import combobox from "../components/combobox/combobox";
import collapse from "../components/banner/collapse";
import dropdown from "../components/language-selector/dropdown";
import tooltip from "../components/tooltip/tooltip";
import characterCount from "../components/character-count/character-count";
import fileInput from "../components/file-input/file-input";

Alpine.plugin(focus);
Alpine.plugin(mask);
Alpine.plugin(anchor);

Alpine.plugin(accordion)
Alpine.plugin(inputMask)
Alpine.plugin(modal)
Alpine.plugin(combobox)
Alpine.plugin(collapse)
Alpine.plugin(dropdown)
Alpine.plugin(tooltip)
Alpine.plugin(characterCount)
Alpine.plugin(fileInput)

if (typeof window.Alpine === "undefined") {
  window.Alpine = Alpine;
  Alpine.start();
}
