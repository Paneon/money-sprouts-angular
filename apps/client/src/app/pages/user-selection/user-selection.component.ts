import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user.service';
import { Observable, first } from 'rxjs';

@Component({
    selector: 'money-sprouts-user-selection',
    templateUrl: './user-selection.component.html',
    styleUrls: ['./user-selection.component.scss'],
})
export class UserSelectionComponent implements OnInit {
    users$: Observable<User[]>;

    constructor(
        private router: Router,
        public readonly route: ActivatedRoute,
        private settings: UserService
    ) {}

    ngOnInit(): void {
        this.users$ = this.settings.getUsers();
    }

    proceed(username: string) {
        if (!username) {
            return;
        }
        this.settings
            .fetchUser(username)
            .pipe(first())
            .subscribe(() => {
                this.router.navigate([`user/${username}/dashboard`]);
            });
    }
}
