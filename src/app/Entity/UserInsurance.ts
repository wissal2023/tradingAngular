import { Claim } from "./Claim";
import { Policy } from "./Policy";
import { Portfolio } from "./portfolio";
import { User } from "./user";
import { UserInsuranceStatus } from "./UserInsuranceStatus";

export class UserInsurance {

    id!: number;
    user!: User;
    policy!: Policy;
    linkedPortfolio!: Portfolio;
    claims!: Claim[];
    startDate!: Date;
    endDate!: Date;
    status!: UserInsuranceStatus;
}