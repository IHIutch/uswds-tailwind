import "@fontsource-variable/open-sans";
import "@fontsource-variable/public-sans";
import "@fontsource/merriweather/300.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";
import "@fontsource/source-sans-pro/200.css";
import "@fontsource/source-sans-pro/300.css";
import "@fontsource/source-sans-pro/400.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/source-sans-pro/700.css";
import "@fontsource/source-sans-pro/900.css";
import "@fontsource-variable/roboto-mono";

import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import mask from '@alpinejs/mask'

import accordion from "../components/accordion/accordion";
import inputMask from "../components/input/input-mask";
import modal from "../components/modal/modal";
import combobox from "../components/combobox/combobox";
import collapse from "../components/banner/collapse";

Alpine.plugin(focus);
Alpine.plugin(mask);

Alpine.plugin(accordion)
Alpine.plugin(inputMask)
Alpine.plugin(modal)
Alpine.plugin(combobox)
Alpine.plugin(collapse)

if (typeof window.Alpine === "undefined") {
  window.Alpine = Alpine;
  Alpine.start();
}
