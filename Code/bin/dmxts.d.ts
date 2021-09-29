declare namespace dmt {
    class Handle {
        protected handleType: KT;
        code: CodeHandle;
        exp: Express[];
        isValue: boolean;
        vAbFunc: Function;
        enterName: string;
        enterType: KT;
        protected constructor(handleType: KT, code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        ValueA(tk: Token, ctk: Token, ps: Object): any;
        ValueParms(tk: Token, ctk: Token, ps: Object): any;
        SetValue(tk: Token, caller: Token, val: any, ctk: Token, ps: Object): void;
        Exp(me: Token, tks: Token[], bIndex: number): number;
        AfterExpress(tk: Token, tks: Token[]): void;
        private static expressABList;
        static ExpAB(tks: Token[], bIndex: number, type: KT, handle: Handle): number;
    }
}
declare namespace dmt {
    class PairsHandle extends Handle {
        handles: Object;
        protected constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Pairs extends PairsHandle {
        constructor(code: CodeHandle);
    }
    class ParPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class BracePair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
        static HandleBraceJson(tk: Token, code: CodeHandle, ctk: Token, ps: Object): Object;
    }
    class BracketPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class ElseIfPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class AngleBracketPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        AfterExpress(me: Token, tks: Token[]): void;
    }
}
declare namespace dmt {
    class Parser {
        name: string;
        type: KT;
        key: string;
        autoAddVal: boolean;
        val: any;
        constructor(type: KT, key: string);
        preParserChar: string;
        waitForChar: string;
        waitForParsers: Parser[];
        SetWaitForParser(parsers: Parser[]): void;
        Reset(): void;
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
        WillAcceptStart(char: string): boolean;
    }
}
declare namespace dmt {
    class For extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Arithmetic extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Handle11 extends Arithmetic {
        constructor(code: CodeHandle);
    }
    class Handle13 extends Arithmetic {
        constructor(code: CodeHandle);
    }
    class Handle14 extends Arithmetic {
        constructor(code: CodeHandle);
    }
    class Handle15 extends Arithmetic {
        constructor(code: CodeHandle);
    }
    class Plus extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Minus extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class Multiply extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Divide extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Exponentiation extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Modulo extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Less extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Greater extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class LessOrEqual extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class GreaterOrEqual extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class AssignBase extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Handle17 extends AssignBase {
        constructor(code: CodeHandle);
    }
    class Handle3 extends AssignBase {
        constructor(code: CodeHandle);
    }
    class Assign extends Handle {
        type: string;
        constructor(code: CodeHandle);
        ValueA(tk: Token, ctk: Token, ps: Object): any;
        V(tk: Token, ctk: Token, ps: Object): any;
        static AssignValue(tk: Token, caller: Token, val: any, ctk: Token, ps: Object, code: CodeHandle): void;
        static GetWhereIsKey(key: string, ps: Object, root: Object): any;
    }
    class AssignPlus extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class AssignMinus extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class AssignMultiply extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class AssignDivide extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class AssignModulo extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class AssignShi extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class AssignShr extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class AssignUnsignedShr extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class Increment extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class Decrement extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Combine extends Handle {
        type: string;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class XOR extends Handle {
        type: string;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class InclusiveOr extends Handle {
        type: string;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class And extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Token[]): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Or extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Token[]): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
}
declare namespace dmt {
    class Call extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        static Call(func: any, thisVal: any, paramsToken: Token, ctk: Token, ps: Object, code: CodeHandle): any;
        static CallFunction(func: Token, params: any[], ctk: Token, ps: any, code: CodeHandle): any;
        static HandleFunctionParms(tk: Token, code: CodeHandle): void;
    }
}
declare namespace dmt {
    class Class extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        GetClass(_class: any, ctk: Token, ps: Object): any;
        InstanceClass(_class: Token, ctk: Token, ps: Object): Token;
    }
    class Interface extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Colon extends Handle {
        type: string;
        skipIndex: number;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
        AfterExpress(me: Token, tks: Token[]): void;
    }
}
declare namespace dmt {
    class Comma extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
}
declare namespace dmt {
    class Declare extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare module dmt {
    class DecorateHandle extends Handle {
        handles: Object;
        protected constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Decorate extends DecorateHandle {
        constructor(code: CodeHandle);
    }
    class Public extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Protected extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Private extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Static extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Get extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Set extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class EqualOpration extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Handle10 extends EqualOpration {
        constructor(code: CodeHandle);
    }
    class Equal extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class NotEqual extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class AllEqual extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class AllNotEqual extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class _Function extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class FunctionSymbol extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class FunctionAnonymous extends Handle {
        type: string;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Json extends Handle {
        type: string;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
}
declare namespace dmt {
    class Logical extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        private static expressList;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Handle16 extends Logical {
        constructor(code: CodeHandle);
    }
    class Not extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class BitwiseNot extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class UnaryPlus extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class UnaryMinus extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class UnaryIncrement extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class UnaryDecrement extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class TypeOf extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class Void extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class Delete extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Express {
        type: KT;
        identifyType: KT | ((tk: Token, tks: Token[], index: number, express: Express) => ECT);
        pairsType: KT | ((tk: Token, express: Express) => ECT);
        preTokenTypes: (KT | ((tk: Token, express: Express) => ECT))[];
        /**
         * type:类型
         * identifyType:入口识别的类型
         * preTokenTypes:识别正确后，往前识别的类型
         * pairsType:与identifyType，成对的type，比如：{}
         * **/
        constructor(type: KT, identifyType: KT | ((tk: Token, tks: Token[], index: number, express: Express) => ECT), preTokenTypes?: (KT | ((tk: Token, express: Express) => ECT))[], pairsType?: KT | ((tk: Token, express: Express) => ECT));
        CheckIdentifyType(tk: Token, tks: Token[], index: number): ECT;
        CheckPairsType(tk: Token): ECT;
        CheckPreType(tk: Token, index: number): ECT;
        static Exps(tks: Token[], bIndex: number, exp: Express[], type: KT, handle: Handle, extraHandle?: ((tk: Token) => void)): number;
        static ExpressPairs(tks: Token[], bIndex: number, express: Express, handle: Handle, extraHandle?: Function): number;
    }
}
declare namespace dmt {
    class PairsExtraHandle extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class PairsExtra extends PairsHandle {
        constructor(code: CodeHandle);
    }
    class AssignUnsignedShrPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class AssignShrPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class GreaterOrEqualPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class AssignShiPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class LessOrEqualPair extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
}
declare namespace dmt {
    class Property extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Handle19 extends Property {
        constructor(code: CodeHandle);
    }
    class Handle19After extends Property {
        constructor(code: CodeHandle);
    }
    class Period extends Handle {
        type: string;
        constructor(code: CodeHandle);
        ValueA(tk: Token, ctk: Token, ps: Object): any;
        V(tk: Token, ctk: Token, ps: Object): any;
        SetValue(tk: Token, caller: Token, val: any, ctk: Token, ps: Object): void;
    }
    class Bracket extends Handle {
        type: string;
        constructor(code: CodeHandle);
        ValueA(tk: Token, ctk: Token, ps: Object): any;
        V(tk: Token, ctk: Token, ps: Object): any;
        SetValue(tk: Token, caller: Token, val: any, ctk: Token, ps: Object): void;
    }
}
declare namespace dmt {
    class Statement extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class HandleStatement extends Statement {
        constructor(code: CodeHandle);
    }
    class HandleAfterStatement extends Statement {
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class VariateSingle extends Handle {
        handles: Object;
        constructor(code: CodeHandle, handles: Handle[]);
        private static expressList;
        Exp(me: Token, tks: Token[], bIndex: number): number;
        AfterExpress(me: Token, tks: Token[]): void;
    }
    class HandleVariateSingle extends VariateSingle {
        constructor(code: CodeHandle);
    }
    class HandleVariateLater extends VariateSingle {
        constructor(code: CodeHandle);
    }
    class HandleVariateEarly extends VariateSingle {
        constructor(code: CodeHandle);
    }
    class VarVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class LetVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class ConstVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class ClassVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
        AfterExpress(me: Token, tks: Token[]): void;
        static DelAngleBracket(tks: Token[], bIndex: number): void;
    }
    class InterfaceVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
        AfterExpress(me: Token, tks: Token[]): void;
    }
    class AbstractVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
        AfterExpress(me: Token, tks: Token[]): void;
    }
    class PeriodVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class FunctionVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class ExtendsVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class ImplementsVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class ParamsVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class CaseVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class DefaultVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
}
declare namespace dmt {
    class Abstract extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class AsVariate extends Handle {
        type: string;
        constructor(code: CodeHandle);
        AfterExpress(me: Token, tks: Token[]): void;
    }
}
declare namespace dmt {
    class Async extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class Await extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Break extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Continue extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class CodeHandle {
        private handles;
        handleKeys: {};
        globalObject: any;
        globalCode: Token[];
        debug: boolean;
        autoBind: boolean;
        static lastToken: Token;
        constructor(globalObject?: any, debug?: boolean, autoBind?: boolean);
        Run(tk: Token): any;
        CallPreConstructor(me: Token, ctk: Token, ps: any): any;
        Initialize(tks: Token[], ctk: Token, name: string): Token;
        V(tk: Token, caller: Token, ctk: Token, ps: Object, isPublic?: boolean): any;
        VA(tk: Token, ctk: Token, ps: Object): any;
        ValueParms(tk: Token, ctk: Token, ps: Object): any;
        GetSuper(tk: Token, p: Object): any;
        private DoGetSuper(topToken, _this);
        GetThis(p: Object): any;
        GetTopToken(tk: Token): any;
        private GetTokenValue(tk, ctk, ps, isPublic?);
        Express(tk: Token): void;
        ExpressOneHandle(tk: Token, handle: Handle): void;
        GetParmsValue(key: any, ps: Object, isPublic?: boolean): any;
        private GetParmsValueOne(p, key);
        SetParmsValue(key: string, val: any, ctk: Token, p: Object): any;
        ComParams(p: Object, parent: Object): Object;
        InsertToken(tks: Token[], type: KT, newTokens: Token[], beginTokenIndex: number, endTokenIndex: number, handle: Handle, ps?: Object): Token;
        SplitToken(tks: Token[], splitType: KT): Token[][];
        static Info(): void;
        static GetLine(tk: Token): Token;
    }
}
declare namespace dmt {
    class IfVal extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class If extends Handle {
        type: string;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class ElseIf extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
    class Else extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class In extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class Instanceof extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class New extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class QuestionMarkHandle extends Handle {
        private questionMark;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class QuestionMark extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Return extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class TryVal extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
    class Try extends Handle {
        type: string;
        constructor(code: CodeHandle);
        Exp(me: Token, tks: Token[], bIndex: number): number;
    }
    class Catch extends Handle {
        type: string;
        constructor(code: CodeHandle);
    }
}
declare namespace dmt {
    class While extends Handle {
        type: string;
        constructor(code: CodeHandle);
        V(tk: Token, ctk: Token, ps: Object): any;
    }
}
declare namespace dmt {
    class Stream {
        text: string;
        index: number;
        length: number;
        line: number;
        column: number;
        constructor(text: string);
        Read(): string;
        EOF(): boolean;
        Peek(offset?: number): string;
    }
}
declare namespace dmt {
    class Utils {
        static CHARS: string[];
        static NUMS: string[];
        static HEX_NUMS: string[];
        static EXTRA_CHARS: string[];
        static letters: any;
        static letterExtras: any;
        static numbers: any;
        static hexNumbers: any;
        static stringStarts: any;
        static stringSkips: any;
        static letterOrNumbers: any;
        static letterOrNumbersExtra: any;
        static IsLetter(char: string): boolean;
        static IsLetterExtra(char: string): boolean;
        static IsNumber(char: string): boolean;
        static IsHexNumber(char: string): boolean;
        static IsStringStart(char: string): boolean;
        static IsStringSkip(char: string): boolean;
        static IsEmpty(char: string): boolean;
        static IsEmptyArray(arr: string[]): boolean;
        static IsLetterOrNumber(char: string): boolean;
        static IsLetterOrNumberExtra(char: string): boolean;
    }
}
declare namespace dmt {
    class CodeBin {
        tk: Token;
        checkAttributes: {
            g: number;
            i: number;
            m: number;
        };
        constructor(bin: string);
    }
}
declare namespace dmt {
    class CodeParser {
        parsers: Parser[];
        noKeyParsers: Parser[];
        oneKeyParsers: Parser[];
        oneKeyParserKeys: string[];
        code: string;
        stream: Stream;
        tk: Token;
        constructor(code: string);
        private TryGetParserByChar(char);
        private Parse();
        Release(): string;
    }
}
declare namespace dmt {
    enum ECT {
        Fail = 0,
        OK = 1,
        OKStay = 2,
        OKSkip = 3,
        OKSkipStay = 4,
    }
    enum KT {
        /**
         * 空类型（没有实际用途）
         */
        None = 0,
        ReservedWord = 1,
        /**
         * var
         */
        Var = 2,
        /**
         * let
         */
        Let = 3,
        /**
         * const
         */
        Const = 4,
        /**
         * {}
         */
        Brace = 5,
        /**
         * {
         */
        LeftBrace = 6,
        /**
         * }
         */
        RightBrace = 7,
        /**
         * ()
         */
        Par = 8,
        /**
         * (
         */
        LeftPar = 9,
        /**
         * )
         */
        RightPar = 10,
        /**
         * []
         */
        Bracket = 11,
        /**
         * [
         */
        LeftBracket = 12,
        /**
         * ]
         */
        RightBracket = 13,
        /**
         * <>
         */
        AngleBracket = 14,
        /**
         * .
         */
        Period = 15,
        PeriodVal = 16,
        PeriodKeyVal = 17,
        /**
         * ,
         */
        Comma = 18,
        /**
         * :
         */
        Colon = 19,
        /**
         * :
         */
        ColonVal = 20,
        /**
         * ;
         */
        SemiColon = 21,
        /**
         * ?
         */
        QuestionMark = 22,
        /**
         * +
         */
        Plus = 23,
        /**
         * +...
         */
        UnaryPlus = 24,
        /**
         * ++
         */
        Increment = 25,
        /**
         * ++...
         */
        UnaryIncrement = 26,
        /**
         * +=
         */
        AssignPlus = 27,
        /**
         * -
         */
        Minus = 28,
        /**
         * -...
         */
        UnaryMinus = 29,
        /**
         * --
         */
        Decrement = 30,
        /**
         * --...
         */
        UnaryDecrement = 31,
        /**
         * -=
         */
        AssignMinus = 32,
        /**
         * *
         */
        Multiply = 33,
        /**
         * *=
         */
        AssignMultiply = 34,
        /**
         * /
         */
        Divide = 35,
        /**
         * /=
         */
        AssignDivide = 36,
        /**
         * **
         */
        Exponentiation = 37,
        /**
         * % 模运算
         */
        Modulo = 38,
        /**
         * %=
         */
        AssignModulo = 39,
        /**
         * | 或运算
         */
        InclusiveOr = 40,
        /**
         * |=
         */
        AssignInclusiveOr = 41,
        /**
         * ||
         */
        Or = 42,
        /**
         * & 并运算
         */
        Combine = 43,
        /**
         * &=
         */
        AssignCombine = 44,
        /**
         * &&
         */
        And = 45,
        /**
         * ^ 异或
         */
        XOR = 46,
        /**
         * ^=
         */
        AssignXOR = 47,
        /**
         * <<左移
         */
        Shi = 48,
        /**
         * <<=
         */
        AssignShi = 49,
        /**
         * >> 右移
         */
        Shr = 50,
        /**
        * >>> 无符号右移
        */
        UnsignedShr = 51,
        /**
         * >>=
         */
        AssignShr = 52,
        /**
        * >>>=
        */
        AssignUnsignedShr = 53,
        /**
         * !
         */
        Not = 54,
        /**
         * ~
         */
        BitwiseNot = 55,
        /**
         * =
         */
        Assign = 56,
        /**
         * ==
         */
        Equal = 57,
        /**
         * ===
         */
        AllEqual = 58,
        /**
         * instanceof
         */
        Instanceof = 59,
        /**
         * typeof
         */
        Typeof = 60,
        /**
         * !=
         */
        NotEqual = 61,
        /**
         * !==
         */
        AllNotEqual = 62,
        /**
         * >
         */
        Greater = 63,
        /**
         * >=
         */
        GreaterOrEqual = 64,
        /**
         *  <
         */
        Less = 65,
        /**
         * <=
         */
        LessOrEqual = 66,
        /**
         * ..
         */
        ParamsPre = 67,
        /**
         * ...
         */
        Params = 68,
        /**
         * if
         */
        If = 69,
        /**
         * if
         */
        IfVal = 70,
        /**
         * else
         */
        Else = 71,
        /**
         * else	if
         */
        ElseIf = 72,
        /**
         * for
         */
        For = 73,
        /**
         * dynamic
         */
        /**
         * in
         */
        In = 74,
        /**
         * switch
         */
        Switch = 75,
        /**
         * case
         */
        Case = 76,
        CaseVal = 77,
        /**
         * default
         */
        Default = 78,
        DefaultVal = 79,
        /**
         * break
         */
        Break = 80,
        /**
         * continue
         */
        Continue = 81,
        /**
         * return
         */
        Return = 82,
        /**
         * while
         */
        While = 83,
        /**
         * function
         */
        Function = 84,
        /**
         * try
         */
        Try = 85,
        TryVal = 86,
        /**
         * catch
         */
        Catch = 87,
        /**
         * throw
         */
        Throw = 88,
        /**
         * boolean
         */
        Boolean = 89,
        /**
         * bool true false
         */
        BooleanVal = 90,
        /**
         * true
         */
        True = 91,
        /**
         * false
         */
        False = 92,
        /**
         * int float
         */
        Number = 93,
        /**
         * int float
         */
        NumberVal = 94,
        /**
         * string
         */
        String = 95,
        /**
        * string
        */
        StringVal = 96,
        /**
         * null
         */
        Null = 97,
        /**
         * export
         */
        Export = 98,
        /**
         * abstract
         */
        Abstract = 99,
        /**
         * 名称空间定义（暂时当作模块来使用）
         */
        NameSpace = 100,
        /**
         * 模块定义
         */
        Module = 101,
        /**
         * 类定义
         */
        Class = 102,
        ClassInstance = 103,
        PreConstructor = 104,
        /**
         * 接口定义
         */
        Interface = 105,
        InterfaceInstance = 106,
        /**
         * 公共
         */
        Public = 107,
        /**
         * 保护
         */
        Protected = 108,
        /**
         * 私有
         */
        Private = 109,
        /**
         * 继承
         */
        Extends = 110,
        /**
         * 静态
         */
        Static = 111,
        /**
         * 实例
         */
        New = 112,
        /**
         * undefined or null
         */
        Void = 113,
        /**
         * any
         */
        Any = 114,
        /**
         * never
         */
        Never = 115,
        /**
         * 是window下的一个值，不是关键词
         */
        NaN = 116,
        /**
        * 是window下的一个值，不是关键词
        */
        Undefined = 117,
        Async = 118,
        Await = 119,
        /**
         * 引入
         */
        Import = 120,
        /**
         * get
         */
        Get = 121,
        /**
         * set
         */
        Set = 122,
        /**
         * as
         */
        As = 123,
        /**
         * delete
         */
        Delete = 124,
        /**
         * implements
         */
        Implements = 125,
        Annotation = 126,
        AnnotationStar = 127,
        Call = 128,
        Enter = 129,
        /**
         * =>
         */
        FunctionSymbol = 130,
        /**
         * function(){}
         */
        FunctionAnonymous = 131,
        Customize = 132,
        This = 133,
        Super = 134,
        End = 135,
        AnyOne = 136,
        Yield = 137,
        YieldStar = 138,
        Json = 139,
        JsonVal = 140,
        Declare = 141,
        RegExpVal = 142,
    }
}
declare namespace dmt {
    class Token {
        static void0: any;
        readonly name: string;
        type: KT;
        val: any;
        isParser: boolean;
        expressed: boolean;
        defaultVal: Token;
        tks: Token[];
        handle: Handle;
        decorate: KT;
        static: boolean;
        get: boolean;
        set: boolean;
        _class: any;
        _constructor: any;
        preConstructor: Token;
        callerToken: Token;
        AddDebugLine(caller: Token): void;
        extends: any;
        parent: Token;
        top: Token;
        ps: Object;
        line: number;
        column: number;
        isValue: boolean;
        colon: Token;
        signal: KT;
        returnVal: any;
        constructor(type: KT, val: any);
    }
}
declare namespace dmt {
    class TsCode {
        static Run(code: string, globalObject: any): any;
    }
}
declare namespace dmt {
    class AnnotationParser extends Parser {
        constructor();
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
    }
    class AnnotationStarParser extends Parser {
        constructor();
        noteChar: boolean;
        end: boolean;
        Reset(): void;
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
    }
}
declare namespace dmt {
    class PlusParser extends Parser {
        constructor();
    }
    class MinusParser extends Parser {
        constructor();
    }
    class MultiplyParser extends Parser {
        constructor();
    }
    class ExponentiationParser extends Parser {
        constructor();
    }
    class ModuloParser extends Parser {
        constructor();
    }
    class InclusiveOrParser extends Parser {
        constructor();
    }
    class CombineParser extends Parser {
        constructor();
    }
    class XORParser extends Parser {
        constructor();
    }
    class ShiParser extends Parser {
        constructor();
    }
    class ShrParser extends Parser {
        constructor();
    }
    class UnsignedShrParser extends Parser {
        constructor();
    }
}
declare namespace dmt {
    class AssignParser extends Parser {
        constructor();
    }
    class NotParser extends Parser {
        constructor();
    }
    class BitwiseNotParser extends Parser {
        constructor();
    }
    class IncrementParser extends Parser {
        constructor();
    }
    class DecrementParser extends Parser {
        constructor();
    }
    class AssignPlusParser extends Parser {
        constructor();
    }
    class AssignMinusParser extends Parser {
        constructor();
    }
    class AssignMultiplyParser extends Parser {
        constructor();
    }
    class AssignDivideParser extends Parser {
        constructor();
    }
    class AssignModuloParser extends Parser {
        constructor();
    }
    class AssignInclusiveOrParser extends Parser {
        constructor();
    }
    class OrParser extends Parser {
        constructor();
    }
    class AssignCombineParser extends Parser {
        constructor();
    }
    class AndParser extends Parser {
        constructor();
    }
    class AssignXORParser extends Parser {
        constructor();
    }
}
declare namespace dmt {
    class CharParser extends Parser {
        checkVal: string;
        constructor();
        Reset(): void;
        InCheck(): any;
        ResetCheck(): void;
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
    }
}
declare namespace dmt {
    class EqualParser extends Parser {
        constructor();
    }
    class AllEqualParser extends Parser {
        constructor();
    }
    class NotEqualParser extends Parser {
        constructor();
    }
    class AllNotEqualParser extends Parser {
        constructor();
    }
    class GreaterParser extends Parser {
        constructor();
    }
    class LessParser extends Parser {
        constructor();
    }
}
declare namespace dmt {
    class DivideParser extends Parser {
        constructor();
        checkAttributes: {
            g: number;
            i: number;
            m: number;
        };
        word: string[];
        startChar: string;
        end: boolean;
        inEscape: boolean;
        isRegExp: boolean;
        Reset(): void;
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
    }
}
declare namespace dmt {
    class NumberParser extends Parser {
        constructor();
        word: string[];
        hexMode: boolean;
        Reset(): void;
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
        WillAcceptStart(char: string): boolean;
    }
}
declare namespace dmt {
    class ReservedWordPasrser extends Parser {
        constructor();
        keywords: Object;
        word: string[];
        beginLine: number;
        beginColumn: number;
        Reset(): void;
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
        WillAcceptStart(char: string): boolean;
    }
}
declare namespace dmt {
    class StringParser extends Parser {
        constructor();
        charParser: CharParser;
        word: string[];
        startChar: string;
        end: boolean;
        Reset(): void;
        TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser;
        WillAcceptStart(char: string): boolean;
    }
}
declare namespace dmt {
    class LeftParParser extends Parser {
        constructor();
    }
    class RightParParser extends Parser {
        constructor();
    }
    class LeftBraceParser extends Parser {
        constructor();
    }
    class RightBraceParser extends Parser {
        constructor();
    }
    class LeftBracketParser extends Parser {
        constructor();
    }
    class RightBracketParser extends Parser {
        constructor();
    }
    class PeriodParser extends Parser {
        constructor();
    }
    class ParamsPreParser extends Parser {
        constructor();
    }
    class ParamsParser extends Parser {
        constructor();
    }
    class CommaParser extends Parser {
        constructor();
    }
    class ColonParser extends Parser {
        constructor();
    }
    class SemiColonParser extends Parser {
        constructor();
    }
    class QuestionMarkParser extends Parser {
        constructor();
    }
    class EnterParser extends Parser {
        constructor();
    }
    class SemiColonAndEnterParser extends Parser {
        constructor();
    }
    class FunctionSymbolParser extends Parser {
        constructor();
    }
}
