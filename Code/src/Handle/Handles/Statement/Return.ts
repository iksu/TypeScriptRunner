namespace dmt {
    export class Return extends Handle {
        public type = "return ...";

        public constructor(code: CodeHandle) {
            super(KT.Return, code);

            this.exp = [
                new Express(KT.Return, (t, tks, index, express) => {
                    if (t.type == KT.Return) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, KT.AnyOne)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {          
            let a = tk.tks[0];
            if (a.isValue) {
                let val = this.code.V(a, tk, ctk, ps);
                ctk.returnVal = val;
            } else {
                ctk.returnVal = Token.void0;
            }
            ctk.signal = this.handleType;
            return tk;
        }
    }
}