import { StoryPassageName } from "../../../enums";
import { em, p, span } from "../../../functions/html_elements";
import { addPassage } from "../../../functions/passage_funcs";
import { femaleSpeech } from "../../styles/speech.module.css";

addPassage({
  name: StoryPassageName.PROLOGUE_BEGINNING,
  text:
    p(
      "You lie on your bed in your house, sprawled across the material while staring at the ceiling. It's 9:00PM and the chilly nighttime wind blows into your room, although it does nothing to cool the tense air around you. The past few weeks have been really hectic. Ever since the unfortunate accident at your job, almost a month before, everything's been falling apart. It started with the weird men, dressed in black, that have been coming over to your workplace to meet your boss, leaving him looking shaken each time they left. Not even up to a week later, sales started dropping steadily, which just worsened the situation."
    ) +
    p(
      "In fact, just two days ago at work, you were laid off. When you asked why, your boss shifted uncomfortably in his seat, avoiding eye contact, and said something about the legalities concerning your immigration. You're not convinced though, however you can't really blame him. He did give you a stable, albeit boring job that paid for your expenses when others rejected you. Those suspicious people most likely said or did something to him. Or not, maybe you're just overthinking this." +
        span(
          { class: femaleSpeech },
          `"At least I got some compensation, that and my savings should hopefully last me till I can find a new job",`
        ) +
        "you tell yourself."
    ) +
    p(
      "Trying not to think about that, you shift your attention to an envelope you're holding. It was delivered by an unknown sender the same day you lost your job. Partially due to stress and suspicion—from how " +
        em("coincidentally") +
        " it arrived—you didn't open it. Till now, that is…"
    ) +
    p(
      "You rise to a sitting position and bring the envelope to your face. It's whitish and looks rather plain. Nothing about it feels suspicious, so you open it and pull out a folded paper."
    ),
});
