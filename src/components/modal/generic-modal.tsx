import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";

/** Use to open the modal.
 * **<button class="btn" onclick="my_modal_2.showModal()">open modal</button>** */
function GenericModal(prop: {
	modalId: string;
	children: JSX.Element;
	class?: string;
	/** Normally, modal's have a z-index of 999 */
	"z-index"?: number | undefined;
}) {
	return (
		<Portal>
			<dialog
				closedby="closerequest"
				id={prop.modalId}
				class="modal"
				style={{ "z-index": prop["z-index"] ?? 999 }}
			>
				<div class={`modal-box max-h-[90vh] sm:max-h-[85vh] ${prop.class}`}>
					<form method="dialog">
						<button
							type="submit"
							class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							aria-label="Close Modal"
						>
							✕
						</button>

						<div>{prop.children}</div>
					</form>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button type="submit">close</button>
				</form>
			</dialog>
		</Portal>
	);
}

function getDialogElementFromId(id: string): HTMLDialogElement | null {
	const dialog = document.getElementById(id);

	return dialog instanceof HTMLDialogElement ? dialog : null;
}

function showModal(modalId: string) {
	getDialogElementFromId(modalId)?.show();
}

function closeModal(modalId: string) {
	getDialogElementFromId(modalId)?.close();
}

export { GenericModal, closeModal, showModal };
