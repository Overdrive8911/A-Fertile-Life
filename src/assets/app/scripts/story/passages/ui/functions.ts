import { UiPassageName } from "./enums";

export function forceAddUI(
  dataInitPassageName: UiPassageName,
  textToWikify: string | string[]
) {
  $(document).one(":passageend", () => {
    const element = $(`[data-init-passage=${dataInitPassageName}]`);
    element
      .empty()
      .wiki(
        typeof textToWikify == "string" ? textToWikify : textToWikify.join("")
      )
      .find("br")
      .remove();

    // For some reason, attached event handlers don't work until I refresh the passage :(
    Engine.play(passage());
  });
}
