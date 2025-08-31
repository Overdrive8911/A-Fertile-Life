import type { Component } from "solid-js";
import { AlertWrapper } from "./components/alert";
import { MainUI } from "./components/main-ui";
import { ConfirmationModal } from "./components/modal/confirmation-modal";

const App: Component = () => {
	return (
		<>
			<div class="h-screen w-screen overflow-y-clip">
				<MainUI />
			</div>

			<AlertWrapper />
			<ConfirmationModal />
		</>
	);
};

export default App;
