namespace dmt {
    export class New extends Handle {
        public type = "new ...(...)";

        public constructor(code: CodeHandle) {
            super(KT.New, code);

            this.isValue = true;

            this.exp = [
                new Express(KT.New, (t, tks, index, express) => {
                    if (t.type == KT.New) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }),
                new Express(KT.Par, (t, tks, index, express) => {
                    if (t.type == KT.Par || t.type == KT.SemiColon) {
                        return ECT.OK
                    } else {
                        return ECT.OKStay;
                    }
                })];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            //处理参数
            if (!tk.expressed) {
                ClassVariate.DelAngleBracket(tk.tks, 0);
                this.code.Express(tk);
            }

            let _classVal = null;

            let a = null;
            let b = null;

            if (tk.tks[0].type == KT.Call) {
                //new Date();
                //new window.Date();
                a = tk.tks[0].tks[0];
                b = tk.tks[0].tks[1];
                _classVal = this.code.V(a, tk, ctk, ps);
            } else {
                //new Date;
                //new window.Date;
                a = tk.tks[0];
                b = null;
                _classVal = this.code.V(a, tk, ctk, ps);
            }

            ////////////////////////////////////
            let psFunc = [];
            if (b) {
                Call.HandleFunctionParms(b, this.code);
                let params = b.tks;
                for (let i = 0, len = params.length; i < len; i++) {
                    let val = this.code.ValueParms(params[i], ctk, ps);
                    psFunc.push(val);
                }
            }

            for (let i = 0, len = psFunc.length; i < len; i++) {
                let p = psFunc[i];
                if (p instanceof Function) {
                    if (!p["__bind__"]) {
                        //这里直接把function()=>{}和()=>{}的this指向改为一致了。在ts中this没必要指向自身
                        if (typeof p == "function") {
                            if (p["__token__"] && p["__token__"].type == KT.ClassInstance) {
                            } else {
                                p = p.bind(ps);//这个bind关键时刻还是发挥了一下
                                Object.defineProperty(p, "__bind__", {
                                    value: true,
                                    enumerable: false,
                                    configurable: false
                                });
                                psFunc[i] = p;
                            }
                        }
                    }
                }
            }
            ////////////////////////////////////


            //这里的_classVal返回的是Class.ts里的_class._class，可以直接被js进行识别

            //其他语言，使用下面的方法，但是不能兼容外部调用
            // let _constructor = _classVal._constructor;
            // if (_constructor) {
            //     try {
            //         _constructor.apply(_constructor, paramsFunc);
            //     } catch (ex) {
            //         this.code.Error(tk, ex.toString());
            //     }
            // }
            // return _classVal;

            //ƒ () { [native code] }无法使用apply
            //Date无法使用apply
            if (!_classVal) {
                CodeHandle.Info();
                throw new Error("Uncaught TypeError: " + a.val + " is not a constructor");
            }
            if (_classVal["__token__"]) {
                _classVal["__token__"].AddDebugLine(tk);
            }
            let len = psFunc.length;
            if (len == 0) {
                let me = new _classVal();
                return me;
            } else if (len == 1) {
                let me = new _classVal(psFunc[0]);
                return me;
            } else if (len == 2) {
                let me = new _classVal(psFunc[0], psFunc[1]);
                return me;
            } else if (len == 3) {
                let me = new _classVal(psFunc[0], psFunc[1], psFunc[2]);
                return me;
            } else if (len == 4) {
                let me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3]);
                return me;
            } else if (len == 5) {
                let me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4]);
                return me;
            } else if (len == 6) {
                let me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4], psFunc[5]);
                return me;
            } else if (len == 7) {
                let me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4], psFunc[5], psFunc[6]);
                return me;
            } else if (len == 8) {
                let me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4], psFunc[5], psFunc[6], psFunc[7]);
                return me;
            }
            else {
                let me = Object.create(_classVal.prototype);
                //初始化
                let val = _classVal.apply(me, psFunc);//这里是this的起源
                if (val) {
                    return val;
                }
                return me;
            }
        }
    }
}