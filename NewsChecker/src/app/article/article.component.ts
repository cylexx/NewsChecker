import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../model/api.service';
import { SourceInfo } from '../model/SourceInfo';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

	@Input() public article:SourceInfo;

	private voted:number = 0;
	private selected:boolean = false;
	private openable:boolean = true;

	private upEnabled:boolean = true;
	private downEnabled:boolean = true;

	constructor(private api : APIService){ }

	ngOnInit(){
	}

	/**
	 * @Triggered when cursor is over the component
	 */
	private articleOver(){
		this.selected = true;
	}
	/**
	 * @Triggered when cursor leaves the component
	 */
	private articleLeave(){
		this.selected = false;
	}

	/**
	 * Disable the article's link when the mouse is over the voting div
	 * @Triggered when cursor is over the voting div
	 */
	private thumbOver(){
		this.openable = false
	}
	/**
	 * Enable the article's link when the mouse leaves the voting div
	 * @Triggered when cursor leaves the voting div
	 */
	private thumbLeave(){
		this.openable = true;
	}

	/**
	 * @Triggered when thumb up clicked
	 */
	private voteup(){
		//If the previous vote wasn't +1 already
		if(this.voted != 1){
			this.vote(1);
			this.upEnabled = false;
			this.downEnabled = true;
		}
	}

	/**
	 * @Triggered when thumb down clicked
	 */
	private votedown(){
		//If the previous vote wasn't -1 already
		if(this.voted != -1){
			this.vote(-1);
			this.downEnabled = false;
			this.upEnabled = true;
		}
	}

	private vote(value:number){
		this.voted = value;
		this.api.feedback(this.article,this.voted).subscribe(
			res => {},
			err => {console.log(err)}
		);
	}

	private openLink(){
		if(this.openable == true){
			this.article.openLink();
		}
	}
}