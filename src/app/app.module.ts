import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './protected/pages/login/login/login.component';
import { DashboardComponent } from './protected/pages/dashboard/dashboard.component';
import { WrongActionMessageComponent } from './protected/messages/wrong-action-message/wrong-action-message/wrong-action-message.component';
import { GenericSuccessComponent } from './protected/messages/generic-success/generic-success/generic-success.component';
import { EditClientComponent } from './protected/pages/edit-client/edit-client/edit-client.component';
import { NewClientComponent } from './protected/pages/new-client/new-client/new-client.component';
import { LoginMessageComponent } from './protected/messages/login-message/login-message/login-message.component';
import { FooterComponent } from './protected/pages/footer/footer/footer.component';
import { AskDelClientComponent } from './protected/messages/ask-del-client/ask-del-client/ask-del-client.component';
import { ErrorBackendDownComponent } from './protected/messages/error-backend-down/error-backend-down/error-backend-down.component';
import { HeaderComponent } from './protected/pages/header/header/header.component';
import { GenericMessageComponent } from './protected/messages/generic-message/generic-message/generic-message.component';
import { MantainMessageComponent } from './protected/messages/maintain-message/mantain-message/mantain-message.component';
import { NoPermissionMessageComponent } from './protected/messages/no-permission-message/no-permission-message/no-permission-message.component';
import { SettingsComponent } from './protected/pages/setting/settings.component';


// services
import { InterceptorService } from './protected/services/interceptor/interceptor.service';
import { LocalStorageService } from './protected/services/localStorage/local-storage.service';


//ngrx
import { StoreModule } from '@ngrx/store';
import { appReducers } from './app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth.effect';

// pipes
import { CapitalizeFirstLetterPipe } from './protected/pipes/CapitalizeFirstLetterPipe';
import { PriceRound } from './protected/pipes/priceRound';
import { TwoDecimalPipe } from './protected/pipes/twoDecimal.pipe';

//idioma de la app
import localeEs from '@angular/common/locales/es-AR'; //nombre inventado el AR es por Argentina
import { registerLocaleData } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ViewProjectComponent } from './protected/messages/view-project/view-project/view-project.component';
import { ClientComponent } from './protected/pages/client/client/client.component';

registerLocaleData( localeEs );



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    CapitalizeFirstLetterPipe,
    WrongActionMessageComponent,
    GenericSuccessComponent,
    EditClientComponent,
    NewClientComponent,
    LoginMessageComponent,
    FooterComponent,
    AskDelClientComponent,
    PriceRound,
    TwoDecimalPipe,
    ErrorBackendDownComponent,
    HeaderComponent,
    GenericMessageComponent,
    MantainMessageComponent,
    NoPermissionMessageComponent,
    SettingsComponent,
    ViewProjectComponent,
    ClientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducers),
    environment.imports,
    EffectsModule.forRoot([AuthEffects]),

    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      }),
  
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
  
      },
      LocalStorageService,
    { provide: LOCALE_ID, useValue: 'es-AR' }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
