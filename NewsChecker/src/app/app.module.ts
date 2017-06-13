import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { APIService } from './model/api.service';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { AppComponent } from './app.component';
import { ScorespinnerComponent } from './scorespinner/scorespinner.component';
import { MdCardModule } from '@angular/material';
import { ArticleComponent } from './article/article.component';
import { TagInputModule } from 'ng2-tag-input';
import { WikipopupComponent } from './wikipopup/wikipopup.component';
import { SortPipe } from './model/sort.pipe';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { MdButtonModule } from '@angular/material';
import { MdTooltipModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    ScorespinnerComponent,
    ArticleComponent,
    WikipopupComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    RoundProgressModule,
    TagInputModule,
    Ng2Bs3ModalModule,
    ToastModule.forRoot(),
    MdCardModule,
    MdButtonModule,
    MdTooltipModule
  ],
  providers: [APIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
