namespace dmt {
    export class Handle {
        protected handleType: KT;//类型              
        public code: CodeHandle;//处理总类
        public exp: Express[];//解析函数
        public isValue: boolean;//是否可以计算值

        public vAbFunc: Function;

        public enterName: string;//入口名称
        public set enterType(val: KT) {
            this.enterName = KT[val];
        };

        protected constructor(handleType: KT, code: CodeHandle) {
            this.handleType = handleType;
            this.enterType = handleType;
            this.code = code;
            // if (this.code.handleKeys[this.enterName]) {
            //     console.log(this.enterName);
            // }
            this.code.handleKeys[handleType] = this;
        }

        //tk:token
        //ctk:ctk
        public V(tk: Token, ctk: Token, ps: Object): any {
            if (this.vAbFunc) {
                let a = this.code.V(tk.tks[0], tk, ctk, ps);
                let b = this.code.V(tk.tks[1], tk, ctk, ps);
                return this.vAbFunc(a, b);
            }
            return tk.val;
        }

        //如果a.b要获得a的部分
        public ValueA(tk: Token, ctk: Token, ps: Object): any {
            return tk;
        }

        public ValueParms(tk: Token, ctk: Token, ps: Object): any {
            return this.V(tk, ctk, ps);
        }

        public SetValue(tk: Token, caller: Token, val: any, ctk: Token, ps: Object) {
            let key = this.code.V(tk, caller, ctk, ps);
            this.code.SetParmsValue(key, val, ctk, ps);
        }

        //Express
        public Exp(me: Token, tks: Token[], bIndex: number): number {
            let index = Express.Exps(tks, bIndex, this.exp, this.handleType, this);
            return index;
        }

        public AfterExpress(tk: Token, tks: Token[]) {
        }

        private static expressABList = {};
        //ExpressAB
        public static ExpAB(tks: Token[], bIndex: number, type: KT, handle: Handle): number {
            let exp = Handle.expressABList[type];
            if (!exp) {
                exp = [new Express(type, (t, tks, index, express) => {
                    if (t.type == type) {
                        return ECT.OKSkip;
                    } else {
                        return ECT.Fail;
                    }
                }, [KT.AnyOne]),
                new Express(KT.AnyOne, KT.AnyOne)];
                Handle.expressABList[type] = exp;
            }
            return Express.Exps(tks, bIndex, exp, type, handle);
        }
    }
}