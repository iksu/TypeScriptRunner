namespace dmt {
    export class For extends Handle {
        public type = "for(...){...}";

        public constructor(code: CodeHandle) {
            super(KT.For, code);

            this.exp = [
                new Express(KT.For, (t, tks, index, exp) => {
                    if (t.type == KT.For) {
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

            let as = this.code.SplitToken(a.tks, KT.SemiColon);
            if (as.length > 0 && as[0].length > 0 && as[0][0].type == KT.In) {
                let ain = as[0][0];
                let aval = this.code.V(ain.tks[0], tk, ctk, ps);
                let bval = this.code.V(ain.tks[1], tk, ctk, ps);
                if (bval instanceof Token) {
                    bval = bval.ps;
                }
                let p = {};
                let nps = this.code.ComParams(p, ps);
                let isJson = bval.hasOwnProperty("__json__");
                if (typeof bval == "string") {
                    for (let i = 0, len = bval.length; i < len; i++) {
                        let fi = bval.charAt(i);
                        p[aval] = fi;
                        this.code.V(b, tk, ctk, nps);
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
                } else {
                    let keys = Object.keys(bval);
                    for (let i = 0, len = keys.length; i < len; i++) {
                        let fi = keys[i];
                        //for (let fi in Object.keys(bval)) {//这里默认增加了Object.keys
                        if (isJson) {
                            if (!bval.hasOwnProperty(fi)) {
                                continue;
                            }
                        }
                        if (fi.length > 2 && fi.substr(0, 2) == "__") {
                            continue;
                        }
                        p[aval] = fi;
                        this.code.V(b, tk, ctk, nps);
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
                }
            }
            else if (as.length < 3) {
                throw new Error("'For' need 3 elements");
            } else {
                let asNew = as.map((fi) => fi[0]);
                for (
                    (asNew[0] ? this.code.V(asNew[0], tk, ctk, ps) : true);
                    (asNew[1] ? this.code.V(asNew[1], tk, ctk, ps) : true);
                    (asNew[2] ? this.code.V(asNew[2], tk, ctk, ps) : true)
                ) {
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
            }
            return null;
        }
    }
}