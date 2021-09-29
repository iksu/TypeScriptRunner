namespace dmt {
    export class PairsHandle extends Handle {
        public handles: Object;

        protected constructor(code: CodeHandle, handles: Handle[]) {
            super(KT.None, code);

            this.handles = {};
            handles.forEach((fi) => {
                this.handles[fi.enterName] = fi;
            });
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            for (let i = bIndex, len = tks.length; i < len; i++) {
                let tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    let handle = <Handle>this.handles[tk.name];
                    let v = handle.Exp(me, tks, i);
                    if (v) {
                        return v;
                    }
                }
            }
            return -1;
        }
    }

    export class Pairs extends PairsHandle {
        public constructor(code: CodeHandle) {
            super(code, [
                new ParPair(code),
                new BracePair(code),
                new BracketPair(code),
                new ElseIfPair(code)
            ]);
        }
    }

    export class ParPair extends Handle {
        public type = "(...)";

        public constructor(code: CodeHandle) {
            super(KT.Par, code);

            this.enterType = KT.LeftPar;
            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            this.code.Express(tk);
            let tks = tk.tks;
            for (let i = tk.tks.length - 1; i >= 0; i--) {
                let t = tk.tks[i];
                if (t.type == KT.End || t.type == KT.Enter) {
                    tk.tks.splice(i, 1);
                }
            }

            let val: any;
            for (let i = 0, len = tks.length; i < len; i++) {
                let fi = tks[i];
                if (fi.type != KT.SemiColon) {
                    val = this.code.V(fi, tk, ctk, ps);
                }
            }
            return val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.ExpressPairs(tks, bIndex, new Express(KT.Par, KT.LeftPar, null, KT.RightPar), this, (tk: Token) => {
                tk.isParser = true;
                tk.handle = this;
            });
        }
    }

    export class BracePair extends Handle {
        public type = "{...}";

        public constructor(code: CodeHandle) {
            super(KT.Brace, code);

            this.enterType = KT.LeftBrace;
            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            this.code.Express(tk);
            if (tk.tks.length == 0) {
                tk.type = KT.Json;
            }
            if (tk.type == KT.Json) {
                return BracePair.HandleBraceJson(tk, this.code, ctk, ps);
            } else {
                let tks = tk.tks;
                for (let i = 0, len = tks.length; i < len; i++) {
                    if (ctk.signal == KT.None) {
                        let fi = tks[i];
                        if (!fi.static && fi.type != KT.SemiColon) {
                            this.code.V(fi, tk, ctk, ps);
                        }
                    }
                }
                return tk;
            }
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.ExpressPairs(tks, bIndex, new Express(KT.Brace, KT.LeftBrace, null, KT.RightBrace), this, (tk: Token) => {
                tk.handle = this;
            });
        }

        public static HandleBraceJson(tk: Token, code: CodeHandle, ctk: Token, ps: Object): Object {
            if (!tk) {
                return;
            }
            for (let i = tk.tks.length - 1; i >= 0; i--) {
                let t = tk.tks[i];
                if (t.type == KT.End || t.type == KT.Enter || t.type == KT.Comma) {
                    tk.tks.splice(i, 1);
                }
            }
            // if (!tk.ps) {
            //    
            // }
            //let nps = code.ComParams(tk.ps, ps);
            let nps = {};
            nps = code.ComParams(nps, ps);
            Object.defineProperty(ps, "__json__", {
                value: 1,
                enumerable: false,
                configurable: false
            });

            for (let i = 0, len = tk.tks.length; i < len; i++) {
                let t = tk.tks[i];
                if (t.type == KT.JsonVal) {
                    let a = t.tks[0];
                    let b = t.tks[1];
                    if (a && b) {
                        let key = a.val;
                        if (key == Token.void0) {
                            key = a.name.toLowerCase();//key值是关键词
                        }
                        let val = code.V(b, tk, ctk, nps);
                        if (code.autoBind) {
                            if (val instanceof Function) {
                                if (!val["__bind__"]) {
                                    //这里直接把function()=>{}和()=>{}的this指向改为一致了。在ts中this没必要指向自身
                                    if (typeof val == "function") {
                                        if (val["__token__"] && val["__token__"].type == KT.ClassInstance) {
                                        } else {
                                            val = val.bind(ps);
                                            Object.defineProperty(val, "__bind__", {
                                                value: true,
                                                enumerable: false,
                                                configurable: false
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        code.SetParmsValue(key, val, ctk, nps);
                    }
                }
            }

            return nps;
        }
    }

    export class BracketPair extends Handle {
        public type = "[...]";

        public constructor(code: CodeHandle) {
            super(KT.Bracket, code);

            this.enterType = KT.LeftBracket;
            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            this.code.Express(tk);

            let arr = [];
            let tks = tk.tks;
            for (let i = 0, len = tks.length; i < len; i++) {
                let fi = tks[i];
                if (fi.type == KT.Comma) {
                    for (let j = 0, jlen = fi.tks.length; j < jlen; j++) {
                        arr.push(this.code.V(fi.tks[j], tk, ctk, ps));
                    }
                } else {
                    arr.push(this.code.V(fi, tk, ctk, ps));
                }
            }
            return arr;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.ExpressPairs(tks, bIndex, new Express(KT.Bracket, KT.LeftBracket, null, KT.RightBracket), this, (tk: Token) => {
                tk.isParser = true;
                tk.handle = this;
            });
        }
    }

    export class ElseIfPair extends Handle {
        public type = "else if";

        public constructor(code: CodeHandle) {
            super(KT.ElseIf, code);

            this.enterType = KT.Else;

            this.exp = [
                new Express(KT.Else, KT.Else),
                new Express(KT.If, KT.If)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }

    export class AngleBracketPair extends Handle {
        public type = "<...>";

        public constructor(code: CodeHandle) {
            super(KT.AngleBracket, code);

            this.enterType = KT.Less;

            this.exp = [new Express(KT.Less, (t, tks, index, express) => {
                if (t.type == KT.Less) {
                    let pt = tks[index - 1];
                    if (!pt || !pt.isValue) {
                        return ECT.OK;
                    }
                }
                return ECT.Fail;
            }), new Express(KT.Greater, (t, tks, index, express) => {
                if (t.type == KT.Greater) {
                    return ECT.OK;
                } else {
                    return ECT.OKStay;
                }
            })];
            //, new Express(KT.Greater, KT.Greater)
        }

        public AfterExpress(me: Token, tks: Token[]) {
            for (let i = tks.length - 1; i >= 0; i--) {
                let tk = tks[i];
                if (tk.type == KT.AngleBracket) {
                    tks.splice(i, 1);
                }
            }
        }
    }
}