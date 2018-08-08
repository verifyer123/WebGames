var soundsPath = '../../shared/minigames/sounds/'
var cuentaContactos = function(){
    assets = {
        atlases: [
            {   
                name: "atlas.contactos",
                json: "images/contactos/atlas.json",
                image: "images/contactos/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/contactos/timeAtlas.json",
                image: "images/contactos/timeAtlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "splash",
				file: soundsPath + "splash.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
			{	name: "okTut",
				file: soundsPath + "pop.mp3"},
            {	name: "click",
				file: soundsPath + "cog.mp3"},
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 820
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 0
    
    var gameIndex = 3
    var skullTrue = false
    var marioSong = null
    var enemyNames = null
    var consecFloor, consecBricks
    var gameStart = false
    var jumping = false
    var lastOne = null
    var yAxis = null
    var objToCheck
    var gameSpeed = null
    var objectsList = null
    var pivotObjects
    var particlesGroup
    var correctParticle = new Array(10)
    var wrongParticle = new Array(10)
    var particlesUsed
    var player
	var sceneGroup = null
    var groundGroup = null
    var answersGroup = null
    var pointsGroup = null
    var gameActive = null
    var jumpTimer = 0
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var skinTable
    var heartsGroup = null 
    var groupButton = null
	var reviewComic = false
	var back1,back2
	var btn1, btn2, btn_ok
	var counter, correctCount, randBack, dificulty, canPlay
    var dinamita
	
	var enchufes=new Array(10)
	var enchufesVista=new Array(10)
	var tapaEnchufes=new Array(10)
	var bichitos=new Array(10)
	
	var b1PositionX=new Array(10)
	var b2PositionX=new Array(10)
	var b3PositionX= new Array(10)
	
	var b1PositionY=new Array(10)
	var b2PositionY=new Array(10)
	var b3PositionY= new Array(10)
	
	var hidePositions1X= new Array(3)
	var hidePositions1Y= new Array(3)
	var hidePositions2X= new Array(2)
	var hidePositions2Y= new Array(2)
	var hidePositions3X= new Array(2)
	var hidePositions3Y= new Array(2)
    
    var correct, correctOnes, timedhides
    
    var cortina
    var timer
    var scaleSpine=1
    
    var clock,timeBar,tweenTiempo
	
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
	function initialize(){
        enemyNames = ['coin']
        gameStart = false
        skullTrue = false
		counter=0
        dificulty=5
        timer=400
		correctCount=0
        canPlay=false
        gameSpeed =  SPEED
        lastOne = null
        game.stage.backgroundColor = "#ffffff"
        jumpTimer = 0
        gameActive = false
        lives = 3
        pivotObjects = 0
        objToCheck = null
        buttonPressed = false
        tooMuch = false
        GRAVITY_OBJECTS = 4
        yAxis = p2.vec2.fromValues(0, 1);
        objectsList = []
        consecFloor = 0
        consecBricks = 0
        skinTable = []
        timedhides=3200
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
        //timer.start()
        //game.time.events.add(throwTime *0.1, dropObjects , this);
        //objectsGroup.timer.start()
        //game.time.events.add(TIME_ADD, addObjects , this);
        //gameStart = true

    }
    
    
    function preload() {
        game.stage.disableVisibilityChange = false;


        game.load.spine('dinamita', "images/spines/dinamita.json");
        
        game.load.spritesheet("bichito", 'images/contactos/bichitos.png', 193, 213, 24)
		
		game.load.image('howTo',"images/contactos/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/contactos/tutorial/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/contactos/tutorial/introscreen.png")
		
		game.load.image('comic1',"images/comic/1.png");
        game.load.image('comic2',"images/comic/2.png");
        game.load.image('comic3',"images/comic/3.png");
        game.load.image('comic4',"images/comic/4.png");
	
		game.load.audio('marioSong', soundsPath + 'songs/dancing_baby.mp3');
		
    }
	function createComic(totalPages){
        var comicGroup = game.add.group();
        var comicrect = new Phaser.Graphics(game)
        comicrect.beginFill(0x131033)
        comicrect.drawRect(0,0,game.world.width *2, game.world.height *2);
        comicrect.alpha = 1;
        comicrect.endFill();
        comicrect.inputEnabled = true;
        comicGroup.add(comicrect);
        var arrayComic = new Array;
        
        for(var i= totalPages-1;i>=0;i--){
            arrayComic[i] = comicGroup.create(0,0,"comic" + [i+1]);
            arrayComic[i].x = game.world.centerX;
            arrayComic[i].anchor.setTo(0.5,0);
        }
        var counterPage = 0;
        var button1 = new Phaser.Graphics(game);
        button1.beginFill(0xaaff95);
        button1.alpha = 0;
        button1.drawRect(0,0,100, 70);
        button1.x = game.world.centerX - 50;
        button1.y = game.height - button1.height*1.4;
        button1.endFill();
        button1.inputEnabled = true;
        comicGroup.add(button1); 
        var button2 = new Phaser.Graphics(game);
        button2.beginFill(0xaaff95);
        button2.alpha = 0;
        button2.drawRect(0,0,100, 70);
        button2.x = game.world.centerX - button2.width*1.1;
        button2.y = game.height - button2.height*1.4;
        button2.endFill();
        button2.inputEnabled = true;
        comicGroup.add(button2);
        button2.visible = false;
        button1.events.onInputDown.add(function(){
            sound.play("okTut");
            arrayComic[counterPage].alpha = 0;
            counterPage++;
                if(counterPage == 1){
                    button2.visible = true;
                    button1.x = button1.x + button1.width/1.5;
                }else{
                    if(counterPage == totalPages-1){
                        button2.visible = false;
                        button1.x = game.world.centerX - 50;
                        }else if(counterPage > totalPages-1){
							createOverlay();
                        game.add.tween(comicGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                                comicGroup.y = -game.world.height
                 
                                comicGroup.visible = false;
                                reviewComic = true;
                        });
                        }
                }  
        },this);        
        button2.events.onInputDown.add(function(){
            sound.play("okTut");
            counterPage--;
            arrayComic[counterPage].alpha = 1;
                if(counterPage == 0){
                    button2.visible = false;
                    button1.x = game.world.centerX - 50;
                }
        },this);
        
        sceneGroup.add(comicGroup);
    }
    
    function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        //sound.play("click")
        
        if(buddy.isRunning == true){
            if (checkIfCanJump())
            {
                groupButton.isPressed = true
                jumping = true
                doJump()
            }
        }
        
    }
    
    function releaseButton(obj){
        
        groupButton.isPressed = false
        jumping = false
    }
    
    function createControls(){
        
		groupButton = game.add.group()
		sceneGroup.add(groupButton)
		
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0
        rect.endFill()
        rect.inputEnabled = true
		rect.events.onInputDown.add(inputButton)
		rect.events.onInputUp.add(releaseButton)
		groupButton.add(rect)
        
    }
	
	function createOverlay(){
        
		whiteFade = new Phaser.Graphics(game)
		whiteFade.beginFill(0xffffff)
		whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
		whiteFade.alpha = 0
		whiteFade.endFill()
		sceneGroup.add(whiteFade)
			
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("okTut")
			
			
			//Primer Baño
            dinamita.setAnimationByName(0,"IDLE",true);
		
			var ocultObject1b1= game.add.sprite(game.world.centerX-110,game.world.centerY-190,"atlas.contactos", "baño")
			var ocultObject2b1= game.add.sprite(game.world.centerX-100,game.world.centerY-480,"atlas.contactos", "persiana")
			ocultObject2b1.scale.setTo(1.2)
			var ocultObject3b1= game.add.sprite(game.world.centerX+130,game.world.centerY-80,"atlas.contactos", "papel")
			
			bathroomGroup1.add(ocultObject1b1)
			bathroomGroup1.add(ocultObject2b1)
			bathroomGroup1.add(ocultObject3b1)
			
			bathroomGroup1.alpha=0
			//Segundo Baño
			
			var ocultObject1b2= game.add.sprite(game.world.centerX-105,game.world.centerY-430,"atlas.contactos", "espejo")
			var ocultObject2b2= game.add.sprite(game.world.centerX-150,game.world.centerY-80,"atlas.contactos", "lavabo")
			var ocultObject3b2= game.add.sprite(game.world.centerX-310,game.world.centerY-210,"atlas.contactos", "adorno1")
			var ornament1b2= game.add.sprite(game.world.centerX-250,game.world.centerY-110,"atlas.contactos", "adorno3")
			var ornament2b2= game.add.sprite(game.world.centerX+150,game.world.centerY-380,"atlas.contactos", "luz_izq")
			
			bathroomGroup2.add(ocultObject1b2)
			bathroomGroup2.add(ocultObject2b2)
			bathroomGroup2.add(ocultObject3b2)
			bathroomGroup2.add(ornament1b2)
			bathroomGroup2.add(ornament2b2)
			
			bathroomGroup2.alpha=0
			// Tercer Baño
			
			var ocultObject1b3= game.add.sprite(game.world.centerX-210,game.world.centerY-250,"atlas.contactos", "tina")
			var ocultObject2b3= game.add.sprite(game.world.centerX-220,game.world.centerY-320,"atlas.contactos", "cortina")
			var ocultObject3b3= game.add.sprite(game.world.centerX-30,game.world.centerY-100,"atlas.contactos", "adorno2")
			var ornament1b3= game.add.sprite(game.world.centerX-300,game.world.centerY-360,"atlas.contactos", "luz_der")
			
			bathroomGroup3.add(ocultObject1b3)
			bathroomGroup3.add(ocultObject2b3)
			bathroomGroup3.add(ocultObject3b3)
			bathroomGroup3.add(ornament1b3)
			bathroomGroup3.alpha=1
			
			
			//Aqui termina el acomodo de los baños (brrrrr hace frio)
			
			//Aqui se pone la barra de donde iran los botones y el contador
			
			var backBar= game.add.sprite(0,game.world.height-160,"atlas.contactos", "barra")
			backBar.width=game.world.width
			backBar.height=160
			
				
			randBack=game.rnd.integerInRange(0,2)
			
			if(randBack==0){
				bathroomGroup1.alpha=1
				bathroomGroup2.alpha=0
				bathroomGroup3.alpha=0
                dinamita.position.x=game.world.centerX
                dinamita.position.y=game.world.centerY+300
			}else if(randBack==1){
				bathroomGroup1.alpha=0
				bathroomGroup2.alpha=1
				bathroomGroup3.alpha=0
                dinamita.position.x=game.world.centerX+100
                dinamita.position.y=game.world.centerY+300
			}else if(randBack==2){
				bathroomGroup1.alpha=0
				bathroomGroup2.alpha=0
				bathroomGroup3.alpha=1
                dinamita.position.x=game.world.centerX-100
                dinamita.position.y=game.world.centerY+300
			}
        
			
			btn1= game.add.sprite(backBar.centerX-35,backBar.y+35,"atlas.contactos", "mas")
			btn2= game.add.sprite(backBar.centerX-240,backBar.y+35,"atlas.contactos", "menos")
			btn_ok= game.add.sprite(backBar.centerX+100,backBar.y+35,"atlas.contactos", "ok")
			btn1.tag="mas"
			btn2.tag="menos"
			btn_ok.tag="ok"
			btn1.inputEnabled=true
			btn2.inputEnabled=true
			btn_ok.inputEnabled=true
			btn1.events.onInputDown.add(onClick,this)
			btn2.events.onInputDown.add(onClick,this)
			btn_ok.events.onInputDown.add(onClick,this)
            btn1.events.onInputUp.add(onRelease,this)
			btn2.events.onInputUp.add(onRelease,this)
			btn_ok.events.onInputUp.add(onRelease,this)
			
			var table= game.add.sprite(backBar.centerX-170,backBar.y+20,"atlas.contactos", "contador")
			
			UIGroup.add(backBar)
			UIGroup.add(btn1)
			UIGroup.add(btn2)
			UIGroup.add(btn_ok)
			UIGroup.add(table)
			
			
			var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var countText = new Phaser.Text(UIGroup.game, 0, 10, "0", fontStyle)
			countText.x = table.x+40
			countText.y = table.y+23
			countText.setText(counter)
			UIGroup.add(countText)
        
			
			UIGroup.text = countText
			UIGroup.text.setText("0"+counter)
			
            positionTimer();
			fillObjects();
			positionContacts();
            howMany();
			
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
				
				overlayGroup.y = -game.world.height
				gameActive = true
				gameStart = true
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.contactos','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		var offX = 0
		
		if(game.device.desktop){
			inputName = 'desktop'
			offX = 13
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX + offX,game.world.centerY + 125,'atlas.contactos',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.contactos','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
	function onClick(obj){
		
		if(obj.tag=="mas" && counter<99 && canPlay){
            sound.play("click")
            obj.loadTexture("atlas.contactos","mas_press")
			counter++
			if(counter<10){
			UIGroup.text.setText("0"+counter)
			}else{
			UIGroup.text.setText(counter)
			}
		}
		if(obj.tag=="menos" && counter>0 && canPlay){
            sound.play("click")
            obj.loadTexture("atlas.contactos","menos_press")
			counter--
			if(counter<10){
			UIGroup.text.setText("0"+counter)
			}else{
			UIGroup.text.setText(counter)
			}
		}
		if(obj.tag=="ok" && canPlay){
            sound.play("click")
			obj.loadTexture("atlas.contactos","ok_press")
            
			checkResults()
            
            
            canPlay=false
		}
		
	}
    
    function onRelease(obj){
		
		if(obj.tag=="mas"){
			obj.loadTexture("atlas.contactos","mas")
		}
		if(obj.tag=="menos"){
			obj.loadTexture("atlas.contactos","menos")
		}
		if(obj.tag=="ok"){
			obj.loadTexture("atlas.contactos","ok")
		}
		
	}
	
	function fillObjects(){
		
		for(var a=0; a<10;a++){
			
			enchufes[a]=game.add.sprite(-100,game.world.centerY,"atlas.contactos","contacto")
			//bichitos[a]=
			tapaEnchufes[a]=game.add.sprite(enchufes[a].x+15,enchufes[a].y+13,"atlas.contactos","protectores")
            
			tapaEnchufes[a].alpha=0
			enchufesVista[a]=false
            bichitos[a]=game.add.sprite(enchufes[a].x,enchufes[a].y, "bichito")
            bichitos[a].anchor.setTo(.5)
            bichitos[a].scale.setTo(.5)
            bichitos[a].animations.add('idle');
            bichitos[a].animations.play('idle', 24, true);
            bichitos[a].alpha=0
			contactsGroup.add(enchufes[a])
            contactsGroup.add(tapaEnchufes[a])
		}
        
        for(var c=0;c<10;c++){
            
            contactsGroup.add(bichitos[c])
            
        }
		
	}
	
	function positionContacts(){
		
		//baño1
		if(randBack==0){
			b1PositionX[0]=game.world.centerX-200
			b1PositionY[0]=game.world.centerY
			b1PositionX[1]=game.world.centerX-250
			b1PositionY[1]=game.world.centerY
			b1PositionX[2]=game.world.centerX-200
			b1PositionY[2]=game.world.centerY-300
			b1PositionX[3]=game.world.centerX-250
			b1PositionY[3]=game.world.centerY-100
			b1PositionX[4]=game.world.centerX-200
			b1PositionY[4]=game.world.centerY-390
			b1PositionX[5]=game.world.centerX+150
			b1PositionY[5]=game.world.centerY-200
			b1PositionX[6]=game.world.centerX+200
			b1PositionY[6]=game.world.centerY-400
			b1PositionX[7]=game.world.centerX-230
			b1PositionY[7]=game.world.centerY-200
			b1PositionX[8]=game.world.centerX+200
			b1PositionY[8]=game.world.centerY-280
			b1PositionX[9]=game.world.centerX+130
			b1PositionY[9]=game.world.centerY-290
			
			hidePositions1X[0]=game.world.centerX
			hidePositions1Y[0]=game.world.centerY-400
			hidePositions1X[1]=game.world.centerX
			hidePositions1Y[1]=game.world.centerY
		}
		
		//baño2
		
		if(randBack==1){
			
			b2PositionX[0]=game.world.centerX+200
			b2PositionY[0]=game.world.centerY
			b2PositionX[1]=game.world.centerX+200
			b2PositionY[1]=game.world.centerY-250
			b2PositionX[2]=game.world.centerX+200
			b2PositionY[2]=game.world.centerY-150
			b2PositionX[3]=game.world.centerX-170
			b2PositionY[3]=game.world.centerY-300
			b2PositionX[4]=game.world.centerX-230
			b2PositionY[4]=game.world.centerY-300
			b2PositionX[5]=game.world.centerX-290
			b2PositionY[5]=game.world.centerY-300
			b2PositionX[6]=game.world.centerX-170
			b2PositionY[6]=game.world.centerY-380
			b2PositionX[7]=game.world.centerX-230
			b2PositionY[7]=game.world.centerY-380
			b2PositionX[8]=game.world.centerX-290
			b2PositionY[8]=game.world.centerY-380
			b2PositionX[9]=game.world.centerX-230
			b2PositionY[9]=game.world.centerY+75
			
			hidePositions2X[0]=game.world.centerX
			hidePositions2Y[0]=game.world.centerY+100
			hidePositions2X[1]=game.world.centerX
			hidePositions2Y[1]=game.world.centerY-250
		}
		
		//baño3
		
		if(randBack==2){
			b3PositionX[0]=game.world.centerX
			b3PositionY[0]=game.world.centerY
			b3PositionX[1]=game.world.centerX+70
			b3PositionY[1]=game.world.centerY
			b3PositionX[2]=game.world.centerX+140
			b3PositionY[2]=game.world.centerY
			b3PositionX[3]=game.world.centerX+210
			b3PositionY[3]=game.world.centerY
			b3PositionX[4]=game.world.centerX-270
			b3PositionY[4]=game.world.centerY
			b3PositionX[5]=game.world.centerX+200
			b3PositionY[5]=game.world.centerY-130
			b3PositionX[6]=game.world.centerX-270
			b3PositionY[6]=game.world.centerY-160
			b3PositionX[7]=game.world.centerX
			b3PositionY[7]=game.world.centerY-197
			b3PositionX[8]=game.world.centerX+90
			b3PositionY[8]=game.world.centerY-220
			b3PositionX[9]=game.world.centerX+230
			b3PositionY[9]=game.world.centerY-290
			
			hidePositions3X[0]=game.world.centerX
			hidePositions3Y[0]=game.world.centerY+100
			hidePositions3X[1]=game.world.centerX-150
			hidePositions3Y[1]=game.world.centerY-100
		}
		
		
	}
	
    function checkResults(){
        
        stopTimer()
        var f=minimumC
        var o=minimumC
        
        if(counter!=correctOnes){
            dinamita.setAnimationByName(0,"LOSE",false);
            
        }
        for(var e=minimumC;e<limitC;e++){
            if(randBack==0){
                game.add.tween(enchufes[e]).to({x:b1PositionX[e],y:b1PositionY[e]}, 500 , Phaser.Easing.Linear.In, true, 100)
            }
            if(randBack==1){
                game.add.tween(enchufes[e]).to({x:b2PositionX[e],y:b2PositionY[e]}, 500 , Phaser.Easing.Linear.In, true, 100)
            }
            if(randBack==2){
                game.add.tween(enchufes[e]).to({x:b3PositionX[e],y:b3PositionY[e]}, 500 , Phaser.Easing.Linear.In, true, 100)
            }   
        }
        
       game.time.events.add(1500, function(){
            
            while(o<minimumC+correctOnes){
                
               
                    if(tapaEnchufes[f]!=null && counter==correctOnes){
                            game.add.tween(tapaEnchufes[f]).to({alpha:1}, timer, Phaser.Easing.Cubic.In, true, 100)
                            correctParticle.position.x=enchufes[f].x
                            correctParticle.position.y=enchufes[f].y
                            correctParticle.start(true, 1000, null, 5)
                            game.add.tween(enchufes[f].scale).to({x:1.1, y:1.1}, (timer + 100) * 0.5, Phaser.Easing.Cubic.Out, true).yoyo(true)
                            sound.play("pop")
                            timer+=400
                        f++
                    }
                    if(tapaEnchufes!=null && counter>correctOnes){
                            game.add.tween(bichitos[f]).to({alpha:1}, timer, Phaser.Easing.Cubic.In, true, 100)
                            wrongParticle.position.x=enchufes[f].x+20
                            wrongParticle.position.y=enchufes[f].y
                                wrongParticle.start(true, 4000, null, 2)
                                
                            sound.play("wrongItem")
                            timer+=400
                        f++
                        wrongParticle.start(true, 1000, null, 5)
                    }
                    if(tapaEnchufes[f]!=null && counter<correctOnes){
                            if(f<=counter+minimumC-1){
                                wrongParticle.position.x=enchufes[f].x+20
                                wrongParticle.position.y=enchufes[f].y
                                wrongParticle.start(true, 4000, null, 2)
                                game.add.tween(tapaEnchufes[f]).to({alpha:1}, timer, Phaser.Easing.Cubic.In, true, 100)
                                    

                            }else if(f>counter+minimumC-1){
                                game.add.tween(bichitos[f]).to({alpha:1}, timer, Phaser.Easing.Cubic.In, true, 100)
                                sound.play("wrongItem")
                                wrongParticle.position.x=enchufes[f].x+20
                                wrongParticle.position.y=enchufes[f].y
                                wrongParticle.start(true, 4000, null, 2)
                            }
                            timer+=400
                        f++
                    }
                
                
                o++
            }
        
            timer=200
            game.add.tween(this).to({x:0}, 2500 , Phaser.Easing.Linear.In, true, 200).onComplete.add(function(){
                
                if(counter==correctOnes){
                    correctGame()
                }else{
                    wrongGame()
                }
            })
       })
    }
    
	function reset(){
		
        
        
        
        //game.add.tween(alphaMask).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
        game.add.tween(cortina).to({width:game.world.width+100}, 500, Phaser.Easing.Cubic.Out, true)
        
        game.time.events.add(850, function(){
            
            randBack=game.rnd.integerInRange(0,2)
            counter=0
            if(counter<10){
			UIGroup.text.setText("0"+counter)
			}else{
			UIGroup.text.setText(counter)
			}
			
            dinamita.setAnimationByName(0,"IDLE",true);
            
            for(var f=minimumC;f<limitC;f++){
            
                enchufes[f].x=-100
                enchufes[f].y=game.world.centerY
            
            }
            
            
			if(randBack==0){
				bathroomGroup1.alpha=1
				bathroomGroup2.alpha=0
				bathroomGroup3.alpha=0
                dinamita.position.x=game.world.centerX
                dinamita.position.y=game.world.centerY+300
			}else if(randBack==1){
				bathroomGroup1.alpha=0
				bathroomGroup2.alpha=1
				bathroomGroup3.alpha=0
                dinamita.position.x=game.world.centerX+100
                dinamita.position.y=game.world.centerY+300
			}else if(randBack==2){
				bathroomGroup1.alpha=0
				bathroomGroup2.alpha=0
				bathroomGroup3.alpha=1
                dinamita.position.x=game.world.centerX-100
                dinamita.position.y=game.world.centerY+300
			}
                
           
            
            
            game.time.events.add(1000, function(){
                
                
             //game.add.tween(alphaMask).to({alpha:0}, 1000, Phaser.Easing.Cubic.Out, true)
                game.add.tween(cortina).to({width:10}, 1000, Phaser.Easing.Cubic.Out, true)
                fillObjects();
			    positionContacts();
                howMany()
            
            })
            
        })
        
		
		
	}
	
	function howMany(){
        
        minimumC=game.rnd.integerInRange(0,5)
        limitC=game.rnd.integerInRange(5,dificulty)
        
        
        while(limitC<=minimumC){
              
            limitC=game.rnd.integerInRange(5,9)
              
        }
        
        correctOnes=limitC-minimumC
        
        for(var b=minimumC;b<limitC;b++)
        {
            if(randBack==0){
                game.add.tween(enchufes[b]).to({x:b1PositionX[b],y:b1PositionY[b]}, 500 , Phaser.Easing.Linear.In, true, 100)
            }
            if(randBack==1){
                game.add.tween(enchufes[b]).to({x:b2PositionX[b],y:b2PositionY[b]}, 500 , Phaser.Easing.Linear.In, true, 100)
            }
            if(randBack==2){
                game.add.tween(enchufes[b]).to({x:b3PositionX[b],y:b3PositionY[b]}, 500 , Phaser.Easing.Linear.In, true, 100)
            }
            
        }
		delayers()
	}
	
	function delayers(){
		game.time.events.add(700, function(){
            hide() 
            
        if(correctOnes>7){
            timedhides=3200
        }
            if(correctOnes>4 && correctOnes<8){
            timedhides=2900
        }
            if(correctOnes<4){
            timedhides=1900 
        }
        game.time.events.add(timedhides, function(){
            
            startTimer(10000)
            canPlay=true
            })
		})
	}
	
	function hide(){
		
		var randHide=0
        
        for(var d=minimumC;d<limitC;d++)
        {
            
            randHide=game.rnd.integerInRange(0,1)
            
            if(randBack==0){
                game.add.tween(enchufes[d]).to({x:hidePositions1X[randHide],y:hidePositions1Y[randHide]}, 200 , Phaser.Easing.Linear.In, true, timer).onComplete.add(function(){
                    sound.play("whoosh")
                })
            }
            if(randBack==1){
                game.add.tween(enchufes[d]).to({x:hidePositions2X[randHide],y:hidePositions2Y[randHide]}, 200 , Phaser.Easing.Linear.In, true, timer).onComplete.add(function(){
                    sound.play("whoosh")
                })
            }
            if(randBack==2){
                game.add.tween(enchufes[d]).to({x:hidePositions3X[randHide],y:hidePositions3Y[randHide]}, 200 , Phaser.Easing.Linear.In, true, timer).onComplete.add(function(){
                    sound.play("whoosh")
                })
            }
            
            timer+=400
        }
		timer=400
	}
	
	
	function wrongGame(){
		
		
		missPoint()
        if(lives>0)reset()
	}
	
	function correctGame(){
		
        if(dificulty<9)dificulty++
		addPoint(1)
        reset()
	}
	
    
    function positionTimer(){
        clock=game.add.image(game.world.centerX-130,35,"atlas.time","clock")
        clock.scale.setTo(.7)
        
        timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
        timeBar.scale.setTo(8,.45)
        sceneGroup.add(clock)
        sceneGroup.add(timeBar)
        timeBar.alpha=1
        clock.alpha=1
        
       
   }
    function stopTimer(){
        tweenTiempo.stop()
        tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    function startTimer(time){
           tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
            tweenTiempo.onComplete.add(function(){
            startGame=false
            canPlay=false
            stopTimer()
            checkResults()
            })
    }
    
	
    function stopGame(win){
        
		marioSong.stop()
        
        sound.play("gameLose")
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 900, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("resultMichou")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
			sceneloader.show("resultMichou")
		})
    }
    
    function addPoint(obj,part){
        
        var partName = part || 'star'
        sound.play("pop")
        createTextPart('+1', obj)
        
        //gameSpeed +=10
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        addNumberPart(pointsBar.text,'+1')
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
        if (lives >0){
            lives--;
        }
        
        if(lives==0){
        dinamita.setAnimationByName(0,"LOSESTILL",true)   
        stopGame(false)
        }
        
        heartsGroup.text.setText('X ' + lives)
        
        
        createTextPart('-1',heartsGroup.text)
        
    }
    
    
    function deactivateObj(obj){
        
        obj.body.velocity.x = 0
        obj.used = false
        obj.body.y = -500
    }
    
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        for(var g=0;g<9;g++){
            if(tapaEnchufes[g]!=null){
                tapaEnchufes[g].position.x=enchufes[g].x+13
                tapaEnchufes[g].position.y=enchufes[g].y+15
            }
            if(bichitos[g]!=null){
                bichitos[g].position.x=enchufes[g].x+30
                bichitos[g].position.y=enchufes[g].y-30
            }
        }
        
    }
    

    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.contactos','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.x = game.world.width - 20
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartsImg = group.create(0,0,'atlas.contactos','life_box')
        heartsImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = -heartsImg.width * 0.38
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
        
	function addNumberPart(obj,number){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
        tweenScale.onComplete.add(function(){
            game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
        })
    }
	
    function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = game.world.x
            pointsText.y = game.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
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
        particle.makeParticles('atlas.contactos',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.5;
        particle.maxParticleScale = 1;
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

				particle.makeParticles('atlas.contactos',tag);
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
		
		createParticles('star',1)
		createParticles('wrong',1)
        createParticles('chispas',1)
		createParticles('text',5)
		//createParticles('chispa',1)

	}
    
	function createBackground(){
		
		// var cloud = worldGroup.create(game.world.centerX - 250,game.world.centerY - 300,'atlas.contactos','cloud')
		// var cloud = worldGroup.create(game.world.centerX + 100,game.world.centerY - 200,'atlas.contactos','cloud')
		// cloud.alpha = 0.7
		// cloud.scale.setTo(0.8,0.8)
        
        for(var fillParticles=0;fillParticles<9;fillParticles++){
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("chispas")
        sceneGroup.add(wrongParticle)
        wrongParticle.scale.setTo(.5)
        //sparkParticle[] = createPart("spark")
        //sceneGroup.add(sparkParticle)   
        }
		
		back1 = game.add.tileSprite(0,0,game.world.width,game.world.height/2,'atlas.contactos','color')
		worldGroup.add(back1)
		
		back2 = game.add.tileSprite(0,game.world.centerY-185,game.world.width,game.world.height,'atlas.contactos','tile_pared')
		worldGroup.add(back2)
		
		back3 = game.add.tileSprite(0,game.world.centerY+150,game.world.width,game.world.height,'atlas.contactos','tile')
		worldGroup.add(back3)
		
        dinamita= worldGroup.game.add.spine(game.world.centerX-100,game.world.centerY+300, "dinamita");
         
        dinamita.scale.setTo(scaleSpine,scaleSpine)
        dinamita.setSkinByName("normal");
        
        UIGroup.add(dinamita)
        
		
		cortina=game.add.sprite(-50,0,"atlas.contactos","cortina_1")
        cortina.height=game.world.height
        cortina.width=10
        sceneGroup.add(cortina)
		
	}
	
	return {
		assets: assets,
		name: "cuentaContactos",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = WORLD_GRAVITY;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			sceneGroup = game.add.group()
			
            worldGroup = game.add.group()
            sceneGroup.add(worldGroup)
			
			contactsGroup=game.add.group()
			sceneGroup.add(contactsGroup)
			
			bathroomGroup1 = game.add.group()
            sceneGroup.add(bathroomGroup1)
			
			bathroomGroup2 = game.add.group()
            sceneGroup.add(bathroomGroup2)
			
			bathroomGroup3 = game.add.group()
            sceneGroup.add(bathroomGroup3)
            
			UIGroup=game.add.group()
			sceneGroup.add(UIGroup)
			
			createBackground()
                        
            
            
            loadSounds()
			initialize()       
            			
			marioSong = game.add.audio('marioSong')
			game.sound.setDecodedCallback(marioSong, function(){
				 marioSong.loopFull(0.6)
			 }, this);
                  
            game.onPause.add(function(){
                game.sound.mute = true
				
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
				
            }, this);
            
            
                 
            
			addParticles()
            
              createHearts();
			  createPointsBar();
			buttons.getButton(marioSong,sceneGroup)
			
			if(!reviewComic){
				createComic(4);
			}else{
			  createOverlay();

			}
            animateScene()
            
            
		},
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
        update:update
	}

}()