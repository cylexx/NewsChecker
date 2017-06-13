import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { APIService } from './model/api.service';
import { SourceInfo } from './model/SourceInfo';
import { TagWiki } from './model/tag-wiki';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private getResults:boolean = false;
  private articles:Array<SourceInfo> = new Array<SourceInfo>();
  private debug:boolean = false;
  private globalScore:number = 0;
  private textField:string = ""; //Binded to the tag field
  public tags:Array<TagWiki> = new Array<TagWiki>();
  @ViewChild('submitsource') submitsource: ModalComponent;

  constructor(private api : APIService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  /**
   * Send the field string to the server and gets the article list
   * The response is a json treated by the treatData() method
   * The success or error is displayed in a toast.
   */
  private checkInfo(){
    this.getResults = false;
    this.articles = new Array<SourceInfo>();
    console.log("Checking for infos");
    this.showInfo("Hold on, we're asking the server :)");
    this.api.sendInfo(this.textField, this.debug).subscribe(
      res => {
        console.log("CheckInfo :"+JSON.stringify(res));
        this.treatData(res);
      },
      err => {
        this.showError("Server unreachable.");
      }
    );
  }

  /**
   * @Triggered Used by the checkInfo() method to parse the json
   * Create the list of the articles as SourceInfo object
   */
  private treatData(json){
    //If the server answers an error, display it in a toast
    if(json.error){
      console.log("TreatData error:"+json.error);
      this.showError(json.error);
    } else {
      console.log("TreatData response retrieved");
      this.getResults = true;
      for(var i=0; i<json.sources.length; i++){
        let source = json.sources[i];
        let article:SourceInfo =
            new SourceInfo(
              source.authorId,
              source.name,
              source.link,
              source.text,
              source.img,
              source.type,
              source.score,
              source.date)
        this.articles.push(article);
      }
      this.showSuccess('We found something for you!');
      this.globalScore = json.globalScore;
      document.getElementById('results').classList.add('fadeIn');
    }
  }

  /**
   * Listen to the search field for text changes
   * Ask the server if there are tags to display according to the searched string
   * @param param The current string in the search field
   */
  private textChange(param:string){
    //Cleaning tags at each character change
    this.cleanTags(param);
    let lastchar:string = param.slice(-1);
    if(lastchar == ' '){
      //Requests for wiki tags
      let words = param.split(' ');
      let oneword = words[words.length-2];
      this.requestWiki(oneword);
      if(words.length > 2){
        let secondword = words[words.length-3]+' '+oneword;
        this.requestWiki(secondword);
        if(words.length > 3){
          let thirdword = words[words.length-4]+' '+secondword;
          this.requestWiki(thirdword);
        }
      }
    }
  }

  /**
   * Ask if the string corresponds to a wikipedia page and retrieve this page's information
   * @param param The string to look for a corresponding wikipedia page
   */
  private requestWiki(param:string){
    if(param.length>=3){ //Only for words with at least 3 letters
      this.api.askForTag(param,this.debug).subscribe(
        res => {
          console.log("Wiki :"+JSON.stringify(res)); 
          this.treatWikiTag(res);
        },
        err => { console.log(err); }
      );
    }
  }

  /**
   * Remove the tags which are not in the input string anymore
   */
  private cleanTags(param:string){
    for(let tag of this.tags){
      //If the tag's value is not in the text input anymore
      if(!param.includes(tag.value)){
        this.tags.splice(this.tags.indexOf(tag), 1);
      }
    }
  }

  /**
   * @Triggered used by the textChange() method
   * Add the returned string as a tag to display a small wikipedia popup
   */
  private treatWikiTag(json){
    let tag:string = json.name;
    let txt:string = json.text;
    let img:string = json.image;
    let pageid:number = json.pageid;
    let link:string = "";
    //Ask for the wiki article link
    this.api.askForWikiURL(pageid).subscribe(
      res => {
        link = res.URL;
      },
      err => {
        link = undefined;
      },
      //After retrieving the link (or not), add the tag
      //Can't do this elsewhere because it's asynchronous
      () => {
        if(tag!=''){
          let regEx = /<p>(.*)<\/p>/g;
          let match = regEx.exec(txt);
          txt = match[1];
          let newTag = new TagWiki(tag,tag,txt,img,pageid,link);
          if(!this.containsTag(newTag)){
            this.tags.push(newTag);
          }
        }
      }
    )
  }

  /**
   * Checks if a tag is already added in the list
   */
  private containsTag(tag:TagWiki) : boolean{
    let ret:boolean = false;
    for(let i=0;i<this.tags.length;i++){
      if(this.tags[i].value == tag.value){
        ret = true;
      }
    }
    return ret;
  }

  /**
   * Submit to the server a new twitter account as a source.
   */
  private submitSource(){
    let twitterAccountName:string = (<HTMLInputElement>document.getElementById('twitter_account')).value;
    let reliable:boolean = (<HTMLInputElement>document.getElementById('reliableCheckBox')).checked;
    let twitterId:string = (<HTMLInputElement>document.getElementById('twitter_id')).value;
    this.api.addSource(twitterId, twitterAccountName,reliable).subscribe(
      res => { console.log(res); },
      err => { this.showError("Server unreachable."); }
      );
    this.submitsource.close();
  }

  /**
   * Set a wikiPopup component to selected (display in blue)
   * @Triggered by onSelect event on tags
   */
  private wikiPopup(event:TagWiki){
    for(let tag of this.tags){
      if(tag == event){
        tag.selected = true;
      } else {
        tag.selected = false;
      }
    }
  }

  /**
   * Clear all the wikiPopup component selections (because no more tags are selected)
   * @Triggered by onFocus event on input field
   */
  private clearWikiPopupSelections(event:string){
    for(let tag of this.tags){
      tag.selected = false;
    }
  }

  /**
   * Listen to the 'Enter' key.
   * Start the request to the server with the searched string
   */
  private onKey(event:KeyboardEvent){
    if(event.key === "Enter"){
      this.checkInfo();
    }
  }

  private getScore(){
    return this.globalScore;
  }

  /* TOASTS METHODS */

  public showSuccess(success:string) {
    this.toastr.success(success, 'Success!');
  }

  public showError(error:string) {
    this.toastr.error(error, 'Sorry :(');
  }

  // public showWarning() {
  //   this.toastr.warning('You are being warned.', 'Alert!');
  // }

  public showInfo(info:string) {
    this.toastr.info(info);
  }

}
