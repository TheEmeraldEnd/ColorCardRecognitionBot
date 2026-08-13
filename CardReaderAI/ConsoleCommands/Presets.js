import * as ActivationFunctions from '../MachineLearningRelated/ActivationFunctions.js';

class PresetClass {
	//#region defaults
	static get #GROUP_NAME_DEFAULT() {
		return '';
	}

	static get #SINGLE_NAME_DEFAULT() {
		return '';
	}

	static get #GROUP_ISGROUPTESTING_DEFAULT() {
		return true;
	}

	static get #SINGLE_ISGROUPTESTING_DEFAULT() {
		return false;
	}

	static get #IS_MONOCHROME_DEFAULT() {
		return true;
	}

	static get #IS_DELETE_BEFORE_RUN_DEFAULT() {
		return true;
	}

	static get #TOTAL_EPOCH_AMOUNT_DEFAULT() {
		return 10;
	}

	static get #EPOCH_LOG_ITERATION_DEFAULT() {
		return 10;
	}

	static get #DATA_GROUP_AMOUNT_DEFAULT() {
		return 10;
	}

	static get #HIDDEN_ACTIVATION_DEFAULT() {
		return ActivationFunctions.GetRelu();
	}

	static get #OUTPUT_ACTIVATION_DEFAULT() {
		return ActivationFunctions.GetSigmoid();
	}

	static get #AMOUNT_HIDDEN_LAYERS_DEFAULT() {
		return 2;
	}

	static get #IS_TEST_ON_TRAINING_DATA_DEFAULT() {
		return false;
	}

	static get #AMOUNT_OF_BOTS_DEFAULT() {
		return 10;
	}

	static get #EVAL_CACHE_AMOUNT_DEFAULT() {
		return 10;
	}

	static get #IS_DELETE_LOWEST_DEFAULT() {
		return true;
	}

	static get #IS_APPLY_CROSSOVER_DEFAULT() {
		return false;
	}

	static get #MUTATION_CHANCE_DEFAULT() {
		return 0.1;
	}

	static get #MUTATION_VARIATION_DEFAULT() {
		return 0.1;
	}
	//#endregion

	constructor(
		incomingTestBotNameOrGroupName = '',

		incomingIsGroupTesting = false,

		incomingIsMonochrome = false,

		incomingIsDeleteBeforeRun = true,

		incomingTotalEpochAmount = 100,
		incomingEpochLogIteration = 10,
		incomingDataGroupAmount = 20,

		incomingHiddenLayerActivationFunction = ActivationFunctions.GetRelu(),
		incomingOutputLayerActivationFunction = ActivationFunctions.GetSigmoid(),

		incomingAmountOfHiddenLayers = 2,

		incomingIsTestOnTrainingData = false,

		incomingAmountOfBots = 2,

		incomingEvaluationCacheAmount = 10,

		incomingIsDeleteLowest = true,
		incomingIsApplyCrossover = false,

		incomingMutationChance = 0.1,
		incomingMutationVariation = 0.1,
	) {
		//Both
		this.testBotNameOrGroupName = incomingTestBotNameOrGroupName;

		this.isGroupTesting = incomingIsGroupTesting;

		this.isMonochrome = incomingIsMonochrome;

		this.isDeleteBeforeRun = incomingIsDeleteBeforeRun;

		this.totalEpochAmount = incomingTotalEpochAmount;
		this.epochLogIteration = incomingEpochLogIteration;
		this.dataGroupAmount = incomingDataGroupAmount;

		this.hiddenLayerActivationFunction =
			incomingHiddenLayerActivationFunction;
		this.outputLayerActivationFunction =
			incomingOutputLayerActivationFunction;

		this.amountOfHiddenLayers = incomingAmountOfHiddenLayers;

		this.isTestOnTrainingData = incomingIsTestOnTrainingData;

		//Group only
		this.amountOfBots = incomingAmountOfBots;

		this.evaluationCacheAmount = incomingEvaluationCacheAmount;

		this.isDeleteLowest = incomingIsDeleteLowest;
		this.isApplyCrossover = incomingIsApplyCrossover;

		this.mutationChance = incomingMutationChance;
		this.mutationVariation = incomingMutationVariation;
	}

	GetName() {
		return this.testBotNameOrGroupName;
	}

	GetIsGroupTest() {
		return this.isGroupTesting;
	}

	GetIsMonochrome() {
		return this.isMonochrome;
	}

	GetIsDeleteBeforeRun() {
		return this.isDeleteBeforeRun;
	}

	GetTotalEpochAmount() {
		return this.totalEpochAmount;
	}

	GetEpochLogIteration() {
		return this.epochLogIteration;
	}

	GetDataGroupAmount() {
		return this.dataGroupAmount;
	}

	GetHiddenActivation() {
		return this.hiddenLayerActivationFunction;
	}

	GetOutputActivation() {
		return this.outputLayerActivationFunction;
	}

	GetAmountOfHiddenLayers() {
		return this.amountOfHiddenLayers;
	}

	GetIsTestOnTrainingData() {
		return this.isTestOnTrainingData;
	}

	GetAmountOfBots() {
		return this.amountOfBots;
	}

	GetEvalCacheAmount() {
		return this.evaluationCacheAmount;
	}

	GetIsDeleteLowest() {
		return this.isDeleteLowest;
	}

	GetIsApplyCrossover() {
		return this.isApplyCrossover;
	}

	GetMutationChance() {
		return this.mutationChance;
	}

	GetMutationVariation() {
		return this.mutationVariation;
	}

	static MakeNewSingleBotPreset(
		incomingTestBotNameOrGroupName = 'New Thing',

		incomingIsMonochrome = false,

		incomingIsDeleteBeforeRun = true,

		incomingTotalEpochAmount = this.#TOTAL_EPOCH_AMOUNT_DEFAULT,
		incomingEpochLogIteration = this.#EPOCH_LOG_ITERATION_DEFAULT,
		incomingDataGroupAmount = this.#DATA_GROUP_AMOUNT_DEFAULT,

		incomingHiddenLayerActivationFunction = this.#HIDDEN_ACTIVATION_DEFAULT,
		incomingOutputLayerActivationFunction = this.#OUTPUT_ACTIVATION_DEFAULT,

		incomingAmountOfHiddenLayers = this.#AMOUNT_HIDDEN_LAYERS_DEFAULT,

		incomingIsTestOnTrainingData = false,
	) {
		return new PresetClass(
			incomingTestBotNameOrGroupName,
			this.#SINGLE_ISGROUPTESTING_DEFAULT,
			incomingIsMonochrome,
			incomingIsDeleteBeforeRun,
			incomingTotalEpochAmount,
			incomingEpochLogIteration,
			incomingDataGroupAmount,
			incomingHiddenLayerActivationFunction,
			incomingOutputLayerActivationFunction,
			incomingAmountOfHiddenLayers,
			incomingIsTestOnTrainingData,
		);
	}

	static MakeNewSingleBotPresetSimple(
		incomingBotName = 'New Bot',
		isMonochrome = false,
		incomingIsTestOnTrainingData = false,
		incomingIsDeleteBeforeRun = true,
	) {
		return this.MakeNewSingleBotPreset(
			incomingBotName,
			isMonochrome,
			incomingIsDeleteBeforeRun,
			this.#TOTAL_EPOCH_AMOUNT_DEFAULT,
			this.#EPOCH_LOG_ITERATION_DEFAULT,
			this.#DATA_GROUP_AMOUNT_DEFAULT,
			this.#HIDDEN_ACTIVATION_DEFAULT,
			this.#OUTPUT_ACTIVATION_DEFAULT,
			this.#AMOUNT_HIDDEN_LAYERS_DEFAULT,
			incomingIsTestOnTrainingData,
		);
	}

	static MakeNewGroupPreset(
		incomingTestBotNameOrGroupName = this.#GROUP_NAME_DEFAULT,

		incomingIsMonochrome = this.#IS_MONOCHROME_DEFAULT,

		incomingIsDeleteBeforeRun = this.#IS_DELETE_BEFORE_RUN_DEFAULT,

		incomingTotalEpochAmount = this.#TOTAL_EPOCH_AMOUNT_DEFAULT,
		incomingEpochLogIteration = this.#EPOCH_LOG_ITERATION_DEFAULT,
		incomingDataGroupAmount = this.#DATA_GROUP_AMOUNT_DEFAULT,

		incomingHiddenLayerActivationFunction = this.#HIDDEN_ACTIVATION_DEFAULT,
		incomingOutputLayerActivationFunction = this.#OUTPUT_ACTIVATION_DEFAULT,

		incomingAmountOfHiddenLayers = this.#AMOUNT_HIDDEN_LAYERS_DEFAULT,

		incomingIsTestOnTrainingData = this.#IS_TEST_ON_TRAINING_DATA_DEFAULT,

		incomingAmountOfBots = this.#AMOUNT_OF_BOTS_DEFAULT,

		incomingEvaluationCacheAmount = this.#EVAL_CACHE_AMOUNT_DEFAULT,

		incomingIsDeleteLowest = this.#IS_DELETE_LOWEST_DEFAULT,
		incomingIsApplyCrossover = this.#IS_APPLY_CROSSOVER_DEFAULT,

		incomingMutationChance = this.#MUTATION_CHANCE_DEFAULT,
		incomingMutationVariation = this.#MUTATION_VARIATION_DEFAULT,
	) {
		return new PresetClass(
			incomingTestBotNameOrGroupName,
			this.#GROUP_ISGROUPTESTING_DEFAULT,
			incomingIsMonochrome,
			incomingIsDeleteBeforeRun,
			incomingTotalEpochAmount,
			incomingEpochLogIteration,
			incomingDataGroupAmount,
			incomingHiddenLayerActivationFunction,
			incomingOutputLayerActivationFunction,
			incomingAmountOfHiddenLayers,
			incomingIsTestOnTrainingData,
			incomingAmountOfBots,
			incomingEvaluationCacheAmount,
			incomingIsDeleteLowest,
			incomingIsApplyCrossover,
			incomingMutationChance,
			incomingMutationVariation,
		);
	}

	static MakeNewGroupPresetSimple(
		incomingBotGroupName = this.#GROUP_NAME_DEFAULT,
		isMonochrome = this.#IS_MONOCHROME_DEFAULT,
		incomingIsTestOnTrainingData = this.#IS_TEST_ON_TRAINING_DATA_DEFAULT,
		incomingIsDeleteBeforeRun = this.#IS_DELETE_BEFORE_RUN_DEFAULT,
		incomingAmountOfBots = this.#AMOUNT_OF_BOTS_DEFAULT,
		isApplyCrossover = this.#IS_APPLY_CROSSOVER_DEFAULT,
		isEvalAmount = this.#EVAL_CACHE_AMOUNT_DEFAULT,
	) {
		return this.MakeNewGroupPreset(
			incomingBotGroupName,
			isMonochrome,
			incomingIsDeleteBeforeRun,
			this.#TOTAL_EPOCH_AMOUNT_DEFAULT,
			this.#EPOCH_LOG_ITERATION_DEFAULT,
			this.#DATA_GROUP_AMOUNT_DEFAULT,
			this.#HIDDEN_ACTIVATION_DEFAULT,
			this.#OUTPUT_ACTIVATION_DEFAULT,
			this.#HIDDEN_ACTIVATION_DEFAULT,
			incomingIsTestOnTrainingData,
			incomingAmountOfBots,
			isEvalAmount,
			this.#IS_DELETE_LOWEST_DEFAULT,
			isApplyCrossover,
			this.#MUTATION_CHANCE_DEFAULT,
			this.#MUTATION_VARIATION_DEFAULT,
		);
	}
}

