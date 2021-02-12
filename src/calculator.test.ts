import { calculate, EanResult } from "./calcularor";

describe('Calculator', () => {

    describe('simple mix cases', () => {

        test('add pure air', () => {
            const result: EanResult = calculate({
                pressureBar: 100,
                oxygenPercentage: 21
            }, {
                pressureBar: 200,
                oxygenPercentage: 21
            }, {
                oxygenPercentage: 100
            });

            verify(result, {
                releaseBar: 0,
                addBarEanSource: 0,
                addBarEanSourceToTarget: 100,
                addBarAir: 100,
                addBarAirToTarget: 200
            });
        });

        test('add nothing', () => {
            const result: EanResult = calculate({
                pressureBar: 110,
                oxygenPercentage: 21
            }, {
                pressureBar: 110,
                oxygenPercentage: 21
            }, {
                oxygenPercentage: 50
            });

            verify(result, {
                releaseBar: 0,
                addBarEanSource: 0,
                addBarEanSourceToTarget: 110,
                addBarAir: 0,
                addBarAirToTarget: 110
            });
        });

        test('add pure 02', () => {
            const result: EanResult = calculate({
                pressureBar: 40,
                oxygenPercentage: 25
            }, {
                pressureBar: 50,
                oxygenPercentage: 40
            }, {
                oxygenPercentage: 100
            });

            verify(result, {
                releaseBar: 0,
                addBarEanSource: 10,
                addBarEanSourceToTarget: 50,
                addBarAir: 0,
                addBarAirToTarget: 50
            });
        });
    });

});

function verify(actual: EanResult, expected: EanResult): void {
    try { // todo create custom matcher
    expect(actual.releaseBar).toBeCloseTo(expected.releaseBar);
    expect(actual.addBarEanSource).toBeCloseTo(expected.addBarEanSource);
    expect(actual.addBarEanSourceToTarget).toBeCloseTo(expected.addBarEanSourceToTarget);
    expect(actual.addBarAir).toBeCloseTo(expected.addBarAir);
    expect(actual.addBarAirToTarget).toBeCloseTo(expected.addBarAirToTarget);
    } catch(e) {
        const message = `\nactual  : ${JSON.stringify(actual)}\nexpected: ${JSON.stringify(expected)}`
        fail(message);
    }
}