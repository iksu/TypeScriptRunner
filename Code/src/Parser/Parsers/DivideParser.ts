///<reference path="../Parser.ts" />
namespace dmt {
    export class DivideParser extends Parser {
        //  / //g
        public constructor() {
            super(KT.Divide, "/");
            this.autoAddVal = true;
            this.Reset();
        }

        public checkAttributes = { g: 1, i: 1, m: 1 };

        public word: string[];
        public startChar: string;
        public end: boolean;
        public inEscape = false;
        public isRegExp = false;

        public Reset() {
            this.word = [];
            this.startChar = Token.void0;
            this.end = false;
            this.inEscape = false;
            this.isRegExp = false;
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (this.end) {
                this.val = this.word.join("");
                let tk = new Token(KT.RegExpVal,Token.void0);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);

                let attributes = Token.void0;
                if (this.checkAttributes[char]) {
                    stream.Read();//把修饰符读掉
                    attributes = char;
                }
                tk.val = new RegExp(this.val, attributes);
                return null;
            }

            if (this.startChar === Token.void0) {
                let preToken = tks[tks.length - 1];
                let nextChar = stream.Peek(0);
                //正则和除号的判断，有点麻烦
                if (preToken && (preToken.type != KT.LeftPar//(/.../g)
                    && preToken.type != KT.Assign//reg=/.../g
                    && preToken.type != KT.Comma)//(...,/.../g);
                    || nextChar == "/"//注释标记
                    || nextChar == "*"//注释标记
                ) {
                    this.isRegExp = false;
                    this.startChar = char;
                    return this;
                } else {
                    this.isRegExp = true;
                    this.startChar = char;
                    return this;
                }
            }
            if (this.isRegExp) {
                if (char == this.startChar && !this.inEscape) {
                    this.end = true;
                } else {
                    if (!this.inEscape) {
                        if (char == "\\") {
                            this.inEscape = true;
                        }
                    } else {
                        this.inEscape = false;
                    }
                    this.word.push(char);
                }
                return this;
            } else {
                return super.TryAddValue(char, stream, tks, line, column);
            }
        }
    }
}