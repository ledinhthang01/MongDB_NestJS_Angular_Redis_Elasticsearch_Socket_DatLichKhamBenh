interface MCenter {
    name: string;
    email: string;
    password: string;
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

interface MResultOfCenter {
    message: string;
    data: MCenter;
}

interface MGetAllCenters {
    message: string;
    size: number;
    page: number;
    active: string;
    searchString: string;
    total: number;
    data: Array<MCenter>
}

interface MDeleteCenter {
    message: string;
}

interface MInfoCenterByUser {
    message: string,
    data: {
        _id: string,
        name: string,
        phoneNumber: string,
        address: string,
        nationality: string,
        avatar: string,
    }
}

export {
    MCenter, MResultOfCenter, MDeleteCenter, MGetAllCenters, MInfoCenterByUser
}