const DEFAULT_AMOUNT_OF_BOTS = 10;

const IS_DELETE_BEFORE_RUN_DEFAULT = false;

const TEST_ON_TRAINING = true;
const TEST_ON_FINAL = false;

const USE_MONOCHROME = true;
const NOT_USE_MONOCHROME = false;

const NOT_USE_CROSSOVER = false;
const USE_CROSSOVER = true;

const DEFAULT_EVAL_CACHE_AMOUNT = 10;
const DEFAULT_NO_EVAL_CACHE = 0;

export const DEFAULT_PRESETS = {
	SINGLE_OVERFIT_TEST: PresetClass.MakeNewSingleBotPresetSimple(
		'Single_Overfit',
		NOT_USE_MONOCHROME,
		TEST_ON_TRAINING,
		IS_DELETE_BEFORE_RUN_DEFAULT,
	),
	SINGLE_FINAL_TEST: PresetClass.MakeNewSingleBotPresetSimple(
		'Single_Final',
		NOT_USE_MONOCHROME,
		TEST_ON_FINAL,
		IS_DELETE_BEFORE_RUN_DEFAULT,
	),
	GROUP_LEARNING_OVERFIT: PresetClass.MakeNewGroupPresetSimple(
		'Group_Learning_Overfit',
		NOT_USE_MONOCHROME,
		TEST_ON_TRAINING,
		IS_DELETE_BEFORE_RUN_DEFAULT,
		DEFAULT_AMOUNT_OF_BOTS,
		NOT_USE_CROSSOVER,
		DEFAULT_NO_EVAL_CACHE,
	),
	GROUP_LEARNING_FINAL: PresetClass.MakeNewGroupPresetSimple(
		'Group_Learning_Final',
		NOT_USE_MONOCHROME,
		TEST_ON_FINAL,
		IS_DELETE_BEFORE_RUN_DEFAULT,
		DEFAULT_AMOUNT_OF_BOTS,
		NOT_USE_CROSSOVER,
		DEFAULT_NO_EVAL_CACHE,
	),
	GROUP_MUTATION_ONLY_OVERFIT: PresetClass.MakeNewGroupPresetSimple(
		'Group_Mutation_Overfit',
		NOT_USE_MONOCHROME,
		TEST_ON_TRAINING,
		IS_DELETE_BEFORE_RUN_DEFAULT,
		DEFAULT_AMOUNT_OF_BOTS,
		NOT_USE_CROSSOVER,
		DEFAULT_EVAL_CACHE_AMOUNT,
	),
	GROUP_MUTATION_ONLY_FINAL: PresetClass.MakeNewGroupPresetSimple(
		'Group_Mutation_Final',
		NOT_USE_MONOCHROME,
		TEST_ON_FINAL,
		IS_DELETE_BEFORE_RUN_DEFAULT,
		DEFAULT_AMOUNT_OF_BOTS,
		NOT_USE_CROSSOVER,
		DEFAULT_EVAL_CACHE_AMOUNT,
	),
	GROUP_CROSSOVER_OVERFIT: PresetClass.MakeNewGroupPresetSimple(
		'Group_Crossover_Overfit',
		NOT_USE_MONOCHROME,
		TEST_ON_TRAINING,
		IS_DELETE_BEFORE_RUN_DEFAULT,
		DEFAULT_AMOUNT_OF_BOTS,
		USE_CROSSOVER,
		DEFAULT_EVAL_CACHE_AMOUNT,
	),
	GROUP_CROSSOVER_FINAL: PresetClass.MakeNewGroupPresetSimple(
		'Group_Crossover_Final',
		NOT_USE_MONOCHROME,
		TEST_ON_FINAL,
		IS_DELETE_BEFORE_RUN_DEFAULT,
		DEFAULT_AMOUNT_OF_BOTS,
		USE_CROSSOVER,
		DEFAULT_EVAL_CACHE_AMOUNT,
	),
};
