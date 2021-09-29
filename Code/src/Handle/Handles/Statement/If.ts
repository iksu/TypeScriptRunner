namespace dmt {
    export class IfVal extends Handle {
        public type = "if(...){...}else if(...){...}else(...){...}";

        public constructor(code: CodeHandle) {
            super(KT.IfVal, code);

            this.exp = [
                new Express(KT.IfVal, KT.IfVal),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    if (t.type == KT.ElseIf || t.type == KT.Else) {
                        return ECT.OKStay;
                    } else {
                        return ECT.OKSkip;
                    }
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            for (let i = 0, len = tk.tks.length; i < len; i++) {
                let fi = tk.tks[i];
                if (fi.type == KT.IfVal
                    || fi.type == KT.If
                    || fi.type == KT.ElseIf) {
                    let a = fi.tks[0];
                    this.code.Express(a);
                    if (this.code.V(a, tk, ctk, ps)) {
                        let b = fi.tks[1];
                        this.code.Express(b);
                        return this.code.V(b, tk, ctk, ps);
                    }
                } else if (fi.type == KT.Else) {
                    let b = fi.tks[0];
                    this.code.Express(b);
                    return this.code.V(b, tk, ctk, ps);
                }
            }
            return null;
        }
    }

    export class If extends Handle {
        public type = "if(...){...}";

        public constructor(code: CodeHandle) {
            super(KT.IfVal, code);

            this.enterType = KT.If;

            this.exp = [
                new Express(KT.If, (t, tks, index, express) => {
                    if (t.type == KT.If) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.Par, KT.Par),
                new Express(KT.Brace, (t, tks, index, express) => {
                    if (t.type == KT.Brace || t.type == KT.SemiColon) {
                        return ECT.OK;
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.isParser = true;
            });
        }
    }

    export class ElseIf extends Handle {
        public type = "else if{...}";

        public constructor(code: CodeHandle) {
            super(KT.ElseIf, code);

            this.exp = [
                new Express(KT.ElseIf, (t, tks, index, express) => {
                    if (t.type == KT.ElseIf) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.Par, KT.Par),
                new Express(KT.Brace, (t, tks, index, express) => {
                    if (t.type == KT.Brace || t.type == KT.SemiColon) {
                        return ECT.OK;
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }
    }

    export class Else extends Handle {
        public type = "else{...}";

        public constructor(code: CodeHandle) {
            super(KT.Else, code);

            this.exp = [
                new Express(KT.Else, (t, tks, index, express) => {
                    if (t.type == KT.Else) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.Brace, (t, tks, index, express) => {
                    if (t.type == KT.Brace || t.type == KT.SemiColon) {
                        return ECT.OK;
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }
    }
}