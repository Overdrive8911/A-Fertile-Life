import { GAME_VARIABLES } from "~/game/engine/engine";
import { Womb } from "~/game/pregnancy/classes/womb";
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
				<StatMeter
					val={player().hp / player().maxHp}
					stat="Health"
					icon={healthIcon}
				/>
				<StatMeter
					val={player().energy / 100}
					stat="Energy"
					icon={energyIcon}
				/>
				<StatMeter val={player().mood / 100} stat="Mood" icon={moodIcon} />
				<StatMeter
					val={player().fullness / 100}
					stat="Fullness"
					icon={stomachIcon}
				/>
				<StatMeter
					val={womb().hp / womb().maxHp}
					stat="Womb Health"
					icon={uterusHpIcon}
				/>
				<StatMeter
					val={womb().exp / Womb.getExpLimit(womb().lvl + 1)}
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
