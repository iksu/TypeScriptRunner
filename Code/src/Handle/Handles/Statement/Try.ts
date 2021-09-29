namespace dmt {
    export class TryVal extends Handle {
        public type = "try{...}catch(...){...}";

        public constructor(code: CodeHandle) {
            super(KT.TryVal, code);

            this.exp = [
                new Express(KT.TryVal, KT.TryVal),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    if (t.type == KT.Catch) {
                        return ECT.OKStay;
                    } else {
                        return ECT.OKSkip;
                    }
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            try {
                this.code.V(a.tks[0], tk, ctk, ps);
            } catch (ex) {
                CodeHandle.Info();
                if (b) {
                    let b1 = b.tks[0];
                    let b2 = b.tks[1];
                    let p = {};
                    p[b1.tks[0].val] = ex;                   
                    let nps = this.code.ComParams(p, ps);
                    this.code.V(b2, tk, ctk, nps);
                }
            }
            return null;
        }
    }

    export class Try extends Handle {
        public type = "try{...}";

        public constructor(code: CodeHandle) {
            super(KT.TryVal, code);

            this.enterType = KT.Try;

            this.exp = [
                new Express(KT.Try, (t, tks, index, express) => {
                    if (t.type == KT.Try) {
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

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.isParser = true;
            });
        }
    }

    export class Catch extends Handle {
        public type = "catch(...){...}";

        public constructor(code: CodeHandle) {
            super(KT.Catch, code);

            this.exp = [
                new Express(KT.Catch, (t, tks, index, express) => {
                    if (t.type == KT.Catch) {
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
}