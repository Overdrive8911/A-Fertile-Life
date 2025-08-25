import { createSignal, Show } from "solid-js";
import { GenericLink, PassageLink } from "~/components/link";
import GameModal from "~/components/modal/game-modal";
import { showModal } from "~/components/modal/generic-modal";
import { getRandomUUID } from "~/utils/random";
import { PassagePrologueName } from "./enums";

export function PassagePrologueHomeEvent() {
	const letterModalId = getRandomUUID();

	const [hasOpenedLetter, setHasOpenedLetter] = createSignal(false);

	return (
		<>
			<p>
				You lie on your bed in your house, sprawled across the material while
				staring at the ceiling. It's 9:00PM and the chilly nighttime wind blows
				into your room, although it does nothing to cool the tense air around
				you. The past few weeks have been really hectic. Ever since the
				unfortunate accident at your job, almost a month before, everything's
				been falling apart. It started with the weird men, dressed in black,
				that have been coming over to your workplace to meet your boss, leaving
				him looking shaken each time they left. Not even up to a week later,
				sales started dropping steadily, which just worsened the situation.
			</p>

			<p>
				In fact, just two days ago at work, you were laid off. When you asked
				why, your boss shifted uncomfortably in his seat, avoiding eye contact,
				and said something about the legalities concerning your immigration.
				You're not convinced though, however you can't really blame him. He did
				give you a stable, albeit boring job that paid for your expenses when
				others rejected you. Those suspicious people most likely said or did
				something to him. Or not, maybe you're just overthinking this.{" "}
				<span class="text-secondary">
					"At least I got some compensation, that and my savings should
					hopefully last me till I can find a new job",
				</span>{" "}
				you tell yourself.
			</p>

			<p>
				Trying not to think about that, you shift your attention to an envelope
				you're holding. It was delivered by an unknown sender the same day you
				lost your job. Partially due to stress and suspicion—from how{" "}
				<em>coincidentally</em> it arrived—you didn't open it. Till now, that
				is…
			</p>

			<p>
				You rise to a sitting position and bring the envelope to your face. It's
				whitish and looks rather plain. Nothing about it feels suspicious, so
				you open it and pull out a folded paper.
			</p>

			<p>
				Before you can unfold it, a wave of discomfort hits your midsection
				hard. You clutch your abdomen and breathe in deeply; this isn't the
				first time. Lately, you've been feeling some pains right above your
				pelvis.{" "}
				<span class="text-secondary">"Ugh, this is the worst one yet,"</span>{" "}
				you grumble. Period pain. You chalked it up to period pain and so bought
				some medication last night, but it doesn't feel too helpful now.
			</p>

			<p>
				The discomfort eventually subsides in a few minutes; luckily, this
				happens seldom. Taking in another deep breath, you focus on the envelope
				and pull out the letter.
			</p>

			<GenericLink
				onClick={(_) => {
					showModal(letterModalId);
					setHasOpenedLetter(true);
				}}
			>
				Read the Letter
			</GenericLink>

			<Show when={hasOpenedLetter()}>
				<p>
					The paper falls from your hand in shock.{" "}
					<span class="text-secondary">
						<em>
							"What the FUCK?! How did this guy know this? How could anyone know
							this much about me? Are they spying on me now?"
						</em>
					</span>{" "}
					you think. Your eyes scan the surrounding room. There aren't any
					visible cameras or anything similar in sight, but its not like you
					expected to see them in plain sight.
				</p>

				<p>
					<em class="text-secondary">
						"…I hate to admit it, but they're right, I don't really have much of
						a choice now. I honestly didn't have a solid plan before… If I go
						there tomorrow, even if it's a scam, I'll have a shot at finding out
						how they got to know this much… God, I hope I'll be able to make
						sense of this mess."
					</em>{" "}
					{/* You've been feeling a dull but constant ache just above your pelvic region for a while now, alongside headaches and a fever. Not to talk of the semi-recent weird feeling of emptiness and occasional 'heat' that's uncomfortable to deal with. */}
					You understandably still have your doubts, and hope none of this is
					true—especially the symptoms part—but that's diminishing by the
					minute.
				</p>

				<p>
					You make a mental note to go to the hospital tomorrow.{" "}
					<em class="text-secondary">"Better than nothing, I guess."</em> For
					now, you'll try to get some{" "}
					<PassageLink
						passage={PassagePrologueName.PROLOGUE_WAKE_UP_AND_BRUSH_TEETH}
					>
						sleep.
					</PassageLink>
				</p>
			</Show>

			<GameModal title="LETTER" modalId={letterModalId}>
				<p>
					Good day, Miss, I would like to first apologize for all that is
					happening to you now. Ever since the <em>incident</em>, your life has
					been unexpectedly—well, expectedly—more inconvenient to put it
					lightly.
				</p>

				<p>
					Your job security is compromised at this point, but I'm sure you
					already know this. You are likely scared and worried now; getting
					another job is not going to be easy, especially since your papers are
					not in order.
				</p>

				<p>
					By now, you should also have noticed some strange things about your
					body. They are light symptoms from your exposure and will likely
					intensify with the passing days. The most obvious of these will be an
					unusual feeling around your pelvic region.
				</p>

				<p>
					You also need to know that if you have seen some suspicious people
					dressed in similar attire around places you frequent, your home is not
					as safe as you think.
				</p>

				<p>
					Now, do not fret yet. I have better news that could resolve most, if
					not all, your problems. I own a hospital about a hundred or so miles
					up north from your house, Fertilo Inc, might ring a few bells. To be
					frank, it's the only place you can have your condition treated without
					resorting to the government and you <strong>do not</strong> want to be
					their lab rat, trust me. I can also provide you with living
					accommodations and a well-paying job, as well as a new alias you can
					go by, during your treatment.
				</p>

				<p>
					You might be wondering why I sent you this letter or whether this is a
					scam. For the former, I also benefit here. Your medical condition is a
					one-in-a-million modern marvel, and the second I have seen in my
					entire lifetime. This will be the perfect chance for me to study it
					extensively; I believe that there is something special about it that
					will be of great benefit to humanity.
				</p>

				<p>
					For the latter, you do not have much of a choice, honestly. None of
					your living family members live in the country; and I doubt you'd be
					willing to go back. Your house will probably be jumped by 'agents'
					next week too.
				</p>

				<p>
					I am not trying to threaten you; just letting you know your options.
					If you're interested about how I got this information, feel free to
					come, but please think about your situation properly. I'll be awaiting
					your response.
				</p>

				<p>
					<strong>PS:</strong> The directions are on the inner side of the
					envelope."
				</p>
			</GameModal>
		</>
	);
}

