import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-scorespinner',
	templateUrl: './scorespinner.component.html',
	styleUrls: ['./scorespinner.component.css']
})
export class ScorespinnerComponent implements OnInit {

	@Input() public score:number;
	@Input() public radius:number;
	private scoreStr:string;
	private font:string = "35px";
	private color:string = "#006054"; //Grey by default

	constructor() { }

	ngOnInit() {
		this.score = Math.round(this.score);
		console.log("Score in spinner:"+this.score);
		(this.score>0 && this.score <= 100) ? this.scoreStr = this.score+"%" : this.scoreStr = "?";
		this.color = this.computeGradientColor(this.score);
		this.font = (this.radius * 0.7)+"px";
	}

	/**
	 * Calculate the gradient color from the score
	 * The score must be between 0 and 100!
	 */
	private computeGradientColor(score:number):string{
		var hue=((score/100)*120).toString(10);
		let gradient:string = "hsl("+hue+",100%,50%)";
		return gradient;
	}
}