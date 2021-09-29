namespace dmt {
    export class Comma extends Handle {
        public type = "...,...";

        public constructor(code: CodeHandle) {
            super(KT.Comma, code);
            this.isValue = true;

            this.exp = [new Express(KT.Comma, (t, tks, index, express) => {
                if (t.type == KT.Comma) {
                    return ECT.OKSkip;
                } else {
                    return ECT.Fail;
                }
            }, [KT.AnyOne]),
            new Express(KT.AnyOne, KT.AnyOne)];
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
            if (me.type == KT.Json) {
                return -1;
            }
            let index = Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                if (t.tks[0].type == KT.Comma) {
                    let a = t.tks[0];
                    let b = t.tks[1];
                    t.tks = a.tks;
                    t.tks.push(b);
                    t.tks.forEach((fi) => {
                        fi.parent = t;
                    });
                }
            });
            return index;
        }
    }
}