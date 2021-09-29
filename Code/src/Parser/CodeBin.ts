namespace dmt {
    export class CodeBin {
        public tk: Token;
        public checkAttributes = { g: 1, i: 1, m: 1 };

        public constructor(bin: string) {
            let tks: Token[] = [];
            this.tk = new Token(KT.Brace, Token.void0);
            this.tk.tks = tks;

            var data = JSON.parse(bin);
            let types = data[0];
            let vals = data[1];
            for (let i = 2, len = data.length; i < len; i++) {
                var t = data[i];
                if (t >= 1000) {
                    let type = KT.ReservedWord;
                    let tk = new Token(type, Token.void0);
                    tk.isParser = true;
                    tk.val = vals[t - 1000];
                    tk.isValue = true;
                    tks.push(tk);
                } else {
                    let type = <any>KT[types[t]];
                    let tk = new Token(type, Token.void0);
                    tk.isParser = true;
                    tks.push(tk);

                    if (type == KT.StringVal) {
                        i++;
                        tk.val = vals[data[i]];
                        tk.isValue = true;
                    } else if (type == KT.NumberVal) {
                        i++;
                        tk.val = vals[data[i]];
                        tk.isValue = true;
                    } else if (type == KT.RegExpVal) {
                        i++;
                        let source = vals[data[i]];
                        i++;
                        let att = data[i];
                        if (!this.checkAttributes[att]) {
                            att = "";
                        }
                        tk.val = new RegExp(source, att);
                        tk.isValue = true;
                    } else if (type == KT.True) {
                        tk.val = true;
                        tk.isValue = true;
                    } else if (type == KT.False) {
                        tk.val = false;
                        tk.isValue = true;
                    } else if (type == KT.Null) {
                        tk.val = null;
                        tk.isValue = true;
                    } else if (type == KT.Undefined) {
                        tk.val = undefined;
                        tk.isValue = true;
                    } else if (type == KT.NaN) {
                        tk.val = NaN;
                        tk.isValue = true;
                    } else {
                        if (type == KT.Super || type == KT.This
                            || type == KT.Null || type == KT.NaN || type == KT.Undefined
                        ) {
                            tk.isValue = true;
                        }
                    }
                }
            }
        }
    }
}