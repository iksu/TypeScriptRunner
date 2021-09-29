var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var dmt;
(function (dmt) {
    var Handle = (function () {
        function Handle(handleType, code) {
            this.handleType = handleType;
            this.enterType = handleType;
            this.code = code;
            // if (this.code.handleKeys[this.enterName]) {
            //     console.log(this.enterName);
            // }
            this.code.handleKeys[handleType] = this;
        }
        Object.defineProperty(Handle.prototype, "enterType", {
            set: function (val) {
                this.enterName = dmt.KT[val];
            },
            enumerable: true,
            configurable: true
        });
        ;
        //tk:token
        //ctk:ctk
        Handle.prototype.V = function (tk, ctk, ps) {
            if (this.vAbFunc) {
                var a = this.code.V(tk.tks[0], tk, ctk, ps);
                var b = this.code.V(tk.tks[1], tk, ctk, ps);
                return this.vAbFunc(a, b);
            }
            return tk.val;
        };
        //如果a.b要获得a的部分
        Handle.prototype.ValueA = function (tk, ctk, ps) {
            return tk;
        };
        Handle.prototype.ValueParms = function (tk, ctk, ps) {
            return this.V(tk, ctk, ps);
        };
        Handle.prototype.SetValue = function (tk, caller, val, ctk, ps) {
            var key = this.code.V(tk, caller, ctk, ps);
            this.code.SetParmsValue(key, val, ctk, ps);
        };
        //Express
        Handle.prototype.Exp = function (me, tks, bIndex) {
            var index = dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this);
            return index;
        };
        Handle.prototype.AfterExpress = function (tk, tks) {
        };
        //ExpressAB
        Handle.ExpAB = function (tks, bIndex, type, handle) {
            var exp = Handle.expressABList[type];
            if (!exp) {
                exp = [new dmt.Express(type, function (t, tks, index, express) {
                        if (t.type == type) {
                            return dmt.ECT.OKSkip;
                        }
                        else {
                            return dmt.ECT.Fail;
                        }
                    }, [dmt.KT.AnyOne]),
                    new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)];
                Handle.expressABList[type] = exp;
            }
            return dmt.Express.Exps(tks, bIndex, exp, type, handle);
        };
        Handle.expressABList = {};
        return Handle;
    }());
    dmt.Handle = Handle;
    __reflect(Handle.prototype, "dmt.Handle");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var PairsHandle = (function (_super) {
        __extends(PairsHandle, _super);
        function PairsHandle(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        PairsHandle.prototype.Exp = function (me, tks, bIndex) {
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    var handle = this.handles[tk.name];
                    var v = handle.Exp(me, tks, i);
                    if (v) {
                        return v;
                    }
                }
            }
            return -1;
        };
        return PairsHandle;
    }(dmt.Handle));
    dmt.PairsHandle = PairsHandle;
    __reflect(PairsHandle.prototype, "dmt.PairsHandle");
    var Pairs = (function (_super) {
        __extends(Pairs, _super);
        function Pairs(code) {
            return _super.call(this, code, [
                new ParPair(code),
                new BracePair(code),
                new BracketPair(code),
                new ElseIfPair(code)
            ]) || this;
        }
        return Pairs;
    }(PairsHandle));
    dmt.Pairs = Pairs;
    __reflect(Pairs.prototype, "dmt.Pairs");
    var ParPair = (function (_super) {
        __extends(ParPair, _super);
        function ParPair(code) {
            var _this = _super.call(this, dmt.KT.Par, code) || this;
            _this.type = "(...)";
            _this.enterType = dmt.KT.LeftPar;
            _this.isValue = true;
            return _this;
        }
        ParPair.prototype.V = function (tk, ctk, ps) {
            this.code.Express(tk);
            var tks = tk.tks;
            for (var i = tk.tks.length - 1; i >= 0; i--) {
                var t = tk.tks[i];
                if (t.type == dmt.KT.End || t.type == dmt.KT.Enter) {
                    tk.tks.splice(i, 1);
                }
            }
            var val;
            for (var i = 0, len = tks.length; i < len; i++) {
                var fi = tks[i];
                if (fi.type != dmt.KT.SemiColon) {
                    val = this.code.V(fi, tk, ctk, ps);
                }
            }
            return val;
        };
        ParPair.prototype.Exp = function (me, tks, bIndex) {
            var _this = this;
            return dmt.Express.ExpressPairs(tks, bIndex, new dmt.Express(dmt.KT.Par, dmt.KT.LeftPar, null, dmt.KT.RightPar), this, function (tk) {
                tk.isParser = true;
                tk.handle = _this;
            });
        };
        return ParPair;
    }(dmt.Handle));
    dmt.ParPair = ParPair;
    __reflect(ParPair.prototype, "dmt.ParPair");
    var BracePair = (function (_super) {
        __extends(BracePair, _super);
        function BracePair(code) {
            var _this = _super.call(this, dmt.KT.Brace, code) || this;
            _this.type = "{...}";
            _this.enterType = dmt.KT.LeftBrace;
            _this.isValue = true;
            return _this;
        }
        BracePair.prototype.V = function (tk, ctk, ps) {
            this.code.Express(tk);
            if (tk.tks.length == 0) {
                tk.type = dmt.KT.Json;
            }
            if (tk.type == dmt.KT.Json) {
                return BracePair.HandleBraceJson(tk, this.code, ctk, ps);
            }
            else {
                var tks = tk.tks;
                for (var i = 0, len = tks.length; i < len; i++) {
                    if (ctk.signal == dmt.KT.None) {
                        var fi = tks[i];
                        if (!fi.static && fi.type != dmt.KT.SemiColon) {
                            this.code.V(fi, tk, ctk, ps);
                        }
                    }
                }
                return tk;
            }
        };
        BracePair.prototype.Exp = function (me, tks, bIndex) {
            var _this = this;
            return dmt.Express.ExpressPairs(tks, bIndex, new dmt.Express(dmt.KT.Brace, dmt.KT.LeftBrace, null, dmt.KT.RightBrace), this, function (tk) {
                tk.handle = _this;
            });
        };
        BracePair.HandleBraceJson = function (tk, code, ctk, ps) {
            if (!tk) {
                return;
            }
            for (var i = tk.tks.length - 1; i >= 0; i--) {
                var t = tk.tks[i];
                if (t.type == dmt.KT.End || t.type == dmt.KT.Enter || t.type == dmt.KT.Comma) {
                    tk.tks.splice(i, 1);
                }
            }
            // if (!tk.ps) {
            //    
            // }
            //let nps = code.ComParams(tk.ps, ps);
            var nps = {};
            nps = code.ComParams(nps, ps);
            Object.defineProperty(ps, "__json__", {
                value: 1,
                enumerable: false,
                configurable: false
            });
            for (var i = 0, len = tk.tks.length; i < len; i++) {
                var t = tk.tks[i];
                if (t.type == dmt.KT.JsonVal) {
                    var a = t.tks[0];
                    var b = t.tks[1];
                    if (a && b) {
                        var key = a.val;
                        if (key == dmt.Token.void0) {
                            key = a.name.toLowerCase(); //key值是关键词
                        }
                        var val = code.V(b, tk, ctk, nps);
                        if (code.autoBind) {
                            if (val instanceof Function) {
                                if (!val["__bind__"]) {
                                    //这里直接把function()=>{}和()=>{}的this指向改为一致了。在ts中this没必要指向自身
                                    if (typeof val == "function") {
                                        if (val["__token__"] && val["__token__"].type == dmt.KT.ClassInstance) {
                                        }
                                        else {
                                            val = val.bind(ps);
                                            Object.defineProperty(val, "__bind__", {
                                                value: true,
                                                enumerable: false,
                                                configurable: false
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        code.SetParmsValue(key, val, ctk, nps);
                    }
                }
            }
            return nps;
        };
        return BracePair;
    }(dmt.Handle));
    dmt.BracePair = BracePair;
    __reflect(BracePair.prototype, "dmt.BracePair");
    var BracketPair = (function (_super) {
        __extends(BracketPair, _super);
        function BracketPair(code) {
            var _this = _super.call(this, dmt.KT.Bracket, code) || this;
            _this.type = "[...]";
            _this.enterType = dmt.KT.LeftBracket;
            _this.isValue = true;
            return _this;
        }
        BracketPair.prototype.V = function (tk, ctk, ps) {
            this.code.Express(tk);
            var arr = [];
            var tks = tk.tks;
            for (var i = 0, len = tks.length; i < len; i++) {
                var fi = tks[i];
                if (fi.type == dmt.KT.Comma) {
                    for (var j = 0, jlen = fi.tks.length; j < jlen; j++) {
                        arr.push(this.code.V(fi.tks[j], tk, ctk, ps));
                    }
                }
                else {
                    arr.push(this.code.V(fi, tk, ctk, ps));
                }
            }
            return arr;
        };
        BracketPair.prototype.Exp = function (me, tks, bIndex) {
            var _this = this;
            return dmt.Express.ExpressPairs(tks, bIndex, new dmt.Express(dmt.KT.Bracket, dmt.KT.LeftBracket, null, dmt.KT.RightBracket), this, function (tk) {
                tk.isParser = true;
                tk.handle = _this;
            });
        };
        return BracketPair;
    }(dmt.Handle));
    dmt.BracketPair = BracketPair;
    __reflect(BracketPair.prototype, "dmt.BracketPair");
    var ElseIfPair = (function (_super) {
        __extends(ElseIfPair, _super);
        function ElseIfPair(code) {
            var _this = _super.call(this, dmt.KT.ElseIf, code) || this;
            _this.type = "else if";
            _this.enterType = dmt.KT.Else;
            _this.exp = [
                new dmt.Express(dmt.KT.Else, dmt.KT.Else),
                new dmt.Express(dmt.KT.If, dmt.KT.If)
            ];
            return _this;
        }
        ElseIfPair.prototype.V = function (tk, ctk, ps) {
            return tk;
        };
        ElseIfPair.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return ElseIfPair;
    }(dmt.Handle));
    dmt.ElseIfPair = ElseIfPair;
    __reflect(ElseIfPair.prototype, "dmt.ElseIfPair");
    var AngleBracketPair = (function (_super) {
        __extends(AngleBracketPair, _super);
        function AngleBracketPair(code) {
            var _this = _super.call(this, dmt.KT.AngleBracket, code) || this;
            _this.type = "<...>";
            _this.enterType = dmt.KT.Less;
            _this.exp = [new dmt.Express(dmt.KT.Less, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Less) {
                        var pt = tks[index - 1];
                        if (!pt || !pt.isValue) {
                            return dmt.ECT.OK;
                        }
                    }
                    return dmt.ECT.Fail;
                }), new dmt.Express(dmt.KT.Greater, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Greater) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })];
            return _this;
            //, new Express(KT.Greater, KT.Greater)
        }
        AngleBracketPair.prototype.AfterExpress = function (me, tks) {
            for (var i = tks.length - 1; i >= 0; i--) {
                var tk = tks[i];
                if (tk.type == dmt.KT.AngleBracket) {
                    tks.splice(i, 1);
                }
            }
        };
        return AngleBracketPair;
    }(dmt.Handle));
    dmt.AngleBracketPair = AngleBracketPair;
    __reflect(AngleBracketPair.prototype, "dmt.AngleBracketPair");
})(dmt || (dmt = {}));
///<reference path="Token.ts" />
var dmt;
(function (dmt) {
    var Parser = (function () {
        function Parser(type, key) {
            this.autoAddVal = false;
            this.type = type;
            this.name = dmt.KT[type];
            this.key = key;
            if (this.key.length > 1) {
                this.waitForChar = this.key.substr(this.key.length - 1, 1);
                this.preParserChar = this.key.substr(0, this.key.length - 1);
            }
        }
        Parser.prototype.SetWaitForParser = function (parsers) {
            var _this = this;
            parsers.forEach(function (fi) {
                if (fi.preParserChar == _this.key) {
                    if (!_this.waitForParsers) {
                        _this.waitForParsers = [];
                    }
                    _this.waitForParsers.push(fi);
                }
            });
        };
        Parser.prototype.Reset = function () {
        };
        Parser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (this.waitForParsers) {
                for (var i = 0, len = this.waitForParsers.length; i < len; i++) {
                    var nextParser = this.waitForParsers[i];
                    if (nextParser.waitForChar == char) {
                        return nextParser;
                    }
                }
            }
            var tk = new dmt.Token(this.type, dmt.Token.void0); //this.key
            tk.isParser = true;
            tk.line = line;
            tk.column = column;
            tks.push(tk);
            return null;
        };
        Parser.prototype.WillAcceptStart = function (char) {
            return false;
        };
        return Parser;
    }());
    dmt.Parser = Parser;
    __reflect(Parser.prototype, "dmt.Parser");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var For = (function (_super) {
        __extends(For, _super);
        function For(code) {
            var _this = _super.call(this, dmt.KT.For, code) || this;
            _this.type = "for(...){...}";
            _this.exp = [
                new dmt.Express(dmt.KT.For, function (t, tks, index, exp) {
                    if (t.type == dmt.KT.For) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Par, dmt.KT.Par),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        For.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            this.code.Express(a);
            this.code.Express(b);
            var as = this.code.SplitToken(a.tks, dmt.KT.SemiColon);
            if (as.length > 0 && as[0].length > 0 && as[0][0].type == dmt.KT.In) {
                var ain = as[0][0];
                var aval = this.code.V(ain.tks[0], tk, ctk, ps);
                var bval = this.code.V(ain.tks[1], tk, ctk, ps);
                if (bval instanceof dmt.Token) {
                    bval = bval.ps;
                }
                var p = {};
                var nps = this.code.ComParams(p, ps);
                var isJson = bval.hasOwnProperty("__json__");
                if (typeof bval == "string") {
                    for (var i = 0, len = bval.length; i < len; i++) {
                        var fi = bval.charAt(i);
                        p[aval] = fi;
                        this.code.V(b, tk, ctk, nps);
                        if (ctk.signal == dmt.KT.Continue) {
                            ctk.signal = dmt.KT.None;
                            continue;
                        }
                        else if (ctk.signal == dmt.KT.Break) {
                            ctk.signal = dmt.KT.None;
                            break;
                        }
                        else if (ctk.signal == dmt.KT.Return) {
                            return null;
                        }
                    }
                }
                else {
                    var keys = Object.keys(bval);
                    for (var i = 0, len = keys.length; i < len; i++) {
                        var fi = keys[i];
                        //for (let fi in Object.keys(bval)) {//这里默认增加了Object.keys
                        if (isJson) {
                            if (!bval.hasOwnProperty(fi)) {
                                continue;
                            }
                        }
                        if (fi.length > 2 && fi.substr(0, 2) == "__") {
                            continue;
                        }
                        p[aval] = fi;
                        this.code.V(b, tk, ctk, nps);
                        if (ctk.signal == dmt.KT.Continue) {
                            ctk.signal = dmt.KT.None;
                            continue;
                        }
                        else if (ctk.signal == dmt.KT.Break) {
                            ctk.signal = dmt.KT.None;
                            break;
                        }
                        else if (ctk.signal == dmt.KT.Return) {
                            return null;
                        }
                    }
                }
            }
            else if (as.length < 3) {
                throw new Error("'For' need 3 elements");
            }
            else {
                var asNew = as.map(function (fi) { return fi[0]; });
                for ((asNew[0] ? this.code.V(asNew[0], tk, ctk, ps) : true); (asNew[1] ? this.code.V(asNew[1], tk, ctk, ps) : true); (asNew[2] ? this.code.V(asNew[2], tk, ctk, ps) : true)) {
                    this.code.V(b, tk, ctk, ps);
                    if (ctk.signal == dmt.KT.Continue) {
                        ctk.signal = dmt.KT.None;
                        continue;
                    }
                    else if (ctk.signal == dmt.KT.Break) {
                        ctk.signal = dmt.KT.None;
                        break;
                    }
                    else if (ctk.signal == dmt.KT.Return) {
                        return null;
                    }
                }
            }
            return null;
        };
        return For;
    }(dmt.Handle));
    dmt.For = For;
    __reflect(For.prototype, "dmt.For");
})(dmt || (dmt = {}));
///<reference path="../Handle.ts" />
var dmt;
(function (dmt) {
    var Arithmetic = (function (_super) {
        __extends(Arithmetic, _super);
        function Arithmetic(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        Arithmetic.prototype.Exp = function (me, tks, bIndex) {
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    var handle = this.handles[tk.name];
                    if (handle.exp) {
                        var v = handle.Exp(me, tks, i);
                        if (v) {
                            return v;
                        }
                    }
                    else {
                        return dmt.Handle.ExpAB(tks, i, tk.type, this.handles[tk.name]);
                    }
                }
            }
            return -1;
        };
        return Arithmetic;
    }(dmt.Handle));
    dmt.Arithmetic = Arithmetic;
    __reflect(Arithmetic.prototype, "dmt.Arithmetic");
    var Handle11 = (function (_super) {
        __extends(Handle11, _super);
        function Handle11(code) {
            return _super.call(this, code, [
                new Less(code),
                new Greater(code),
                new LessOrEqual(code),
                new GreaterOrEqual(code),
                new dmt.Instanceof(code),
                new dmt.In(code)
            ]) || this;
        }
        return Handle11;
    }(Arithmetic));
    dmt.Handle11 = Handle11;
    __reflect(Handle11.prototype, "dmt.Handle11");
    var Handle13 = (function (_super) {
        __extends(Handle13, _super);
        function Handle13(code) {
            return _super.call(this, code, [
                new Plus(code),
                new Minus(code)
            ]) || this;
        }
        return Handle13;
    }(Arithmetic));
    dmt.Handle13 = Handle13;
    __reflect(Handle13.prototype, "dmt.Handle13");
    var Handle14 = (function (_super) {
        __extends(Handle14, _super);
        function Handle14(code) {
            return _super.call(this, code, [
                new Multiply(code),
                new Divide(code),
                new Modulo(code)
            ]) || this;
        }
        return Handle14;
    }(Arithmetic));
    dmt.Handle14 = Handle14;
    __reflect(Handle14.prototype, "dmt.Handle14");
    var Handle15 = (function (_super) {
        __extends(Handle15, _super);
        function Handle15(code) {
            return _super.call(this, code, [
                new Exponentiation(code)
            ]) || this;
        }
        return Handle15;
    }(Arithmetic));
    dmt.Handle15 = Handle15;
    __reflect(Handle15.prototype, "dmt.Handle15");
    var Plus = (function (_super) {
        __extends(Plus, _super);
        function Plus(code) {
            var _this = _super.call(this, dmt.KT.Plus, code) || this;
            _this.type = "...+...";
            _this.isValue = true;
            _this.exp = [new dmt.Express(dmt.KT.Plus, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Plus) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [function (t, exp) {
                        if (t && t.isValue) {
                            return dmt.ECT.OK;
                        }
                        else {
                            return dmt.ECT.OKStay;
                        }
                    }]), new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)];
            _this.vAbFunc = function (a, b) {
                return a + b;
            };
            return _this;
        }
        return Plus;
    }(dmt.Handle));
    dmt.Plus = Plus;
    __reflect(Plus.prototype, "dmt.Plus");
    var Minus = (function (_super) {
        __extends(Minus, _super);
        function Minus(code) {
            var _this = _super.call(this, dmt.KT.Minus, code) || this;
            _this.type = "...-...";
            _this.isValue = true;
            _this.exp = [new dmt.Express(dmt.KT.Minus, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Minus) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [function (t, exp) {
                        if (t && t.isValue) {
                            return dmt.ECT.OK;
                        }
                        else {
                            return dmt.ECT.OKStay;
                        }
                    }]), new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)];
            return _this;
        }
        Minus.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            if (b.type == dmt.KT.UnaryMinus) {
                return aval + bval;
            }
            else {
                return aval - bval;
            }
        };
        return Minus;
    }(dmt.Handle));
    dmt.Minus = Minus;
    __reflect(Minus.prototype, "dmt.Minus");
    var Multiply = (function (_super) {
        __extends(Multiply, _super);
        function Multiply(code) {
            var _this = _super.call(this, dmt.KT.Multiply, code) || this;
            _this.type = "...*...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a * b;
            };
            return _this;
        }
        return Multiply;
    }(dmt.Handle));
    dmt.Multiply = Multiply;
    __reflect(Multiply.prototype, "dmt.Multiply");
    var Divide = (function (_super) {
        __extends(Divide, _super);
        function Divide(code) {
            var _this = _super.call(this, dmt.KT.Divide, code) || this;
            _this.type = ".../...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a / b;
            };
            return _this;
        }
        return Divide;
    }(dmt.Handle));
    dmt.Divide = Divide;
    __reflect(Divide.prototype, "dmt.Divide");
    var Exponentiation = (function (_super) {
        __extends(Exponentiation, _super);
        function Exponentiation(code) {
            var _this = _super.call(this, dmt.KT.Exponentiation, code) || this;
            _this.type = "...**...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return Math.pow(a, b);
            };
            return _this;
        }
        return Exponentiation;
    }(dmt.Handle));
    dmt.Exponentiation = Exponentiation;
    __reflect(Exponentiation.prototype, "dmt.Exponentiation");
    var Modulo = (function (_super) {
        __extends(Modulo, _super);
        function Modulo(code) {
            var _this = _super.call(this, dmt.KT.Modulo, code) || this;
            _this.type = "...%...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a % b;
            };
            return _this;
        }
        return Modulo;
    }(dmt.Handle));
    dmt.Modulo = Modulo;
    __reflect(Modulo.prototype, "dmt.Modulo");
    var Less = (function (_super) {
        __extends(Less, _super);
        function Less(code) {
            var _this = _super.call(this, dmt.KT.Less, code) || this;
            _this.type = "...<...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a < b;
            };
            return _this;
        }
        return Less;
    }(dmt.Handle));
    dmt.Less = Less;
    __reflect(Less.prototype, "dmt.Less");
    var Greater = (function (_super) {
        __extends(Greater, _super);
        function Greater(code) {
            var _this = _super.call(this, dmt.KT.Greater, code) || this;
            _this.type = "...>...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a > b;
            };
            return _this;
        }
        return Greater;
    }(dmt.Handle));
    dmt.Greater = Greater;
    __reflect(Greater.prototype, "dmt.Greater");
    var LessOrEqual = (function (_super) {
        __extends(LessOrEqual, _super);
        function LessOrEqual(code) {
            var _this = _super.call(this, dmt.KT.LessOrEqual, code) || this;
            _this.type = "...<=...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a <= b;
            };
            return _this;
        }
        return LessOrEqual;
    }(dmt.Handle));
    dmt.LessOrEqual = LessOrEqual;
    __reflect(LessOrEqual.prototype, "dmt.LessOrEqual");
    var GreaterOrEqual = (function (_super) {
        __extends(GreaterOrEqual, _super);
        function GreaterOrEqual(code) {
            var _this = _super.call(this, dmt.KT.GreaterOrEqual, code) || this;
            _this.type = "...>=...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a >= b;
            };
            return _this;
        }
        return GreaterOrEqual;
    }(dmt.Handle));
    dmt.GreaterOrEqual = GreaterOrEqual;
    __reflect(GreaterOrEqual.prototype, "dmt.GreaterOrEqual");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var AssignBase = (function (_super) {
        __extends(AssignBase, _super);
        function AssignBase(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        AssignBase.prototype.Exp = function (me, tks, bIndex) {
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    var handle = this.handles[tk.name];
                    if (handle.exp) {
                        var v = handle.Exp(me, tks, i);
                        if (v) {
                            return v;
                        }
                    }
                    else {
                        return dmt.Handle.ExpAB(tks, i, tk.type, this.handles[tk.name]);
                    }
                }
            }
            return -1;
        };
        return AssignBase;
    }(dmt.Handle));
    dmt.AssignBase = AssignBase;
    __reflect(AssignBase.prototype, "dmt.AssignBase");
    var Handle17 = (function (_super) {
        __extends(Handle17, _super);
        function Handle17(code) {
            return _super.call(this, code, [
                new Increment(code),
                new Decrement(code),
            ]) || this;
        }
        return Handle17;
    }(AssignBase));
    dmt.Handle17 = Handle17;
    __reflect(Handle17.prototype, "dmt.Handle17");
    var Handle3 = (function (_super) {
        __extends(Handle3, _super);
        function Handle3(code) {
            return _super.call(this, code, [
                new Assign(code),
                new AssignPlus(code),
                new AssignMinus(code),
                new AssignMultiply(code),
                new AssignDivide(code),
                new AssignModulo(code),
                new AssignShi(code),
                new AssignShr(code),
                new AssignUnsignedShr(code)
            ]) || this;
        }
        return Handle3;
    }(AssignBase));
    dmt.Handle3 = Handle3;
    __reflect(Handle3.prototype, "dmt.Handle3");
    var Assign = (function (_super) {
        __extends(Assign, _super);
        function Assign(code) {
            var _this = _super.call(this, dmt.KT.Assign, code) || this;
            _this.type = "...=...";
            _this.isValue = true;
            return _this;
        }
        Assign.prototype.ValueA = function (tk, ctk, ps) {
            var a = tk.tks[0];
            return a.val;
        };
        Assign.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var val = this.code.V(b, tk, ctk, ps);
            if (this.code.autoBind) {
                if (val instanceof Function) {
                    if (!val["__bind__"]) {
                        if (typeof val == "function") {
                            if (val["__token__"] && val["__token__"].type == dmt.KT.ClassInstance) {
                            }
                            else {
                                if (a.tks &&
                                    a.tks[0] &&
                                    a.tks[0].tks &&
                                    a.tks[0].tks[1] &&
                                    a.tks[0].tks[1].tks &&
                                    a.tks[0].tks[1].tks[0] &&
                                    a.tks[0].tks[1].tks[0].val == "prototype") {
                                }
                                else {
                                    val = val.bind(ps);
                                    Object.defineProperty(val, "__bind__", {
                                        value: true,
                                        enumerable: false,
                                        configurable: false
                                    });
                                }
                            }
                        }
                    }
                }
            }
            Assign.AssignValue(a, tk, val, ctk, ps, this.code);
            return val;
        };
        Assign.AssignValue = function (tk, caller, val, ctk, ps, code) {
            // if (tk.handle && !tk.handle.isValue) {
            //     tk.handle.SetValue(tk, val, ctk, ps);
            // }
            // else
            if (tk.handle) {
                tk.handle.SetValue(tk, caller, val, ctk, ps);
            }
            else {
                var key = tk.val;
                var p = Assign.GetWhereIsKey(key, ps, ps);
                //let p = ps;
                code.SetParmsValue(key, val, ctk, p);
            }
        };
        Assign.GetWhereIsKey = function (key, ps, root) {
            if (ps.hasOwnProperty(key)) {
                return ps;
            }
            var proto = ps["__proto__"];
            if (proto) {
                return Assign.GetWhereIsKey(key, proto, root);
            }
            return root;
        };
        return Assign;
    }(dmt.Handle));
    dmt.Assign = Assign;
    __reflect(Assign.prototype, "dmt.Assign");
    var AssignPlus = (function (_super) {
        __extends(AssignPlus, _super);
        function AssignPlus(code) {
            var _this = _super.call(this, dmt.KT.AssignPlus, code) || this;
            _this.type = "...+=...";
            _this.isValue = true;
            return _this;
        }
        AssignPlus.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval += bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignPlus;
    }(dmt.Handle));
    dmt.AssignPlus = AssignPlus;
    __reflect(AssignPlus.prototype, "dmt.AssignPlus");
    var AssignMinus = (function (_super) {
        __extends(AssignMinus, _super);
        function AssignMinus(code) {
            var _this = _super.call(this, dmt.KT.AssignMinus, code) || this;
            _this.type = "...-=...";
            _this.isValue = true;
            return _this;
        }
        AssignMinus.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval -= bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignMinus;
    }(dmt.Handle));
    dmt.AssignMinus = AssignMinus;
    __reflect(AssignMinus.prototype, "dmt.AssignMinus");
    var AssignMultiply = (function (_super) {
        __extends(AssignMultiply, _super);
        function AssignMultiply(code) {
            var _this = _super.call(this, dmt.KT.AssignMultiply, code) || this;
            _this.type = "...*=...";
            _this.isValue = true;
            return _this;
        }
        AssignMultiply.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval *= bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignMultiply;
    }(dmt.Handle));
    dmt.AssignMultiply = AssignMultiply;
    __reflect(AssignMultiply.prototype, "dmt.AssignMultiply");
    var AssignDivide = (function (_super) {
        __extends(AssignDivide, _super);
        function AssignDivide(code) {
            var _this = _super.call(this, dmt.KT.AssignDivide, code) || this;
            _this.type = ".../=...";
            _this.isValue = true;
            return _this;
        }
        AssignDivide.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval /= bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignDivide;
    }(dmt.Handle));
    dmt.AssignDivide = AssignDivide;
    __reflect(AssignDivide.prototype, "dmt.AssignDivide");
    var AssignModulo = (function (_super) {
        __extends(AssignModulo, _super);
        function AssignModulo(code) {
            var _this = _super.call(this, dmt.KT.AssignModulo, code) || this;
            _this.type = "...%=...";
            _this.isValue = true;
            return _this;
        }
        AssignModulo.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval %= bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignModulo;
    }(dmt.Handle));
    dmt.AssignModulo = AssignModulo;
    __reflect(AssignModulo.prototype, "dmt.AssignModulo");
    var AssignShi = (function (_super) {
        __extends(AssignShi, _super);
        function AssignShi(code) {
            var _this = _super.call(this, dmt.KT.AssignShi, code) || this;
            _this.type = "...<<=...";
            _this.isValue = true;
            return _this;
        }
        AssignShi.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval <<= bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignShi;
    }(dmt.Handle));
    dmt.AssignShi = AssignShi;
    __reflect(AssignShi.prototype, "dmt.AssignShi");
    var AssignShr = (function (_super) {
        __extends(AssignShr, _super);
        function AssignShr(code) {
            var _this = _super.call(this, dmt.KT.AssignShr, code) || this;
            _this.type = "...>>=...";
            _this.isValue = true;
            return _this;
        }
        AssignShr.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval >>= bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignShr;
    }(dmt.Handle));
    dmt.AssignShr = AssignShr;
    __reflect(AssignShr.prototype, "dmt.AssignShr");
    var AssignUnsignedShr = (function (_super) {
        __extends(AssignUnsignedShr, _super);
        function AssignUnsignedShr(code) {
            var _this = _super.call(this, dmt.KT.AssignUnsignedShr, code) || this;
            _this.type = "...>>>=...";
            _this.isValue = true;
            return _this;
        }
        AssignUnsignedShr.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            var bval = this.code.V(b, tk, ctk, ps);
            aval >>>= bval;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return aval;
        };
        return AssignUnsignedShr;
    }(dmt.Handle));
    dmt.AssignUnsignedShr = AssignUnsignedShr;
    __reflect(AssignUnsignedShr.prototype, "dmt.AssignUnsignedShr");
    var Increment = (function (_super) {
        __extends(Increment, _super);
        function Increment(code) {
            var _this = _super.call(this, dmt.KT.Increment, code) || this;
            _this.type = "...++";
            _this.isValue = true;
            _this.exp = [new dmt.Express(dmt.KT.Increment, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Increment) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [function (t, exp) {
                        if (t && t.isValue) {
                            return dmt.ECT.OK;
                        }
                        else {
                            return dmt.ECT.Fail;
                        }
                    }])];
            return _this;
        }
        Increment.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var aval = this.code.V(a, tk, ctk, ps);
            var val = aval++;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return val;
        };
        return Increment;
    }(dmt.Handle));
    dmt.Increment = Increment;
    __reflect(Increment.prototype, "dmt.Increment");
    var Decrement = (function (_super) {
        __extends(Decrement, _super);
        function Decrement(code) {
            var _this = _super.call(this, dmt.KT.Decrement, code) || this;
            _this.type = "...--";
            _this.isValue = true;
            _this.exp = [new dmt.Express(dmt.KT.Decrement, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Decrement) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [function (t, exp) {
                        if (t && t.isValue) {
                            return dmt.ECT.OK;
                        }
                        else {
                            return dmt.ECT.Fail;
                        }
                    }])];
            return _this;
        }
        Decrement.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var aval = this.code.V(a, tk, ctk, ps);
            var val = aval--;
            Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return val;
        };
        return Decrement;
    }(dmt.Handle));
    dmt.Decrement = Decrement;
    __reflect(Decrement.prototype, "dmt.Decrement");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Combine = (function (_super) {
        __extends(Combine, _super);
        function Combine(code) {
            var _this = _super.call(this, dmt.KT.Combine, code) || this;
            _this.type = "...&...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a & b;
            };
            return _this;
        }
        Combine.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Handle.ExpAB(tks, bIndex, dmt.KT.Combine, this);
        };
        return Combine;
    }(dmt.Handle));
    dmt.Combine = Combine;
    __reflect(Combine.prototype, "dmt.Combine");
    var XOR = (function (_super) {
        __extends(XOR, _super);
        function XOR(code) {
            var _this = _super.call(this, dmt.KT.XOR, code) || this;
            _this.type = "...^...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a ^ b;
            };
            return _this;
        }
        XOR.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Handle.ExpAB(tks, bIndex, dmt.KT.XOR, this);
        };
        return XOR;
    }(dmt.Handle));
    dmt.XOR = XOR;
    __reflect(XOR.prototype, "dmt.XOR");
    var InclusiveOr = (function (_super) {
        __extends(InclusiveOr, _super);
        function InclusiveOr(code) {
            var _this = _super.call(this, dmt.KT.InclusiveOr, code) || this;
            _this.type = "...|...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a | b;
            };
            return _this;
        }
        InclusiveOr.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Handle.ExpAB(tks, bIndex, dmt.KT.InclusiveOr, this);
        };
        return InclusiveOr;
    }(dmt.Handle));
    dmt.InclusiveOr = InclusiveOr;
    __reflect(InclusiveOr.prototype, "dmt.InclusiveOr");
    var And = (function (_super) {
        __extends(And, _super);
        function And(code) {
            var _this = _super.call(this, dmt.KT.And, code) || this;
            _this.type = "...&&...";
            _this.isValue = true;
            return _this;
        }
        And.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            if (!aval) {
                return false;
            }
            var bval = this.code.V(b, tk, ctk, ps);
            if (!bval) {
                return false;
            }
            return true;
        };
        And.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Handle.ExpAB(tks, bIndex, dmt.KT.And, this);
        };
        return And;
    }(dmt.Handle));
    dmt.And = And;
    __reflect(And.prototype, "dmt.And");
    var Or = (function (_super) {
        __extends(Or, _super);
        function Or(code) {
            var _this = _super.call(this, dmt.KT.Or, code) || this;
            _this.type = "...||...";
            _this.isValue = true;
            return _this;
        }
        Or.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var aval = this.code.V(a, tk, ctk, ps);
            if (aval) {
                return true;
            }
            var bval = this.code.V(b, tk, ctk, ps);
            if (bval) {
                return true;
            }
            return false;
        };
        Or.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Handle.ExpAB(tks, bIndex, dmt.KT.Or, this);
        };
        return Or;
    }(dmt.Handle));
    dmt.Or = Or;
    __reflect(Or.prototype, "dmt.Or");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Call = (function (_super) {
        __extends(Call, _super);
        function Call(code) {
            var _this = _super.call(this, dmt.KT.Call, code) || this;
            _this.type = "...(...)";
            _this.enterType = dmt.KT.Par;
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.Par, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Par) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [function (t, express) {
                        if (t && t.isValue) {
                            return dmt.ECT.OK;
                        }
                        else {
                            return dmt.ECT.Fail;
                        }
                    }])
            ];
            return _this;
        }
        Call.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            this.code.Express(a);
            var b = tk.tks[1];
            var func = null;
            var thisVal = null;
            if (a.type == dmt.KT.Super) {
                //super只能独立处理，不能统一处理，多重继承共享一个ps，所以不能放到ps中,
                //这里不能只调用constructor
                //这个不对，这个是直接调用constructor，但是会跳过$
                //let _super = this.code.GetSuper(ps);
                //let _extends = _super["constructor"];
                //let that = this.code.GetThis(ps);
                //这个是对的
                var that = this.code.GetThis(ps);
                var thisToken = that["__token__"];
                var curToken = that["__curToken__"];
                var _extends = that["__extends__"];
                //把extends赋值到下一个子类，在多重继承中需要顺延执行
                if (_extends["prototype"]["__token__"]) {
                    Object.defineProperty(that, "__extends__", {
                        value: _extends["prototype"]["__token__"]["extends"],
                        enumerable: false,
                        configurable: true
                    });
                }
                else {
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
                func = null; //赋值为空，不让func重复执行
                //后面自动 7执行子类初始化
            }
            else {
                if (a.type == dmt.KT.Bracket) {
                    func = this.code.V(a.tks[0], tk, ctk, ps);
                    thisVal = this.code.VA(a.tks[0], ctk, ps);
                }
                else if (a.type == dmt.KT.PeriodKeyVal) {
                    func = this.code.V(a, tk, ctk, ps);
                    thisVal = this.code.VA(a, ctk, ps);
                }
                else {
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
        };
        //b(p); a.b(p); super.b(p); a.a.b(p);
        //func:需要执行的function
        //a:func执行绑定的a对象，需要从中取this
        //p:parms的token
        Call.Call = function (func, thisVal, paramsToken, ctk, ps, code) {
            Call.HandleFunctionParms(paramsToken, code);
            var params = paramsToken.tks;
            if (func) {
                ///////////////
                // let thisVal = null;
                // if (a.type == KT.PeriodVal || a.type == KT.Bracket) {//TODO:PeriodVal
                //     thisVal = code.VA(a, ctk, ps);
                // } else {
                //     thisVal = code.V(a, ctk, ps);
                // }
                ///////////////                
                var psFunc = [];
                for (var i = 0, len = params.length; i < len; i++) {
                    var val = code.ValueParms(params[i], ctk, ps);
                    psFunc.push(val);
                }
                ///////////////
                if (thisVal instanceof dmt.Token) {
                    var nps = code.ComParams(thisVal.ps, ps);
                    thisVal = thisVal.ps;
                    //这里直接把function()=>{}和()=>{}的this指向改为一致了。在ts中this没必要指向自身
                    //let a={};a.b=()=>{this;};a.b();
                    //let a={};a.b=function(){this;};a.b();
                    return func.apply(nps, psFunc);
                }
                else {
                    for (var i = 0, len = psFunc.length; i < len; i++) {
                        var p = psFunc[i];
                        if (p instanceof Function) {
                            if (!p["__bind__"]) {
                                //这里直接把function()=>{}和()=>{}的this指向改为一致了。在ts中this没必要指向自身
                                if (typeof p == "function") {
                                    if (p["__token__"] && p["__token__"].type == dmt.KT.ClassInstance) {
                                    }
                                    else {
                                        p = p.bind(ps); //这个bind关键时刻还是发挥了一下
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
            }
            else {
                throw new Error("'Function' does not exist");
            }
        };
        Call.CallFunction = function (func, params, ctk, ps, code) {
            var funcOrig = func;
            var bindObject = {};
            var fcall = func.tks[0];
            //func有2种形式,function(){}和()=>{}，第一种是call Brace，第二种是Par => Brace
            if (fcall.type == dmt.KT.Call) {
                fcall = fcall.tks[fcall.tks.length - 1];
            }
            Call.HandleFunctionParms(fcall, code);
            var acceptParams = fcall.tks;
            if (!acceptParams) {
                acceptParams = [fcall];
            }
            var i = 0;
            var paramsParam = null;
            var acceptParamsLength = acceptParams.length;
            for (var len = params.length; i < len; i++) {
                //let val = code.Value(params[i], ctk, ps);
                var val = params[i];
                if (i < acceptParamsLength) {
                    //处理普通参数
                    var acceptParam = acceptParams[i];
                    var key = code.VA(acceptParam, ctk, ps);
                    if (acceptParam.type == dmt.KT.Params) {
                        //处理...参数
                        paramsParam = [val];
                        bindObject[key.val] = paramsParam;
                    }
                    else {
                        bindObject[key] = val;
                    }
                }
                else {
                    if (paramsParam) {
                        paramsParam.push(val);
                    }
                }
            }
            var nps = code.ComParams(bindObject, ps);
            if (acceptParamsLength > 0) {
                for (var len = acceptParamsLength; i < len; i++) {
                    //处理默认参数
                    var p = acceptParams[i];
                    if (p.type == dmt.KT.ReservedWord) {
                        code.SetParmsValue(p.val, null, ctk, nps);
                    }
                    else {
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
            ctk.returnVal = dmt.Token.void0;
            ctk.signal = dmt.KT.None;
            for (var i_1 = 0, len = func.tks.length; i_1 < len; i_1++) {
                var fi = func.tks[i_1];
                code.V(fi, funcOrig, ctk, nps);
                var signal = ctk.signal;
                if (signal == dmt.KT.Return) {
                    ctk.signal = dmt.KT.None;
                    return ctk.returnVal;
                }
            }
        };
        Call.HandleFunctionParms = function (tk, code) {
            if (!tk) {
                return;
            }
            if (tk.expressed) {
                return;
            }
            code.Express(tk);
            if (tk.tks) {
                for (var i = tk.tks.length - 1; i >= 0; i--) {
                    var t = tk.tks[i];
                    if (t.type == dmt.KT.End || t.type == dmt.KT.Enter) {
                        tk.tks.splice(i, 1);
                    }
                }
                if (tk.tks.length > 0) {
                    if (tk.tks[0].type == dmt.KT.Comma) {
                        tk.tks = tk.tks[0].tks;
                        tk.tks.forEach(function (fi) {
                            fi.parent = tk;
                        });
                    }
                }
            }
        };
        return Call;
    }(dmt.Handle));
    dmt.Call = Call;
    __reflect(Call.prototype, "dmt.Call");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Class = (function (_super) {
        __extends(Class, _super);
        function Class(code) {
            var _this = _super.call(this, dmt.KT.Class, code) || this;
            _this.type = "class ...(...){}";
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.Class, dmt.KT.Class),
                new dmt.Express(dmt.KT.Brace, dmt.KT.Brace)
            ];
            return _this;
        }
        Class.prototype.V = function (tk, ctk, ps) {
            var _classVal = this.GetClass(tk, ctk, ps);
            return _classVal;
        };
        Class.prototype.GetClass = function (_class, ctk, ps) {
            if (_class instanceof dmt.Token) {
                if (!_class._class) {
                    var head = _class.tks[0];
                    this.code.Express(head);
                    var className = head.tks[0].val;
                    _class.ps = {};
                    //let nps = this.code.ComParams(_class.ps, ps);
                    var nps = this.code.ComParams(_class.ps, ps);
                    delete nps["__this__"];
                    this.code.SetParmsValue(className, nps, ctk, ps); //暂时赋值
                    var brace = _class.tks[_class.tks.length - 1];
                    this.code.Express(brace);
                    for (var i = 0, len = brace.tks.length; i < len; i++) {
                        var fi = brace.tks[i];
                        if (fi.static && fi.type != dmt.KT.SemiColon) {
                            this.code.V(fi, _class, ctk, nps);
                        }
                    }
                    ;
                    //初始化
                    //_class是代码的class，_classVal就是_class解析后的值，可以被new，其中ps就是prototype
                    //_class._class就是_classVal可以被js直接识别的形式，其实_classVal=_class._class，只是形态不一样
                    var _classVal_1 = this.InstanceClass(_class, ctk, nps);
                    var code_1 = this.code;
                    //_classVal.ps["__token__"] = _class;
                    //其他语言，使用下面的方法，但是不能兼容外部调用
                    // return _classVal; 
                    //返回兼容外部调用的class
                    _class._class = (function () {
                        var $ = function () {
                            //new的执行过程:
                            //1赋值静态属性
                            //2赋值父类的方法
                            //3赋值方法
                            //4赋值父类的值
                            //5执行父类初始化
                            //6赋值子类的值
                            //7执行子类初始化
                            var ps = this; //这里的this，由New.ts的let val = _classVal.apply(me, paramsFunc)进行传递
                            //4如果没有父类，则直接赋值，不然等super过后进行复制
                            if (!_classVal_1.extends) {
                                code_1.CallPreConstructor(_classVal_1, ctk, ps);
                            }
                            //执行构造方法，在构造方法的super那里执行赋值子类的值                           
                            var _constructor = _classVal_1._constructor;
                            if (_constructor) {
                                _constructor.apply(ps, arguments);
                            }
                            return ps;
                        };
                        //1赋值静态属性
                        for (var fi in _class.ps) {
                            if (_class.ps.hasOwnProperty(fi)) {
                                var des = Object.getOwnPropertyDescriptor(_class.ps, fi);
                                Object.defineProperty($, fi, des);
                            }
                        }
                        //2赋值父类方法
                        if (_classVal_1.extends) {
                            var r = function () {
                                this.constructor = _classVal_1.extends.constructor;
                            };
                            r.prototype = _classVal_1.extends.prototype;
                            var rs = new r();
                            $.prototype = rs;
                        }
                        //3赋值方法
                        for (var fi in _classVal_1.ps) {
                            if (_classVal_1.ps.hasOwnProperty(fi)) {
                                var des = Object.getOwnPropertyDescriptor(_classVal_1.ps, fi);
                                Object.defineProperty($.prototype, fi, des);
                            }
                        }
                        //赋值其他
                        Object.defineProperty($.prototype, "__token__", {
                            value: _classVal_1,
                            enumerable: false,
                            configurable: false
                        });
                        Object.defineProperty($.prototype, "__curToken__", {
                            value: _classVal_1,
                            enumerable: false,
                            configurable: false
                        });
                        if (_classVal_1.extends) {
                            Object.defineProperty($.prototype, "__extends__", {
                                value: _classVal_1.extends,
                                enumerable: false,
                                configurable: true
                            });
                        }
                        Object.defineProperty($, "__token__", {
                            value: _classVal_1,
                            enumerable: false,
                            configurable: false
                        });
                        return $;
                    })();
                    this.code.SetParmsValue(className, _class._class, ctk, ps);
                }
                return _class._class;
            }
            else {
                return _class;
                //这里会出现调用外部对象，比如new Array()
                //实现需要增加中间代理类，
                //如果是其他预言的解析，则直接调用注册的代理方法
            }
        };
        Class.prototype.InstanceClass = function (_class, ctk, ps) {
            //寻找并初始化继承
            var extendsClassVal = null;
            var extendsToken = null;
            for (var i = 0, len = _class.tks[0].tks.length; i < len; i++) {
                var tk = _class.tks[0].tks[i];
                if (tk.type == dmt.KT.Extends) {
                    extendsToken = tk;
                    break;
                }
            }
            if (extendsToken) {
                var extendsClass = this.code.V(extendsToken, _class, ctk, ps);
                if (!extendsClass) {
                    throw new Error("'Extends' does not exist");
                }
                if (extendsClass instanceof dmt.Token) {
                    extendsClassVal = this.InstanceClass(extendsClass, ctk, ps);
                }
                else {
                    //处理继承外部类，如果使用其他语言实现，可以直接注释
                    extendsClassVal = extendsClass;
                }
            }
            var classVal = this.code.Initialize(_class.tks[_class.tks.length - 1].tks, ctk, _class.name);
            for (var i = 0, len = classVal.tks.length; i < len; i++) {
                var child = classVal.tks[i];
                child.parent = classVal;
            }
            //处理constructor 保存constructor
            var _constructor = this.code.GetParmsValue("constructor", classVal.ps, false);
            if (_constructor) {
                classVal._constructor = _constructor;
            }
            if (extendsClassVal) {
                classVal.extends = extendsClassVal;
            }
            return classVal;
        };
        return Class;
    }(dmt.Handle));
    dmt.Class = Class;
    __reflect(Class.prototype, "dmt.Class");
    var Interface = (function (_super) {
        __extends(Interface, _super);
        function Interface(code) {
            var _this = _super.call(this, dmt.KT.Interface, code) || this;
            _this.type = "interface ...(...){}";
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.Interface, dmt.KT.Interface),
                new dmt.Express(dmt.KT.Brace, dmt.KT.Brace)
            ];
            return _this;
        }
        Interface.prototype.V = function (tk, ctk, ps) {
            return null;
        };
        return Interface;
    }(dmt.Handle));
    dmt.Interface = Interface;
    __reflect(Interface.prototype, "dmt.Interface");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Colon = (function (_super) {
        __extends(Colon, _super);
        function Colon(code) {
            var _this = _super.call(this, dmt.KT.Colon, code) || this;
            _this.type = ":...";
            _this.skipIndex = 0;
            return _this;
        }
        Colon.prototype.V = function (tk, ctk, ps) {
            this.code.Express(tk);
            return dmt.BracePair.HandleBraceJson(tk, this.code, ctk, ps);
        };
        //:后面很复杂，不能用公式进行判断
        Colon.prototype.Exp = function (me, tks, bIndex) {
            var newTokens = null;
            var beginTokenIndex = -1;
            var angleBracketIndex = 0;
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (newTokens) {
                    if (angleBracketIndex > 0) {
                        if (tk.type == dmt.KT.Less) {
                            angleBracketIndex++;
                        }
                        else if (tk.type == dmt.KT.Greater) {
                            angleBracketIndex--;
                        }
                        newTokens.push(tk);
                    }
                    else {
                        if (tk.type == dmt.KT.Assign
                            || tk.type == dmt.KT.Comma
                            || tk.type == dmt.KT.SemiColon
                            || tk.type == dmt.KT.End
                            || tk.type == dmt.KT.Enter && newTokens.length > 0
                            || tk.type == dmt.KT.Brace && newTokens.length > 0) {
                            var endTokenIndex = i - 1;
                            var t = this.code.InsertToken(tks, dmt.KT.ColonVal, newTokens, beginTokenIndex, endTokenIndex, this);
                            return beginTokenIndex;
                        }
                        else if (tk.type == dmt.KT.Less) {
                            angleBracketIndex = 1;
                        }
                        newTokens.push(tk);
                    }
                }
                else {
                    if (tk.type == dmt.KT.Colon) {
                        if (this.skipIndex > 0) {
                            this.skipIndex--;
                            return bIndex + 1;
                        }
                        else {
                            if (me.type == dmt.KT.Brace && (i == 1
                                || i == 2 && tks[0].type == dmt.KT.Enter)) {
                                me.type = dmt.KT.Json;
                                me.handle = this;
                                //this.isJson = true;
                                return tks.length;
                            }
                            newTokens = [];
                            beginTokenIndex = i;
                        }
                    }
                    else {
                        if (tk.type == dmt.KT.Case
                            || tk.type == dmt.KT.Default
                            || tk.type == dmt.KT.QuestionMark) {
                            this.skipIndex++;
                        }
                        return bIndex + 1;
                    }
                }
            }
            return -1;
        };
        Colon.prototype.AfterExpress = function (me, tks) {
            if (me.type != dmt.KT.Json) {
                for (var i = tks.length - 1; i >= 0; i--) {
                    var tk = tks[i];
                    //这里的回车Enter要不要删掉，后面Enter好像也没什么用了
                    if (tk.type == dmt.KT.ColonVal || tk.type == dmt.KT.Enter) {
                        var preToken = tks[i - 1];
                        if (preToken) {
                            preToken.colon = tk;
                        }
                        tks.splice(i, 1);
                    }
                }
            }
            this.skipIndex = 0;
        };
        return Colon;
    }(dmt.Handle));
    dmt.Colon = Colon;
    __reflect(Colon.prototype, "dmt.Colon");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Comma = (function (_super) {
        __extends(Comma, _super);
        function Comma(code) {
            var _this = _super.call(this, dmt.KT.Comma, code) || this;
            _this.type = "...,...";
            _this.isValue = true;
            _this.exp = [new dmt.Express(dmt.KT.Comma, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Comma) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [dmt.KT.AnyOne]),
                new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)];
            return _this;
        }
        Comma.prototype.V = function (tk, ctk, ps) {
            this.code.Express(tk);
            var tks = tk.tks;
            for (var i = tk.tks.length - 1; i >= 0; i--) {
                var t = tk.tks[i];
                if (t.type == dmt.KT.End || t.type == dmt.KT.Enter) {
                    tk.tks.splice(i, 1);
                }
            }
            var val;
            for (var i = 0, len = tks.length; i < len; i++) {
                var fi = tks[i];
                if (fi.type != dmt.KT.SemiColon) {
                    val = this.code.V(fi, tk, ctk, ps);
                }
            }
            return val;
        };
        Comma.prototype.Exp = function (me, tks, bIndex) {
            if (me.type == dmt.KT.Json) {
                return -1;
            }
            var index = dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                if (t.tks[0].type == dmt.KT.Comma) {
                    var a = t.tks[0];
                    var b = t.tks[1];
                    t.tks = a.tks;
                    t.tks.push(b);
                    t.tks.forEach(function (fi) {
                        fi.parent = t;
                    });
                }
            });
            return index;
        };
        return Comma;
    }(dmt.Handle));
    dmt.Comma = Comma;
    __reflect(Comma.prototype, "dmt.Comma");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Declare = (function (_super) {
        __extends(Declare, _super);
        function Declare(code) {
            var _this = _super.call(this, dmt.KT.Declare, code) || this;
            _this.type = "declare ... {...}";
            _this.exp = [
                new dmt.Express(dmt.KT.Declare, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Declare) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        Declare.prototype.V = function (tk, ctk, ps) {
            //TODO:declare未进行解析
            return null;
        };
        return Declare;
    }(dmt.Handle));
    dmt.Declare = Declare;
    __reflect(Declare.prototype, "dmt.Declare");
})(dmt || (dmt = {}));
///<reference path="../Handle.ts" />
var dmt;
(function (dmt) {
    var DecorateHandle = (function (_super) {
        __extends(DecorateHandle, _super);
        function DecorateHandle(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        DecorateHandle.prototype.Exp = function (me, tks, bIndex) {
            for (var i = tks.length - 1; i >= 0; i--) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    var handle = this.handles[tk.name];
                    if (handle.exp) {
                        var v = handle.Exp(me, tks, i);
                        if (v) {
                            return v;
                        }
                    }
                    else {
                        var nextToken = tks[i + 1];
                        if (tk.type == dmt.KT.Static) {
                            nextToken.static = true;
                        }
                        else if (tk.type == dmt.KT.Get) {
                            nextToken.get = true;
                        }
                        else if (tk.type == dmt.KT.Set) {
                            nextToken.set = true;
                        }
                        else {
                            nextToken.decorate = tk.type;
                        }
                        tks.splice(i, 1);
                    }
                }
            }
            return -1;
        };
        return DecorateHandle;
    }(dmt.Handle));
    dmt.DecorateHandle = DecorateHandle;
    __reflect(DecorateHandle.prototype, "dmt.DecorateHandle");
    var Decorate = (function (_super) {
        __extends(Decorate, _super);
        function Decorate(code) {
            return _super.call(this, code, [
                new Public(code),
                new Protected(code),
                new Private(code),
                new Static(code),
                new Get(code),
                new Set(code),
                new dmt.Return(code),
                new dmt.Continue(code),
                new dmt.Break(code)
            ]) || this;
        }
        return Decorate;
    }(DecorateHandle));
    dmt.Decorate = Decorate;
    __reflect(Decorate.prototype, "dmt.Decorate");
    var Public = (function (_super) {
        __extends(Public, _super);
        function Public(code) {
            var _this = _super.call(this, dmt.KT.Public, code) || this;
            _this.type = "public ...";
            return _this;
        }
        return Public;
    }(dmt.Handle));
    dmt.Public = Public;
    __reflect(Public.prototype, "dmt.Public");
    var Protected = (function (_super) {
        __extends(Protected, _super);
        function Protected(code) {
            var _this = _super.call(this, dmt.KT.Protected, code) || this;
            _this.type = "Protected ...";
            return _this;
        }
        return Protected;
    }(dmt.Handle));
    dmt.Protected = Protected;
    __reflect(Protected.prototype, "dmt.Protected");
    var Private = (function (_super) {
        __extends(Private, _super);
        function Private(code) {
            var _this = _super.call(this, dmt.KT.Private, code) || this;
            _this.type = "Private ...";
            return _this;
        }
        return Private;
    }(dmt.Handle));
    dmt.Private = Private;
    __reflect(Private.prototype, "dmt.Private");
    var Static = (function (_super) {
        __extends(Static, _super);
        function Static(code) {
            var _this = _super.call(this, dmt.KT.Static, code) || this;
            _this.type = "static ...";
            return _this;
        }
        return Static;
    }(dmt.Handle));
    dmt.Static = Static;
    __reflect(Static.prototype, "dmt.Static");
    var Get = (function (_super) {
        __extends(Get, _super);
        function Get(code) {
            var _this = _super.call(this, dmt.KT.Get, code) || this;
            _this.type = "get ...";
            return _this;
        }
        return Get;
    }(dmt.Handle));
    dmt.Get = Get;
    __reflect(Get.prototype, "dmt.Get");
    var Set = (function (_super) {
        __extends(Set, _super);
        function Set(code) {
            var _this = _super.call(this, dmt.KT.Set, code) || this;
            _this.type = "set ...";
            return _this;
        }
        return Set;
    }(dmt.Handle));
    dmt.Set = Set;
    __reflect(Set.prototype, "dmt.Set");
})(dmt || (dmt = {}));
///<reference path="../Handle.ts" />
var dmt;
(function (dmt) {
    var EqualOpration = (function (_super) {
        __extends(EqualOpration, _super);
        function EqualOpration(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        EqualOpration.prototype.Exp = function (me, tks, bIndex) {
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    return dmt.Handle.ExpAB(tks, i, tk.type, this.handles[tk.name]);
                }
            }
            return -1;
        };
        return EqualOpration;
    }(dmt.Handle));
    dmt.EqualOpration = EqualOpration;
    __reflect(EqualOpration.prototype, "dmt.EqualOpration");
    var Handle10 = (function (_super) {
        __extends(Handle10, _super);
        function Handle10(code) {
            return _super.call(this, code, [
                new Equal(code),
                new NotEqual(code),
                new AllEqual(code),
                new AllNotEqual(code)
            ]) || this;
        }
        return Handle10;
    }(EqualOpration));
    dmt.Handle10 = Handle10;
    __reflect(Handle10.prototype, "dmt.Handle10");
    var Equal = (function (_super) {
        __extends(Equal, _super);
        function Equal(code) {
            var _this = _super.call(this, dmt.KT.Equal, code) || this;
            _this.type = "...==...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a == b;
            };
            return _this;
        }
        return Equal;
    }(dmt.Handle));
    dmt.Equal = Equal;
    __reflect(Equal.prototype, "dmt.Equal");
    var NotEqual = (function (_super) {
        __extends(NotEqual, _super);
        function NotEqual(code) {
            var _this = _super.call(this, dmt.KT.NotEqual, code) || this;
            _this.type = "...!=...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a != b;
            };
            return _this;
        }
        return NotEqual;
    }(dmt.Handle));
    dmt.NotEqual = NotEqual;
    __reflect(NotEqual.prototype, "dmt.NotEqual");
    var AllEqual = (function (_super) {
        __extends(AllEqual, _super);
        function AllEqual(code) {
            var _this = _super.call(this, dmt.KT.AllEqual, code) || this;
            _this.type = "...===...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a === b;
            };
            return _this;
        }
        return AllEqual;
    }(dmt.Handle));
    dmt.AllEqual = AllEqual;
    __reflect(AllEqual.prototype, "dmt.AllEqual");
    var AllNotEqual = (function (_super) {
        __extends(AllNotEqual, _super);
        function AllNotEqual(code) {
            var _this = _super.call(this, dmt.KT.AllNotEqual, code) || this;
            _this.type = "...!==...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a !== b;
            };
            return _this;
        }
        return AllNotEqual;
    }(dmt.Handle));
    dmt.AllNotEqual = AllNotEqual;
    __reflect(AllNotEqual.prototype, "dmt.AllNotEqual");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var _Function = (function (_super) {
        __extends(_Function, _super);
        function _Function(code) {
            var _this = _super.call(this, dmt.KT.Function, code) || this;
            _this.type = "...(...){}";
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.Call, dmt.KT.Call),
                new dmt.Express(dmt.KT.Brace, dmt.KT.Brace)
            ];
            return _this;
        }
        _Function.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var code = this.code;
            var val = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return dmt.Call.CallFunction(tk, params, ctk, this, code); //这里的this，由Class.ts的_constructor.apply(this, arguments);进行传递
            };
            //val["__token__"] = tk;
            Object.defineProperty(val, "__token__", {
                value: tk,
                enumerable: false,
                configurable: false
            });
            if (a.tks.length > 0) {
                var funcName = a.tks[0].val;
                if (funcName) {
                    if (tk.get) {
                        Object.defineProperty(ps, funcName, {
                            get: val,
                            enumerable: true,
                            configurable: true
                        });
                    }
                    else if (tk.set) {
                        Object.defineProperty(ps, funcName, {
                            set: val,
                            enumerable: true,
                            configurable: true
                        });
                    }
                    else {
                        this.code.SetParmsValue(funcName, val, ctk, ps);
                    }
                }
            }
            return val;
        };
        return _Function;
    }(dmt.Handle));
    dmt._Function = _Function;
    __reflect(_Function.prototype, "dmt._Function");
    var FunctionSymbol = (function (_super) {
        __extends(FunctionSymbol, _super);
        function FunctionSymbol(code) {
            var _this = _super.call(this, dmt.KT.FunctionSymbol, code) || this;
            _this.type = "()=>{}";
            _this.exp = [
                new dmt.Express(dmt.KT.FunctionSymbol, dmt.KT.FunctionSymbol, [dmt.KT.AnyOne]),
                new dmt.Express(dmt.KT.Brace, dmt.KT.Brace)
            ];
            return _this;
        }
        FunctionSymbol.prototype.V = function (tk, ctk, ps) {
            //let a = tk.tks[0];
            var code = this.code;
            var val = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return dmt.Call.CallFunction(tk, params, ctk, this, code); //这里的this，由Class.ts的_constructor.apply(this, arguments);进行传递
            };
            //val["__token__"] = tk;
            Object.defineProperty(val, "__token__", {
                value: tk,
                enumerable: false,
                configurable: false
            });
            return val;
        };
        return FunctionSymbol;
    }(dmt.Handle));
    dmt.FunctionSymbol = FunctionSymbol;
    __reflect(FunctionSymbol.prototype, "dmt.FunctionSymbol");
    var FunctionAnonymous = (function (_super) {
        __extends(FunctionAnonymous, _super);
        function FunctionAnonymous(code) {
            var _this = _super.call(this, dmt.KT.FunctionAnonymous, code) || this;
            _this.type = "function(){}";
            _this.enterType = dmt.KT.FunctionAnonymous;
            _this.exp = [
                new dmt.Express(dmt.KT.FunctionAnonymous, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Function) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Brace, dmt.KT.Brace)
            ];
            return _this;
        }
        FunctionAnonymous.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.tks[0] = t.tks[0].tks[0];
            });
        };
        FunctionAnonymous.prototype.V = function (tk, ctk, ps) {
            //let a = tk.tks[0];
            var code = this.code;
            var val = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return dmt.Call.CallFunction(tk, params, ctk, this, code); //这里的this，由Class.ts的_constructor.apply(this, arguments);进行传递
            };
            //val["__token__"] = tk;
            Object.defineProperty(val, "__token__", {
                value: tk,
                enumerable: false,
                configurable: false
            });
            return val;
        };
        return FunctionAnonymous;
    }(dmt.Handle));
    dmt.FunctionAnonymous = FunctionAnonymous;
    __reflect(FunctionAnonymous.prototype, "dmt.FunctionAnonymous");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Json = (function (_super) {
        __extends(Json, _super);
        function Json(code) {
            var _this = _super.call(this, dmt.KT.JsonVal, code) || this;
            _this.type = "...:...";
            _this.enterType = dmt.KT.Colon;
            _this.exp = [new dmt.Express(dmt.KT.Colon, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Colon) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [dmt.KT.AnyOne]),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Enter) {
                        return dmt.ECT.OKSkipStay;
                    }
                    else {
                        return dmt.ECT.OK;
                    }
                })];
            return _this;
        }
        Json.prototype.Exp = function (me, tks, bIndex) {
            if (me.type != dmt.KT.Json) {
                return -1;
            }
            var index = dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this);
            return index;
        };
        return Json;
    }(dmt.Handle));
    dmt.Json = Json;
    __reflect(Json.prototype, "dmt.Json");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Logical = (function (_super) {
        __extends(Logical, _super);
        function Logical(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        Logical.prototype.Exp = function (me, tks, bIndex) {
            var _loop_1 = function (i, len) {
                var tk = tks[i];
                if (tk.isParser && this_1.handles.hasOwnProperty(tk.name)) {
                    var handle = this_1.handles[tk.name];
                    if (handle.exp) {
                        var v = handle.Exp(me, tks, i);
                        if (v) {
                            return { value: v };
                        }
                    }
                    else {
                        var exp = Logical.expressList[tk.type];
                        if (!exp) {
                            exp = [
                                new dmt.Express(tk.type, function (t, tks, index, express) {
                                    if (t.type == tk.type) {
                                        return dmt.ECT.OKSkip;
                                    }
                                    else {
                                        return dmt.ECT.Fail;
                                    }
                                }),
                                new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)
                            ];
                            Logical.expressList[tk.type] = exp;
                        }
                        var index = dmt.Express.Exps(tks, i, exp, tk.type, handle);
                        return { value: index };
                    }
                }
            };
            var this_1 = this;
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var state_1 = _loop_1(i, len);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return -1;
        };
        Logical.expressList = {};
        return Logical;
    }(dmt.Handle));
    dmt.Logical = Logical;
    __reflect(Logical.prototype, "dmt.Logical");
    var Handle16 = (function (_super) {
        __extends(Handle16, _super);
        function Handle16(code) {
            return _super.call(this, code, [
                new Not(code),
                new BitwiseNot(code),
                new UnaryPlus(code),
                new UnaryMinus(code),
                new UnaryIncrement(code),
                new UnaryDecrement(code),
                new TypeOf(code),
                new Void(code),
                new Delete(code),
            ]) || this;
        }
        return Handle16;
    }(Logical));
    dmt.Handle16 = Handle16;
    __reflect(Handle16.prototype, "dmt.Handle16");
    var Not = (function (_super) {
        __extends(Not, _super);
        function Not(code) {
            var _this = _super.call(this, dmt.KT.Not, code) || this;
            _this.type = "!...";
            _this.isValue = true;
            return _this;
        }
        Not.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            return !this.code.V(a, tk, ctk, ps);
        };
        return Not;
    }(dmt.Handle));
    dmt.Not = Not;
    __reflect(Not.prototype, "dmt.Not");
    var BitwiseNot = (function (_super) {
        __extends(BitwiseNot, _super);
        function BitwiseNot(code) {
            var _this = _super.call(this, dmt.KT.BitwiseNot, code) || this;
            _this.type = "~...";
            _this.isValue = true;
            return _this;
        }
        BitwiseNot.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            return ~this.code.V(a, tk, ctk, ps);
        };
        return BitwiseNot;
    }(dmt.Handle));
    dmt.BitwiseNot = BitwiseNot;
    __reflect(BitwiseNot.prototype, "dmt.BitwiseNot");
    var UnaryPlus = (function (_super) {
        __extends(UnaryPlus, _super);
        function UnaryPlus(code) {
            var _this = _super.call(this, dmt.KT.UnaryPlus, code) || this;
            _this.type = "+...";
            _this.enterType = dmt.KT.Plus;
            _this.isValue = true;
            _this.exp = [new dmt.Express(dmt.KT.Plus, function (t, tks, index, exp) {
                    var pt = tks[index - 1];
                    if (t.type == dmt.KT.Plus && (!pt || !pt.isValue)) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }), new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)];
            return _this;
        }
        UnaryPlus.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var val = this.code.V(a, tk, ctk, ps);
            val = +val;
            return val;
        };
        UnaryPlus.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return UnaryPlus;
    }(dmt.Handle));
    dmt.UnaryPlus = UnaryPlus;
    __reflect(UnaryPlus.prototype, "dmt.UnaryPlus");
    var UnaryMinus = (function (_super) {
        __extends(UnaryMinus, _super);
        function UnaryMinus(code) {
            var _this = _super.call(this, dmt.KT.UnaryMinus, code) || this;
            _this.type = "-...";
            _this.enterType = dmt.KT.Minus;
            _this.isValue = true;
            _this.exp = [new dmt.Express(dmt.KT.Minus, function (t, tks, index, exp) {
                    var pt = tks[index - 1];
                    if (t.type == dmt.KT.Minus && (!pt || !pt.isValue)) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }), new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)];
            return _this;
        }
        UnaryMinus.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var val = this.code.V(a, tk, ctk, ps);
            val = -val;
            return val;
        };
        UnaryMinus.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return UnaryMinus;
    }(dmt.Handle));
    dmt.UnaryMinus = UnaryMinus;
    __reflect(UnaryMinus.prototype, "dmt.UnaryMinus");
    var UnaryIncrement = (function (_super) {
        __extends(UnaryIncrement, _super);
        function UnaryIncrement(code) {
            var _this = _super.call(this, dmt.KT.UnaryIncrement, code) || this;
            _this.type = "++...";
            _this.enterType = dmt.KT.Increment;
            _this.isValue = true;
            return _this;
        }
        UnaryIncrement.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var aval = this.code.V(a, tk, ctk, ps);
            var val = ++aval;
            dmt.Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return val;
        };
        return UnaryIncrement;
    }(dmt.Handle));
    dmt.UnaryIncrement = UnaryIncrement;
    __reflect(UnaryIncrement.prototype, "dmt.UnaryIncrement");
    var UnaryDecrement = (function (_super) {
        __extends(UnaryDecrement, _super);
        function UnaryDecrement(code) {
            var _this = _super.call(this, dmt.KT.UnaryDecrement, code) || this;
            _this.type = "--...";
            _this.enterType = dmt.KT.Decrement;
            _this.isValue = true;
            return _this;
        }
        UnaryDecrement.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var aval = this.code.V(a, tk, ctk, ps);
            var val = --aval;
            dmt.Assign.AssignValue(a, tk, aval, ctk, ps, this.code);
            return val;
        };
        return UnaryDecrement;
    }(dmt.Handle));
    dmt.UnaryDecrement = UnaryDecrement;
    __reflect(UnaryDecrement.prototype, "dmt.UnaryDecrement");
    var TypeOf = (function (_super) {
        __extends(TypeOf, _super);
        function TypeOf(code) {
            var _this = _super.call(this, dmt.KT.Typeof, code) || this;
            _this.type = "typeof ...";
            _this.isValue = true;
            return _this;
        }
        TypeOf.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var val = this.code.V(a, tk, ctk, ps);
            return typeof val;
        };
        return TypeOf;
    }(dmt.Handle));
    dmt.TypeOf = TypeOf;
    __reflect(TypeOf.prototype, "dmt.TypeOf");
    var Void = (function (_super) {
        __extends(Void, _super);
        function Void(code) {
            var _this = _super.call(this, dmt.KT.Void, code) || this;
            _this.type = "void ...";
            _this.isValue = true;
            return _this;
        }
        Void.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var val = this.code.V(a, tk, ctk, ps);
            return void val;
        };
        return Void;
    }(dmt.Handle));
    dmt.Void = Void;
    __reflect(Void.prototype, "dmt.Void");
    var Delete = (function (_super) {
        __extends(Delete, _super);
        function Delete(code) {
            var _this = _super.call(this, dmt.KT.Delete, code) || this;
            _this.type = "delete ...";
            _this.isValue = true;
            return _this;
        }
        Delete.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0].tks[0];
            var b = tk.tks[0].tks[1];
            var val = this.code.V(a, tk, ctk, ps);
            if (b.type == dmt.KT.PeriodVal) {
                var key = this.code.V(b, tk, ctk, ps);
                return delete val[key];
            }
            else if (b.type == dmt.KT.Bracket) {
                var key = this.code.V(b.tks[0], tk, ctk, ps);
                return delete val[key];
            }
            else {
                var key = b.val;
                return delete val[key];
            }
        };
        return Delete;
    }(dmt.Handle));
    dmt.Delete = Delete;
    __reflect(Delete.prototype, "dmt.Delete");
})(dmt || (dmt = {}));
//功能完成，暂时注释
// ///<reference path="Arithmetic.ts" />
// namespace dmt {
//     export class Handle12 extends Arithmetic {
//         public constructor(code: CodeHandle) {
//             super(code, [
//                 new Shi(code),
//                 new Shr(code),
//                 new UnsignedShr(code)
//             ]);
//         }
//     }
//     export class Shi extends Handle {
//         public type = "...<<...";
//         public constructor(code: CodeHandle) {
//             super(KT.Shi, code);
//             this.isValue = true;
//         }
//         public V(tk: Token, ctk: Token, ps: Object): any {
//             let a = this.code.V(tk.tks[0], ctk,ps);
//             let b = this.code.V(tk.tks[1], ctk, ps);
//             return a << b;
//         }
//     }
//     export class Shr extends Handle {
//         public type = "...>>...";
//         public constructor(code: CodeHandle) {
//             super(KT.Shr, code);
//             this.isValue = true;
//         }
//         public V(tk: Token, ctk: Token, ps: Object): any {
//             let a = this.code.V(tk.tks[0], ctk,ps);
//             let b = this.code.V(tk.tks[1], ctk, ps);
//             return a >> b;
//         }
//     }
//     export class UnsignedShr extends Handle {
//         public type = "...>>>...";
//         public constructor(code: CodeHandle) {
//             super(KT.UnsignedShr, code);
//             this.isValue = true;
//         }
//         public V(tk: Token, ctk: Token, ps: Object): any {
//             let a = this.code.V(tk.tks[0], ctk,ps);
//             let b = this.code.V(tk.tks[1], ctk,ps);
//             return a >>> b;
//         }
//     }
// } 
var dmt;
(function (dmt) {
    var Express = (function () {
        /**
         * type:类型
         * identifyType:入口识别的类型
         * preTokenTypes:识别正确后，往前识别的类型
         * pairsType:与identifyType，成对的type，比如：{}
         * **/
        function Express(type, identifyType, preTokenTypes, pairsType) {
            if (preTokenTypes === void 0) { preTokenTypes = null; }
            if (pairsType === void 0) { pairsType = dmt.KT.None; }
            this.type = type;
            this.identifyType = identifyType;
            this.pairsType = pairsType;
            this.preTokenTypes = preTokenTypes;
        }
        Express.prototype.CheckIdentifyType = function (tk, tks, index) {
            if (this.identifyType instanceof Function) {
                return this.identifyType(tk, tks, index, this);
            }
            else {
                var val = (tk.type == this.identifyType || this.type == dmt.KT.AnyOne);
                if (val) {
                    return dmt.ECT.OK;
                }
                else {
                    return dmt.ECT.Fail;
                }
            }
        };
        Express.prototype.CheckPairsType = function (tk) {
            if (this.pairsType instanceof Function) {
                return this.pairsType(tk, this);
            }
            else {
                var val = (tk.type == this.pairsType || this.pairsType == dmt.KT.AnyOne);
                if (val) {
                    return dmt.ECT.OK;
                }
                else {
                    return dmt.ECT.Fail;
                }
            }
        };
        Express.prototype.CheckPreType = function (tk, index) {
            if (!tk) {
                return dmt.ECT.Fail;
            }
            var preTokenType = this.preTokenTypes[index];
            if (preTokenType instanceof Function) {
                return preTokenType(tk, this);
            }
            else {
                var val = (tk.type == preTokenType || preTokenType == dmt.KT.AnyOne);
                if (val) {
                    return dmt.ECT.OK;
                }
                else {
                    return dmt.ECT.Fail;
                }
            }
        };
        //ExpressByExpresss
        Express.Exps = function (tks, bIndex, exp, type, handle, extraHandle) {
            if (extraHandle === void 0) { extraHandle = null; }
            var newTokens;
            var expressIndex = 0;
            var endTokenIndex = -1;
            var beginTokenIndex = -1;
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                var express = exp[expressIndex];
                if (!express) {
                    return beginTokenIndex + 1;
                }
                if (newTokens) {
                    var checkType = express.CheckIdentifyType(tk, tks, i);
                    if (checkType == dmt.ECT.OK
                        || checkType == dmt.ECT.OKStay
                        || checkType == dmt.ECT.OKSkip
                        || checkType == dmt.ECT.OKSkipStay) {
                        if (checkType != dmt.ECT.OKSkip
                            && checkType != dmt.ECT.OKSkipStay) {
                            newTokens.push(tk);
                        }
                        if (checkType != dmt.ECT.OKStay
                            && checkType != dmt.ECT.OKSkipStay) {
                            expressIndex++;
                        }
                        if (expressIndex >= exp.length) {
                            if (checkType == dmt.ECT.OKSkip
                                || checkType == dmt.ECT.OKSkipStay) {
                                endTokenIndex = i - 1;
                            }
                            else {
                                endTokenIndex = i;
                            }
                            break;
                        }
                    }
                    else {
                        if (express.identifyType instanceof Function && type != dmt.KT.QuestionMark && type != dmt.KT.AngleBracket) {
                            console.warn("something maybe wrong: ", dmt.KT[type], handle);
                        }
                        return bIndex + 1;
                    }
                }
                else {
                    var checkType = express.CheckIdentifyType(tk, tks, i);
                    if (checkType == dmt.ECT.OK
                        || checkType == dmt.ECT.OKStay
                        || checkType == dmt.ECT.OKSkip
                        || checkType == dmt.ECT.OKSkipStay) {
                        newTokens = [];
                        beginTokenIndex = i;
                        if (express.preTokenTypes && express.preTokenTypes.length > 0) {
                            for (var p = 0, len_1 = express.preTokenTypes.length; p < len_1; p++) {
                                var preToken = tks[bIndex - (len_1 - p)];
                                if (express.CheckPreType(preToken, p) == dmt.ECT.OK) {
                                    newTokens.push(preToken);
                                }
                                else {
                                    return bIndex + 1;
                                }
                            }
                            beginTokenIndex -= express.preTokenTypes.length;
                        }
                        if (checkType != dmt.ECT.OKSkip
                            && checkType != dmt.ECT.OKSkipStay) {
                            newTokens.push(tk);
                        }
                        if (checkType != dmt.ECT.OKStay
                            && checkType != dmt.ECT.OKSkipStay) {
                            expressIndex++;
                        }
                        if (expressIndex >= exp.length) {
                            endTokenIndex = i;
                            break;
                        }
                    }
                    else {
                        return bIndex + 1;
                    }
                }
            }
            if (beginTokenIndex >= 0 && endTokenIndex >= beginTokenIndex) {
                var t = handle.code.InsertToken(tks, type, newTokens, beginTokenIndex, endTokenIndex, handle);
                if (extraHandle) {
                    extraHandle(t);
                }
                return beginTokenIndex + 1;
            }
            return -1;
        };
        Express.ExpressPairs = function (tks, bIndex, express, handle, extraHandle) {
            if (extraHandle === void 0) { extraHandle = null; }
            var newTokens = null;
            var beginTokenIndex = 0;
            var inPairs;
            var pairsIndex = 0;
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (inPairs) {
                    if (express.CheckIdentifyType(tk, tks, i) == dmt.ECT.OK) {
                        pairsIndex++;
                        newTokens.push(tk);
                    }
                    else if (express.CheckPairsType(tk) == dmt.ECT.OK) {
                        pairsIndex--;
                        if (pairsIndex <= 0) {
                            var endTokenIndex = i;
                            var t = handle.code.InsertToken(tks, express.type, newTokens, beginTokenIndex, endTokenIndex, handle);
                            //code.Express(newTokens);//这里不能执行，需要用到的时候执行，不然无法判断{}对象是方法还是json，()里面是参数还是计算等
                            if (extraHandle) {
                                extraHandle(t);
                            }
                            return bIndex + 1;
                        }
                        newTokens.push(tk);
                    }
                    else {
                        newTokens.push(tk);
                    }
                }
                else if (express.CheckIdentifyType(tk, tks, i) == dmt.ECT.OK) {
                    inPairs = true;
                    newTokens = [];
                    beginTokenIndex = i;
                    pairsIndex = 1;
                }
            }
            return -1;
        };
        return Express;
    }());
    dmt.Express = Express;
    __reflect(Express.prototype, "dmt.Express");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var PairsExtraHandle = (function (_super) {
        __extends(PairsExtraHandle, _super);
        function PairsExtraHandle(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        PairsExtraHandle.prototype.Exp = function (me, tks, bIndex) {
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    var handle = this.handles[tk.name];
                    var v = handle.Exp(me, tks, i);
                    if (v) {
                        return v;
                    }
                }
            }
            return -1;
        };
        return PairsExtraHandle;
    }(dmt.Handle));
    dmt.PairsExtraHandle = PairsExtraHandle;
    __reflect(PairsExtraHandle.prototype, "dmt.PairsExtraHandle");
    var PairsExtra = (function (_super) {
        __extends(PairsExtra, _super);
        function PairsExtra(code) {
            return _super.call(this, code, [
                new AssignUnsignedShrPair(code),
                new AssignShrPair(code),
                new GreaterOrEqualPair(code),
                new AssignShiPair(code),
                new LessOrEqualPair(code),
            ]) || this;
        }
        return PairsExtra;
    }(dmt.PairsHandle));
    dmt.PairsExtra = PairsExtra;
    __reflect(PairsExtra.prototype, "dmt.PairsExtra");
    var AssignUnsignedShrPair = (function (_super) {
        __extends(AssignUnsignedShrPair, _super);
        function AssignUnsignedShrPair(code) {
            var _this = _super.call(this, dmt.KT.AssignUnsignedShr, code) || this;
            _this.type = ">>>=";
            _this.enterType = dmt.KT.UnsignedShr;
            _this.exp = [
                new dmt.Express(dmt.KT.UnsignedShr, dmt.KT.UnsignedShr),
                new dmt.Express(dmt.KT.Assign, dmt.KT.Assign)
            ];
            return _this;
        }
        AssignUnsignedShrPair.prototype.V = function (tk, ctk, ps) {
            return tk;
        };
        AssignUnsignedShrPair.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return AssignUnsignedShrPair;
    }(dmt.Handle));
    dmt.AssignUnsignedShrPair = AssignUnsignedShrPair;
    __reflect(AssignUnsignedShrPair.prototype, "dmt.AssignUnsignedShrPair");
    var AssignShrPair = (function (_super) {
        __extends(AssignShrPair, _super);
        function AssignShrPair(code) {
            var _this = _super.call(this, dmt.KT.AssignShr, code) || this;
            _this.type = ">>=";
            _this.enterType = dmt.KT.Shr;
            _this.exp = [
                new dmt.Express(dmt.KT.Shr, dmt.KT.Shr),
                new dmt.Express(dmt.KT.Assign, dmt.KT.Assign)
            ];
            return _this;
        }
        AssignShrPair.prototype.V = function (tk, ctk, ps) {
            return tk;
        };
        AssignShrPair.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return AssignShrPair;
    }(dmt.Handle));
    dmt.AssignShrPair = AssignShrPair;
    __reflect(AssignShrPair.prototype, "dmt.AssignShrPair");
    var GreaterOrEqualPair = (function (_super) {
        __extends(GreaterOrEqualPair, _super);
        function GreaterOrEqualPair(code) {
            var _this = _super.call(this, dmt.KT.GreaterOrEqual, code) || this;
            _this.type = ">=";
            _this.enterType = dmt.KT.Greater;
            _this.exp = [
                new dmt.Express(dmt.KT.Greater, dmt.KT.Greater),
                new dmt.Express(dmt.KT.Assign, dmt.KT.Assign)
            ];
            return _this;
        }
        GreaterOrEqualPair.prototype.V = function (tk, ctk, ps) {
            return tk;
        };
        GreaterOrEqualPair.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return GreaterOrEqualPair;
    }(dmt.Handle));
    dmt.GreaterOrEqualPair = GreaterOrEqualPair;
    __reflect(GreaterOrEqualPair.prototype, "dmt.GreaterOrEqualPair");
    var AssignShiPair = (function (_super) {
        __extends(AssignShiPair, _super);
        function AssignShiPair(code) {
            var _this = _super.call(this, dmt.KT.AssignShi, code) || this;
            _this.type = "<<=";
            _this.enterType = dmt.KT.Shi;
            _this.exp = [
                new dmt.Express(dmt.KT.Shi, dmt.KT.Shi),
                new dmt.Express(dmt.KT.Assign, dmt.KT.Assign)
            ];
            return _this;
        }
        AssignShiPair.prototype.V = function (tk, ctk, ps) {
            return tk;
        };
        AssignShiPair.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return AssignShiPair;
    }(dmt.Handle));
    dmt.AssignShiPair = AssignShiPair;
    __reflect(AssignShiPair.prototype, "dmt.AssignShiPair");
    var LessOrEqualPair = (function (_super) {
        __extends(LessOrEqualPair, _super);
        function LessOrEqualPair(code) {
            var _this = _super.call(this, dmt.KT.LessOrEqual, code) || this;
            _this.type = "<=";
            _this.enterType = dmt.KT.Less;
            _this.exp = [
                new dmt.Express(dmt.KT.Less, dmt.KT.Less),
                new dmt.Express(dmt.KT.Assign, dmt.KT.Assign)
            ];
            return _this;
        }
        LessOrEqualPair.prototype.V = function (tk, ctk, ps) {
            return tk;
        };
        LessOrEqualPair.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (tk) {
                tk.isParser = true;
            });
        };
        return LessOrEqualPair;
    }(dmt.Handle));
    dmt.LessOrEqualPair = LessOrEqualPair;
    __reflect(LessOrEqualPair.prototype, "dmt.LessOrEqualPair");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Property = (function (_super) {
        __extends(Property, _super);
        function Property(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        Property.prototype.Exp = function (me, tks, bIndex) {
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    var handle = this.handles[tk.name];
                    if (handle.exp) {
                        var v = handle.Exp(me, tks, i);
                        if (v) {
                            return v;
                        }
                    }
                    else {
                        return dmt.Handle.ExpAB(tks, i, tk.type, this.handles[tk.name]);
                    }
                }
            }
            return -1;
        };
        return Property;
    }(dmt.Handle));
    dmt.Property = Property;
    __reflect(Property.prototype, "dmt.Property");
    var Handle19 = (function (_super) {
        __extends(Handle19, _super);
        function Handle19(code) {
            return _super.call(this, code, [
                new dmt.New(code),
            ]) || this;
        }
        return Handle19;
    }(Property));
    dmt.Handle19 = Handle19;
    __reflect(Handle19.prototype, "dmt.Handle19");
    var Handle19After = (function (_super) {
        __extends(Handle19After, _super);
        function Handle19After(code) {
            return _super.call(this, code, [
                new Period(code),
                new Bracket(code),
                new dmt.Call(code),
            ]) || this;
        }
        return Handle19After;
    }(Property));
    dmt.Handle19After = Handle19After;
    __reflect(Handle19After.prototype, "dmt.Handle19After");
    var Period = (function (_super) {
        __extends(Period, _super);
        function Period(code) {
            var _this = _super.call(this, dmt.KT.PeriodKeyVal, code) || this;
            _this.type = ".......";
            _this.enterType = dmt.KT.PeriodVal;
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.PeriodVal, dmt.KT.PeriodVal, [function (t, express) {
                        if (t && t.isValue) {
                            return dmt.ECT.OK;
                        }
                        else {
                            return dmt.ECT.Fail;
                        }
                    }])
            ];
            return _this;
        }
        Period.prototype.ValueA = function (tk, ctk, ps) {
            var a = tk.tks[0];
            if (a.type == dmt.KT.Super) {
                var that = this.code.GetThis(ps);
                return that;
            }
            else if (a.type == dmt.KT.This) {
                var that = this.code.GetThis(ps);
                return that;
            }
            var val = this.code.V(a, tk, ctk, ps);
            return val;
        };
        Period.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            b = b.tks[b.tks.length - 1];
            if (a.type == dmt.KT.Super) {
                var key = b.val;
                var $super = this.code.GetSuper(tk, ps);
                var val = $super[key];
                if (val == dmt.Token.void0) {
                    var that = this.code.GetThis(ps);
                    val = that[key];
                }
                return val;
            }
            else if (a.type == dmt.KT.This) {
                var key = b.val;
                var that = this.code.GetThis(ps);
                var val = that[key];
                return val;
            }
            else {
                var cls = this.code.V(a, tk, ctk, ps);
                //这里要考虑继承问题，还需要考虑扩展函数
                var val = this.code.V(b, tk, ctk, cls, false);
                return val;
            }
        };
        Period.prototype.SetValue = function (tk, caller, val, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            b = b.tks[b.tks.length - 1];
            if (a.type == dmt.KT.Super || a.type == dmt.KT.This) {
                var key = b.val;
                var that = this.code.GetThis(ps);
                that[key] = val;
            }
            else {
                var key = b.val;
                var cls = this.code.V(a, caller, ctk, ps);
                if (cls instanceof dmt.Token) {
                    this.code.SetParmsValue(key, val, ctk, cls);
                }
                else {
                    cls[key] = val;
                }
            }
        };
        return Period;
    }(dmt.Handle));
    dmt.Period = Period;
    __reflect(Period.prototype, "dmt.Period");
    var Bracket = (function (_super) {
        __extends(Bracket, _super);
        function Bracket(code) {
            var _this = _super.call(this, dmt.KT.Bracket, code) || this;
            _this.type = "...[...]";
            _this.code = code;
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.Bracket, dmt.KT.Bracket, [function (t, express) {
                        if (t && t.isValue) {
                            return dmt.ECT.OK;
                        }
                        else {
                            return dmt.ECT.Fail;
                        }
                    }])
            ];
            return _this;
        }
        Bracket.prototype.ValueA = function (tk, ctk, ps) {
            var a = tk.tks[0];
            if (a.type == dmt.KT.Super) {
                var that = this.code.GetThis(ps);
                return that;
            }
            else if (a.type == dmt.KT.This) {
                var that = this.code.GetThis(ps);
                return that;
            }
            var val = this.code.V(a, tk, ctk, ps);
            return val;
        };
        Bracket.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var keys = this.code.V(b, tk, ctk, ps);
            var key = keys[keys.length - 1];
            if (a.type == dmt.KT.Super) {
                var $super = this.code.GetSuper(tk, ps);
                var val = $super[key];
                if (val == dmt.Token.void0) {
                    var that = this.code.GetThis(ps);
                    val = that[key];
                }
                return val;
            }
            else if (a.type == dmt.KT.This) {
                var that = this.code.GetThis(ps);
                var val = that[key];
                return val;
            }
            else {
                //这里和.......不一样需要独立处理
                var cls = this.code.V(a, tk, ctk, ps);
                var val = this.code.GetParmsValue(key, cls, false);
                return val;
            }
        };
        Bracket.prototype.SetValue = function (tk, caller, val, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var keys = this.code.V(b, tk, ctk, ps);
            var key = keys[keys.length - 1];
            if (a.type == dmt.KT.Super || a.type == dmt.KT.This) {
                var that = this.code.GetThis(ps); //this和super的赋值都是一样的，只能对this进行赋值
                that[key] = val;
            }
            else {
                //这里和.......不一样需要独立处理
                var cls = this.code.V(a, caller, ctk, ps);
                if (cls instanceof dmt.Token) {
                    this.code.SetParmsValue(key, val, ctk, cls);
                }
                else {
                    cls[key] = val;
                }
                //this.code.SetParmsValue(key, val, ctk, cls);
            }
        };
        return Bracket;
    }(dmt.Handle));
    dmt.Bracket = Bracket;
    __reflect(Bracket.prototype, "dmt.Bracket");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Statement = (function (_super) {
        __extends(Statement, _super);
        function Statement(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        Statement.prototype.Exp = function (me, tks, bIndex) {
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.isParser && this.handles.hasOwnProperty(tk.name)) {
                    var handle = this.handles[tk.name];
                    var v = handle.Exp(me, tks, i);
                    if (v) {
                        return v;
                    }
                }
            }
            return -1;
        };
        return Statement;
    }(dmt.Handle));
    dmt.Statement = Statement;
    __reflect(Statement.prototype, "dmt.Statement");
    var HandleStatement = (function (_super) {
        __extends(HandleStatement, _super);
        function HandleStatement(code) {
            return _super.call(this, code, [
                new dmt.Try(code),
                new dmt.Catch(code),
                new dmt.If(code),
                new dmt.ElseIf(code),
                new dmt.Else(code),
                new dmt.For(code),
                new dmt.While(code),
            ]) || this;
        }
        return HandleStatement;
    }(Statement));
    dmt.HandleStatement = HandleStatement;
    __reflect(HandleStatement.prototype, "dmt.HandleStatement");
    var HandleAfterStatement = (function (_super) {
        __extends(HandleAfterStatement, _super);
        function HandleAfterStatement(code) {
            return _super.call(this, code, [
                new dmt.TryVal(code),
                new dmt.IfVal(code),
            ]) || this;
        }
        return HandleAfterStatement;
    }(Statement));
    dmt.HandleAfterStatement = HandleAfterStatement;
    __reflect(HandleAfterStatement.prototype, "dmt.HandleAfterStatement");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var VariateSingle = (function (_super) {
        __extends(VariateSingle, _super);
        function VariateSingle(code, handles) {
            var _this = _super.call(this, dmt.KT.None, code) || this;
            _this.handles = {};
            handles.forEach(function (fi) {
                _this.handles[fi.enterName] = fi;
            });
            return _this;
        }
        VariateSingle.prototype.Exp = function (me, tks, bIndex) {
            var _loop_2 = function (i, len) {
                var tk = tks[i];
                if (tk.isParser && this_2.handles.hasOwnProperty(tk.name)) {
                    var handle = this_2.handles[tk.name];
                    if (handle.exp) {
                        var v = handle.Exp(me, tks, i);
                        if (v) {
                            return { value: v };
                        }
                    }
                    else {
                        var exp = VariateSingle.expressList[tk.type];
                        if (!exp) {
                            exp = [
                                new dmt.Express(tk.type, function (t, tks, index, express) {
                                    if (t.type == tk.type) {
                                        return dmt.ECT.OKSkip;
                                    }
                                    else {
                                        return dmt.ECT.Fail;
                                    }
                                }),
                                new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)
                            ];
                            VariateSingle.expressList[tk.type] = exp;
                        }
                        var index = dmt.Express.Exps(tks, i, exp, tk.type, handle, function (t) {
                            t.val = t.tks[0].val;
                        });
                        return { value: index };
                    }
                }
            };
            var this_2 = this;
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var state_2 = _loop_2(i, len);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
            return -1;
        };
        VariateSingle.prototype.AfterExpress = function (me, tks) {
            for (var fi in this.handles) {
                this.handles[fi].AfterExpress(me, tks);
            }
        };
        VariateSingle.expressList = {};
        return VariateSingle;
    }(dmt.Handle));
    dmt.VariateSingle = VariateSingle;
    __reflect(VariateSingle.prototype, "dmt.VariateSingle");
    var HandleVariateSingle = (function (_super) {
        __extends(HandleVariateSingle, _super);
        function HandleVariateSingle(code) {
            return _super.call(this, code, [
                new VarVariate(code),
                new LetVariate(code),
                new ConstVariate(code),
                new FunctionVariate(code),
                new PeriodVariate(code),
                new ClassVariate(code),
                new InterfaceVariate(code),
                new AbstractVariate(code),
            ]) || this;
        }
        return HandleVariateSingle;
    }(VariateSingle));
    dmt.HandleVariateSingle = HandleVariateSingle;
    __reflect(HandleVariateSingle.prototype, "dmt.HandleVariateSingle");
    var HandleVariateLater = (function (_super) {
        __extends(HandleVariateLater, _super);
        function HandleVariateLater(code) {
            return _super.call(this, code, [
                new ExtendsVariate(code),
                new ImplementsVariate(code),
                new ParamsVariate(code),
                new dmt.AsVariate(code),
            ]) || this;
        }
        return HandleVariateLater;
    }(VariateSingle));
    dmt.HandleVariateLater = HandleVariateLater;
    __reflect(HandleVariateLater.prototype, "dmt.HandleVariateLater");
    var HandleVariateEarly = (function (_super) {
        __extends(HandleVariateEarly, _super);
        function HandleVariateEarly(code) {
            return _super.call(this, code, [
                new CaseVariate(code),
                new DefaultVariate(code),
            ]) || this;
        }
        return HandleVariateEarly;
    }(VariateSingle));
    dmt.HandleVariateEarly = HandleVariateEarly;
    __reflect(HandleVariateEarly.prototype, "dmt.HandleVariateEarly");
    var VarVariate = (function (_super) {
        __extends(VarVariate, _super);
        function VarVariate(code) {
            var _this = _super.call(this, dmt.KT.Var, code) || this;
            _this.type = "var ...";
            _this.isValue = true;
            return _this;
        }
        VarVariate.prototype.V = function (tk, ctk, ps) {
            ps[tk.val] = undefined;
            return tk.val;
        };
        return VarVariate;
    }(dmt.Handle));
    dmt.VarVariate = VarVariate;
    __reflect(VarVariate.prototype, "dmt.VarVariate");
    var LetVariate = (function (_super) {
        __extends(LetVariate, _super);
        function LetVariate(code) {
            var _this = _super.call(this, dmt.KT.Let, code) || this;
            _this.type = "Let ...";
            _this.isValue = true;
            return _this;
        }
        LetVariate.prototype.V = function (tk, ctk, ps) {
            ps[tk.val] = undefined;
            return tk.val;
        };
        return LetVariate;
    }(dmt.Handle));
    dmt.LetVariate = LetVariate;
    __reflect(LetVariate.prototype, "dmt.LetVariate");
    var ConstVariate = (function (_super) {
        __extends(ConstVariate, _super);
        function ConstVariate(code) {
            var _this = _super.call(this, dmt.KT.Const, code) || this;
            _this.type = "const ...";
            _this.isValue = true;
            return _this;
        }
        ConstVariate.prototype.V = function (tk, ctk, ps) {
            ps[tk.val] = undefined;
            return tk.val;
        };
        return ConstVariate;
    }(dmt.Handle));
    dmt.ConstVariate = ConstVariate;
    __reflect(ConstVariate.prototype, "dmt.ConstVariate");
    var ClassVariate = (function (_super) {
        __extends(ClassVariate, _super);
        function ClassVariate(code) {
            var _this = _super.call(this, dmt.KT.Class, code) || this;
            _this.type = "class ...";
            _this.exp = [
                new dmt.Express(dmt.KT.Class, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Class) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        ClassVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        ClassVariate.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.isParser = true;
            });
        };
        ClassVariate.prototype.AfterExpress = function (me, tks) {
            for (var i = 0, len = me.tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.type == dmt.KT.Class) {
                    if (tk.tks) {
                        ClassVariate.DelAngleBracket(tk.tks, 0);
                    }
                    else {
                        //this.code.Error(tk, null, "Class is empty");
                    }
                }
            }
        };
        ClassVariate.DelAngleBracket = function (tks, bIndex) {
            if (bIndex < 0) {
                return;
            }
            var inAngleBracket = false;
            var angleBracketIndex = 0;
            var beginTokenIndex = 0;
            for (var i = bIndex, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (inAngleBracket) {
                    if (tk.type == dmt.KT.Less) {
                        angleBracketIndex++;
                    }
                    else if (tk.type == dmt.KT.Greater) {
                        angleBracketIndex--;
                        if (angleBracketIndex <= 0) {
                            var endTokenIndex = i;
                            tks.splice(beginTokenIndex, endTokenIndex - beginTokenIndex + 1);
                            ClassVariate.DelAngleBracket(tks, beginTokenIndex + 1);
                            return;
                        }
                    }
                }
                else {
                    if (tk.type == dmt.KT.Less) {
                        beginTokenIndex = i;
                        inAngleBracket = true;
                        angleBracketIndex = 1;
                    }
                }
            }
        };
        return ClassVariate;
    }(dmt.Handle));
    dmt.ClassVariate = ClassVariate;
    __reflect(ClassVariate.prototype, "dmt.ClassVariate");
    var InterfaceVariate = (function (_super) {
        __extends(InterfaceVariate, _super);
        function InterfaceVariate(code) {
            var _this = _super.call(this, dmt.KT.Interface, code) || this;
            _this.type = "interface ...";
            _this.exp = [
                new dmt.Express(dmt.KT.Interface, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Interface) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        InterfaceVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        InterfaceVariate.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.isParser = true;
            });
        };
        InterfaceVariate.prototype.AfterExpress = function (me, tks) {
            for (var i = 0, len = me.tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.type == dmt.KT.Interface) {
                    if (tk.tks) {
                        ClassVariate.DelAngleBracket(tk.tks, 0);
                    }
                    else {
                        //this.code.Error(tk, null, "Class is empty");
                    }
                }
            }
        };
        return InterfaceVariate;
    }(dmt.Handle));
    dmt.InterfaceVariate = InterfaceVariate;
    __reflect(InterfaceVariate.prototype, "dmt.InterfaceVariate");
    var AbstractVariate = (function (_super) {
        __extends(AbstractVariate, _super);
        function AbstractVariate(code) {
            var _this = _super.call(this, dmt.KT.Abstract, code) || this;
            _this.type = "abstract ...";
            _this.exp = [
                new dmt.Express(dmt.KT.Abstract, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Abstract) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        AbstractVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        AbstractVariate.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.isParser = true;
            });
        };
        AbstractVariate.prototype.AfterExpress = function (me, tks) {
            for (var i = 0, len = me.tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.type == dmt.KT.Interface) {
                    if (tk.tks) {
                        ClassVariate.DelAngleBracket(tk.tks, 0);
                    }
                    else {
                        //this.code.Error(tk, null, "Class is empty");
                    }
                }
            }
        };
        return AbstractVariate;
    }(dmt.Handle));
    dmt.AbstractVariate = AbstractVariate;
    __reflect(AbstractVariate.prototype, "dmt.AbstractVariate");
    var PeriodVariate = (function (_super) {
        __extends(PeriodVariate, _super);
        function PeriodVariate(code) {
            var _this = _super.call(this, dmt.KT.PeriodVal, code) || this;
            _this.type = "....";
            _this.enterType = dmt.KT.Period;
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.Period, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Period) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)
            ];
            return _this;
        }
        PeriodVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        PeriodVariate.prototype.Exp = function (me, tks, bIndex) {
            var index = dmt.Express.Exps(tks, bIndex, this.exp, dmt.KT.PeriodVal, this, function (t) {
                t.isParser = true;
            });
            return index;
        };
        return PeriodVariate;
    }(dmt.Handle));
    dmt.PeriodVariate = PeriodVariate;
    __reflect(PeriodVariate.prototype, "dmt.PeriodVariate");
    var FunctionVariate = (function (_super) {
        __extends(FunctionVariate, _super);
        function FunctionVariate(code) {
            var _this = _super.call(this, dmt.KT.Function, code) || this;
            _this.type = "function ...";
            _this.isValue = true;
            return _this;
        }
        FunctionVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        return FunctionVariate;
    }(dmt.Handle));
    dmt.FunctionVariate = FunctionVariate;
    __reflect(FunctionVariate.prototype, "dmt.FunctionVariate");
    var ExtendsVariate = (function (_super) {
        __extends(ExtendsVariate, _super);
        function ExtendsVariate(code) {
            var _this = _super.call(this, dmt.KT.Extends, code) || this;
            _this.type = "extends ...";
            return _this;
        }
        ExtendsVariate.prototype.V = function (tk, ctk, ps) {
            return this.code.V(tk.tks[0], tk, ctk, ps);
        };
        return ExtendsVariate;
    }(dmt.Handle));
    dmt.ExtendsVariate = ExtendsVariate;
    __reflect(ExtendsVariate.prototype, "dmt.ExtendsVariate");
    var ImplementsVariate = (function (_super) {
        __extends(ImplementsVariate, _super);
        function ImplementsVariate(code) {
            var _this = _super.call(this, dmt.KT.Implements, code) || this;
            _this.type = "implements ...";
            return _this;
        }
        ImplementsVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        return ImplementsVariate;
    }(dmt.Handle));
    dmt.ImplementsVariate = ImplementsVariate;
    __reflect(ImplementsVariate.prototype, "dmt.ImplementsVariate");
    var ParamsVariate = (function (_super) {
        __extends(ParamsVariate, _super);
        function ParamsVariate(code) {
            var _this = _super.call(this, dmt.KT.Params, code) || this;
            _this.type = "... ...";
            return _this;
        }
        ParamsVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        return ParamsVariate;
    }(dmt.Handle));
    dmt.ParamsVariate = ParamsVariate;
    __reflect(ParamsVariate.prototype, "dmt.ParamsVariate");
    var CaseVariate = (function (_super) {
        __extends(CaseVariate, _super);
        function CaseVariate(code) {
            var _this = _super.call(this, dmt.KT.CaseVal, code) || this;
            _this.type = "case ...:";
            _this.enterType = dmt.KT.Case;
            _this.exp = [
                new dmt.Express(dmt.KT.Case, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Case) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Colon) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    return dmt.ECT.OKSkip;
                })
            ];
            return _this;
        }
        CaseVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        CaseVariate.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.isParser = true;
            });
        };
        return CaseVariate;
    }(dmt.Handle));
    dmt.CaseVariate = CaseVariate;
    __reflect(CaseVariate.prototype, "dmt.CaseVariate");
    var DefaultVariate = (function (_super) {
        __extends(DefaultVariate, _super);
        function DefaultVariate(code) {
            var _this = _super.call(this, dmt.KT.DefaultVal, code) || this;
            _this.type = "default ...";
            _this.enterType = dmt.KT.Default;
            _this.exp = [
                new dmt.Express(dmt.KT.Default, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Default) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Colon) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    return dmt.ECT.OKSkip;
                })
            ];
            return _this;
        }
        DefaultVariate.prototype.V = function (tk, ctk, ps) {
            return tk.tks[0].val;
        };
        DefaultVariate.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.isParser = true;
            });
        };
        return DefaultVariate;
    }(dmt.Handle));
    dmt.DefaultVariate = DefaultVariate;
    __reflect(DefaultVariate.prototype, "dmt.DefaultVariate");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Abstract = (function (_super) {
        __extends(Abstract, _super);
        function Abstract(code) {
            var _this = _super.call(this, dmt.KT.Abstract, code) || this;
            _this.type = "abstract ...(...){}";
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.Abstract, dmt.KT.Abstract),
                new dmt.Express(dmt.KT.Brace, dmt.KT.Brace)
            ];
            return _this;
        }
        Abstract.prototype.V = function (tk, ctk, ps) {
            //TODO:
            return null;
        };
        return Abstract;
    }(dmt.Handle));
    dmt.Abstract = Abstract;
    __reflect(Abstract.prototype, "dmt.Abstract");
})(dmt || (dmt = {}));
// Any
// Never 
var dmt;
(function (dmt) {
    var AsVariate = (function (_super) {
        __extends(AsVariate, _super);
        function AsVariate(code) {
            var _this = _super.call(this, dmt.KT.As, code) || this;
            _this.type = "as ...";
            return _this;
        }
        AsVariate.prototype.AfterExpress = function (me, tks) {
            for (var i = tks.length - 1; i >= 0; i--) {
                var tk = tks[i];
                if (tk.type == dmt.KT.As) {
                    tks.splice(i, 1);
                }
            }
        };
        return AsVariate;
    }(dmt.Handle));
    dmt.AsVariate = AsVariate;
    __reflect(AsVariate.prototype, "dmt.AsVariate");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Async = (function (_super) {
        __extends(Async, _super);
        function Async(code) {
            var _this = _super.call(this, dmt.KT.Async, code) || this;
            _this.type = "async ...";
            return _this;
        }
        Async.prototype.V = function (tk, ctk, ps) {
            //TODO:
            return null;
        };
        return Async;
    }(dmt.Handle));
    dmt.Async = Async;
    __reflect(Async.prototype, "dmt.Async");
    var Await = (function (_super) {
        __extends(Await, _super);
        function Await(code) {
            var _this = _super.call(this, dmt.KT.Await, code) || this;
            _this.type = "await ...";
            return _this;
        }
        Await.prototype.V = function (tk, ctk, ps) {
            //TODO:
            return null;
        };
        return Await;
    }(dmt.Handle));
    dmt.Await = Await;
    __reflect(Await.prototype, "dmt.Await");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Break = (function (_super) {
        __extends(Break, _super);
        function Break(code) {
            var _this = _super.call(this, dmt.KT.Break, code) || this;
            _this.type = "break";
            _this.exp = [
                new dmt.Express(dmt.KT.Break, dmt.KT.Break)
            ];
            return _this;
        }
        Break.prototype.V = function (tk, ctk, ps) {
            ctk.signal = this.handleType;
            return tk;
        };
        return Break;
    }(dmt.Handle));
    dmt.Break = Break;
    __reflect(Break.prototype, "dmt.Break");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Continue = (function (_super) {
        __extends(Continue, _super);
        function Continue(code) {
            var _this = _super.call(this, dmt.KT.Continue, code) || this;
            _this.type = "continue";
            _this.exp = [
                new dmt.Express(dmt.KT.Continue, dmt.KT.Continue)
            ];
            return _this;
        }
        Continue.prototype.V = function (tk, ctk, ps) {
            ctk.signal = this.handleType;
            return tk;
        };
        return Continue;
    }(dmt.Handle));
    dmt.Continue = Continue;
    __reflect(Continue.prototype, "dmt.Continue");
})(dmt || (dmt = {}));
//TODO:暂时放后 
//TODO:暂时放后 
var dmt;
(function (dmt) {
    var CodeHandle = (function () {
        function CodeHandle(globalObject, debug, autoBind) {
            if (globalObject === void 0) { globalObject = null; }
            if (debug === void 0) { debug = false; }
            if (autoBind === void 0) { autoBind = true; }
            this.handleKeys = {};
            this.globalCode = []; //全局对象，默认为window
            this.debug = false;
            this.autoBind = false;
            if (!globalObject) {
                globalObject = window;
            }
            this.globalObject = globalObject;
            this.debug = debug;
            this.autoBind = autoBind;
            //https://blog.csdn.net/qq_33576343/article/details/82891208
            this.handles = [
                new dmt.Pairs(this),
                //new Declare(this),
                new dmt.HandleVariateEarly(this),
                new dmt.Colon(this),
                new dmt.PairsExtra(this),
                new dmt.HandleVariateSingle(this),
                new dmt.Handle19(this),
                new dmt.Handle19After(this),
                new dmt.HandleVariateLater(this),
                ////在19操作后面进行语意分析，因为19有一个...(...)的操作和很多操作会冲突
                new dmt.HandleStatement(this),
                new dmt.HandleAfterStatement(this),
                new dmt.Interface(this),
                new dmt.Abstract(this),
                new dmt.Class(this),
                new dmt.FunctionAnonymous(this),
                new dmt.FunctionSymbol(this),
                new dmt._Function(this),
                new dmt.AngleBracketPair(this),
                ////
                //new Handle18(this),//new ...已经合并到New.ts了
                new dmt.Handle17(this),
                new dmt.Handle16(this),
                new dmt.Handle15(this),
                new dmt.Handle14(this),
                new dmt.Handle13(this),
                //new Handle12(this),                
                new dmt.Handle11(this),
                new dmt.Handle10(this),
                new dmt.Combine(this),
                new dmt.XOR(this),
                new dmt.InclusiveOr(this),
                new dmt.And(this),
                new dmt.Or(this),
                new dmt.QuestionMarkHandle(this),
                new dmt.Handle3(this),
                //yield，yield*（非标准，已经废弃）
                //展开运算符（普通的空格）   
                new dmt.Json(this),
                new dmt.Comma(this),
                new dmt.Decorate(this),
            ];
        }
        CodeHandle.prototype.Run = function (tk) {
            this.Express(tk);
            var me = this.Initialize(tk.tks, tk, "");
            this.globalCode.push(me);
            var wx = window["wx"];
            //////////////////////////////
            if (this.globalObject) {
                for (var fi in me.ps) {
                    if (wx) {
                        if (fi != "wx" && fi != "canvas") {
                            this.globalObject[fi] = me.ps[fi];
                        }
                    }
                    else {
                        this.globalObject[fi] = me.ps[fi];
                    }
                }
            }
            //////////////////////////////
            var val = this.CallPreConstructor(me, tk, me.ps);
            //////////////////////////////
            if (this.globalObject) {
                for (var fi in me.ps) {
                    if (wx) {
                        if (fi != "wx" && fi != "canvas") {
                            this.globalObject[fi] = me.ps[fi];
                        }
                    }
                    else {
                        this.globalObject[fi] = me.ps[fi];
                    }
                }
            }
            return val;
        };
        CodeHandle.prototype.CallPreConstructor = function (me, ctk, ps) {
            var tks = me.preConstructor.tks;
            var val;
            for (var i = 0, len = tks.length; i < len; i++) {
                var fi = tks[i];
                val = this.V(fi, me, ctk, ps);
                if (ctk.signal == dmt.KT.Return) {
                    break;
                }
            }
            return val;
            ;
        };
        //ctk用来保存返回状态，比如return break continue
        CodeHandle.prototype.Initialize = function (tks, ctk, name) {
            var me = new dmt.Token(dmt.KT.ClassInstance, dmt.Token.void0);
            var ps = {};
            ps = this.ComParams(ps, ps);
            me.ps = ps;
            me.tks = tks;
            me.preConstructor = new dmt.Token(dmt.KT.PreConstructor, dmt.Token.void0);
            me.preConstructor.tks = [];
            ctk = me;
            ctk.returnVal = dmt.Token.void0;
            ctk.signal = dmt.KT.None;
            for (var i = 0, len = tks.length; i < len; i++) {
                var fi = tks[i];
                fi.parent = me;
                if (!fi.static && fi.type != dmt.KT.SemiColon) {
                    if (fi.type == dmt.KT.Function
                        || fi.type == dmt.KT.Class
                        || fi.type == dmt.KT.Interface
                        || fi.type == dmt.KT.Abstract
                        || fi.type == dmt.KT.Declare) {
                        this.V(fi, me, ctk, ps);
                    }
                    else {
                        me.preConstructor.tks.push(fi);
                    }
                }
            }
            return me;
        };
        //执行一个Token
        //Value        
        //tk:执行的token
        //caller"请求的token
        //ctk:状态保存，如return break continue
        //ps:请求的this
        //ps使用2个参数会更好，一个ps，另外一个继承的ps[]，这样就可以避免__proto__，__proto__只用在继承上会更好
        CodeHandle.prototype.V = function (tk, caller, ctk, ps, isPublic) {
            if (isPublic === void 0) { isPublic = true; }
            var preToken = CodeHandle.lastToken;
            CodeHandle.lastToken = tk;
            var val = null;
            if (tk.handle) {
                val = tk.handle.V(tk, ctk, ps);
            }
            else {
                val = this.GetTokenValue(tk, ctk, ps, isPublic);
            }
            CodeHandle.lastToken = preToken;
            return val;
        };
        //获取Token的tks[0]部分
        //ValueA
        CodeHandle.prototype.VA = function (tk, ctk, ps) {
            if (tk.handle) {
                return tk.handle.ValueA(tk, ctk, ps);
            }
            else {
                return tk.val;
            }
        };
        CodeHandle.prototype.ValueParms = function (tk, ctk, ps) {
            if (tk.handle) {
                return tk.handle.ValueParms(tk, ctk, ps);
            }
            else {
                return this.GetTokenValue(tk, ctk, ps);
            }
        };
        CodeHandle.prototype.GetSuper = function (tk, p) {
            var topToken = this.GetTopToken(tk);
            var _this = this.GetThis(p);
            if (!_this.hasOwnProperty("__token__")) {
                _this = _this["__proto__"];
            }
            return this.DoGetSuper(topToken, _this);
        };
        CodeHandle.prototype.DoGetSuper = function (topToken, _this) {
            var thisToken = _this["__token__"];
            if (topToken == thisToken) {
                return _this["__proto__"];
            }
            if (!_this["__proto__"]) {
                return _this;
            }
            _this = _this["__proto__"];
            return this.DoGetSuper(topToken, _this);
        };
        CodeHandle.prototype.GetThis = function (p) {
            if (p.hasOwnProperty("__this__")) {
                return p["__this__"];
            }
            else {
                return p;
            }
        };
        CodeHandle.prototype.GetTopToken = function (tk) {
            if (tk.type == dmt.KT.ClassInstance) {
                return tk;
            }
            if (!tk.parent) {
                return tk;
            }
            return this.GetTopToken(tk.parent);
        };
        CodeHandle.prototype.GetTokenValue = function (tk, ctk, ps, isPublic) {
            if (isPublic === void 0) { isPublic = true; }
            switch (tk.type) {
                case dmt.KT.ReservedWord:
                    {
                        return this.GetParmsValue(tk.val, ps, isPublic);
                    }
                case dmt.KT.This:
                    {
                        return this.GetThis(ps);
                    }
                case dmt.KT.Super:
                    {
                        return this.GetSuper(tk, ps);
                    }
                default: {
                    if (tk instanceof dmt.Token) {
                        return tk.val;
                    }
                    else {
                        return tk;
                    }
                }
            }
        };
        CodeHandle.prototype.Express = function (tk) {
            if (!tk) {
                return;
            }
            if (tk.expressed) {
                return;
            }
            if (tk.type != dmt.KT.Brace
                && tk.type != dmt.KT.Par
                && tk.type != dmt.KT.Bracket
                && tk.type != dmt.KT.Class
                && tk.type != dmt.KT.New) {
                return;
            }
            tk.expressed = true;
            var tks = tk.tks;
            if (!tks) {
                return;
            }
            if (tks.length == 0) {
                return;
            }
            var end = new dmt.Token(dmt.KT.End, dmt.Token.void0);
            tks.push(end);
            for (var i = 0, len = this.handles.length; i < len; i++) {
                var fi = this.handles[i];
                CodeHandle.lastToken = tk;
                this.ExpressOneHandle(tk, fi);
            }
            for (var i = tk.tks.length - 1; i >= 0; i--) {
                var t = tk.tks[i];
                t.parent = tk;
                //;不能删除
                if (t.type == dmt.KT.End || t.type == dmt.KT.Enter) {
                    tk.tks.splice(i, 1);
                }
            }
        };
        CodeHandle.prototype.ExpressOneHandle = function (tk, handle) {
            var tks = tk.tks;
            var index = 0;
            var tryTimes = 0;
            while (true) {
                if (index >= tks.length || index < 0) {
                    break;
                }
                // if (tryTimes++ >= 999) {//TODO:
                //     break;
                // }
                index = handle.Exp(tk, tks, index);
            }
            ;
            handle.AfterExpress(tk, tks);
        };
        CodeHandle.prototype.GetParmsValue = function (key, ps, isPublic) {
            if (isPublic === void 0) { isPublic = true; }
            if (key instanceof dmt.Token) {
                key = key.val;
            }
            var val = this.GetParmsValueOne(ps, key);
            if (val !== dmt.Token.void0) {
                return val;
            }
            if (isPublic) {
                if (ps.hasOwnProperty("__this__")) {
                    ps = ps["__this__"];
                    var val_1 = this.GetParmsValueOne(ps, key);
                    if (val_1 !== dmt.Token.void0) {
                        return val_1;
                    }
                }
                // val = this.currentObject[key];
                // if (val !== Token.void0) {
                //     return val;
                // }
                return this.globalObject[key];
            }
            return dmt.Token.void0;
        };
        CodeHandle.prototype.GetParmsValueOne = function (p, key) {
            if (p == dmt.Token.void0) {
                CodeHandle.Info();
                throw new Error("Uncaught TypeError: Cannot read property '" + key + "' of " + p);
            }
            return p[key];
        };
        CodeHandle.prototype.SetParmsValue = function (key, val, ctk, p) {
            p[key] = val;
        };
        CodeHandle.prototype.ComParams = function (p, parent) {
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
            }
            else {
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
        };
        CodeHandle.prototype.InsertToken = function (tks, type, newTokens, beginTokenIndex, endTokenIndex, handle, ps) {
            if (ps === void 0) { ps = null; }
            var me = new dmt.Token(type, dmt.Token.void0);
            me.tks = newTokens;
            me.handle = handle;
            if (handle) {
                me.isValue = handle.isValue;
            }
            if (ps) {
                for (var fi in ps) {
                    me[fi] = ps[fi];
                }
            }
            newTokens.forEach(function (fi) {
                fi.parent = me;
            });
            tks.splice(beginTokenIndex, endTokenIndex - beginTokenIndex + 1, me);
            return me;
        };
        CodeHandle.prototype.SplitToken = function (tks, splitType) {
            var list = [];
            var item = [];
            for (var i = 0, len = tks.length; i < len; i++) {
                var tk = tks[i];
                if (tk.type == splitType) {
                    list.push(item);
                    item = [];
                }
                else {
                    item.push(tk);
                }
            }
            list.push(item);
            return list;
        };
        CodeHandle.Info = function () {
            var _this = this;
            var tk = CodeHandle.lastToken;
            console.log(tk);
            var line = this.GetLine(tk);
            if (line) {
                console.log("\n" + "line: " + line.line + ", column: " + line.column + ", token: " + dmt.KT[line.type] + ", val: " + line.val, line);
            }
            var maxCount = 10;
            var traceCaller = function (t) {
                if (t) {
                    if (t.callerToken) {
                        t = t.callerToken;
                        var line_1 = _this.GetLine(t);
                        if (!line_1) {
                            return;
                        }
                        console.log("\n" + "trace line: " + line_1.line + ", column: " + line_1.column + ", token: " + dmt.KT[t.type] + ", val: " + (t.val ? t.val : line_1.val), t);
                        maxCount--;
                        if (maxCount <= 0) {
                            return;
                        }
                    }
                    else {
                        t = t.parent;
                    }
                    if (t) {
                        traceCaller(t);
                    }
                }
            };
            traceCaller(tk);
        };
        CodeHandle.GetLine = function (tk) {
            if (tk.line && tk.column) {
                return tk;
            }
            if (tk.tks) {
                for (var i = 0, len = tk.tks.length; i < len; i++) {
                    var t = tk.tks[i];
                    var val = CodeHandle.GetLine(t);
                    if (val) {
                        return val;
                    }
                }
            }
        };
        return CodeHandle;
    }());
    dmt.CodeHandle = CodeHandle;
    __reflect(CodeHandle.prototype, "dmt.CodeHandle");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var IfVal = (function (_super) {
        __extends(IfVal, _super);
        function IfVal(code) {
            var _this = _super.call(this, dmt.KT.IfVal, code) || this;
            _this.type = "if(...){...}else if(...){...}else(...){...}";
            _this.exp = [
                new dmt.Express(dmt.KT.IfVal, dmt.KT.IfVal),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.ElseIf || t.type == dmt.KT.Else) {
                        return dmt.ECT.OKStay;
                    }
                    else {
                        return dmt.ECT.OKSkip;
                    }
                })
            ];
            return _this;
        }
        IfVal.prototype.V = function (tk, ctk, ps) {
            for (var i = 0, len = tk.tks.length; i < len; i++) {
                var fi = tk.tks[i];
                if (fi.type == dmt.KT.IfVal
                    || fi.type == dmt.KT.If
                    || fi.type == dmt.KT.ElseIf) {
                    var a = fi.tks[0];
                    this.code.Express(a);
                    if (this.code.V(a, tk, ctk, ps)) {
                        var b = fi.tks[1];
                        this.code.Express(b);
                        return this.code.V(b, tk, ctk, ps);
                    }
                }
                else if (fi.type == dmt.KT.Else) {
                    var b = fi.tks[0];
                    this.code.Express(b);
                    return this.code.V(b, tk, ctk, ps);
                }
            }
            return null;
        };
        return IfVal;
    }(dmt.Handle));
    dmt.IfVal = IfVal;
    __reflect(IfVal.prototype, "dmt.IfVal");
    var If = (function (_super) {
        __extends(If, _super);
        function If(code) {
            var _this = _super.call(this, dmt.KT.IfVal, code) || this;
            _this.type = "if(...){...}";
            _this.enterType = dmt.KT.If;
            _this.exp = [
                new dmt.Express(dmt.KT.If, function (t, tks, index, express) {
                    if (t.type == dmt.KT.If) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Par, dmt.KT.Par),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        If.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.isParser = true;
            });
        };
        return If;
    }(dmt.Handle));
    dmt.If = If;
    __reflect(If.prototype, "dmt.If");
    var ElseIf = (function (_super) {
        __extends(ElseIf, _super);
        function ElseIf(code) {
            var _this = _super.call(this, dmt.KT.ElseIf, code) || this;
            _this.type = "else if{...}";
            _this.exp = [
                new dmt.Express(dmt.KT.ElseIf, function (t, tks, index, express) {
                    if (t.type == dmt.KT.ElseIf) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Par, dmt.KT.Par),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        return ElseIf;
    }(dmt.Handle));
    dmt.ElseIf = ElseIf;
    __reflect(ElseIf.prototype, "dmt.ElseIf");
    var Else = (function (_super) {
        __extends(Else, _super);
        function Else(code) {
            var _this = _super.call(this, dmt.KT.Else, code) || this;
            _this.type = "else{...}";
            _this.exp = [
                new dmt.Express(dmt.KT.Else, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Else) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        return Else;
    }(dmt.Handle));
    dmt.Else = Else;
    __reflect(Else.prototype, "dmt.Else");
})(dmt || (dmt = {}));
//TODO:暂时放后 
///<reference path="../../Handle.ts" />
var dmt;
(function (dmt) {
    var In = (function (_super) {
        __extends(In, _super);
        function In(code) {
            var _this = _super.call(this, dmt.KT.In, code) || this;
            _this.type = "... in ...";
            return _this;
        }
        return In;
    }(dmt.Handle));
    dmt.In = In;
    __reflect(In.prototype, "dmt.In");
})(dmt || (dmt = {}));
///<reference path="../../Handle.ts" />
var dmt;
(function (dmt) {
    var Instanceof = (function (_super) {
        __extends(Instanceof, _super);
        function Instanceof(code) {
            var _this = _super.call(this, dmt.KT.Instanceof, code) || this;
            _this.type = "... instanceof ...";
            _this.isValue = true;
            _this.vAbFunc = function (a, b) {
                return a instanceof b;
            };
            return _this;
        }
        return Instanceof;
    }(dmt.Handle));
    dmt.Instanceof = Instanceof;
    __reflect(Instanceof.prototype, "dmt.Instanceof");
})(dmt || (dmt = {}));
//TODO:暂时放后 
//TODO:暂时放后 
var dmt;
(function (dmt) {
    var New = (function (_super) {
        __extends(New, _super);
        function New(code) {
            var _this = _super.call(this, dmt.KT.New, code) || this;
            _this.type = "new ...(...)";
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.New, function (t, tks, index, express) {
                    if (t.type == dmt.KT.New) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Par, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Par || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        New.prototype.V = function (tk, ctk, ps) {
            //处理参数
            if (!tk.expressed) {
                dmt.ClassVariate.DelAngleBracket(tk.tks, 0);
                this.code.Express(tk);
            }
            var _classVal = null;
            var a = null;
            var b = null;
            if (tk.tks[0].type == dmt.KT.Call) {
                //new Date();
                //new window.Date();
                a = tk.tks[0].tks[0];
                b = tk.tks[0].tks[1];
                _classVal = this.code.V(a, tk, ctk, ps);
            }
            else {
                //new Date;
                //new window.Date;
                a = tk.tks[0];
                b = null;
                _classVal = this.code.V(a, tk, ctk, ps);
            }
            ////////////////////////////////////
            var psFunc = [];
            if (b) {
                dmt.Call.HandleFunctionParms(b, this.code);
                var params = b.tks;
                for (var i = 0, len_2 = params.length; i < len_2; i++) {
                    var val = this.code.ValueParms(params[i], ctk, ps);
                    psFunc.push(val);
                }
            }
            for (var i = 0, len_3 = psFunc.length; i < len_3; i++) {
                var p = psFunc[i];
                if (p instanceof Function) {
                    if (!p["__bind__"]) {
                        //这里直接把function()=>{}和()=>{}的this指向改为一致了。在ts中this没必要指向自身
                        if (typeof p == "function") {
                            if (p["__token__"] && p["__token__"].type == dmt.KT.ClassInstance) {
                            }
                            else {
                                p = p.bind(ps); //这个bind关键时刻还是发挥了一下
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
                dmt.CodeHandle.Info();
                throw new Error("Uncaught TypeError: " + a.val + " is not a constructor");
            }
            if (_classVal["__token__"]) {
                _classVal["__token__"].AddDebugLine(tk);
            }
            var len = psFunc.length;
            if (len == 0) {
                var me = new _classVal();
                return me;
            }
            else if (len == 1) {
                var me = new _classVal(psFunc[0]);
                return me;
            }
            else if (len == 2) {
                var me = new _classVal(psFunc[0], psFunc[1]);
                return me;
            }
            else if (len == 3) {
                var me = new _classVal(psFunc[0], psFunc[1], psFunc[2]);
                return me;
            }
            else if (len == 4) {
                var me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3]);
                return me;
            }
            else if (len == 5) {
                var me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4]);
                return me;
            }
            else if (len == 6) {
                var me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4], psFunc[5]);
                return me;
            }
            else if (len == 7) {
                var me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4], psFunc[5], psFunc[6]);
                return me;
            }
            else if (len == 8) {
                var me = new _classVal(psFunc[0], psFunc[1], psFunc[2], psFunc[3], psFunc[4], psFunc[5], psFunc[6], psFunc[7]);
                return me;
            }
            else {
                var me = Object.create(_classVal.prototype);
                //初始化
                var val = _classVal.apply(me, psFunc); //这里是this的起源
                if (val) {
                    return val;
                }
                return me;
            }
        };
        return New;
    }(dmt.Handle));
    dmt.New = New;
    __reflect(New.prototype, "dmt.New");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var QuestionMarkHandle = (function (_super) {
        __extends(QuestionMarkHandle, _super);
        function QuestionMarkHandle(code) {
            var _this = _super.call(this, dmt.KT.QuestionMark, code) || this;
            _this.questionMark = new QuestionMark(code);
            return _this;
        }
        QuestionMarkHandle.prototype.Exp = function (me, tks, bIndex) {
            var index = 0;
            var hasNewQuestionMark = false;
            while (true) {
                if (index >= tks.length || index < 0) {
                    if (hasNewQuestionMark) {
                        hasNewQuestionMark = false;
                        index = 0;
                    }
                    else {
                        break;
                    }
                }
                var len = tks.length;
                index = this.questionMark.Exp(me, tks, index);
                var newLen = tks.length;
                if (len != newLen) {
                    hasNewQuestionMark = true;
                }
            }
            ;
            return -1;
        };
        return QuestionMarkHandle;
    }(dmt.Handle));
    dmt.QuestionMarkHandle = QuestionMarkHandle;
    __reflect(QuestionMarkHandle.prototype, "dmt.QuestionMarkHandle");
    //TODO:还需要识别 let a?=1; 参数
    var QuestionMark = (function (_super) {
        __extends(QuestionMark, _super);
        function QuestionMark(code) {
            var _this = _super.call(this, dmt.KT.QuestionMark, code) || this;
            _this.type = "...?...:...";
            _this.isValue = true;
            _this.exp = [
                new dmt.Express(dmt.KT.QuestionMark, function (t, tks, index, express) {
                    if (t.type == dmt.KT.QuestionMark) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }, [dmt.KT.AnyOne]),
                new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne),
                new dmt.Express(dmt.KT.Colon, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Colon) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)
            ];
            return _this;
        }
        QuestionMark.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            var c = tk.tks[2];
            if (this.code.V(a, tk, ctk, ps)) {
                return this.code.V(b, tk, ctk, ps);
            }
            else {
                return this.code.V(c, tk, ctk, ps);
            }
        };
        return QuestionMark;
    }(dmt.Handle));
    dmt.QuestionMark = QuestionMark;
    __reflect(QuestionMark.prototype, "dmt.QuestionMark");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Return = (function (_super) {
        __extends(Return, _super);
        function Return(code) {
            var _this = _super.call(this, dmt.KT.Return, code) || this;
            _this.type = "return ...";
            _this.exp = [
                new dmt.Express(dmt.KT.Return, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Return) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.AnyOne, dmt.KT.AnyOne)
            ];
            return _this;
        }
        Return.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            if (a.isValue) {
                var val = this.code.V(a, tk, ctk, ps);
                ctk.returnVal = val;
            }
            else {
                ctk.returnVal = dmt.Token.void0;
            }
            ctk.signal = this.handleType;
            return tk;
        };
        return Return;
    }(dmt.Handle));
    dmt.Return = Return;
    __reflect(Return.prototype, "dmt.Return");
})(dmt || (dmt = {}));
//功能完成，暂时注释
// namespace dmt {
//     export class Switch extends Handle {
//         public type = "switch(...){...}";
//         public constructor(code: CodeHandle) {
//             super(KT.Switch, code);
//             this.exp = [
//                 new Express(KT.Switch, (t, tks, index, exp) => {
//                     if (t.type == KT.Switch) {
//                         return ECT.OKSkip;
//                     } else {
//                         return ECT.Fail;
//                     }
//                 }),
//                 new Express(KT.Par, KT.Par),
//                 new Express(KT.Brace, (t, tks, index, express) => {
//                     if (t.type == KT.Brace || t.type == KT.SemiColon) {
//                         return ECT.OK;
//                     } else {
//                         return ECT.OKStay;
//                     }
//                 })];
//         }
//         public V(tk: Token, ctk: Token, ps: Object): any {
//             let a = tk.tks[0];
//             let b = tk.tks[1];
//             this.code.Express(a);
//             this.code.Express(b);
//             let switchVal = this.code.V(a, ctk, ps);
//             for (let i = 0, len = b.tks.length; i < len; i++) {
//                 let t = b.tks[i];
//                 if (t.type == KT.DefaultVal) {
//                     // let defaultb = t.tks[0];
//                     // this.code.Express(defaultb);
//                     // this.code.Value(defaultb, ctk, ps);
//                     let casebs: Token[] = [];
//                     for (let j = 0, jlen = t.tks.length; j < jlen; j++) {
//                         let caset = t.tks[j];
//                         if (caset.type == KT.DefaultVal) {
//                         } else {
//                             casebs.push(caset);
//                         }
//                     }
//                     for (let k = 0, klen = casebs.length; k < klen; k++) {
//                         let caseb = casebs[k];
//                         this.code.Express(caseb);
//                         this.code.V(caseb, ctk, ps);
//                         if (ctk.signal == KT.Break) {
//                             ctk.signal = KT.None;
//                             return null;
//                         }
//                         else if (ctk.signal == KT.Return) {
//                             return null;
//                         }
//                     }
//                     return null;
//                 }
//                 else if (t.type == KT.CaseVal) {
//                     let caseas: Token[] = [];
//                     let casebs: Token[] = [];
//                     for (let j = 0, jlen = t.tks.length; j < jlen; j++) {
//                         let caset = t.tks[j];
//                         if (caset.type == KT.CaseVal) {
//                             caseas.push(caset);
//                         } else {
//                             casebs.push(caset);
//                         }
//                     }
//                     for (let j = 0, jlen = caseas.length; j < jlen; j++) {
//                         let casea = caseas[j];
//                         this.code.Express(casea);
//                         let caseVal = this.code.V(casea.tks[0], ctk, ps);
//                         if (switchVal == caseVal) {
//                             for (let k = 0, klen = casebs.length; k < klen; k++) {
//                                 let caseb = casebs[k];
//                                 this.code.Express(caseb);
//                                 this.code.V(caseb, ctk, ps);
//                                 if (ctk.signal == KT.Break) {
//                                     ctk.signal = KT.None;
//                                     return null;
//                                 }
//                                 else if (ctk.signal == KT.Return) {
//                                     return null;
//                                 }
//                             }
//                             return null;
//                         }
//                     }
//                 }
//             }
//             return null;
//         }
//     }
//     export class Case extends Handle {
//         public type = "case ...:{...}";
//         public constructor(code: CodeHandle) {
//             super(KT.CaseVal, code);
//             this.exp = [
//                 new Express(KT.CaseVal, (t, tks, index, express) => {
//                     if (t.type == KT.CaseVal) {
//                         return ECT.OK;
//                     } else {
//                         return ECT.Fail;
//                     }
//                 }),
//                 new Express(KT.Brace, (t, tks, index, express) => {
//                     if (t.type == KT.Brace || t.type == KT.SemiColon) {
//                         return ECT.OK;
//                     } else {
//                         return ECT.OKStay;
//                     }
//                 })];
//         }
//     }
//     export class Default extends Handle {
//         public type = "default :{...}";
//         public constructor(code: CodeHandle) {
//             super(KT.DefaultVal, code);
//             this.exp = [
//                 new Express(KT.DefaultVal, (t, tks, index, express) => {
//                     if (t.type == KT.DefaultVal) {
//                         return ECT.OK;
//                     } else {
//                         return ECT.Fail;
//                     }
//                 }),
//                 new Express(KT.Brace, (t, tks, index, express) => {
//                     if (t.type == KT.Brace || t.type == KT.SemiColon) {
//                         return ECT.OK;
//                     } else {
//                         return ECT.OKStay;
//                     }
//                 })];
//         }
//     }
// } 
//TODO:暂时放后 
var dmt;
(function (dmt) {
    var TryVal = (function (_super) {
        __extends(TryVal, _super);
        function TryVal(code) {
            var _this = _super.call(this, dmt.KT.TryVal, code) || this;
            _this.type = "try{...}catch(...){...}";
            _this.exp = [
                new dmt.Express(dmt.KT.TryVal, dmt.KT.TryVal),
                new dmt.Express(dmt.KT.AnyOne, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Catch) {
                        return dmt.ECT.OKStay;
                    }
                    else {
                        return dmt.ECT.OKSkip;
                    }
                })
            ];
            return _this;
        }
        TryVal.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            try {
                this.code.V(a.tks[0], tk, ctk, ps);
            }
            catch (ex) {
                dmt.CodeHandle.Info();
                if (b) {
                    var b1 = b.tks[0];
                    var b2 = b.tks[1];
                    var p = {};
                    p[b1.tks[0].val] = ex;
                    var nps = this.code.ComParams(p, ps);
                    this.code.V(b2, tk, ctk, nps);
                }
            }
            return null;
        };
        return TryVal;
    }(dmt.Handle));
    dmt.TryVal = TryVal;
    __reflect(TryVal.prototype, "dmt.TryVal");
    var Try = (function (_super) {
        __extends(Try, _super);
        function Try(code) {
            var _this = _super.call(this, dmt.KT.TryVal, code) || this;
            _this.type = "try{...}";
            _this.enterType = dmt.KT.Try;
            _this.exp = [
                new dmt.Express(dmt.KT.Try, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Try) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        Try.prototype.Exp = function (me, tks, bIndex) {
            return dmt.Express.Exps(tks, bIndex, this.exp, this.handleType, this, function (t) {
                t.isParser = true;
            });
        };
        return Try;
    }(dmt.Handle));
    dmt.Try = Try;
    __reflect(Try.prototype, "dmt.Try");
    var Catch = (function (_super) {
        __extends(Catch, _super);
        function Catch(code) {
            var _this = _super.call(this, dmt.KT.Catch, code) || this;
            _this.type = "catch(...){...}";
            _this.exp = [
                new dmt.Express(dmt.KT.Catch, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Catch) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Par, dmt.KT.Par),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        return Catch;
    }(dmt.Handle));
    dmt.Catch = Catch;
    __reflect(Catch.prototype, "dmt.Catch");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var While = (function (_super) {
        __extends(While, _super);
        function While(code) {
            var _this = _super.call(this, dmt.KT.While, code) || this;
            _this.type = "while(...){...}";
            _this.exp = [
                new dmt.Express(dmt.KT.While, function (t, tks, index, exp) {
                    if (t.type == dmt.KT.While) {
                        return dmt.ECT.OKSkip;
                    }
                    else {
                        return dmt.ECT.Fail;
                    }
                }),
                new dmt.Express(dmt.KT.Par, dmt.KT.Par),
                new dmt.Express(dmt.KT.Brace, function (t, tks, index, express) {
                    if (t.type == dmt.KT.Brace || t.type == dmt.KT.SemiColon) {
                        return dmt.ECT.OK;
                    }
                    else {
                        return dmt.ECT.OKStay;
                    }
                })
            ];
            return _this;
        }
        While.prototype.V = function (tk, ctk, ps) {
            var a = tk.tks[0];
            var b = tk.tks[1];
            this.code.Express(a);
            this.code.Express(b);
            while (this.code.V(a, tk, ctk, ps)) {
                this.code.V(b, tk, ctk, ps);
                if (ctk.signal == dmt.KT.Continue) {
                    ctk.signal = dmt.KT.None;
                    continue;
                }
                else if (ctk.signal == dmt.KT.Break) {
                    ctk.signal = dmt.KT.None;
                    break;
                }
                else if (ctk.signal == dmt.KT.Return) {
                    return null;
                }
            }
            return null;
        };
        return While;
    }(dmt.Handle));
    dmt.While = While;
    __reflect(While.prototype, "dmt.While");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Stream = (function () {
        function Stream(text) {
            this.line = 1;
            this.column = 1;
            this.text = text;
            this.index = 0;
            this.length = text.length;
        }
        Stream.prototype.Read = function () {
            var val = this.text.charAt(this.index);
            this.index++;
            //if(debug){}
            if (val == "\n") {
                this.line++;
                this.column = 1;
            }
            else {
                this.column++;
            }
            return val;
        };
        Stream.prototype.EOF = function () {
            return this.index >= this.length;
        };
        Stream.prototype.Peek = function (offset) {
            if (offset === void 0) { offset = 0; }
            var val = this.text.charAt(this.index + offset);
            return val;
        };
        return Stream;
    }());
    dmt.Stream = Stream;
    __reflect(Stream.prototype, "dmt.Stream");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.IsLetter = function (char) {
            if (Utils.letters == null) {
                Utils.letters = {};
                Utils.CHARS.forEach(function (fi) {
                    Utils.letters[fi] = true;
                    Utils.letters[fi.toUpperCase()] = true;
                });
            }
            return Utils.letters.hasOwnProperty(char);
        };
        Utils.IsLetterExtra = function (char) {
            if (Utils.letterExtras == null) {
                Utils.letterExtras = {};
                Utils.CHARS.forEach(function (fi) {
                    Utils.letterExtras[fi] = true;
                    Utils.letterExtras[fi.toUpperCase()] = true;
                });
                Utils.EXTRA_CHARS.forEach(function (fi) {
                    Utils.letterExtras[fi] = true;
                });
            }
            return Utils.letterExtras.hasOwnProperty(char);
        };
        Utils.IsNumber = function (char) {
            if (Utils.numbers == null) {
                Utils.numbers = {};
                Utils.NUMS.forEach(function (fi) {
                    Utils.numbers[fi] = true;
                });
            }
            return Utils.numbers.hasOwnProperty(char);
        };
        Utils.IsHexNumber = function (char) {
            if (Utils.hexNumbers == null) {
                Utils.hexNumbers = {};
                Utils.HEX_NUMS.forEach(function (fi) {
                    Utils.hexNumbers[fi] = true;
                    Utils.hexNumbers[fi.toUpperCase()] = true;
                });
            }
            return Utils.hexNumbers.hasOwnProperty(char);
        };
        Utils.IsStringStart = function (char) {
            // if (Utils.stringStarts == null) {
            //     Utils.stringStarts = ["\"", "'", "`"];
            // }
            // return Utils.stringStarts.indexOf(char) > -1;
            if (Utils.stringStarts == null) {
                Utils.stringStarts = {};
                Utils.stringStarts["\""] = true;
                Utils.stringStarts["'"] = true;
                Utils.stringStarts["`"] = true;
            }
            return Utils.stringStarts.hasOwnProperty(char);
        };
        Utils.IsStringSkip = function (char) {
            // if (Utils.stringSkips == null) {
            //     Utils.stringSkips = ["\r", "\n", " ", "    "];
            // }
            // return Utils.stringSkips.indexOf(char) > -1;
            if (Utils.stringSkips == null) {
                Utils.stringSkips = {};
                Utils.stringSkips["\r"] = true;
                Utils.stringSkips["\n"] = true;
                Utils.stringSkips[" "] = true;
                Utils.stringSkips[" "] = true;
            }
            return Utils.stringSkips.hasOwnProperty(char);
        };
        Utils.IsEmpty = function (char) {
            return char == null || char.length == 0;
        };
        Utils.IsEmptyArray = function (arr) {
            return arr == null || arr.length == 0;
        };
        Utils.IsLetterOrNumber = function (char) {
            if (Utils.letterOrNumbers == null) {
                Utils.letterOrNumbers = {};
                Utils.CHARS.forEach(function (fi) {
                    Utils.letterOrNumbers[fi] = true;
                    Utils.letterOrNumbers[fi.toUpperCase()] = true;
                });
                Utils.NUMS.forEach(function (fi) {
                    Utils.letterOrNumbers[fi] = true;
                });
            }
            return Utils.letterOrNumbers.hasOwnProperty(char);
        };
        Utils.IsLetterOrNumberExtra = function (char) {
            if (Utils.letterOrNumbersExtra == null) {
                Utils.letterOrNumbersExtra = {};
                Utils.CHARS.forEach(function (fi) {
                    Utils.letterOrNumbersExtra[fi] = true;
                    Utils.letterOrNumbersExtra[fi.toUpperCase()] = true;
                });
                Utils.NUMS.forEach(function (fi) {
                    Utils.letterOrNumbersExtra[fi] = true;
                });
                Utils.EXTRA_CHARS.forEach(function (fi) {
                    Utils.letterOrNumbersExtra[fi] = true;
                });
            }
            return Utils.letterOrNumbersExtra.hasOwnProperty(char);
        };
        Utils.CHARS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z'];
        Utils.NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        Utils.HEX_NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        Utils.EXTRA_CHARS = ['_', '$'];
        Utils.letters = null;
        Utils.letterExtras = null;
        Utils.numbers = null;
        Utils.hexNumbers = null;
        Utils.stringStarts = null;
        Utils.stringSkips = null;
        Utils.letterOrNumbers = null;
        Utils.letterOrNumbersExtra = null;
        return Utils;
    }());
    dmt.Utils = Utils;
    __reflect(Utils.prototype, "dmt.Utils");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var CodeBin = (function () {
        function CodeBin(bin) {
            this.checkAttributes = { g: 1, i: 1, m: 1 };
            var tks = [];
            this.tk = new dmt.Token(dmt.KT.Brace, dmt.Token.void0);
            this.tk.tks = tks;
            var data = JSON.parse(bin);
            var types = data[0];
            var vals = data[1];
            for (var i = 2, len = data.length; i < len; i++) {
                var t = data[i];
                if (t >= 1000) {
                    var type = dmt.KT.ReservedWord;
                    var tk = new dmt.Token(type, dmt.Token.void0);
                    tk.isParser = true;
                    tk.val = vals[t - 1000];
                    tk.isValue = true;
                    tks.push(tk);
                }
                else {
                    var type = dmt.KT[types[t]];
                    var tk = new dmt.Token(type, dmt.Token.void0);
                    tk.isParser = true;
                    tks.push(tk);
                    if (type == dmt.KT.StringVal) {
                        i++;
                        tk.val = vals[data[i]];
                        tk.isValue = true;
                    }
                    else if (type == dmt.KT.NumberVal) {
                        i++;
                        tk.val = vals[data[i]];
                        tk.isValue = true;
                    }
                    else if (type == dmt.KT.RegExpVal) {
                        i++;
                        var source = vals[data[i]];
                        i++;
                        var att = data[i];
                        if (!this.checkAttributes[att]) {
                            att = "";
                        }
                        tk.val = new RegExp(source, att);
                        tk.isValue = true;
                    }
                    else if (type == dmt.KT.True) {
                        tk.val = true;
                        tk.isValue = true;
                    }
                    else if (type == dmt.KT.False) {
                        tk.val = false;
                        tk.isValue = true;
                    }
                    else if (type == dmt.KT.Null) {
                        tk.val = null;
                        tk.isValue = true;
                    }
                    else if (type == dmt.KT.Undefined) {
                        tk.val = undefined;
                        tk.isValue = true;
                    }
                    else if (type == dmt.KT.NaN) {
                        tk.val = NaN;
                        tk.isValue = true;
                    }
                    else {
                        if (type == dmt.KT.Super || type == dmt.KT.This
                            || type == dmt.KT.Null || type == dmt.KT.NaN || type == dmt.KT.Undefined) {
                            tk.isValue = true;
                        }
                    }
                }
            }
        }
        return CodeBin;
    }());
    dmt.CodeBin = CodeBin;
    __reflect(CodeBin.prototype, "dmt.CodeBin");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    var CodeParser = (function () {
        function CodeParser(code) {
            var _this = this;
            this.parsers = [
                new dmt.PlusParser(),
                new dmt.MinusParser(),
                new dmt.MultiplyParser(),
                new dmt.ExponentiationParser(),
                new dmt.DivideParser(),
                new dmt.ModuloParser(),
                new dmt.InclusiveOrParser(),
                new dmt.CombineParser(),
                new dmt.XORParser(),
                new dmt.ShiParser(),
                new dmt.ShrParser(),
                new dmt.UnsignedShrParser(),
                new dmt.LeftParParser(),
                new dmt.RightParParser(),
                new dmt.LeftBraceParser(),
                new dmt.RightBraceParser(),
                new dmt.LeftBracketParser(),
                new dmt.RightBracketParser(),
                new dmt.PeriodParser(),
                new dmt.ParamsPreParser(),
                new dmt.ParamsParser(),
                new dmt.CommaParser(),
                new dmt.ColonParser(),
                new dmt.SemiColonParser(),
                new dmt.QuestionMarkParser(),
                new dmt.FunctionSymbolParser(),
                new dmt.EnterParser(),
                new dmt.SemiColonAndEnterParser(),
                new dmt.EqualParser(),
                new dmt.AllEqualParser(),
                new dmt.NotEqualParser(),
                new dmt.AllNotEqualParser(),
                new dmt.GreaterParser(),
                //new GreaterOrEqualParser(),//无法识别2>=1 和 let a:Array<number>=[]
                new dmt.LessParser(),
                //new LessOrEqualParser(),
                new dmt.AssignParser(),
                new dmt.NotParser(),
                new dmt.BitwiseNotParser(),
                new dmt.IncrementParser(),
                new dmt.DecrementParser(),
                new dmt.AssignPlusParser(),
                new dmt.AssignMinusParser(),
                new dmt.AssignMultiplyParser(),
                new dmt.AssignDivideParser(),
                new dmt.AssignModuloParser(),
                new dmt.AssignInclusiveOrParser(),
                new dmt.OrParser(),
                new dmt.AssignCombineParser(),
                new dmt.AndParser(),
                new dmt.AssignXORParser(),
                //new AssignShiParser(),
                //new AssignShrParser(),//无法识别2>=1 和 let a:Array<number>=[]
                //new AssignUnsignedShrParser(),//无法识别2>=1 和 let a:Array<number>=[]
                new dmt.NumberParser(),
                new dmt.StringParser(),
                new dmt.ReservedWordPasrser(),
                new dmt.AnnotationParser(),
                new dmt.AnnotationStarParser(),
            ];
            this.parsers.forEach(function (fi) {
                fi.SetWaitForParser(_this.parsers);
            });
            this.noKeyParsers = [];
            this.oneKeyParsers = [];
            this.oneKeyParserKeys = [];
            this.parsers.forEach(function (fi) {
                if (fi.key.length == 0) {
                    _this.noKeyParsers.push(fi);
                }
                else if (fi.key.length == 1) {
                    _this.oneKeyParsers.push(fi);
                    _this.oneKeyParserKeys.push(fi.key);
                }
            });
            this.code = code;
            this.stream = new dmt.Stream(code);
            this.Parse();
        }
        CodeParser.prototype.TryGetParserByChar = function (char) {
            var index = this.oneKeyParserKeys.indexOf(char);
            if (index > -1) {
                return this.oneKeyParsers[index];
            }
            else {
                if (dmt.Utils.IsStringSkip(char)) {
                    return null;
                }
                for (var i = 0, len = this.noKeyParsers.length; i < len; i++) {
                    var parser = this.noKeyParsers[i];
                    if (parser.WillAcceptStart(char)) {
                        return parser;
                    }
                }
            }
            return null;
        };
        CodeParser.prototype.Parse = function () {
            var _this = this;
            var parser;
            var tks = [];
            this.tk = new dmt.Token(dmt.KT.Brace, dmt.Token.void0);
            this.tk.tks = tks;
            var line = 0;
            var column = 0;
            var handle = function (char) {
                if (parser != null) {
                    parser = parser.TryAddValue(char, _this.stream, tks, line, column);
                    if (parser == null) {
                        char = _this.stream.Peek(-1);
                        handle(char);
                    }
                }
                else {
                    parser = _this.TryGetParserByChar(char);
                    if (parser) {
                        parser.Reset();
                        if (parser.autoAddVal) {
                            parser = parser.TryAddValue(char, _this.stream, tks, line, column);
                        }
                    }
                }
            };
            while (!this.stream.EOF()) {
                line = this.stream.line;
                column = this.stream.column;
                handle(this.stream.Read());
            }
            handle("\n");
        };
        CodeParser.prototype.Release = function () {
            var types = {};
            var vals = [];
            var arr = [types, vals];
            this.tk.tks.forEach(function (fi) {
                var type = fi.type;
                types[type] = dmt.KT[type];
                if (type == dmt.KT.ReservedWord) {
                    var index = vals.indexOf(fi.val);
                    if (index >= 0) {
                        arr.push(index + 1000);
                    }
                    else {
                        vals.push(fi.val);
                        arr.push(vals.length - 1 + 1000);
                    }
                }
                else if (type == dmt.KT.NumberVal || type == dmt.KT.StringVal) {
                    var index = vals.indexOf(fi.val);
                    if (index >= 0) {
                        arr.push(type);
                        arr.push(index);
                    }
                    else {
                        arr.push(type);
                        vals.push(fi.val);
                        arr.push(vals.length - 1);
                    }
                }
                else if (type == dmt.KT.True || type == dmt.KT.False) {
                    arr.push(type);
                }
                else if (type == dmt.KT.RegExpVal) {
                    var val = fi.val.source;
                    var att = fi.val.toString();
                    att = att.charAt(att.length - 1);
                    var index = vals.indexOf(val);
                    if (index >= 0) {
                        arr.push(type);
                        arr.push(index);
                    }
                    else {
                        arr.push(type);
                        vals.push(val);
                        arr.push(vals.length - 1);
                    }
                    arr.push(att);
                }
                else {
                    arr.push(type);
                    if (fi.val) {
                        console.warn("Not hande TokenType:", dmt.KT[type]);
                    }
                }
            });
            return JSON.stringify(arr);
        };
        return CodeParser;
    }());
    dmt.CodeParser = CodeParser;
    __reflect(CodeParser.prototype, "dmt.CodeParser");
})(dmt || (dmt = {}));
var dmt;
(function (dmt) {
    //ExpressCheckType
    var ECT;
    (function (ECT) {
        /*
        * 验证失败，需要检验下一个Express
        */
        ECT[ECT["Fail"] = 0] = "Fail";
        /*
        * 验证通过
        */
        ECT[ECT["OK"] = 1] = "OK";
        /*
        * 验证失败，但是继续检测该Express，这个值要删掉和OKAndStay冲突，但意义不明
        */
        /*
        * 验证通过 但是epress不递增，继续验证当前epress
        */
        ECT[ECT["OKStay"] = 2] = "OKStay";
        /*
        * 验证通过 但是跳过该Token
        */
        ECT[ECT["OKSkip"] = 3] = "OKSkip";
        /*
        * 验证通过 但是跳过该Token，并且epress不递增，继续验证当前epress
        */
        ECT[ECT["OKSkipStay"] = 4] = "OKSkipStay";
    })(ECT = dmt.ECT || (dmt.ECT = {}));
    //TokenType
    var KT;
    (function (KT) {
        /**
         * 空类型（没有实际用途）
         */
        KT[KT["None"] = 0] = "None";
        /*
        *  reservedWord
        */
        KT[KT["ReservedWord"] = 1] = "ReservedWord";
        /**
         * var
         */
        KT[KT["Var"] = 2] = "Var";
        /**
         * let
         */
        KT[KT["Let"] = 3] = "Let";
        /**
         * const
         */
        KT[KT["Const"] = 4] = "Const";
        /**
         * {}
         */
        KT[KT["Brace"] = 5] = "Brace";
        /**
         * {
         */
        KT[KT["LeftBrace"] = 6] = "LeftBrace";
        /**
         * }
         */
        KT[KT["RightBrace"] = 7] = "RightBrace";
        /**
         * ()
         */
        KT[KT["Par"] = 8] = "Par";
        /**
         * (
         */
        KT[KT["LeftPar"] = 9] = "LeftPar";
        /**
         * )
         */
        KT[KT["RightPar"] = 10] = "RightPar";
        /**
         * []
         */
        KT[KT["Bracket"] = 11] = "Bracket";
        /**
         * [
         */
        KT[KT["LeftBracket"] = 12] = "LeftBracket";
        /**
         * ]
         */
        KT[KT["RightBracket"] = 13] = "RightBracket";
        /**
         * <>
         */
        KT[KT["AngleBracket"] = 14] = "AngleBracket";
        // /**
        //  * <这个是小于		
        //  */
        // LeftAngleBracket,
        // /**
        //  * >这个是大于		
        //  */
        // RightAngleBracket,
        /**
         * .
         */
        KT[KT["Period"] = 15] = "Period";
        KT[KT["PeriodVal"] = 16] = "PeriodVal";
        KT[KT["PeriodKeyVal"] = 17] = "PeriodKeyVal";
        /**
         * ,
         */
        KT[KT["Comma"] = 18] = "Comma";
        /**
         * :
         */
        KT[KT["Colon"] = 19] = "Colon";
        /**
         * :
         */
        KT[KT["ColonVal"] = 20] = "ColonVal";
        /**
         * ;
         */
        KT[KT["SemiColon"] = 21] = "SemiColon";
        /**
         * ?
         */
        KT[KT["QuestionMark"] = 22] = "QuestionMark";
        /**
         * +
         */
        KT[KT["Plus"] = 23] = "Plus";
        /**
         * +...
         */
        KT[KT["UnaryPlus"] = 24] = "UnaryPlus";
        /**
         * ++
         */
        KT[KT["Increment"] = 25] = "Increment";
        /**
         * ++...
         */
        KT[KT["UnaryIncrement"] = 26] = "UnaryIncrement";
        /**
         * +=
         */
        KT[KT["AssignPlus"] = 27] = "AssignPlus";
        /**
         * -
         */
        KT[KT["Minus"] = 28] = "Minus";
        /**
         * -...
         */
        KT[KT["UnaryMinus"] = 29] = "UnaryMinus";
        /**
         * --
         */
        KT[KT["Decrement"] = 30] = "Decrement";
        /**
         * --...
         */
        KT[KT["UnaryDecrement"] = 31] = "UnaryDecrement";
        /**
         * -=
         */
        KT[KT["AssignMinus"] = 32] = "AssignMinus";
        /**
         * *
         */
        KT[KT["Multiply"] = 33] = "Multiply";
        /**
         * *=
         */
        KT[KT["AssignMultiply"] = 34] = "AssignMultiply";
        /**
         * /
         */
        KT[KT["Divide"] = 35] = "Divide";
        /**
         * /=
         */
        KT[KT["AssignDivide"] = 36] = "AssignDivide";
        /**
         * **
         */
        KT[KT["Exponentiation"] = 37] = "Exponentiation";
        /**
         * % 模运算
         */
        KT[KT["Modulo"] = 38] = "Modulo";
        /**
         * %=
         */
        KT[KT["AssignModulo"] = 39] = "AssignModulo";
        /**
         * | 或运算
         */
        KT[KT["InclusiveOr"] = 40] = "InclusiveOr";
        /**
         * |=
         */
        KT[KT["AssignInclusiveOr"] = 41] = "AssignInclusiveOr";
        /**
         * ||
         */
        KT[KT["Or"] = 42] = "Or";
        /**
         * & 并运算
         */
        KT[KT["Combine"] = 43] = "Combine";
        /**
         * &=
         */
        KT[KT["AssignCombine"] = 44] = "AssignCombine";
        /**
         * &&
         */
        KT[KT["And"] = 45] = "And";
        /**
         * ^ 异或
         */
        KT[KT["XOR"] = 46] = "XOR";
        /**
         * ^=
         */
        KT[KT["AssignXOR"] = 47] = "AssignXOR";
        /**
         * <<左移
         */
        KT[KT["Shi"] = 48] = "Shi";
        /**
         * <<=
         */
        KT[KT["AssignShi"] = 49] = "AssignShi";
        /**
         * >> 右移
         */
        KT[KT["Shr"] = 50] = "Shr";
        /**
        * >>> 无符号右移
        */
        KT[KT["UnsignedShr"] = 51] = "UnsignedShr";
        /**
         * >>=
         */
        KT[KT["AssignShr"] = 52] = "AssignShr";
        /**
        * >>>=
        */
        KT[KT["AssignUnsignedShr"] = 53] = "AssignUnsignedShr";
        /**
         * !
         */
        KT[KT["Not"] = 54] = "Not";
        /**
         * ~
         */
        KT[KT["BitwiseNot"] = 55] = "BitwiseNot";
        /**
         * =
         */
        KT[KT["Assign"] = 56] = "Assign";
        /**
         * ==
         */
        KT[KT["Equal"] = 57] = "Equal";
        /**
         * ===
         */
        KT[KT["AllEqual"] = 58] = "AllEqual";
        /**
         * instanceof
         */
        KT[KT["Instanceof"] = 59] = "Instanceof";
        /**
         * typeof
         */
        KT[KT["Typeof"] = 60] = "Typeof";
        /**
         * !=
         */
        KT[KT["NotEqual"] = 61] = "NotEqual";
        /**
         * !==
         */
        KT[KT["AllNotEqual"] = 62] = "AllNotEqual";
        /**
         * >
         */
        KT[KT["Greater"] = 63] = "Greater";
        /**
         * >=
         */
        KT[KT["GreaterOrEqual"] = 64] = "GreaterOrEqual";
        /**
         *  <
         */
        KT[KT["Less"] = 65] = "Less";
        /**
         * <=
         */
        KT[KT["LessOrEqual"] = 66] = "LessOrEqual";
        /**
         * ..
         */
        KT[KT["ParamsPre"] = 67] = "ParamsPre";
        /**
         * ...
         */
        KT[KT["Params"] = 68] = "Params";
        /**
         * if
         */
        KT[KT["If"] = 69] = "If";
        /**
         * if
         */
        KT[KT["IfVal"] = 70] = "IfVal";
        /**
         * else
         */
        KT[KT["Else"] = 71] = "Else";
        /**
         * else	if
         */
        KT[KT["ElseIf"] = 72] = "ElseIf";
        /**
         * for
         */
        KT[KT["For"] = 73] = "For";
        /**
         * dynamic
         */
        //Dynamic,
        // /**
        //  * each		
        //  */
        // Each,
        // forEach map filter every some
        /**
         * in
         */
        KT[KT["In"] = 74] = "In";
        /**
         * switch
         */
        KT[KT["Switch"] = 75] = "Switch";
        /**
         * case
         */
        KT[KT["Case"] = 76] = "Case";
        KT[KT["CaseVal"] = 77] = "CaseVal";
        /**
         * default
         */
        KT[KT["Default"] = 78] = "Default";
        KT[KT["DefaultVal"] = 79] = "DefaultVal";
        /**
         * break
         */
        KT[KT["Break"] = 80] = "Break";
        /**
         * continue
         */
        KT[KT["Continue"] = 81] = "Continue";
        /**
         * return
         */
        KT[KT["Return"] = 82] = "Return";
        /**
         * while
         */
        KT[KT["While"] = 83] = "While";
        /**
         * function
         */
        KT[KT["Function"] = 84] = "Function";
        /**
         * try
         */
        KT[KT["Try"] = 85] = "Try";
        KT[KT["TryVal"] = 86] = "TryVal";
        /**
         * catch
         */
        KT[KT["Catch"] = 87] = "Catch";
        /**
         * throw
         */
        KT[KT["Throw"] = 88] = "Throw";
        /**
         * boolean
         */
        KT[KT["Boolean"] = 89] = "Boolean";
        /**
         * bool true false
         */
        KT[KT["BooleanVal"] = 90] = "BooleanVal";
        /**
         * true
         */
        KT[KT["True"] = 91] = "True";
        /**
         * false
         */
        KT[KT["False"] = 92] = "False";
        /**
         * int float
         */
        KT[KT["Number"] = 93] = "Number";
        /**
         * int float
         */
        KT[KT["NumberVal"] = 94] = "NumberVal";
        /**
         * string
         */
        KT[KT["String"] = 95] = "String";
        /**
        * string
        */
        KT[KT["StringVal"] = 96] = "StringVal";
        /**
         * null
         */
        KT[KT["Null"] = 97] = "Null";
        /**
         * export
         */
        KT[KT["Export"] = 98] = "Export";
        /**
         * abstract
         */
        KT[KT["Abstract"] = 99] = "Abstract";
        /**
         * 名称空间定义（暂时当作模块来使用）
         */
        KT[KT["NameSpace"] = 100] = "NameSpace";
        /**
         * 模块定义
         */
        KT[KT["Module"] = 101] = "Module";
        /**
         * 类定义
         */
        KT[KT["Class"] = 102] = "Class";
        KT[KT["ClassInstance"] = 103] = "ClassInstance";
        KT[KT["PreConstructor"] = 104] = "PreConstructor";
        /**
         * 接口定义
         */
        KT[KT["Interface"] = 105] = "Interface";
        KT[KT["InterfaceInstance"] = 106] = "InterfaceInstance";
        /**
         * 公共
         */
        KT[KT["Public"] = 107] = "Public";
        /**
         * 保护
         */
        KT[KT["Protected"] = 108] = "Protected";
        /**
         * 私有
         */
        KT[KT["Private"] = 109] = "Private";
        /**
         * 继承
         */
        KT[KT["Extends"] = 110] = "Extends";
        /**
         * 静态
         */
        KT[KT["Static"] = 111] = "Static";
        /**
         * 实例
         */
        KT[KT["New"] = 112] = "New";
        /**
         * undefined or null
         */
        KT[KT["Void"] = 113] = "Void";
        /**
         * any
         */
        KT[KT["Any"] = 114] = "Any";
        /**
         * never
         */
        KT[KT["Never"] = 115] = "Never";
        /**
         * 是window下的一个值，不是关键词
         */
        KT[KT["NaN"] = 116] = "NaN";
        /**
        * 是window下的一个值，不是关键词
        */
        KT[KT["Undefined"] = 117] = "Undefined";
        KT[KT["Async"] = 118] = "Async";
        KT[KT["Await"] = 119] = "Await";
        /**
         * 引入
         */
        KT[KT["Import"] = 120] = "Import";
        /**
         * get
         */
        KT[KT["Get"] = 121] = "Get";
        /**
         * set
         */
        KT[KT["Set"] = 122] = "Set";
        /**
         * as
         */
        KT[KT["As"] = 123] = "As";
        /**
         * delete
         */
        KT[KT["Delete"] = 124] = "Delete";
        /**
         * implements
         */
        KT[KT["Implements"] = 125] = "Implements";
        /*
        * //...
        */
        KT[KT["Annotation"] = 126] = "Annotation";
        /*
        * /*...*\/
        */
        KT[KT["AnnotationStar"] = 127] = "AnnotationStar";
        /*
        *...(...)
        */
        KT[KT["Call"] = 128] = "Call";
        /*
        *...(...)
        */
        //CallVal,
        /*
        *....(...)
        */
        //CallValPeriod,
        /*
        * \n
        */
        KT[KT["Enter"] = 129] = "Enter";
        /**
         * =>
         */
        KT[KT["FunctionSymbol"] = 130] = "FunctionSymbol";
        /**
         * function(){}
         */
        KT[KT["FunctionAnonymous"] = 131] = "FunctionAnonymous";
        /*
        * 外部标记
        */
        KT[KT["Customize"] = 132] = "Customize";
        /*
        * this
        */
        KT[KT["This"] = 133] = "This";
        /*
        * super
        */
        KT[KT["Super"] = 134] = "Super";
        /*
        * 结束标记
        */
        KT[KT["End"] = 135] = "End";
        /*
        * 任意一个
        */
        KT[KT["AnyOne"] = 136] = "AnyOne";
        /*
        * yield(非标准)
        */
        KT[KT["Yield"] = 137] = "Yield";
        /*
        * yield*(非标准)
        */
        KT[KT["YieldStar"] = 138] = "YieldStar";
        KT[KT["Json"] = 139] = "Json";
        KT[KT["JsonVal"] = 140] = "JsonVal";
        KT[KT["Declare"] = 141] = "Declare";
        /*
        * /.../g
        */
        KT[KT["RegExpVal"] = 142] = "RegExpVal";
    })(KT = dmt.KT || (dmt.KT = {}));
})(dmt || (dmt = {}));
///<reference path="TokenType.ts" />
var dmt;
(function (dmt) {
    var Token = (function () {
        function Token(type, val) {
            this.isParser = false; //是否是源代码载入的
            this.expressed = false; //是否被解析
            this.isValue = false; //是否可以计算值
            this.signal = dmt.KT.None; //return,break,continue
            if (type !== Token.void0) {
                this.type = type;
            }
            if (val !== Token.void0) {
                this.val = val;
            }
        }
        Object.defineProperty(Token.prototype, "name", {
            get: function () {
                return dmt.KT[this.type];
            },
            enumerable: true,
            configurable: true
        });
        Token.prototype.AddDebugLine = function (caller) {
            this.callerToken = caller;
        };
        Token.void0 = void 0;
        return Token;
    }());
    dmt.Token = Token;
    __reflect(Token.prototype, "dmt.Token");
})(dmt || (dmt = {}));
//未完成的功能
//连等let a=b=1;
//abstract
//await async
//export
//enum
//import
//module
//nameSpace
//let a?=1;
//switch(已完成)
//throw
var dmt;
(function (dmt) {
    var TsCode = (function () {
        function TsCode() {
        }
        TsCode.Run = function (code, globalObject) {
            var p = new dmt.CodeParser(code);
            var h = new dmt.CodeHandle(globalObject);
            return h.Run(p.tk);
        };
        return TsCode;
    }());
    dmt.TsCode = TsCode;
    __reflect(TsCode.prototype, "dmt.TsCode");
})(dmt || (dmt = {}));
window["dmt"] = dmt;
// class JSZip {
//     public constructor() {
//     }
//     public loadAsync(arrayBuffer: any): any {
//         return null;
//     }
// } 
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var AnnotationParser = (function (_super) {
        __extends(AnnotationParser, _super);
        function AnnotationParser() {
            var _this = _super.call(this, dmt.KT.Annotation, "//") || this;
            _this.autoAddVal = true;
            _this.Reset();
            return _this;
        }
        AnnotationParser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (char == "\r" || char == "\n") {
                return null;
            }
            return this;
        };
        return AnnotationParser;
    }(dmt.Parser));
    dmt.AnnotationParser = AnnotationParser;
    __reflect(AnnotationParser.prototype, "dmt.AnnotationParser");
    var AnnotationStarParser = (function (_super) {
        __extends(AnnotationStarParser, _super);
        function AnnotationStarParser() {
            var _this = _super.call(this, dmt.KT.AnnotationStar, "/*") || this;
            _this.autoAddVal = true;
            _this.Reset();
            return _this;
        }
        AnnotationStarParser.prototype.Reset = function () {
            this.noteChar = false;
            this.end = false;
        };
        AnnotationStarParser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (this.end) {
                return null;
            }
            if (char == "*") {
                this.noteChar = true;
                return this;
            }
            if (this.noteChar && char == "/") {
                this.end = true;
                return this;
            }
            this.noteChar = false;
            return this;
        };
        return AnnotationStarParser;
    }(dmt.Parser));
    dmt.AnnotationStarParser = AnnotationStarParser;
    __reflect(AnnotationStarParser.prototype, "dmt.AnnotationStarParser");
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var PlusParser = (function (_super) {
        __extends(PlusParser, _super);
        function PlusParser() {
            return _super.call(this, dmt.KT.Plus, "+") || this;
        }
        return PlusParser;
    }(dmt.Parser));
    dmt.PlusParser = PlusParser;
    __reflect(PlusParser.prototype, "dmt.PlusParser");
    var MinusParser = (function (_super) {
        __extends(MinusParser, _super);
        function MinusParser() {
            return _super.call(this, dmt.KT.Minus, "-") || this;
        }
        return MinusParser;
    }(dmt.Parser));
    dmt.MinusParser = MinusParser;
    __reflect(MinusParser.prototype, "dmt.MinusParser");
    var MultiplyParser = (function (_super) {
        __extends(MultiplyParser, _super);
        function MultiplyParser() {
            return _super.call(this, dmt.KT.Multiply, "*") || this;
        }
        return MultiplyParser;
    }(dmt.Parser));
    dmt.MultiplyParser = MultiplyParser;
    __reflect(MultiplyParser.prototype, "dmt.MultiplyParser");
    var ExponentiationParser = (function (_super) {
        __extends(ExponentiationParser, _super);
        function ExponentiationParser() {
            return _super.call(this, dmt.KT.Exponentiation, "**") || this;
        }
        return ExponentiationParser;
    }(dmt.Parser));
    dmt.ExponentiationParser = ExponentiationParser;
    __reflect(ExponentiationParser.prototype, "dmt.ExponentiationParser");
    var ModuloParser = (function (_super) {
        __extends(ModuloParser, _super);
        function ModuloParser() {
            return _super.call(this, dmt.KT.Modulo, "%") || this;
        }
        return ModuloParser;
    }(dmt.Parser));
    dmt.ModuloParser = ModuloParser;
    __reflect(ModuloParser.prototype, "dmt.ModuloParser");
    var InclusiveOrParser = (function (_super) {
        __extends(InclusiveOrParser, _super);
        function InclusiveOrParser() {
            return _super.call(this, dmt.KT.InclusiveOr, "|") || this;
        }
        return InclusiveOrParser;
    }(dmt.Parser));
    dmt.InclusiveOrParser = InclusiveOrParser;
    __reflect(InclusiveOrParser.prototype, "dmt.InclusiveOrParser");
    var CombineParser = (function (_super) {
        __extends(CombineParser, _super);
        function CombineParser() {
            return _super.call(this, dmt.KT.Combine, "&") || this;
        }
        return CombineParser;
    }(dmt.Parser));
    dmt.CombineParser = CombineParser;
    __reflect(CombineParser.prototype, "dmt.CombineParser");
    var XORParser = (function (_super) {
        __extends(XORParser, _super);
        function XORParser() {
            return _super.call(this, dmt.KT.XOR, "^") || this;
        }
        return XORParser;
    }(dmt.Parser));
    dmt.XORParser = XORParser;
    __reflect(XORParser.prototype, "dmt.XORParser");
    var ShiParser = (function (_super) {
        __extends(ShiParser, _super);
        function ShiParser() {
            return _super.call(this, dmt.KT.Shi, "<<") || this;
        }
        return ShiParser;
    }(dmt.Parser));
    dmt.ShiParser = ShiParser;
    __reflect(ShiParser.prototype, "dmt.ShiParser");
    var ShrParser = (function (_super) {
        __extends(ShrParser, _super);
        function ShrParser() {
            return _super.call(this, dmt.KT.Shr, ">>") || this;
        }
        return ShrParser;
    }(dmt.Parser));
    dmt.ShrParser = ShrParser;
    __reflect(ShrParser.prototype, "dmt.ShrParser");
    var UnsignedShrParser = (function (_super) {
        __extends(UnsignedShrParser, _super);
        function UnsignedShrParser() {
            return _super.call(this, dmt.KT.UnsignedShr, ">>>") || this;
        }
        return UnsignedShrParser;
    }(dmt.Parser));
    dmt.UnsignedShrParser = UnsignedShrParser;
    __reflect(UnsignedShrParser.prototype, "dmt.UnsignedShrParser");
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var AssignParser = (function (_super) {
        __extends(AssignParser, _super);
        function AssignParser() {
            return _super.call(this, dmt.KT.Assign, "=") || this;
        }
        return AssignParser;
    }(dmt.Parser));
    dmt.AssignParser = AssignParser;
    __reflect(AssignParser.prototype, "dmt.AssignParser");
    var NotParser = (function (_super) {
        __extends(NotParser, _super);
        function NotParser() {
            return _super.call(this, dmt.KT.Not, "!") || this;
        }
        return NotParser;
    }(dmt.Parser));
    dmt.NotParser = NotParser;
    __reflect(NotParser.prototype, "dmt.NotParser");
    var BitwiseNotParser = (function (_super) {
        __extends(BitwiseNotParser, _super);
        function BitwiseNotParser() {
            return _super.call(this, dmt.KT.BitwiseNot, "~") || this;
        }
        return BitwiseNotParser;
    }(dmt.Parser));
    dmt.BitwiseNotParser = BitwiseNotParser;
    __reflect(BitwiseNotParser.prototype, "dmt.BitwiseNotParser");
    var IncrementParser = (function (_super) {
        __extends(IncrementParser, _super);
        function IncrementParser() {
            return _super.call(this, dmt.KT.Increment, "++") || this;
        }
        return IncrementParser;
    }(dmt.Parser));
    dmt.IncrementParser = IncrementParser;
    __reflect(IncrementParser.prototype, "dmt.IncrementParser");
    var DecrementParser = (function (_super) {
        __extends(DecrementParser, _super);
        function DecrementParser() {
            return _super.call(this, dmt.KT.Decrement, "--") || this;
        }
        return DecrementParser;
    }(dmt.Parser));
    dmt.DecrementParser = DecrementParser;
    __reflect(DecrementParser.prototype, "dmt.DecrementParser");
    var AssignPlusParser = (function (_super) {
        __extends(AssignPlusParser, _super);
        function AssignPlusParser() {
            return _super.call(this, dmt.KT.AssignPlus, "+=") || this;
        }
        return AssignPlusParser;
    }(dmt.Parser));
    dmt.AssignPlusParser = AssignPlusParser;
    __reflect(AssignPlusParser.prototype, "dmt.AssignPlusParser");
    var AssignMinusParser = (function (_super) {
        __extends(AssignMinusParser, _super);
        function AssignMinusParser() {
            return _super.call(this, dmt.KT.AssignMinus, "-=") || this;
        }
        return AssignMinusParser;
    }(dmt.Parser));
    dmt.AssignMinusParser = AssignMinusParser;
    __reflect(AssignMinusParser.prototype, "dmt.AssignMinusParser");
    var AssignMultiplyParser = (function (_super) {
        __extends(AssignMultiplyParser, _super);
        function AssignMultiplyParser() {
            return _super.call(this, dmt.KT.AssignMultiply, "*=") || this;
        }
        return AssignMultiplyParser;
    }(dmt.Parser));
    dmt.AssignMultiplyParser = AssignMultiplyParser;
    __reflect(AssignMultiplyParser.prototype, "dmt.AssignMultiplyParser");
    var AssignDivideParser = (function (_super) {
        __extends(AssignDivideParser, _super);
        function AssignDivideParser() {
            return _super.call(this, dmt.KT.AssignDivide, "/=") || this;
        }
        return AssignDivideParser;
    }(dmt.Parser));
    dmt.AssignDivideParser = AssignDivideParser;
    __reflect(AssignDivideParser.prototype, "dmt.AssignDivideParser");
    var AssignModuloParser = (function (_super) {
        __extends(AssignModuloParser, _super);
        function AssignModuloParser() {
            return _super.call(this, dmt.KT.AssignModulo, "%=") || this;
        }
        return AssignModuloParser;
    }(dmt.Parser));
    dmt.AssignModuloParser = AssignModuloParser;
    __reflect(AssignModuloParser.prototype, "dmt.AssignModuloParser");
    var AssignInclusiveOrParser = (function (_super) {
        __extends(AssignInclusiveOrParser, _super);
        function AssignInclusiveOrParser() {
            return _super.call(this, dmt.KT.AssignInclusiveOr, "|=") || this;
        }
        return AssignInclusiveOrParser;
    }(dmt.Parser));
    dmt.AssignInclusiveOrParser = AssignInclusiveOrParser;
    __reflect(AssignInclusiveOrParser.prototype, "dmt.AssignInclusiveOrParser");
    var OrParser = (function (_super) {
        __extends(OrParser, _super);
        function OrParser() {
            return _super.call(this, dmt.KT.Or, "||") || this;
        }
        return OrParser;
    }(dmt.Parser));
    dmt.OrParser = OrParser;
    __reflect(OrParser.prototype, "dmt.OrParser");
    var AssignCombineParser = (function (_super) {
        __extends(AssignCombineParser, _super);
        function AssignCombineParser() {
            return _super.call(this, dmt.KT.AssignCombine, "&=") || this;
        }
        return AssignCombineParser;
    }(dmt.Parser));
    dmt.AssignCombineParser = AssignCombineParser;
    __reflect(AssignCombineParser.prototype, "dmt.AssignCombineParser");
    var AndParser = (function (_super) {
        __extends(AndParser, _super);
        function AndParser() {
            return _super.call(this, dmt.KT.And, "&&") || this;
        }
        return AndParser;
    }(dmt.Parser));
    dmt.AndParser = AndParser;
    __reflect(AndParser.prototype, "dmt.AndParser");
    var AssignXORParser = (function (_super) {
        __extends(AssignXORParser, _super);
        function AssignXORParser() {
            return _super.call(this, dmt.KT.AssignXOR, "^=") || this;
        }
        return AssignXORParser;
    }(dmt.Parser));
    dmt.AssignXORParser = AssignXORParser;
    __reflect(AssignXORParser.prototype, "dmt.AssignXORParser");
    // export class AssignShiParser extends Parser {
    //     public constructor() {
    //         super(TokenType.AssignShi, "<<=");
    //     }
    // }
    // export class AssignShrParser extends Parser {
    //     public constructor() {
    //         super(TokenType.AssignShr, ">>=");
    //     }
    // }
    // export class AssignUnsignedShrParser extends Parser {
    //     public constructor() {
    //         super(TokenType.AssignUnsignedShr, ">>>=");
    //     }
    // }
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var CharParser = (function (_super) {
        __extends(CharParser, _super);
        function CharParser() {
            var _this = _super.call(this, dmt.KT.None, "") || this;
            _this.autoAddVal = true;
            _this.Reset();
            return _this;
        }
        CharParser.prototype.Reset = function () {
            this.val = dmt.Token.void0;
            this.checkVal = dmt.Token.void0;
        };
        CharParser.prototype.InCheck = function () {
            return this.checkVal !== dmt.Token.void0;
        };
        CharParser.prototype.ResetCheck = function () {
            this.checkVal = dmt.Token.void0;
        };
        CharParser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (this.checkVal === dmt.Token.void0) {
                if (char == "\\") {
                    this.checkVal = char;
                    return this;
                }
                else {
                    this.val = char;
                    return null;
                }
            }
            else {
                //\
                if (this.checkVal.length == 1) {
                    switch (char) {
                        case "n":
                            this.val = "\n";
                            break;
                        case "\\":
                            this.val = "\\";
                            break;
                        case "'":
                            this.val = "\'";
                            break;
                        case "\"":
                            this.val = "\"";
                            break;
                        case "r":
                            this.val = "\r";
                            break;
                        case "b":
                            this.val = "\b";
                            break;
                        case "f":
                            this.val = "\f";
                            break;
                        case "t":
                            this.val = "\t";
                            break;
                        case "&":
                            this.val = "\&";
                            break;
                        case "u":
                            this.checkVal += char;
                            return this;
                        default:
                            this.val = char;
                    }
                }
                else {
                    if (this.checkVal.length == 5) {
                        this.val = window["unescape"]("%" + this.checkVal.substring(1, this.checkVal.length) + char);
                        return null;
                    }
                    else {
                        this.checkVal += char;
                        return this;
                    }
                }
                return null;
            }
        };
        return CharParser;
    }(dmt.Parser));
    dmt.CharParser = CharParser;
    __reflect(CharParser.prototype, "dmt.CharParser");
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var EqualParser = (function (_super) {
        __extends(EqualParser, _super);
        function EqualParser() {
            return _super.call(this, dmt.KT.Equal, "==") || this;
        }
        return EqualParser;
    }(dmt.Parser));
    dmt.EqualParser = EqualParser;
    __reflect(EqualParser.prototype, "dmt.EqualParser");
    var AllEqualParser = (function (_super) {
        __extends(AllEqualParser, _super);
        function AllEqualParser() {
            return _super.call(this, dmt.KT.AllEqual, "===") || this;
        }
        return AllEqualParser;
    }(dmt.Parser));
    dmt.AllEqualParser = AllEqualParser;
    __reflect(AllEqualParser.prototype, "dmt.AllEqualParser");
    var NotEqualParser = (function (_super) {
        __extends(NotEqualParser, _super);
        function NotEqualParser() {
            return _super.call(this, dmt.KT.NotEqual, "!=") || this;
        }
        return NotEqualParser;
    }(dmt.Parser));
    dmt.NotEqualParser = NotEqualParser;
    __reflect(NotEqualParser.prototype, "dmt.NotEqualParser");
    var AllNotEqualParser = (function (_super) {
        __extends(AllNotEqualParser, _super);
        function AllNotEqualParser() {
            return _super.call(this, dmt.KT.AllNotEqual, "!==") || this;
        }
        return AllNotEqualParser;
    }(dmt.Parser));
    dmt.AllNotEqualParser = AllNotEqualParser;
    __reflect(AllNotEqualParser.prototype, "dmt.AllNotEqualParser");
    var GreaterParser = (function (_super) {
        __extends(GreaterParser, _super);
        function GreaterParser() {
            return _super.call(this, dmt.KT.Greater, ">") || this;
        }
        return GreaterParser;
    }(dmt.Parser));
    dmt.GreaterParser = GreaterParser;
    __reflect(GreaterParser.prototype, "dmt.GreaterParser");
    ////无法识别2>=1 和 let a:Array<number>=[]
    // export class GreaterOrEqualParser extends Parser {
    //     public constructor() {
    //         super(TokenType.GreaterOrEqual, ">=");
    //     }
    // }
    var LessParser = (function (_super) {
        __extends(LessParser, _super);
        function LessParser() {
            return _super.call(this, dmt.KT.Less, "<") || this;
        }
        return LessParser;
    }(dmt.Parser));
    dmt.LessParser = LessParser;
    __reflect(LessParser.prototype, "dmt.LessParser");
    // export class LessOrEqualParser extends Parser {
    //     public constructor() {
    //         super(TokenType.LessOrEqual, "<=");
    //     }
    // }
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var DivideParser = (function (_super) {
        __extends(DivideParser, _super);
        //  / //g
        function DivideParser() {
            var _this = _super.call(this, dmt.KT.Divide, "/") || this;
            _this.checkAttributes = { g: 1, i: 1, m: 1 };
            _this.inEscape = false;
            _this.isRegExp = false;
            _this.autoAddVal = true;
            _this.Reset();
            return _this;
        }
        DivideParser.prototype.Reset = function () {
            this.word = [];
            this.startChar = dmt.Token.void0;
            this.end = false;
            this.inEscape = false;
            this.isRegExp = false;
        };
        DivideParser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (this.end) {
                this.val = this.word.join("");
                var tk = new dmt.Token(dmt.KT.RegExpVal, dmt.Token.void0);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);
                var attributes = dmt.Token.void0;
                if (this.checkAttributes[char]) {
                    stream.Read(); //把修饰符读掉
                    attributes = char;
                }
                tk.val = new RegExp(this.val, attributes);
                return null;
            }
            if (this.startChar === dmt.Token.void0) {
                var preToken = tks[tks.length - 1];
                var nextChar = stream.Peek(0);
                //正则和除号的判断，有点麻烦
                if (preToken && (preToken.type != dmt.KT.LeftPar //(/.../g)
                    && preToken.type != dmt.KT.Assign //reg=/.../g
                    && preToken.type != dmt.KT.Comma) //(...,/.../g);
                    || nextChar == "/" //注释标记
                    || nextChar == "*" //注释标记
                ) {
                    this.isRegExp = false;
                    this.startChar = char;
                    return this;
                }
                else {
                    this.isRegExp = true;
                    this.startChar = char;
                    return this;
                }
            }
            if (this.isRegExp) {
                if (char == this.startChar && !this.inEscape) {
                    this.end = true;
                }
                else {
                    if (!this.inEscape) {
                        if (char == "\\") {
                            this.inEscape = true;
                        }
                    }
                    else {
                        this.inEscape = false;
                    }
                    this.word.push(char);
                }
                return this;
            }
            else {
                return _super.prototype.TryAddValue.call(this, char, stream, tks, line, column);
            }
        };
        return DivideParser;
    }(dmt.Parser));
    dmt.DivideParser = DivideParser;
    __reflect(DivideParser.prototype, "dmt.DivideParser");
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var NumberParser = (function (_super) {
        __extends(NumberParser, _super);
        function NumberParser() {
            var _this = _super.call(this, dmt.KT.NumberVal, "") || this;
            _this.autoAddVal = true;
            _this.Reset();
            return _this;
        }
        NumberParser.prototype.Reset = function () {
            this.word = [];
            this.val = dmt.Token.void0;
            this.hexMode = false;
        };
        NumberParser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (this.hexMode) {
                if (dmt.Utils.IsHexNumber(char)) {
                    this.word.push(char);
                    return this;
                }
                this.val = parseInt(this.word.join(""), 16);
                var tk = new dmt.Token(this.type, this.val);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);
                return null;
            }
            else {
                if (dmt.Utils.IsNumber(char) || char == ".") {
                    this.word.push(char);
                    return this;
                }
                if (this.word.length == 1 && this.word[0] == "0" && char == "x") {
                    this.hexMode = true;
                    this.word.length = 0;
                    return this;
                }
                if (this.word.indexOf(".") > -1) {
                    this.val = parseFloat(this.word.join(""));
                }
                else {
                    this.val = parseInt(this.word.join(""));
                }
                var tk = new dmt.Token(this.type, this.val);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);
                return null;
            }
        };
        NumberParser.prototype.WillAcceptStart = function (char) {
            if (dmt.Utils.IsNumber(char)) {
                return true;
            }
            return false;
        };
        return NumberParser;
    }(dmt.Parser));
    dmt.NumberParser = NumberParser;
    __reflect(NumberParser.prototype, "dmt.NumberParser");
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var ReservedWordPasrser = (function (_super) {
        __extends(ReservedWordPasrser, _super);
        function ReservedWordPasrser() {
            var _this = _super.call(this, dmt.KT.ReservedWord, "") || this;
            _this.autoAddVal = true;
            var keywords = [
                dmt.KT.Var,
                dmt.KT.Let,
                dmt.KT.Const,
                dmt.KT.Instanceof,
                dmt.KT.Typeof,
                dmt.KT.If,
                dmt.KT.Else,
                dmt.KT.For,
                dmt.KT.In,
                dmt.KT.Switch,
                dmt.KT.Case,
                dmt.KT.Default,
                dmt.KT.Break,
                dmt.KT.Continue,
                dmt.KT.Return,
                dmt.KT.While,
                dmt.KT.Function,
                dmt.KT.Try,
                dmt.KT.Catch,
                dmt.KT.Throw,
                dmt.KT.Boolean,
                dmt.KT.True,
                dmt.KT.False,
                dmt.KT.String,
                dmt.KT.Null,
                dmt.KT.Export,
                dmt.KT.Abstract,
                dmt.KT.NameSpace,
                dmt.KT.Module,
                dmt.KT.Class,
                dmt.KT.Interface,
                dmt.KT.Public,
                dmt.KT.Protected,
                dmt.KT.Private,
                dmt.KT.Extends,
                dmt.KT.Static,
                dmt.KT.New,
                dmt.KT.Void,
                dmt.KT.Any,
                dmt.KT.Never,
                dmt.KT.NaN,
                dmt.KT.Undefined,
                dmt.KT.Async,
                dmt.KT.Await,
                dmt.KT.Import,
                dmt.KT.Get,
                dmt.KT.Set,
                dmt.KT.As,
                dmt.KT.Delete,
                dmt.KT.Implements,
                dmt.KT.This,
                dmt.KT.Super,
                dmt.KT.Yield,
                dmt.KT.Declare
            ];
            _this.keywords = {};
            keywords.forEach(function (fi) {
                var w = dmt.KT[fi];
                var f0 = w[0].toLowerCase();
                var f1 = w.substring(1, w.length);
                _this.keywords[f0 + f1] = fi;
            });
            //console.log(this.keywords);
            _this.Reset();
            return _this;
        }
        ReservedWordPasrser.prototype.Reset = function () {
            this.word = [];
            this.val = dmt.Token.void0;
        };
        ReservedWordPasrser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (dmt.Utils.IsLetterOrNumberExtra(char)) {
                if (this.word.length == 0) {
                    this.beginLine = line;
                    this.beginColumn = column;
                }
                this.word.push(char);
                return this;
            }
            this.val = this.word.join("");
            var type = this.type;
            //这个判断会误判
            //let firstChar = this.val.substr(0, 1);
            // if (firstChar.toLowerCase() == firstChar) {
            //     let uname = this.val.substr(0, 1).toUpperCase() + this.val.substr(1, this.val.length - 1);
            //     type = <any>KT[uname];
            //     if (type === Token.void0) {
            //         type = this.type;
            //     }
            // }
            var v = this.val;
            if (this.keywords.hasOwnProperty(v)) {
                type = this.keywords[v];
            }
            var tk = new dmt.Token(type, dmt.Token.void0);
            if (tk.type == dmt.KT.ReservedWord) {
                tk.val = this.val;
            }
            else if (tk.type == dmt.KT.True) {
                tk.val = true;
            }
            else if (tk.type == dmt.KT.False) {
                tk.val = false;
            }
            else if (tk.type == dmt.KT.Null) {
                tk.val = null;
            }
            else if (tk.type == dmt.KT.NaN) {
                tk.val = NaN;
            }
            else if (tk.type == dmt.KT.Undefined) {
                tk.val = undefined;
            }
            tk.isParser = true;
            tk.line = this.beginLine;
            tk.column = this.beginColumn;
            //如果是ts的关键词则没有值，不然就是自定义的值
            if (type == dmt.KT.ReservedWord || type == dmt.KT.Super || type == dmt.KT.This
                || type == dmt.KT.True || type == dmt.KT.False || type == dmt.KT.Null
                || type == dmt.KT.NaN || type == dmt.KT.Undefined) {
                tk.isValue = true;
            }
            else {
                tk.isValue = false;
            }
            tks.push(tk);
            return null;
        };
        ReservedWordPasrser.prototype.WillAcceptStart = function (char) {
            if (dmt.Utils.IsLetterOrNumberExtra(char)) {
                return true;
            }
            return false;
        };
        return ReservedWordPasrser;
    }(dmt.Parser));
    dmt.ReservedWordPasrser = ReservedWordPasrser;
    __reflect(ReservedWordPasrser.prototype, "dmt.ReservedWordPasrser");
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var StringParser = (function (_super) {
        __extends(StringParser, _super);
        function StringParser() {
            var _this = _super.call(this, dmt.KT.StringVal, "") || this;
            _this.autoAddVal = true;
            _this.charParser = new dmt.CharParser();
            _this.Reset();
            return _this;
        }
        StringParser.prototype.Reset = function () {
            this.word = [];
            this.startChar = dmt.Token.void0;
            this.end = false;
            this.charParser.Reset();
        };
        StringParser.prototype.TryAddValue = function (char, stream, tks, line, column) {
            if (this.end) {
                this.val = this.word.join("");
                var tk = new dmt.Token(this.type, this.val);
                tk.isParser = true;
                tk.line = line;
                tk.column = column;
                tk.isValue = true;
                tks.push(tk);
                return null;
            }
            var parser = this.charParser.TryAddValue(char, stream, tks, line, column);
            if (parser != null) {
                return this;
            }
            else {
                char = this.charParser.val;
                if (this.startChar === dmt.Token.void0) {
                    this.startChar = char;
                    return this;
                }
                if (this.charParser.InCheck()) {
                    this.word.push(char);
                    this.charParser.ResetCheck();
                }
                else {
                    if (char == this.startChar) {
                        this.end = true;
                    }
                    else {
                        this.word.push(char);
                        this.charParser.ResetCheck();
                    }
                }
                return this;
            }
        };
        StringParser.prototype.WillAcceptStart = function (char) {
            if (dmt.Utils.IsStringStart(char)) {
                return true;
            }
            return false;
        };
        return StringParser;
    }(dmt.Parser));
    dmt.StringParser = StringParser;
    __reflect(StringParser.prototype, "dmt.StringParser");
})(dmt || (dmt = {}));
///<reference path="../Parser.ts" />
var dmt;
(function (dmt) {
    var LeftParParser = (function (_super) {
        __extends(LeftParParser, _super);
        function LeftParParser() {
            return _super.call(this, dmt.KT.LeftPar, "(") || this;
        }
        return LeftParParser;
    }(dmt.Parser));
    dmt.LeftParParser = LeftParParser;
    __reflect(LeftParParser.prototype, "dmt.LeftParParser");
    var RightParParser = (function (_super) {
        __extends(RightParParser, _super);
        function RightParParser() {
            return _super.call(this, dmt.KT.RightPar, ")") || this;
        }
        return RightParParser;
    }(dmt.Parser));
    dmt.RightParParser = RightParParser;
    __reflect(RightParParser.prototype, "dmt.RightParParser");
    var LeftBraceParser = (function (_super) {
        __extends(LeftBraceParser, _super);
        function LeftBraceParser() {
            return _super.call(this, dmt.KT.LeftBrace, "{") || this;
        }
        return LeftBraceParser;
    }(dmt.Parser));
    dmt.LeftBraceParser = LeftBraceParser;
    __reflect(LeftBraceParser.prototype, "dmt.LeftBraceParser");
    var RightBraceParser = (function (_super) {
        __extends(RightBraceParser, _super);
        function RightBraceParser() {
            return _super.call(this, dmt.KT.RightBrace, "}") || this;
        }
        return RightBraceParser;
    }(dmt.Parser));
    dmt.RightBraceParser = RightBraceParser;
    __reflect(RightBraceParser.prototype, "dmt.RightBraceParser");
    var LeftBracketParser = (function (_super) {
        __extends(LeftBracketParser, _super);
        function LeftBracketParser() {
            return _super.call(this, dmt.KT.LeftBracket, "[") || this;
        }
        return LeftBracketParser;
    }(dmt.Parser));
    dmt.LeftBracketParser = LeftBracketParser;
    __reflect(LeftBracketParser.prototype, "dmt.LeftBracketParser");
    var RightBracketParser = (function (_super) {
        __extends(RightBracketParser, _super);
        function RightBracketParser() {
            return _super.call(this, dmt.KT.RightBracket, "]") || this;
        }
        return RightBracketParser;
    }(dmt.Parser));
    dmt.RightBracketParser = RightBracketParser;
    __reflect(RightBracketParser.prototype, "dmt.RightBracketParser");
    var PeriodParser = (function (_super) {
        __extends(PeriodParser, _super);
        function PeriodParser() {
            return _super.call(this, dmt.KT.Period, ".") || this;
        }
        return PeriodParser;
    }(dmt.Parser));
    dmt.PeriodParser = PeriodParser;
    __reflect(PeriodParser.prototype, "dmt.PeriodParser");
    var ParamsPreParser = (function (_super) {
        __extends(ParamsPreParser, _super);
        function ParamsPreParser() {
            return _super.call(this, dmt.KT.ParamsPre, "..") || this;
        }
        return ParamsPreParser;
    }(dmt.Parser));
    dmt.ParamsPreParser = ParamsPreParser;
    __reflect(ParamsPreParser.prototype, "dmt.ParamsPreParser");
    var ParamsParser = (function (_super) {
        __extends(ParamsParser, _super);
        function ParamsParser() {
            return _super.call(this, dmt.KT.Params, "...") || this;
        }
        return ParamsParser;
    }(dmt.Parser));
    dmt.ParamsParser = ParamsParser;
    __reflect(ParamsParser.prototype, "dmt.ParamsParser");
    var CommaParser = (function (_super) {
        __extends(CommaParser, _super);
        function CommaParser() {
            return _super.call(this, dmt.KT.Comma, ",") || this;
        }
        return CommaParser;
    }(dmt.Parser));
    dmt.CommaParser = CommaParser;
    __reflect(CommaParser.prototype, "dmt.CommaParser");
    var ColonParser = (function (_super) {
        __extends(ColonParser, _super);
        function ColonParser() {
            return _super.call(this, dmt.KT.Colon, ":") || this;
        }
        return ColonParser;
    }(dmt.Parser));
    dmt.ColonParser = ColonParser;
    __reflect(ColonParser.prototype, "dmt.ColonParser");
    var SemiColonParser = (function (_super) {
        __extends(SemiColonParser, _super);
        function SemiColonParser() {
            return _super.call(this, dmt.KT.SemiColon, ";") || this;
        }
        return SemiColonParser;
    }(dmt.Parser));
    dmt.SemiColonParser = SemiColonParser;
    __reflect(SemiColonParser.prototype, "dmt.SemiColonParser");
    var QuestionMarkParser = (function (_super) {
        __extends(QuestionMarkParser, _super);
        function QuestionMarkParser() {
            return _super.call(this, dmt.KT.QuestionMark, "?") || this;
        }
        return QuestionMarkParser;
    }(dmt.Parser));
    dmt.QuestionMarkParser = QuestionMarkParser;
    __reflect(QuestionMarkParser.prototype, "dmt.QuestionMarkParser");
    var EnterParser = (function (_super) {
        __extends(EnterParser, _super);
        function EnterParser() {
            return _super.call(this, dmt.KT.Enter, "\n") || this;
        }
        return EnterParser;
    }(dmt.Parser));
    dmt.EnterParser = EnterParser;
    __reflect(EnterParser.prototype, "dmt.EnterParser");
    var SemiColonAndEnterParser = (function (_super) {
        __extends(SemiColonAndEnterParser, _super);
        function SemiColonAndEnterParser() {
            return _super.call(this, dmt.KT.SemiColon, ";\n") || this;
        }
        return SemiColonAndEnterParser;
    }(dmt.Parser));
    dmt.SemiColonAndEnterParser = SemiColonAndEnterParser;
    __reflect(SemiColonAndEnterParser.prototype, "dmt.SemiColonAndEnterParser");
    var FunctionSymbolParser = (function (_super) {
        __extends(FunctionSymbolParser, _super);
        function FunctionSymbolParser() {
            return _super.call(this, dmt.KT.FunctionSymbol, "=>") || this;
        }
        return FunctionSymbolParser;
    }(dmt.Parser));
    dmt.FunctionSymbolParser = FunctionSymbolParser;
    __reflect(FunctionSymbolParser.prototype, "dmt.FunctionSymbolParser");
})(dmt || (dmt = {}));
