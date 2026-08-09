import * as tf from "@tensorflow/tfjs";

export class BinaryTranslator {
	static LabelToIndex(incomingStringValue = "", potentialOptions = []) {
		if (!potentialOptions.includes(incomingStringValue)) {
			console.error(
				`${incomingStringValue} is not included in potential options ${potentialOptions}`,
			);
			return null;
		}

		let binaryArray = [];
		for (let i = 0; i < potentialOptions.length; i++) {
			if (incomingStringValue === potentialOptions[i]) {
				binaryArray.push(1);
			} else {
				binaryArray.push(0);
			}
		}

		return binaryArray;
	}

	static LabelsToIndexes(incomingData = [], potentialOptions = []) {
		let modifiedData = [];
		incomingData.forEach((d) =>
			modifiedData.push(this.LabelToIndex(d, potentialOptions)),
		);
		return modifiedData;
	}

	static IndexToLabel(incomingBinaryData = [], potentialOptions = []) {
		if (incomingBinaryData.length !== potentialOptions.length) {
			console.error(
				`incoming binary data ${incomingBinaryData[0]}:${incomingBinaryData.length} not same length as ${potentialOptions.length}`,
			);
			return null;
		}

		let max = -100000;

		incomingBinaryData.forEach((n) => {
			if (n > max) {
				max = n;
			}
		});

		let maxArrayIndex = incomingBinaryData.indexOf(max);
		return potentialOptions[maxArrayIndex];
	}

	static IndexesToLabels(incomingBinaryMatrix = [], potentialOptions = []) {
		let dataArray = [];

		for (let i = 0; i < incomingBinaryMatrix.length; i++) {
			let element = this.IndexToLabel(
				incomingBinaryMatrix[i],
				potentialOptions,
			);
			dataArray.push(element);
		}

		// incomingBinaryMatrix.foreach((b) => {
		// 	console.log("oof " + b);
		// 	dataArray.push(this.IndexToLabel(b, potentialOptions));
		// });

		return dataArray;
	}

	static LabelsToIndexesTensor(incomingData = [], potentialOptions = []) {
		let indexes = this.LabelsToIndexes(incomingData, potentialOptions);
		return tf.tensor(indexes);
	}

	static IndexesToLabelsTensor(
		incomingBinaryMatrix = [],
		potentialOptions = [],
	) {
		let labels = this.IndexesToLabels(
			incomingBinaryMatrix,
			potentialOptions,
		);
		return tf.tensor(labels);
	}
}

export class LinearTranlator {
	static LabelToIndex(incomingStringValue = "", potentialOptions = []) {
		if (!potentialOptions.includes(incomingStringValue)) {
			console.error(`Not included optoin in potential optoins`);
			return null;
		}

		return potentialOptions.indexOf(incomingStringValue);
	}

	static LabelsToIndexes(incomingData = [], potentialOptions = []) {
		let modifiedData = [];
		incomingData.forEach((d) =>
			modifiedData.push(this.LabelToIndex(d, potentialOptions)),
		);
		return modifiedData;
	}

	static IndexToLabel(incomingNumberedIndex = -1, potentialOptions = []) {
		if (
			incomingNumberedIndex < 0 ||
			incomingNumberedIndex >= potentialOptions.length
		) {
			console.error("Incoming index doesn't match with options");
			return null;
		}

		return potentialOptions[incomingNumberedIndex];
	}

	static IndexesToLabels(incomingBinaryMatrix = [], potentialOptions = []) {
		let dataArray = [];

		incomingBinaryMatrix.forEach((b) =>
			dataArray.push(this.IndexToLabel(b, potentialOptions)),
		);

		return dataArray;
	}

	static LabelsToIndexesTensor(incomingData = [], potentialOptions = []) {
		let indexes = this.LabelsToIndexes(incomingData, potentialOptions);
		return tf.tensor(indexes);
	}

	static IndexesToLabelsTensor(incomingindexes = [], potentialOptions = []) {
		let labels = this.IndexesToIndexes(incomingindexes, potentialOptions);
		return tf.tensor(labels);
	}
}