export function PassagePrologueHomeEventBathroom() {
	return (
		<>
			<p>
				The digital alarm clock rings out loudly, waking you up. It is 7:00 AM.
			</p>
			{/*TODO - The PC will be able to choose their mood once they wake up and this will decide their default personality; enthusiastic, apathy, or disapproval */}
			{/*TODO - Also the PC will have morning sickness and strange cravings */}
			<p>
				Hitting it instinctively, you silence the alarm. You drudgingly pull
				yourself out of your bed to get to the toilet. You didn't get much
				sleep; the entire night was spent rolling about on your bed
				contemplating about the letter and your choice. Although, for some
				reason, you feel even more lethargic than you expected.{" "}
				<em class="text-secondary">
					"Ugh, please tell me this isn't one of the symptoms the letter hinted
					at…"
				</em>
			</p>
			<p>
				In your bathroom, you stand in front of the mirror situated right above
				the sink and see a pair of baggy eyes staring back. You're still wearing
				your clothes from yesterday; a well-worn plain baggy black shirt with a
				pair of comfy shorts, but you never cared much about clothing as long as
				it's comfortable.
			</p>
			<p>
				You absent-mindedly pick up a toothbrush and slather some paste on it,
				still thinking of the letter yesterday.{" "}
				<em class="text-secondary">
					"What am I going to say when I get there? It's not like I can just
					say, "Oh hi there, why the FUCK were you spying on me?""
				</em>{" "}
				You sigh and spit into the sink.{" "}
				<em class="text-secondary">I'll just figure it out, later</em>
			</p>
		</>
	);
}
