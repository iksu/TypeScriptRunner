///<reference path="../Parser.ts" />
namespace dmt {
    export class AnnotationParser extends Parser {
        public constructor() {
            super(KT.Annotation, "//");
            this.autoAddVal = true;
            this.Reset();
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (char == "\r" || char == "\n") {
                return null;
            }
            return this;
        }
    }

    export class AnnotationStarParser extends Parser {
        public constructor() {
            super(KT.AnnotationStar, "/*");
            this.autoAddVal = true;
            this.Reset();
        }

        public noteChar: boolean;
        public end: boolean;

        public Reset() {
            this.noteChar = false;
            this.end = false;
        }

        public TryAddValue(char: string, stream: Stream, tks: Token[], line: number, column: number): Parser {
            if (this.end) {
                return null;
            }
            if (char == "*") {
                this.noteChar = true;
                return this;
            }
            if (this.noteChar && char == "/") {
                this.end = true;
                return this;
            }
            this.noteChar = false;
            return this;
        }
    }
}