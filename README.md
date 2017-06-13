![NewsChecker](https://bytebucket.org/YoannBoyere/projet_si/raw/7483710a3c3d21ee7a5f123d706f74f9074f85cf/NewsCheckerLogo.png?token=29a7de25639a536f79e949471bf4592218a979ad)


## Introduction

Welcome to our project, created by Yoann Boyere, Alexis Brault, Florent Catiau-Tristant and Quentin Olivier. We are engineering student in computer science at l'ESIR. 

The aim of this project is to check news just by giving a small phrase to our engine like "Donald Trump has resigned yesterday" and we'll calculate a mark. The mark depends of sources used (reliable or not). If the mark exceeds 50%, it means that the sentence typed is probably true.

## Demo

A demo is available [here](http://35.187.40.95/) without guarantees (development server).

## Installation

News Checker requires:

* [Yarn](https://yarnpkg.com/en/docs/install#linux-tab) v0.23+ or at least npm v4.0+
* [Node.js](https://nodejs.org/) v7.10.0+
* [MongoDB](https://www.mongodb.com/) v3.2.13+
* Java v1.8+
* [Gradle](https://gradle.org/) v3.5+

First, install the dependencies in both server/ and NewsChecker/ folders:

```sh
$ sudo yarn
```
or
```sh
$ sudo npm install
```


Then, run both the server and the client app by running:
```sh
$ sudo sh start.sh
```

## Architecture

![Architecture](http://puu.sh/w7JSd/5d7764a204.png)

Actually, RSS module is implemented but not used because there are few feeds and there are often copies of Twitter feeds.

## Technologies used

### Back-end
We use MongoDB to save all the data. We use Wikipedia and Thesaurus APIs in a rest Nodejs server.
### Front-end:

* [Angular4](https://angular.io/)
* [Bootstrap](http://getbootstrap.com/)  
* [Angular material](https://material.angularjs.org/latest/)
* [angular-svg-round-progressbar](https://github.com/crisbeto/angular-svg-round-progressbar)
* [ng2-tag-input](https://github.com/Gbuomprisco/ng2-tag-input/)

## Future 

We've planned some features, you can find them in our public Trello [here](https://trello.com/b/Ox5pukld/news-checker).