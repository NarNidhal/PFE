import { Component, OnInit } from '@angular/core';
import { TeamService } from '../service/team.service';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamModalComponent } from '../team-modal/team-modal.component';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [FormsModule, CommonModule,TeamModalComponent],
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css'],
  providers: [TeamService],
})
export class TeamManagementComponent {

  teamName: string = '';
  userId: number | null = null;
  teamId: number | null = null;
  message: string = '';
  errorMessage: string = '';
  teams: any[] = []; // Store list of teams
  users: any[] = []; // Store list of users
  selectedTeamName: string = '';
  selectedTeamMembers: any[] = []; // Store members for the modal
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;

  constructor(private teamService: TeamService, private router: Router, private userService: UsersService){ }


  ngOnInit(): void {
    this.getAllTeams();
    this.loadUsers(); // Fetch users when component loads
    this.isAuthenticated = this.userService.isAuthenticated();
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
  }
  async loadUsers() {
    try {
      const token: any = localStorage.getItem('token');
      const response = await this.userService.getAllUsers(token);
      if (response && response.statusCode === 200 && response.ourUsersList) {
        this.users = response.ourUsersList;
      } else {
        this.showError('No users found.');
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }
  getAllTeams() {
    this.teamService.getAllTeams().subscribe(
      (response) => {
       // console.log('Teams:', response);  // Log the response to check
        this.teams = response.teamsList;  // Assign the teamsList array to the teams variable
        this.message = 'Teams retrieved successfully!';
      },
      (error) => {
        console.error('Error retrieving teams:', error);  // Log error if any
        this.message = 'Error retrieving teams';
      }
    );
  }
  // Get the count of members in a team
  getMembersCount(teamId: number): number {
    // Filter the users who belong to the team with the given teamId
    return this.users.filter(user => user.team?.id === teamId).length;
  }
  // Fetch team members when clicking on a team
  openTeamModal(team: any) {
    this.selectedTeamName = team.teamName;
    this.teamService.getUsersByTeamId(team.id).subscribe(
      (response) => {
        this.selectedTeamMembers = response.members ?? [];
      },
      (error) => {
        this.selectedTeamMembers = [];
        this.showError('Error retrieving team members.');
      }
    );
  }
  

  // Create a new team
  createTeam() {
    if (this.teamName) {
      this.teamService.createTeam(this.teamName).subscribe(
        (response) => {
          this.message = 'Team created successfully!';
          this.getAllTeams();
        },
        (error) => {
          this.message = 'Error creating team';
        }
      );
    }
  }

  // Assign a user to a team
  assignUserToTeam() {
    if (this.userId && this.teamId) {
      this.teamService.assignUserToTeam(this.userId, this.teamId).subscribe(
        (response) => {
          this.message = 'User assigned to team successfully!';
          this.loadUsers(); // Refresh users list to remove assigned users

        },
        (error) => {
          this.message = 'Error assigning user to team';
        }
      );
    }
  }

  // Unassign a user from a team
  unassignUserFromTeam() {
    if (this.userId) {
      this.teamService.unassignUserFromTeam(this.userId).subscribe(
        (response) => {
          this.message = 'User unassigned from team successfully!';
          this.loadUsers(); // Refresh users list to remove assigned users

        },
        (error) => {
          this.showError('Error unassigning user from team');
        }
      );
    }
  }

 

  // Delete a team
  deleteTeam() {
    if (this.teamId) {
      this.teamService.deleteTeam(this.teamId).subscribe(
        (response) => {
          this.message = 'Team deleted successfully!';
        },
        (error) => {
          this.message = 'Error deleting team';
        }
      );
    }
  }
// Delete a team
deleteTeam2(teamId: number) {
  if (confirm('Are you sure you want to delete this team?')) {
    this.teamService.deleteTeam(teamId).subscribe(
      (response) => {
        this.message = 'Team deleted successfully!';
        this.getAllTeams(); // Refresh the team list after deletion
      },
      (error) => {
        this.message = 'Error deleting team';
      }
    );
  }
}
  // Get team by name
  getTeamByName() {
    if (this.teamName) {
      this.teamService.getTeamByName(this.teamName).subscribe(
        (response) => {
          console.log('Team:', response);
          this.message = 'Team found!';
        },
        (error) => {
          this.message = 'Team not found';
        }
      );
    }
  }
  viewTeamUsers(teamId: number, teamName: string) {
    this.teamService.getUsersByTeamId(teamId).subscribe(
      (response) => {
        if (response.statusCode === 200 ) {
          this.selectedTeamName = teamName;
          this.selectedTeamMembers = response.ourUsersList ??[]; // Assign the users list
        } else {
          this.selectedTeamMembers = [];
        }
      },
      (error) => {
        console.error('Error fetching team users:', error);
        this.selectedTeamMembers = [];
      }
    );
  }
  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; // Clear the error message after the specified duration
    }, 3000);
  }
}
