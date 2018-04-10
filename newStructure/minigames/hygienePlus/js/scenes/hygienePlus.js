
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var hygienePlus = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.hygiene",
                json: "images/hygiene/atlas.json",
                image: "images/hygiene/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/hygiene/timeAtlas.json",
                image: "images/hygiene/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            
            {
				name:'tutorial_image',
				file:"images/hygiene/tutorial_image_%input.png"
			},
            {
                name:'tileWallBottom',
                file:"images/hygiene/tile_pared2.png"
            },
            {
                name:'tileFloor',
                file:"images/hygiene/tile_piso.png"
            },
            {
                name:'tileWallUpper',
                file:"images/hygiene/tile_pared.png"
            },

		],
        spines: [
            {   
                name: "oof",
                file: "images/Spine/oof/oof.json",
            }

        ],
        spritesheets: [
            {
                name:"coin",
                file:"images/Spine/coin/coin.png",
                width:122,
                height:123,
                frames:12
            },
            {
                name:"hand",
                file:"images/Spine/hand/hand.png",
                width:115,
                height:111,
                frames:23
            }
        ],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {   name:"acornSong",
				file: soundsPath + 'songs/running_game.mp3'}
			
		],
        jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
    }
    
    //Variables    
    var lives = null
	var sceneGroup = null
    var gameActive = true
	var particlesGroup, particlesUsed
    var gameIndex = 174
    var tutoGroup
    var baseSong
    var startTiming=500;
    var delayDefault=100;
    var delayerTimer=2500;
    var tutoLvl1=true;
    var moreDificult=0;
    var timeForEvent=1000;
    var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
    var listofActionsEN = [
      ["BATHING", "NAP", "CAT"],
      ["CLEANING","CLOSING" , "CARRYING"],
      ["COMBING","HOLDING", "WARMING"],
      ["WASHING", "WALKING","WRITTING"]
    ];
    var listofActionsES= [
          ["Bañando", "Vistiendo", "Comiendo"],
          ["Lavando","Jugando" , "Aplaudiendo"],
          ["Peinando","Mojando", "Lavando"],
          ["Cepillando", "Divirtiendo","Saltando"]
        ];
    var listofActionsESAlternative = [
          ["Bañando", "Bañara", "Bañaba"],
          ["Lavando","Lavará" , "Lavaba"],
          ["Peinando","Peinaba", "Peinará"],
          ["Cepillando", "Cepilla","Cepillará"]
        ];
    var listofActionsENAlternative = [
          ["Bañando", "Bathing", "Bathed"],
          ["Washing","Wash" , "Washed"],
          ["Combing","Combed", "Comb"],
          ["Brushing", "brushed","brush"]
        ];
    var staticPhraseES="OOF ESTA";
    var staticPhraseEN="OOF IS";
    var staticPhraseENSpecial="OOF IS TAKING A";
    var staticPhraseEndingES=[
        "SUS DIENTES",
        "",
        "SU CABELLO",
        "SUS MANOS"
    ];
    var staticPhraseEndingEN=[
        "HIS HANDS",
        "",
        "HIS HAIR",
        "HIS TEETH"
    ];
    var randomAction=0;
    var randomWords=0;
    var correctChoicesEN= [
        "bathing",
        "cleaning",
        "combing",
        "washing"
    ];
    var correctChoicesES= [
        "bañando",
        "limpiando",
        "peinando",
        "lavando"
    ];
    var selectedChoice=null;
    var oofsActions=[
        "bathing",
        "cleaning",
        "combing",
        "washing"
    ];
    var skin="normal";
    
    var passingLevel=false;
    var actionInBox="¿?";
    var maxValue=3;
    var minValue=0;
    var canChoose=true;
    var btnChoosed;
    
    var backgroundGroup=null;
    var characterGroup=null;
    var UIGroup=null;
    
    var tweenTiempo
    var clock, timeBar,tweenTiempo;
    var emitter;
    var choices=[
        1,
        2,
        3  
    ];
    var lvl2Active;
    var graphics;
    var itsCorrect;
    var timer;

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
        btnChoosed=-1;
        timeForEvent=2000;
        moreDificult=0;
        game.stage.backgroundColor = "#6666ee";
        lives = 3
        startTiming=500;
        delayDefault=100;
        canChoose=true;
        delayerTimer=2500;
        fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        listofActionsEN = [
          ["taking", "eating", "walking"],
          ["washing","eating" , "brushing"],
          ["combing","walking", "warming"],
          ["brushing", "walking","watching"]
        ];
        listofActionsES = [
          ["bañando", "vistiendo", "comiendo"],
          ["lavando","jugando" , "frotando"],
          ["peinando","mojando", "secando"],
          ["cepillando", "divirtiendo","saltando"]
        ];
        listofActionsESAlternative = [
          ["bañando", "bañara", "bañaba"],
          ["lavando","lavará" , "lavaba"],
          ["peinando","peinaba", "peinará"],
          ["cepillando", "cepilla","cepillará"]
        ];
        listofActionsENAlternative = [
          ["taking", "took", "take"],
          ["washing","wash" , "washed"],
          ["combing","combed", "comb"],
          ["brushing", "brushed","brush"]
        ];
        staticPhraseES="Oof se está";
        staticPhraseEN="Oof is";
        staticPhraseENSpecial="Oof is";
        staticPhraseEndingES=[
            "",
            "las manos.",
            "el cabello.",
            "los dientes."
        ];
        staticPhraseEndingEN=[
            "a bath.",
            "his hands.",
            "his hair.",
            "his teeth."
        ];
        randomAction=0;
        randomWords=0;
        correctChoicesEN= [
            "taking",
            "washing",
            "combing",
            "brushing"
        ];
        correctChoicesES= [
            "bañando",
            "lavando",
            "peinando",
            "cepillando"
        ];
        selectedChoice=null;
        oofsActions=[
            "bathing",
            "cleaning",
            "combing",
            "washing"
        ];
        skin="normal";
        passingLevel=false;
        lvl2Active=false;
        actionInBox="¿?";
        maxValue=2;
        minValue=0;
        choices=[
            0,
            1,
            2
        ];
        itsCorrect=false;
        emitter="";
        timer=12000;
        loadSounds()
	}
    
    function generateRandomTextandOrder(){
        if(pointsBar.text._text==3)lvl2Active=true;
        if(pointsBar.text._text>=6){
                    moreDificult=game.rnd.integerInRange(0,1);
                    if(moreDificult==0){
                        lvl2Active=false;
                    }else{
                        lvl2Active=true;
                    }
                }
        randomAction=game.rnd.integerInRange(minValue,3);
        for(var startPositions=0; startPositions<maxValue+1; startPositions){
            randomWords=game.rnd.integerInRange(minValue,maxValue);
            if(choices[randomWords]!=-1){
                
                
                if(!lvl2Active){
                    if(localization.getLanguage()=="EN"){
                        if(startPositions==0)text1.text=listofActionsES[randomAction][choices[randomWords]];
                        if(startPositions==1)text2.text=listofActionsES[randomAction][choices[randomWords]];
                        if(startPositions==2)text3.text=listofActionsES[randomAction][choices[randomWords]];   
                    }else if(localization.getLanguage()=="ES"){
                        if(startPositions==0)text1.text=listofActionsEN[randomAction][choices[randomWords]];
                        if(startPositions==1)text2.text=listofActionsEN[randomAction][choices[randomWords]];
                        if(startPositions==2)text3.text=listofActionsEN[randomAction][choices[randomWords]];   
                    }
                }else{
                    if(localization.getLanguage()=="EN"){
                        if(startPositions==0)text1.text=listofActionsESAlternative[randomAction][choices[randomWords]];
                        if(startPositions==1)text2.text=listofActionsESAlternative[randomAction][choices[randomWords]];
                        if(startPositions==2)text3.text=listofActionsESAlternative[randomAction][choices[randomWords]];   
                    }else if(localization.getLanguage()=="ES"){
                        if(startPositions==0)text1.text=listofActionsENAlternative[randomAction][choices[randomWords]];
                        if(startPositions==1)text2.text=listofActionsENAlternative[randomAction][choices[randomWords]];
                        if(startPositions==2)text3.text=listofActionsENAlternative[randomAction][choices[randomWords]];   
                    }
                }
                choices[randomWords]=-1;
                startPositions++;
            }
        }
        for(var resetValues=0; resetValues<choices.length; resetValues++){
            choices[resetValues]=resetValues;
        }
        prepareScenario();
        if(tutoLvl1 && (pointsBar.text._text==0)){
            startTutorial();
            if(pointsBar.text._text==3)tutoLvl1=false;
        }else{
            hand.alpha=0;
        }
        
    }
    
    function startTutorial(){
            
        if(localization.getLanguage()=="EN"){
            if(text1.text==correctChoicesES[randomAction]){
                hand.x=btn1.centerX+30;
                hand.y=btn1.centerY+30;
            }
            if(text2.text==correctChoicesES[randomAction]){
                hand.x=btn2.centerX+30;
                hand.y=btn2.centerY+30;
            }
            if(text3.text==correctChoicesES[randomAction]){
                hand.x=btn3.centerX+30;
                hand.y=btn3.centerY+30;
            }
        }else{
            if(text1.text==correctChoicesEN[randomAction]){
                hand.x=btn1.centerX+30;
                hand.y=btn1.centerY+30;
            }
            if(text2.text==correctChoicesEN[randomAction]){
                hand.x=btn2.centerX+30;
                hand.y=btn2.centerY+30;
            }
            if(text3.text==correctChoicesEN[randomAction]){
                hand.x=btn3.centerX+30;
                hand.y=btn3.centerY+30;
            }
        }
        hand.alpha=1;    
    }
    
    function prepareScenario(){
        
        
        oof.setAnimationByName(0,oofsActions[randomAction],true);
        textInBoxAnswer.text="¿?";
        if(localization.getLanguage()=="EN"){
            textInBox1Final.text=staticPhraseES;
            textInBox2Final.text=staticPhraseEndingES[randomAction];
        }else{
            textInBox2Final.text=staticPhraseEndingEN[randomAction];
            if(randomAction==0){
                graphics.x=-20;
                textInBox1Final.text=staticPhraseENSpecial;
            }else{
                graphics.x=-20
                textInBox1Final.text=staticPhraseEN;
            }
        }
        
        if(randomAction==0){
            
            sink.alpha=0;
            if(localization.getLanguage()=="EN"){
                textInBoxAnswer.x=textBox.centerX-30;
            }else{
                textInBoxAnswer.x=textBox.centerX-45;
            }
            bath.alpha=1;
            soapOrToothPaste.alpha=0;
            oof.x=game.world.centerX;
            oof.y=game.world.centerY+270;
        }else if(randomAction==1){
            sink.alpha=1;
            bath.alpha=0;
            soapOrToothPaste.loadTexture("atlas.hygiene","soap");
            soapOrToothPaste.alpha=1;
            if(localization.getLanguage()=="EN"){
                textInBoxAnswer.x=textBox.centerX-20;
            }else{
                textInBoxAnswer.x=textBox.centerX-45;
            }
            soapOrToothPaste.y=sink.centerY-50;
            oof.x=game.world.centerX-100;
            oof.y=game.world.centerY+330;
        }else if(randomAction==2){
            sink.alpha=1;
            bath.alpha=0;
            soapOrToothPaste.loadTexture("atlas.hygiene","soap");
            soapOrToothPaste.alpha=1;
            soapOrToothPaste.y=sink.centerY-50;
            if(localization.getLanguage()=="EN"){
                textInBoxAnswer.x=textBox.centerX-20;
            }else{
                textInBoxAnswer.x=textBox.centerX-45;
            }
            oof.x=game.world.centerX-100;
            oof.y=game.world.centerY+330;
        }else if(randomAction==3){
            sink.alpha=1;
            bath.alpha=0;
            soapOrToothPaste.loadTexture("atlas.hygiene","cipishi");
            soapOrToothPaste.alpha=1;
            soapOrToothPaste.y=sink.centerY-70;
            if(localization.getLanguage()=="EN"){
                textInBoxAnswer.x=textBox.centerX-30;
            }else{
                textInBoxAnswer.x=textBox.centerX-45;
            }
            oof.x=game.world.centerX-100;
            oof.y=game.world.centerY+330;
        }
    }
    
    function selectOption(obj){
        if(!canChoose){
            if(obj.tag==="btn1"){
                btn1.loadTexture("atlas.hygiene","press");
                sound.play("pop");
            }else if(obj.tag==="btn2"){
                btn2.loadTexture("atlas.hygiene","press");  
                sound.play("pop");
            }else if(obj.tag==="btn3"){
                btn3.loadTexture("atlas.hygiene","press");  
                sound.play("pop");
            }
        }
    }
    
    function releaseOption(obj){
        if(!canChoose){
            
            if(obj.tag==="btn1"){
                btn1.loadTexture("atlas.hygiene","unpressed");
                textInBoxAnswer.text=text1.text;
                textInBoxAnswer.x=textInBoxAnswer.x-50;
                btnChoosed=1;
            }else if(obj.tag==="btn2"){
                btn2.loadTexture("atlas.hygiene","unpressed");
                textInBoxAnswer.text=text2.text;
                textInBoxAnswer.x=textInBoxAnswer.x-50;
                btnChoosed=2;
            }else if(obj.tag==="btn3"){
                btn3.loadTexture("atlas.hygiene","unpressed");
                textInBoxAnswer.text=text3.text;
                textInBoxAnswer.x=textInBoxAnswer.x-50;
                btnChoosed=3;
            }
            canChoose=true;
            hand.alpha=0;
            if(pointsBar.text._text>=6)stopTimer();
            checkIfCorrect();
            
        }
    }
    
    function checkIfCorrect(){
            
        if(localization.getLanguage()=="EN"){
            if(textInBoxAnswer.text==correctChoicesES[randomAction]){
                game.time.events.add(timeForEvent-400,function(){
                    textInBox1Final.tint=0x00ff00;
                    game.time.events.add(timeForEvent-400,function(){
                        if(randomAction!=0){
                            textInBox2Final.tint=0x00ff00;
                            game.time.events.add(timeForEvent-400,function(){
                                textInBoxAnswer.tint=0x00ff00;
                                Coin(textInBoxAnswer,pointsBar,delayDefault);
                                reset()
                            })
                        }else{
                            textInBoxAnswer.tint=0x00ff00;
                            Coin(textInBoxAnswer,pointsBar,delayDefault);
                            reset()
                        }
                    })
                })        
                itsCorrect=true;
            }
        }else{
            if(textInBoxAnswer.text==correctChoicesEN[randomAction]){
                game.time.events.add(timeForEvent-400,function(){
                    textInBox1Final.tint=0x00ff00;
                    game.time.events.add(timeForEvent-400,function(){
                        textInBox2Final.tint=0x00ff00;
                        game.time.events.add(timeForEvent-400,function(){
                            textInBoxAnswer.tint=0x00ff00;
                            Coin(textInBoxAnswer,pointsBar,delayDefault);
                            reset()
                        })                
                    })
                })
                itsCorrect=true;
            }
        }   
        if(!itsCorrect){
            if(btnChoosed==-1){
                textInBox1Final.tint=0x00ff00;
                game.time.events.add(timeForEvent-400,function(){
                    textInBox2Final.tint=0x00ff00;
                    if(randomAction!=0 || localization.getLanguage()=="ES"){
                        textInBox2Final.tint=0x00ff00;
                        game.time.events.add(timeForEvent-400,function(){
                            textInBoxAnswer.tint=0xff0000;
                            if(localization.getLanguage()=="EN"){
                                textInBoxAnswer.text=correctChoicesES[randomAction];
                                textInBoxAnswer.x=textInBoxAnswer.x-50;
                            }else{
                                textInBoxAnswer.text=correctChoicesEN[randomAction];
                                textInBoxAnswer.x=textInBoxAnswer.x-50;
                            }
                            missPoint()
                            reset()
                        })
                    }else if(randomAction==0){
                        textInBoxAnswer.tint=0xff0000;
                        if(localization.getLanguage()=="EN"){
                            textInBoxAnswer.text=correctChoicesES[randomAction];
                            textInBoxAnswer.x=textInBoxAnswer.x-50;
                        }else{
                            textInBoxAnswer.text=correctChoicesEN[randomAction];
                            textInBoxAnswer.x=textInBoxAnswer.x-50;
                        }
                        missPoint()
                        reset()
                    }
                })
            }
            if(btnChoosed==1){
                game.add.tween(text1).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3)
                game.add.tween(btn1).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3).onComplete.add(function(){
                    game.add.tween(text1).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3)
                    game.add.tween(btn1).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3).onComplete.add(function(){
                        game.add.tween(text1).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3)
                        game.add.tween(btn1).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3).onComplete.add(function(){
                            game.add.tween(text1).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3)
                                game.add.tween(btn1).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/3).onComplete.add(function(){
                                    game.add.tween(btn1).to({angle: 0}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming*2);
                                    game.add.tween(text1).to({angle: 0}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming*2)
                                    game.time.events.add(timeForEvent-400,function(){
                                        textInBox1Final.tint=0x00ff00;
                                        game.time.events.add(timeForEvent-400,function(){
                                            if(randomAction!=0){
                                                textInBox2Final.tint=0x00ff00;
                                                game.time.events.add(timeForEvent-400,function(){
                                                    textInBoxAnswer.tint=0xff0000;
                                                    if(localization.getLanguage()=="EN"){
                                                        textInBoxAnswer.text=correctChoicesES[randomAction];
                                                    }else{
                                                        textInBoxAnswer.text=correctChoicesEN[randomAction];
                                                    }
                                                    missPoint()
                                                    reset()
                                                })
                                            }else{
                                                textInBoxAnswer.tint=0xff0000;
                                                if(localization.getLanguage()=="EN"){
                                                    textInBoxAnswer.text=correctChoicesES[randomAction];
                                                }else{
                                                    textInBoxAnswer.text=correctChoicesEN[randomAction];
                                                }
                                                missPoint()
                                                reset()
                                            }

                                        })
                                    })
                            })
                        })
                    })
                })
                    
            }
            if(btnChoosed==2){
                game.add.tween(text2).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                game.add.tween(btn2).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                    game.add.tween(text2).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                    game.add.tween(btn2).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                        game.add.tween(text2).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                        game.add.tween(btn2).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                            game.add.tween(text2).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                            game.add.tween(btn2).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                                game.add.tween(btn2).to({angle: 0}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming*2);
                                game.add.tween(text2).to({angle: 0}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming*2)
                                game.time.events.add(timeForEvent-400,function(){
                                            textInBox1Final.tint=0x00ff00;
                                            game.time.events.add(timeForEvent-400,function(){
                                                if(randomAction!=0){
                                                    textInBox2Final.tint=0x00ff00;
                                                game.time.events.add(timeForEvent-400,function(){
                                                    textInBoxAnswer.tint=0xff0000;
                                                    if(localization.getLanguage()=="EN"){
                                                        textInBoxAnswer.text=correctChoicesES[randomAction];
                                                    }else{
                                                        textInBoxAnswer.text=correctChoicesEN[randomAction];
                                                    }
                                                        missPoint()
                                                        reset()
                                                })
                                            }else{
                                                textInBoxAnswer.tint=0xff0000;
                                                if(localization.getLanguage()=="EN"){
                                                    textInBoxAnswer.text=correctChoicesES[randomAction];
                                                }else{
                                                    textInBoxAnswer.text=correctChoicesEN[randomAction];
                                                }
                                                    missPoint()
                                                    reset()
                                            }
                                    })
                                })
                            })
                        })
                    })
                })
            }
            if(btnChoosed==3){
                game.add.tween(text3).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                game.add.tween(btn3).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                    game.add.tween(text3).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                    game.add.tween(btn3).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                        game.add.tween(text3).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                        game.add.tween(btn3).to({angle: 20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                            game.add.tween(text3).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                            game.add.tween(btn3).to({angle: -20}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2).onComplete.add(function(){
                                game.add.tween(btn3).to({angle: 0}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2);
                                game.add.tween(text3).to({angle: 0}, delayDefault, Phaser.Easing.Linear.Out, true, startTiming/2)
                                game.time.events.add(timeForEvent-400,function(){
                                    textInBox1Final.tint=0x00ff00;
                                    game.time.events.add(timeForEvent-400,function(){
                                        if(randomAction!=0){
                                            textInBox2Final.tint=0x00ff00;
                                            game.time.events.add(timeForEvent-400,function(){
                                                textInBoxAnswer.tint=0xff0000;
                                                if(localization.getLanguage()=="EN"){
                                                textInBoxAnswer.text=correctChoicesES[randomAction];
                                                }else{
                                                    textInBoxAnswer.text=correctChoicesEN[randomAction];
                                                }
                                                missPoint()
                                                reset()
                                            })
                                        }else{
                                            textInBoxAnswer.tint=0xff0000;
                                            if(localization.getLanguage()=="EN"){
                                                textInBoxAnswer.text=correctChoicesES[randomAction];
                                            }else{
                                                textInBoxAnswer.text=correctChoicesEN[randomAction];
                                            }
                                            missPoint()
                                            reset()
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            }
            
        }
    }

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        generateRandomTextandOrder();
        game.add.tween(bathCourtain.scale).to({x:0,y:1}, delayDefault*3.5, Phaser.Easing.Linear.Out, true, startTiming*2).onComplete.add(function(){
            canChoose=false;
        });
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)
        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
        
    }
    
    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function missPoint(){
        
        sound.play("wrong",{loop:false, volume:2})
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false);
        }
        
        addNumberPart(heartsGroup.text,'-1',true);
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.hygiene','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.hygiene','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        
        
        
        
        baseSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){		
        game.stage.disableVisibilityChange = false;
        epicparticles.loadEmitter(game.load, "pickedEnergy") 
    }
    
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        backgroundGroup = game.add.group();
        sceneGroup.add(backgroundGroup);
        
        characterGroup=game.add.group();
        sceneGroup.add(characterGroup);
        
        UIGroup = game.add.group();
        sceneGroup.add(UIGroup);
        
        wallUpper=game.add.tileSprite(0,0,game.world.width,game.world.width, "tileWallUpper");
        wallBottom=game.add.tileSprite(0,game.world.centerY,game.world.width,game.world.height/3, "tileWallBottom");
        floor=game.add.tileSprite(0,game.world.centerY+300,game.world.width,game.world.height, "tileFloor");
        
        backgroundGroup.add(wallUpper);
        backgroundGroup.add(wallBottom);
        backgroundGroup.add(floor);
        
        ornaments=game.add.sprite(0,0,"atlas.hygiene","adornos");
        ornaments.anchor.setTo(0.5,0.5);
        ornaments.x=game.world.centerX;
        ornaments.y=game.world.centerY-250;
        backgroundGroup.add(ornaments);
        
        btn1=game.add.sprite(0,0,"atlas.hygiene","unpressed");
        btn1.anchor.setTo(0.5,0.5);
        btn1.x=game.world.centerX-200;
        btn1.y=game.world.centerY+400;
        backgroundGroup.add(btn1);
        
        btn2=game.add.sprite(0,0,"atlas.hygiene","unpressed");
        btn2.anchor.setTo(0.5,0.5);
        btn2.x=game.world.centerX;
        btn2.y=game.world.centerY+400;
        backgroundGroup.add(btn2);
        
        btn3=game.add.sprite(0,0,"atlas.hygiene","unpressed");
        btn3.anchor.setTo(0.5,0.5);
        btn3.x=game.world.centerX+200;
        btn3.y=game.world.centerY+400;
        backgroundGroup.add(btn3);
        
        btn1.inputEnabled=true;
        btn2.inputEnabled=true;
        btn3.inputEnabled=true;
        
        btn1.tag="btn1";
        btn2.tag="btn2";
        btn3.tag="btn3";
        
        oof=game.add.spine(game.world.centerX-100,game.world.centerY+330,"oof");
        oof.setSkinByName(skin);
        oof.setAnimationByName(0,oofsActions[0],true);
        characterGroup.add(oof)
        
        sink=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.hygiene","lavabo");
        sink.anchor.setTo(0.5,0.5);
        backgroundGroup.add(sink);
        
        bath=game.add.sprite(game.world.centerX,game.world.centerY+100,"atlas.hygiene","tina");
        bath.anchor.setTo(0.5,0.5);
        characterGroup.add(bath);
        
        bath.alpha=0;
        
        textBox=game.add.sprite(game.world.centerX, game.world.centerY-300,"atlas.hygiene","cuadro");
        textBox.anchor.setTo(0.5,0.5);
        textBox.scale.setTo(1.2,0.7);
        
        backgroundGroup.add(textBox);
        
        soapOrToothPaste=game.add.sprite(sink.centerX+80,sink.centerY-50,"atlas.hygiene","soap");
        soapOrToothPaste.anchor.setTo(0.5,0.5);
        backgroundGroup.add(soapOrToothPaste);
        
        soapOrToothPaste.loadTexture("atlas.hygiene","soap");
        var line = new Phaser.Line(textBox.centerX-100,textBox.centerY+15, textBox.centerX+70, textBox.centerY+15);
        graphics=game.add.graphics(0,0);
        graphics.lineStyle(5, 0xffffff, 1);
        graphics.moveTo(line.start.x,line.start.y);
        graphics.lineTo(line.end.x,line.end.y);
        graphics.endFill();
        backgroundGroup.add(graphics)
        if(localization.getLanguage()=="EN"){
            text1=game.add.text(btn1.centerX, btn1.centerY, listofActionsES[0][0], fontStyle);
            text2=game.add.text(btn2.centerX, btn2.centerY, listofActionsES[0][1], fontStyle);
            text3=game.add.text(btn3.centerX, btn3.centerY, listofActionsES[0][2], fontStyle);
            textInBox1Final=game.add.text(textBox.centerX-240, textBox.centerY-15, staticPhraseES, fontStyle);
            textInBox2Final=game.add.text(textBox.centerX+90, textBox.centerY-15, staticPhraseEndingES[0], fontStyle);
            textInBoxAnswer=game.add.text(textBox.centerX-30, textBox.centerY-20, "¿?", fontStyle);
            textInBoxAnswer.scale.setTo(0.9,0.9);
            textInBox1Final.scale.setTo(0.8,0.8);
            textInBox2Final.scale.setTo(0.8,0.8);
            text1.scale.setTo(0.7,0.7);
            text2.scale.setTo(0.7,0.7);
            text3.scale.setTo(0.7,0.7);
        }else{
            graphics.x=-20
            text1=game.add.text(btn1.centerX, btn1.centerY, listofActionsEN[0][0], fontStyle);
            text2=game.add.text(btn2.centerX, btn2.centerY, listofActionsEN[0][1], fontStyle);
            text3=game.add.text(btn3.centerX, btn3.centerY, listofActionsEN[0][2], fontStyle);
            textInBox1Final=game.add.text(textBox.centerX-200, textBox.centerY-15, staticPhraseEN, fontStyle);
            textInBox2Final=game.add.text(textBox.centerX+70, textBox.centerY-15, staticPhraseEndingEN[0], fontStyle);
            textInBoxAnswer=game.add.text(textBox.centerX-50, textBox.centerY-25, "¿?", fontStyle);
            textInBoxAnswer.scale.setTo(0.9,0.98);
            textInBox1Final.scale.setTo(0.8,0.8);
            textInBox2Final.scale.setTo(0.8,0.8);
            text1.scale.setTo(0.8,0.8);
            text2.scale.setTo(0.8,0.8);
            text3.scale.setTo(0.8,0.8);
        }
        
        text1.anchor.setTo(0.5,0.5);
        text2.anchor.setTo(0.5,0.5);
        text3.anchor.setTo(0.5,0.5);
        
        text1.scale.setTo(0.8,0.8);
        text2.scale.setTo(0.8,0.8);
        text3.scale.setTo(0.8,0.8);
        
        text1.tint=0x1F635A;
        text2.tint=0x1F635A;
        text3.tint=0x1F635A;
        
        
        backgroundGroup.add(text1);    
        backgroundGroup.add(text2);    
        backgroundGroup.add(text3);    
        backgroundGroup.add(textInBox1Final);    
        backgroundGroup.add(textInBox2Final);    
        backgroundGroup.add(textInBoxAnswer);    
        
        
        btn1.events.onInputDown.add(selectOption,this);
        btn1.events.onInputUp.add(releaseOption,this);
        btn2.events.onInputDown.add(selectOption,this);
        btn2.events.onInputUp.add(releaseOption,this);
        btn3.events.onInputDown.add(selectOption,this);
        btn3.events.onInputUp.add(releaseOption,this);
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        positionTimer();
        
        bathCourtain=game.add.sprite(game.world.centerX-288,game.world.centerY,"atlas.hygiene","cortina_1");
        bathCourtain.scale.setTo(1.1,1);
        bathCourtain.anchor.setTo(0,0.5);
        bathCourtain.alpha=1;
        UIGroup.add(bathCourtain);
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        hand=game.add.sprite(game.world.centerX,game.world.centerY, "hand")
        hand.anchor.setTo(0.5,0.5);
        hand.scale.setTo(1,1);
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha=1;
        backgroundGroup.add(hand);
        
    }
	function render() {
        game.debug.geom(line);
    }

    function Coin(objectBorn,objectDestiny,time){
        
        
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        
        emitter = epicparticles.newEmitter("pickedEnergy")
        emitter.duration=0.05;
        emitter.x = coins.x
        emitter.y = coins.y
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX;
                coins.y=objectBorn.centerY;
                addPoint(1);
                if(pointsBar.text._text==6){
                    timeBar.alpha=1;
                    clock.alpha=1;
                }else if(pointsBar.text._text>3){
                    timer-=200;
                }
            })
        })
    }
	function update(){
        if(startGame){
            epicparticles.update();   
        }
	}
    function reset(){
        itsCorrect=false;
        btnChoosed=-1;
        bathCourtain.alpha=1;
        game.add.tween(bathCourtain.scale).to({x:1.1,y:1}, delayDefault*3.5, Phaser.Easing.Linear.Out, true, startTiming*2).onComplete.add(function(){
            generateRandomTextandOrder();
            textInBox1Final.tint=0xffffff;
            textInBox2Final.tint=0xffffff;
            textInBoxAnswer.tint=0xffffff;
            game.add.tween(bathCourtain.scale).to({x:0,y:1}, delayDefault*3.5, Phaser.Easing.Linear.Out, true, startTiming*2).onComplete.add(function(){
                if(pointsBar.text._text>=6)startTimer(timer);
                canChoose=false;
                
            })
        })
        
            
    }
    
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text');
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function positionTimer(){
        clock=game.add.image(game.world.centerX-150,50,"atlas.time","clock")
        clock.scale.setTo(.7)
        timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
        timeBar.scale.setTo(8,.45)
        timeBar.alpha=0;
        clock.alpha=0;
        backgroundGroup.add(clock)
        backgroundGroup.add(timeBar)
        UIGroup.add(clock);
        UIGroup.add(timeBar);
    }
    function stopTimer(){
        tweenTiempo.stop()
        canChoose=true;
        tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, startTiming, Phaser.Easing.Linear.Out, true, delayDefault).onComplete.add(function(){
        })
    }
    function startTimer(time){
        tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, delayDefault)
        tweenTiempo.onComplete.add(function(){
            stopTimer()
            game.time.events.add(delayerTimer,function(){
                checkIfCorrect();
            });
        })
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(!particle.used && particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
				                
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            
            obj.used = false
            
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.hygiene',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.hygiene',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
        
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',3)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.hygiene','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.hygiene','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	return {
		
		assets: assets,
		name: "hygienePlus",
        preload:preload,
        update:update,
		getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
            create: function(event){
            
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
            
                        			
            baseSong = game.add.audio('acornSong')
            game.sound.setDecodedCallback(baseSong, function(){
                baseSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
            
			            
			createPointsBar()
			createHearts()
            createTutorial()
			
			buttons.getButton(baseSong,sceneGroup)
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()