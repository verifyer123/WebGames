
var soundsPath = "../../shared/minigames/sounds/"
var dojo = function(){
    
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
                name: "atlas.dojo",
                json: "images/dojo/atlas.json",
                image: "images/dojo/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/dojo/fondo.png"},
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "combo",
				file: soundsPath + "combo.mp3"},
            {	name: "flip",
				file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
		],
    }
    
    
    var CARD_TIME = 300
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var arrayComparison = null
    var lastObj
    var timer
    var cardsNumber
    var comboCount

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        cardsNumber = 4
        lives = 5
        arrayComparison = []
        comboCount = 0
        
        loadSounds()
        
	}
    
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        if(game.device.desktop == true){ 
            
            particlesNumber = 4
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.dojo',key);
            particlesGood.minParticleSpeed.setTo(-200, -50);
            particlesGood.maxParticleSpeed.setTo(200, -100);
            particlesGood.minParticleScale = 0.2;
            particlesGood.maxParticleScale = 1;
            particlesGood.gravity = 150;
            particlesGood.angularDrag = 30;

            particlesGood.x = obj.x;
            particlesGood.y = obj.y;
            particlesGood.start(true, 1000, null, particlesNumber);

            game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
            sceneGroup.add(particlesGood)

        }else{
            key+='Part'
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.dojo',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        //gameActive = true
        //game.time.events.add(500, showCards , this);

    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addLive(){
        
        sound.play("right")
        
        lives++;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(heartsGroup.text,'+1')
        
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
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function addPoint(number){
        
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number)
        
    }
    
    function inputCard(obj){

        if(gameActive == false){ 
            return
        }
        
        if( obj.pressed == true){
            return
        }
        
        //gameActive = false
        obj.pressed = true
        var parent = obj.parent
        
        sound.play("flip")
    }
    
    function createCards(){
        
        var pivotX = game.world.centerX - 200
        var pivotY = game.world.centerY - 150
        for(var i = 0; i<9;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            cardsGroup.add(group)
            
            var image = group.create(0,0,'atlas.dojo','panelClear')
            image.anchor.setTo(0.5,0.5)
            
            var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            
            var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
            group.add(pointsText)
            
            pivotX+= 100
            
            if((i+1) % 3 == 0){
                pivotX = game.world.centerX - 200
                pivotY+= 100
            }
            
        }
        
    }
    
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.dojo','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.3
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

        var heartImg = group.create(0,0,'atlas.dojo','life_box')

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
                
        //objectsGroup.timer.pause()
        gameActive = false
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number)

			amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }

	return {
		assets: assets,
		name: "dojo",
		create: function(event){

            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            initialize()
            
            cardsGroup = game.add.group()
            sceneGroup.add(cardsGroup)
            
            createHearts()
            createPointsBar()
            createCards()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()