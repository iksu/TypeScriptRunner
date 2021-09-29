namespace dmt {
    export class VariateSingle extends Handle {
        public handles: Object;

        public constructor(code: CodeHandle, handles: Handle[]) {
            super(KT.None, code);

            this.handles = {};
            handles.forEach((fi) => {
                this.handles[fi.enterName] = fi;
            });
        }

        private static expressList = {};

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            for (let i = bIndex, len = tks.length; i < len; i++) {
                let tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    let handle = <Handle>this.handles[tk.name];
                    if (handle.exp) {
                        let v = handle.Exp(me, tks, i);
                        if (v) {
                            return v;
                        }
                    } else {
                        let exp = VariateSingle.expressList[tk.type];
                        if (!exp) {
                            exp = [
                                new Express(tk.type, (t, tks, index, express) => {
                                    if (t.type == tk.type) {
                                        return ECT.OKSkip;
                                    } else {
                                        return ECT.Fail;
                                    }
                                }),
                                new Express(KT.AnyOne, KT.AnyOne)];
                            VariateSingle.expressList[tk.type] = exp;
                        }

                        let index = Express.Exps(tks, i, exp, tk.type, handle, (t) => {
                            t.val = t.tks[0].val;
                        });
                        return index;
                    }
                }
            }
            return -1;
        }

        public AfterExpress(me: Token, tks: Token[]) {
            for (var fi in this.handles) {
                this.handles[fi].AfterExpress(me, tks);
            }
        }
    }

    export class HandleVariateSingle extends VariateSingle {
        public constructor(code: CodeHandle) {
            super(code, [
                new VarVariate(code),
                new LetVariate(code),
                new ConstVariate(code),
                new FunctionVariate(code),
                new PeriodVariate(code),
                new ClassVariate(code),
                new InterfaceVariate(code),
                new AbstractVariate(code),
            ]);
        }
    }

    export class HandleVariateLater extends VariateSingle {
        public constructor(code: CodeHandle) {
            super(code, [
                new ExtendsVariate(code),
                new ImplementsVariate(code),
                new ParamsVariate(code),
                new AsVariate(code),
            ]);
        }
    }

    export class HandleVariateEarly extends VariateSingle {
        public constructor(code: CodeHandle) {
            super(code, [
                new CaseVariate(code),
                new DefaultVariate(code),
            ]);
        }
    }

    export class VarVariate extends Handle {
        public type = "var ...";

        public constructor(code: CodeHandle) {
            super(KT.Var, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            ps[tk.val] = undefined;
            return tk.val;
        }
    }

    export class LetVariate extends Handle {
        public type = "Let ...";

        public constructor(code: CodeHandle) {
            super(KT.Let, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            ps[tk.val] = undefined;
            return tk.val;
        }
    }

    export class ConstVariate extends Handle {
        public type = "const ...";

        public constructor(code: CodeHandle) {
            super(KT.Const, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            ps[tk.val] = undefined;
            return tk.val;
        }
    }

    export class ClassVariate extends Handle {
        public type = "class ...";

        public constructor(code: CodeHandle) {
            super(KT.Class, code);

            this.exp = [
                new Express(KT.Class, (t, tks, index, express) => {
                    if (t.type == KT.Class) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    if (t.type == KT.Brace) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.isParser = true;
            });
        }

        public AfterExpress(me: Token, tks: Token[]) {
            for (let i = 0, len = me.tks.length; i < len; i++) {
                let tk = tks[i];
                if (tk.type == KT.Class) {
                    if (tk.tks) {
                        ClassVariate.DelAngleBracket(tk.tks, 0);
                    } else {
                        //this.code.Error(tk, null, "Class is empty");
                    }
                }
            }
        }

        public static DelAngleBracket(tks: Token[], bIndex: number) {
            if (bIndex < 0) {
                return;
            }
            let inAngleBracket = false;
            let angleBracketIndex = 0;
            let beginTokenIndex = 0;

            for (let i = bIndex, len = tks.length; i < len; i++) {
                let tk = tks[i];
                if (inAngleBracket) {
                    if (tk.type == KT.Less) {
                        angleBracketIndex++;
                    }
                    else if (tk.type == KT.Greater) {
                        angleBracketIndex--;
                        if (angleBracketIndex <= 0) {
                            let endTokenIndex = i;
                            tks.splice(beginTokenIndex, endTokenIndex - beginTokenIndex + 1);
                            ClassVariate.DelAngleBracket(tks, beginTokenIndex + 1);
                            return;
                        }
                    }

                } else {
                    if (tk.type == KT.Less) {
                        beginTokenIndex = i;
                        inAngleBracket = true;
                        angleBracketIndex = 1;
                    }
                }
            }
        }
    }


    export class InterfaceVariate extends Handle {
        public type = "interface ...";

        public constructor(code: CodeHandle) {
            super(KT.Interface, code);

            this.exp = [
                new Express(KT.Interface, (t, tks, index, express) => {
                    if (t.type == KT.Interface) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    if (t.type == KT.Brace) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.isParser = true;
            });
        }

        public AfterExpress(me: Token, tks: Token[]) {
            for (let i = 0, len = me.tks.length; i < len; i++) {
                let tk = tks[i];
                if (tk.type == KT.Interface) {
                    if (tk.tks) {
                        ClassVariate.DelAngleBracket(tk.tks, 0);
                    } else {
                        //this.code.Error(tk, null, "Class is empty");
                    }
                }
            }
        }
    }

    export class AbstractVariate extends Handle {
        public type = "abstract ...";

        public constructor(code: CodeHandle) {
            super(KT.Abstract, code);

            this.exp = [
                new Express(KT.Abstract, (t, tks, index, express) => {
                    if (t.type == KT.Abstract) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    if (t.type == KT.Brace) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.isParser = true;
            });
        }

        public AfterExpress(me: Token, tks: Token[]) {
            for (let i = 0, len = me.tks.length; i < len; i++) {
                let tk = tks[i];
                if (tk.type == KT.Interface) {
                    if (tk.tks) {
                        ClassVariate.DelAngleBracket(tk.tks, 0);
                    } else {
                        //this.code.Error(tk, null, "Class is empty");
                    }
                }
            }
        }
    }

    export class PeriodVariate extends Handle {
        public type = "....";

        public constructor(code: CodeHandle) {
            super(KT.PeriodVal, code);

            this.enterType = KT.Period;

            this.isValue = true;

            this.exp = [
                new Express(KT.Period, (t, tks, index, express) => {
                    if (t.type == KT.Period) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, KT.AnyOne)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            let index = Express.Exps(tks, bIndex, this.exp, KT.PeriodVal, this, (t) => {
                t.isParser = true;
            });
            return index;
        }
    }

    export class FunctionVariate extends Handle {
        public type = "function ...";

        public constructor(code: CodeHandle) {
            super(KT.Function, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }
    }

    export class ExtendsVariate extends Handle {
        public type = "extends ...";

        public constructor(code: CodeHandle) {
            super(KT.Extends, code);
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return this.code.V(tk.tks[0], tk, ctk, ps);
        }
    }

    export class ImplementsVariate extends Handle {
        public type = "implements ...";

        public constructor(code: CodeHandle) {
            super(KT.Implements, code);
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }
    }

    export class ParamsVariate extends Handle {
        public type = "... ...";

        public constructor(code: CodeHandle) {
            super(KT.Params, code);
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }
    }

    export class CaseVariate extends Handle {
        public type = "case ...:";

        public constructor(code: CodeHandle) {
            super(KT.CaseVal, code);

            this.enterType = KT.Case;

            this.exp = [
                new Express(KT.Case, (t, tks, index, express) => {
                    if (t.type == KT.Case) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    if (t.type == KT.Colon) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.OKStay;
                    }
                }),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    return ECT.OKSkip;
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.isParser = true;
            });
        }
    }

    export class DefaultVariate extends Handle {
        public type = "default ...";

        public constructor(code: CodeHandle) {
            super(KT.DefaultVal, code);

            this.enterType = KT.Default;

            this.exp = [
                new Express(KT.Default, (t, tks, index, express) => {
                    if (t.type == KT.Default) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    if (t.type == KT.Colon) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.OKStay;
                    }
                }),
                new Express(KT.AnyOne, (t, tks, index, express) => {
                    return ECT.OKSkip;
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return tk.tks[0].val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.isParser = true;
            });
        }
    }
}