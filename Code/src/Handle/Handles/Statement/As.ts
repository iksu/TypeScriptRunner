namespace dmt {
    export class AsVariate extends Handle {
        public type = "as ...";

        public constructor(code: CodeHandle) {
            super(KT.As, code);
        }

        public AfterExpress(me: Token, tks: Token[]) {
            for (let i = tks.length - 1; i >= 0; i--) {
                let tk = tks[i];
                if (tk.type == KT.As) {
                    tks.splice(i, 1);
                }
            }
        }
    }
}