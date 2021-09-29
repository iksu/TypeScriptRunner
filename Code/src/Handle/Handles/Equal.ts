///<reference path="../Handle.ts" />
namespace dmt {
    export class EqualOpration extends Handle {
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
                    return Handle.ExpAB(tks, i, tk.type, this.handles[tk.name]);
                }
            }
            return -1;
        }
    }

    export class Handle10 extends EqualOpration {
        public constructor(code: CodeHandle) {
            super(code, [
                new Equal(code),
                new NotEqual(code),
                new AllEqual(code),
                new AllNotEqual(code)
            ]);
        }
    }

    export class Equal extends Handle {
        public type = "...==...";

        public constructor(code: CodeHandle) {
            super(KT.Equal, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a == b;
            };
        }
    }

    export class NotEqual extends Handle {
        public type = "...!=...";

        public constructor(code: CodeHandle) {
            super(KT.NotEqual, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a != b;
            };
        }
    }

    export class AllEqual extends Handle {
        public type = "...===...";

        public constructor(code: CodeHandle) {
            super(KT.AllEqual, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a === b;
            };
        }
    }

    export class AllNotEqual extends Handle {
        public type = "...!==...";

        public constructor(code: CodeHandle) {
            super(KT.AllNotEqual, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a !== b;
            };
        }
    }
}