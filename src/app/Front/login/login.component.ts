import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/Entity/loginResponse';
import { Role_User } from 'src/app/Entity/role-user';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginform!: FormGroup;
    isAdmin = false;
    constructor(private userService: UserService, private authService: AuthService, private router: Router, private fb: FormBuilder) { }


    ngOnInit(): void {
        const formcontrols = {
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),

        };
        this.loginform = this.fb.group(formcontrols);
    }

    get email() {
        return this.loginform.get('email');
    }

    get password() {
        return this.loginform.get('password');
    }

    onSubmit() {
    this.authService.loginUser(this.email?.value, this.password?.value).subscribe({
        next: (response: LoginResponse) => {
            console.log('Login successful', response);
            // Store auth token
            this.authService.storeToken(response.token);
            // Store connected user data
            this.userService.getUserById(response.user.id).subscribe(user => {
                this.authService.storeUserData(user);
                // Check user role for redirection
                this.isAdmin = response.user.roles.some(r => r.name === Role_User.ROLE_ADMIN);
                if (this.isAdmin) {
                    this.router.navigate(['/dash']);
                } else {
                    // Redirect to the portfolio using the correct `portfolioId`
                    this.router.navigate([`/portfolio/${user.id}/${user.portfolio.id}`]);
                }
            });
        },
        error: (error) => {
            console.error('Login failed', error);
        }
    });
}

}

