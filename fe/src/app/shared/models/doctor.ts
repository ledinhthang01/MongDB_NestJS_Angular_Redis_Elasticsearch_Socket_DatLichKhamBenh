interface MDoctor {
    name: string;
    email: string;
    password: string;
    gender: string;
    degree: string;
    academic: string
    specialties: string
    dateOfBirth: Date;
    graduationDate: Date;
    phoneNumber: string;
    address: string;
    nationality: string;
    joiningDate: Date;
    university: string;
    active: string;
    describe: string;
    avatar: string;
    roleId: string;
    url: string;
    _id: string;
}

interface MDoctorByUser {
    _id: string,
    name: string,
    degree: string,
    academic: string,
    specialties: string,
    graduationDate: Date,
    phoneNumber: string,
    address: string,
    nationality: string,
    university: string,
    describe: string,
    avatar: string,
    centerId: string,
}

interface MResultOfDoctorByUser {
    message: string;
    data: MDoctorByUser;
}

interface MResultOfDoctor {
    message: string;
    data: MDoctor;
}

interface MGetAllDoctors {
    message: string;
    size: number;
    page: number;
    active: string;
    searchString: string;
    total: number;
    data: Array<MDoctor>
}

interface MDeleteDoctor {
    message: string;
}

export {
    MDoctor, MDeleteDoctor, MGetAllDoctors, MResultOfDoctor, MDoctorByUser, MResultOfDoctorByUser
}