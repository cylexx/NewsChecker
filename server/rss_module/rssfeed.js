var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
var sched = require('node-schedule');
var fs = require('fs');
var moment = require('moment');

var job = sched.scheduleJob('*/10 * * * * *', function(){
  fs.readFile('rssFeeds.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    let json = JSON.parse(data);
    for(let i =0; i<json.length; i++){
      requestRss(json[i].src, json[i].name, json[i].subject);
    }
  });
});

function requestRss(url, name, subject){
  var req = request(url)
  var feedparser = new FeedParser();
  var json = [];
  req.on('error', function (error) {
    // handle any request errors 
  });
   
  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream 
   
    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });
   
  feedparser.on('error', function (error) {
    // always handle errors 
  });

  feedparser.on('end', function (error) {
    let newsCounter = 0;
    let filename = "rss/"+name+"_"+subject+".json"; 
    fs.readFile(filename, 'utf8', function (err,data) {
      if (err) {
        writeInFile(filename, json);
        return ;
      }
      let fileContent = JSON.parse(data);
      for(let i =0; i<json.length; i++){
        let found = false;
        for(let j =0; j<fileContent.length; j++){
          if(json[i].date.isSame(fileContent[j].date)){
            found = true;
            break;
          }
        }
        if(!found){
          fileContent.push(json[i]);
          newsCounter++;
        }
      }
      if(newsCounter > 0){
        writeInFile(filename, fileContent);
        console.log(filename + " "+newsCounter+" news have been added")
      }
         
    });
    
    //console.log(name + " "+ subject+" : "+ json.length+" infos"); 
  });
   
  feedparser.on('readable', function () {
    // This is where the action is! 
    var stream = this; // `this` is `feedparser`, which is a stream 
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance 
    var item;
   
    
    while (item = stream.read()) {
      let d = moment(item.date,"YYYY-DD-MMTHH:mm:ss.SSSZ");
      if(d.isValid()){
/*        console.log(item.title);
        console.log(item.description);
        console.log(item.date);*/
        json.push({date:d, title:item.title, description:item.description});

        
      }
      //console.log('--------------');
    }
    
  });
}

function writeInFile(filename, json){
  fs.writeFile(filename, JSON.stringify(json), function(err) {
    if(err) {
        return console.log(err);
    }
  });
}