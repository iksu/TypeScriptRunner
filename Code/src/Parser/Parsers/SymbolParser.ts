///<reference path="../Parser.ts" />
namespace dmt {
    export class LeftParParser extends Parser {
        public constructor() {
            super(KT.LeftPar, "(");
        }
    }

    export class RightParParser extends Parser {
        public constructor() {
            super(KT.RightPar, ")");
        }
    }

    export class LeftBraceParser extends Parser {
        public constructor() {
            super(KT.LeftBrace, "{");
        }
    }

    export class RightBraceParser extends Parser {
        public constructor() {
            super(KT.RightBrace, "}");
        }
    }

    export class LeftBracketParser extends Parser {
        public constructor() {
            super(KT.LeftBracket, "[");
        }
    }

    export class RightBracketParser extends Parser {
        public constructor() {
            super(KT.RightBracket, "]");
        }
    }

    export class PeriodParser extends Parser {
        public constructor() {
            super(KT.Period, ".");
        }
    }

    export class ParamsPreParser extends Parser {
        public constructor() {
            super(KT.ParamsPre, "..");
        }
    }

    export class ParamsParser extends Parser {
        public constructor() {
            super(KT.Params, "...");
        }
    }

    export class CommaParser extends Parser {
        public constructor() {
            super(KT.Comma, ",");
        }
    }

    export class ColonParser extends Parser {
        public constructor() {
            super(KT.Colon, ":");
        }
    }

    export class SemiColonParser extends Parser {
        public constructor() {
            super(KT.SemiColon, ";");
        }
    }

    export class QuestionMarkParser extends Parser {
        public constructor() {
            super(KT.QuestionMark, "?");
        }
    }

    export class EnterParser extends Parser {
        public constructor() {
            super(KT.Enter, "\n");
        }
    }

    export class SemiColonAndEnterParser extends Parser {
        public constructor() {
            super(KT.SemiColon, ";\n");
        }
    }

    export class FunctionSymbolParser extends Parser {
        public constructor() {
            super(KT.FunctionSymbol, "=>");
        }
    }
}