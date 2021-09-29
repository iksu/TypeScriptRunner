namespace dmt {
    export class Express {
        public type: KT;
        public identifyType: KT | ((tk: Token, tks: Token[], index: number, express: Express) => ECT);
        public pairsType: KT | ((tk: Token, express: Express) => ECT);
        public preTokenTypes: (KT | ((tk: Token, express: Express) => ECT))[];

        /**
         * type:类型
         * identifyType:入口识别的类型
         * preTokenTypes:识别正确后，往前识别的类型
         * pairsType:与identifyType，成对的type，比如：{}
         * **/
        public constructor(type: KT,
            identifyType: KT | ((tk: Token, tks: Token[], index: number, express: Express) => ECT),
            preTokenTypes: (KT | ((tk: Token, express: Express) => ECT))[] = null,
            pairsType: KT | ((tk: Token, express: Express) => ECT) = KT.None) {

            this.type = type;
            this.identifyType = identifyType;
            this.pairsType = pairsType;
            this.preTokenTypes = preTokenTypes;
        }

        public CheckIdentifyType(tk: Token, tks: Token[], index: number): ECT {
            if (this.identifyType instanceof Function) {
                return this.identifyType(tk, tks, index, this);
            } else {
                let val = (tk.type == this.identifyType || this.type == KT.AnyOne);
                if (val) {
                    return ECT.OK;
                } else {
                    return ECT.Fail;
                }
            }
        }

        public CheckPairsType(tk: Token): ECT {
            if (this.pairsType instanceof Function) {
                return this.pairsType(tk, this);
            } else {
                let val = (tk.type == this.pairsType || this.pairsType == KT.AnyOne);
                if (val) {
                    return ECT.OK;
                } else {
                    return ECT.Fail;
                }
            }
        }

        public CheckPreType(tk: Token, index: number): ECT {
            if (!tk) {
                return ECT.Fail;
            }
            let preTokenType = this.preTokenTypes[index];
            if (preTokenType instanceof Function) {
                return preTokenType(tk, this);
            } else {
                let val = (tk.type == preTokenType || preTokenType == KT.AnyOne);
                if (val) {
                    return ECT.OK;
                } else {
                    return ECT.Fail;
                }
            }
        }

        //ExpressByExpresss
        public static Exps(tks: Token[], bIndex: number, exp: Express[], type: KT, handle: Handle, extraHandle: ((tk: Token) => void) = null): number {
            let newTokens: Token[];
            let expressIndex = 0;
            let endTokenIndex = -1;
            let beginTokenIndex = -1;

            for (let i = bIndex, len = tks.length; i < len; i++) {
                let tk = tks[i];
                let express = exp[expressIndex];
                if (!express) {
                    return beginTokenIndex + 1;
                }
                if (newTokens) {
                    let checkType = express.CheckIdentifyType(tk, tks, i);
                    if (checkType == ECT.OK
                        || checkType == ECT.OKStay
                        || checkType == ECT.OKSkip
                        || checkType == ECT.OKSkipStay) {
                        if (checkType != ECT.OKSkip
                            && checkType != ECT.OKSkipStay) {
                            newTokens.push(tk);
                        }
                        if (checkType != ECT.OKStay
                            && checkType != ECT.OKSkipStay) {
                            expressIndex++;
                        }
                        if (expressIndex >= exp.length) {
                            if (checkType == ECT.OKSkip
                                || checkType == ECT.OKSkipStay) {
                                endTokenIndex = i - 1;
                            } else {
                                endTokenIndex = i;
                            }
                            break;
                        }
                    } else {
                        if (express.identifyType instanceof Function && type != KT.QuestionMark && type != KT.AngleBracket) {
                            console.warn("something maybe wrong: ", KT[type], handle);
                        }
                        return bIndex + 1;
                    }
                } else {
                    let checkType = express.CheckIdentifyType(tk, tks, i);
                    if (checkType == ECT.OK
                        || checkType == ECT.OKStay
                        || checkType == ECT.OKSkip
                        || checkType == ECT.OKSkipStay) {
                        newTokens = [];
                        beginTokenIndex = i;

                        if (express.preTokenTypes && express.preTokenTypes.length > 0) {
                            for (let p = 0, len = express.preTokenTypes.length; p < len; p++) {
                                let preToken = tks[bIndex - (len - p)];
                                if (express.CheckPreType(preToken, p) == ECT.OK) {
                                    newTokens.push(preToken);
                                } else {
                                    return bIndex + 1;
                                }
                            }
                            beginTokenIndex -= express.preTokenTypes.length;
                        }
                        if (checkType != ECT.OKSkip
                            && checkType != ECT.OKSkipStay) {
                            newTokens.push(tk);
                        }
                        if (checkType != ECT.OKStay
                            && checkType != ECT.OKSkipStay) {
                            expressIndex++;
                        }
                        if (expressIndex >= exp.length) {
                            endTokenIndex = i;
                            break;
                        }
                    } else {
                        return bIndex + 1;
                    }
                }
            }
            if (beginTokenIndex >= 0 && endTokenIndex >= beginTokenIndex) {
                let t = handle.code.InsertToken(tks, type, newTokens, beginTokenIndex, endTokenIndex, handle);
                if (extraHandle) {
                    extraHandle(t);
                }
                return beginTokenIndex + 1;
            }
            return -1;
        }


        public static ExpressPairs(tks: Token[], bIndex: number, express: Express, handle: Handle, extraHandle: Function = null): number {
            let newTokens: Token[] = null;
            let beginTokenIndex = 0;
            let inPairs;
            let pairsIndex = 0;

            for (let i = bIndex, len = tks.length; i < len; i++) {
                let tk = tks[i];
                if (inPairs) {
                    if (express.CheckIdentifyType(tk, tks, i) == ECT.OK) {
                        pairsIndex++;
                        newTokens.push(tk);
                    } else if (express.CheckPairsType(tk) == ECT.OK) {
                        pairsIndex--;
                        if (pairsIndex <= 0) {
                            let endTokenIndex = i;
                            let t = handle.code.InsertToken(tks, express.type, newTokens, beginTokenIndex, endTokenIndex, handle);
                            //code.Express(newTokens);//这里不能执行，需要用到的时候执行，不然无法判断{}对象是方法还是json，()里面是参数还是计算等
                            if (extraHandle) {
                                extraHandle(t);
                            }
                            return bIndex + 1;
                        }
                        newTokens.push(tk);
                    } else {
                        newTokens.push(tk);
                    }
                }
                else if (express.CheckIdentifyType(tk, tks, i) == ECT.OK) {
                    inPairs = true;
                    newTokens = [];
                    beginTokenIndex = i;
                    pairsIndex = 1;
                }
            }
            return -1;
        }
    }
}