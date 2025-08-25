import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";

/** Use to open the modal.
 * **<button class="btn" onclick="my_modal_2.showModal()">open modal</button>** */
function GenericModal(prop: {
	modalId: string;
	children: JSX.Element;
	class?: string;
}) {
	return (
		<Portal>
			<dialog closedby="any" id={prop.modalId} class="modal">
				<div class={`modal-box max-h-[85vh] ${prop.class}`}>
					<form method="dialog">
						<button
							type="submit"
							class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							aria-label="Close Modal"
						>
							✕
						</button>
					</form>
					<div>{prop.children}</div>
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
	if (dialog && dialog instanceof HTMLDialogElement) return dialog;
	else return null;
}

function showModal(modalId: string) {
	getDialogElementFromId(modalId)?.showModal();
}

function closeModal(modalId: string) {
	getDialogElementFromId(modalId)?.close();
}

export { GenericModal, closeModal, showModal };
