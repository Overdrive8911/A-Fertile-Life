import GameModal from "../../modal/game-modal";

export function SettingsModal(prop: { modalId: string }) {
	return (
		<GameModal modalId={prop.modalId} title="SETTINGS">
			Gorb You :3
		</GameModal>
	);
}
