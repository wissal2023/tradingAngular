import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User } from './Entity/user';
import { Portfolio } from './Entity/portfolio';
import { Role_User } from './Entity/role-user';
import { Policy } from './Entity/Policy';

@Injectable({
  providedIn: 'root'
})
export class ComponentStateService {
  user: User = new User();
  policy: Policy = new Policy();

  private currentComponentSource = new BehaviorSubject<string>('dash');
    currentComponent$ = this.currentComponentSource.asObservable();

  private selectedUser = new BehaviorSubject<User>(this.user);
  selectedUser$ = this.selectedUser.asObservable();

  private selectedPolicy = new BehaviorSubject<Policy>(this.policy);
  selectedPolicy$ = this.selectedPolicy.asObservable();

    changeComponent(component: string) {
        this.currentComponentSource.next(component);
        
    }

    selectUser(user: User) {
      this.selectedUser.next(user);
    }
    selectPolicy(policy: Policy) {
      this.selectedPolicy.next(policy);
    }
}
