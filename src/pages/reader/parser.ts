const chinesePunctuationCode = [
    // 点号
    0x3002, // 句号
    0xff0c, // 逗号
    0x3001, // 顿号
    0xff1a, // 冒号
    0xff1b, // 分号
    0xff01, // 叹号
    0xff1f, // 问号
    // 标号
    0x300c, // 左单直角引号
    0x300d, // 右单直角引号
    0x300e, // 右双直角引号
    0x300f, // 右双直角引号
    0x2018, // 左单弯角引号
    0x2019, // 右单弯角引号
    0x201c, // 左双弯角引号
    0x201d, // 左双弯角引号
    0xff08, // 左圆括号
    0xff09, // 右圆括号
    0x3010, // 左实心方括号
    0x3011, // 右实心方括号
    0x3016, // 左空心方括号
    0x3017, // 右空心方括号
    0xff3b, // 左方括号
    0xff3d, // 右方括号
    0x3014, // 左六角括号
    0x3015, // 右六角括号
    0xff5b, // 左花括号
    0xff5d, // 右花括号
    0x2e3a, // 全破折号
    0x2014, // 半破折号
    0x2026, // 半省略号
    0x2013, // 甲式连接号
    0xff5e, // 乙式连接号
    0x300a, // 左双书名号
    0x300b, // 右双书名号
    0x3008, // 左单书名号
    0x3009, // 右单书名号
];

const englishPunctuationCode = [
    0x0021, // 感叹号
    0x002c, // 逗号
    0x002d, // 连接号
    0x002e, // 点号
    0x003a, // 冒号
    0x003b, // 分号
    0x003f, // 问号
];

const chinesePunctuationSet = new Set(chinesePunctuationCode);

/**
 * 汉字：singleCharBox
 * 中文标点：shrinkableBox
 * 空格：glue
 * 单词：multiCharBox
 */
enum EItemType {
    singleCharBox, // itemType|8, charCode|16
    multiCharBox, // itemType|8, charBeginIndex|32, charEndIndex|32
    shrinkableBox, // itemType|8, charCode|16, shrink|8
    glue, // itemType|8, charCode|16, stretch|8, shrink|8
    penalty,
}

interface IDecodeItem {
    itemType: EItemType;
    charCode?: number;
    charCodeList?: number[];
    shrink?: number;
    stretch?: number;
}

export default class Parser {
    charCodeSet: Set<number> = new Set();
    charWidthMap: Map<number, number> = new Map(); // Map<charCode, charWidth>
    chineseCharWidth: number;
    pageHeight: number;
    pageWidth: number;
    charCodeArray: Uint16Array;
    paraRangeArray: Uint32Array;
    itemArray: Uint8Array;
    paraItemRangeArray: Uint32Array;

    /**
     * 测量
     * 1. 测量字符集中的字符
     * 2. 测量一个汉字的宽度
     * 3. 测量页面的宽度和高度
     */
    measureCharSet(dom_char: HTMLElement, dom_page: HTMLElement) {
        this.chineseCharWidth = this.measureCharWidth("正".charCodeAt(0), dom_char);
        for (let code of this.charCodeSet) {
            this.charWidthMap.set(code, this.measureCharWidth(code, dom_char));
        }

        const domRect = dom_page.getBoundingClientRect();

        // 页面高度和宽度还需要根据边距进行修正
        this.pageHeight = domRect.height;
        this.pageWidth = domRect.width;
    }

    measureCharWidth(charCode: number, domChar: HTMLElement): number {
        domChar.textContent = String.fromCharCode(charCode);
        return domChar.getBoundingClientRect().width;
    }

    /**
     * 预处理
     * 1. 将字符串转换为 Uint16 数组
     * 2. 拿到字符集
     * 3. 拿到 paraRangeArray
     */
    preprocess(text: string) {
        let charCodeList: number[] = [];
        let paraRangeList: Array<number> = [0];
        let paraCharCount = 0;
        let charIndex = 0;
        const textLength = text.length;

        while (true) {
            if (charIndex >= textLength) {
                if (paraCharCount !== 0) paraRangeList.push(charCodeList.length);
                break;
            }

            const charCode = text[charIndex++].charCodeAt(0);

            if (charCode === 10) {
                if (paraCharCount === 0) continue;

                paraRangeList.push(charCodeList.length);
                paraCharCount = 0;
                continue;
            }

            if (charCode <= 31 || charCode === 127) continue;

            if (!this.isChineseChar(charCode)) this.charCodeSet.add(charCode);

            charCodeList.push(charCode);
            paraCharCount++;
        }

        this.charCodeArray = Uint16Array.from(charCodeList);
        this.paraRangeArray = Uint32Array.from(paraRangeList);
    }

