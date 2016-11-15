var mainGame = function(){
    
    var localizationData = {
		"EN":{
            "language":"en",
			"assetReady":"readyEn",
			"assetGo":"goEn",
			"assetExcellent":"excEn",
            "assetGiveUp":"giveUpEn"
		},

		"ES":{
            "languague":"es",
			"assetReady":"readyEs",
			"assetGo":"goEs",
			"assetExcellent":"excEs",
            "assetGiveUp":"giveUpEs",
            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.tapatopo",
                json: "images/tapatopo/atlas.json",
                image: "images/tapatopo/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/jungle/fondo.png"},
		],
		sounds: [
            {	name: "punch1",
				file: "sounds/punch1.mp3"},
            {	name: "punch2",
				file: "sounds/punch2.mp3"},
            {	name: "punch3",
				file: "sounds/punch3.mp3"},
            {	name: "explode",
				file: "sounds/explode.mp3"},
		],
	}
        
    var SPEED = 7
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OFFSET_PZ = 73 * 1.5
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    
    var gameSong = null
    var levelNumber = 0
    var scaleSpeed = null
    var timeBar = null
    var buttonPressed
    var lastObj
    var pressed
	var sceneGroup = null
    var answersGroup = null
    var gameActive = true
    var pointsBar = null
    var throwTime = null
    var lives = null
    var heartsGroup = null
    var buddy = null    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        lives = 1
        buttonPressed = false
        loadSounds()
        levelNumber = 1
        
	}

    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

		
        gameActive = true
        
        sceneGroup.alpha = 0
        
        var sceneTween = game.add.tween(sceneGroup).to({alpha:1},500,Phaser.Easing.linear,true)
        
        sceneTween.onComplete.add(function(){
            setLevel(levelNumber)
        })
        
        
        
        //timer.start()
        //game.time.events.add(throwTime *0.1, dropObjects , this);
        //objectsGroup.timer.start()

    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
    function createPart(key,obj,offX, offY,much){
        
        var offsetX = offX || 0
        var offsetY = offY || 0
        
        var particlesNumber = 2
        
        tooMuch = much || true
        //console.log('fps ' + game.time.fps)
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
        if( tooMuch == false){ 
            
        
        }else{
            key+='Part'
            var particle = sceneGroup.create(posX,posY - offsetY,'atlas.jungle',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0

        var exp = sceneGroup.create(0,0,'atlas.jungle','explosion')
        exp.x = obj.x
        exp.y = obj.y + offY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(4,4)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.jungle','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y + offsetY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function stopGame(){
        
        gameSong.stop()
        //objectsGroup.timer.pause()
        gameActive = false
        buddy.setAnimationByName(0,"HIT_COCONUT",false)
        
        lives--
        heartsGroup.text.setText(lives)
        
        setExplosion(characterGroup,-100)
        
        sound.play("explode")
        
        
        var scale = 1
        if(characterGroup.isLeft){scale = -1}
        
        
        game.add.tween(characterGroup).to({x:game.world.centerX},300,Phaser.Easing.linear,true)
        game.add.tween(characterGroup.scale).to({x:3 * scale,y:3},300,Phaser.Easing.linear,true)
        
        game.add.tween(characterGroup).to({y:characterGroup.y + 200},1000,Phaser.Easing.linear,true,500)
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true,pointsBar.number)

			sceneloader.show("result")
		})
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.jungle','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.9
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(1,0)
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

        var heartsImg = group.create(0,0,'atlas.jungle','life_box')
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
    
    function addPoint(){
        
        //sound.play("pop")
        
        addNumberPart(pointsBar.text,'+1')
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number % 15 == 0){
            addLevel()
        }
        
    }
    
    function update(){
        
        if(!gameActive){
            return
        }
        
        
    }
    
    function preload(){
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;

        game.load.spine('kong', "images/spines/skeleton.json");
        
        game.load.audio('timberMan', 'sounds/timberMan.mp3');
        
        
    }
    
	return {
		assets: assets,
        preload: preload,
        update:update,
		name: "mainGame",
		create: function(event){

			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(0,0,'fondo')
            background.width = game.world.width
            background.height = game.world.height
            
            piecesGroup = game.add.group()
            sceneGroup.add(piecesGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX + 200
            characterGroup.y = background.height - 270
            sceneGroup.add(characterGroup)
            
            /*buddy = game.add.spine(0,0, "kong");
            buddy.scale.setTo(1,1)
            buddy.setAnimationByName(0, "IDLE", true);
            buddy.setSkinByName('normal');
            characterGroup.add(buddy)*/
            
            initialize()
            animateScene()
            
            gameSong = game.add.audio('timberMan')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.5)
            }, this);
            
            createHearts()
            createPointsBar()
            createControls()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()