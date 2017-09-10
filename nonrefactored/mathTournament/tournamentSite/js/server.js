var src = "../mathServer/index.html"
var gameFrame
var gameContainer

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBELTimQUqywzRlJTpIA2HZ8RTp9r_QF2E",
	authDomain: "mathtournament-175416.firebaseapp.com",
	databaseURL: "https://mathtournament-175416.firebaseio.com",
	projectId: "mathtournament-175416",
	storageBucket: "mathtournament-175416.appspot.com",
	messagingSenderId: "973021572842"
};
firebase.initializeApp(config);
var database = firebase.database();
const MAX_OPERAND_VALUE = 500;
const NUMBER_OF_FAKE_ANSWERS = 2;
var INITIAL_LIFE = 100;
var DAMAGE_BY_HIT = 10;
var HEALTH_BY_HIT = 10;
var DAMAGE_BY_CRITICAL_HIT = 20;

/**
 * @summary As default, an empty array has one element (an empty String). This function removes that element
 * @param {type} arr Array to be cleaned
 * @returns {unresolved} Array cleaned
 */
var cleanArray = function(arr){
	var i = arr.indexOf("");
	if(i>-1){
		arr.splice(i,1);
	}
	return arr;
};

/**
 * @class
 * @summary The class server is use to start a new game and init the reading of firebase
 * @public
 * @param {string} functionInitPlayer Function to be executed afeter a player is inited
 */
