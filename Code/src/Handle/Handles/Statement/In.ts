///<reference path="../../Handle.ts" />
namespace dmt {
    export class In extends Handle {
        public type = "... in ...";

        public constructor(code: CodeHandle) {
            super(KT.In, code);
        }
    }
}
