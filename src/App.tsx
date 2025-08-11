import type { Component } from "solid-js";
import MainUI from "./components/main-ui";

const App: Component = () => {
	return (
		<div class="h-[100vh] w-[100vw] overflow-y-clip">
			<MainUI />
		</div>
	);
};

export default App;
