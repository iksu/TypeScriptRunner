///<reference path="TokenType.ts" />
namespace dmt {
    export class Token {
        public static void0 = void 0;

        public get name(): string {
            return KT[this.type];
        }
        public type: KT;
        public val: any;

        public isParser: boolean = false;//是否是源代码载入的
        public expressed: boolean = false;//是否被解析

        public defaultVal: Token;//默认参数

        public tks: Token[];//过程列表
        public handle: Handle;//处理对象

        public decorate: KT;//装饰语法：如public 
        public static: boolean;//是否为静态语法
        public get: boolean;
        public set: boolean;

        public _class: any;
        public _constructor: any;//默认构造函数
        public preConstructor: Token;//构造函数之前执行的函数，用于赋值

        public callerToken: Token;//调用追踪

        public AddDebugLine(caller: Token) {
            this.callerToken = caller;
        }

        public extends: any;//父类的实例

        public parent: Token;//属于哪个父级
        public top: Token;//属于哪个类的Token，暂时没用到

        //参数，相当于js的prototype，但是为了兼容其他语言，所以使用其他命名进行实现
        //一开始为了解决this问题，其实使用js的__proto__就可以了
        //但是如果使用js的特性太多，其他语言就不好解析了
        public ps: Object;

        public line: number;//调试位置
        public column: number;//调试位置

        public isValue: boolean = false;//是否可以计算值

        public colon: Token;//...:number

        public signal: KT = KT.None;//return,break,continue
        public returnVal: any;//return,break,continue

        public constructor(type: KT, val: any) {// key: string,
            if (type !== Token.void0) {
                this.type = type;
            }
            if (val !== Token.void0) {
                this.val = val;
            }
        }
    }
}