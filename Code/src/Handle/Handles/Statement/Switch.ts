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