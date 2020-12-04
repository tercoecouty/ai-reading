interface UserInfo {
    name: string;
    gender: string;
    age: number;
    role: string;
    phone: string;
    email: string;
    avatar: string;
}

const getUserInfo = async (): Promise<UserInfo> => {
    return {
        name: "Ann",
        gender: "male",
        age: 24,
        role: "student",
        phone: "188***2041",
        email: "fany12wen@gmail.com",
        avatar: null,
    };
};

const apiUser = {
    getUserInfo,
};

export default apiUser;
