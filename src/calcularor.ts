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
    oxygenPercentagetarget: number;
    oxygenPercentageSource1: number;
    oxygenPercentageSource2: number;
}

interface MixCalculationOutput {
    pressureToAddSource1Bar: number;
    pressureToAddSource2Bar: number;
}

export function calculate(tankBefore: EanTank, tankAfter: EanTank, source: EanSource): EanResult {
    const oxygenPercentageAir = 21;

    const partialPressureOxygenBefore = tankBefore.oxygenPercentage / 100 * tankBefore.pressureBar;
    const partialPressureOxygenAfter = tankAfter.oxygenPercentage / 100 * tankAfter.pressureBar;

    const preassureTotalToAdd = tankAfter.pressureBar - tankBefore.pressureBar
    const partialPressureOxygenAdd = partialPressureOxygenAfter - partialPressureOxygenBefore;

    const mix: MixCalculationOutput = calculatePressureToAdd({
        pressureTargetBar: preassureTotalToAdd,
        oxygenPercentagetarget: partialPressureOxygenAdd,
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
        * (input.oxygenPercentagetarget - input.oxygenPercentageSource2)
        / (input.oxygenPercentageSource1 - input.oxygenPercentageSource2);

    return {
        pressureToAddSource1Bar,
        pressureToAddSource2Bar: input.pressureTargetBar - pressureToAddSource1Bar
    }
}