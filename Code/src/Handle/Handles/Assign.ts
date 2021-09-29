namespace dmt {
    export class AssignBase extends Handle {
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
                    if (handle.exp) {
                        let v = handle.Exp(me, tks, i);
                        if (v) {
                            return v;
                        }
                    } else {
                        return Handle.ExpAB(tks, i, tk.type, this.handles[tk.name]);
                    }
                }
            }
            return -1;
        }
    }

    export class Handle17 extends AssignBase {
        public constructor(code: CodeHandle) {
            super(code, [
                new Increment(code),
                new Decrement(code),
            ]);
        }
    }

    export class Handle3 extends AssignBase {
        public constructor(code: CodeHandle) {
            super(code, [
                new Assign(code),
                new AssignPlus(code),
                new AssignMinus(code),
                new AssignMultiply(code),
                new AssignDivide(code),
                new AssignModulo(code),
                new AssignShi(code),
                new AssignShr(code),
                new AssignUnsignedShr(code)
            ]);
        }
    }

    export class Assign extends Handle {
        public type = "...=...";

        public constructor(code: CodeHandle) {
            super(KT.Assign, code);

            this.isValue = true;
        }

        public ValueA(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            return a.val;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let val = this.code.V(b, tk, ctk, ps);

            if (this.code.autoBind) {
                if (val instanceof Function) {
                    if (!val["__bind__"]) {
                        if (typeof val == "function") {
                            if (val["__token__"] && val["__token__"].type == KT.ClassInstance) {
                            } else {
                                if (a.tks &&
                                    a.tks[0] &&
                                    a.tks[0].tks &&
                                    a.tks[0].tks[1] &&
                                    a.tks[0].tks[1].tks &&
                                    a.tks[0].tks[1].tks[0] &&
                                    a.tks[0].tks[1].tks[0].val == "prototype") {
                                } else {
                                    val = val.bind(ps);
                                    Object.defineProperty(val, "__bind__", {
                                        value: true,
                                        enumerable: false,
                                        configurable: false
                                    });
                                }
                            }
                        }
                    }
                }
            }

            Assign.AssignValue(a, tk, val, ctk, ps, this.code);

            return val;
        }

        public static AssignValue(tk: Token, caller: Token, val: any, ctk: Token, ps: Object, code: CodeHandle) {
            // if (tk.handle && !tk.handle.isValue) {
            //     tk.handle.SetValue(tk, val, ctk, ps);
            // }
            // else
            if (tk.handle) {
                tk.handle.SetValue(tk, caller, val, ctk, ps);
            }
            else {
                let key = tk.val;
                let p = Assign.GetWhereIsKey(key, ps, ps);
                //let p = ps;
                code.SetParmsValue(key, val, ctk, p);
            }
        }

        public static GetWhereIsKey(key: string, ps: Object, root: Object) {
            if (ps.hasOwnProperty(key)) {
                return ps;
            }
            let proto = ps["__proto__"];
            if (proto) {
                return Assign.GetWhereIsKey(key, proto, root);
            }
            return root;
        }
    }

    export class AssignPlus extends Handle {
        public type = "...+=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignPlus, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval += bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class AssignMinus extends Handle {
        public type = "...-=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignMinus, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval -= bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class AssignMultiply extends Handle {
        public type = "...*=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignMultiply, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval *= bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class AssignDivide extends Handle {
        public type = ".../=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignDivide, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval /= bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class AssignModulo extends Handle {
        public type = "...%=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignModulo, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval %= bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class AssignShi extends Handle {
        public type = "...<<=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignShi, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval <<= bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class AssignShr extends Handle {
        public type = "...>>=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignShr, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval >>= bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class AssignUnsignedShr extends Handle {
        public type = "...>>>=...";

        public constructor(code: CodeHandle) {
            super(KT.AssignUnsignedShr, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];

            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            aval >>>= bval;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return aval;
        }
    }

    export class Increment extends Handle {
        public type = "...++";

        public constructor(code: CodeHandle) {
            super(KT.Increment, code);

            this.isValue = true;

            this.exp = [new Express(KT.Increment, (t, tks, index, express) => {
                if (t.type == KT.Increment) {
                    return ECT.OKSkip;
                } else {
                    return ECT.Fail;
                }
            }, [(t, exp) => {
                if (t && t.isValue) {
                    return ECT.OK;
                } else {
                    return ECT.Fail;
                }
            }])];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];

            let aval = this.code.V(a, tk, ctk, ps);
            let val = aval++;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return val;
        }
    }

    export class Decrement extends Handle {
        public type = "...--";

        public constructor(code: CodeHandle) {
            super(KT.Decrement, code);

            this.isValue = true;

            this.exp = [new Express(KT.Decrement, (t, tks, index, express) => {
                if (t.type == KT.Decrement) {
                    return ECT.OKSkip;
                } else {
                    return ECT.Fail;
                }
            }, [(t, exp) => {
                if (t && t.isValue) {
                    return ECT.OK;
                } else {
                    return ECT.Fail;
                }
            }])];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];

            let aval = this.code.V(a, tk, ctk, ps);
            let val = aval--;

            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);

            return val;
        }
    }
}