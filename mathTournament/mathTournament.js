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

/**
 * @class
 * @summary The class server is use to start a new game and init the reading of firebase
 * @public
 * @param {string} functionToAtendQueue Function to attend the queue 
 */
function Server(functionToAtendQueue){
    /**
     * @summary Generates a code for the current game.
     * @returns {String} The code of the current game
     */
    this.id_game;
    this.getIdGame= function(){
        return id_game;
    };
    let makeid = function() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

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
     * @summary Starts the server
     */
    this.start = function(){
        //id_game = "PTZp4"; 
        id_game = makeid();
        let queue = [];
        let serverReady = false;
        let valores = {
            flags: {
                insert: 1,
                isBusy: false
            },
            queue1: JSON.stringify( [] ),
            queue2: JSON.stringify( [] ),
            p1Ready: false,
            p2Ready: false
        };
        let refIdGame= database.ref(id_game);
        refIdGame.set(valores);
        refIdGame.on('value', function(snapshot){
            /**
            **	Inicializando los valores obtenidos del juego
            **/
            let valoresOn = snapshot.toJSON();
            let q1 = valoresOn.queue1.replace("[","").replace("]","").split(",");
                q1= cleanArray(q1);
            let q2 = valoresOn.queue2.replace("[","").replace("]","").split(",");
                q2= cleanArray(q2);
            /**
            **	Inicia el proceso de atención de la cola
            **/
            if(valoresOn.p1Ready && valoresOn.p2Ready && !valoresOn.flags.isBusy 
                && (q1.length > 0 || q2.length > 0 )){
                /**
                **	Cambio las banderas en firebase para generar un bloqueo al proceso de atención de la 
                **	cola, en caso que el evetno sea lanzado nuevamente
                **/
                let lInsert = (valoresOn.flags.insert === 1)? 2:1;
                let flags= {
                    insert: lInsert,
                    isBusy: true
                };
                refIdGame.child("flags").set(flags);

                /**
                ** Selección, atención y reset de la cola actual
                **/
                if(queue.length === 0){
                    let queueToCopy ="[]";
                    if(valoresOn.flags.insert === 1 ){
                            queueToCopy = q1;
                            refIdGame.child("queue1").set("[]");
                    }else{
                            queueToCopy = q2;
                            refIdGame.child("queue2").set("[]");
                    }
                    queue = queueToCopy; 
                }
                //queue.forEach(atendQueue);
                queue.forEach(functionToAtendQueue);
                queue = [];

                /**
                **	Se libera el bloqueo al proceso de atención de la cola
                **/
                flags.isBusy= false;
                refIdGame.child("flags").set(flags);
            }
        });
        
        
        refIdGame.child("p1Ready").on('value', function(snapshot){
            if(!snapshot.val()&& serverReady){
                alert("El jugador 1 se ha desconectado");
            }
        });
        
        refIdGame.child("p2Ready").on('value', function(snapshot){
            if(!snapshot.val() && serverReady){
                alert("El jugador 2 se ha desconectado");
            }
        });
        
        serverReady = true;
        //Borrando los datos al abandonar la partida
        window.onbeforeunload = function(){
            refIdGame.remove();
        }; 
    };
}

/**
 * @class
 * @summary The class client join to a existent game
 * @public
 */
function Client(){
    this.id_game = "-1";
    this.numPlayer ="-1";
    this.queueToInsert = -1;
    this.refIdGame= null;
    let self = this;
    /**
     * @summary Starts the client
     * @param {type} idGame Code of the game
     * @param {type} callbackOnCorrectInit function to be executed if the client is started correctly
     */
    this.start =function(idGame, callbackOnCorrectInit){
        self.id_game = idGame; 
        self.refIdGame= database.ref(self.id_game);

        self.refIdGame.once('value').then(function(snapshot) {
            let valoresOn = snapshot.toJSON();
            //La partida si existe
            if(valoresOn !== null){
                if(!valoresOn.p1Ready){
                    self.numPlayer = "1";
                    self.refIdGame.child("p1Ready").set(true);
                }else if(!valoresOn.p2Ready){
                    self.numPlayer = "2";
                    self.refIdGame.child("p2Ready").set(true);
                }
                if(self.numPlayer !== "-1"){
                    self.refIdGame.child("flags").on('value', function(snapshotFlags){
                        let flags = snapshotFlags.toJSON();
                        self.queueToInsert = flags.insert;
                    });

                    callbackOnCorrectInit();
                }else{
                    alert("La partida a la que intenta acceder ya se encuentra ocupada");
                }
            }else{
                alert("La partida no existe");
            }
        });
        
        //Reportando la salida del juego
        window.onbeforeunload = function(){
            self.refIdGame.child("p"+self.numPlayer+"Ready").set(false);
        };
    };
    
    /**
     * @summary Function to be executed when a button is clicked
     * @param {type} boton Button object in main HTML
     * @param {type} getCode function to get de code of the button
     */
    this.buttonOnClick = function(boton,getCode){
        if(self.numPlayer != "-1"){
            let codeAction= getCode(boton);
            self.refIdGame.child("queue"+self.queueToInsert).once('value').then(function(snapshot) {
                var queue = snapshot.val().replace("]","");
                queue+= ","+codeAction+"]";
                self.refIdGame.child("queue"+self.queueToInsert).set(
                        queue
                );
            });
        }
    };
}




