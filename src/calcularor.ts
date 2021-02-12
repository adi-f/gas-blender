export interface EanTank {
    pressureBar: number;
    oxygenPercentage: number;
}

export interface EanResult {
    releaseBar: number;
    releaseBarToTarget: number;
    addBarEanSource: number;
    addBarEanSourceToTarget: number;
    addBarAir: number;
    addBarAirToTarget: number;

}

export interface EanSource {
    oxygenPercentage: number;
}

interface MixCalculationInput {
    pressureTargetBar: number;
    oxygenPercentageTarget: number;
    oxygenPercentageSource1: number;
    oxygenPercentageSource2: number;
}

interface MixCalculationOutput {
    pressureToAddSource1Bar: number;
    pressureToAddSource2Bar: number;
}

const OXYGEN_PERCENTAGE_AIR = 21;
const ALOMST_ZERO_NEGETIVE = -0.000001;


export function calculate(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {

    if(isNothingToDoCase(tankBefore, tankAfter)) {
        return calculateNothingToDoCase(tankBefore);
    }
    const partialPressureOxygenBefore = tankBefore.oxygenPercentage / 100 * tankBefore.pressureBar;
    const partialPressureOxygenAfter = tankAfter.oxygenPercentage / 100 * tankAfter.pressureBar;

    const preassureTotalToAdd = tankAfter.pressureBar - tankBefore.pressureBar
    const partialPressureOxygenAdd = partialPressureOxygenAfter - partialPressureOxygenBefore;
    const oxygenPercentageOfMixToAdd = partialPressureOxygenAdd / preassureTotalToAdd * 100;

    const mix: MixCalculationOutput = calculatePressureToAdd({
        pressureTargetBar: preassureTotalToAdd,
        oxygenPercentageTarget: oxygenPercentageOfMixToAdd,
        oxygenPercentageSource1: source.oxygenPercentage,
        oxygenPercentageSource2: OXYGEN_PERCENTAGE_AIR
    });

    if(isNeedToReleaseGas(mix)) {
        if(tankBefore.oxygenPercentage < tankAfter.oxygenPercentage) {
            return checkPossible(calculateWithReleaseGasAndAddEan(tankBefore, tankAfter, source));
        } else {
            return checkPossible(calculateWithReleaseGasAndAddAir(tankBefore, tankAfter));
        }
    }

    return checkPossible({
        releaseBar: 0,
        releaseBarToTarget: tankBefore.pressureBar,
        addBarEanSource: mix.pressureToAddSource1Bar,
        addBarEanSourceToTarget: tankBefore.pressureBar + mix.pressureToAddSource1Bar,
        addBarAir: mix.pressureToAddSource2Bar,
        addBarAirToTarget: tankBefore.pressureBar + mix.pressureToAddSource1Bar + mix.pressureToAddSource2Bar
    });
}

function isNeedToReleaseGas(mix: MixCalculationOutput) {
    return mix.pressureToAddSource1Bar < ALOMST_ZERO_NEGETIVE || mix.pressureToAddSource2Bar < ALOMST_ZERO_NEGETIVE;
}

function calculateWithReleaseGasAndAddEan(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {
    const mix: MixCalculationOutput = calculatePressureToAdd({
        pressureTargetBar: tankAfter.pressureBar,
        oxygenPercentageTarget: tankAfter.oxygenPercentage,
        oxygenPercentageSource1: tankBefore.oxygenPercentage,
        oxygenPercentageSource2: source.oxygenPercentage
    });

    return {
        releaseBar: tankBefore.pressureBar - mix.pressureToAddSource1Bar,
        releaseBarToTarget: mix.pressureToAddSource1Bar, 
        addBarEanSource: mix.pressureToAddSource2Bar,
        addBarEanSourceToTarget: mix.pressureToAddSource1Bar + mix.pressureToAddSource2Bar,
        addBarAir: 0,
        addBarAirToTarget: tankAfter.pressureBar
    }
}

function calculateWithReleaseGasAndAddAir(tankBefore: EanTank, tankAfter: EanTank): EanResult {
    const mix: MixCalculationOutput = calculatePressureToAdd({
        pressureTargetBar: tankAfter.pressureBar,
        oxygenPercentageTarget: tankAfter.oxygenPercentage,
        oxygenPercentageSource1: tankBefore.oxygenPercentage,
        oxygenPercentageSource2: OXYGEN_PERCENTAGE_AIR
    });

    return {
        releaseBar: tankBefore.pressureBar - mix.pressureToAddSource1Bar,
        releaseBarToTarget: mix.pressureToAddSource1Bar, 
        addBarEanSource: 0,
        addBarEanSourceToTarget: mix.pressureToAddSource1Bar,
        addBarAir: mix.pressureToAddSource2Bar,
        addBarAirToTarget: mix.pressureToAddSource1Bar + mix.pressureToAddSource2Bar
    }
}

function calculatePressureToAdd(input: MixCalculationInput): MixCalculationOutput {
    const pressureToAddSource1Bar = input.pressureTargetBar
        * (input.oxygenPercentageTarget - input.oxygenPercentageSource2)
        / (input.oxygenPercentageSource1 - input.oxygenPercentageSource2);

    return {
        pressureToAddSource1Bar,
        pressureToAddSource2Bar: input.pressureTargetBar - pressureToAddSource1Bar
    }
}

function isNothingToDoCase(tankBefore: EanTank, tankAfter: EanTank): boolean{
    return tankBefore.pressureBar === tankAfter.pressureBar && tankBefore.oxygenPercentage === tankAfter.oxygenPercentage;
}

function calculateNothingToDoCase(tankBefore: EanTank): EanResult{
    return {
        releaseBar: 0,
        releaseBarToTarget: tankBefore.pressureBar,
        addBarEanSource: 0,
        addBarEanSourceToTarget: tankBefore.pressureBar,
        addBarAir: 0,
        addBarAirToTarget: tankBefore.pressureBar
    };
}

function checkPossible(result: EanResult): EanResult {
    if(result.releaseBarToTarget < ALOMST_ZERO_NEGETIVE || result.addBarEanSource < ALOMST_ZERO_NEGETIVE || result.addBarAirToTarget < ALOMST_ZERO_NEGETIVE) {
        throw Error ('CANNOT_GET_CREATED');
    }
    return result;
}