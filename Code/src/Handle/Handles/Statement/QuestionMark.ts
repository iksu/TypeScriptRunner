namespace dmt {
    export class QuestionMarkHandle extends Handle {
        private questionMark: QuestionMark;

        public constructor(code: CodeHandle) {
            super(KT.QuestionMark, code);

            this.questionMark = new QuestionMark(code);
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            let index = 0;
            let hasNewQuestionMark = false;
            while (true) {
                if (index >= tks.length || index < 0) {
                    if (hasNewQuestionMark) {
                        hasNewQuestionMark = false;
                        index = 0;
                    } else {
                        break;
                    }
                }
                let len = tks.length;
                index = this.questionMark.Exp(me, tks, index);
                let newLen = tks.length;
                if (len != newLen) {
                    hasNewQuestionMark = true;
                }

            };
            return -1;
        }
    }

    //TODO:还需要识别 let a?=1; 参数
    export class QuestionMark extends Handle {
        public type = "...?...:...";

        public constructor(code: CodeHandle) {
            super(KT.QuestionMark, code);

            this.isValue = true;

            this.exp = [
                new Express(KT.QuestionMark, (t, tks, index, express) => {
                    if (t.type == KT.QuestionMark) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }, [KT.AnyOne]),
                new Express(KT.AnyOne, KT.AnyOne),
                new Express(KT.Colon, (t, tks, index, express) => {
                    if (t.type == KT.Colon) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, KT.AnyOne)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            let c = tk.tks[2];

            if (this.code.V(a, tk, ctk, ps)) {
                return this.code.V(b, tk, ctk, ps);
            } else {
                return this.code.V(c, tk, ctk, ps);
            }
        }
    }
}