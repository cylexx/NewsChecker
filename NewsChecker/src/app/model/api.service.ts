import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SourceInfo } from './SourceInfo';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {
	private serverURL = 'http://35.187.40.95:8080/'

	constructor(private http: Http){}

	/**
	 * Send the searched string to the server
	 */
	public sendInfo(str : string, debug: boolean){
		let url = this.serverURL+"sendString?str="+encodeURI(str);
		if(debug){
			url = "../assets/debugJson.json";
		}
		console.log("Reaching "+url);
		return this.http.get(url)
				.map(this.extractJson)
				.catch(this.handleError);
	}


	/**
	 * Send the temp searched string to see if there is a word to put in a tag
	 */
	public askForTag(query:string, debug: boolean){
		let url:string ="";
		if(!debug){
			url = this.serverURL+'SearchWiki?str='+encodeURI(query);
		} else {
			//Debug : only check if last word = 'Test'
			if(query == 'Test'){
				url = "../assets/debugWikiJson.json";
			}
			else{ //Testing the empty response when find nothing
				url = "../assets/emptyJson.json";
			}
		}
		console.log("WIKI REQUEST:"+url);
		return this.http.get(url)
				.map(this.extractJson)
				.catch(this.handleError);
	}

	/**
	 * Send the temp searched string to see if there is a word to put in a tag
	 */
	public askForWikiURL(pageid:number){
		let url:string = this.serverURL+'wikiURL?id='+pageid;
		console.log("WIKI URL REQUEST:"+url);
		return this.http.get(url)
				.map(this.extractJson)
				.catch(this.handleError);
	}


	/**
	 * Send a feedback vote on the clicked article
	 * @param vote : -1 for negative, +1 for positive
	 */
	public feedback(article:SourceInfo, vote:number){
		console.log("Voting "+((vote==1)? "good" : "bad")+"for the article "+article.name);
		
		let url:string = this.serverURL+"feedback";
		url += "?source="+article.id+"&opinion="+vote;
		return this.http.get(url)
				.map(this.extractJson)
				.catch(this.handleError);
	}

	public addSource(sourceId:string, sourceName:string, reliable:boolean){
		console.log("Adding "+sourceName+" account as "+((reliable) ? "reliable." : "not reliable.")) ;

		let url:string = this.serverURL+"addAccount?id="+sourceId+"&name="+sourceName+"&reliable="+reliable;
		return this.http.get(url)
				.map(this.extractJson)
				.catch(this.handleError);
	}

	private extractJson(res: Response) {
		console.log("Response retrieved:"+res+"\n");
    	let response  = res.json();
    	return response;
	}

  	private handleError (error: Response | any) {
  		console.log("ERROR WHEN REQUESTING:\n");
	    let errMsg: string;
	    if (error instanceof Response) {
	      const body = error.json() || '';
	      const err = body.error || JSON.stringify(body);
	      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	    } else {
	      errMsg = error.message ? error.message : error.toString();
	    }
	    console.error(errMsg);
	    return Observable.throw(errMsg);
	}
}
