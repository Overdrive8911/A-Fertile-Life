import { GAME_VARIABLES } from "~/game/engine/engine";
import energyIcon from "~/media/img/icons/stats/energy.webp";
import healthIcon from "~/media/img/icons/stats/heart.webp";
import moodIcon from "~/media/img/icons/stats/mood.webp";
import stomachIcon from "~/media/img/icons/stats/stomach.webp";
import uterusExpIcon from "~/media/img/icons/stats/uterus-exp.webp";
import uterusHpIcon from "~/media/img/icons/stats/uterus-hp.webp";
import { StatMeter } from "../../../meter";
import { Block } from "../../shared/block";

export function StatusDisplay() {
	const player = () => GAME_VARIABLES.player;
	const womb = () => player().womb;

	return (
		<Block title="STATS">
			<div class="flex flex-col gap-2">
				<StatMeter val={player().hpRatio} stat="Health" icon={healthIcon} />
				<StatMeter val={player().energyRatio} stat="Energy" icon={energyIcon} />
				<StatMeter val={player().moodRatio} stat="Mood" icon={moodIcon} />
				<StatMeter
					val={player().fullnessRatio}
					stat="Fullness"
					icon={stomachIcon}
				/>
				<StatMeter
					val={womb().hpRatio}
					stat="Womb Health"
					icon={uterusHpIcon}
				/>
				<StatMeter
					val={womb().expRatio}
					stat="Womb Exp"
					icon={uterusExpIcon}
					highColor="blue"
					midColor="blue"
					lowColor="blue"
				/>
			</div>
		</Block>
	);
}
