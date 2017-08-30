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
function Server(functionInitPlayer, inLevel){
    
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

    let evalAnwer = function(numPlayer, value){
        let other = (numPlayer===1)?2:1;
        if(value == correctAnswer){
            alert(numPlayer);
        }else{
            evalAnwer();
        }
    }

    let checkWinner = function(){
        if(valores.p1.life<=0){
            alert("ganador Player 2:"+valores.p2.nickname);
            return true;
        }
        if(valores.p2.life<=0){
            alert("ganador Player 1:"+valores.p1.nickname);
            return true;
        }
        return false;
    }

    let checkResults= function(){
        let p1Time = valores.p1answer.time;
        let p1Value =valores.p1answer.value;

        let p2Time = valores.p2answer.time;
        let p2Value = valores.p2answer.value;

        if(p1Time < p2Time){
            if(p1Value == correctAnswer){
                //alert(1);
                valores.winner = 1;
                valores.p2.life-=DAMAGE_BY_HIT;
                refIdGame.child("p2/life").set(valores.p2.life);
            }else{
                if(p2Value == correctAnswer){                    
                    valores.winner = 2;
                    valores.p1.life-=DAMAGE_BY_HIT;
                    refIdGame.child("p1/life").set(valores.p1.life);
                }else{
                    //alert("noone");
                    valores.winner = -1;
                }
            }
        }else{
            if(p2Value == correctAnswer){
                valores.winner = 2;
                valores.p1.life-=DAMAGE_BY_HIT;
                refIdGame.child("p1/life").set(valores.p2.life);
            }else{
                if(p1Value == correctAnswer){
                    valores.winner = 1;
                    valores.p2.life-=DAMAGE_BY_HIT;
                    refIdGame.child("p2/life").set(valores.p2.life);
                }else{
                    valores.winner = -1;
                }
            }
        }
        alert(valores.winner);
        refIdGame.child("winner").set(valores.winner);
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
        refIdGame = database.ref(id_game);
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

        document.getElementById("operation").innerText = operand1+ " + "+ operand2 +"="+correctAnswer;
    }

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
        let refIdGame= database.ref(id_game);
        refIdGame.set(valores);

        let refP1= database.ref(id_game+"/p1");
        refP1.on('value', function(snapshot){
            if(serverReady){
                if(!snapshot.val()){
                    alert("El jugador 1 se ha desconectado");
                }else if(!valores.p1){
                    let p1 = snapshot.toJSON();
                    valores.p1 = p1;
                    functionInitPlayer(1,p1);
                    if(valores.p2){
                        generateQuestion(refIdGame);
                    }
                }
            }
            
        });

        let refP2= database.ref(id_game+"/p2");
        refP2.on('value', function(snapshot){
            if(serverReady){
                if(!snapshot.val()){
                    alert("El jugador 2 se ha desconectado");
                }else if(!valores.p2){
                    let p2 = snapshot.toJSON();
                    valores.p2 = p2;
                    functionInitPlayer(2,p2);
                    if(valores.p1){
                        generateQuestion(refIdGame);
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
    this.id_game = null;
    this.numPlayer =null;
    this.queueToInsert = -1;
    this.refIdGame= null;
    let self = this;
    this.time = null; 
    /**
     * @summary Starts the client
     * @param {type} idGame Code of the game
     * @param {type} callbackOnCorrectInit function to be executed if the client is started correctly
     */
    this.start =function(player, idGame, callbackOnCorrectInit){
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
                alert("La partida ya se encuentra ocupada");
                self.id_game = null; 
                self.refIdGame= null;
            }
            if(self.id_game!=null){
                self.refIdGame.child('possibleAnswers').on('value', function(snapshot) {
                    let possibleAnswers = snapshot.val();
                    //let possibleAnswers = val.replace("]","").replace('[','').split(",");
                    if(possibleAnswers != null){
                        let divAnswers = document.getElementById("answers");
                        divAnswers.innerHTML ="";
                        for(let i =0; i< possibleAnswers.length; i++){
                            divAnswers.innerHTML+= "<input type='button' id='"+possibleAnswers[i]+"' onclick='cliente.buttonOnClick(this, getCode)' value='"+possibleAnswers[i]+"' />";
                        }
                    }
                });

                self.refIdGame.child('winner').on('value', function(snapshot) {
                    let winner = snapshot.val();
                    //let possibleAnswers = val.replace("]","").replace('[','').split(",");
                    if(winner){
                        if(winner == self.numPlayer){
                            document.body.style.backgroundColor = "green";
                        }else{
                            document.body.style.backgroundColor = "red";
                        }
                    }
                });
                self.time= (new Date()).getTime();
                callbackOnInit();
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
            let buttons = document.getElementsByClassName("example");
            for(let i=0; i< buttons.length; i++){
                buttons[i].disabled =true;
                if(boton.value != buttons[i].value){
                    buttons.value = "-";
                }
            }
            let t = (new Date()).getTime() - self.time;
            let answer = {
                time: t,
                value: boton.value
            }
            self.refIdGame.child("p"+self.numPlayer+"answer").set(answer);
        }
    };
}




