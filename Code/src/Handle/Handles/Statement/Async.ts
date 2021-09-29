namespace dmt {
    export class Async extends Handle {
        public type = "async ...";

        public constructor(code: CodeHandle) {
            super(KT.Async, code);
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            //TODO:
            return null;
        }
    }

    export class Await extends Handle {
        public type = "await ...";

        public constructor(code: CodeHandle) {
            super(KT.Await, code);
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            //TODO:
            return null;
        }
    }
}