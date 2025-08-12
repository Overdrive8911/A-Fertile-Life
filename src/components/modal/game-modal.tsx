import type { JSX } from "solid-js/jsx-runtime";
import { GenericModal } from "./generic-modal";

export default function GameModal(prop: {
	modalId: string;
	title: string;
	children: JSX.Element;
}) {
	return (
		<GenericModal
			class="p-4 border border-primary drop-shadow-primary/50 drop-shadow-md"
			modalId={prop.modalId}
		>
			<h2 class="text-center text-lg font-bold">{prop.title}</h2>

			<hr class="my-2 h-px border-none bg-gradient-to-r from-transparent via-primary to-transparent" />

			{prop.children}
		</GenericModal>
	);
}
