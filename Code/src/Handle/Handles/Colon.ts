namespace dmt {
    export class Colon extends Handle {
        public type = ":...";

        public skipIndex: number = 0;

        public constructor(code: CodeHandle) {
            super(KT.Colon, code);
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            this.code.Express(tk);
            return BracePair.HandleBraceJson(tk, this.code, ctk, ps);
        }

        //:后面很复杂，不能用公式进行判断
        public Exp(me: Token, tks: Token[], bIndex: number): number {
            let newTokens: Token[] = null;
            let beginTokenIndex = -1;
            let angleBracketIndex = 0;

            for (let i = bIndex, len = tks.length; i < len; i++) {
                let tk = tks[i];
                if (newTokens) {
                    if (angleBracketIndex > 0) {
                        if (tk.type == KT.Less) {
                            angleBracketIndex++;
                        } else if (tk.type == KT.Greater) {
                            angleBracketIndex--;
                        }
                        newTokens.push(tk);
                    }
                    else {
                        if (tk.type == KT.Assign
                            || tk.type == KT.Comma
                            || tk.type == KT.SemiColon
                            || tk.type == KT.End
                            || tk.type == KT.Enter && newTokens.length > 0
                            || tk.type == KT.Brace && newTokens.length > 0) {
                            let endTokenIndex = i - 1;
                            let t = this.code.InsertToken(tks, KT.ColonVal, newTokens, beginTokenIndex, endTokenIndex, this);
                            return beginTokenIndex;
                        }
                        else if (tk.type == KT.Less) {
                            angleBracketIndex = 1;
                        }
                        newTokens.push(tk);
                    }
                } else {
                    if (tk.type == KT.Colon) {
                        if (this.skipIndex > 0) {
                            this.skipIndex--;
                            return bIndex + 1;
                        } else {
                            if (me.type == KT.Brace && (i == 1
                                || i == 2 && tks[0].type == KT.Enter
                            )) {
                                me.type = KT.Json;
                                me.handle = this;
                                //this.isJson = true;
                                return tks.length;
                            }
                            newTokens = [];
                            beginTokenIndex = i;
                        }
                    } else {
                        if (tk.type == KT.Case
                            || tk.type == KT.Default
                            || tk.type == KT.QuestionMark) {
                            this.skipIndex++;
                        }
                        return bIndex + 1;
                    }
                }
            }
            return -1;
        }

        public AfterExpress(me: Token, tks: Token[]) {
            if (me.type != KT.Json) {
                for (let i = tks.length - 1; i >= 0; i--) {
                    let tk = tks[i];
                    //这里的回车Enter要不要删掉，后面Enter好像也没什么用了
                    if (tk.type == KT.ColonVal || tk.type == KT.Enter) {
                        let preToken = tks[i - 1];
                        if (preToken) {
                            preToken.colon = tk;
                        }
                        tks.splice(i, 1);
                    }
                }
            }
            this.skipIndex = 0;
        }
    }
}