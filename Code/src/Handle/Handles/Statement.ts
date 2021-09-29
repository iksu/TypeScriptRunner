namespace dmt {
    export class Statement extends Handle {
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

    export class HandleStatement extends Statement {
        public constructor(code: CodeHandle) {
            super(code, [
                new Try(code),
                new Catch(code),
                new If(code),
                new ElseIf(code),
                new Else(code),
                new For(code),
                new While(code),
                // new Case(code),//暂时注释
                // new Default(code),//暂时注释
            ]);
        }
    }

    export class HandleAfterStatement extends Statement {
        public constructor(code: CodeHandle) {
            super(code, [
                new TryVal(code),
                new IfVal(code),
                //new Switch(code),//暂时注释
            ]);
        }
    }
}