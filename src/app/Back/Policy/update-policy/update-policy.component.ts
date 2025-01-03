import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentStateService } from 'src/app/component-state.service';
import { Policy } from 'src/app/Entity/Policy';
import { PolicyService } from 'src/app/Services/policy.service';

@Component({
  selector: 'app-update-policy',
  templateUrl: './update-policy.component.html',
  styleUrls: ['./update-policy.component.css']
})
export class UpdatePolicyComponent implements OnInit {
  updateForm!: FormGroup;
  selectedPolicy!: Policy;
  errorMessage= '';
  errorOccured = false;
  constructor(private componentStateService: ComponentStateService, private policyService: PolicyService) { }

  ngOnInit(): void {
    this.componentStateService.selectedPolicy$.subscribe(policy => {
      this.selectedPolicy = policy;
    });

    this.updateForm = new FormGroup({
      'policyData': new FormGroup({
        'id': new FormControl(this.selectedPolicy.id),
        'name': new FormControl(this.selectedPolicy.name, [Validators.required]),
        'description': new FormControl(this.selectedPolicy.description, [Validators.required]),
        'premium': new FormControl(this.selectedPolicy.premium, [Validators.required]),
        'coverageDetails': new FormControl(this.selectedPolicy.coverageDetails, [Validators.required]),
        'maxCoverageAmount': new FormControl(this.selectedPolicy.maxCoverageAmount, [Validators.required]),
        'conditions': new FormControl(this.selectedPolicy.conditions, [Validators.required]),
        'durationInDays': new FormControl(this.selectedPolicy.durationInDays, [Validators.required])
      }),
    });
  }

  onSubmit() {
    this.selectedPolicy = this.updateForm.get('policyData')?.value;
    this.policyService.updatePolicy(this.selectedPolicy.id, this.selectedPolicy).subscribe({
      next : (res) => {
          console.log(res);
      },
      error: (err) => {
        console.log(err);
        if(err.status === 400) {
          this.errorOccured = true;
          this.errorMessage = err.error;
        }
      },
      complete: () => {
        this.componentStateService.selectPolicy(this.selectedPolicy);
        this.componentStateService.changeComponent('policy-details');
      }
    });
  }

  detailPolicy() {
    this.componentStateService.changeComponent('policy-details');
  }

}
