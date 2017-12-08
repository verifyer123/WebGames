// var json = JSON.parse(require('fs').readFileSync('epicBattle/data/characters/beanEarth1.json', 'utf8'));
// console.log(json)

var path = require('path'), fs=require('fs');

function fromDir(startPath,filter){

	//console.log('Starting from dir '+startPath+'/');

	if (!fs.existsSync(startPath)){
		console.log("no dir ",startPath);
		return;
	}

	var files=fs.readdirSync(startPath);
	var characters = {}
	var counter = 0
	for(var i=0;i<files.length;i++){
		var filename=path.join(startPath,files[i]);
		if (filename.indexOf(filter)>=0) {
			var character = JSON.parse(fs.readFileSync(filename, 'utf8'))
			// var reg = new RegExp("epicBattle","i");
			var fileReplace = filename.replace(/\\/g, "");
			var pathReplace = startPath.replace(/\\/g, "");
			var reg = new RegExp("epicBattledatacharactersready", "g")
			var charName = fileReplace.replace(reg, "");
			charName = charName.replace(/.json/g, "");
			console.log(charName, fileReplace)
			character.id = charName
			// character.index = characters.length
			characters[charName] = character
			// characters[counter] = character
			// counter++
			// console.log('-- found: ',filename);
		};
	};

	fs.writeFileSync("../shared/epic/data/epicCharacters.js", "var epicCharacters = " + JSON.stringify(characters));
	console.log(characters)
};

fromDir('epicBattle/data/characters/ready','.json');