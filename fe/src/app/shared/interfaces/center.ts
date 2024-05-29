interface ICreateNewCenter {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    nationality: string;
    joiningDate: Date;
    active: string;
}

interface IGetAllCenters {
    page: number;
    size: number;
    active: string;
    searchString: string;
}

interface IEditInforCenter {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    nationality: string;
    joiningDate: Date;
    active: string;
}

export {
    ICreateNewCenter, IGetAllCenters, IEditInforCenter
}