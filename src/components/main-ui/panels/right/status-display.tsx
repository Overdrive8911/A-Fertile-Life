import energyIcon from "~/media/img/icons/stats/energy.webp";
import healthIcon from "~/media/img/icons/stats/heart.webp";
import moodIcon from "~/media/img/icons/stats/mood.webp";
import stomachIcon from "~/media/img/icons/stats/stomach.webp";
import uterusExpIcon from "~/media/img/icons/stats/uterus-exp.webp";
import uterusHpIcon from "~/media/img/icons/stats/uterus-hp.webp";
import { StatMeter } from "../../../meter";
import { Block } from "../../shared/block";

export function StatusDisplay() {
	return (
		<Block title="STATS">
			<div class="flex flex-col gap-2">
				<StatMeter val={0.9} stat="Health" icon={healthIcon} />
				<StatMeter val={0.69} stat="Energy" icon={energyIcon} />
				<StatMeter val={0.87} stat="Mood" icon={moodIcon} />
				<StatMeter val={0.72} stat="Fullness" icon={stomachIcon} />
				<StatMeter val={0.89} stat="Womb Health" icon={uterusHpIcon} />
				<StatMeter
					val={0.23}
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
