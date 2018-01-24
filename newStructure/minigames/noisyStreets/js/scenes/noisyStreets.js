
var soundsPath = "../../shared/minigames/sounds/"
var noisyStreets = function(){
    
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
                name: "atlas.noisy",
                json: "images/noisy/atlas.json",
                image: "images/noisy/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/noisy/timeAtlas.json",
                image: "images/noisy/timeAtlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
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
            {	name: "cards",
				file: soundsPath + "swipe.mp3"},
            {	name: "yupi",
				file: soundsPath + "winwin.mp3"},
            
			
		],
        jsons: [
			{
				name: 'pickedEnergy', 
				file: 'particles/battle/pickedEnergy/specialBar1.json'
			}
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 126
	var indexGame
    var overlayGroup
    var noisySong
    
    var backgroundGroup=null
    var tween1, tween2, tween3, tweenTiempo
    var clock, timeBar
    
    var level,numberOfCards
    var cardsActivated=new Array(10)
    var cards=new Array(10)
    var picked
    var goal, lostLive
    var cardsBack=new Array(10)
    var cardsValue=new Array(10)
    var cardsValueEver=new Array(10)
    var selected1,selected2, numSelected1, numSelected2
    var emit, emit2
    var card1, card2, checkingCard
    
    var soundsArray=new Array(5)

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#220341"
        lives = 3
        level = 0
        dificulty=2
        lostLive=false
        goal=0
        selected1=""
        selected2=""
        emit=""
        emit2=""
        picked=0
        checkingCard=false
        for(var fill=0;fill<cards.length;fill++){
            cardsActivated[fill]=false;
        }
        loadSounds()
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
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.noisy','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.noisy','life_box')

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
        
        
        
        
        horn.stop()
        claxon.stop()
        dog.stop()
        sax.stop()
        stereo.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        epicparticles.loadEmitter(game.load, "pickedEnergy")
        
        game.load.audio('claxon', soundsPath + 'carHorn.wav');
        game.load.audio('dog', soundsPath + 'barkingDog.mp3');
        game.load.audio('horn', soundsPath + 'horn.mp3');
        game.load.audio('sax', soundsPath + 'badSax.wav');
        game.load.audio('stereo', soundsPath + 'songs/la_fiesta.mp3');
        
		game.load.image('howTo',"images/noisy/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/noisy/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/noisy/introscreen.png")
        
        game.load.spritesheet("coin", 'images/coin/coin.png', 122, 123, 12)
        
        game.load.spine("dinamita","images/Spine/dinamita.json")
        
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
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
			sound.play("pop")
            horn.play()
            claxon.play()
            //Aqui va la primera funciòn que realizara el juego
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.noisy','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'Desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.noisy',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.noisy','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
	backgroundGroup = game.add.group()
    cardsGroup = game.add.group()
    UIGroup = game.add.group()
    sceneGroup.add(backgroundGroup)
    sceneGroup.add(cardsGroup)
    sceneGroup.add(UIGroup)

        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        //Background
        backG=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.noisy","fondo");
        backG.anchor.setTo(0.5,0.5)
        backG.scale.setTo(game.world.width/500,1)
        backgroundGroup.add(backG)
        
        //Dinamita
        dinamita = game.add.spine(game.world.centerX,game.world.centerY-180, "dinamita");
        dinamita.scale.setTo(1,1)
        dinamita.setSkinByName("normal");
        dinamita.setAnimationByName(0,"IDLE",true) 
        backgroundGroup.add(dinamita)
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        
        //Cards
        var moveX=0
        var moveY=0
        dificulty=2;
        for(var fill=0; fill<10;fill++){
            
            
            
            cardsBack[fill] = game.add.sprite(game.world.centerX-180+moveX,game.world.centerY-100+moveY, "atlas.noisy","card off");
            cardsBack[fill].scale.setTo(0.9,0.9)
            cardsBack[fill].anchor.setTo(0.5,0.5)
            cardsBack[fill].inputEnabled=true;
            cardsBack[fill].name=fill;
            if(fill>3){
                cardsBack[fill].alpha=0
                cardsBack[fill].scale.setTo(0,0.9)
            }
            cardsBack[fill].events.onInputDown.add(checkCard, this);
            cardsGroup.add(cardsBack[fill])
            
            cards[fill] = game.add.sprite(game.world.centerX-180+moveX,game.world.centerY-100+moveY, "atlas.noisy","perro");
            cards[fill].scale.setTo(0,0.9)
            cards[fill].anchor.setTo(0.5,0.5)
            cards[fill].alpha=0
            cardsGroup.add(cards[fill])
            
            
            moveX+=180
            if(fill==2 || fill==5){
                moveX=0
                moveY+=160
            }else if(fill==8){
                moveX=180
                moveY+=160
            }
        }
        
        
        
        // Fill card values
        
        cardsValue[0]="niñoClaxon";
        cardsValue[1]="niñoClaxon";
        cardsValue[2]="carro";
        cardsValue[3]="carro";
        cardsValue[4]="perro";
        cardsValue[5]="perro";
        cardsValue[6]="stereo";
        cardsValue[7]="stereo";
        cardsValue[8]="sax";
        cardsValue[9]="sax";
        
        cardsValueEver[0]="niñoClaxon";
        cardsValueEver[1]="niñoClaxon";
        cardsValueEver[2]="carro";
        cardsValueEver[3]="carro";
        cardsValueEver[4]="perro";
        cardsValueEver[5]="perro";
        cardsValueEver[6]="stereo";
        cardsValueEver[7]="stereo";
        cardsValueEver[8]="sax";
        cardsValueEver[9]="sax";
        
        
        all=0
        anyone=0
        while(all<dificulty*2){ 
            anyone=game.rnd.integerInRange(0,dificulty*2-1)
            if(cardsValue[anyone]!=""){
                cardsBack[all].tag=cardsValue[anyone]
                cards[all].loadTexture("atlas.noisy",cardsValue[anyone])
                cardsValue[anyone]=""
                all++    
            }
        }
        
        
    }
	
    function checkCard(obj){

        if(!checkingCard && !cardsActivated[obj.name] && picked<2){
            console.log(obj.tag)
            checkingCard=true;
            if(selected1==""){
                selected1=obj.tag
                numSelected1=obj.name
            }else if(selected2==""){
                selected2=obj.tag
                numSelected2=obj.name
            }
            sound.play("cards")
            cardsActivated[obj.name]=true
            game.add.tween(obj.scale).to({x:0}, 200, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
                obj.loadTexture("atlas.noisy","card on")
                cards[obj.name].alpha=1
                game.add.tween(cards[obj.name].scale).to({x:0.9}, 200, Phaser.Easing.Linear.Out, true)
                game.add.tween(obj.scale).to({x:0.9}, 200, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
                    checkingCard=false;
                    picked++
                })
            })
        }
    }
    
    function Coin(objectBorn,objectDestiny,time){
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
            })
        })
    }
    
    function arrangeCards(){
        goal=0
        
        if(level==3){
            positionTimer()
        }
        if(!lostLive && level>3)stopTimer()
        
        for(var filled=0; filled<cards.length; filled++){
            cardsValue[filled]=cardsValueEver[filled]
        }
        
        
        
        
        game.time.events.add(1000,function(){
            if(level==1){
                horn.play()
                claxon.play()
                dog.play()
            }
        if(level==2){
                horn.play()
                claxon.play()
                dog.play()
                stereo.play()
            }
        if(level>=3){
                horn.play()
                claxon.play()
                dog.play()
                stereo.play()
                sax.play()
            }
            
            
            dinamita.setAnimationByName(0,"IDLE",true)
            for(var arrange=0; arrange<dificulty*2;arrange++){
                sound.play("cards")
                game.add.tween(cards[arrange].scale).to({x:0},100, Phaser.Easing.Linear.Out, true)
                game.add.tween(cards[arrange]).to({alpha:0},105,Phaser.Easing.linear,true, 100)
                game.add.tween(cardsBack[arrange]).to({alpha:1},505,Phaser.Easing.linear,true, 100)
                if(!lostLive){
                game.add.tween(cardsBack[arrange].scale).to({x:0.9},500, Phaser.Easing.Linear.Out, true, 300*arrange)
                }else{
                  game.add.tween(cardsBack[arrange].scale).to({x:0.9},500, Phaser.Easing.Linear.Out, true,300)  
                  lostLive=false
                }
                cardsBack[arrange].loadTexture("atlas.noisy","card off")
                cardsBack[arrange].inputEnabled=true
                cardsActivated[arrange]=false
            }
            
            all=0
            anyone=0
            while(all<dificulty*2){ 
                anyone=game.rnd.integerInRange(0,dificulty*2-1)
                if(cardsValue[anyone]!=""){
                    cardsBack[all].tag=cardsValue[anyone]
                    cards[all].loadTexture("atlas.noisy",cardsValue[anyone])
                    cardsValue[anyone]=""
                    all++    
                }
            }
            if(dificulty>=5){
                startTimer(100000)
            }
        })
    }
    
    function positionTimer(){
           clock=game.add.image(game.world.centerX-150,45,"atlas.time","clock")
           clock.scale.setTo(.7)
           timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
           timeBar.scale.setTo(8,.45)
           backgroundGroup.add(clock)
           backgroundGroup.add(timeBar)
           timeBar.alpha=1
           clock.alpha=1
           UIGroup.add(clock)
           UIGroup.add(timeBar)
       }
       function stopTimer(){
           tweenTiempo.stop()
           tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
           })
       }
       function startTimer(time){
            tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
            tweenTiempo.onComplete.add(function(){
                missPoint() 
                lostLive=true
                if(lives>0){
                    dinamita.setAnimationByName(0,"LOSE",false)
                }else{
                    dinamita.setAnimationByName(0,"LOSESTILL",false)
                }
                for(var reset=0; reset<dificulty*2;reset++){
                    cardsActivated[reset]=false
                    cardsActivated[reset]=false
                    cardsBack[reset].inputEnabled=true
                    cardsBack[reset].inputEnabled=true
                }
                selected1=""
                selected2=""
                picked=0
                numSelected1=0
                numSelected2=0
                stopTimer()
                if(lives>0){
                    arrangeCards()
                }
        })
    }
    
	function update(){
        
        
        if(startGame){
            epicparticles.update()
            if(picked==2){
                checkIfCorrect()
            }
            if(goal==dificulty){
                if(dificulty<5){
                    dificulty++
                }
                level++
                dinamita.setAnimationByName(0,"WIN",false)
                sound.play("yupi")
                arrangeCards()
                
            }
            
        }

	}
    
    function checkIfCorrect(){
        
        if(selected1==selected2){
            Coin(cardsBack[numSelected2],pointsBar,100)
            selected1=""
            selected2=""
            picked=3
            dinamita.setAnimationByName(0,"WIN",false)
            emit = epicparticles.newEmitter("pickedEnergy")
            emit.duration=0.05;
            emit.x = cardsBack[numSelected1].x
            emit.y = cardsBack[numSelected1].y
            
            emit2 = epicparticles.newEmitter("pickedEnergy")
            emit2.duration=0.05;
            emit2.x = cardsBack[numSelected2].x
            emit2.y = cardsBack[numSelected2].y
            
            if(cardsBack[numSelected1].tag=="niñoClaxon"){
                horn.stop()
            }
            if(cardsBack[numSelected1].tag=="carro"){
                claxon.stop()
            }
            if(cardsBack[numSelected1].tag=="perro"){
                dog.stop()
            }
            if(cardsBack[numSelected1].tag=="stereo"){
                stereo.stop()
            }
            if(cardsBack[numSelected1].tag=="sax"){
                sax.stop()
            }
            
            
            game.add.tween(cardsBack[numSelected1].scale).to({x:1.1,y:1.1}, 300, Phaser.Easing.Linear.Out, true)
            game.add.tween(cardsBack[numSelected2].scale).to({x:1.1,y:1.1}, 300, Phaser.Easing.Linear.Out, true)
            game.add.tween(cards[numSelected1].scale).to({x:1.1,y:1.1}, 300, Phaser.Easing.Linear.Out, true)
            game.add.tween(cards[numSelected2].scale).to({x:1.1,y:1.1}, 300, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
                
                game.add.tween(cards[numSelected1].scale).to({x:0.9,y:0.9}, 300, Phaser.Easing.Linear.Out, true)
                game.add.tween(cardsBack[numSelected1].scale).to({x:0.9,y:0.9}, 300, Phaser.Easing.Linear.Out, true)
                game.add.tween(cardsBack[numSelected2].scale).to({x:0.9,y:0.9}, 300, Phaser.Easing.Linear.Out, true)
                game.add.tween(cards[numSelected2].scale).to({x:0.9,y:0.9}, 300, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
                    
                        game.add.tween(cards[numSelected1]).to({alpha:0},300,Phaser.Easing.linear,true, 250)
                        game.add.tween(cards[numSelected2]).to({alpha:0},300,Phaser.Easing.linear,true, 250)
                        game.add.tween(cardsBack[numSelected1]).to({alpha:0},300,Phaser.Easing.linear,true, 250)
                        game.add.tween(cardsBack[numSelected2]).to({alpha:0},300,Phaser.Easing.linear,true, 250).onComplete.add(function(){
                            game.add.tween(cards[numSelected1].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 100)
                            game.add.tween(cards[numSelected2].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 100)
                            game.add.tween(cardsBack[numSelected1].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 100)
                            game.add.tween(cardsBack[numSelected2].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 100)
                            cardsBack[numSelected1].loadTexture("atlas.noisy","card off")
                            cardsBack[numSelected2].loadTexture("atlas.noisy","card off")
                            numSelected1=0
                            numSelected2=0
                            picked=0
                            dinamita.setAnimationByName(0,"IDLE",true)
                            goal++
                    })
                })
            })
            
            
            
            
            
            
            
        }else{
            picked=3
            cardsBack[numSelected1].inputEnabled=false
            cardsBack[numSelected2].inputEnabled=false

            game.add.tween(cards[numSelected1].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 400)
            game.add.tween(cardsBack[numSelected1].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 400).onComplete.add(function(){
                cardsBack[numSelected1].loadTexture("atlas.noisy","card off")
                cards[numSelected1].alpha=0
                game.add.tween(cardsBack[numSelected1].scale).to({x:0.9}, 500, Phaser.Easing.Linear.Out, true, 400)
            })
            
            game.add.tween(cards[numSelected2].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 400)
            game.add.tween(cardsBack[numSelected2].scale).to({x:0}, 500, Phaser.Easing.Linear.Out, true, 400).onComplete.add(function(){
                cardsBack[numSelected2].loadTexture("atlas.noisy","card off")
                cards[numSelected2].alpha=0
                game.add.tween(cardsBack[numSelected2].scale).to({x:0.9}, 500, Phaser.Easing.Linear.Out, true, 400).onComplete.add(function(){
                    cardsActivated[numSelected1]=false
                    cardsActivated[numSelected2]=false
                    selected1=""
                    selected2=""
                    picked=0
                    cardsBack[numSelected1].inputEnabled=true
                    cardsBack[numSelected2].inputEnabled=true
                    numSelected1=0
                    numSelected2=0
                })
            })
        }
        
    }
    
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
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
        particle.makeParticles('atlas.noisy',key);
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

				particle.makeParticles('atlas.noisy',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.noisy','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.noisy','smoke');
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
		name: "noisyStreets",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            horn = game.add.audio('horn')
            game.sound.setDecodedCallback(horn, function(){
                horn.loopFull(0.6)
            }, this);
            
            claxon = game.add.audio('claxon')
            game.sound.setDecodedCallback(claxon, function(){
                claxon.loopFull(0.6)
            }, this);
            
            dog = game.add.audio('dog')
            game.sound.setDecodedCallback(dog, function(){
                dog.loopFull(0.6)
            }, this);
            
            sax = game.add.audio('sax')
            game.sound.setDecodedCallback(sax, function(){
                sax.loopFull(0.6)
            }, this);
            
            stereo = game.add.audio('stereo')
            game.sound.setDecodedCallback(stereo, function(){
                stereo.loopFull(0.6)
            }, this);
            
            horn.stop()
            claxon.stop()
            dog.stop()
            sax.stop()
            stereo.stop()
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
			
			buttons.getButton(claxon,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()