export function toInt(num: string): number {
    const int = parseInt(num);
    if (Number.isNaN(int)) {
        error('"' + num + "'' is not a number!");
    }
    return int;
}

export function error(message: string) {
    alert(message);
    throw Error(message);
}

export function format(num: number): string {
    console.log(num);
    return Math.round(num * 10) / 10 + '';
}