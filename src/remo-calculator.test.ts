import { BlendResult, calculateForRemosEquiptment } from "./remo-calculator";

describe('remo calcualtor', () => {

    test('release gas, add O2', () => {
        const result: BlendResult = calculateForRemosEquiptment({
            currentPressureTankBarDisplayed: 40 + 6,
            currentOxygenPercentage: 25,

            targetTankPressureBar: 50,
            targetTankOxygenPercentage: 60,

            sourceTankOgygenPercentage: 80
        });
        expect(result.releaseBar).toBeCloseTo(21.8181818182);
        expect(result.releaseBarTo).toBeCloseTo(40 - 21.8181818182);
        expect(result.releaseBarToDisplayBooster).toBeCloseTo(18.1818181818 + 6);
        expect(result.addBarSource).toBeCloseTo(31.8181818182);
        expect(result.addBarSourceToDisplayBooster).toBeCloseTo(50 + 6);
        expect(result.addBarAir).toBeCloseTo(0);
        expect(result.addBarAirToDisplayCompressor).toBeCloseTo(50);
    });
});