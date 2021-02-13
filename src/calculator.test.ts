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
                releaseBarToTarget: 100,
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
                releaseBarToTarget: 110,
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
                releaseBarToTarget: 40,
                addBarEanSource: 10,
                addBarEanSourceToTarget: 50,
                addBarAir: 0,
                addBarAirToTarget: 50
            });
        });

        test('add regular mix, with pure O2', () => {
            const result: EanResult = calculate({
                pressureBar: 50,
                oxygenPercentage: 30
            }, {
                pressureBar: 200,
                oxygenPercentage: 50
            }, {
                oxygenPercentage: 100
            });

            verify(result, {
                releaseBar: 0,
                releaseBarToTarget: 50,
                addBarEanSource: 67.721518987,
                addBarEanSourceToTarget: 117.721518987,
                addBarAir: 82.278481012,
                addBarAirToTarget: 200
            });
        });

        test('add regular mix, with other nitrox', () => {
            const result: EanResult = calculate({
                pressureBar: 60,
                oxygenPercentage: 30
            }, {
                pressureBar: 220,
                oxygenPercentage: 40
            }, {
                oxygenPercentage: 70
            });

            verify(result, {
                releaseBar: 0,
                releaseBarToTarget: 60,
                addBarEanSource: 74.2857142857,
                addBarEanSourceToTarget: 134.2857142857,
                addBarAir: 85.7142857143,
                addBarAirToTarget: 220
            });
        });

        test('redce oxygen level', () => {
            const result: EanResult = calculate({
                pressureBar: 100,
                oxygenPercentage: 80
            }, {
                pressureBar: 200,
                oxygenPercentage: 70
            }, {
                oxygenPercentage: 90
            });

            verify(result, {
                releaseBar: 0,
                releaseBarToTarget: 100,
                addBarEanSource: 56.521739130,
                addBarEanSourceToTarget: 156.521739130,
                addBarAir: 43.47826087,
                addBarAirToTarget: 200
            });
        });
    });

    describe('need to release gas first', () => {
        test('cannt be achived with mix; release all', () => {
            const result: EanResult = calculate({
                pressureBar: 40,
                oxygenPercentage: 25
            }, {
                pressureBar: 50,
                oxygenPercentage: 90
            }, {
                oxygenPercentage: 90
            });

            verify(result, {
                releaseBar: 40,
                releaseBarToTarget: 0,
                addBarEanSource: 50,
                addBarEanSourceToTarget: 50,
                addBarAir: 0,
                addBarAirToTarget: 50
            });
        });

        test('cannot be achived with pure O2; release', () => {
            const result: EanResult = calculate({
                pressureBar: 40,
                oxygenPercentage: 25
            }, {
                pressureBar: 50,
                oxygenPercentage: 60
            }, {
                oxygenPercentage: 80
            });

            verify(result, {
                releaseBar: 21.8181818182,
                releaseBarToTarget: 18.1818181818,
                addBarEanSource: 31.8181818182,
                addBarEanSourceToTarget: 50,
                addBarAir: 0,
                addBarAirToTarget: 50
            });
        });


        test('reduce oxygen level (release all)', () => {
            const result: EanResult = calculate({
                pressureBar: 50,
                oxygenPercentage: 80
            }, {
                pressureBar: 70,
                oxygenPercentage: 21
            }, {
                oxygenPercentage: 100
            });

            verify(result, {
                releaseBar: 50,
                releaseBarToTarget: 0,
                addBarEanSource: 0,
                addBarEanSourceToTarget: 0,
                addBarAir: 70,
                addBarAirToTarget: 70
            });
        });

        test('reduce oxygen level', () => {
            const result: EanResult = calculate({
                pressureBar: 50,
                oxygenPercentage: 80
            }, {
                pressureBar: 70,
                oxygenPercentage: 25
            }, {
                oxygenPercentage: 100
            });

            verify(result, {
                releaseBar: 45.2542372881,
                releaseBarToTarget: 4.7457627119,
                addBarEanSource: 0,
                addBarEanSourceToTarget: 4.7457627119,
                addBarAir: 65.2542372881,
                addBarAirToTarget: 70
            });
        });
    });

    describe('funny cases', () => {

        test('boost oxygen level (keep presure)', () => {
            const result: EanResult = calculate({
                pressureBar: 50,
                oxygenPercentage: 40
            }, {
                pressureBar: 50,
                oxygenPercentage: 60
            }, {
                oxygenPercentage: 100
            });

            verify(result, {
                releaseBar: 16.666666667,
                releaseBarToTarget: 33.333333333,
                addBarEanSource: 16.666666667,
                addBarEanSourceToTarget: 50,
                addBarAir: 0,
                addBarAirToTarget: 50
            });
        });

        test('reduce oxygen level (keep presure)', () => {
            const result: EanResult = calculate({
                pressureBar: 200,
                oxygenPercentage: 40
            }, {
                pressureBar: 200,
                oxygenPercentage: 30
            }, {
                oxygenPercentage: 10
            });
            // 2 solutions: works with add air or EAN10 (prefere cheeper/simpler air)
            verify(result, {
                releaseBar: 105.26315789473684,
                releaseBarToTarget: 94.73684210526316,
                addBarEanSource: 0,
                addBarEanSourceToTarget: 94.73684210526316,
                addBarAir: 105.26315789473684,
                addBarAirToTarget: 200
            });
        });

        test('cannot be mixed (too few O2 in source tank)', () => {
            expect(() => calculate({
                pressureBar: 50,
                oxygenPercentage: 40
            }, {
                pressureBar: 200,
                oxygenPercentage: 55
            }, {
                oxygenPercentage: 50
            })).toThrowError('CANNOT_GET_CREATED');
        });

        test('cannot be mixed (too low O2 level as target)', () => {
            expect(() => calculate({
                pressureBar: 50,
                oxygenPercentage: 21
            }, {
                pressureBar: 100,
                oxygenPercentage: 15
            }, {
                oxygenPercentage: 18
            })).toThrowError('CANNOT_GET_CREATED');
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

    expect(actual.releaseBarToTarget + actual.addBarEanSource + actual.addBarAir).toBeCloseTo(expected.addBarAirToTarget);

    } catch(e) {
        const message = `\nactual  : ${JSON.stringify(actual)}\nexpected: ${JSON.stringify(expected)}`
        fail(message);
    }
}