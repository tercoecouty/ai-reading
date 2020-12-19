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

export function isChineseChar(charCode: number): boolean {
    return 0x4e00 <= charCode && charCode <= 0x9fff;
}

export function isChinesePunctuation(charCode: number): boolean {
    return chinesePunctuationSet.has(charCode);
}
