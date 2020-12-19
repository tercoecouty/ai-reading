interface Store {
    page: {
        isPageLoading: boolean;
        pageLoadingProgress: number; // 0-100
        currentPageNumber: number; // 在双页模式下以左边页面的页号为准
        totalPageNumber: number;
    };
    book: {
        // bookId, bookName
        charCodeSet: Set<number>;
        pageList: {
            beginCharId;
            endCharId;
            paragraphList: {
                paragraphId: number;
                lineList: {
                    lineId: number;
                    itemList: {
                        itemType: "box" | "glue" | "penalty";
                    }[];
                }[];
            }[];
        }[];
    };
    style: {
        // font
        chineseFont: string;
        englishFont: string;
        fontColor: string;
        fontSize: number;
        // typesetting
        isIndent: boolean;
        lineSpace: number;
        wordSpace: number;
        leftMargin: number;
        rightMargin: number;
        topMargin: number;
        bottomMargin: number;
        // other
        backgroundColor: string;
    };
    gui: {
        // state
        hasSelection: boolean;
        isFullScreen: boolean;
        // appearance
        pageMode: "single" | "double";
        selection: {
            beginCharId: number;
            endCharId: number;
        };
    };
    userInfo: IUserInfo;
    noteMap: Map<string, Map<string, INote>>; // Map<userId, Map<noteId, INote>>
    commentMap: Map<string, IComment>; // Map<commentId, IComment>
    likeMap: Map<string, ILike>; // Map<likeId, ILike>
    classList: IClass[];
}

interface IUserInfo {
    userId: string;
    userName: string;
    userAvatarUrl: string;
}

interface INote {
    noteId: string;
    userInfo: IUserInfo;
    createdTime: number;
    beginCharId: number;
    endCharId: number;
    originalText: string;
    myReviewText: string;
    commentIds: string[];
    likeIds: string[];
}

interface IComment {
    commentId: string;
    createdTime: number;
    from: IUserInfo;
    to: IUserInfo;
    commentText: string;
    commentImageUrlList: string[];
}

interface ILike {
    likeId: string;
    createdTime: number;
    userInfo: IUserInfo;
}

interface IClass {
    classId: string;
    className: string;
    teacherList: IUserInfo[];
    classmateList: IUserInfo[];
}
