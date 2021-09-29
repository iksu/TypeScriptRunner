namespace dmt {
    export class Json extends Handle {
        public type = "...:...";

        public constructor(code: CodeHandle) {
            super(KT.JsonVal, code);

            this.enterType = KT.Colon;

            this.exp = [new Express(KT.Colon, (t, tks, index, express) => {
                if (t.type == KT.Colon) {
                    return ECT.OKSkip;
                } else {
                    return ECT.Fail;
                }
            }, [KT.AnyOne]),
            new Express(KT.AnyOne, (t, tks, index, express) => {
                if (t.type == KT.Enter) {
                    return ECT.OKSkipStay;
                } else {
                    return ECT.OK;
                }
            })];
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            if (me.type != KT.Json) {
                return -1;
            }
            let index = Express.Exps(tks, bIndex, this.exp, this.handleType, this);
            return index;
        }
    }
}