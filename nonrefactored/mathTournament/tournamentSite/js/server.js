var src = "http://yogome.com/epic/minigames/mathServer/index.html"
// var src = "../mathServer/index.html"
var gameFrame
var gameContainer
var server
var language = null

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
var MAX_OPERAND_VALUE = 500;
var NUMBER_OF_FAKE_ANSWERS = 2;
var INITIAL_LIFE = 100;
var DAMAGE_BY_HIT = 20;
var HEALTH_BY_HIT = 20;
var DAMAGE_BY_CRITICAL_HIT = 30;

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
 * @param {int} inLevel Level of the game. It could be {1|2|3} 1-Basic, 2- Medium, 3-Advanced 
 */
// function Server(inLevel){
function Server(){

	var self = this;
	/** Events
	 */
	self.events = {};
	self.currentData = null;
	self.p1Ready = false;
	self.p2Ready = false;
	self.startGame = false

	this.addEventListener = function(name, handler) {
		if (self.events.hasOwnProperty(name))
			self.events[name].push(handler);
		else
			self.events[name] = [handler];
		console.log(self.events[name])
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
	var level=null;
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
	var makeid = function(id) {
		if(id){
			ref2 = database.ref(id);
			return ref2.once('value').then(function (snapshot) {
				return id;
			});
		}else{
			var text = "";
			//var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var possible = "0123456789";
			for (var i = 0; i < 5; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			ref2 = database.ref(text);
			return ref2.once('value').then(function (snapshot) {
				if(!snapshot.exists()){
					return text;
				}else{
					return makeid();
				}
			});
		}
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
		// console.log("checkResultsTriggered")
		if(valores.p1answer === null){
			return;
		}
		var p1Time = valores.p1answer.time;
		var p1Value =valores.p1answer.value;

		var p2Time = valores.p2answer.time;
		var p2Value = valores.p2answer.value;

		var playerWinner =  null;
		var timeDifference = null;

		var damage =checkDamage();

		if(p1Value === p2Value && p1Value === correctAnswer){
			timeDifference = Math.abs(p1Time - p2Time)
			// console.log(timeDifference)
			if(p1Time < p2Time){
				valores.winner = 1
				//valores.p2.life+=damage;
				//refIdGame.child("p2/life").set(valores.p2.life);
			}else{
				valores.winner = 2
				//valores.p1.life+=damage;
				//refIdGame.child("p1/life").set(valores.p1.life);
			}
		}else{
			switch(correctAnswer){
				case p1Value:
					//valores.p2.life+=damage;
					valores.winner = 1
					//refIdGame.child("p2/life").set(valores.p2.life);
					break;
				case p2Value:
					//valores.p1.life+=damage;
					valores.winner = 2
					//refIdGame.child("p1/life").set(valores.p1.life);
					break;
				default:
					valores.winner = -1;
			}
		}

		if(valores.winner === 1 && (typeQuestion === 1 || typeQuestion === 2) ){
			valores.p2.life+=damage;
			refIdGame.child("p2/life").set(valores.p2.life);
		}else if(valores.winner === 2 && typeQuestion === 3 ){
			valores.p2.life+=damage;
			refIdGame.child("p2/life").set(valores.p2.life);
		}else {
			valores.p1.life+=damage;
			refIdGame.child("p1/life").set(valores.p1.life);
		}
		var date = new Date()
		var actualDate = date.getMilliseconds()
		// console.log(actualDate)
		var answers = {
			p1:valores.p1answer,
			p2:valores.p2answer
		}
		var data = { numPlayer: valores.winner, timeDifference: timeDifference, answers:answers, date:actualDate }
		refIdGame.child("winner").set(data);
		self.fireEvent('onTurnEnds',[data]);

		// valores.p1answer=false;
		// valores.p2answer=false;
		// refIdGame.set(valores);

		if(checkWinner()){
			valores.p1answer=false;
			valores.p2answer=false;
			valores.winner=false;
			valores.possibleAnswers = [];
		}
	}

	function generateQuestion(){
		var operand1;
		var operand2;
		var result = "?";
		var opedator = Math.floor((Math.random() * 3) + 1);
		
		switch(level){
			case 2://Medium
				MAX_OPERAND_VALUE = 500;
				switch(opedator){
					case 2: // -
						opedator = "-";
						operand1= Math.floor((Math.random() * 399 ) )+101;
						operand2= Math.floor((Math.random() * 399 ) )+101;
                        if(operand1< operand2){
                            var aux = operand1;
                            operand1 = operand2;
                            operand2 = aux;
                        }
                        correctAnswer = operand1 -operand2;
						break;
					case 3: // x
						opedator = "x";
						operand1= Math.floor((Math.random() * 10 ) + 12 );
						operand2= Math.floor((Math.random() * 10 ) + 12 );
						correctAnswer = operand1 * operand2;
						break;
					case 4: // /
						// operand1 = dividendo, operand2 = divisor
						opedator = "/";
						operand1= Math.floor((Math.random() * 10 ) + 12 );
						operand2= Math.floor((Math.random() * 10 ) + 12);
						var aux =  operand1 * operand2;
						correctAnswer = operand1;
						operand1 = aux;
						break;
					case 1: // +
					default:
						opedator = "+";
						operand1= Math.floor((Math.random() * 250) + 1);
						operand2= Math.floor((Math.random() * 250) + 1);
						correctAnswer = operand1 +operand2;
						break;
				}
				break;
			case 3://Advance
				MAX_OPERAND_VALUE = 999;
				switch(opedator){
					case 2: // -
						opedator = "-";
						operand1= Math.floor((Math.random() * 498 ) ) + 501;
						operand2= Math.floor((Math.random() * 498 ) ) + 501;
                        if(operand1< operand2){
                            var aux = operand1;
                            operand1 = operand2;
                            operand2 = aux;
                        }
                        correctAnswer = operand1 -operand2;
						break;
					case 3: // x
						opedator = "x";
						operand1= Math.floor((Math.random() * 10 ) + 22 );
						operand2= Math.floor((Math.random() * 10 ) + 21 );
						correctAnswer = operand1 * operand2;
						break;
					case 4: // /
						// operand1 = dividendo, operand2 = divisor
						opedator = "/";
						operand1= Math.floor((Math.random() * 10 ) + 22);
						operand2= Math.floor((Math.random() * 10 ) + 21);
						var aux =  operand1 * operand2;
						correctAnswer = operand1;
						operand1 = aux;
						break;
					case 1: // +
					default:
						opedator = "+";
						operand1= Math.floor((Math.random() * 500) + 1);
						operand2= Math.floor((Math.random() * 499) + 1);
						correctAnswer = operand1 +operand2;
						break;
				}
				break;
			case 1://Basic
			default:
				MAX_OPERAND_VALUE = 100;
				switch(opedator){
					case 2: // -
						opedator = "-";
						operand1= Math.floor((Math.random() * 99 ) + 1 );
						operand2= Math.floor((Math.random() * 99 ) + 1);
						if(operand1< operand2){
							var aux = operand1;
							operand1 = operand2;
							operand2 = aux;
						}
						correctAnswer = operand1 -operand2;
						break;
					case 3: // x
						opedator = "x";
						operand1= Math.floor((Math.random() * 9 ) + 1 );
						operand2= Math.floor((Math.random() * 11 ) + 1);
						correctAnswer = operand1 * operand2;
						break;
					case 4: // /
						// operand1 = dividendo, operand2 = divisor
						opedator = "/";
						operand1= Math.floor((Math.random() * 11 ) + 1 );
						operand2= Math.floor((Math.random() * 9 ) + 1);
						var aux =  operand1 * operand2;
						correctAnswer = operand1;
						operand1 = aux;
						break;
					case 1: // +
					default:
						opedator = "+";
						operand1= Math.floor((Math.random() * 100) + 1);
						operand2= Math.floor((Math.random() * 100) + 1);
						correctAnswer = operand1 +operand2;
						break;
				}
				var isEcuation = Math.floor((Math.random() * 2) + 1);
				if(isEcuation===1){
					result =correctAnswer;
					correctAnswer = operand2;
					operand2 = "?";
				}
		}
		// operand1= Math.floor((Math.random() * MAX_OPERAND_VALUE) + 1);
		// operand2= Math.floor((Math.random() * MAX_OPERAND_VALUE) + 1);
		// correctAnswer = operand1 +operand2;

		var possibleAnswers = [correctAnswer];
        var percentage = 0;
        percentage = Math.floor(correctAnswer * 0.25)+1;
		for(var i = 0; i< NUMBER_OF_FAKE_ANSWERS; i++){
			var n = correctAnswer;
			while(possibleAnswers.includes(n)){
                var isSuma = Math.floor((Math.random() * 2) + 1);
                if(isSuma ===1 )
					n = correctAnswer + Math.floor(Math.random() * percentage)+Math.floor(Math.random() * 2);
				else
                    n = correctAnswer - Math.floor(Math.random() * percentage)-Math.floor(Math.random() * 2);
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
			opedator : opedator,
			result : result,
			correctAnswer : correctAnswer,
			type :typeQuestion
		}
		valores.data = data;
		refIdGame.child("data").set(valores.data);
		refIdGame.child("possibleAnswers").set(valores.possibleAnswers);
		self.fireEvent('afterGenerateQuestion',[data]);
	}
	this.generateQuestion = generateQuestion;

	/**
	 * @summary Starts the server
	 */
	this.start = function(inLevel, currentId){
		self.events = {};
		self.p1Ready = false;
		self.p2Ready = false;
		console.log(self.events)

		var promise = makeid(currentId);
        promise.then(function(id){
        	id_game = id;
			level = inLevel
			var serverReady = false;
			valores = {
				p1: false,
				p2: false,
				winner :false,
				level: level,
				p1answer : false,
				p2answer : false,
				possibleAnswers: [],
				data:false,
				gameReady:false,
				gameEnded:false,
				retry:false
			};
			refIdGame= database.ref(id_game);
			refIdGame.set(valores);

            if(!currentId) {
                var refP1 = database.ref(id_game + "/p1");
                refP1.on('value', function (snapshot) {
                    if (serverReady) {
                        if (!snapshot.val()) {
                            self.fireEvent('onPlayerDisconnect', [{numPlayer: 1, playerWinner: valores.p1}]);
                        } else if (!valores.p1) {
                            var p1 = snapshot.toJSON();
                            valores.p1 = p1;
                            self.fireEvent('onInitPlayer', [{numPlayer: 1, player: valores.p1}]);
                            if (valores.p2) {
                                self.currentData = valores
                                self.fireEvent('onPlayersReady', [valores]);
                            }
                        }
                    }

                });

                var refP2 = database.ref(id_game + "/p2");
                refP2.on('value', function (snapshot) {
                    if (serverReady) {
                        if (!snapshot.val()) {
                            self.fireEvent('onPlayerDisconnect', [{numPlayer: 2, playerWinner: valores.p2}]);
                        } else if (!valores.p2) {
                            var p2 = snapshot.toJSON();
                            valores.p2 = p2;
                            self.fireEvent('onInitPlayer', [{numPlayer: 2, player: valores.p2}]);
                            if (valores.p1) {
                                self.currentData = valores
                                self.fireEvent('onPlayersReady', [valores]);
                            }
                        }
                    }
                });

                var readyP1 = database.ref(id_game + "/p1/ready");
                readyP1.on('value', function (snapshot) {
                    if (serverReady) {
                        var ready = snapshot.val()
                        // console.log(ready)
                        if (ready) {
                            self.p1Ready = true;
                            if (self.p2Ready) {
                            	console.log("START GAME INIT")
                                self.startGame()
                            }
                        }
                    }
                });

                var readyP2 = database.ref(id_game + "/p2/ready");
                readyP2.on('value', function (snapshot) {
                    if (serverReady) {
                        var ready = snapshot.val()
                        // console.log(ready)
                        if (ready) {
                            self.p2Ready = true;
                            if (self.p1Ready) {
                                self.startGame()
                            }
                        }
                    }
                });

                var p1answer = database.ref(id_game + "/p1answer");
                p1answer.on('value', function (snapshot) {
                    var p1answer = snapshot.toJSON();
                    valores.p1answer = p1answer;
                    if (valores.p2answer) {
                        checkResults();
                    }
                });

                var p2answer = database.ref(id_game + "/p2answer");
                p2answer.on('value', function (snapshot) {
                    var p2answer = snapshot.toJSON();
                    valores.p2answer = p2answer;
                    if (valores.p1answer) {
                        checkResults();
                    }
                });

                //Borrando los datos al abandonar la partida
                window.onbeforeunload = function () {
                    // if(!id_game.includes("egs"))
                    refIdGame.remove();
                    // else
                    // 	self.retry();
                };
                serverReady = true;
            }
        });
	};

	this.setGameReady = function (value) {
		refIdGame.child("gameReady").set(value);
	}

	this.retry = function(){
		var date = new Date()
		var actualDate = date.getMilliseconds()

		valores.p1answer =false;
		valores.p2answer =false;
		valores.p1.life =INITIAL_LIFE;
		valores.p2.life =INITIAL_LIFE;
		valores.winner =false;
		valores.possibleAnswers = [];
		valores.data = false;
		valores.gameEnded = false;
		valores.retry = {retry:true, date:actualDate};
		refIdGame.set(valores);
		// refIdGame.off()
		// refIdGame.remove();

	}
	
	this.setGameEnded = function (numPlayerWinner) {
		var data = {winner:numPlayerWinner}
		refIdGame.child("gameEnded").set(data);
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
	server = new Server();
}

// window.addEventListener("resize", loadGame);