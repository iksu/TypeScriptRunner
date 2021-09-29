///<reference path="../../Handle.ts" />
namespace dmt {
    export class Instanceof extends Handle {
        public type = "... instanceof ...";

        public constructor(code: CodeHandle) {
            super(KT.Instanceof, code);

            this.isValue = true;

            this.vAbFunc = (a, b) => {
                return a instanceof b;
            };
        }
    }
}
