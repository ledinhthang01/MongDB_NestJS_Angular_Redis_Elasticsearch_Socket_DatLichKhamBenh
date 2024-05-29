interface ICreateNewDoctor {
    centerId: string;
    name: string;
    email: string;
    dateOfBirth: Date;
    graduationDate: Date;
    phoneNumber: string;
    address: string;
    nationality: string;
    joiningDate: Date;
    university: string;
    gender: string;
    degree: string;
    academic: string,
    specialties: string;
    describe: string;
    active: string;
}

interface IGetAllDoctors {
    page: number;
    size: number;
    active: string;
    searchString: string;
}

interface IEditInforDoctor {
    id: string;
    name: string;
    email: string;
    dateOfBirth: Date;
    graduationDate: Date;
    phoneNumber: string;
    address: string;
    nationality: string;
    joiningDate: Date;
    university: string;
    gender: string;
    degree: string;
    academic: string,
    specialties: string;
    describe: string;
    active: string;
}

export {
    ICreateNewDoctor, IGetAllDoctors, IEditInforDoctor
}