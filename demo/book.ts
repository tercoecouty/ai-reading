import { isChineseChar, isChinesePunctuation } from "./char";

export class Book {
    private charCodeSet: Set<number> = new Set();
    private charCodeArray: Uint16Array;
    private paraRangeArray: Uint32Array;

    constructor(bookText: string) {
        this.init(bookText);
    }

    init(bookText: string) {
        let charCodeList: number[] = [];
        let paraRangeList: number[] = [0];
        let paraCharCount = 0;
        let charIndex = 0;
        const length = bookText.length;

        for (let index = 0; index < length; index++) {
            const charCode = bookText[charIndex++].charCodeAt(0);

            if (charCode === 10) {
                if (paraCharCount === 0) continue;

                paraRangeList.push(charCodeList.length);
                paraCharCount = 0;
                continue;
            }

            if (charCode <= 31 || charCode === 127) continue;

            if (!isChineseChar(charCode) && !isChinesePunctuation(charCode)) {
                this.charCodeSet.add(charCode);
            }

            charCodeList.push(charCode);
            paraCharCount++;
        }

        if (paraCharCount !== 0) paraRangeList.push(charCodeList.length);

        this.charCodeArray = Uint16Array.from(charCodeList);
        this.paraRangeArray = Uint32Array.from(paraRangeList);
    }

    getCharCodeSet() {
        return this.charCodeSet;
    }
}

const book = new Book("123\n你好");
console.log(book);
