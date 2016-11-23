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
            {	name: "combo",
				file: "sounds/combo.mp3"},
            {	name: "flip",
				file: "sounds/flipCard.mp3"},
            {	name: "swipe",
				file: "sounds/swipe.mp3"},
            {	name: "wrong",
				file: "sounds/wrong.mp3"},
            {	name: "right",
				file: "sounds/rightChoice.mp3"},
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

            particlesGood.makeParticles('atlas.costena',key);
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
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.costena',key)
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
        game.time.events.add(500, showCards , this);
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
    
    function returnCard(card){
        
        createPart('wrong',card)
        var scaleTween = game.add.tween(card.scale).to({x: 0}, CARD_TIME, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            changeImage(0,card)
            scaleTween = game.add.tween(card.scale).to({x: 1},CARD_TIME, Phaser.Easing.Cubic.Out,true)
            scaleTween.onComplete.add(function(){
                if(lives > 0){
                    gameActive = true
                    card.children[0].pressed = false
                }
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
                //gameActive = true
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
    
    function setCombo(obj,comboNumber){
        
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, 'Combo ' + comboNumber + 'X', fontStyle)
        pointsText.x = obj.x
        pointsText.y = obj.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y - 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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
        
        var scaleTween = game.add.tween(parent.scale).to({x: 0}, CARD_TIME, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            changeImage(1,parent)
            scaleTween = game.add.tween(parent.scale).to({x: 1},CARD_TIME, Phaser.Easing.Cubic.Out,true)
            scaleTween.onComplete.add(function(){
                arrayComparison[arrayComparison.length] = obj.tag
                if(arrayComparison.length < 2){
                    lastObj = obj
                    if(lives > 0){
                        //gameActive = true
                    }
                }else{
                    var addNumber = 1
                    arrayComparison = []
                    if(lastObj.tag == obj.tag){
                        comboCount++
                        if(comboCount>1){
                            sound.play("combo")
                            setCombo(obj.parent,comboCount)
                            addNumber = comboCount
                        }
                        winCard(lastObj.parent)
                        winCard(obj.parent)
                        addPoint(addNumber)
                    }else{
                        comboCount = 0
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
        
        var pivot1 = game.world.centerX - 98
        var pivot2 = game.world.centerX - 187
        
        var pivotX = pivot1
        if (cardsNumber > 4){
            pivotX = pivot2
        }
        
        var pivotY = game.world.centerY - 100
        if (cardsNumber > 6){
            pivotY = game.world.centerY - 220
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
            
            if(i == 9 && cardsNumber == 10){
                group.x = game.world.centerX
            }
            
        }
    }
    
    function flipCard(card, delay,lastOne){
        
        var last = lastOne || false
        var timeFlip = 150
        game.time.events.add(timeFlip + delay,function(){
            sound.play("flip")
            changeImage(0,card)
            game.add.tween(card.scale).to({x: 1}, timeFlip, Phaser.Easing.linear, true,0)
            
            if(last){
                gameActive = true
            }
            //gameActive = true
        })
    }
    
    function showCards(){
        
        var timeFlip = 100
        gameActive = false
        var delay = 0
        for(var i = 0;i<cardsGroup.length;i++){
            
            delay+=timeFlip
            changeImage(1,cardsGroup.children[i])
            game.add.tween(cardsGroup.children[i].scale).to({x: 1}, 500, Phaser.Easing.linear, true, delay)
            
            game.time.events.add(delay,function(){
                sound.play("flip")
            } , this);
        }
        
        var delay = 0
        var lastOne = false
        game.time.events.add(delay + (cardsGroup.length * timeFlip) + 600,function(){
            for(var i = 0;i<cardsGroup.length;i++){
                
                delay+=timeFlip
                var scaleTween = game.add.tween(cardsGroup.children[i].scale).to({x: 0}, timeFlip, Phaser.Easing.linear, true,delay)
                if(i==cardsGroup.length - 1){
                    lastOne = true
                }
                flipCard(cardsGroup.children[i], delay,lastOne)
                
            }
        
        } , this);
        
    }
    
    /*function showCards(){
        
        var delay = 0
        for(var i = 0;i<cardsGroup.length;i++){
            
            delay+=200
            game.add.tween(cardsGroup.children[i].scale).to({x: 1}, 500, Phaser.Easing.linear, true, delay)
            
            game.time.events.add(delay,function(){
                sound.play("flip")
            } , this);
        }
    }*/
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.costena','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.costena','life_box')

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

			sceneloader.show("result")
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