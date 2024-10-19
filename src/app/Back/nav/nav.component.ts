import { Component } from '@angular/core';
import { User } from 'src/app/Entity/user';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  user!: User; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = 1; 
    this.getUserById(userId);
  }

  getUserById(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (data: User) => {
        this.user = data; // Assign the fetched user data to the user property
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
}
