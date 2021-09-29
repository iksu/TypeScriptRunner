namespace dmt {
    export class Stream {
        public text: string;
        public index: number;
        public length: number;

        public line: number = 1;
        public column: number = 1;

        public constructor(text: string) {
            this.text = text;

            this.index = 0;
            this.length = text.length;
        }

        public Read(): string {
            let val = this.text.charAt(this.index);
            this.index++;
            //if(debug){}
            if (val == "\n") {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            return val;
        }

        public EOF(): boolean {
            return this.index >= this.length;
        }

        public Peek(offset: number = 0): string {
            let val = this.text.charAt(this.index + offset);
            return val;
        }

    }
}