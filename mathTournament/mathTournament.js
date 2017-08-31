﻿// Initialize Firebase
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
const NUMBER_OF_FAKE_ANSWERS = 5;
let INITIAL_LIFE = 100;
let DAMAGE_BY_HIT = 50;

/**
 * @summary As default, an empty array has one element (an empty String). This function removes that element
 * @param {type} arr Array to be cleaned
 * @returns {unresolved} Array cleaned
 */
let cleanArray = function(arr){
    let i = arr.indexOf("");
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
    
    let self = this;
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
        var index = _this.events[name].indexOf(handler);
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
    
    let id_game;
    let level=inLevel;
    let valores = null;
    let correctAnswer= false;
    let refIdGame = null;

    this.getIdGame= function(){
        return id_game;
    };


    /**
     * @summary Generates a code for the current game.
     * @returns {String} The code of the current game
     */
    let makeid = function() {
        let text = "";
        //let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let possible = "0123456789";
        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    

    let shuffleArray = function(array) {
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

    let checkWinner = function(){
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

    let checkResults= function(){
        if(valores.p1answer== null){
            return;
        }
        let p1Time = valores.p1answer.time;
        let p1Value =valores.p1answer.value;

        let p2Time = valores.p2answer.time;
        let p2Value = valores.p2answer.value;

        let playerWinner =  null;

        
        if(p1Value == p2Value && p1Value == correctAnswer){
            if(p1Time < p2Time){
                valores.winner = 1;
                valores.p2.life-=DAMAGE_BY_HIT;
                playerWinner = valores.p1;
                refIdGame.child("p2/life").set(valores.p2.life);
            }else{
                valores.winner = 2;
                valores.p1.life-=DAMAGE_BY_HIT;
                playerWinner = valores.p2;
                refIdGame.child("p1/life").set(valores.p1.life);
            }
        }else{
            switch(correctAnswer){
                case p1Value:
                    valores.winner = 1;
                    valores.p2.life-=DAMAGE_BY_HIT;
                    playerWinner = valores.p1;
                    refIdGame.child("p2/life").set(valores.p2.life);
                    break;
                case p2Value:
                    valores.winner = 2;
                    valores.p1.life-=DAMAGE_BY_HIT;
                    playerWinner = valores.p2;
                    refIdGame.child("p1/life").set(valores.p1.life);
                    break;
                default:
                    valores.winner = -1;
            }
        }

        refIdGame.child("winner").set(valores.winner);
        self.fireEvent('onTurnEnds',[{ numPlayer: valores.winner, playerWinner: playerWinner }]);

        if(!checkWinner())
            generateQuestion();
        else{
            valores.p1answer=false;
            valores.p2answer=false;
            valores.winner=false;
            valores.possibleAnswers = [];
        }
    }

    let generateQuestion = function(){
        let operand1= Math.floor((Math.random() * MAX_OPERAND_VALUE) + 1);
        let operand2= Math.floor((Math.random() * MAX_OPERAND_VALUE) + 1);

        correctAnswer = operand1 +operand2;
        let possibleAnswers = [correctAnswer];
        for(let i = 0; i< NUMBER_OF_FAKE_ANSWERS; i++){
            let n = correctAnswer;
            while(n==correctAnswer){
                n = Math.floor((Math.random() * MAX_OPERAND_VALUE*2) + 1)
            }
            possibleAnswers.push(n);
        }
        
        valores.possibleAnswers = shuffleArray(possibleAnswers);
        valores.p1answer = false;
        valores.p2answer = false;

        refIdGame.set(valores);

        let data = {
            operand1 : operand1,
            operand2 : operand2,
            opedator : "+",
            correctAnswer : correctAnswer
        }
        self.fireEvent('afterGenerateQuestion',[data]);
    }
    this.generateQuestion = generateQuestion;

    /**
     * @summary Starts the server
     */
    this.start = function(){
        //id_game = "00000"; 
        id_game = makeid();
        let serverReady = false;
        valores = {
            flags: false,
            p1: false,
            p2: false,
            winner :false,
            level: level,
            p1answer : false,
            p2answer : false,
            possibleAnswers: []
        };
        refIdGame= database.ref(id_game);
        refIdGame.set(valores);

        let refP1= database.ref(id_game+"/p1");
        refP1.on('value', function(snapshot){
            if(serverReady){
                if(!snapshot.val()){
                    self.fireEvent('onPlayerDisconnect',[{ numPlayer: 1, playerWinner: valores.p1 }]);
                }else if(!valores.p1){
                    let p1 = snapshot.toJSON();
                    valores.p1 = p1;
                    self.fireEvent('onInitPlayer',[{ numPlayer: 1, player: valores.p1 }]);
                    if(valores.p2){
                        self.fireEvent('onPlayersReady',[]);
                    }
                }
            }
            
        });

        let refP2= database.ref(id_game+"/p2");
        refP2.on('value', function(snapshot){
            if(serverReady){
                if(!snapshot.val()){
                    self.fireEvent('onPlayerDisconnect',[{ numPlayer: 2, playerWinner: valores.p2 }]);
                }else if(!valores.p2){
                    let p2 = snapshot.toJSON();
                    valores.p2 = p2;
                    self.fireEvent('onInitPlayer',[{ numPlayer: 2, player: valores.p2 }]);
                    if(valores.p1){
                        self.fireEvent('onPlayersReady',[]);
                    }
                }
            }
        });

        let p1answer= database.ref(id_game+"/p1answer");
        p1answer.on('value', function(snapshot){
            let p1answer = snapshot.toJSON();
            valores.p1answer = p1answer;
            if(valores.p2answer){
                checkResults();
            }
        });

        let p2answer= database.ref(id_game+"/p2answer");
        p2answer.on('value', function(snapshot){
            let p2answer = snapshot.toJSON();
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
}

/**
 * @class
 * @summary The class client join to a existent game
 * @public
 */
function Client(){
    let self = this;
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
        var index = _this.events[name].indexOf(handler);
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
    this.time = null; 
    /**
     * @summary Starts the client
     * @param {type} idGame Code of the game
     */
    this.start =function(player, idGame){
        self.id_game = idGame; 
        self.refIdGame= database.ref(self.id_game);
        self.refIdGame.once('value').then(function(snapshot) {
            let p1,p2;
            p1 = snapshot.val().p1;
            p2 = snapshot.val().p2;
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
            if(self.id_game!=null){
                self.refIdGame.child('possibleAnswers').on('value', function(snapshot) {
                    let possibleAnswers = snapshot.val();
                    if(possibleAnswers != null){
                        self.fireEvent('showPossibleAnswers',[possibleAnswers]);
                    }
                });

                self.refIdGame.child('winner').on('value', function(snapshot) {
                    let winner = snapshot.val();
                    if(winner){
                        self.fireEvent('onTurnEnds',[{winner:winner, myNumber: self.numPlayer}]);
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
    this.buttonOnClick = function(boton,getCode){
        if(self.numPlayer != null){
            let t = (new Date()).getTime() - self.time;
            let answer = {
                time: t,
                value: boton.value
            }
            self.refIdGame.child("p"+self.numPlayer+"answer").set(answer);
        }
    };
}




