/** Why doesn't js have Math.clamp? */
function clamp(number: number, min: number, max: number) {
	return Math.max(min, Math.min(number, max));
}

export { clamp };
