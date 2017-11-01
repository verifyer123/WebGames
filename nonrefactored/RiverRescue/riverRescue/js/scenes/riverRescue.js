
var soundsPath = "../../shared/minigames/sounds/"
var riverRescue = function(){
    
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
                name: "atlas.river",
                json: "images/river/atlas.json",
                image: "images/river/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/river/timeAtlas.json",
                image: "images/river/timeAtlas.png",
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
			{	name: "clean",
				file: soundsPath + "flesh.mp3"},
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 99
	var indexGame
    var overlayGroup, backgroundGroup, trashGroup
    var spaceSong
    var garbage= new Array(33)
    var garbage2= new Array(33)
    var garbageScreen1 = new Array(10)
    var garbageScreen2 = new Array(10)
    var garbageScreen3 = new Array(10)
    var carriles = new Array(2)
    var speed, appear, nextLevel
    var scaleSpine=.55
    var randomCreation
    var delayer
	var floor
    var startGame
    var trash1, trash2, trash3
    var timeBar
    var timeTween
    var backG
    var light1,light2,light3
    var usage
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        speed = .5
        appear=35
        trash1=null
        trash2=null
        trash3=null
        nextLevel=20
        usage=.5
        startGame=false
        delayer=0
        for (var iniGarbage=0;iniGarbage<34;iniGarbage++)
            {
                garbage2[iniGarbage]=false
            }
        for (var iniGarbageLine=0;iniGarbageLine<10;iniGarbageLine++)
            {
                garbageScreen1[iniGarbageLine]=null
                garbageScreen2[iniGarbageLine]=null
                garbageScreen3[iniGarbageLine]=null
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
        if(lives==2){
            character.setAnimationByName(0,"LOSE",true);
        }
        if(lives==1){
            character.setAnimationByName(0,"HIT",true);
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.river','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.river','life_box')

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
        
        for (var iniGarbageLine=0;iniGarbageLine<10;iniGarbageLine++)
            {
                if(garbageScreen1[iniGarbageLine]!=null && (garbageScreen1[iniGarbageLine]!=trash1 && garbageScreen1[iniGarbageLine]!=trash2 && garbageScreen1[iniGarbageLine]!=trash3)){
                garbageScreen1[iniGarbageLine].alpha=0
                garbageScreen1[iniGarbageLine].body.moves=false  
                }
                if(garbageScreen2[iniGarbageLine]!=null && (garbageScreen2[iniGarbageLine]!=trash1 && garbageScreen2[iniGarbageLine]!=trash2 && garbageScreen2[iniGarbageLine]!=trash3)){
                garbageScreen2[iniGarbageLine].alpha=0
                garbageScreen2[iniGarbageLine].body.moves=false
                }
                if(garbageScreen3[iniGarbageLine]!=null && (garbageScreen3[iniGarbageLine]!=trash1 && garbageScreen3[iniGarbageLine]!=trash2 && garbageScreen3[iniGarbageLine]!=trash3)){
                garbageScreen3[iniGarbageLine].alpha=0
                garbageScreen3[iniGarbageLine].body.moves=false
                }
                garbageScreen1[iniGarbageLine]=null
                garbageScreen2[iniGarbageLine]=null
                garbageScreen3[iniGarbageLine]=null
                
            }
        timeTween.stop()
		startGame=false
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
        
        game.load.audio('riverSong', soundsPath + 'songs/bubble_fishgame.mp3');
        
		game.load.image('howTo',"images/river/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/river/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/river/introscreen.png")
        
        
        //Cargamos la animacion del personajes y de la vegetacion
        
        game.load.spine('axolotl',"images/spine/skeleton.json")
		
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
            
            
            
            
            
            startGame=true
            
            
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
            timeTween=game.add.tween(timeBar.scale).to({x:0,y:.7}, 50000, Phaser.Easing.Linear.Out, true, 100)
            timeTween.onComplete.add(function(){
                
                missPoint()
                reset()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.river','tutorialillustration')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'Desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.river',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.river','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
        
        backgroundGroup=game.add.group()
        sceneGroup.add(backgroundGroup)
        gameGroup=game.add.group()
        sceneGroup.add(gameGroup)
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 0;
        //Creamos el fondo
        
        backG=game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.river',"background")
        backgroundGroup.add(backG)
        light1=game.add.image(game.world.centerX-300,0,'atlas.river',"light")
        light1.height=0
        light2=game.add.image(game.world.centerX-50,0,'atlas.river',"light")
        light2.height=0
        light3=game.add.image(game.world.centerX+200,0,'atlas.river',"light")
        light3.height=0
        var tween = game.add.tween(light1.scale).to({y:1},1000,"Linear",true,0,-1)
        tween.yoyo(true,200)
        var tween2 = game.add.tween(light2.scale).to({y:1},1000,"Linear",true,0,-1)
        tween2.yoyo(true,200)
        var tween3 = game.add.tween(light3.scale).to({y:1},1000,"Linear",true,0,-1)
        tween3.yoyo(true,200)
        backgroundGroup.add(light1)
        backgroundGroup.add(light2)
        backgroundGroup.add(light3)
        floor=gameGroup.create(0,game.world.height-180,'atlas.river',"floor")
        floor.width=game.world.width
        floor.height=game.world.height-600
        floor2=gameGroup.create(0,game.world.height,'atlas.river',"floor")
        floor2.width=game.world.width
        floor2.height=10
        floor2.alpha=1
        game.physics.enable(floor2, Phaser.Physics.ARCADE)
        floor2.body.immovable=true
        
        var plants = game.add.tileSprite(0,game.world.centerY+100,game.world.width,200,"atlas.river","vegetation")
        backgroundGroup.add(backG)
        backgroundGroup.add(plants)
        var stone1=gameGroup.create(game.world.width-200,game.world.height-200,'atlas.river',"river-34")
        stone1.width=200
        stone1.height=200
        var stone2=gameGroup.create(200,game.world.height-200,'atlas.river',"river-34")
        stone2.width=-200
        stone2.height=200
        character = game.add.spine(game.world.centerX,game.world.height, "axolotl");
            character.scale.setTo(scaleSpine*2,scaleSpine*2)
            character.scale.setTo(scaleSpine*2,scaleSpine*2)
            character.setAnimationByName(0,"IDLE",true);
            character.setSkinByName("normal");
            gameGroup.add(character)
        
        //Aqui meto la barra de recoleccion de basura
        
        
        
        
        //Aqui metemos las basuras al arreglo
        
        for(var trashinside=0;trashinside<14;trashinside++)
        {      
        garbage[trashinside]=gameGroup.create(0,0,"atlas.river","trash"+(trashinside+1))
        garbage[trashinside].alpha=0
        }
        var proxyTrash=21
        for(var trashinside2=14;trashinside2<27;trashinside2++)
        {      
        garbage[trashinside2]=gameGroup.create(0,0,"atlas.river","river-"+proxyTrash)
        garbage[trashinside2].alpha=0
        proxyTrash++
        }
        
        //Aqui metemos el timer
        var clock =game.add.image(game.world.centerX-200,0,"atlas.time","clock")
        timeBar=game.add.image(clock.position.x+55,clock.position.y+57,"atlas.time","bar")
        timeBar.scale.setTo(11.5,.7)
        backgroundGroup.add(clock)
        backgroundGroup.add(timeBar)
        
	}
	
    function reset(){
        
            startGame=false
            delayer=0
            timeTween=game.add.tween(timeBar.scale).to({x:11.5,y:.7}, 300, Phaser.Easing.Linear.Out, true, 100)
            for (var iniGarbage=0;iniGarbage<34;iniGarbage++)
            {
                if(garbage[iniGarbage]!=trash1 && garbage[iniGarbage]!=trash2 && garbage[iniGarbage]!=trash3 )
                garbage2[iniGarbage]=false
            }
        for (var iniGarbageLine=0;iniGarbageLine<10;iniGarbageLine++)
            {
                if(garbageScreen1[iniGarbageLine]!=null && (garbageScreen1[iniGarbageLine]!=trash1 && garbageScreen1[iniGarbageLine]!=trash2 && garbageScreen1[iniGarbageLine]!=trash3)){
                garbageScreen1[iniGarbageLine].alpha=0
                garbageScreen1[iniGarbageLine].body.moves=false
                garbageScreen1[iniGarbageLine].position.x=-300
                garbageScreen1[iniGarbageLine].position.y=-110
                garbageScreen1[iniGarbageLine]=null

                }
                if(garbageScreen2[iniGarbageLine]!=null && (garbageScreen2[iniGarbageLine]!=trash1 && garbageScreen2[iniGarbageLine]!=trash2 && garbageScreen2[iniGarbageLine]!=trash3)){
                garbageScreen2[iniGarbageLine].alpha=0
                garbageScreen2[iniGarbageLine].body.moves=false
                garbageScreen2[iniGarbageLine].position.x=-300
                garbageScreen2[iniGarbageLine].position.y=-110
                garbageScreen2[iniGarbageLine]=null
                
                }
                if(garbageScreen3[iniGarbageLine]!=null && (garbageScreen3[iniGarbageLine]!=trash1 && garbageScreen3[iniGarbageLine]!=trash2 && garbageScreen3[iniGarbageLine]!=trash3)){
                garbageScreen3[iniGarbageLine].alpha=0
                garbageScreen3[iniGarbageLine].body.moves=false
                garbageScreen3[iniGarbageLine].position.x=-300
                garbageScreen3[iniGarbageLine].position.y=-110
                garbageScreen3[iniGarbageLine]=null
                
                }
                
            }
        
        
        
        timeTween.onComplete.add(function(){
        
            startGame=true
            timeTween=game.add.tween(timeBar.scale).to({x:0,y:.7}, 50000, Phaser.Easing.Linear.Out, true, 100)
            timeTween.onComplete.add(function(){
                
                missPoint()
                reset()
        })
        })
        
        
    }
    
	function update()
    {
        
       
        backG.tilePosition.x+=2
        
        
        for(var follow=0;follow<10;follow++){
            
            if(garbageScreen1[follow]!=null && garbageScreen1[follow]!=trash1 && garbageScreen1[follow]!=trash2 && garbageScreen1[follow]!=trash3 && garbageScreen1[follow].alpha==1){
            garbageScreen1[follow].position.y +=speed;
            }
            if(garbageScreen2[follow]!=null && garbageScreen2[follow]!=trash1 && garbageScreen2[follow]!=trash2 && garbageScreen2[follow]!=trash3 && garbageScreen2[follow].alpha==1){
            garbageScreen2[follow].position.y +=speed;
            }
            if(garbageScreen3[follow]!=null && garbageScreen3[follow]!=trash1 && garbageScreen3[follow]!=trash2 && garbageScreen3[follow]!=trash3 && garbageScreen3[follow].alpha==1){
            garbageScreen3[follow].position.y +=speed;
            }
        }
        
            
            
        if(pointsBar.number%nextLevel==0 && pointsBar.number!=0)
        {
            speed+=.4
            appear-=2
            timeTween.stop()
            reset()
            nextLevel+=20
        }
            
        if(startGame)
        {
        delayer++
            
        }
        
        if(delayer==appear){
            
            
            
            randomCreation=game.rnd.integerInRange(0,9)
            var randomtrail=game.rnd.integerInRange(0,2)
            var trashObject=game.rnd.integerInRange(0,25)
            
            
            if(mismo!=trashObject){
            var mismo=trashObject
            
            
            
         
            if(garbageScreen1[randomCreation]==null && garbage2[trashObject]==false && randomtrail==0)
            {
                
                garbageScreen1[randomCreation]=garbage[trashObject]
                garbageScreen1[randomCreation].tag=trashObject
                garbageScreen1[randomCreation].alpha=1
                garbageScreen1[randomCreation].position.x=game.world.centerX-300
                garbageScreen1[randomCreation].position.y=-110
                garbage2[trashObject]=true
                gameGroup.add(garbageScreen1[randomCreation])
                game.physics.enable(garbageScreen1[randomCreation], Phaser.Physics.ARCADE)
                garbageScreen1[randomCreation].body.onCollide = new Phaser.Signal();
                garbageScreen1[randomCreation].body.onCollide.add(hitTheFloor, this);
                garbageScreen1[randomCreation].inputEnabled=true
                garbageScreen1[randomCreation].events.onInputDown.add(onClick,this)
                delayer=0
            }
            if(garbageScreen2[randomCreation]==null && garbage2[trashObject]==false && randomtrail==1)
            {
                garbageScreen2[randomCreation]=garbage[trashObject]
                garbageScreen2[randomCreation].tag=trashObject
                garbageScreen2[randomCreation].alpha=1
                garbageScreen2[randomCreation].position.x=game.world.centerX-50
                garbageScreen2[randomCreation].position.y=-110
                gameGroup.add(garbageScreen2[randomCreation])
                garbage2[trashObject]=true
                game.physics.enable(garbageScreen2[randomCreation], Phaser.Physics.ARCADE)
                garbageScreen2[randomCreation].body.onCollide = new Phaser.Signal();
                garbageScreen2[randomCreation].body.onCollide.add(hitTheFloor, this);
                garbageScreen2[randomCreation].inputEnabled=true
                garbageScreen2[randomCreation].events.onInputDown.add(onClick,this)
                delayer=0
            }
            if(garbageScreen3[randomCreation]==null && garbage2[trashObject]==false && randomtrail==2)
            {
                garbageScreen3[randomCreation]=garbage[trashObject]
                garbageScreen3[randomCreation].tag=trashObject
                garbageScreen3[randomCreation].alpha=1
                garbageScreen3[randomCreation].position.x=game.world.centerX+200
                garbageScreen3[randomCreation].position.y=-110
                gameGroup.add(garbageScreen3[randomCreation])
                garbage2[trashObject]=true
                game.physics.enable(garbageScreen3[randomCreation], Phaser.Physics.ARCADE)
                garbageScreen3[randomCreation].body.onCollide = new Phaser.Signal();
                garbageScreen3[randomCreation].body.onCollide.add(hitTheFloor,this);
                garbageScreen3[randomCreation].inputEnabled=true
                garbageScreen3[randomCreation].events.onInputDown.add(onClick,this)
                delayer=0
            }
            
            randomtrail=3
            
            delayer=0
        }
        }
        
        
        for(var colliding=0; colliding<10; colliding++)
            {
                if(garbageScreen1[colliding]!=null){
                    game.physics.arcade.collide(floor2,garbageScreen1[colliding])
                }
                    if(garbageScreen2[colliding]!=null){
                    game.physics.arcade.collide(floor2,garbageScreen2[colliding])
                }
                   if(garbageScreen3[colliding]!=null){
                    game.physics.arcade.collide(floor2,garbageScreen3[colliding])
                }
            }
        
        
        
        
        
   
	}
	
    // funcion para dar click sobre la basura
    function onClick(obj) {
        
        correctParticle.position.x=obj.position.x+50
        correctParticle.position.y=obj.position.y
        correctParticle.start(true, 1000, null, 5)
        garbage2[obj.tag]=false
        sound.play("clean")
        for(var searchingNull=0; searchingNull<10;searchingNull++){
        if(garbageScreen3[searchingNull]==obj ){
            garbageScreen3[searchingNull].alpha=0
            garbageScreen3[searchingNull].position.x=-300
            garbageScreen3[searchingNull].position.y=-110
            garbageScreen3[searchingNull]=null
        }
        if(garbageScreen2[searchingNull]==obj ){
            garbageScreen2[searchingNull].alpha=0
            garbageScreen2[searchingNull].position.x=-50
            garbageScreen2[searchingNull].position.y=-110
            garbageScreen2[searchingNull]=null
        }
        if(garbageScreen1[searchingNull]==obj ){
            garbageScreen1[searchingNull].alpha=0
            garbageScreen1[searchingNull].position.x=-200
            garbageScreen1[searchingNull].position.y=-110
            garbageScreen1[searchingNull]=null
        }
        } 
        obj.inputEnabled=false
        addPoint(1)
        
        
            
            
        
    }
    
    // funcion para cuando la basura choca con el piso
    
    function hitTheFloor(obj,numb)
    {
        
        obj.body.moves=false
        
        if(trash1!=null && trash2!=null && trash3==null){
            trash3=garbage[obj.tag]
            trash3.position.x=obj.position.x
            trash3.position.y=obj.position.y
            trash3.body.onCollide = new Phaser.Signal();
            missPoint()
            wrongParticle.position.x=obj.position.x+50
            wrongParticle.position.y=obj.position.y
            wrongParticle.start(true, 1000, null, 5)
            obj.inputEnabled=false
            
            
            
            
        }    
        
        if(trash1!=null && trash2==null){
            trash2=garbage[obj.tag]
            trash2.position.x=obj.position.x
            trash2.position.y=obj.position.y
            trash2.body.onCollide = new Phaser.Signal();
            missPoint()
            wrongParticle.position.x=obj.position.x+50
            wrongParticle.position.y=obj.position.y
            wrongParticle.start(true, 1000, null, 5)
            obj.inputEnabled=false
            
        }
        
        if(trash1==null){
            trash1=garbage[obj.tag]
            trash1.position.x=obj.position.x
            trash1.position.y=obj.position.y
            trash1.body.onCollide = new Phaser.Signal();
            missPoint()
            wrongParticle.position.x=obj.position.x+50
            wrongParticle.position.y=obj.position.y
            wrongParticle.start(true, 1000, null, 5)
            obj.inputEnabled=false  
            
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
        particle.makeParticles('atlas.river',key);
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

				particle.makeParticles('atlas.river',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.river','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.river','smoke');
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
		name: "riverRescue",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            spaceSong = game.add.audio('riverSong')
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