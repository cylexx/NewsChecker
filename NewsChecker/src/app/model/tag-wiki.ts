/**
 * Class representing a wikipedia tag within the input field search.
 * It contains all the informations needed for the wikipopup component.
 */
export class TagWiki {

	public selected:boolean = false;

	constructor(public value:string,
				public display:string,
				public text:string,
				public img:string,
				public pageid:number,
				public link:string){
	}
}
