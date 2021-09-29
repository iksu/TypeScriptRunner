namespace dmt {
    export class CodeParser {
        public parsers: Parser[];
        public noKeyParsers: Parser[];
        public oneKeyParsers: Parser[];
        public oneKeyParserKeys: string[];

        public code: string;
        public stream: Stream;
        public tk: Token;

        public constructor(code: string) {
            this.parsers = [
                new PlusParser(),
                new MinusParser(),
                new MultiplyParser(),
                new ExponentiationParser(),
                new DivideParser(),
                new ModuloParser(),
                new InclusiveOrParser(),
                new CombineParser(),
                new XORParser(),
                new ShiParser(),
                new ShrParser(),
                new UnsignedShrParser(),

                new LeftParParser(),
                new RightParParser(),
                new LeftBraceParser(),
                new RightBraceParser(),
                new LeftBracketParser(),
                new RightBracketParser(),
                new PeriodParser(),
                new ParamsPreParser(),
                new ParamsParser(),
                new CommaParser(),
                new ColonParser(),
                new SemiColonParser(),
                new QuestionMarkParser(),
                new FunctionSymbolParser(),
                new EnterParser(),
                new SemiColonAndEnterParser(),

                new EqualParser(),
                new AllEqualParser(),
                new NotEqualParser(),
                new AllNotEqualParser(),
                new GreaterParser(),
                //new GreaterOrEqualParser(),//无法识别2>=1 和 let a:Array<number>=[]
                new LessParser(),
                //new LessOrEqualParser(),

                new AssignParser(),
                new NotParser(),
                new BitwiseNotParser(),
                new IncrementParser(),
                new DecrementParser(),
                new AssignPlusParser(),
                new AssignMinusParser(),
                new AssignMultiplyParser(),
                new AssignDivideParser(),
                new AssignModuloParser(),
                new AssignInclusiveOrParser(),
                new OrParser(),
                new AssignCombineParser(),
                new AndParser(),
                new AssignXORParser(),
                //new AssignShiParser(),
                //new AssignShrParser(),//无法识别2>=1 和 let a:Array<number>=[]
                //new AssignUnsignedShrParser(),//无法识别2>=1 和 let a:Array<number>=[]

                new NumberParser(),
                new StringParser(),
                new ReservedWordPasrser(),
                new AnnotationParser(),
                new AnnotationStarParser(),
            ];

            this.parsers.forEach((fi) => {
                fi.SetWaitForParser(this.parsers);
            });

            this.noKeyParsers = [];
            this.oneKeyParsers = [];
            this.oneKeyParserKeys = [];
            this.parsers.forEach((fi) => {
                if (fi.key.length == 0) {
                    this.noKeyParsers.push(fi);
                }
                else if (fi.key.length == 1) {
                    this.oneKeyParsers.push(fi);
                    this.oneKeyParserKeys.push(fi.key);
                }
            });

            this.code = code;
            this.stream = new Stream(code);
            this.Parse();
        }

        private TryGetParserByChar(char: string): Parser {
            let index = this.oneKeyParserKeys.indexOf(char);
            if (index > -1) {
                return this.oneKeyParsers[index];
            } else {
                if (Utils.IsStringSkip(char)) {
                    return null;
                }
                for (let i = 0, len = this.noKeyParsers.length; i < len; i++) {
                    let parser = this.noKeyParsers[i];
                    if (parser.WillAcceptStart(char)) {
                        return parser;
                    }
                }
            }
            return null;
        }

        private Parse() {
            let parser: Parser;
            let tks: Token[] = [];
            this.tk = new Token(KT.Brace, Token.void0);
            this.tk.tks = tks;

            let line = 0;
            let column = 0;

            let handle = (char) => {
                if (parser != null) {
                    parser = parser.TryAddValue(char, this.stream, tks, line, column);
                    if (parser == null) {
                        char = this.stream.Peek(-1);
                        handle(char);
                    }
                } else {
                    parser = this.TryGetParserByChar(char);
                    if (parser) {
                        parser.Reset();
                        if (parser.autoAddVal) {
                            parser = parser.TryAddValue(char, this.stream, tks, line, column);
                        }
                    }
                }
            };

            while (!this.stream.EOF()) {
                line = this.stream.line;
                column = this.stream.column;
                handle(this.stream.Read());
            }
            handle("\n");
        }

        public Release(): string {
            let types = {};
            let vals = [];
            let arr = [types, vals];
            this.tk.tks.forEach((fi) => {
                let type = fi.type;
                types[type] = KT[type];
                if (type == KT.ReservedWord) {
                    let index = vals.indexOf(fi.val);
                    if (index >= 0) {
                        arr.push(index + 1000);
                    } else {
                        vals.push(fi.val);
                        arr.push(vals.length - 1 + 1000);
                    }
                } else if (type == KT.NumberVal || type == KT.StringVal) {
                    let index = vals.indexOf(fi.val);
                    if (index >= 0) {
                        arr.push(type);
                        arr.push(index);
                    } else {
                        arr.push(type);
                        vals.push(fi.val);
                        arr.push(vals.length - 1);
                    }
                } else if (type == KT.True || type == KT.False) {
                    arr.push(type);
                } else if (type == KT.RegExpVal) {
                    let val = fi.val.source;
                    let att = fi.val.toString();
                    att = att.charAt(att.length - 1);
                    let index = vals.indexOf(val);
                    if (index >= 0) {
                        arr.push(type);
                        arr.push(index);
                    } else {
                        arr.push(type);
                        vals.push(val);
                        arr.push(vals.length - 1);
                    }
                    arr.push(att);
                } else {
                    arr.push(type);
                    if (fi.val) {
                        console.warn("Not hande TokenType:", KT[type])
                    }
                }
            });
            return JSON.stringify(arr);
        }
    }
}