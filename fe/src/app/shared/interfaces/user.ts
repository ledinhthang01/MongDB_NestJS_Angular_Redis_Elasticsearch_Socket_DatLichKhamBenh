interface ISignIn {
    email: string;
    password: string;
}

interface ISignUp {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    gender: string;
}

export { ISignIn, ISignUp }