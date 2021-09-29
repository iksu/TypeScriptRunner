namespace dmt {
    export class Declare extends Handle {
        public type = "declare ... {...}";

        public constructor(code: CodeHandle) {
            super(KT.Declare, code);

            this.exp = [
                new Express(KT.Declare, (t, tks, index, express) => {
                    if (t.type == KT.Declare) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.Brace, (t, tks, index, express) => {
                    if (t.type == KT.Brace) {
                        return ECT.OK;
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            //TODO:declare未进行解析
            return null;
        }
    }
}