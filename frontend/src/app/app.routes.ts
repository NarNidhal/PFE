import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateuserComponent } from './updateuser/updateuser.component';
import { UserslistComponent } from './userslist/userslist.component';
import { usersGuard, adminGuard,authGuard  } from './users.guard';
import { TeamManagementComponent } from './team-management/team-management.component';
import { TeamModalComponent } from './team-modal/team-modal.component';



export const routes: Routes = [
    {path: 'login', component: LoginComponent , canActivate: [authGuard] },
    {path: 'register', component: RegisterComponent, canActivate: [adminGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [usersGuard]},
    {path: 'update/:id', component: UpdateuserComponent, canActivate: [usersGuard]},
    {path: 'users', component: UserslistComponent, canActivate:[adminGuard]},
    {path: 'teams', component: TeamManagementComponent },
    {path: 'teams/:id/users', component: TeamModalComponent , canActivate: [usersGuard]},


    {path: '**', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
];
