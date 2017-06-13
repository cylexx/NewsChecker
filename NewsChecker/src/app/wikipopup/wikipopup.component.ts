import { Component, OnInit, Input} from '@angular/core';
import { TagWiki } from '../model/tag-wiki';

@Component({
  selector: 'app-wikipopup',
  templateUrl: './wikipopup.component.html',
  styleUrls: ['./wikipopup.component.css']
})
export class WikipopupComponent implements OnInit {

	@Input() private wikiInfo:TagWiki;
	@Input() private selected:boolean = false;

	constructor() {
	}

	ngOnInit() {
	}

	public setSelected(isSelected:boolean){
		this.selected = isSelected;
	}
}
