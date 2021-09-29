namespace dmt {
    export class CodeHandle {
        private handles: Handle[];
        public handleKeys = {};
        public globalObject: any;
        public globalCode: Token[] = [];//全局对象，默认为window
        public debug: boolean = false;
        public autoBind: boolean = false;
        public static lastToken: Token;

        public constructor(globalObject: any = null, debug: boolean = false, autoBind: boolean = true) {
            if (!globalObject) {
                globalObject = window;
            }
            this.globalObject = globalObject;
            this.debug = debug;
            this.autoBind = autoBind;
            //https://blog.csdn.net/qq_33576343/article/details/82891208
            this.handles = [
                new Pairs(this),
                //new Declare(this),
                new HandleVariateEarly(this),

                new Colon(this),
                new PairsExtra(this),

                new HandleVariateSingle(this),

                new Handle19(this),
                new Handle19After(this),

                new HandleVariateLater(this),

                ////在19操作后面进行语意分析，因为19有一个...(...)的操作和很多操作会冲突
                new HandleStatement(this),
                new HandleAfterStatement(this),
                new Interface(this),
                new Abstract(this),
                new Class(this),
                new FunctionAnonymous(this),
                new FunctionSymbol(this),
                new _Function(this),
                new AngleBracketPair(this),
                ////
                //new Handle18(this),//new ...已经合并到New.ts了
                new Handle17(this),
                new Handle16(this),
                new Handle15(this),
                new Handle14(this),
                new Handle13(this),
                //new Handle12(this),                
                new Handle11(this),
                new Handle10(this),
                new Combine(this),
                new XOR(this),
                new InclusiveOr(this),
                new And(this),
                new Or(this),
                new QuestionMarkHandle(this),
                new Handle3(this),//这里是处理=,不能在这后面放代码
                //yield，yield*（非标准，已经废弃）
                //展开运算符（普通的空格）   
                new Json(this),
                new Comma(this),
                new Decorate(this),
            ];
        }

        public Run(tk: Token): any {
            this.Express(tk);
            let me = this.Initialize(tk.tks, tk, "");
            this.globalCode.push(me);
            let wx = window["wx"];
            //////////////////////////////
            if (this.globalObject) {
                for (let fi in me.ps) {
                    if (wx) {
                        if (fi != "wx" && fi != "canvas") {
                            this.globalObject[fi] = me.ps[fi];
                        }
                    } else {
                        this.globalObject[fi] = me.ps[fi];
                    }
                }
            }
            //////////////////////////////
            let val = this.CallPreConstructor(me, tk, me.ps);
            //////////////////////////////
            if (this.globalObject) {
                for (let fi in me.ps) {
                    if (wx) {
                        if (fi != "wx" && fi != "canvas") {
                            this.globalObject[fi] = me.ps[fi];
                        }
                    } else {
                        this.globalObject[fi] = me.ps[fi];
                    }
                }
            }
            return val;
        }

        public CallPreConstructor(me: Token, ctk: Token, ps: any): any {
            let tks = me.preConstructor.tks;
            let val: any;
            for (let i = 0, len = tks.length; i < len; i++) {
                let fi = tks[i];
                val = this.V(fi, me, ctk, ps);
                if (ctk.signal == KT.Return) {
                    break;
                }
            }
            return val;;
        }

        //ctk用来保存返回状态，比如return break continue
        public Initialize(tks: Token[], ctk: Token, name: string): Token {
            let me = new Token(KT.ClassInstance, Token.void0);

            let ps = {};
            ps = this.ComParams(ps, ps);
            me.ps = ps;
            me.tks = tks;

            me.preConstructor = new Token(KT.PreConstructor, Token.void0);
            me.preConstructor.tks = [];

            ctk = me;
            ctk.returnVal = Token.void0;
            ctk.signal = KT.None;

            for (let i = 0, len = tks.length; i < len; i++) {
                let fi = tks[i];
                fi.parent = me;
                if (!fi.static && fi.type != KT.SemiColon) {
                    if (fi.type == KT.Function
                        || fi.type == KT.Class
                        || fi.type == KT.Interface
                        || fi.type == KT.Abstract
                        || fi.type == KT.Declare) {
                        this.V(fi, me, ctk, ps);
                    } else {
                        me.preConstructor.tks.push(fi);
                    }
                }
            }
            return me;
        }

        //执行一个Token
        //Value        
        //tk:执行的token
        //caller"请求的token
        //ctk:状态保存，如return break continue
        //ps:请求的this
        //ps使用2个参数会更好，一个ps，另外一个继承的ps[]，这样就可以避免__proto__，__proto__只用在继承上会更好
        public V(tk: Token, caller: Token, ctk: Token, ps: Object, isPublic: boolean = true): any {
            let preToken = CodeHandle.lastToken;
            CodeHandle.lastToken = tk;
            let val = null;
            if (tk.handle) {
                val = tk.handle.V(tk, ctk, ps);
            } else {
                val = this.GetTokenValue(tk, ctk, ps, isPublic);
            }
            CodeHandle.lastToken = preToken;
            return val;
        }

        //获取Token的tks[0]部分
        //ValueA
        public VA(tk: Token, ctk: Token, ps: Object): any {
            if (tk.handle) {
                return tk.handle.ValueA(tk, ctk, ps);
            } else {
                return tk.val;
            }
        }

        public ValueParms(tk: Token, ctk: Token, ps: Object): any {
            if (tk.handle) {
                return tk.handle.ValueParms(tk, ctk, ps);
            } else {
                return this.GetTokenValue(tk, ctk, ps);
            }
        }

        public GetSuper(tk: Token, p: Object) {
            let topToken = this.GetTopToken(tk);
            let _this = this.GetThis(p);
            if (!_this.hasOwnProperty("__token__")) {
                _this = _this["__proto__"];
            }
            return this.DoGetSuper(topToken, _this);
        }

        private DoGetSuper(topToken: Token, _this: Object) {
            let thisToken = _this["__token__"];
            if (topToken == thisToken) {
                return _this["__proto__"];
            }
            if (!_this["__proto__"]) {
                return _this;
            }
            _this = _this["__proto__"];
            return this.DoGetSuper(topToken, _this);
        }

        public GetThis(p: Object) {
            if (p.hasOwnProperty("__this__")) {
                return p["__this__"];
            } else {
                return p;
            }
        }

        public GetTopToken(tk: Token) {
            if (tk.type == KT.ClassInstance) {
                return tk;
            }
            if (!tk.parent) {
                return tk;
            }
            return this.GetTopToken(tk.parent);
        }

        private GetTokenValue(tk: Token, ctk: Token, ps: Object, isPublic: boolean = true) {
            switch (tk.type) {
                case KT.ReservedWord:
                    {
                        return this.GetParmsValue(tk.val, ps, isPublic);
                    }
                case KT.This:
                    {
                        return this.GetThis(ps);
                    }
                case KT.Super:
                    {
                        return this.GetSuper(tk, ps);
                    }
                default: {
                    if (tk instanceof Token) {
                        return tk.val;
                    } else {
                        return tk;
                    }
                }
            }
        }

        public Express(tk: Token) {
            if (!tk) {
                return;
            }
            if (tk.expressed) {
                return;
            }
            if (tk.type != KT.Brace
                && tk.type != KT.Par
                && tk.type != KT.Bracket
                && tk.type != KT.Class
                && tk.type != KT.New) {
                return;
            }
            tk.expressed = true;
            let tks = tk.tks;
            if (!tks) {
                return;
            }
            if (tks.length == 0) {
                return;
            }
            let end = new Token(KT.End, Token.void0);
            tks.push(end);
            for (let i = 0, len = this.handles.length; i < len; i++) {
                let fi = this.handles[i];
                CodeHandle.lastToken = tk;
                this.ExpressOneHandle(tk, fi);
            }
            for (let i = tk.tks.length - 1; i >= 0; i--) {
                let t = tk.tks[i];
                t.parent = tk;
                //;不能删除
                if (t.type == KT.End || t.type == KT.Enter) {
                    tk.tks.splice(i, 1);
                }
            }
        }

        public ExpressOneHandle(tk: Token, handle: Handle) {
            let tks = tk.tks;

            let index = 0;
            let tryTimes = 0;
            while (true) {
                if (index >= tks.length || index < 0) {
                    break;
                }
                // if (tryTimes++ >= 999) {//TODO:
                //     break;
                // }
                index = handle.Exp(tk, tks, index);
            };
            handle.AfterExpress(tk, tks);
        }

        public GetParmsValue(key: any, ps: Object, isPublic: boolean = true): any {
            if (key instanceof Token) {
                key = key.val;
            }
            let val = this.GetParmsValueOne(ps, key);
            if (val !== Token.void0) {
                return val;
            }
            if (isPublic) {
                if (ps.hasOwnProperty("__this__")) {
                    ps = ps["__this__"];
                    let val = this.GetParmsValueOne(ps, key);
                    if (val !== Token.void0) {
                        return val;
                    }
                }
                // val = this.currentObject[key];
                // if (val !== Token.void0) {
                //     return val;
                // }
                return this.globalObject[key];
            }
            return Token.void0;
        }

        private GetParmsValueOne(p: Object, key: any): any {
            if (p == Token.void0) {
                CodeHandle.Info();
                throw new Error("Uncaught TypeError: Cannot read property '" + key + "' of " + p);
            }
            return p[key];
        }

        public SetParmsValue(key: string, val: any, ctk: Token, p: Object): any {
            p[key] = val;
        }

        public ComParams(p: Object, parent: Object) {
            if (parent.hasOwnProperty("__this__")) {
                //parent不是this
                //这鸟东西，居然性能不好
                // Object.defineProperty(p, "__this__", {
                //     value: parent["__this__"],
                //     enumerable: false,
                //     configurable: true
                // });
                p["__this__"] = parent["__this__"];
                p["__proto__"] = parent;
            } else {
                //parent是this
                //这鸟东西，居然性能不好
                // Object.defineProperty(p, "__this__", {
                //     value: parent,
                //     enumerable: false,
                //     configurable: true
                // });
                p["__this__"] = parent;
            }
            return p;
        }

        public InsertToken(tks: Token[], type: KT, newTokens: Token[], beginTokenIndex: number, endTokenIndex: number, handle: Handle, ps: Object = null): Token {
            let me = new Token(type, Token.void0);
            me.tks = newTokens;
            me.handle = handle;
            if (handle) {
                me.isValue = handle.isValue;
            }
            if (ps) {
                for (let fi in ps) {
                    me[fi] = ps[fi];
                }
            }
            newTokens.forEach((fi) => {
                fi.parent = me;
            });
            tks.splice(beginTokenIndex, endTokenIndex - beginTokenIndex + 1, me);

            return me;
        }

        public SplitToken(tks: Token[], splitType: KT): Token[][] {
            let list = [];
            let item: Token[] = [];
            for (let i = 0, len = tks.length; i < len; i++) {
                let tk = tks[i];
                if (tk.type == splitType) {
                    list.push(item);
                    item = [];
                } else {
                    item.push(tk);
                }
            }
            list.push(item);
            return list;
        }

        public static Info() {
            let tk = CodeHandle.lastToken;
            console.log(tk);
            let line = this.GetLine(tk);
            if (line) {
                console.log("\n" + "line: " + line.line + ", column: " + line.column + ", token: " + KT[line.type] + ", val: " + line.val, line);
            }
            let maxCount = 10;
            let traceCaller = (t: Token) => {
                if (t) {
                    if (t.callerToken) {
                        t = t.callerToken;
                        let line = this.GetLine(t);
                        if (!line) {
                            return;
                        }
                        console.log("\n" + "trace line: " + line.line + ", column: " + line.column + ", token: " + KT[t.type] + ", val: " + (t.val ? t.val : line.val), t);
                        maxCount--;
                        if (maxCount <= 0) {
                            return;
                        }
                    } else {
                        t = t.parent;
                    }
                    if (t) {
                        traceCaller(t);
                    }
                }
            };
            traceCaller(tk);
        }

        public static GetLine(tk: Token): Token {
            if (tk.line && tk.column) {
                return tk;
            }
            if (tk.tks) {
                for (let i = 0, len = tk.tks.length; i < len; i++) {
                    let t = tk.tks[i];
                    let val = CodeHandle.GetLine(t);
                    if (val) {
                        return val;
                    }
                }
            }
        }
    }
}