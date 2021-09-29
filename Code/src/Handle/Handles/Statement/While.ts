namespace dmt {
    export class While extends Handle {
        public type = "while(...){...}";

        public constructor(code: CodeHandle) {
            super(KT.While, code);

            this.exp = [
                new Express(KT.While, (t, tks, index, exp) => {
                    if (t.type == KT.While) {
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

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            this.code.Express(a);
            this.code.Express(b);

            while (this.code.V(a, tk, ctk, ps)) {
                this.code.V(b, tk, ctk, ps);
                if (ctk.signal == KT.Continue) {
                    ctk.signal = KT.None;
                    continue;
                }
                else if (ctk.signal == KT.Break) {
                    ctk.signal = KT.None;
                    break;
                }
                else if (ctk.signal == KT.Return) {
                    return null;
                }
            }
            return null;
        }
    }
}