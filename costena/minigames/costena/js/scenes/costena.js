var costena = function(){
    
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
                name: "atlas.costena",
                json: "images/costena/atlas.json",
                image: "images/costena/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/costena/fondo.png"},
		],
		sounds: [
            {	name: "pop",
				file: "sounds/magic.mp3"},
            {	name: "flip",
				file: "sounds/flipCard.mp3"},
            {	name: "swipe",
				file: "sounds/swipe.mp3"},
            {	name: "wrong",
				file: "sounds/wrong.mp3"},
            {	name: "ready_es",
				file: "sounds/ready_es.mp3"},
            {	name: "go_es",
				file: "sounds/go_es.mp3"},
            {	name: "right",
				file: "sounds/rightChoice.mp3"},
		],
    }
    
    
    var CARD_TIME = 400
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var arrayComparison = null
    var lastObj
    var timer
    var cardsNumber

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        cardsNumber = 4
        lives = 10
        arrayComparison = []
        
        loadSounds()
        
	}
    
    
    function createPart(key,obj){
            
        var particlesNumber = 4

        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.costena',key);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.2;
        particlesGood.maxParticleScale = 1;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y ;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

		var blackScreen = new Phaser.Graphics(game)
		blackScreen.alpha = 0.3
		blackScreen.beginFill(0x0)
		blackScreen.drawRect(0, 0, game.width, game.height)
		blackScreen.endFill()

		startGroup.add(blackScreen)
        
        
		var readySign = startGroup.create(0, 0, "atlas.costena", 'readyEs')
		readySign.alpha = 0
		readySign.anchor.setTo(0.5, 0.5)
		readySign.x = game.world.centerX
		readySign.y = game.world.centerY - 50
		startGroup.add(readySign)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        
		var tweenSign = game.add.tween(readySign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Cubic.Out, true,500)
        tweenSign.onComplete.add(function(){
            
            game.add.tween(readySign).to({y: game.world.centerY - 100, alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            
            sound.play("ready_es")
            
            var goSign = startGroup.create(0, 0, "atlas.costena", 'goEs')
            goSign.alpha = 0
            goSign.anchor.setTo(0.5, 0.5)
            goSign.x = game.world.centerX
            goSign.y = game.world.centerY - 50
            startGroup.add(goSign)
            
            var tweenSign = game.add.tween(goSign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Cubic.Out, true, 750)
            tweenSign.onComplete.add(function(){
                sound.play("go_es")
                
                var finalTween = game.add.tween(goSign).to({y: game.world.centerY - 100, alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
                game.add.tween(startGroup).to({ alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
                finalTween.onComplete.add(function(){
                    gameActive = true
                    showCards()
                    //timer.start()
                    //game.time.events.add(throwTime *0.1, dropObjects , this);
                    //objectsGroup.timer.start()
                })
            })
        })
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function returnCard(card){
        
        createPart('wrong',card)
        var scaleTween = game.add.tween(card.scale).to({x: 0}, CARD_TIME, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            changeImage(0,card)
            scaleTween = game.add.tween(card.scale).to({x: 1},CARD_TIME, Phaser.Easing.Cubic.Out,true)
            scaleTween.onComplete.add(function(){
                gameActive = true
                card.children[0].pressed = false
            })
        })
    }
    
    function winCard(card){
        
        sound.play("pop")
        createPart('star',card)
        var scaleTween = game.add.tween(card.scale).to({x: 1.1, y:1.1}, 300, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            scaleTween = game.add.tween(card.scale).to({x: 1, y:1},300, Phaser.Easing.Cubic.Out,true)
            scaleTween.onComplete.add(function(){
                gameActive = true
                var alphaTween = game.add.tween(card).to({alpha:0},500, Phaser.Easing.Cubic.Out,true)
                game.add.tween(card.scale).to({x: 0, y:0}, 500, Phaser.Easing.Cubic.In, true)
                alphaTween.onComplete.add(function(){
                    cardsGroup.remove(card)
                    if(cardsGroup.length == 0){
                        if(cardsNumber < 12){cardsNumber+=2}
                        addLive()
                        createCards(cardsNumber)
                        showCards()
                    }
                })
                
            })
        })
    }
    
    function addLive(){
        
        sound.play("right")
        
        lives++;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
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
        
    }
    
    function addPoint(){
        
        pointsBar.number++;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
    }
    
    function inputCard(obj){

        if(gameActive == false || obj.pressed == true){
            return
        }
        
        //gameActive = false
        obj.pressed = true
        var parent = obj.parent
        
        var scaleTween = game.add.tween(parent.scale).to({x: 0}, CARD_TIME, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            changeImage(1,parent)
            scaleTween = game.add.tween(parent.scale).to({x: 1},CARD_TIME, Phaser.Easing.Cubic.Out,true)
            scaleTween.onComplete.add(function(){
                arrayComparison[arrayComparison.length] = obj.tag
                if(arrayComparison.length < 2){
                    lastObj = obj
                    gameActive = true
                }else{
                    arrayComparison = []
                    if(lastObj.tag == obj.tag){
                        winCard(lastObj.parent)
                        winCard(obj.parent)
                        addPoint()
                    }else{
                        missPoint()
                        sound.play("wrong")
                        returnCard(lastObj.parent)
                        returnCard(obj.parent)
                    }
                }
            })
        })
        
        sound.play("flip")
    }
    
    function createCards(){
        
        var pivot1 = game.world.centerX - 75
        var pivot2 = game.world.centerX - 150
        
        var pivotX = pivot1
        if (cardsNumber > 4){
            pivotX = pivot2
        }
        
        var pivotY = game.world.centerY - 100
        if (cardsNumber > 6){
            pivotY = game.world.centerY - 175
        }
        
        var itemsNames = ['chiles','duraznos','frijoles','pinas','salsaRoja','salsaVerde']
        
        Phaser.ArrayUtils.shuffle(itemsNames)
        
        var cardsToUse = []
        for(var i = 0;i< cardsNumber * 0.5; i++){
            cardsToUse[i] = itemsNames[i]
            cardsToUse[i + cardsNumber * 0.5] = itemsNames[i]
        }
        
        Phaser.ArrayUtils.shuffle(cardsToUse)
        
        for(var i = 0; i < cardsNumber; i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            group.scale.x = 0
            cardsGroup.add(group)
            
            var cardBack = group.create(0,0,'atlas.costena','atras')
            cardBack.anchor.setTo(0.5,0.5)
            cardBack.pressed = false 
            cardBack.tag = cardsToUse[i]
            
            var cardFront = group.create(0,0,'atlas.costena',cardsToUse[i])
            cardFront.anchor.setTo(0.5,0.5)
            
            cardBack.inputEnabled = true
            cardBack.events.onInputDown.add(inputCard)
            
            changeImage(0,group)
            
            pivotX+= cardBack.width * 1.2
            
            if(cardsNumber == 4 && i == 1){
                pivotX = pivot1
                pivotY+= cardBack.height * 1.2
            }else if(cardsNumber > 4 && (i + 1) % 3 == 0){
                pivotX = pivot2
                pivotY+= cardBack.height * 1.2
            }
            
        }
    }
    
    function showCards(){
        
        var delay = 0
        for(var i = 0;i<cardsGroup.length;i++){
            
            delay+=200
            game.add.tween(cardsGroup.children[i].scale).to({x: 1}, 500, Phaser.Easing.linear, true, delay)
            
            game.time.events.add(delay,function(){
                sound.play("flip")
            } , this);
        }
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.costena','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height*=1
    
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
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.costena','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "27px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 16, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 4
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function stopGame(win){
                
        //objectsGroup.timer.pause()
        gameActive = false
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("resultCostena")
			resultScreen.setScore(true, pointsBar.number)

			sceneloader.show("resultCostena")
		})
    }

	return {
		assets: assets,
		name: "costena",
		create: function(event){

            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(0,0,'fondo')
            background.width = game.world.width
            background.height = game.world.height
            
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