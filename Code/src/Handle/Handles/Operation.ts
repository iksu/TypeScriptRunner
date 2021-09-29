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