    /**
     * 分词
     * 汉字：singleCharBox
     * 中文标点：shrinkableBox
     * 空格：glue
     * 单词：multiCharBox
     */
    encodeItems() {
        let itemList: number[] = [];
        let paraItemRangeList: number[] = [0];
        for (let i = 1; i < this.paraRangeArray.length; i++) {
            const paraEndIndex = this.paraRangeArray[i];
            let index = this.paraRangeArray[i - 1];

            while (true) {
                if (index >= paraEndIndex) break;

                const charCode = this.charCodeArray[index];

                let encode: number[] = null;
                if (this.isChineseChar(charCode)) {
                    encode = this.encodeSingleCharBox(charCode);
                } else if (this.isChinesePunctuation(charCode)) {
                    encode = this.encodeShrinkableBox(charCode, 3);
                } else if (charCode === 32) {
                    encode = this.encodeGlue(charCode, 10, 3);
                } else {
                    const charBeginIndex = index;
                    let charEndIndex = index;
                    index++;
                    while (true) {
                        if (index >= paraEndIndex) {
                            charEndIndex = index;
                            index--;
                            break;
                        }

                        const code = this.charCodeArray[index];

                        if (this.isChinesePunctuation(code) || this.isChineseChar(code) || code === 32) {
                            charEndIndex = index;
                            index--;
                            break;
                        }

                        index++;
                    }

                    encode = this.encodeMultiCharBox(charBeginIndex, charEndIndex);
                }

                itemList.push(...encode);
                index++;
            }

            paraItemRangeList.push(itemList.length);
        }

        this.itemArray = Uint8Array.from(itemList);
        this.paraItemRangeArray = Uint32Array.from(paraItemRangeList);
    }

    decodeItems(items: Uint8Array): IDecodeItem[] {
        const length = items.length;
        let itemList: IDecodeItem[] = [];
        let index = 0;
        while (true) {
            if (index >= length) break;

            const itemType = items[index++];
            if (itemType === EItemType.singleCharBox) {
                const charCode = this.getUint(items.slice(index, index + 2));
                index += 2;
                itemList.push({ itemType, charCode });
            } else if (itemType === EItemType.multiCharBox) {
                const charBeginIndex = this.getUint(items.slice(index, index + 4));
                const charEndIndex = this.getUint(items.slice(index + 4, index + 8));
                index += 8;
                itemList.push({
                    itemType,
                    charCodeList: Array.from(this.charCodeArray.slice(charBeginIndex, charEndIndex)),
                });
            } else if (itemType === EItemType.shrinkableBox) {
                const charCode = this.getUint(items.slice(index, index + 2));
                const shrink = this.getUint(items.slice(index + 2, index + 3));
                index += 3;
                itemList.push({ itemType, charCodeList: [charCode], shrink });
            } else if (itemType === EItemType.glue) {
                const charCode = this.getUint(items.slice(index, index + 2));
                const stretch = this.getUint(items.slice(index + 2, index + 3));
                const shrink = this.getUint(items.slice(index + 3, index + 4));
                index += 4;
                itemList.push({ itemType, charCode, shrink, stretch });
            }
        }

        return itemList;
    }

    // singleCharBox, itemType|8, charCode|16
    private encodeSingleCharBox(charCode: number): number[] {
        // charCode 是整数
        return [EItemType.singleCharBox, ...this.getUint8List(charCode, 16)];
    }

    // multiCharBox, itemType|8, charBeginIndex|32, charEndIndex|32
    private encodeMultiCharBox(charBeginIndex: number, charEndIndex: number): number[] {
        return [
            EItemType.multiCharBox,
            ...this.getUint8List(charBeginIndex, 32),
            ...this.getUint8List(charEndIndex, 32),
        ];
    }

    // shrinkableBox, itemType|8, charCode|16, shrink|8
    private encodeShrinkableBox(charCode: number, shrink: number): number[] {
        return [EItemType.shrinkableBox, ...this.getUint8List(charCode, 16), shrink];
    }

    // glue, itemType|8, charCode|16, stretch|8, shrink|8
    private encodeGlue(charCode: number, stretch: number, shrink: number): number[] {
        return [EItemType.glue, ...this.getUint8List(charCode, 16), stretch, shrink];
    }

    private getUint8List(n: number, bitNumber: 16 | 32) {
        // n 是 8 的倍数
        const str = n.toString(2).padStart(bitNumber, "0");
        let unit8List = [];
        for (let i = 0; i < str.length; i += 8) {
            unit8List.push(parseInt(str.slice(i, i + 8), 2));
        }
        return unit8List;
    }

    private getUint(uint8Array: Uint8Array) {
        // uint8List 的长度是 2 或 4
        const str = Array.from(uint8Array)
            .map((uint) => uint.toString(2).padStart(8, "0"))
            .join("");
        return parseInt(str, 2);
    }

    private isChineseChar(code: number): boolean {
        return 0x4e00 <= code && code <= 0x9fff;
    }

    private isChinesePunctuation(code: number) {
        return chinesePunctuationSet.has(code);
    }
}
