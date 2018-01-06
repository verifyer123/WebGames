
var soundsPath = "../../shared/minigames/sounds/"
var whereIsMy = function(){
    
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
                name: "atlas.where",
                json: "images/where/atlas.json",
                image: "images/where/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/where/timeAtlas.json",
                image: "images/where/timeAtlas.png",
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
            {	name: "vacc",
				file: soundsPath + "swipe.mp3"},
            
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 102
	var indexGame
    var overlayGroup
    var whereSong
    
    var backgroundGroup=null
    var gameGroup=null
    var roadGroup=null
    var busGroup=null
    var animalsGroup=null
    var houseGroup=null
    
    
    var whereTrash=new Array(4)
    var activeTrash=new Array(4)
    var whereTrashProxy=new Array(4)
    var planets= new Array(7)
    
    var meteors=null
    var meteorsProxy=null
    var meteorsActive=false
    
    
    var trail1=new Array(5)
    var trail2=new Array(5)
    var trail3=new Array(5)
    var trail4, trail5
    
	var trails
    var startGame
    var fuel
    var fuelBar
    var speed
    var delayer2
    
    var proxy1
    var ship
    var scaleSpine=.5
    var adition
    var delayer
    var goal
    var tween1, tween2, tween3, tweenTiempo
    var clock, timeBar
    var clockStarts
    var character
    var btnActive
    var dificulty=100000
    var objects=new Array(7)
    var objectsInScene=new Array(7)
    var objectsInSceneProxy=new Array(7)
    var activeObject=new Array(7)
    var objectToFind
    var characterProxy
    var passingLevel
    var coins=new Array(7)
    

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        passingLevel=false
        btnActive=false
        dificulty=100000
        objects[0]="DOLL"
        objects[1]="BALL"
        objects[2]="LAMP"
        objects[3]="TENNIS"
        objects[4]="PHOTO"
        objects[5]="YO YO"
        objects[6]="STUFFED"
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.where','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.where','life_box')

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
        
        
        
        
        whereSong.stop()
        		
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
        
        game.load.audio('whereSong', soundsPath + 'songs/electro_trance_minus.mp3');
        
		game.load.image('howTo',"images/where/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/where/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/where/introscreen.png")
        
        game.load.spine('thef', "images/Spine/normal/normal.json");
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
        
		
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
            
            //Aqui va la primera funciòn que realizara el juego
            
            startGame=true
            startGlobe()
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.where','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.where',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.where','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
     
         backgroundGroup = game.add.group()
         UIGroup=game.add.group()
         objectGroup=game.add.group()
         characterGroup=game.add.group()
         sceneGroup.add(backgroundGroup)
         sceneGroup.add(UIGroup)
         sceneGroup.add(characterGroup)
         sceneGroup.add(objectGroup)
         
        
        //Aqui creamos la fisica
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        backGwall=game.add.tileSprite(0,game.world.centerY,game.world.width*2,game.world.height,'atlas.where',"TILE WALL")
        backGwall.scale.setTo(1,1)
        backGwall.anchor.setTo(0.5,0.5)
        backGwall.alpha=1
        backgroundGroup.add(backGwall)
        
        backGfloor=game.add.tileSprite(game.world.centerX,game.world.height-100,game.world.width,game.world.height*1.2,'atlas.where',"FLOOR TILE")
        backGfloor.scale.setTo(1,1)
        backGfloor.anchor.setTo(0.5,0.5)
        backGfloor.alpha=1
        backgroundGroup.add(backGfloor)
        
        backGglass=game.add.sprite(game.world.centerX,100,'atlas.where',"STAINED GLASS")
        backGglass.scale.setTo(1,1)
        backGglass.anchor.setTo(0.5,0.5)
        backGglass.alpha=1
        game.physics.enable(backGglass, Phaser.Physics.ARCADE);
        backGglass.body.immovable=true
        backgroundGroup.add(backGglass)
        
        carpet=game.add.sprite(game.world.centerX+170,game.world.centerY+30,'atlas.where',"CARPET")
        carpet.scale.setTo(1,1)
        carpet.anchor.setTo(0.5,0.5)
        carpet.alpha=1
        backgroundGroup.add(carpet)
        
        backGglassReflection=game.add.sprite(game.world.centerX,430,'atlas.where',"REFLECTION")
        backGglassReflection.scale.setTo(1,1)
        backGglassReflection.anchor.setTo(0.5,0.5)
        backGglassReflection.alpha=1
        backgroundGroup.add(backGglassReflection)
        
        backGglassLight=game.add.sprite(game.world.centerX,280,'atlas.where',"LIGHT")
        backGglassLight.scale.setTo(1,1)
        backGglassLight.anchor.setTo(0.5,0.5)
        backGglassLight.alpha=1
        backgroundGroup.add(backGglassLight)
        
        
        
        backGflag1=game.add.sprite(game.world.centerX/2,120,'atlas.where',"FLAG")
        backGflag1.scale.setTo(1,1.3)
        backGflag1.anchor.setTo(0.5,0.5)
        backGflag1.alpha=1
        backgroundGroup.add(backGflag1)
        
        backGflag2=game.add.sprite(game.world.centerX*1.5,120,'atlas.where',"FLAG")
        backGflag2.scale.setTo(1,1.3)
        backGflag2.anchor.setTo(0.5,0.5)
        backGflag2.alpha=1
        backgroundGroup.add(backGflag2)
        
        nightStand=game.add.sprite(game.world.centerX+170,game.world.centerY-200,'atlas.where',"NIGHTSTAND")
        nightStand.scale.setTo(1,1)
        nightStand.anchor.setTo(0.5,0.5)
        nightStand.alpha=1
        game.physics.enable(nightStand, Phaser.Physics.ARCADE);
        nightStand.body.immovable=true
        backgroundGroup.add(nightStand)
        
        bed=game.add.sprite(game.world.centerX-180,game.world.centerY-150,'atlas.where',"BED")
        bed.scale.setTo(1,1)
        bed.anchor.setTo(0.5,0.5)
        bed.alpha=1
        game.physics.enable(bed, Phaser.Physics.ARCADE);
        bed.body.immovable = true;
        backgroundGroup.add(bed)
        
        puff=game.add.sprite(game.world.centerX+200,game.world.centerY+240,'atlas.where',"PUFF")
        puff.scale.setTo(1,1)
        puff.anchor.setTo(0.5,0.5)
        puff.alpha=1
        game.physics.enable(puff, Phaser.Physics.ARCADE);
        puff.body.immovable=true
        backgroundGroup.add(puff)
        
        table=game.add.sprite(game.world.centerX-220,game.world.centerY+260,'atlas.where',"TABLE")
        table.scale.setTo(1,1)
        table.anchor.setTo(0.5,0.5)
        table.alpha=1
        game.physics.enable(table, Phaser.Physics.ARCADE);
        table.body.immovable=true
        backgroundGroup.add(table)
        
        //User Interface
        
        board=game.add.sprite(game.world.centerX,game.world.height-80,'atlas.where',"BOARD")
        board.scale.setTo(1,1)
        board.anchor.setTo(0.5,0.5)
        board.alpha=1
        game.physics.enable(board, Phaser.Physics.ARCADE);
        UIGroup.add(board)
        
        Up=game.add.sprite(board.centerX-205,board.centerY,'atlas.where',"UP BTN")
        Up.scale.setTo(1,1)
        Up.anchor.setTo(0.5,0.5)
        Up.alpha=1
        Up.tag="up"
        Up.inputEnabled=true
        Up.events.onInputDown.add(onClick,this)
        UIGroup.add(Up)
        
        Left=game.add.sprite(board.centerX-95,board.centerY,'atlas.where',"LEFT BTN")
        Left.scale.setTo(1,1)
        Left.anchor.setTo(0.5,0.5)
        Left.alpha=1
        Left.tag="left"
        Left.inputEnabled=true
        Left.events.onInputDown.add(onClick,this)
        UIGroup.add(Left)
        
        Right=game.add.sprite(board.centerX+30,board.centerY,'atlas.where',"RIGHT BTN")
        Right.scale.setTo(1,1)
        Right.anchor.setTo(0.5,0.5)
        Right.alpha=1
        Right.tag="right"
        Right.inputEnabled=true
        Right.events.onInputDown.add(onClick,this)
        UIGroup.add(Right)
        
        Down=game.add.sprite(board.centerX+175,board.centerY,'atlas.where',"DOWN BTN")
        Down.scale.setTo(1,1)
        Down.anchor.setTo(0.5,0.5)
        Down.alpha=1
        Down.tag="down"
        Down.inputEnabled=true
        Down.events.onInputDown.add(onClick,this)
        UIGroup.add(Down)
        
        //Aqui colocamos los objetos
        
        objectsInScene[0]=game.add.sprite(bed.centerX,bed.centerY-50,'atlas.where',"DOLL")
        objectsInScene[0].scale.setTo(1,1)
        objectsInScene[0].anchor.setTo(0.5,0.5)
        objectsInScene[0].alpha=1
        objectsInScene[0].tag="DOLL"
        objectsInScene[0].name=0
        game.physics.enable(objectsInScene[0], Phaser.Physics.ARCADE);
        objectsInScene[0].body.immovable=true
        objectGroup.add(objectsInScene[0])
        
        objectsInSceneProxy[0]=game.add.sprite(bed.centerX+120,bed.centerY,'atlas.where',"DOLL")
        objectsInSceneProxy[0].scale.setTo(.3,.3)
        objectsInSceneProxy[0].anchor.setTo(0.5,0.5)
        objectsInSceneProxy[0].alpha=0
        objectsInSceneProxy[0].tag="DOLL"
        objectGroup.add(objectsInSceneProxy[0])
        
        objectsInScene[1]=game.add.sprite(nightStand.centerX-40,nightStand.centerY-50,'atlas.where',"YO YO")
        objectsInScene[1].scale.setTo(1,1)
        objectsInScene[1].anchor.setTo(0.5,0.5)
        objectsInScene[1].alpha=1
        objectsInScene[1].tag="YO YO"
        objectsInScene[1].name=1
        game.physics.enable(objectsInScene[1], Phaser.Physics.ARCADE);
        objectsInScene[1].body.immovable=true
        objectGroup.add(objectsInScene[1])
        
        objectsInSceneProxy[1]=game.add.sprite(nightStand.centerX-40,nightStand.centerY+100,'atlas.where',"YO YO")
        objectsInSceneProxy[1].scale.setTo(.5,.5)
        objectsInSceneProxy[1].anchor.setTo(0.5,0.5)
        objectsInSceneProxy[1].alpha=0
        objectsInSceneProxy[1].tag="YO YO"
        objectGroup.add(objectsInSceneProxy[1])
        
        objectsInScene[2]=game.add.sprite(carpet.centerX+70,carpet.centerY-100,'atlas.where',"BALL")
        objectsInScene[2].scale.setTo(1,1)
        objectsInScene[2].anchor.setTo(0.5,0.5)
        objectsInScene[2].alpha=1
        objectsInScene[2].tag="BALL"
        objectsInScene[2].name=2
        game.physics.enable(objectsInScene[2], Phaser.Physics.ARCADE);
        objectsInScene[2].body.immovable=true
        objectGroup.add(objectsInScene[2])
        
        objectsInSceneProxy[2]=game.add.sprite(carpet.centerX-30,carpet.centerY-100,'atlas.where',"BALL")
        objectsInSceneProxy[2].scale.setTo(.5,.5)
        objectsInSceneProxy[2].anchor.setTo(0.5,0.5)
        objectsInSceneProxy[2].alpha=0
        objectsInSceneProxy[2].tag="BALL"
        objectGroup.add(objectsInSceneProxy[2])
        
        objectsInScene[3]=game.add.sprite(carpet.centerX+70,carpet.centerY,'atlas.where',"PHOTO")
        objectsInScene[3].scale.setTo(1,1)
        objectsInScene[3].anchor.setTo(0.5,0.5)
        objectsInScene[3].alpha=1
        objectsInScene[3].tag="PHOTO"
        objectsInScene[3].name=3
        game.physics.enable(objectsInScene[3], Phaser.Physics.ARCADE);
        objectsInScene[3].body.immovable=true
        objectGroup.add(objectsInScene[3])
        
        objectsInSceneProxy[3]=game.add.sprite(carpet.centerX-30,carpet.centerY,'atlas.where',"PHOTO")
        objectsInSceneProxy[3].scale.setTo(.5,.5)
        objectsInSceneProxy[3].anchor.setTo(0.5,0.5)
        objectsInSceneProxy[3].alpha=0
        objectsInSceneProxy[3].tag="PHOTO"
        objectGroup.add(objectsInSceneProxy[3])
        
        
        objectsInScene[6]=game.add.sprite(board.centerX,board.centerY-120,'atlas.where',"TENNIS")
        objectsInScene[6].scale.setTo(1,1)
        objectsInScene[6].anchor.setTo(0.5,0.5)
        objectsInScene[6].alpha=1
        objectsInScene[6].tag="TENNIS"
        objectsInScene[6].name=6
        game.physics.enable(objectsInScene[6], Phaser.Physics.ARCADE);
        objectsInScene[6].body.immovable=true
        objectGroup.add(objectsInScene[6])
        
        objectsInSceneProxy[6]=game.add.sprite(board.centerX,board.centerY-170,'atlas.where',"TENNIS")
        objectsInSceneProxy[6].scale.setTo(.5,.5)
        objectsInSceneProxy[6].anchor.setTo(0.5,0.5)
        objectsInSceneProxy[6].alpha=0
        objectsInSceneProxy[6].tag="TENNIS"
        objectGroup.add(objectsInSceneProxy[6])
        
        character=game.add.spine(board.centerX,board.centerY-170,"thef")
        character.scale.setTo(1,1)
        character.alpha=1
        character.setSkinByName("normal");
        character.setAnimationByName(0,"IDLE",true)
        objectGroup.add(character)
        
        objectsInScene[4]=game.add.sprite(puff.centerX-20,puff.centerY-50,'atlas.where',"STUFFED")
        objectsInScene[4].scale.setTo(1,1)
        objectsInScene[4].anchor.setTo(0.5,0.5)
        objectsInScene[4].alpha=1
        objectsInScene[4].tag="STUFFED"
        objectsInScene[4].name=4
        objectGroup.add(objectsInScene[4])
        
        objectsInSceneProxy[4]=game.add.sprite(puff.centerX-100,puff.centerY-50,'atlas.where',"STUFFED")
        objectsInSceneProxy[4].scale.setTo(.5,.5)
        objectsInSceneProxy[4].anchor.setTo(0.5,0.5)
        objectsInSceneProxy[4].alpha=0
        objectsInSceneProxy[4].tag="STUFFED"
        objectGroup.add(objectsInSceneProxy[4])
        
        objectsInScene[5]=game.add.sprite(table.centerX+20,table.centerY-60,'atlas.where',"LAMP")
        objectsInScene[5].scale.setTo(1,1)
        objectsInScene[5].anchor.setTo(0.5,0.5)
        objectsInScene[5].alpha=1
        objectsInScene[5].tag="LAMP"
        objectsInScene[5].name=5
        game.physics.enable(objectsInScene[5], Phaser.Physics.ARCADE);
        objectsInScene[5].body.immovable=true
        objectGroup.add(objectsInScene[5])
        
        objectsInSceneProxy[5]=game.add.sprite(table.centerX+100,table.centerY-60,'atlas.where',"LAMP")
        objectsInSceneProxy[5].scale.setTo(.5,.5)
        objectsInSceneProxy[5].anchor.setTo(0.5,0.5)
        objectsInSceneProxy[5].alpha=0
        objectsInSceneProxy[5].tag="LAMP"
        objectGroup.add(objectsInSceneProxy[5])
        
        characterProxy=game.add.sprite(game.world.centerX,game.world.centerY+100,'atlas.where',"FRONT")
        characterProxy.scale.setTo(.7,.3)
        characterProxy.anchor.setTo(0.5,0.5)
        characterProxy.alpha=0
        characterProxy.tag="char"
        game.physics.enable(characterProxy, Phaser.Physics.ARCADE);
        characterProxy.body.collideWorldBounds = true;
        objectGroup.add(characterProxy)
        
        
        qGlobe=game.add.sprite(character.centerX,character.centerY-320,'atlas.where',"QUESTION")
        qGlobe.scale.setTo(1,1)
        qGlobe.anchor.setTo(0.5,0.5)
        qGlobe.alpha=0
        objectGroup.add(qGlobe)
        
        objectsToFind=game.add.sprite(qGlobe.centerX-20,qGlobe.centerY-20,'atlas.where',"DOLL_Q")
        objectsToFind.scale.setTo(1,1)
        objectsToFind.anchor.setTo(0.5,0.5)
        objectsToFind.alpha=0
        objectGroup.add(objectsToFind)
        
        //Coins
        for(var putingCoins=0;putingCoins<coins.length;putingCoins++){
            coins[putingCoins]=game.add.sprite(objectsInScene[putingCoins].x,objectsInScene[putingCoins].y, "coin")
            coins[putingCoins].anchor.setTo(.5)
            coins[putingCoins].scale.setTo(.5)
            coins[putingCoins].animations.add('coin');
            coins[putingCoins].animations.play('coin', 24, true);
            coins[putingCoins].alpha=0
        }
        
        
        positionTimer()
        
    }
	
    function startGlobe(){
        
        var whichObject=game.rnd.integerInRange(0,6)
        
        objectsToFind.loadTexture("atlas.where",objects[whichObject]+"_Q")
        objectsToFind.tag=objects[whichObject]
        
        
        game.add.tween(qGlobe).to({alpha:1},1000,Phaser.Easing.linear,true, 250).onComplete.add(function(){
            game.add.tween(objectsToFind).to({alpha:1},900,Phaser.Easing.linear,true, 250).onComplete.add(function(){
                 startTimer(dificulty)
            })
        })
        game.add.tween(qGlobe.scale).to({x:1.1, y:1.1}, (620), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
        game.add.tween(objectsToFind.scale).to({x:1.1, y:1.1}, (620), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
        
        
    }
    
    function onSelect(obj){
         
        
        if(!passingLevel){
            passingLevel=true
            characterProxy.position.x=game.world.centerX
            characterProxy.position.y=game.world.centerY+100
            game.add.tween(qGlobe).to({alpha:0},300,Phaser.Easing.linear,true, 250)
            game.add.tween(objectsToFind).to({alpha:0},300,Phaser.Easing.linear,true, 250).onComplete.add(function (){
                    
                    
                    
                        
                    if(obj.tag==objectsToFind.tag){
                        console.log(parseInt(objectsInScene[].name))
                        game.add.tween(coins[objectsInScene.name]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                            game.add.tween(coins[objectsInScene.name]).to({x:objectsInScene[objectsInScene.name].centerX,y:objectsInScene[objectsInScene.name].centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                                game.add.tween(coins[objectsInScene.name]).to({x:pointsBar.centerX,y:pointsBar.centerY},200,Phaser.Easing.inOut,true)
                                    game.add.tween(coins[objectsInScene.name]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                                        coins[correctNumber].x=objectsInScene[objectsInScene.name].centerX
                                        coins[correctNumber].y=objectsInScene[objectsInScene.name].centerY
                                        addPoint(1)
                                        nextLevel()
                                        passingLevel=false
                            })
                        })
                        
                        
                    }else{
                        missPoint()
                        reset()
                        passingLevel=false
                    }
             })
        }
    }
    
    
    function onClick(obj){
        
        sound.play("pop")
        
        
        if(obj.tag=="left" && !btnActive){
            characterProxy.body.velocity.x = -100;
            character.scale.setTo(-1,1)
            btnActive=true
            character.setAnimationByName(0,"SIDE_WALK",false)
            game.time.events.add(950, function(){
                character.setAnimationByName(0,"IDLE",true)
                characterProxy.body.velocity.x = 0;
                characterProxy.body.velocity.y = 0;
                character.scale.setTo(1,1)
                btnActive=false
            })
            
        }
        if(obj.tag=="right" && !btnActive){
            character.scale.setTo(1,1)
            btnActive=true
            characterProxy.body.velocity.x = +100;
            character.setAnimationByName(0,"SIDE_WALK",false)
            game.time.events.add(950, function(){
                character.setAnimationByName(0,"IDLE",true)
                characterProxy.body.velocity.x = 0;
                characterProxy.body.velocity.y = 0;
                btnActive=false
            })
        }
        if(obj.tag=="up" && !btnActive){
            character.scale.setTo(1,1)
            btnActive=true
            characterProxy.body.velocity.y = -100;
            character.setAnimationByName(0,"BACK_WALK",false)
            game.time.events.add(900, function(){
                character.setAnimationByName(0,"IDLE",true)
                characterProxy.body.velocity.y = 0;
                characterProxy.body.velocity.x = 0;
                btnActive=false
            })
        }
        if(obj.tag=="down" && !btnActive){
            character.scale.setTo(1,1)
            btnActive=true
            characterProxy.body.velocity.y = +100;
            character.setAnimationByName(0,"FRONT_WALK",false)
            game.time.events.add(950, function(){
                character.setAnimationByName(0,"IDLE",true)
                characterProxy.body.velocity.y = 0;
                characterProxy.body.velocity.x = 0;
                btnActive=false
            })
        }
       
        //nextLevel()
    }
    
	function update(){
        
        
        if(startGame){
        
            //Posiciones, posiciones
            
            
            character.position.x=characterProxy.centerX
            character.position.y=characterProxy.centerY+50
            qGlobe.position.x=characterProxy.centerX
            qGlobe.position.y=characterProxy.centerY-200
            objectsToFind.position.x=qGlobe.centerX-20
            objectsToFind.position.y=qGlobe.centerY-20
                
            //CHECKOVERLAPS
            
            for(var checkOver=0;checkOver<objects.length;checkOver++){
                if (checkOverlap(characterProxy, objectsInSceneProxy[checkOver]) && !activeObject[checkOver])
                {
                    game.add.tween(objectsInScene[checkOver]).to({angle:45}, (620), Phaser.Easing.Cubic.inOut, true).yoyo(true).loop(true)
                    objectsInScene[checkOver].inputEnabled=true
                    objectsInScene[checkOver].events.onInputDown.add(onSelect,this)

                    activeObject[checkOver]=true
                }
                else if(!checkOverlap(characterProxy, objectsInSceneProxy[checkOver]))
                {
                    game.add.tween(objectsInScene[checkOver]).to({angle:0}, (620), Phaser.Easing.Cubic.Out, true)
                    objectsInScene[checkOver].inputEnabled=false
                    activeObject[checkOver]=false
                }
            }
            for(var collideObj=0;collideObj<objects.length;collideObj++){
               game.physics.arcade.collide(characterProxy, objectsInScene[collideObj]);
            }
            
            game.physics.arcade.collide(characterProxy, bed);
            game.physics.arcade.collide(characterProxy, table);
            game.physics.arcade.collide(characterProxy, nightStand);
            game.physics.arcade.collide(characterProxy, backGglass);
            game.physics.arcade.collide(characterProxy, puff);
            
        }

	}
    
        function checkOverlap(spriteA, spriteB) {

            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }

       function positionTimer(){
           clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
           clock.scale.setTo(.7)
           timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
           timeBar.scale.setTo(8,.45)
           backgroundGroup.add(clock)
           backgroundGroup.add(timeBar)
           timeBar.alpha=1
           clock.alpha=1
       
       
       }
       function stopTimer(){
           tweenTiempo.stop()
           tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                objects[0]="DOLL"
                objects[1]="BALL"
                objects[2]="LAMP"
                objects[3]="TENNIS"
                objects[4]="PHOTO"
                objects[5]="YO YO"
                objects[6]="STUFFED"
                startGlobe()
           })
       }
       function startTimer(time){
               tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
               tweenTiempo.onComplete.add(function(){
               missPoint()
               startGame=false
               reset()
               })
       }
    
    function reset(){
            
        dificulty=100000
        
        objects[0]="DOLL"
        objects[1]="YO YO"
        objects[2]="BALL"
        objects[3]="PHOTO"
        objects[4]="STUFFED"
        objects[5]="LAMP"
        objects[6]="TENNIS"
        
        for(var reOrder=0; reOrder<7;reOrder++){
            objectsInScene[reOrder].loadTexture("atlas.where",objects[reOrder])
            objectsInScene.tag=objects[reOrder]
        }
        
        stopTimer()
        
            
    }
    
    function nextLevel(){
        
        dificulty-=100
        characterProxy.position.x=game.world.centerX
        characterProxy.position.y=game.world.centerY+100
        var actualObject=0
        var moving=0
        objects[0]="DOLL"
        objects[1]="BALL"
        objects[2]="LAMP"
        objects[3]="TENNIS"
        objects[4]="PHOTO"
        objects[5]="YO YO"
        objects[6]="STUFFED"
        
        while(moving<7){
            
            actualObject=game.rnd.integerInRange(0,6)
            console.log(objects[actualObject])
            if(objects[actualObject]!="noObject"){
                
                objectsInScene[moving].loadTexture("atlas.where",objects[actualObject])
                objectsInScene[moving].tag=objects[actualObject]
                objects[actualObject]="noObject"
                moving++
            }
        }
        stopTimer()
    
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
        particle.makeParticles('atlas.where',key);
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

				particle.makeParticles('atlas.where',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.where','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.where','smoke');
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
		name: "whereIsMy",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
//            whereSong = game.add.audio('whereSong')
//            game.sound.setDecodedCallback(whereSong, function(){
//                whereSong.loopFull(0.6)
//            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
			
			buttons.getButton(whereSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()