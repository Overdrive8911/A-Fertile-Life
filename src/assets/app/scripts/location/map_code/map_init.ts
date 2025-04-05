import { Application } from "pixi.js";
import { convertToClass } from "../../declarations/general_declarations";
import { popoutMap } from "../../story/passages/styles/ui/side_section.module.css";

$(window).on(":passageend", async () => {
  const popoutMapClass = convertToClass(popoutMap);
  const container = document.querySelector(popoutMapClass);
  console.log(container);
  if (container) {
    const app = new Application();

    await app.init({ background: "#1099bb" });

    // Then adding the application's canvas to the DOM body.
    container.prepend(app.canvas);
  } else {
    console.error(`No element with the class "${popoutMapClass}" was found.`);
  }
});
