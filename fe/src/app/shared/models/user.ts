interface MUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: string
    dateOfBirth: Date;
    address: string;
    gender: string;
}

interface MSignIn {
    message: string;
    data: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
        url: string;
        refreshToken: string;
        accessToken: string;
    }
}

interface MSignUp {
    message: string;
    data: MUser;
}

interface MgetRefreshToken {
    message: string;
    data: {
        newRefreshToken: string,
        newAccessToken: string,
    }
}

interface MUser {
    message: string,
    data: {
        _id: string,
        name: string,
        email: string,
        gender: string,
        dateOfBirth: Date,
        phoneNumber: string,
        address: string,
        avatar: string,
        roleId: string,
    }
}

export { MSignIn, MSignUp, MgetRefreshToken, MUser }