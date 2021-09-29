///<reference path="../Parser.ts" />
namespace dmt {
    export class NumberParser extends Parser {
        public constructor() {
            super(KT.NumberVal, "");
            this.autoAddVal = true;
            this.Reset();
        }

        public word: string[];
        public hexMode: boolean;

        public Reset() {
            this.word = [];
            this.val = Token.void0;
            this.hexMode = false;
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (this.hexMode) {
                if (Utils.IsHexNumber(char)) {
                    this.word.push(char);
                    return this;
                }
                this.val = parseInt(this.word.join(""), 16);
                let tk = new Token(this.type, this.val);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);
                return null;
            } else {
                if (Utils.IsNumber(char) || char == ".") {
                    this.word.push(char);
                    return this;
                }
                if (this.word.length == 1 && this.word[0] == "0" && char == "x") {
                    this.hexMode = true;
                    this.word.length = 0;
                    return this;
                }
                if (this.word.indexOf(".") > -1) {
                    this.val = parseFloat(this.word.join(""));
                } else {
                    this.val = parseInt(this.word.join(""));
                }
                let tk = new Token(this.type, this.val);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);
                return null;
            }
        }

        public WillAcceptStart(char: string): boolean {
            if (Utils.IsNumber(char)) {
                return true;
            }
            return false;
        }
    }
}