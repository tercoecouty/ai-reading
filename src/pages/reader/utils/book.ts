import { isChineseChar, isChinesePunctuation, isInvisible, isWhitespace } from "./char";

export class Book {
    private charCodeSet: Set<number> = new Set();
    private charCodeArray: Uint16Array;
    private paraRangeArray: Uint32Array;

    constructor(bookText: string) {
        this.init(bookText);
    }

    init(bookText: string) {
        // 整本书的字符数组。
        // 其中移除了换行符、空白和不能显示的字符
        let charCodes: number[] = [];
        /**
         * paraRanges [0, 10, 42, 196] 表示：
         * charCodes 数组中下标 0-9 为第一行的字符
         * 下标 10-41 为第二行的字符
         * 下标 42-195 为第三行的字符
         * 注意 charCodes 中没有换行符，一本书的行数由 paraRanges 的长度确定
         */
        let paraRanges: number[] = [0];
        const length = bookText.length;

        let lineCharCodes = [];
        for (let index = 0; index < length; index++) {
            const charCode = bookText[index].charCodeAt(0);

            // 换行符
            if (charCode === 10) {
                // 处理空行
                if (lineCharCodes.length === 0) continue;

                // 去除多余的空白
                const trimList = this.trimWhiteSpace(lineCharCodes);
                if (trimList.length === 0) {
                    lineCharCodes = [];
                    continue;
                }

                charCodes.push(...trimList);
                paraRanges.push(charCodes.length);
                lineCharCodes = [];
                continue;
            }

            // 删除无法显示的字符
            if (isInvisible(charCode)) continue;

            // 将汉字和中文标点之外的字符加入字符集
            if (!isChineseChar(charCode) && !isChinesePunctuation(charCode)) {
                this.charCodeSet.add(charCode);
            }

            lineCharCodes.push(charCode);
        }

        const trimList = this.trimWhiteSpace(lineCharCodes);
        if (trimList.length !== 0) {
            charCodes.push(...trimList);
            paraRanges.push(charCodes.length);
        }

        // 转换成类型数组，减少内存的使用
        this.charCodeArray = Uint16Array.from(charCodes);
        this.paraRangeArray = Uint32Array.from(paraRanges);
    }

    getCharCodeSet(): Set<number> {
        return this.charCodeSet;
    }

    getTotalParaNumber(): number {
        return this.paraRangeArray.length - 1;
    }

    *getParas() {
        for (let index = 1; index < this.paraRangeArray.length; index++) {
            const charBeginId = this.paraRangeArray[index - 1];
            const charEndId = this.paraRangeArray[index];

            const paraData = {
                paraCharCodeArray: this.charCodeArray.slice(charBeginId, charEndId),
                paraId: index,
                charBeginId,
            };

            yield paraData;
        }
    }

    /**
     * 接受一个字符数组，去除两边的空白字符。
     * 返回去除了空白的字符数组
     */
    private trimWhiteSpace(charCodes: number[]): number[] {
        let beginIndex;
        let endIndex;

        for (beginIndex = 0; beginIndex < charCodes.length; beginIndex++) {
            if (!isWhitespace(charCodes[beginIndex])) break;
        }

        for (endIndex = charCodes.length; endIndex > beginIndex; endIndex--) {
            if (!isWhitespace(charCodes[endIndex - 1])) break;
        }

        return charCodes.slice(beginIndex, endIndex);
    }
}
