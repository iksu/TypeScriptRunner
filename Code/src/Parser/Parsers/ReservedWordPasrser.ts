///<reference path="../Parser.ts" />
namespace dmt {
    export class ReservedWordPasrser extends Parser {
        public constructor() {
            super(KT.ReservedWord, "");
            this.autoAddVal = true;

            let keywords = [
                KT.Var,
                KT.Let,
                KT.Const,
                KT.Instanceof,
                KT.Typeof,
                KT.If,
                KT.Else,
                KT.For,
                KT.In,
                KT.Switch,
                KT.Case,
                KT.Default,
                KT.Break,
                KT.Continue,
                KT.Return,
                KT.While,
                KT.Function,
                KT.Try,
                KT.Catch,
                KT.Throw,
                KT.Boolean,
                KT.True,
                KT.False,
                KT.String,
                KT.Null,
                KT.Export,
                KT.Abstract,
                KT.NameSpace,
                KT.Module,
                KT.Class,
                KT.Interface,
                KT.Public,
                KT.Protected,
                KT.Private,
                KT.Extends,
                KT.Static,
                KT.New,
                KT.Void,
                KT.Any,
                KT.Never,
                KT.NaN,
                KT.Undefined,
                KT.Async,
                KT.Await,
                KT.Import,
                KT.Get,
                KT.Set,
                KT.As,
                KT.Delete,
                KT.Implements,
                KT.This,
                KT.Super,
                KT.Yield,
                KT.Declare
            ];
            this.keywords = {};
            keywords.forEach((fi) => {
                let w = KT[fi];
                let f0 = w[0].toLowerCase();
                let f1 = w.substring(1, w.length);
                this.keywords[f0 + f1] = fi;
            });
            //console.log(this.keywords);

            this.Reset();
        }

        public keywords: Object;

        public word: string[];
        public beginLine: number;
        public beginColumn: number;

        public Reset() {
            this.word = [];
            this.val = Token.void0;
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (Utils.IsLetterOrNumberExtra(char)) {
                if (this.word.length == 0) {
                    this.beginLine = line;
                    this.beginColumn = column;
                }
                this.word.push(char);
                return this;
            }
            this.val = this.word.join("");
            let type = this.type;

            //这个判断会误判
            //let firstChar = this.val.substr(0, 1);
            // if (firstChar.toLowerCase() == firstChar) {
            //     let uname = this.val.substr(0, 1).toUpperCase() + this.val.substr(1, this.val.length - 1);
            //     type = <any>KT[uname];
            //     if (type === Token.void0) {
            //         type = this.type;
            //     }
            // }

            let v = <string>this.val;
            if (this.keywords.hasOwnProperty(v)) {
                type = this.keywords[v];
            }

            let tk = new Token(type, Token.void0);
            if (tk.type == KT.ReservedWord) {
                tk.val = this.val;
            } else if (tk.type == KT.True) {
                tk.val = true;
            } else if (tk.type == KT.False) {
                tk.val = false;
            } else if (tk.type == KT.Null) {
                tk.val = null;
            } else if (tk.type == KT.NaN) {
                tk.val = NaN;
            } else if (tk.type == KT.Undefined) {
                tk.val = undefined;
            }
            tk.isParser = true;
            tk.line = this.beginLine;
            tk.column = this.beginColumn;
            //如果是ts的关键词则没有值，不然就是自定义的值
            if (type == KT.ReservedWord || type == KT.Super || type == KT.This
                || type == KT.True || type == KT.False || type == KT.Null
                || type == KT.NaN || type == KT.Undefined
            ) {
                tk.isValue = true;
            } else {
                tk.isValue = false;
            }
            tks.push(tk);
            return null;
        }

        public WillAcceptStart(char: string): boolean {
            if (Utils.IsLetterOrNumberExtra(char)) {
                return true;
            }
            return false;
        }
    }
}