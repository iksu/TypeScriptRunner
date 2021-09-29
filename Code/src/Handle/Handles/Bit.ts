namespace dmt {
    export class Combine extends Handle {
        public type = "...&...";

        public constructor(code: CodeHandle) {
            super(KT.Combine, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a & b;
            };
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Handle.ExpAB(tks, bIndex, KT.Combine, this);
        }
    }

    export class XOR extends Handle {
        public type = "...^...";

        public constructor(code: CodeHandle) {
            super(KT.XOR, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a ^ b;
            };
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Handle.ExpAB(tks, bIndex, KT.XOR, this);
        }
    }

    export class InclusiveOr extends Handle {
        public type = "...|...";

        public constructor(code: CodeHandle) {
            super(KT.InclusiveOr, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a | b;
            };
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Handle.ExpAB(tks, bIndex, KT.InclusiveOr, this);
        }
    }

    export class And extends Handle {
        public type = "...&&...";

        public constructor(code: CodeHandle) {
            super(KT.And, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Token[]): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            let aval = this.code.V(a, tk, ctk, ps);
            if (!aval) {
                return false;
            }
            let bval = this.code.V(b, tk, ctk, ps);
            if (!bval) {
                return false;
            }
            return true;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Handle.ExpAB(tks, bIndex, KT.And, this);
        }
    }

    export class Or extends Handle {
        public type = "...||...";

        public constructor(code: CodeHandle) {
            super(KT.Or, code);

            this.isValue = true;
        }

        public V(tk: Token, ctk: Token, ps: Token[]): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            let aval = this.code.V(a, tk, ctk, ps);
            if (aval) {
                return true;
            }
            let bval = this.code.V(b, tk, ctk, ps);
            if (bval) {
                return true;
            }
            return false;
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Handle.ExpAB(tks, bIndex, KT.Or, this);
        }
    }
}