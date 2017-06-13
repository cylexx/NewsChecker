const fs = require('fs');


const path = './../sources/sources.json';

/**
* Allow all modification on the file which contains all sources followed
*
*/
class IdentifierService {

	/**
	* Add an account in the file of account followed
	*/
	static add(id, name, score, res) {
		let tab;
		let date = new Date();

		fs.readFile(path, 'utf8', (err, data) => {
			if (err) throw err;
			tab = JSON.parse(data);
			if(score==true){
				score = 70;
			}else{
				score = 30;
			}

			if (this.checkId(tab, id)) {
				tab.push({
					'name': name,
					'id': id,
					'date': (date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()),
					'mark': score,
					'counter': 0,
					'positiveCounter': 0
				});

        fs.writeFile(path, JSON.stringify(tab),
        (err) => {
          if (err) throw err
        }, () => {
					res.header("Access-Control-Allow-Origin", "*");
          res.send(JSON.stringify({'success': 'Account added !'}));
        });
			}else{
				res.header("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify({'error' : 'Id already exists!'}));
      }
		});
	}

	/**
	* print the file of account followed
	*/
	static print(res) {
		fs.readFile(path, 'utf8',
			(err, data) => {
				if (err) throw err;
				res.send(data);
			});
	}

	/**
	* Check if an id is in a tab
	*/
	static checkId(tab, id) {
		for (let item of tab) {
      if (item.id == id){
        return false;
      }
		}
		return true;
	}

	/**
	* Reset the file of all account
	*/
	static reset() {
		fs.writeFile(path,
			JSON.stringify([]),
			(err) => {
				if (err) throw err;
			});
	}

	/**
	* Get a feedback on a given source
	* Will upgrade or downgrade
	*/
	static feedback(source, opinion, res) {
		fs.readFile(path, 'utf8',
			(err, data) => {
				if (err) throw err;
				let json = JSON.parse(data);
				console.log(source);
				for (var i = 0; i < json.length; i++) {
					let item = json[i];
					if (item.id == source) {
						if(typeof item.counter =='undefined')
							item.counter = 0;
						item.counter++;
						if (opinion == 1) {
							if(typeof item.positiveCounter =='undefined')
								item.positiveCounter = 0;
							item.positiveCounter++;
						}
						item.mark = Math.round(item.positiveCounter/item.counter*100);
					}
				}
				fs.writeFile(path, JSON.stringify(json),
					(err) => {
						if (err) throw err;
					}, () => {
						res.header("Access-Control-Allow-Origin", "*");
						res.send(JSON.stringify(json));
					});
			});
	}
}

module.exports = IdentifierService;
