type ErrorHandler = ((message: string) => never) & {print: (message: string) => void};

export const error: ErrorHandler = (message: string) => {
    error.print(message);
    throw Error(message);
}
error.print = alert;

export function toInt(num: string): number {
    const int = parseInt(num, 10);
    if (Number.isNaN(int)) {
        error('"' + num + "'' ist keine Zahl!");
    }
    return int;
}




export function format(num: number): string {
    console.log(num);
    return Math.round(num * 10) / 10 + '';
}

export function isAlmostZero(value: number): boolean {
    return value < 0.000001 && value > -0.000001;
}