import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from './users.service';
import { inject } from '@angular/core';



export const usersGuard: CanActivateFn = (route, state) => {
  if (inject(UsersService).isAuthenticated()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false
  }
};



export const adminGuard: CanActivateFn = (route, state) => {
  if (inject(UsersService).isAdmin()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false
  }
};

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(UsersService).isAuthenticated()) {
    // If the user is already authenticated, redirect to the profile page
    inject(Router).navigate(['/profile']);
    return false;
  }
  return true;  // Allow access to the login page if not authenticated
};

