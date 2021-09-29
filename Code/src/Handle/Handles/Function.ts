namespace dmt {
    export class _Function extends Handle {
        public type = "...(...){}";

        public constructor(code: CodeHandle) {
            super(KT.Function, code);

            this.isValue = true;

            this.exp = [
                new Express(KT.Call, KT.Call),
                new Express(KT.Brace, KT.Brace)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let code = this.code;
            let val = function (...params: any[]) {
                return Call.CallFunction(tk, params, ctk, this, code); //这里的this，由Class.ts的_constructor.apply(this, arguments);进行传递
            };
            //val["__token__"] = tk;
            Object.defineProperty(val, "__token__", {
                value: tk,
                enumerable: false,
                configurable: false
            });
            if (a.tks.length > 0) {
                let funcName = a.tks[0].val;
                if (funcName) {
                    if (tk.get) {
                        Object.defineProperty(ps, funcName, {
                            get: val,
                            enumerable: true,
                            configurable: true
                        });
                    } else if (tk.set) {
                        Object.defineProperty(ps, funcName, {
                            set: val,
                            enumerable: true,
                            configurable: true
                        });
                    } else {
                        this.code.SetParmsValue(funcName, val, ctk, ps);
                    }
                }
            }
            return val;
        }
    }

    export class FunctionSymbol extends Handle {
        public type = "()=>{}";

        public constructor(code: CodeHandle) {
            super(KT.FunctionSymbol, code);

            this.exp = [
                new Express(KT.FunctionSymbol, KT.FunctionSymbol, [KT.AnyOne]),
                new Express(KT.Brace, KT.Brace)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            //let a = tk.tks[0];
            let code = this.code;
            let val = function (...params: any[]) {
                return Call.CallFunction(tk, params, ctk, this, code);//这里的this，由Class.ts的_constructor.apply(this, arguments);进行传递
            };
            //val["__token__"] = tk;
            Object.defineProperty(val, "__token__", {
                value: tk,
                enumerable: false,
                configurable: false
            });
            return val;
        }
    }

    export class FunctionAnonymous extends Handle {
        public type = "function(){}";

        public constructor(code: CodeHandle) {
            super(KT.FunctionAnonymous, code);
            this.enterType = KT.FunctionAnonymous;

            this.exp = [
                new Express(KT.FunctionAnonymous, (t, tks, index, express) => {
                    if (t.type == KT.Function) {
                        return ECT.OK;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.Brace, KT.Brace)];
        }

        public Exp(me: Token, tks: Token[], bIndex: number): number {
            return Express.Exps(tks, bIndex, this.exp, this.handleType, this, (t) => {
                t.tks[0] = t.tks[0].tks[0];
            });
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            //let a = tk.tks[0];
            let code = this.code;
            let val = function (...params: any[]) {
                return Call.CallFunction(tk, params, ctk, this, code);//这里的this，由Class.ts的_constructor.apply(this, arguments);进行传递
            };
            //val["__token__"] = tk;
            Object.defineProperty(val, "__token__", {
                value: tk,
                enumerable: false,
                configurable: false
            });
            return val;
        }
    }
}