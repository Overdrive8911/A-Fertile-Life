/** To download any blob data / string to the user's device */
export function downloadData(data: string | Blob, filename = "download.txt") {
	const blob =
		data instanceof Blob ? data : new Blob([data], { type: "text/plain" });

	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;

	a.click();

	// Clean up the object URL
	URL.revokeObjectURL(url);
}
