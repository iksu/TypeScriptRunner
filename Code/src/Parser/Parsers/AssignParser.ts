///<reference path="../Parser.ts" />
namespace dmt {
    export class AssignParser extends Parser {
        public constructor() {
            super(KT.Assign, "=");
        }
    }

    export class NotParser extends Parser {
        public constructor() {
            super(KT.Not, "!");
        }
    }

    export class BitwiseNotParser extends Parser {
        public constructor() {
            super(KT.BitwiseNot, "~");
        }
    }

    export class IncrementParser extends Parser {
        public constructor() {
            super(KT.Increment, "++");
        }
    }

    export class DecrementParser extends Parser {
        public constructor() {
            super(KT.Decrement, "--");
        }
    }

    export class AssignPlusParser extends Parser {
        public constructor() {
            super(KT.AssignPlus, "+=");
        }
    }

    export class AssignMinusParser extends Parser {
        public constructor() {
            super(KT.AssignMinus, "-=");
        }
    }

    export class AssignMultiplyParser extends Parser {
        public constructor() {
            super(KT.AssignMultiply, "*=");
        }
    }

    export class AssignDivideParser extends Parser {
        public constructor() {
            super(KT.AssignDivide, "/=");
        }
    }

    export class AssignModuloParser extends Parser {
        public constructor() {
            super(KT.AssignModulo, "%=");
        }
    }

    export class AssignInclusiveOrParser extends Parser {
        public constructor() {
            super(KT.AssignInclusiveOr, "|=");
        }
    }

    export class OrParser extends Parser {
        public constructor() {
            super( KT.Or, "||");
        }
    }

    export class AssignCombineParser extends Parser {
        public constructor() {
            super(KT.AssignCombine, "&=");
        }
    }

    export class AndParser extends Parser {
        public constructor() {
            super(KT.And, "&&");
        }
    }

    export class AssignXORParser extends Parser {
        public constructor() {
            super(KT.AssignXOR, "^=");
        }
    }

    // export class AssignShiParser extends Parser {
    //     public constructor() {
    //         super(TokenType.AssignShi, "<<=");
    //     }
    // }

    // export class AssignShrParser extends Parser {
    //     public constructor() {
    //         super(TokenType.AssignShr, ">>=");
    //     }
    // }

    // export class AssignUnsignedShrParser extends Parser {
    //     public constructor() {
    //         super(TokenType.AssignUnsignedShr, ">>>=");
    //     }
    // }
}