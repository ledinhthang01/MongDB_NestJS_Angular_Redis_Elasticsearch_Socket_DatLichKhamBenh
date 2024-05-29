interface MEmployee {
    name: string;
    email: string;
    password: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    address: string;
    nationality: string;
    joiningDate: Date;
    active: string;
    avatar: string;
    roleId: string;
    url: string;
    _id: string;
}

interface MResultOfEmployee {
    message: string;
    data: MEmployee;
}

interface MGetAllEmployees {
    message: string;
    size: number;
    page: number;
    gender: string;
    active: string;
    searchString: string;
    total: number;
    data: Array<MEmployee>
}

interface MDeleteEmployee {
    message: string;
}

export { MResultOfEmployee, MGetAllEmployees, MEmployee, MDeleteEmployee }