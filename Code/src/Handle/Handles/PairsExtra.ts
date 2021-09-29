namespace dmt {
    export class PairsExtraHandle extends Handle {
        public handles: Object;

        public constructor(code: CodeHandle, handles: Handle[]) {
            super(KT.None, code);

            this.handles = {};
            handles.forEach((fi) => {
                this.handles[fi.enterName] = fi;
            });
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            for (let i = bIndex, len = tks.length; i < len; i++) {
                let tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    let handle = <Handle>this.handles[tk.name];
                    let v = handle.Exp(me, tks, i);
                    if (v) {
                        return v;
                    }
                }
            }
            return -1;
        }
    }

    export class PairsExtra extends PairsHandle {
        public constructor(code: CodeHandle) {
            super(code, [
                new AssignUnsignedShrPair(code),
                new AssignShrPair(code),
                new GreaterOrEqualPair(code),
                new AssignShiPair(code),
                new LessOrEqualPair(code),
            ]);
        }
    }

    export class AssignUnsignedShrPair extends Handle {
        public type = ">>>=";

        public constructor(code: CodeHandle) {
            super(KT.AssignUnsignedShr, code);

            this.enterType = KT.UnsignedShr;

            this.exp = [
                new Express(KT.UnsignedShr, KT.UnsignedShr),
                new Express(KT.Assign, KT.Assign)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }

    export class AssignShrPair extends Handle {
        public type = ">>=";

        public constructor(code: CodeHandle) {
            super(KT.AssignShr, code);

            this.enterType = KT.Shr;

            this.exp = [
                new Express(KT.Shr, KT.Shr),
                new Express(KT.Assign, KT.Assign)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }

    export class GreaterOrEqualPair extends Handle {
        public type = ">=";

        public constructor(code: CodeHandle) {
            super(KT.GreaterOrEqual, code);

            this.enterType = KT.Greater;

            this.exp = [
                new Express(KT.Greater, KT.Greater),
                new Express(KT.Assign, KT.Assign)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }

    export class AssignShiPair extends Handle {
        public type = "<<=";

        public constructor(code: CodeHandle) {
            super(KT.AssignShi, code);

            this.enterType = KT.Shi;

            this.exp = [
                new Express(KT.Shi, KT.Shi),
                new Express(KT.Assign, KT.Assign)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }

    export class LessOrEqualPair extends Handle {
        public type = "<=";

        public constructor(code: CodeHandle) {
            super(KT.LessOrEqual, code);

            this.enterType = KT.Less;

            this.exp = [
                new Express(KT.Less, KT.Less),
                new Express(KT.Assign, KT.Assign)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }
}