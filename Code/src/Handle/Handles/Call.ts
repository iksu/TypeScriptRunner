namespace dmt {
    export class Call extends Handle {
        public type = "...(...)";

        public constructor(code: CodeHandle) {
            super(KT.Call, code);

            this.enterType = KT.Par;
            this.isValue = true;

            this.exp = [
                new Express(KT.Par, (t, tks, index, express) => {
                    if (t.type == KT.Par) {
                        return ECT.OK;
                    } else {
                        return ECT.Fail;
                    }
                }, [(t, express) => {
                    if (t && t.isValue) {
                        return ECT.OK;
                    } else {
                        return ECT.Fail;
                    }
                }])
            ];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let a = tk.tks[0];
            this.code.Express(a);
            let b = tk.tks[1];

            let func = null;
            let thisVal = null;

            if (a.type == KT.Super) {
                //super只能独立处理，不能统一处理，多重继承共享一个ps，所以不能放到ps中,
                //这里不能只调用constructor

                //这个不对，这个是直接调用constructor，但是会跳过$
                //let _super = this.code.GetSuper(ps);
                //let _extends = _super["constructor"];
                //let that = this.code.GetThis(ps);

                //这个是对的
                let that = this.code.GetThis(ps);
                let thisToken = that["__token__"];
                let curToken = that["__curToken__"];
                let _extends = that["__extends__"];

                //把extends赋值到下一个子类，在多重继承中需要顺延执行
                if (_extends["prototype"]["__token__"]) {
                    Object.defineProperty(that, "__extends__", {
                        value: _extends["prototype"]["__token__"]["extends"],
                        enumerable: false,
                        configurable: true
                    });
                } else {
                    Object.defineProperty(that, "__extends__", {
                        value: null,
                        enumerable: false,
                        configurable: true
                    });
                }
                Object.defineProperty(that, "__curToken__", {
                    value: _extends["__token__"],
                    enumerable: false,
                    configurable: true
                });

                //that["__extends__"] = _extends["prototype"]["__token__"]["extends"];

                // if (!_extends) {
                //     this.code.Error(tk, ctk, "There is no extends");
                // }
                func = _extends;
                thisVal = that;
                //执行super 4赋值父类的值 5执行父类初始化
                if (func["__token__"]) {
                    func["__token__"].AddDebugLine(tk);
                }
                Call.Call(func, thisVal, b, ctk, ps, this.code);

                //6赋值子类的值
                this.code.CallPreConstructor(curToken, ctk, that);

                func = null;//赋值为空，不让func重复执行

                //后面自动 7执行子类初始化
            } else {
                if (a.type == KT.Bracket) {
                    func = this.code.V(a.tks[0], tk, ctk, ps);
                    thisVal = this.code.VA(a.tks[0], ctk, ps);
                }
                else if (a.type == KT.PeriodKeyVal) {
                    func = this.code.V(a, tk, ctk, ps);
                    thisVal = this.code.VA(a, ctk, ps);
                } else {
                    func = this.code.V(a, tk, ctk, ps);
                    thisVal = ps;
                }
            }

            if (func) {
                if (func["__token__"]) {
                    func["__token__"].AddDebugLine(tk);
                }
                return Call.Call(func, thisVal, b, ctk, ps, this.code);
            }
        }

        //b(p); a.b(p); super.b(p); a.a.b(p);
        //func:需要执行的function
        //a:func执行绑定的a对象，需要从中取this
        //p:parms的token
        public static Call(func: any, thisVal: any, paramsToken: Token, ctk: Token, ps: Object, code: CodeHandle) {
            Call.HandleFunctionParms(paramsToken, code);
            let params = paramsToken.tks;

            if (func) {
                ///////////////
                // let thisVal = null;
                // if (a.type == KT.PeriodVal || a.type == KT.Bracket) {//TODO:PeriodVal
                //     thisVal = code.VA(a, ctk, ps);
                // } else {
                //     thisVal = code.V(a, ctk, ps);
                // }
                ///////////////                
                let psFunc = [];
                for (let i = 0, len = params.length; i < len; i++) {
                    let val = code.ValueParms(params[i], ctk, ps);
                    psFunc.push(val);
                }
                ///////////////
                if (thisVal instanceof Token) {
                    let nps = code.ComParams(thisVal.ps, ps);
                    thisVal = thisVal.ps;
                    //这里直接把function()=>{}和()=>{}的this指向改为一致了。在ts中this没必要指向自身
                    //let a={};a.b=()=>{this;};a.b();
                    //let a={};a.b=function(){this;};a.b();
                    return func.apply(nps, psFunc);
                }
                else {
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
                    //这里会出现调用外部对象，实现需要增加中间代理类，比如console.log
                    //如果是其他预言的解析，则直接Invoke就可以了
                    return func.apply(thisVal, psFunc);
                }
            } else {
                throw new Error("'Function' does not exist");
            }
        }

        public static CallFunction(func: Token, params: any[], ctk: Token, ps: any, code: CodeHandle): any {
            let funcOrig = func;
            let bindObject = {};

            let fcall = func.tks[0];

            //func有2种形式,function(){}和()=>{}，第一种是call Brace，第二种是Par => Brace
            if (fcall.type == KT.Call) {
                fcall = fcall.tks[fcall.tks.length - 1];
            }
            Call.HandleFunctionParms(fcall, code);
            let acceptParams = fcall.tks;
            if (!acceptParams) {
                acceptParams = [fcall];
            }

            let i = 0;
            let paramsParam = null;
            let acceptParamsLength = acceptParams.length;
            for (let len = params.length; i < len; i++) {
                //let val = code.Value(params[i], ctk, ps);
                let val = params[i];
                if (i < acceptParamsLength) {
                    //处理普通参数
                    let acceptParam = acceptParams[i];
                    let key = code.VA(acceptParam, ctk, ps);
                    if (acceptParam.type == KT.Params) {
                        //处理...参数
                        paramsParam = [val];
                        bindObject[key.val] = paramsParam;
                    } else {
                        bindObject[key] = val;
                    }
                } else {
                    if (paramsParam) {
                        paramsParam.push(val);
                    }
                }
            }

            let nps = code.ComParams(bindObject, ps);
            if (acceptParamsLength > 0) {
                for (let len = acceptParamsLength; i < len; i++) {
                    //处理默认参数
                    let p = acceptParams[i];
                    if (p.type == KT.ReservedWord) {
                        code.SetParmsValue(p.val, null, ctk, nps);
                    } else {
                        code.V(p, func, ctk, nps);
                    }
                }
            }

            func = func.tks[func.tks.length - 1];
            code.Express(func);

            //这里是callerToken的起点
            // if (bindObject) {
            //     if (bindObject instanceof Token) {
            //         ctk = bindObject;
            //     } else {
            //         ctk = bindObject["__token__"];
            //     }
            // }
            if (!ctk) {
                ctk = func;
            }
            ctk.returnVal = Token.void0;
            ctk.signal = KT.None;
            for (let i = 0, len = func.tks.length; i < len; i++) {
                let fi = func.tks[i];
                code.V(fi, funcOrig, ctk, nps);
                var signal = <any>ctk.signal;
                if (signal == KT.Return) {
                    ctk.signal = KT.None;
                    return ctk.returnVal;
                }
            }
        }

        public static HandleFunctionParms(tk: Token, code: CodeHandle) {
            if (!tk) {
                return;
            }
            if (tk.expressed) {
                return;
            }
            code.Express(tk);

            if (tk.tks) {
                for (let i = tk.tks.length - 1; i >= 0; i--) {
                    let t = tk.tks[i];
                    if (t.type == KT.End || t.type == KT.Enter) {
                        tk.tks.splice(i, 1);
                    }
                }
                if (tk.tks.length > 0) {
                    if (tk.tks[0].type == KT.Comma) {
                        tk.tks = tk.tks[0].tks;
                        tk.tks.forEach((fi) => {
                            fi.parent = tk;
                        });
                    }
                }
            }
        }
    }
}