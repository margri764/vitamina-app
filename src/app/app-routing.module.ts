import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './protected/pages/dashboard/dashboard.component';
import { LoginComponent } from './protected/pages/login/login/login.component';
import { RoleGuard } from './protected/guards/role.guard';
import { SettingsComponent } from './protected/pages/setting/settings.component';
import { ClientComponent } from './protected/pages/client/client/client.component';
import { ViewEmployeeComponent } from './protected/pages/view-employee/view-employee/view-employee.component';
import { EmployeeComponent } from './protected/pages/employee/employee/employee.component';
import { ProjectComponent } from './protected/pages/project/project/project.component';
import { CreateProjectComponent } from './protected/pages/create-project/create-project/create-project.component';
import { SkillsComponent } from './protected/pages/skills/skills/skills.component';
import { ViewProjectComponent } from './protected/pages/view-project/view-project/view-project.component';
import { ConfirmProposalComponent } from './protected/pages/confirm-proposal/confirm-proposal/confirm-proposal.component';


const routes: Routes = [
  

  {
    path: 'settings',  component: SettingsComponent
  },

  {
    path: 'confirm-proposal/:code',  component: ConfirmProposalComponent
  },
  {
    path: 'review-proposal/:code',  component: ConfirmProposalComponent
  },

  {
    path: 'view-employee/:id',  component: ViewEmployeeComponent
  },

  {
    path: 'view-project/:id',  component: ViewProjectComponent
  },
  {
    path: 'client-list',  component: ClientComponent,
    // canActivate: [RoleGuard ],
    // canLoad: [ RoleGuard],
  },
  {
    path: 'employee-list',  component: EmployeeComponent
  },
  {
    path: 'projects-managment',  component: ProjectComponent
  },
  {
    path: 'skills-managment',  component: SkillsComponent
  },
  {
    path: 'create-project',  component: CreateProjectComponent
  },
  {
    path: 'login',  component: LoginComponent
  },
  {
    path: 'home',  component: DashboardComponent
  },
 
  {
    path: "", redirectTo: "login", pathMatch: 'full'
  },
  {
    path: '**',    redirectTo: 'login'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
