import { calculate, EanResult } from "./src/calcularor";

describe('Calculator', () => {
    test('pure air', () => {
        const result: EanResult = calculate({
            pressureBar: 100,
            oxygenPercentage: 21
        }, {
            pressureBar: 200,
            oxygenPercentage: 21
        }, {
            oxygenPercentage: 100
        }
        );

        expect(result).toEqual({
            releaseBar: 0,
            addBarEanSource: 0,
            addBarEanSourceToTarget: 100,
            addBarAir: 100,
            addBarAirToTarget: 200
        });
    });
});