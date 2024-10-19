import { Component } from '@angular/core';
import { ComponentStateService } from 'src/app/component-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  activeComponent: string = 'dash';

  constructor(private componentStateService: ComponentStateService) {
    this.componentStateService.currentComponent$.subscribe(component => {
        this.activeComponent = component;
    });
}

setComponent(component: string) {
    this.componentStateService.changeComponent(component);
}
}
