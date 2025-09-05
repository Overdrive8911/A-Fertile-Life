/** Why doesn't js have Math.clamp? */
function clamp(number: number, min: number, max: number):number {
	return Math.max(min, Math.min(number, max));
}

/** Whether or not a number is a floating number */
function isFloat(number: number):boolean {
	return number % 1 !== 0;
}

/** Checks whether a number is within the specified bounds
 *
 * @param [inclusive=true] if true, the check is inclusive (i.e also includes the lower and upper bounds)
 */
function withinBounds(num:number, lowerBound:number, upperBound:number, inclusive = true):boolean{
  return inclusive ? (num >= lowerBound && num <= upperBound): (num > lowerBound && num < upperBound)
}

export { clamp, isFloat , withinBounds};
