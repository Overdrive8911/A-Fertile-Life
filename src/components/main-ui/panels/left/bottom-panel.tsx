import BackpackIcon from "lucide-solid/icons/backpack";
import RotateCcwIcon from "lucide-solid/icons/rotate-ccw";
import SaveIcon from "lucide-solid/icons/save";
import SettingsIcon from "lucide-solid/icons/settings";
import type { JSX } from "solid-js";
import { showModal } from "~/components/modal/generic-modal";
import { getRandomUUID } from "~/utils/random";
import { InventoryModal } from "../../modals/inventory-modal";
import { RestartModal } from "../../modals/restart-modal";
import { SaveGameModal } from "../../modals/save-game-modal";
import { SettingsModal } from "../../modals/settings-modal";

function Button(prop: {
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
}) {
	return (
		<button
			type="button"
			class="btn btn-primary btn-soft text-lg w-4/5 p-0"
			onClick={prop.onClick}
		>
			{prop.children}
		</button>
	);
}

export function BottomPanel() {
	const saveDialogId = getRandomUUID(),
		inventoryDialogId = getRandomUUID(),
		settingsDialogId = getRandomUUID(),
		restartDialogId = getRandomUUID();

	return (
		<div class="flex flex-col justify-end items-center gap-8 pb-4">
			<Button
				onClick={(_) => {
					showModal(saveDialogId);
				}}
			>
				<SaveIcon />
				Save
				<SaveGameModal modalId={saveDialogId} />
			</Button>

			<Button
				onClick={(_) => {
					showModal(inventoryDialogId);
				}}
			>
				<BackpackIcon />
				Inventory
				<InventoryModal modalId={inventoryDialogId} />
			</Button>

			<Button
				onClick={(_) => {
					showModal(settingsDialogId);
				}}
			>
				<SettingsIcon />
				Settings
				<SettingsModal modalId={settingsDialogId} />
			</Button>

			<Button
				onClick={(_) => {
					showModal(restartDialogId);
				}}
			>
				<RotateCcwIcon />
				Restart
				<RestartModal modalId={restartDialogId} />
			</Button>
		</div>
	);
}
