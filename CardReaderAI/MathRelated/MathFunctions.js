import * as tf from '@tensorflow/tfjs';

//[min, max)
export function GetRandomInt(min = 0, max = 1) {
	//corrections
	if (min > max) {
		let temp = max;
		max = min;
		min = temp;
	}

	if (min === max) {
		return min;
	}

	return Math.floor(Math.random(Date.now()) * (max - min) + min);
}

export function CoinFlip() {
	return GetRandomInt(0, 2);
}

export function TurnArrayIntoMatrix(
	incomingArray,
	incomingXValue = 0,
	incomingYValue = 0,
) {
	if (incomingXValue * incomingYValue != incomingArray.length) {
		console.error("Values don]=' match");
		return;
	}
	let tempTensor = tf.tensor(incomingArray, [incomingXValue, incomingYValue]);

	let result = tempTensor.arraySync();
	return result;
}

export function RandomizeNegativeOrPositive() {
	return CoinFlip() == 1 ? -1 : 1;
}
