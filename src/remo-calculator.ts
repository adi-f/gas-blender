import { EanResult, EanSource, EanTank, calculate } from "./calcularor";

const ERROR_BOOSTER_DISPLAY_BAR = 6;
export const COMPRESSOR_OUTPUT_200_BAR_STOPS_AT = 220;
export const DEFAULT_SOURCE_OXYGEN_PERCENTAGE = 100;


export interface BlendParameters {
    currentPressureTankBarDisplayed: number;
    currentOxygenPercentage: number;

    targetTankOxygenPercentage: number;
    targetTankPressureBar: number;

    sourceTankOgygenPercentage: number;
}

export interface BlendResult {
    releaseBar: number;
    releaseBarTo: number;
    releaseBarToDisplayBooster: number;
    addBarSource: number;
    addBarSourceToDisplayBooster: number;
    addBarAir: number;
    addBarAirTo: number;
    addBarAirToDisplayCompressor: number;
}

export function displayToRealPressureBar(displayBar: number): number {
    return displayBar - ERROR_BOOSTER_DISPLAY_BAR;
}

export function pressureBarToDisplay(pressureBar: number): number {
    return pressureBar + ERROR_BOOSTER_DISPLAY_BAR;
}

export function calculateForRemosEquiptment(input: BlendParameters): BlendResult {
    const tankBefore: EanTank = {
        pressureBar: displayToRealPressureBar(input.currentPressureTankBarDisplayed),
        oxygenPercentage: input.currentOxygenPercentage,
    };

    const tankAfter: EanTank = {
        pressureBar: input.targetTankPressureBar,
        oxygenPercentage: input.targetTankOxygenPercentage
    };

    const source: EanSource = {
        oxygenPercentage: input.sourceTankOgygenPercentage
    }

    const result: EanResult = calculate(tankBefore, tankAfter, source);

    return {
        releaseBar: result.releaseBar,
        releaseBarTo: result.releaseBarToTarget,
        releaseBarToDisplayBooster: pressureBarToDisplay(result.releaseBarToTarget),
        addBarSource: result.addBarEanSource,
        addBarSourceToDisplayBooster: pressureBarToDisplay(result.addBarEanSourceToTarget),
        addBarAir: result.addBarAir,
        addBarAirTo: result.addBarAirToTarget,
        addBarAirToDisplayCompressor: result.addBarAirToTarget
    }
}