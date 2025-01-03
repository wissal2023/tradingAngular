import { ClaimStatus } from "./ClaimStatus";
import { UserInsurance } from "./UserInsurance";

export class Claim {
    id!: number;
    userInsurance!: UserInsurance;
    claimDate!: Date;
    reason!: String;
    amountClaimed!: number;
    status!: ClaimStatus;
}