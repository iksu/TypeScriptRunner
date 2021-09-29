namespace dmt {
    export class Utils {
        public static CHARS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z'];
        public static NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        public static HEX_NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        public static EXTRA_CHARS = ['_', '$'];

        public static letters = null;
        public static letterExtras = null;
        public static numbers = null;
        public static hexNumbers = null;
        public static stringStarts = null;
        public static stringSkips = null;
        public static letterOrNumbers = null;
        public static letterOrNumbersExtra = null;

        public static IsLetter(char: string): boolean {
            if (Utils.letters == null) {
                Utils.letters = {};
                Utils.CHARS.forEach((fi) => {
                    Utils.letters[fi] = true;
                    Utils.letters[fi.toUpperCase()] = true;
                });
            }
            return Utils.letters.hasOwnProperty(char);
        }

        public static IsLetterExtra(char: string): boolean {
            if (Utils.letterExtras == null) {
                Utils.letterExtras = {};
                Utils.CHARS.forEach((fi) => {
                    Utils.letterExtras[fi] = true;
                    Utils.letterExtras[fi.toUpperCase()] = true;
                });
                Utils.EXTRA_CHARS.forEach((fi) => {
                    Utils.letterExtras[fi] = true;
                });
            }
            return Utils.letterExtras.hasOwnProperty(char);
        }

        public static IsNumber(char: string): boolean {
            if (Utils.numbers == null) {
                Utils.numbers = {};
                Utils.NUMS.forEach((fi) => {
                    Utils.numbers[fi] = true;
                });
            }
            return Utils.numbers.hasOwnProperty(char);
        }

        public static IsHexNumber(char: string): boolean {
            if (Utils.hexNumbers == null) {
                Utils.hexNumbers = {};
                Utils.HEX_NUMS.forEach((fi) => {
                    Utils.hexNumbers[fi] = true;
                    Utils.hexNumbers[fi.toUpperCase()] = true;
                });
            }
            return Utils.hexNumbers.hasOwnProperty(char);
        }

        public static IsStringStart(char: string): boolean {
            // if (Utils.stringStarts == null) {
            //     Utils.stringStarts = ["\"", "'", "`"];
            // }
            // return Utils.stringStarts.indexOf(char) > -1;

            if (Utils.stringStarts == null) {
                Utils.stringStarts = {};
                Utils.stringStarts["\""] = true;
                Utils.stringStarts["'"] = true;
                Utils.stringStarts["`"] = true;
            }
            return Utils.stringStarts.hasOwnProperty(char);

        }

        public static IsStringSkip(char: string): boolean {
            // if (Utils.stringSkips == null) {
            //     Utils.stringSkips = ["\r", "\n", " ", "    "];
            // }
            // return Utils.stringSkips.indexOf(char) > -1;

            if (Utils.stringSkips == null) {
                Utils.stringSkips = {};
                Utils.stringSkips["\r"] = true;
                Utils.stringSkips["\n"] = true;
                Utils.stringSkips[" "] = true;
                Utils.stringSkips[" "] = true;
            }
            return Utils.stringSkips.hasOwnProperty(char);
        }

        public static IsEmpty(char: string): boolean {
            return char == null || char.length == 0;
        }

        public static IsEmptyArray(arr: string[]): boolean {
            return arr == null || arr.length == 0;
        }

        public static IsLetterOrNumber(char: string): boolean {
            if (Utils.letterOrNumbers == null) {
                Utils.letterOrNumbers = {};
                Utils.CHARS.forEach((fi) => {
                    Utils.letterOrNumbers[fi] = true;
                    Utils.letterOrNumbers[fi.toUpperCase()] = true;
                });
                Utils.NUMS.forEach((fi) => {
                    Utils.letterOrNumbers[fi] = true;
                });
            }
            return Utils.letterOrNumbers.hasOwnProperty(char);
        }

        public static IsLetterOrNumberExtra(char: string): boolean {
            if (Utils.letterOrNumbersExtra == null) {
                Utils.letterOrNumbersExtra = {};
                Utils.CHARS.forEach((fi) => {
                    Utils.letterOrNumbersExtra[fi] = true;
                    Utils.letterOrNumbersExtra[fi.toUpperCase()] = true;
                });
                Utils.NUMS.forEach((fi) => {
                    Utils.letterOrNumbersExtra[fi] = true;
                });
                Utils.EXTRA_CHARS.forEach((fi) => {
                    Utils.letterOrNumbersExtra[fi] = true;
                });
            }
            return Utils.letterOrNumbersExtra.hasOwnProperty(char);
        }
    }
}