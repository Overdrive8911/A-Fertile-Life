import { UiPassageName } from "./enums";

export function forceAddUI(
  dataInitPassageName: UiPassageName,
  textToWikify: string
) {
  $(document).one(":passageend", () => {
    const element = $(`[data-init-passage=${dataInitPassageName}]`);
    element.wiki(textToWikify).find("br").remove();

    // For some reason, attached event handlers don't work until I refresh the passage :(
    Engine.play(passage());
  });
}
