import type { JSX } from "solid-js/jsx-runtime";
import { GenericModal } from "./generic-modal";

export default function GameModal(prop: {
	modalId: string;
	title: JSX.Element;
	children: JSX.Element;
	class?: string;
	/** Defaults to true */
	useProse?: boolean;

	/** For cases when I don't want the modal to be wide */
	medium?: boolean;
}) {
	return (
		<GenericModal
			class={`p-4 border border-primary drop-shadow-primary/50 drop-shadow-md ${prop.medium ? "max-w-100" : "max-w-[90vw] md:max-w-[75vw] lg:max-w-[60vw]"} ${prop.class}`}
			modalId={prop.modalId}
		>
			<h2 class="text-center text-lg font-bold">{prop.title}</h2>

			<hr class="my-2 h-px border-none bg-gradient-to-r from-transparent via-primary to-transparent" />

			<div
				class={`${(prop.useProse ?? true) ? "prose" : ""} max-w-full text-base-content`}
			>
				{prop.children}
			</div>
		</GenericModal>
	);
}
