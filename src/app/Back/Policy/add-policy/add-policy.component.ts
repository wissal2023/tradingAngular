import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStateService } from 'src/app/component-state.service';
import { Policy } from 'src/app/Entity/Policy';
import { PolicyService } from 'src/app/Services/policy.service';

@Component({
  selector: 'app-add-policy',
  templateUrl: './add-policy.component.html',
  styleUrls: ['./add-policy.component.css']
})
export class AddPolicyComponent {
  addForm!: FormGroup;
  newPolicy!: Policy;
  constructor(private policyService: PolicyService, private componentStateService: ComponentStateService) { }

  ngOnInit(): void {

    this.addForm = new FormGroup({
      'policyData': new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'description': new FormControl(null, [Validators.required]),
        'premium': new FormControl(null, [Validators.required]),
        'coverageDetails': new FormControl(null, [Validators.required]),
        'maxCoverageAmount': new FormControl(null, [Validators.required]),
        'conditions': new FormControl(null, [Validators.required]),
        'durationInDays': new FormControl(null, [Validators.required])
      }),
    });
  }

  onSubmit() {
    this.newPolicy = this.addForm.get('policyData')?.value;
    this.policyService.addPolicy(this.newPolicy).subscribe({
      next : (res) => {
          console.log(res);
          this.componentStateService.changeComponent('list-policies');
      },
      error: (err) => {
        console.log(err);
        }
      });
    }
  }