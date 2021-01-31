import { Book as IBook } from "./book";
import { isChineseChar, isChinesePunctuation, isWhitespace } from "./char";

// 在进行断行的时候，需要将一个段落的字符切分成符合页面宽度的
// 多行字符，需要将段落转换成item数组，一个item有三个类型
// 以及相对应的属性，具体参考下面这篇论文：
// Breaking Paragraphs into Lines. DONALD E. KNUTH, SOFTWARE-PRACTICE AND EXPERIENCE, VOL. 11, 1119-1184 (1981)
interface IItem {
    type: "box" | "glue" | "penalty";
    charCodes?: number[];
    charBeginId?: number;
    width?: number;
    shrink?: number;
    stretch?: number;
    penalty?: number;
}

interface ILine {
    lineId: number;
    items: IItem[];
}

interface IPage {
    pageId: number;
    paras: ILine[];
}

export class Layout {
    // 页面边距
    private marginTop: number = 0;
    private marginBottom: number = 0;
    private marginLeft: number = 0;
    private marginRight: number = 0;

    private lineSpace: number = 0; // 行与行之间的间距，没有段间距
    private isIndent: boolean = false; // 如果缩进，那么缩进两个字符

    private pageWidth: number = 0; // 减去了页面边距之后的宽度
    private pageHeight: number = 0; // 减去了页面边距之后的高度
    private charHeight: number = 0; // 所有字符的高度都是相同的
    private chineseCharWidth: number = 0;
    private charCodeWidthMap: Map<number, number> = new Map();

    private domChar: HTMLElement; // 测量字符集的容器
    private domPage: HTMLElement;

    private book: IBook;
    private pages: IPage[] = []; // 分页之后的结果

    constructor(domChar: HTMLElement, domPage: HTMLElement, book: IBook) {
        this.domChar = domChar;
        this.domPage = domPage;
        this.book = book;
    }

    init() {
        this.refresh();
    }

    /**
     * 重新排版
     * 1. 测量字符的宽度和高度
     * 2. 测量页面的宽度和高度
     * 3. 对整本书进行分页
     */
    refresh() {
        this.measureChars();
        this.measurePage();
        this.pageBreaking();
    }

    setMargin(top: number, bottom: number, left: number, right: number) {
        this.marginTop = top;
        this.marginBottom = bottom;
        this.marginLeft = left;
        this.marginRight = right;
    }

    setLineSpace(lineSpace: number) {
        this.lineSpace = lineSpace;
    }

    setIndent(isIndent: boolean) {
        this.isIndent = isIndent;
    }

    /**
     * 将一个段落的字符转换为进行排版计算的item对象
     * 大致分为四类：汉字，汉字标点，空格和连续的一段字符
     */
    private convertParaToItems(paraCharCodeArray: Uint16Array, charBeginId: number): IItem[] {
        let items: IItem[] = [];
        let index = 0;
        let charId = charBeginId;
        while (true) {
            if (index >= paraCharCodeArray.length) break;

            let charCode = paraCharCodeArray[index];
            let item: IItem = null;
            if (isChineseChar(charCode)) {
                item = {
                    type: "box",
                    charCodes: [charCode],
                    charBeginId: charId,
                    width: this.chineseCharWidth,
                };
            } else if (isChinesePunctuation(charCode)) {
                item = {
                    type: "box",
                    charCodes: [charCode],
                    charBeginId: charId,
                    width: this.chineseCharWidth,
                    shrink: 0.5,
                };
            } else if (charCode === 32) {
                // 空格
                item = {
                    type: "glue",
                    charCodes: [charCode],
                    charBeginId: charId,
                    shrink: 0.1,
                    stretch: 0.3,
                };
            } else {
                const charBeginId = charId;
                let charCodes: number[] = [charCode];

                let width = this.charCodeWidthMap.get(charCode);
                index++;
                charId++;

                // 连续向前扫描直到遇到汉字或者中文标点或者空格
                while (true) {
                    if (index >= paraCharCodeArray.length) break;

                    charCode = paraCharCodeArray[index];

                    if (isChineseChar(charCode) || isChinesePunctuation(charCode) || isWhitespace(charCode)) {
                        index--;
                        charId--;
                        break;
                    }

                    charCodes.push(charCode);
                    width += this.charCodeWidthMap.get(charCode);

                    index++;
                    charId++;
                }

                item = {
                    type: "box",
                    charCodes,
                    charBeginId,
                    width,
                };
            }

            items.push(item);

            index++;
            charId++;
        }

        return items;
    }

    /**
     * 将一段文字进行断行。
     * 接受item对象数组，表示一个段落的字符，根据宽度将该数组切分成多个数组
     * 每个数组表示符合页面宽度的一行字符
     */
    private breakItemsToLines(items: IItem[]): ILine[] {
        // todo
        return [];
    }

    /**
     * 对整本书进行断行
     */
    private *lineBreaking() {
        // todo
        for (let paraData of this.book.getParas()) {
            const { paraCharCodeArray, charBeginId } = paraData;
            const items = this.convertParaToItems(paraCharCodeArray, charBeginId);
            const lines = this.breakItemsToLines(items);
            yield* lines;
        }
    }

    /**
     * 对整本书进行分页
     */
    private pageBreaking() {
        for (let line of this.lineBreaking()) {
            // todo
        }
    }

    /**
     * 1. 测量一个标准汉字，其宽度作为所有汉字的宽度
     * 2. 侧脸字符集中的字符
     */
    private measureChars() {
        const { width, height } = this.measureChar("正".charCodeAt(0));
        this.chineseCharWidth = width;
        this.charHeight = height;

        const charCodeSet = this.book.getCharCodeSet();
        for (let charCode of charCodeSet) {
            this.charCodeWidthMap.set(charCode, this.measureChar(charCode).width);
        }
    }

    /**
     * 测量一个字符
     */
    private measureChar(charCode: number) {
        this.domChar.textContent = String.fromCharCode(charCode);
        const { width, height } = this.domChar.getBoundingClientRect();
        return { width, height };
    }

    /**
     * 测量页面的宽度和高度，减去页面缩进
     */
    private measurePage() {
        const domRect = this.domPage.getBoundingClientRect();
        this.pageHeight = domRect.height - this.marginTop - this.marginBottom;
        this.pageWidth = domRect.width - this.marginLeft - this.marginRight;
    }
}
