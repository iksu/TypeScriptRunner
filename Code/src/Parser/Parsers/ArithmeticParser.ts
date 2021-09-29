///<reference path="../Parser.ts" />
namespace dmt {
    export class PlusParser extends Parser {
        public constructor() {
            super(KT.Plus, "+");
        }
    }

    export class MinusParser extends Parser {
        public constructor() {
            super(KT.Minus, "-");
        }
    }

    export class MultiplyParser extends Parser {
        public constructor() {
            super(KT.Multiply, "*");
        }
    }

    export class ExponentiationParser extends Parser {
        public constructor() {
            super(KT.Exponentiation, "**");
        }
    }

    export class ModuloParser extends Parser {
        public constructor() {
            super(KT.Modulo, "%");
        }
    }

    export class InclusiveOrParser extends Parser {
        public constructor() {
            super(KT.InclusiveOr, "|");
        }
    }

    export class CombineParser extends Parser {
        public constructor() {
            super(KT.Combine, "&");
        }
    }

    export class XORParser extends Parser {
        public constructor() {
            super(KT.XOR, "^");
        }
    }

    export class ShiParser extends Parser {
        public constructor() {
            super(KT.Shi, "<<");
        }
    }

    export class ShrParser extends Parser {
        public constructor() {
            super(KT.Shr, ">>");
        }
    }

    export class UnsignedShrParser extends Parser {
        public constructor() {
            super(KT.UnsignedShr, ">>>");
        }
    }
}