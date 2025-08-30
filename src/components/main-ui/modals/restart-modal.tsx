import { GAME_ENGINE } from "~/game/engine/engine";
import GameModal from "../../modal/game-modal";
import { closeModal } from "../../modal/generic-modal";

export function RestartModal(prop: { modalId: string }) {
	function closeModalWithId(e: MouseEvent) {
		e.stopPropagation();

		return closeModal(prop.modalId);
	}

	return (
		<GameModal modalId={prop.modalId} title="RESTART" medium={true}>
			<div class="text-warning text-center mb-4">
				This will reset all unsaved progress!
			</div>

			<div class="modal-action">
				<button
					type="button"
					class="btn btn-primary"
					onClick={closeModalWithId}
				>
					Changed my mind...
				</button>

				<button
					type="button"
					class="btn btn-error"
					onClick={(e) => {
						GAME_ENGINE.reset();
						closeModalWithId(e);
					}}
				>
					Restart
				</button>
			</div>
		</GameModal>
	);
}
