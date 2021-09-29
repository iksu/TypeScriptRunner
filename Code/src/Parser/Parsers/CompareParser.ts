///<reference path="../Parser.ts" />
namespace dmt {
    export class EqualParser extends Parser {
        public constructor() {
            super(KT.Equal, "==");
        }
    }

    export class AllEqualParser extends Parser {
        public constructor() {
            super(KT.AllEqual, "===");
        }
    }

    export class NotEqualParser extends Parser {
        public constructor() {
            super(KT.NotEqual, "!=");
        }
    }

    export class AllNotEqualParser extends Parser {
        public constructor() {
            super(KT.AllNotEqual, "!==");
        }
    }

    export class GreaterParser extends Parser {
        public constructor() {
            super(KT.Greater, ">");
        }
    }

    ////无法识别2>=1 和 let a:Array<number>=[]
    // export class GreaterOrEqualParser extends Parser {
    //     public constructor() {
    //         super(TokenType.GreaterOrEqual, ">=");
    //     }
    // }

    export class LessParser extends Parser {
        public constructor() {
            super(KT.Less, "<");
        }
    }

    // export class LessOrEqualParser extends Parser {
    //     public constructor() {
    //         super(TokenType.LessOrEqual, "<=");
    //     }
    // }
}