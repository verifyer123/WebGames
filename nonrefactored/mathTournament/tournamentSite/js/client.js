var src = "../mathClient/index.html"
var gameFrame
var gameContainer

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

/**
 * @class
 * @summary The class client join to a existent game
 * @public
 */
function Client(){
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

	this.id_game = null;
	this.numPlayer =null;
	this.queueToInsert = -1;
	this.refIdGame= null;
	var self = this;
	this.time = null;
	/**
	 * @summary Starts the client
	 * @param {type} idGame Code of the game
	 */
	this.start =function(player, idGame){
		self.id_game = idGame;
		self.player = player
		self.refIdGame= database.ref(self.id_game);
		self.refIdGame.once('value').then(function(snapshot) {
			var p1,p2;
			p1 = snapshot.val().p1;
			p2 = snapshot.val().p2;
			console.log(p1, p2)
			if(!p1){
				self.refIdGame.child("p1").set(player);
				self.numPlayer = 1;
			}else if(!p2){
				self.refIdGame.child("p2").set(player);
				self.numPlayer = 2;
			}else{
				self.id_game = null;
				self.refIdGame= null;
				self.fireEvent('onGameFull',[]);
			}
			if(self.id_game!==null){
				self.refIdGame.child("data").on('value', function(snapshot) {
					var data = snapshot.val();
					self.currentData = data
					self.fireEvent('showEquation',[data]);
				});

				self.refIdGame.child('possibleAnswers').on('value', function(snapshot) {
					var possibleAnswers = snapshot.val();
					if(possibleAnswers !== null){
						self.currentOptions = possibleAnswers
						self.fireEvent('showPossibleAnswers',[possibleAnswers]);
					}
				});

				self.refIdGame.child('winner').on('value', function(snapshot) {

					var values = snapshot.val();
					if(values){
						console.log("on Turn End triggered")
						self.fireEvent('onTurnEnds',[values]);
					}
				});

				self.time= (new Date()).getTime();
				self.fireEvent('onClientInit',[]);

			}

		});

		//Reportando la salida del juego
		window.onbeforeunload = function(){
			if(self.numPlayer!=null)
				self.refIdGame.child("p"+self.numPlayer).set(false);
		};
	};

	/**
	 * @summary Function to be executed when a button is clicked
	 * @param {type} boton Button object in main HTML
	 * @param {type} getCode function to get de code of the button
	 */
	this.buttonOnClick = function(value, time){
		if(self.numPlayer != null){

			var answer = {
				time: time,
				value: value
			}
			self.refIdGame.child("p"+self.numPlayer+"answer").set(answer);
		}
	};
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
	cliente = new Client();
}

// window.addEventListener("resize", loadGame);