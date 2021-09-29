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
namespace dmt {
    export class TsCode {
        public static Run(code: string, globalObject: any) {
            let p = new CodeParser(code);
            let h = new CodeHandle(globalObject);
            return h.Run(p.tk);
        }
    }
}
window["dmt"] = dmt;

// class JSZip {
//     public constructor() {
//     }
//     public loadAsync(arrayBuffer: any): any {
//         return null;
//     }
// }