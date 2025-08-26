import BellIcon from "lucide-solid/icons/bell";
import { Block } from "../../shared/block";

export function Reminders() {
	return (
		<Block
			title={
				<>
					REMINDERS
					<BellIcon class="inline-block ml-1" />
				</>
			}
		>
			**Display a list of recent reminders here**
		</Block>
	);
}
