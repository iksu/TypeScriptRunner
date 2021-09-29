///<reference path="Token.ts" />
namespace dmt {
    export class Parser {
        public name: string;
        public type: KT;
        public key: string;
        public autoAddVal: boolean = false;
        public val: any;

        public constructor(type: KT, key: string) {
            this.type = type;
            this.name = KT[type];
            this.key = key;

            if (this.key.length > 1) {
                this.waitForChar = this.key.substr(this.key.length - 1, 1);
                this.preParserChar = this.key.substr(0, this.key.length - 1);
            }
        }

        public preParserChar: string;
        public waitForChar: string;
        public waitForParsers: Parser[];

        public SetWaitForParser(parsers: Parser[]) {
            parsers.forEach((fi) => {
                if (fi.preParserChar == this.key) {
                    if (!this.waitForParsers) {
                        this.waitForParsers = [];
                    }
                    this.waitForParsers.push(fi);
                }
            });
        }

        public Reset() {
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (this.waitForParsers) {
                for (let i = 0, len = this.waitForParsers.length; i < len; i++) {
                    let nextParser = this.waitForParsers[i];
                    if (nextParser.waitForChar == char) {
                        return nextParser;
                    }
                }
            }
            let tk = new Token(this.type, Token.void0);//this.key
            tk.isParser = true;
            tk.line = line;
            tk.column = column;
            tks.push(tk);
            return null;
        }

        public WillAcceptStart(char: string): boolean {
            return false;
        }
    }
}