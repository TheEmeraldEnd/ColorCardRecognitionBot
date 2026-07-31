import { GetRandomInt } from '../MathRelated/MathFunctions.js';

export function RandomizeArrayElements(incomingArray = []) {
	if (incomingArray.length <= 1) {
		return incomingArray;
	}

	for (let i = 0; i < incomingArray.length; i++) {
		let destinationIndex = GetRandomInt(0, incomingArray.length);
		let startingIndex = i;
		[incomingArray[startingIndex], incomingArray[destinationIndex]] = [
			incomingArray[destinationIndex],
			incomingArray[startingIndex],
		];
	}

	return incomingArray;
}
