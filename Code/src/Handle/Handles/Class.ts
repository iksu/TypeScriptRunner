namespace dmt {
    export class Class extends Handle {
        public type = "class ...(...){}";

        public constructor(code: CodeHandle) {
            super(KT.Class, code);
            this.isValue = true;

            this.exp = [
                new Express(KT.Class, KT.Class),
                new Express(KT.Brace, KT.Brace)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            let _classVal = this.GetClass(tk, ctk, ps);
            return _classVal;
        }


        public GetClass(_class: any, ctk: Token, ps: Object) {
            if (_class instanceof Token) {
                if (!_class._class) {

                    let head = _class.tks[0];
                    this.code.Express(head);
                    let className = head.tks[0].val;

                    _class.ps = {};
                    
                    //let nps = this.code.ComParams(_class.ps, ps);

                    let nps = this.code.ComParams(_class.ps, ps);
                    delete nps["__this__"];

                    this.code.SetParmsValue(className, nps, ctk, ps);//暂时赋值

                    let brace = _class.tks[_class.tks.length - 1];
                    this.code.Express(brace);
                    for (let i = 0, len = brace.tks.length; i < len; i++) {
                        let fi = brace.tks[i];
                        if (fi.static && fi.type != KT.SemiColon) {
                            this.code.V(fi, _class, ctk, nps);
                        }
                    };

                    //初始化
                    //_class是代码的class，_classVal就是_class解析后的值，可以被new，其中ps就是prototype
                    //_class._class就是_classVal可以被js直接识别的形式，其实_classVal=_class._class，只是形态不一样
                    let _classVal = this.InstanceClass(_class, ctk, nps);
                    let code = this.code;
                    //_classVal.ps["__token__"] = _class;

                    //其他语言，使用下面的方法，但是不能兼容外部调用
                    // return _classVal; 
                    //返回兼容外部调用的class
                    _class._class = (function () {
                        let $ = function () {
                            //new的执行过程:
                            //1赋值静态属性
                            //2赋值父类的方法
                            //3赋值方法
                            //4赋值父类的值
                            //5执行父类初始化
                            //6赋值子类的值
                            //7执行子类初始化

                            let ps = this;//这里的this，由New.ts的let val = _classVal.apply(me, paramsFunc)进行传递

                            //4如果没有父类，则直接赋值，不然等super过后进行复制
                            if (!_classVal.extends) {
                                code.CallPreConstructor(_classVal, ctk, ps);
                            }
                            //执行构造方法，在构造方法的super那里执行赋值子类的值                           
                            let _constructor = _classVal._constructor;
                            if (_constructor) {
                                _constructor.apply(ps, arguments);
                            }
                            return ps;
                        };

                        //1赋值静态属性
                        for (var fi in _class.ps) {
                            if (_class.ps.hasOwnProperty(fi)) {
                                let des = Object.getOwnPropertyDescriptor(_class.ps, fi);
                                Object.defineProperty($, fi, des);
                            }
                        }

                        //2赋值父类方法
                        if (_classVal.extends) {
                            let r = function () {
                                this.constructor = _classVal.extends.constructor;
                            }
                            r.prototype = _classVal.extends.prototype;
                            let rs = new r();
                            $.prototype = rs;
                        }

                        //3赋值方法
                        for (var fi in _classVal.ps) {
                            if (_classVal.ps.hasOwnProperty(fi)) {
                                let des = Object.getOwnPropertyDescriptor(_classVal.ps, fi);
                                Object.defineProperty($.prototype, fi, des);
                            }
                        }
                        //赋值其他
                        Object.defineProperty($.prototype, "__token__", {
                            value: _classVal,
                            enumerable: false,
                            configurable: false
                        });
                        Object.defineProperty($.prototype, "__curToken__", {
                            value: _classVal,
                            enumerable: false,
                            configurable: false
                        });
                        if (_classVal.extends) {
                            Object.defineProperty($.prototype, "__extends__", {
                                value: _classVal.extends,
                                enumerable: false,
                                configurable: true
                            });
                        }
                        Object.defineProperty($, "__token__", {
                            value: _classVal,
                            enumerable: false,
                            configurable: false
                        });
                        return $;
                    })();

                    this.code.SetParmsValue(className, _class._class, ctk, ps);
                }
                return _class._class;

            } else {
                return _class;
                //这里会出现调用外部对象，比如new Array()
                //实现需要增加中间代理类，
                //如果是其他预言的解析，则直接调用注册的代理方法

            }
        }

        public InstanceClass(_class: Token, ctk: Token, ps: Object): Token {
            //寻找并初始化继承
            let extendsClassVal: any = null;
            let extendsToken: Token = null;
            for (let i = 0, len = _class.tks[0].tks.length; i < len; i++) {
                let tk = _class.tks[0].tks[i];
                if (tk.type == KT.Extends) {
                    extendsToken = tk;
                    break;
                }
            }

            if (extendsToken) {
                let extendsClass = this.code.V(extendsToken, _class, ctk, ps);
                if (!extendsClass) {
                    throw new Error("'Extends' does not exist");
                }
                if (extendsClass instanceof Token) {
                    extendsClassVal = this.InstanceClass(extendsClass, ctk, ps);
                } else {
                    //处理继承外部类，如果使用其他语言实现，可以直接注释
                    extendsClassVal = extendsClass;
                }
            }

            let classVal: Token = this.code.Initialize(_class.tks[_class.tks.length - 1].tks, ctk, _class.name);
            for (let i = 0, len = classVal.tks.length; i < len; i++) {
                let child = classVal.tks[i];
                child.parent = classVal;
            }

            //处理constructor 保存constructor
            let _constructor: Token = this.code.GetParmsValue("constructor", classVal.ps, false);
            if (_constructor) {
                classVal._constructor = _constructor;
            }

            if (extendsClassVal) {
                classVal.extends = extendsClassVal;
            }
            return classVal;
        }
    }


    export class Interface extends Handle {
        public type = "interface ...(...){}";

        public constructor(code: CodeHandle) {
            super(KT.Interface, code);
            this.isValue = true;

            this.exp = [
                new Express(KT.Interface, KT.Interface),
                new Express(KT.Brace, KT.Brace)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            return null;
        }
    }
}