import GameModal from "../../modal/game-modal";

export function InventoryModal(prop: { modalId: string }) {
	return (
		<GameModal modalId={prop.modalId} title="INVENTORY">
			Gorb You :3
		</GameModal>
	);
}
