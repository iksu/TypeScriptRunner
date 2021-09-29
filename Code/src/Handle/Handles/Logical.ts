namespace dmt {
    export class Logical extends Handle {
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
                        let exp = Logical.expressList[tk.type];
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
                            Logical.expressList[tk.type] = exp;
                        }
                        let index = Express.Exps(tks, i, exp, tk.type, handle);
                        return index;
                    }
                }
            }
            return -1;
        }
    }

    export class Handle16 extends Logical {
        public constructor(code: CodeHandle) {
            super(code, [
                new Not(code),
                new BitwiseNot(code),
                new UnaryPlus(code),
                new UnaryMinus(code),
                new UnaryIncrement(code),
                new UnaryDecrement(code),
                new TypeOf(code),
                new Void(code),
                new Delete(code),
                //new Await(code),//TODO:
                //new Async(code)//TODO:
            ]);
        }
    }

    export class Not extends Handle {
        public type = "!...";

        public constructor(code: CodeHandle) {
            super(KT.Not, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            return !this.code.V(a, tk, ctk, ps);
        }
    }

    export class BitwiseNot extends Handle {
        public type = "~...";

        public constructor(code: CodeHandle) {
            super(KT.BitwiseNot, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            return ~this.code.V(a, tk, ctk, ps);
        }
    }

    export class UnaryPlus extends Handle {
        public type = "+...";

        public constructor(code: CodeHandle) {
            super(KT.UnaryPlus, code);

            this.enterType = KT.Plus;
            this.isValue = true;

            this.exp = [new Express(KT.Plus, (t, tks, index, exp) => {
                let pt = tks[index - 1];
                if (t.type == KT.Plus && (!pt || !pt.isValue)) {
                    return ECT.OKSkip;
                } else {
                    return ECT.Fail;
                }
            }), new Express(KT.AnyOne, KT.AnyOne)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let val = this.code.V(a, tk, ctk, ps);
            val = +val;
            return val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }

    export class UnaryMinus extends Handle {
        public type = "-...";

        public constructor(code: CodeHandle) {
            super(KT.UnaryMinus, code);

            this.enterType = KT.Minus;
            this.isValue = true;

            this.exp = [new Express(KT.Minus, (t, tks, index, exp) => {
                let pt = tks[index - 1];
                if (t.type == KT.Minus && (!pt || !pt.isValue)) {
                    return ECT.OKSkip;
                } else {
                    return ECT.Fail;
                }
            }), new Express(KT.AnyOne, KT.AnyOne)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let val = this.code.V(a, tk, ctk, ps);
            val = -val;
            return val;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (tk: Token) => {
                tk.isParser = true;
            });
        }
    }

    export class UnaryIncrement extends Handle {
        public type = "++...";

        public constructor(code: CodeHandle) {
            super(KT.UnaryIncrement, code);

            this.enterType = KT.Increment;
            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];

            let aval = this.code.V(a, tk, ctk, ps);
            let val = ++aval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return val;
        }
    }

    export class UnaryDecrement extends Handle {
        public type = "--...";

        public constructor(code: CodeHandle) {
            super(KT.UnaryDecrement, code);

            this.enterType = KT.Decrement;
            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];

            let aval = this.code.V(a, tk, ctk, ps);
            let val = --aval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return val;
        }
    }

    export class TypeOf extends Handle {
        public type = "typeof ...";

        public constructor(code: CodeHandle) {
            super(KT.Typeof, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let val = this.code.V(a, tk, ctk, ps);
            return typeof val;
        }
    }

    export class Void extends Handle {
        public type = "void ...";

        public constructor(code: CodeHandle) {
            super(KT.Void, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let val = this.code.V(a, tk, ctk, ps);
            return void val;
        }
    }

    export class Delete extends Handle {
        public type = "delete ...";

        public constructor(code: CodeHandle) {
            super(KT.Delete, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0].tks[0];
            let b = tk.tks[0].tks[1];
            let val = this.code.V(a, tk, ctk, ps);
            if (b.type == KT.PeriodVal) {
                let key = this.code.V(b, tk, ctk, ps);
                return delete val[key];
            } else if (b.type == KT.Bracket) {
                let key = this.code.V(b.tks[0], tk, ctk, ps);
                return delete val[key];
            } else {
                let key = b.val;
                return delete val[key];
            }

        }
    }
}