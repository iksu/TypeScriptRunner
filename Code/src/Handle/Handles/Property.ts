namespace dmt {
    export class Property extends Handle {
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

    export class Handle19 extends Property {
        public constructor(code: CodeHandle) {
            super(code, [
                new New(code),
            ]);
        }
    }

    export class Handle19After extends Property {
        public constructor(code: CodeHandle) {
            super(code, [
                new Period(code),
                new Bracket(code),
                new Call(code),
            ]);
        }
    }

    export class Period extends Handle {
        public type = ".......";

        public constructor(code: CodeHandle) {
            super(KT.PeriodKeyVal, code);

            this.enterType = KT.PeriodVal;
            this.isValue = true;

            this.exp = [
                new Express(KT.PeriodVal, KT.PeriodVal, [(t, express) => {
                    if (t && t.isValue) {
                        return ECT.OK;
                    } else {
                        return ECT.Fail;
                    }
                }])];
        }

        public ValueA(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            if (a.type == KT.Super) {
                let that = this.code.GetThis(ps);
                return that;
            }
            else if (a.type == KT.This) {
                let that = this.code.GetThis(ps);
                return that;
            }
            let val = this.code.V(a, tk, ctk, ps);
            return val;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            b = b.tks[b.tks.length - 1];
            if (a.type == KT.Super) {
                let key = b.val;
                let $super = this.code.GetSuper(tk, ps);
                let val = $super[key];
                if (val == Token.void0) {
                    let that = this.code.GetThis(ps);
                    val = that[key];
                }
                return val;
            }
            else if (a.type == KT.This) {
                let key = b.val;
                let that = this.code.GetThis(ps);
                let val = that[key];
                return val;
            }
            else {
                let cls = this.code.V(a, tk, ctk, ps);
                //?????????????????????????????????????????????????????????
                let val = this.code.V(b, tk, ctk, cls, false);
                return val;
            }
        }

        public SetValue(tk: Token, caller: Token,  val: any, ctk: Token, ps: Object) {
            let a = tk.tks[0];
            let b = tk.tks[1];
            b = b.tks[b.tks.length - 1];

            if (a.type == KT.Super || a.type == KT.This) {
                let key = b.val;
                let that = this.code.GetThis(ps);
                that[key] = val;
            } else {
                let key = b.val;
                let cls = this.code.V(a, caller, ctk, ps);
                if (cls instanceof Token) {
                    this.code.SetParmsValue(key, val, ctk, cls);
                }
                else {
                    cls[key] = val;
                }
            }
        }
    }

    export class Bracket extends Handle {
        public type = "...[...]";

        public constructor(code: CodeHandle) {
            super(KT.Bracket, code);

            this.code = code;
            this.isValue = true;

            this.exp = [
                new Express(KT.Bracket, KT.Bracket, [(t, express) => {
                    if (t && t.isValue) {
                        return ECT.OK;
                    } else {
                        return ECT.Fail;
                    }
                }])
            ];
        }


        public ValueA(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            if (a.type == KT.Super) {
                let that = this.code.GetThis(ps);
                return that;
            }
            else if (a.type == KT.This) {
                let that = this.code.GetThis(ps);
                return that;
            }
            let val = this.code.V(a, tk, ctk, ps);
            return val;
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            let b = tk.tks[1];
            let keys = this.code.V(b, tk, ctk, ps);
            let key = keys[keys.length - 1];

            if (a.type == KT.Super) {
                let $super = this.code.GetSuper(tk, ps);
                let val = $super[key];
                if (val == Token.void0) {
                    let that = this.code.GetThis(ps);
                    val = that[key];
                }
                return val;
            }
            else if (a.type == KT.This) {
                let that = this.code.GetThis(ps);
                let val = that[key];
                return val;
            }
            else {
                //?????????.......???????????????????????????
                let cls = this.code.V(a, tk, ctk, ps);
                let val = this.code.GetParmsValue(key, cls, false);
                return val;
            }
        }

        public SetValue(tk: Token, caller: Token,  val: any, ctk: Token, ps: Object) {
            let a = tk.tks[0];
            let b = tk.tks[1];
            let keys = this.code.V(b, tk, ctk, ps);
            let key = keys[keys.length - 1];

            if (a.type == KT.Super || a.type == KT.This) {
                let that = this.code.GetThis(ps);//this???super????????????????????????????????????this????????????
                that[key] = val;
            }
            else {
                //?????????.......???????????????????????????
                let cls = this.code.V(a, caller, ctk, ps);
                if (cls instanceof Token) {
                    this.code.SetParmsValue(key, val, ctk, cls);
                } else {
                    cls[key] = val;
                }
                //this.code.SetParmsValue(key, val, ctk, cls);
            }
        }
    }
}