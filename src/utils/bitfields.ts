function isSingleFlagSet(flag: number, bitField: number) {
	return !!(flag & bitField);
}

function areAnyFlagsSet(flags: number, bitField: number) {
	return isSingleFlagSet(flags, bitField);
}

function areNoFlagsSet(flags: number, bitField: number) {
	return !isSingleFlagSet(flags, bitField);
}

function areAllFlagsSet(flags: number, bitField: number) {
	return (flags & bitField) === flags;
}

function areOnlyTheseFlagsSet(flags: number, bitField: number) {
	return flags === bitField;
}

export {
	isSingleFlagSet,
	areAnyFlagsSet,
	areNoFlagsSet,
	areAllFlagsSet,
	areOnlyTheseFlagsSet,
};
