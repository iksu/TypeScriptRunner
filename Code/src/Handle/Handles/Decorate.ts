///<reference path="../Handle.ts" />
module dmt {
    export class DecorateHandle extends Handle {
        public handles: Object;

        protected constructor(code: CodeHandle, handles: Handle[]) {
            super(KT.None, code);

            this.handles = {};
            handles.forEach((fi) => {
                this.handles[fi.enterName] = fi;
            });
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            for (let i = tks.length - 1; i >= 0; i--) {
                let tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    let handle = <Handle>this.handles[tk.name];
                    if (handle.exp) {
                        let v = handle.Exp(me, tks, i);
                        if (v) {
                            return v;
                        }
                    } else {
                        let nextToken = tks[i + 1];
                        if (tk.type == KT.Static) {
                            nextToken.static = true;
                        } else if (tk.type == KT.Get) {
                            nextToken.get = true;
                        } else if (tk.type == KT.Set) {
                            nextToken.set = true;
                        } else {
                            nextToken.decorate = tk.type;
                        }
                        tks.splice(i, 1);
                    }
                }
            }
            return -1;
        }
    }

    export class Decorate extends DecorateHandle {
        public constructor(code: CodeHandle) {
            super(code, [
                new Public(code),
                new Protected(code),
                new Private(code),
                new Static(code),
                new Get(code),
                new Set(code),
                new Return(code),
                new Continue(code),
                new Break(code)
            ]);
        }
    }

    export class Public extends Handle {
        public type = "public ...";

        public constructor(code: CodeHandle) {
            super(KT.Public, code);
        }
    }

    export class Protected extends Handle {
        public type = "Protected ...";

        public constructor(code: CodeHandle) {
            super(KT.Protected, code);
        }
    }

    export class Private extends Handle {
        public type = "Private ...";

        public constructor(code: CodeHandle) {
            super(KT.Private, code);
        }
    }

    export class Static extends Handle {
        public type = "static ...";

        public constructor(code: CodeHandle) {
            super(KT.Static, code);
        }
    }

    export class Get extends Handle {
        public type = "get ...";

        public constructor(code: CodeHandle) {
            super(KT.Get, code);
        }
    }

    export class Set extends Handle {
        public type = "set ...";

        public constructor(code: CodeHandle) {
            super(KT.Set, code);
        }
    }
}