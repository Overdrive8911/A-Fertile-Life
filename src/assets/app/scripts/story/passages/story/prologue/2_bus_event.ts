import { convertToClass } from "../../../../declarations/general_declarations";
import { playerPorch } from "../../../../location/game_locations/west_hirtheford/your_neighbourhood/locations/player_house";
import { StoryPassageName } from "../../../enums";
import { ctpNoId } from "../../../functions/external_libs/ctp";
import { br, em, p, span } from "../../../functions/html_elements";
import { macroLink, macroReplace } from "../../../functions/macros";
import { addPassage } from "../../../functions/passage_funcs";
import { clearMe } from "../../styles/other.module.css";
import { femaleSpeech, maleSpeech } from "../../styles/speech.module.css";

addPassage({
  name: StoryPassageName.PROLOGUE_DRESSED_AND_ENTERING_BUS,
  tags: [playerPorch.uuid],
  text:
    p(
      "You're now dressed and exiting your house, wearing something casual; business casual. It's a plain creamy cotton T-shirt tucked into nice grey trousers; normally, they'd be a tad too big to fit, but currently your body fills it out nicely. You would've chosen something different if not for the fact that basically nothing else fit; you're not sure if it's the ice cream you've been using to cope lately."
    ) +
    p(
      "But that isn't where your focus is, you're still muttering to yourself, reciting different ways to start your conversation without coming across as rude or desperate. You walk over to the nearby bus stop, still pondering over your thoughts. It's only when you hear the hum of a bus coming to rest, you look up. You see the bus you normally board to work—well, used to."
    ) +
    p(
      "The driver winds down the window and gives you a hearty smile; he's an older man in his fifties. " +
        span(
          { class: maleSpeech },
          "“Oi! Nice to see you today, miss. It's been three days, right? I was getting worried since you usually board us on the weekdays, but I'm glad you're alright,” "
        ) +
        "the man says, patting his steering wheel towards the end."
    ) +
    p(
      "Faking a smile, you greet the driver. " +
        em({ class: femaleSpeech }, "Alright? Ppf. ") +
        "That irked you, but it's not like you could get angry with him; he's a sweet old man, besides it's not like he's aware of your predicament."
    ) +
    p(
      "You brush it off and tell him the new location you're going to. " +
        span(
          { class: maleSpeech },
          "“Oh, that's pretty far from here, lass. I'm not quite sure why you'd even want to go to that place, but I can do it for you. Luckily, most of my passengers are dropping along the route I'll have to follow to get there.”"
        )
    ) +
    p(
      span({ class: femaleSpeech }, "“Thank you,” ") +
        `you tell him before moving to the back and falling on a seat. The bus is sparsely populated, with only a few people; probably on their way to work. You try to calm your thoughts and focus on the task at hand. As the bus moves on, you can't help but feel a bit drowsy. Eventually you fall ${macroLink(
          "asleep",
          "",
          StoryPassageName.PROLOGUE_BUS_DREAM_0
        )}`
    ),
});

addPassage({
  name: StoryPassageName.PROLOGUE_BUS_DREAM_0,
  text: ctpNoId(
    {
      options: { t8n: true },
      content: `...${br}`,
      progress(progressText) {
        return span(
          { class: clearMe },
          br +
            macroLink(
              "Next?",
              progressText + macroReplace(convertToClass(clearMe))
            )
        );
      },
    },
    {
      content:
        "......." +
        br +
        p(
          "It's pitch black all around you; almost as if you're suspended in the endless emptiness of the void—you don't panic, however. For some reason, you feel calm. It's almost as if all your troubles and worries melted away…"
        ) +
        p(em(macroLink("Almost…", "", StoryPassageName.PROLOGUE_BUS_DREAM_1))),
    }
  ),
});
