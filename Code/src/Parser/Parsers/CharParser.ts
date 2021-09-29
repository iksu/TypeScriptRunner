///<reference path="../Parser.ts" />
namespace dmt {
    export class CharParser extends Parser {
        public checkVal: string;

        public constructor() {
            super(KT.None, "");
            this.autoAddVal = true;
            this.Reset();
        }

        public Reset() {
            this.val = Token.void0;
            this.checkVal = Token.void0;
        }

        public InCheck(): any {
            return this.checkVal !== Token.void0;
        }

        public ResetCheck() {
            this.checkVal = Token.void0;
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (this.checkVal === Token.void0) {
                if (char == "\\") {
                    this.checkVal = char;
                    return this;
                } else {
                    this.val = char;
                    return null;
                }
            } else {
                //\
                if (this.checkVal.length == 1) {
                    switch (char) {
                        case "n":
                            this.val = "\n";
                            break;
                        case "\\":
                            this.val = "\\";
                            break;
                        case "'":
                            this.val = "\'";
                            break;
                        case "\"":
                            this.val = "\"";
                            break;
                        case "r":
                            this.val = "\r";
                            break;
                        case "b":
                            this.val = "\b";
                            break;
                        case "f":
                            this.val = "\f";
                            break;
                        case "t":
                            this.val = "\t";
                            break;
                        case "&":
                            this.val = "\&";
                            break;
                        case "u":
                            this.checkVal += char;
                            return this;
                        default:
                            this.val = char;
                    }
                }
                //\u0000
                else {
                    if (this.checkVal.length == 5) {
                        this.val = window["unescape"]("%" + this.checkVal.substring(1, this.checkVal.length) + char);
                        return null;
                    } else {
                        this.checkVal += char;
                        return this;
                    }
                }
                return null;
            }
        }
    }
}