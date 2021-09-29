namespace dmt {
    export class Abstract extends Handle {
        public type = "abstract ...(...){}";

        public constructor(code: CodeHandle) {
            super(KT.Abstract, code);
            this.isValue = true;

            this.exp = [
                new Express(KT.Abstract, KT.Abstract),
                new Express(KT.Brace, KT.Brace)];
        }

        public V(tk: Token, ctk: Token, ps: Object): any {
            //TODO:
            return null;
        }
    }
}