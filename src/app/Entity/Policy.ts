import { UserInsurance } from "./UserInsurance";

export class Policy {
    id!: number;
    name!: String;
    description!: String;
    premium!: String;
    coverageDetails!: String;
    maxCoverageAmount!: number;
    conditions!: String;
    durationInDays!: number;
    userInsurances!: UserInsurance[];
}