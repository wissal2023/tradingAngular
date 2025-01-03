import { Component, OnInit } from '@angular/core';
import { ComponentStateService } from 'src/app/component-state.service';
import { Policy } from 'src/app/Entity/Policy';
import { User } from 'src/app/Entity/user';
import { AuthService } from 'src/app/Services/auth.service';
import { PolicyService } from 'src/app/Services/policy.service';

@Component({
  selector: 'app-list-policies',
  templateUrl: './list-policies.component.html',
  styleUrls: ['./list-policies.component.css']
})
export class ListPoliciesComponent implements OnInit {
  search="";
  policies: Policy[] = [];
  selectedPolicy!: Policy;
  mostPurchasedPolicy: Policy = new Policy();
  bestValuePolicy!: Policy;
  isAdmin: boolean = false;
  constructor(private componentStateService: ComponentStateService,
              private policyService: PolicyService,
              private authService: AuthService) {}


  ngOnInit(): void {
    this.isAdmin = this.authService.isCurrentUserAdmin();
    this.retrievePolicies();
    this.getMostPurchased();
    this;this.getBestValue();
  }

  retrievePolicies(): void {
    this.policyService.getPolicies()
      .subscribe(
        response => {
          this.policies = response;
        });
  }
  detailsPolicy(policy: Policy) {
    this.componentStateService.selectPolicy(policy);
    this.componentStateService.changeComponent('policy-details');
  }
  deletePolicy(id: number) {
    this.policyService.deletePolicy(id).subscribe({
      next(res) {
          console.log(res);
      },
      error(err) {
          console.log(err);
      },
    });
    window.location.reload();
  }

  getMostPurchased(){
    this.policyService.getMostPurchased().subscribe({
      next: (res) => {
        this.mostPurchasedPolicy = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getBestValue() {
    this.policyService.getBestValue().subscribe({
      next: (res) => {
        this.bestValuePolicy = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
