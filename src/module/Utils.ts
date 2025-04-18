export function zenParseFloat(value: string): number {
    if (value == null || value == undefined || value == ``) return 0;
    value = value.replace(/,/g, '.');
    return parseFloat(value);
}