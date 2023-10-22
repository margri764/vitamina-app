import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './protected/pages/dashboard/dashboard.component';
import { LoginComponent } from './protected/pages/login/login/login.component';
import { RoleGuard } from './protected/guards/role.guard';
import { SettingsComponent } from './protected/pages/setting/settings.component';
import { ClientComponent } from './protected/pages/client/client/client.component';
import { ViewEmployeeComponent } from './protected/pages/view-employee/view-employee/view-employee.component';


const routes: Routes = [
  


  
  {
    path: 'settings',  component: SettingsComponent
  },

  {
    path: 'view-employee/:id',  component: ViewEmployeeComponent
  },
  {
    path: 'client-list',  component: ClientComponent,
    // canActivate: [RoleGuard ],
    // canLoad: [ RoleGuard],
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
