import type { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { getRandomUUID } from "~/utils/random";
import { BaseButton } from "../button";
import GameModal from "./game-modal";
import { closeModal, showModal } from "./generic-modal";

const [prop, setProp] = createStore<{
	modalId: string;
	onConfirm: () => Promise<unknown>;
	children: JSX.Element;
}>({ modalId: getRandomUUID(), onConfirm: async () => void 0, children: "" });

/** Used to confirm destructive actions and such.
 *
 * Only one can be active at any given time and this component must be anchored in the root app.
 */
export function ConfirmationModal() {
	function closeConfirmationModal() {
		closeModal(prop.modalId);
	}

	return (
		<GameModal modalId={prop.modalId} title="CONFIRMATION" medium={true}>
			<div class="mb-4 text-center">
				{prop.children || (
					<div class="text-warning">
						You are about to perform a potentially{" "}
						<strong class="text-warning">destructive</strong> action. Do you
						wish to continue?
					</div>
				)}
			</div>

			<div class="flex gap-4 justify-center">
				<BaseButton class="btn-primary" onClick={closeConfirmationModal}>
					Changed my mind...
				</BaseButton>

				<BaseButton
					class="btn-error"
					onClick={async (_) => {
						await prop.onConfirm();

						closeConfirmationModal();
					}}
				>
					Confirm
				</BaseButton>
			</div>
		</GameModal>
	);
}

/** Call this anywhere to trigger the confirmation modal */
export function triggerConfirmationModal(
	confirmCallBack: () => Promise<unknown>,
	message?: JSX.Element,
) {
	setProp({ children: message ?? "", onConfirm: confirmCallBack });

	showModal(prop.modalId);
}
