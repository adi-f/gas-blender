export interface EanTank {
    pressureBar: number;
    oxygenPercentage: number;
}

export interface EanResult {
    releaseBar: number;
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

export function calculate(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {
    
    if(isNothingToDoCase(tankBefore, tankAfter)) {
        return calculateNothingToDoCase(tankBefore);
    }

    const oxygenPercentageAir = 21;

    const partialPressureOxygenBefore = tankBefore.oxygenPercentage / 100 * tankBefore.pressureBar;
    const partialPressureOxygenAfter = tankAfter.oxygenPercentage / 100 * tankAfter.pressureBar;

    const preassureTotalToAdd = tankAfter.pressureBar - tankBefore.pressureBar
    const partialPressureOxygenAdd = partialPressureOxygenAfter - partialPressureOxygenBefore;
    const oxygenPercentageOfMixToAdd = partialPressureOxygenAdd / preassureTotalToAdd * 100;

    const mix: MixCalculationOutput = calculatePressureToAdd({
        pressureTargetBar: preassureTotalToAdd,
        oxygenPercentageTarget: oxygenPercentageOfMixToAdd,
        oxygenPercentageSource1: source.oxygenPercentage,
        oxygenPercentageSource2: oxygenPercentageAir
    });

    return {
        releaseBar: 0,
        addBarEanSource: mix.pressureToAddSource1Bar,
        addBarEanSourceToTarget: tankBefore.pressureBar + mix.pressureToAddSource1Bar,
        addBarAir: mix.pressureToAddSource2Bar,
        addBarAirToTarget: tankBefore.pressureBar + mix.pressureToAddSource1Bar + mix.pressureToAddSource2Bar
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
        addBarEanSource: 0,
        addBarEanSourceToTarget: tankBefore.pressureBar,
        addBarAir: 0,
        addBarAirToTarget: tankBefore.pressureBar
    };
}