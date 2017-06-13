# NewsChecker, client app

Here is the client side of the app, built in Angular 4.

## Tools

The app currently uses:
* Bootstrap v3+
* [ng2-tag-input](https://github.com/Gbuomprisco/ng2-tag-input/) (Angular module) v1.2.8
* [Angular Material](https://material.angular.io/)
* [angular-svg-round-progressbar](https://github.com/crisbeto/angular-svg-round-progressbar) (Angular module)
* [ng2-toastr](https://github.com/PointInside/ng2-toastr) (Angular module)

## Installation

First, in this folder, run
````sh
$ yarn
```
or
```sh
$ npm install
```

To start both the server and the client, uses this script
```sh
$ ../start.sh
```

To manually run the angular app, run
```sh
$ npm start
```

## Technical choices

This client is used as the user interface of NewsChecker.

It's a full single page app present at http://35.187.40.95:80/.

The starting point of the app is the app.component.* files. It defines the global html of the page, using different components present in the subfolders.

All the server requests are defined in the api.service.ts file. Feel free to code additional requests over here.

```javascript
public `request(params:any){
		let url:string = this.serverURL+'path?param='+params;
		/* STUFF HERE IF NEEDED */
		return this.http.get(url)
				.map(this.extractJson)
				.catch(this.handleError);
	}
```

You can catch the response by using
````javascript
this.api.request(params).subscribe{
	res => {
		this.showSuccess("Success"); //Don't forget to use the toasts to indicate the user how went the request
	},
	err => {
		console.log(err)
		this.showError(err); //If you want
	}
}
```

## What's planned

See our public [Trello](http://trello.com/b/0x5pukld/news-checker) to see what is left to do :)
Feel free to edit it and suggest ideas.