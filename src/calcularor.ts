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
type Calculator = (tankBefore: EanTank, tankAfter: EanTank, source: EanSource) => EanResult;

const OXYGEN_PERCENTAGE_AIR = 21;
const ALOMST_ZERO_NEGETIVE = -0.000001;

const calcualtionStrategies: Calculator[] = [
    nothingToDoCase, // before the 1st strategy, check nothing to do
    calculateWithReleaseGasAndAddAir, // 1st prio: no need to add expensive EAN
    calculateWithMixOfEanAndAir, // most common case: mix EAN and air
    calculateWithReleaseGasAndAddEan // release gas and add EAN

]

export function calculate(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {

    for(const strategy of calcualtionStrategies) {
        const result = strategy(tankBefore, tankAfter, source);
        if(isValid(result)) {
            return result;
        }
    }
    throw Error ('CANNOT_GET_CREATED');
}

function nothingToDoCase(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {
    if(tankBefore.pressureBar === tankAfter.pressureBar && tankBefore.oxygenPercentage === tankAfter.oxygenPercentage) {
        return {
            releaseBar: 0,
            releaseBarToTarget: tankBefore.pressureBar,
            addBarEanSource: 0,
            addBarEanSourceToTarget: tankBefore.pressureBar,
            addBarAir: 0,
            addBarAirToTarget: tankBefore.pressureBar
        };
    } else {
        return {
            releaseBar: -1,
            releaseBarToTarget: -1,
            addBarEanSource: 1,
            addBarEanSourceToTarget: -1,
            addBarAir: 1,
            addBarAirToTarget: -1
        };
    }
}

function calculateWithReleaseGasAndAddAir(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {
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

function calculateWithMixOfEanAndAir(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {
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

    return {
        releaseBar: 0,
        releaseBarToTarget: tankBefore.pressureBar,
        addBarEanSource: mix.pressureToAddSource1Bar,
        addBarEanSourceToTarget: tankBefore.pressureBar + mix.pressureToAddSource1Bar,
        addBarAir: mix.pressureToAddSource2Bar,
        addBarAirToTarget: tankBefore.pressureBar + mix.pressureToAddSource1Bar + mix.pressureToAddSource2Bar
    };
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

function calculatePressureToAdd(input: MixCalculationInput): MixCalculationOutput {
    const pressureToAddSource1Bar = input.pressureTargetBar
        * (input.oxygenPercentageTarget - input.oxygenPercentageSource2)
        / (input.oxygenPercentageSource1 - input.oxygenPercentageSource2);

    return {
        pressureToAddSource1Bar,
        pressureToAddSource2Bar: input.pressureTargetBar - pressureToAddSource1Bar
    }
}

function isValid(result: EanResult) {
    return !(result.releaseBar < ALOMST_ZERO_NEGETIVE || result.addBarEanSource < ALOMST_ZERO_NEGETIVE || result.addBarAir < ALOMST_ZERO_NEGETIVE)
    && Number.isFinite(result.addBarEanSource) && Number.isFinite(result.addBarAir)
}