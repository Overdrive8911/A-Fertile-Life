import { writeClipboard } from "@solid-primitives/clipboard";
import { ReactiveMap } from "@solid-primitives/map";
import CheckIcon from "lucide-solid/icons/circle-check";
import ErrorIcon from "lucide-solid/icons/circle-x";
import CopyIcon from "lucide-solid/icons/clipboard-copy";
import InfoIcon from "lucide-solid/icons/info";
import WarningIcon from "lucide-solid/icons/triangle-alert";
import { Index, onCleanup, onMount, Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { Dynamic, Portal } from "solid-js/web";
import type { UUID } from "~/types/uuid";
import { getRandomUUID } from "~/utils/random";

type AlertId = UUID;

type AlertData = {
	/** type of alert class to use */
	type: "success" | "error" | "info" | "warning";

	children: JSX.Element;

	/** how long the alert should last before fading away in ms
	 *
	 * @default 3000ms
	 */
	duration?: number;
};

const alerts = new ReactiveMap<AlertId, AlertData>();

/** Adds the given alert to a private collection which will indirectly display it */
export function createAlert(alert: AlertData) {
	alerts.set(getRandomUUID(), alert);
}

/** Wrapper that contains and displays alerts to be shown */
export function AlertWrapper() {
	return (
		<Show when={alerts.size}>
			<Portal>
				<section class="toast toast-top z-[1999]">
					<Index each={[...alerts]}>
						{(val) => {
							const alertData = () => val()[1];

							return (
								<AlertPanel
									id={val()[0]}
									type={alertData().type}
									duration={alertData().duration ?? 3000}
								>
									{alertData().children}
								</AlertPanel>
							);
						}}
					</Index>
				</section>
			</Portal>
		</Show>
	);
}

function AlertPanel(prop: AlertData & { id: AlertId }) {
	const classes = {
		success: "alert-success",
		error: "alert-error",
		info: "alert-info",
		warning: "alert-warning",
	} as const;

	const icons = {
		success: CheckIcon,
		error: ErrorIcon,
		info: InfoIcon,
		warning: WarningIcon,
	} as const;

	function deleteId() {
		alerts.delete(prop.id);
	}

	onMount(() => {
		const timer = setTimeout(() => {
			deleteId();
		}, prop.duration);

		onCleanup(() => clearTimeout(timer));
	});

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <I'll find a better work around later,, it's almost 4am>
		<div
			role="alert"
			class={`alert alert-soft ${classes[prop.type]}`}
			onClick={deleteId}
		>
			<Dynamic component={icons[prop.type]}></Dynamic>

			<div class="flex flex-col gap-1">
				{prop.children}
				<div class="text-xs text-center">Tap to dismiss</div>
			</div>

			<button
				type="button"
				class="cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();

					writeClipboard(`${prop.children}`);
				}}
			>
				<CopyIcon />
			</button>
		</div>
	);
}
