namespace dmt {
    export class Break extends Handle {
        public type = "break";

        public constructor(code: CodeHandle) {
            super(KT.Break, code);

            this.exp = [
                new Express(KT.Break, KT.Break)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            ctk.signal = this.handleType;
            return tk;
        }
    }
}