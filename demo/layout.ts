import { Book } from "./book";
import { isChineseChar, isChinesePunctuation } from "./char";

interface IItem {
    type: "box" | "glue" | "penalty";
    content?: {
        charId: number;
        charCode: number;
    }[];
    width?: number;
    shrink?: number;
    stretch?: number;
    penalty?: number;
}

interface ILine {
    lineId: number;
    itemList: IItem[];
}

interface IPara {
    paraId: number;
    lineList: ILine[];
}

interface IPage {
    pageId: number;
    paraList: IPara[];
}

export class Layout {
    private marginTop: number = 0;
    private marginBottom: number = 0;
    private marginLeft: number = 0;
    private marginRight: number = 0;
    private lineSpace: number = 0;

    private pageWidth: number = 0;
    private pageHeight: number = 0;
    private chineseCharWidth: number = 0;
    private charHeight: number = 0;
    private charCodeWidthMap: Map<number, number> = new Map();

    private domChar: HTMLElement;
    private domPage: HTMLElement;
    private charCodeSet: Set<number>;
    private pageList: IPage[] = [];

    constructor(domChar: HTMLElement, domPage: HTMLElement, book: Book) {
        this.domChar = domChar;
        this.domPage = domPage;
        this.charCodeSet = book.getCharCodeSet();
    }

    init() {
        this.refresh();

        return this;
    }

    refresh() {
        this.measure();
        // this.lineBreaking();
        // this.pageBreaking();

        return this;
    }

    setMargin(marginTop: number, marginBottom: number, marginLeft: number, marginRight: number) {
        this.marginTop = marginTop;
        this.marginBottom = marginBottom;
        this.marginLeft = marginLeft;
        this.marginRight = marginRight;
    }

    setLineSpace(lineSpace: number) {
        this.lineSpace = lineSpace;
    }

    getItemList(paraCharCodeArray: Uint16Array, charBeginId: number): IItem[] {
        let itemList: IItem[] = [];
        let index = 0;
        let charId = charBeginId;
        while (true) {
            if (index >= paraCharCodeArray.length) break;

            let charCode = paraCharCodeArray[index];
            if (isChineseChar(charCode)) {
                itemList.push({
                    type: "box",
                    content: [{ charCode, charId }],
                    width: this.chineseCharWidth,
                });
            } else if (isChinesePunctuation(charCode)) {
                itemList.push({
                    type: "box",
                    content: [{ charCode, charId }],
                    width: this.chineseCharWidth,
                    shrink: 0.5,
                });
            } else if (charCode === 32) {
                itemList.push({
                    type: "glue",
                    content: [{ charCode, charId }],
                    shrink: 1 / 9,
                    stretch: 1 / 3,
                });
            } else {
                let content = [{ charCode, charId }];
                let width = this.charCodeWidthMap.get(charCode);
                index++;
                charId++;

                while (true) {
                    if (index >= paraCharCodeArray.length) break;

                    charCode = paraCharCodeArray[index];

                    if (isChineseChar(charCode) || isChinesePunctuation(charCode) || charCode === 32) {
                        charId--;
                        index--;
                        break;
                    }

                    content.push({ charCode, charId });
                    width += this.charCodeWidthMap.get(charCode);

                    index++;
                    charId++;
                }

                itemList.push({
                    type: "box",
                    content,
                    width,
                });
            }

            index++;
            charId++;
        }

        return itemList;
    }

    private lineBreaking(itemList: IItem[]) {
        // todo
    }

    private pageBreaking(lineList: ILine[]) {
        // todo
    }

    private measure() {
        // 测量一个汉字的宽度和高度
        // 其宽度作为所有汉字的宽度
        // 其高度作为所有字符的高度
        const { width, height } = this.measureChar("正".charCodeAt(0));
        this.chineseCharWidth = width;
        this.charHeight = height;

        // 测量字符集
        for (let charCode of this.charCodeSet) {
            this.charCodeWidthMap.set(charCode, this.measureChar(charCode).width);
        }

        // 测量排版宽度和高度
        const domRect = this.domPage.getBoundingClientRect();
        this.pageHeight = domRect.height - this.marginTop - this.marginBottom;
        this.pageWidth = domRect.width - this.marginLeft - this.marginRight;
    }

    private measureChar(charCode: number) {
        this.domChar.textContent = String.fromCharCode(charCode);
        const { width, height } = this.domChar.getBoundingClientRect();
        return { width, height };
    }
}
