export interface IUserInfo {
    userId: string;
    userName: string;
    userRole: string;
    userAvatarUrl: string;
}

export interface IBook {
    bookId: string;
    bookName: string;
    bookCoverUrl: string;
}

export async function getUserInfo(): Promise<IUserInfo> {
    const userInfo: IUserInfo = {
        userId: "1001",
        userName: "张平",
        userRole: "student",
        userAvatarUrl: "assets/avatar.jpg",
    };

    return userInfo;
}

export async function login(account: string, password: string): Promise<boolean> {
    if (account === "20180001" && password === "123456") {
        return true;
    }

    return false;
}

export async function logout() {
    return true;
}

export async function getBooks(): Promise<IBook[]> {
    const bookItem: IBook = {
        bookId: "1001",
        bookName: "西游记",
        bookCoverUrl: "assets/book-cover-01.jpg",
    };

    let bookList: IBook[] = [];
    for (let i = 0; i < 7; i++) bookList.push({ ...bookItem });

    return bookList;
}
