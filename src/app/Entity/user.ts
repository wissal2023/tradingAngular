import { Portfolio } from './portfolio';
import { Role_User } from './role-user';

export class User {
    id!: number;
    email!: string;
    username!: string;
    password!: string;
    role!: [Role_User];
    rank!: number;
    portfolio!: Portfolio;
    //registrationDate?: string;
    //enabled?: boolean;
    //imageName?: string;
}
