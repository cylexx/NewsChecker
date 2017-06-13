/**
 * Class representing the informations of a source article.
 * It contains all the information needed for the article component.
 */
export class SourceInfo {

	constructor(public id:string, public name : string,
				public link : string, public text : string,
				public img : string, public type : string,
				public score : number, public date : string) {
	}

	public openLink(){
		window.open(this.link, "_blank");
	}
}