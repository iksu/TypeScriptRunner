///<reference path="../Parser.ts" />
namespace dmt {
    export class StringParser extends Parser {
        public constructor() {
            super(KT.StringVal, "");
            this.autoAddVal = true;
            this.charParser = new CharParser();
            this.Reset();
        }

        public charParser: CharParser;
        public word: string[];
        public startChar: string;
        public end: boolean;

        public Reset() {
            this.word = [];
            this.startChar = Token.void0;
            this.end = false;
            this.charParser.Reset();
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (this.end) {
                this.val = this.word.join("");
                let tk = new Token(this.type, this.val);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);
                return null;
            }

            let parser = this.charParser.TryAddValue(char, stream, tks, line, column);
            if (parser != null) {
                return this;
            }
            else {
                char = this.charParser.val;

                if (this.startChar === Token.void0) {
                    this.startChar = char;
                    return this;
                }

                if (this.charParser.InCheck()) {
                    this.word.push(char);
                    this.charParser.ResetCheck();
                } else {
                    if (char == this.startChar) {
                        this.end = true;
                    } else {
                        this.word.push(char);
                        this.charParser.ResetCheck();
                    }
                }
                return this;
            }
        }

        public WillAcceptStart(char: string): boolean {
            if (Utils.IsStringStart(char)) {
                return true;
            }
            return false;
        }
    }
}