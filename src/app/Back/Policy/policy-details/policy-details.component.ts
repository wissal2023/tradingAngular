import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStateService } from 'src/app/component-state.service';
import { Policy } from 'src/app/Entity/Policy';
import { AuthService } from 'src/app/Services/auth.service';
import { PolicyService } from 'src/app/Services/policy.service';

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css']
})
export class PolicyDetailsComponent implements OnInit {

  selectedPolicy!: Policy;
  policyId!: number;
  isAdmin = false;
  constructor(private componentStateService: ComponentStateService,
              private authService: AuthService,
              private policyService: PolicyService,
              private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isAdmin = this.authService.isCurrentUserAdmin();
    if (this.isAdmin) {
      this.componentStateService.selectedPolicy$.subscribe(policy => {
        this.selectedPolicy = policy;
      });
    } else if (!this.isAdmin) {
      this.activeRoute.params.subscribe(
        (params) => { 
          console.log(params);
          this.policyId = params['id'];
        }
      );
      this.policyService.getPolicy(this.policyId).subscribe({
        next: (res) => {
            console.log(res);
            this.selectedPolicy = res;
        },
        error: (err) => {
          console.log(err);
        }
      }); 
    }
  }

  updatePolicy() {
    this.componentStateService.selectPolicy(this.selectedPolicy);
    this.componentStateService.changeComponent('update-policy');
  }
  listPolicies() {
    this.componentStateService.changeComponent('list-policies');
  }

}
