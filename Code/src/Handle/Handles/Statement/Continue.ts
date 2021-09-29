namespace dmt {
    export class Continue extends Handle {
        public type = "continue";

        public constructor(code: CodeHandle) {
            super(KT.Continue, code);

            this.exp = [
                new Express(KT.Continue, KT.Continue)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            ctk.signal = this.handleType;
            return tk;
        }
    }
}