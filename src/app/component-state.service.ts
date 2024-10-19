import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ComponentStateService {

  private currentComponentSource = new BehaviorSubject<string>('dash');
    currentComponent$ = this.currentComponentSource.asObservable();

    changeComponent(component: string) {
        this.currentComponentSource.next(component);
    }
}
