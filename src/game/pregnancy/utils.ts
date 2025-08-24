/** Make sure that, using the stats of a full term fetus, the result is close to 10000ml~11000ml. Preferably the former */
export function getWombVolumeFromFetusStats(
	height: number,
	weight: number,
	fluidVolume: number,
) {
	// Make sure that, using the stats of a full term fetus, the result is close to 10000ml~11000ml. Preferably the former
	return (weight + height + fluidVolume * 0.4) * (10 / 4);
}
