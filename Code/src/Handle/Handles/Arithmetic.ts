///<reference path="../Handle.ts" />
namespace dmt {
    export class Arithmetic extends Handle {
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

    export class Handle11 extends Arithmetic {
        public constructor(code: CodeHandle) {
            super(code, [
                new Less(code),
                new Greater(code),
                new LessOrEqual(code),
                new GreaterOrEqual(code),
                new Instanceof(code),
                new In(code)
            ]);
        }
    }

    export class Handle13 extends Arithmetic {
        public constructor(code: CodeHandle) {
            super(code, [
                new Plus(code),
                new Minus(code)
            ]);
        }
    }

    export class Handle14 extends Arithmetic {
        public constructor(code: CodeHandle) {
            super(code, [
                new Multiply(code),
                new Divide(code),
                new Modulo(code)
            ]);
        }
    }

    export class Handle15 extends Arithmetic {
        public constructor(code: CodeHandle) {
            super(code, [
                new Exponentiation(code)
            ]);
        }
    }

    export class Plus extends Handle {
        public type = "...+...";

        public constructor(code: CodeHandle) {
            super(KT.Plus, code);

            this.isValue = true;

            this.exp = [new Express(KT.Plus, (t, tks, index, express) => {
                if (t.type == KT.Plus) {
                    return ECT.OKSkip;
                }
                else {
                    return ECT.Fail;
                }
            }, [(t, exp) => {
                if (t && t.isValue) {
                    return ECT.OK;
                } else {
                    return ECT.OKStay;
                }
            }]), new Express(KT.AnyOne, KT.AnyOne)];

            this.vAbFunc = (a, b) => { 
                return a + b;
            };
        }
    }

    export class Minus extends Handle {
        public type = "...-...";

        public constructor(code: CodeHandle) {
            super(KT.Minus, code);

            this.isValue = true;

            this.exp = [new Express(KT.Minus, (t, tks, index, express) => {
                if (t.type == KT.Minus) {
                    return ECT.OKSkip;
                }
                else {
                    return ECT.Fail;
                }
            }, [(t, exp) => {
                if (t && t.isValue) {
                    return ECT.OK;
                } else {
                    return ECT.OKStay;
                }
            }]), new Express(KT.AnyOne, KT.AnyOne)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            let aval = this.code.V(a, tk, ctk, ps);
            let bval = this.code.V(b, tk, ctk, ps);
            if (b.type == KT.UnaryMinus) {
                return aval + bval;
            } else {
                return aval - bval;
            }
        }
    }

    export class Multiply extends Handle {
        public type = "...*...";

        public constructor(code: CodeHandle) {
            super(KT.Multiply, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a * b;
            };
        }
    }

    export class Divide extends Handle {
        public type = ".../...";

        public constructor(code: CodeHandle) {
            super(KT.Divide, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a / b;
            };
        }
    }

    export class Exponentiation extends Handle {
        public type = "...**...";

        public constructor(code: CodeHandle) {
            super(KT.Exponentiation, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a ** b;
            };
        }
    }

    export class Modulo extends Handle {
        public type = "...%...";

        public constructor(code: CodeHandle) {
            super(KT.Modulo, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a % b;
            };
        }
    }

    export class Less extends Handle {
        public type = "...<...";

        public constructor(code: CodeHandle) {
            super(KT.Less, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a < b;
            };
        }
    }

    export class Greater extends Handle {
        public type = "...>...";

        public constructor(code: CodeHandle) {
            super(KT.Greater, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a > b;
            };
        }
    }

    export class LessOrEqual extends Handle {
        public type = "...<=...";

        public constructor(code: CodeHandle) {
            super(KT.LessOrEqual, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a <= b;
            };
        }
    }

    export class GreaterOrEqual extends Handle {
        public type = "...>=...";

        public constructor(code: CodeHandle) {
            super(KT.GreaterOrEqual, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a >= b;
            };
        }
    }
}