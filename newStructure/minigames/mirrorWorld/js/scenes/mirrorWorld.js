
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var mirrorWorld = function(){
    
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
                name: "atlas.mirror",
                json: "images/mirror/atlas.json",
                image: "images/mirror/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/mirror/timeAtlas.json",
                image: "images/mirror/timeAtlas.png",
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
            {	name: "switch",
				file: soundsPath + "cog.mp3"},
            			
		],
        jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 127
	var indexGame
    var overlayGroup
    var spaceSong
    
    var backgroundGroup=null
    
    
    var tweenTiempo
    var clock, timeBar
    var tempo
    var emitter, notEval, wait
    var testSide=new Array(30)
    var gameSide=new Array(30)
    var iconsComp=new Array(30)
    var iconsPlayer=new Array(30)
    var dificulty,check,stGame

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        dificulty=4
        tempo=25000
        notEval=false
        check=0
        wait=false
        stGame=false
        emitter=""
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.mirror','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.mirror','life_box')

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
        
        
        
        
        spaceSong.stop()
        		
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
        
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
        game.load.audio('spaceSong', soundsPath + 'songs/8-bit-Video-Game.mp3');
        
		game.load.image('howTo',"images/mirror/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/mirror/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/mirror/introscreen.png")
        
        game.load.spine("piece","images/Spine/figure.json")
		
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
            dificulty=4
            createPat()
            //Aqui va la primera funciòn que realizara el juego
            spaceSong.play()
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.mirror','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.mirror',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.mirror','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
	    backgroundGroup = game.add.group()
        gameBoard = game.add.group()
        UIGroup = game.add.group()
        sceneGroup.add(backgroundGroup)
        sceneGroup.add(gameBoard)
        sceneGroup.add(UIGroup)
        
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        //Background
        backLeft=game.add.sprite(0,game.world.centerY,"atlas.mirror","izq");
        backLeft.anchor.setTo(0.5,0.5)
        backLeft.scale.setTo(game.world.width/260,1)
        backgroundGroup.add(backLeft)
        
        backRight=game.add.sprite(game.world.centerX,0,"atlas.mirror","der");
        backRight.scale.setTo(game.world.width/260,1)
        backRight.anchor.setTo(0,0)
        backgroundGroup.add(backRight)
        
        //Two parts game
        
        
        gameLeft=game.add.sprite(game.world.centerX-135,game.world.centerY,"atlas.mirror","izq2");
        gameLeft.anchor.setTo(0.5,0.5)
        backgroundGroup.add(gameLeft)
        
        
        gameRight=game.add.sprite(game.world.centerX+135,game.world.centerY,"atlas.mirror","der2");
        gameRight.anchor.setTo(0.5,0.5)
        backgroundGroup.add(gameRight)
        
        //Center
        center=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.mirror","centro");
        center.anchor.setTo(0.5,0.5)
        backgroundGroup.add(center)
        
        
        //timer
        
        positionTimer()
        
        //gameParts
        var moveX=0;
        var moveY=1;
        
        for(var fill=0; fill<testSide.length;fill++){
            
            testSide[fill]=game.add.sprite(gameLeft.x+70*moveX,11*moveY,"atlas.mirror","patron_der")
            testSide[fill].position.x-=60
            testSide[fill].position.y+=170
            testSide[fill].anchor.setTo(0.5,0.5)
            
            
            iconsComp[fill]=game.add.spine(gameLeft.x+70*moveX,11*moveY,"piece")
            iconsComp[fill].setSkinByName("circle")
            iconsComp[fill].setAnimationByName(0,"IDLE_PURPLE",true) 
            iconsComp[fill].position.x-=60
            iconsComp[fill].alpha=0
            
            
            
            iconsComp[fill].scale.setTo(0)
            iconsComp[fill].tag="empty"
            iconsComp[fill].position.y+=170
            
            gameSide[fill]=game.add.sprite(gameRight.x+70*moveX,11*moveY,"atlas.mirror","patron_izq")
            gameSide[fill].position.x-=80
            gameSide[fill].position.y+=170
            gameSide[fill].inputEnabled=true
            gameSide[fill].events.onInputDown.add(changeFigure, this);
            gameSide[fill].anchor.setTo(0.5,0.5)
            gameSide[fill].name=fill
            
            iconsPlayer[fill]=game.add.spine(gameRight.x+70*moveX,11*moveY,"piece")
            iconsPlayer[fill].setSkinByName("circle")
            iconsPlayer[fill].setAnimationByName(0,"IDLE_ORANGE",true)
            iconsPlayer[fill].position.x-=80
            iconsPlayer[fill].tag="empty"
            
            iconsPlayer[fill].alpha=0
            
            iconsPlayer[fill].position.y+=170
            
            gameBoard.add(testSide[fill])
            gameBoard.add(gameSide[fill])
            gameBoard.add(iconsComp[fill])
            gameBoard.add(iconsPlayer[fill])
            moveX++
            
            if(fill==2 || fill==5 || fill==8 || fill==11 || fill==14 || fill==17 || fill==20 || fill==23 || fill==26){
                moveY+=7
                moveX=0
            }
            
        }
    }
	


  
    
	function update(){
        
        
        if(startGame){
            epicparticles.update()
            if(stGame)checkMirror()
            
            
            iconsPlayer[0].slotContainers[0].rotation=180
            iconsPlayer[0].autoUpdateTransform ()
        }

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
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
            })
        })
    }
    
    function changeFigure(obj){
       
        if(!wait){
             sound.play("switch")
            if(iconsPlayer[obj.name].tag=="empty"){
                iconsPlayer[obj.name].tag="circle";
                iconsPlayer[obj.name].tag="circle"
                iconsPlayer[obj.name].alpha=1
                iconsPlayer[obj.name].setSkinByName("circle")

            }else if(iconsPlayer[obj.name].tag=="circle"){
                iconsPlayer[obj.name].tag="cube";
                iconsPlayer[obj.name].tag="cube"
                iconsPlayer[obj.name].alpha=1
                iconsPlayer[obj.name].setSkinByName("cube")
            }else if(iconsPlayer[obj.name].tag=="cube"){
                iconsPlayer[obj.name].tag="triangle";
                iconsPlayer[obj.name].tag="triangle"
                iconsPlayer[obj.name].alpha=1
                iconsPlayer[obj.name].setSkinByName("triangle")
            }else if(iconsPlayer[obj.name].tag=="triangle"){
                iconsPlayer[obj.name].tag="empty";
                iconsPlayer[obj.name].tag="empty"
                iconsPlayer[obj.name].alpha=0
                iconsPlayer[obj.name].setSkinByName("circle")
            }

            iconsPlayer[obj.name].setAnimationByName(0,"IDLE_ORANGE",true) 
        }
        
    }
    
    function checkMirror(){
        check=0
        
        for(var checking=1; checking<iconsPlayer.length-1;checking+=3){
            if(iconsPlayer[checking].tag==iconsComp[checking].tag){
                check++
            }
            if(iconsPlayer[checking-1].tag==iconsComp[checking+1].tag){
                check++
            }
            if(iconsPlayer[checking+1].tag==iconsComp[checking-1].tag){
                check++
            }
            
        }
        
        if(check==30 && !notEval){
            Coin(center,pointsBar,100)
            wait=true
            stopTimer()
            if(dificulty<30){
                dificulty++
                tempo-=50
            }
            
            check=0
            stGame=false
            for(var outing=0;outing<iconsComp.length;outing++){
                game.add.tween(iconsComp[outing].scale).to({x:1.2,y:1.2},500, Phaser.Easing.Linear.Out, true)
                game.add.tween(iconsComp[outing].scale).to({x:0,y:0},500, Phaser.Easing.Linear.Out, true,900)
                game.add.tween(iconsComp[outing]).to({alpha:0},100,Phaser.Easing.linear,true, 2000) 

                game.add.tween(iconsPlayer[outing].scale).to({x:1.2,y:1.2},500, Phaser.Easing.Linear.Out, true)
                game.add.tween(iconsPlayer[outing].scale).to({x:0,y:0},500, Phaser.Easing.Linear.Out, true,900)
                game.add.tween(iconsPlayer[outing]).to({alpha:0},100,Phaser.Easing.linear,true, 1900) 
                game.add.tween(iconsPlayer[outing].scale).to({x:1,y:1},200, Phaser.Easing.Linear.Out, true,2000)
            }
            
            game.time.events.add(2200,function(){
                
                for(var reset=0; reset<iconsPlayer.length;reset++){
                    iconsPlayer[reset].tag="empty"
                    iconsPlayer[reset].setSkinByName("circle")
                    iconsPlayer[reset].setAnimationByName(0,"IDLE_ORANGE",true) 
                    iconsComp[reset].tag="empty"
                }
                createPat()
            })
        }
        
    }
    
    
     function positionTimer(){
           clock=game.add.image(game.world.centerX-120,60,"atlas.time","clock")
           clock.scale.setTo(.7)
           timeBar=game.add.image(clock.position.x+45,clock.position.y+17,"atlas.time","bar")
           timeBar.scale.setTo(6,.35)
           timeBar.alpha=1
           clock.alpha=1
           UIGroup.add(clock)
           UIGroup.add(timeBar)
       }
       function stopTimer(){
           tweenTiempo.stop()
           tweenTiempo=game.add.tween(timeBar.scale).to({x:6,y:.35}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
           })
       }
       function startTimer(time){
            tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.35}, time, Phaser.Easing.Linear.Out, true, 100)
            tweenTiempo.onComplete.add(function(){
                wait=true
                missPoint()
                stopTimer()
                notEval=true
                for(var reset=0; reset<iconsPlayer.length;reset++){
                    iconsPlayer[reset].tag="empty"
                    iconsPlayer[reset].setSkinByName("circle")
                    iconsPlayer[reset].setAnimationByName(0,"LOSE_ORANGE",true)
                    iconsComp[reset].setAnimationByName(0,"LOSE_PURPLE",true) 
                    iconsComp[reset].tag="empty"
                }
                
                game.time.events.add(1000,function(){
                    for(var outing=0;outing<iconsComp.length;outing++){
                        game.add.tween(iconsComp[outing].scale).to({x:1.2,y:1.2},500, Phaser.Easing.Linear.Out, true)
                        game.add.tween(iconsComp[outing].scale).to({x:0,y:0},500, Phaser.Easing.Linear.Out, true,500)
                        game.add.tween(iconsComp[outing]).to({alpha:0},100,Phaser.Easing.linear,true, 1500) 

                        game.add.tween(iconsPlayer[outing].scale).to({x:1.2,y:1.2},500, Phaser.Easing.Linear.Out, true)
                        game.add.tween(iconsPlayer[outing].scale).to({x:0,y:0},500, Phaser.Easing.Linear.Out, true,500)
                        game.add.tween(iconsPlayer[outing]).to({alpha:0},100,Phaser.Easing.linear,true, 1500) 
                        game.add.tween(iconsPlayer[outing].scale).to({x:1,y:1},200, Phaser.Easing.Linear.Out, true,1600)
                    }
                    game.time.events.add(2000,function(){
                        createPat()
                    })
                })
                
        })
    }
    
    function createPat(){
        
        var howMany=0
        var where=game.rnd.integerInRange(0,29)
        var whichPiece=game.rnd.integerInRange(1,3)
        while(howMany!=dificulty){
            where=game.rnd.integerInRange(0,29)
            whichPiece=game.rnd.integerInRange(1,3)
            if(iconsComp[where].tag=="empty"){
                if(whichPiece==1){
                    iconsComp[where].tag="circle"
                    iconsComp[where].setSkinByName(iconsComp[where].tag)
                }else if(whichPiece==2){
                     iconsComp[where].tag="cube"
                     iconsComp[where].setSkinByName(iconsComp[where].tag)
                }else if(whichPiece==3){
                    iconsComp[where].tag="triangle"
                    iconsComp[where].setSkinByName(iconsComp[where].tag)
                }
                iconsComp[where].alpha=1
                iconsComp[where].setAnimationByName(0,"IDLE_PURPLE",true)
                howMany++
                
            }
        }
        notEval=false
        wait=false
        if(howMany==dificulty){
            startTimer(tempo)
            for(var entering=0;entering<iconsComp.length;entering++){
                game.add.tween(iconsComp[entering].scale).to({x:1,y:1},700, Phaser.Easing.Linear.Out, true)
            }
            stGame=true
            howMany=0
        }
        
    }
    
     
    
    function reset(){
            
            
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
        particle.makeParticles('atlas.mirror',key);
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

				particle.makeParticles('atlas.mirror',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.mirror','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.mirror','smoke');
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
		name: "mirrorWorld",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
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
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()