function Server(inLevel){

	var self = this;
	/** Events
	 */
	self.events = {};

	this.addEventListener = function(name, handler) {
		if (self.events.hasOwnProperty(name))
			self.events[name].push(handler);
		else
			self.events[name] = [handler];
	};

	/* This is a bit tricky, because how would you identify functions?
		This simple solution should work if you pass THE SAME handler. */
	this.removeEventListener = function(name, handler) {
		if (!self.events.hasOwnProperty(name))
			return;
		var index = self.events[name].indexOf(handler);
		if (index != -1)
			self.events[name].splice(index, 1);
	};

	this.fireEvent = function(name, args) {
		if (!self.events.hasOwnProperty(name))
			return;
		if (!args || !args.length)
			args = [];
		var evs = self.events[name], l = evs.length;
		for (var i = 0; i < l; i++) {
			evs[i].apply(null, args);
		}
	};
	/**End Events*/

	var id_game;
	var level=inLevel;
	var valores = null;
	var correctAnswer= false;
	var refIdGame = null;
	var typeQuestion = 0;

	this.getIdGame= function(){
		return id_game;
	};


	/**
	 * @summary Generates a code for the current game.
	 * @returns {String} The code of the current game
	 */
	var makeid = function() {
		var text = "";
		//var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var possible = "0123456789";
		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	};



	var shuffleArray = function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	var checkWinner = function(){
		if(valores.p1.life<=0){
			self.fireEvent('onGameEnds',[{ numPlayer: 2, playerWinner: valores.p2 }]);
			return true;
		}
		if(valores.p2.life<=0){
			self.fireEvent('onGameEnds',[{ numPlayer: 1, playerWinner: valores.p1 }]);
			return true;
		}
		return false;
	}

	var checkDamage = function() {
		switch(typeQuestion){
			case 1://green
				return -1*DAMAGE_BY_HIT;
				break;
			case 2://red
				return -1*DAMAGE_BY_CRITICAL_HIT;
				break;
			case 3://blue
				return HEALTH_BY_HIT;
				break;
		}
	}

	var checkResults= function(){
		if(valores.p1answer== null){
			return;
		}
		var p1Time = valores.p1answer.time;
		var p1Value =valores.p1answer.value;

		var p2Time = valores.p2answer.time;
		var p2Value = valores.p2answer.value;

		var playerWinner =  null;

		var damage =checkDamage();
		if(p1Value == p2Value && p1Value == correctAnswer){
			if(p1Time < p2Time){
				valores.winner = 1;
				//valores.p2.life+=damage;
				playerWinner = valores.p1;
				//refIdGame.child("p2/life").set(valores.p2.life);
			}else{
				valores.winner = 2;
				//valores.p1.life+=damage;
				playerWinner = valores.p2;
				//refIdGame.child("p1/life").set(valores.p1.life);
			}
		}else{
			switch(correctAnswer){
				case p1Value:
					valores.winner = 1;
					//valores.p2.life+=damage;
					playerWinner = valores.p1;
					//refIdGame.child("p2/life").set(valores.p2.life);
					break;
				case p2Value:
					valores.winner = 2;
					//valores.p1.life+=damage;
					playerWinner = valores.p2;
					//refIdGame.child("p1/life").set(valores.p1.life);
					break;
				default:
					valores.winner = -1;
			}
		}

		if(valores.winner== 1 && (typeQuestion == 1 || typeQuestion == 2) ){
			valores.p2.life+=damage;
			refIdGame.child("p2/life").set(valores.p2.life);
		}else if(valores.winner== 2 && typeQuestion == 3 ){
			valores.p2.life+=damage;
			refIdGame.child("p2/life").set(valores.p2.life);
		}else {
			valores.p1.life+=damage;
			refIdGame.child("p1/life").set(valores.p1.life);
		}

		refIdGame.child("winner").set(valores.winner);
		self.fireEvent('onTurnEnds',[{ numPlayer: valores.winner, playerWinner: playerWinner }]);

		if(checkWinner()){
			valores.p1answer=false;
			valores.p2answer=false;
			valores.winner=false;
			valores.possibleAnswers = [];
		}
	}

	var generateQuestion = function(){
		var operand1= Math.floor((Math.random() * MAX_OPERAND_VALUE) + 1);
		var operand2= Math.floor((Math.random() * MAX_OPERAND_VALUE) + 1);

		correctAnswer = operand1 +operand2;
		var possibleAnswers = [correctAnswer];
		for(var i = 0; i< NUMBER_OF_FAKE_ANSWERS; i++){
			var n = correctAnswer;
			while(n==correctAnswer){
				n = Math.floor((Math.random() * MAX_OPERAND_VALUE*2) + 1)
			}
			possibleAnswers.push(n);
		}

		valores.possibleAnswers = shuffleArray(possibleAnswers);
		valores.p1answer = false;
		valores.p2answer = false;

		typeQuestion= Math.floor((Math.random() * 100) + 1);
		if(valores.p1.life < INITIAL_LIFE && valores.p2.life < INITIAL_LIFE){
			typeQuestion= Math.floor((Math.random() * 100) + 1);
			if(typeQuestion<= 20){
				typeQuestion= 2; //red
			}else if(typeQuestion <= 40){
				typeQuestion=3; //blue
			}else{
				typeQuestion= 1; //green
			}
		}else{
			if(typeQuestion<= 20){
				typeQuestion= 2; //red
			}else {
				typeQuestion=1; //green
			}
		}

		var data = {
			operand1 : operand1,
			operand2 : operand2,
			opedator : "+",
			correctAnswer : correctAnswer,
			type :typeQuestion
		}
		valores.data = data;
		refIdGame.set(valores);
		self.fireEvent('afterGenerateQuestion',[data]);
	}
	this.generateQuestion = generateQuestion;

	/**
	 * @summary Starts the server
	 */
	this.start = function(){
		//id_game = "00000";
		id_game = makeid();
		var serverReady = false;
		valores = {
			p1: false,
			p2: false,
			winner :false,
			level: level,
			p1answer : false,
			p2answer : false,
			possibleAnswers: [],
			data:false
		};
		refIdGame= database.ref(id_game);
		refIdGame.set(valores);

		var refP1= database.ref(id_game+"/p1");
		refP1.on('value', function(snapshot){
			if(serverReady){
				if(!snapshot.val()){
					self.fireEvent('onPlayerDisconnect',[{ numPlayer: 1, playerWinner: valores.p1 }]);
				}else if(!valores.p1){
					var p1 = snapshot.toJSON();
					valores.p1 = p1;
					self.fireEvent('onInitPlayer',[{ numPlayer: 1, player: valores.p1 }]);
					if(valores.p2){
						self.fireEvent('onPlayersReady',[valores]);
					}
				}
			}

		});

		var refP2= database.ref(id_game+"/p2");
		refP2.on('value', function(snapshot){
			if(serverReady){
				if(!snapshot.val()){
					self.fireEvent('onPlayerDisconnect',[{ numPlayer: 2, playerWinner: valores.p2 }]);
				}else if(!valores.p2){
					var p2 = snapshot.toJSON();
					valores.p2 = p2;
					self.fireEvent('onInitPlayer',[{ numPlayer: 2, player: valores.p2 }]);
					if(valores.p1){
						self.fireEvent('onPlayersReady',[valores]);
					}
				}
			}
		});

		var p1answer= database.ref(id_game+"/p1answer");
		p1answer.on('value', function(snapshot){
			var p1answer = snapshot.toJSON();
			valores.p1answer = p1answer;
			if(valores.p2answer){
				checkResults();
			}
		});

		var p2answer= database.ref(id_game+"/p2answer");
		p2answer.on('value', function(snapshot){
			var p2answer = snapshot.toJSON();
			valores.p2answer = p2answer;
			if(valores.p1answer ){
				checkResults();
			}
		});

		//Borrando los datos al abandonar la partida
		window.onbeforeunload = function(){
			refIdGame.remove();
		};
		serverReady = true;

	};

	this.retry = function(){
		valores.p1answer =false;
		valores.p2answer =false;
		valores.p1.life =INITIAL_LIFE;
		valores.p2.life =INITIAL_LIFE;
		valores.winner =false;
		valores.possibleAnswers = [];
		valores.data = false;
		refIdGame.set(valores);
	}
}

function loadGame(){
	if(gameFrame)
		gameContainer.removeChild(gameFrame);
	else
		gameFrame = document.createElement("iframe")
	gameFrame.src= src
	gameFrame.style.borderStyle = "none"
	gameFrame.scrolling = "no"
	gameFrame.width = "100%"
	gameFrame.height = "100%"
	gameContainer.appendChild(gameFrame);
}

window.onload =  function(){
	gameContainer = document.getElementById("game-container")
	loadGame()
	var level = 1;
	server = new Server(level);
	server.start();
}

window.addEventListener("resize", loadGame);