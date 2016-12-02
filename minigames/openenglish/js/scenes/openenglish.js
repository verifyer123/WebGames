var soundsPath = "../../shared/minigames/sounds/"
var openenglish = function(){
        
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
                name: "atlas.openEnglish_common",
                json: "images/openEnglish/atlas_common.json",
                image: "images/openEnglish/atlas_common.png",
            },
            {   
                name: "atlas.openEnglish_cards",
                json: "images/openEnglish/atlas_cards.json",
                image: "images/openEnglish/atlas_cards.png",
            },
        ],
        images: [
            /*{   name:"fondo",
				file: "images/openEnglish/fondo.jpg"},*/
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
    var turnCount = null
    
    var cardsList = [
         [
            [
                ['bebe','leche'],
                ['uvas','gato'],
                ['raton','camioneta'],
                ['manzana','galleta'],
                ['pelota','pollo'],
                ['carro','naranja'],
                ['arbol','casa'],
                ['pajaro','cuchara'],
                ['tenedor','beso'],
                ['detener','perro'],
            ],
            [
                ['Baby','Milk'],
                ['Grapes','Cat'],
                ['Mouse','Wagon'],
                ['Apple','Cookie'],
                ['Ball','Chicken'],
                ['Car','Orange'],
                ['Tree','House'],
                ['Bird','Spoon'],
                ['Fork','Kiss'],
                ['Stop','Dog'],
            ],
        ],
        [
            [
                ['brocha','caballo'],
                ['caiman','caramelo'],
                ['cereal','cobija'],
                ['conejito','hermana'],
                ['hijo','mariposa'],
                ['mesa','planta'],
                ['silla','sol'],
                ['trabajo','venado'],
            ],
            [
                ['Brush','Horse'],
                ['Alligator','Candy'],
                ['Cereal','Blanket'],
                ['Rabbit','Sister'],
                ['Son','Butterfly'],
                ['Table','Plant'],
                ['Chair','Sun'],
                ['Work','Deer'],
            ],
        ],
        [
            [
                ['arandano','berenjena'],
                ['bombero','casa-de-arbol'],
                ['cesto','choque'],
                ['cierre','fresa'],
                ['ganso','globo-terraqueo'],
                ['lluvia','lobo'],
                ['munecodenieve','oveja'],
                ['tormentadenieve','trampa'],
                ['triciclo','sandia'],
            ],
            [
                ['Cranberry','Eggplant'],
                ['Firefighter','Treehouse'],
                ['Basket','Crash'],
                ['Zipper','Strawberry'],
                ['Goose','Globe'],
                ['Rain','Wolf'],
                ['Snowman','Sheep'],
                ['Snow storm','Trap'],
                ['Tricycle','Watermelon'],
            ],
        ],
    ]

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        turnCount = 1
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

            particlesGood.makeParticles('atlas.openEnglish_common',key);
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
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.openEnglish_common',key)
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

		var blackScreen = new Phaser.Graphics(game)
		blackScreen.alpha = 0.3
		blackScreen.beginFill(0x0)
		blackScreen.drawRect(0, 0, game.width, game.height)
		blackScreen.endFill()

		startGroup.add(blackScreen)
        
        
		var readySign = startGroup.create(0, 0, "atlas.openEnglish_common", 'readyEs')
		readySign.alpha = 0
		readySign.anchor.setTo(0.5, 0.5)
		readySign.x = game.world.centerX
		readySign.y = game.world.centerY - 50
		startGroup.add(readySign)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

            
        var goSign = startGroup.create(0, 0, "atlas.openEnglish_common", 'goEs')
        goSign.alpha = 0
        goSign.anchor.setTo(0.5, 0.5)
        goSign.x = game.world.centerX
        goSign.y = game.world.centerY - 50
        startGroup.add(goSign)

        var tweenSign = game.add.tween(goSign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Cubic.Out, true, 750)
        tweenSign.onComplete.add(function(){
            //sound.play("go_es")

            var finalTween = game.add.tween(goSign).to({y: game.world.centerY - 100, alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            game.add.tween(startGroup).to({ alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            finalTween.onComplete.add(function(){
                //gameActive = true
                showCards()
                setQuestionIndex(turnCount-1)
                //timer.start()
                //game.time.events.add(throwTime *0.1, dropObjects , this);
                //objectsGroup.timer.start()
            })
        })
    }
    
    function setQuestionIndex(index){
        
        var obj = pointsGroup.children[index]
        changeImage(1,obj)
        
        /*if(index > 0){
            changeImage(2,pointsGroup.children[index - 1])
        }*/
        
        var scaleTween = game.add.tween(obj.scale).to({x:1.3,y:1.3}, 200, Phaser.Easing.linear, true)
        
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 200, Phaser.Easing.linear, true)
                        
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
            scaleTween = game.add.tween(card.scale).to({x: card.initScale},CARD_TIME, Phaser.Easing.Cubic.Out,true)
            scaleTween.onComplete.add(function(){
                if(lives > 0){
                    gameActive = true
                    card.children[0].pressed = false
                }
            })
        })
    }
    
    function winCard(card){
        
        var origScale = card.scale.x
        sound.play("pop")
        createPart('star',card)
        var scaleTween = game.add.tween(card.scale).to({x: 1.1, y:1.1}, 300, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            scaleTween = game.add.tween(card.scale).to({x: origScale, y:origScale},300, Phaser.Easing.Cubic.Out,true)
            scaleTween.onComplete.add(function(){
                //gameActive = true
                var alphaTween = game.add.tween(card).to({alpha:0},500, Phaser.Easing.Cubic.Out,true)
                game.add.tween(card.scale).to({x: 0, y:0}, 500, Phaser.Easing.Cubic.In, true)
                alphaTween.onComplete.add(function(){
                    cardsGroup.remove(card)
                    if(cardsGroup.length == 0){
                        if(cardsNumber < 8 && turnCount % 2 == 0 ){cardsNumber+=2}
                        
                        
                        if(turnCount == 10){
                            stopGame()
                        }else{
                            
                            addCorrect()
                            setQuestionIndex(turnCount)
                            turnCount++
                            
                            addLive()
                            createCards()
                            showCards()
                            
                        }
                        
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
        
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#064289", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, 'Combo ' + comboNumber + 'X', fontStyle)
        pointsText.x = obj.x
        pointsText.y = obj.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y - 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(56,147,214,1)', 0);
        
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
            scaleTween = game.add.tween(parent.scale).to({x: parent.initScale},CARD_TIME, Phaser.Easing.Cubic.Out,true)
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
    
    function getCardIndex(){
        
        var dif = difficultySection.getDifficulty()
        var index = 0
        
        if (dif == 'me'){
            index = 1
        }else if(dif == 'ha'){
            index = 2
        }
        return index
    }
    
    function createCards(){
        
        var pivot1 = game.world.centerX - 115
        var pivotX = pivot1
        
        var pivotY = game.world.centerY - 100
        if(cardsNumber > 4){
            pivotY = game.world.centerY - 268
        }
        
        if(cardsNumber == 6){
            pivotY += 70
        }
            
        console.log(cardsNumber + ' number')
        var cardWords, enWords
        
        if(turnCount <=2){
            cardWords = cardsList[0][0]
            enWords = cardsList[0][1]
        }else if(turnCount == 3){
            cardWords = cardsList[0][0]
            enWords = cardsList[0][1]
            
            cardWords = cardWords.concat = cardsList[1][0]
            enWords = enWords.concat = cardsList[1][1]
        }else if(turnCount>3 && turnCount<6){
            cardWords = cardsList[1][0]
            enWords = cardsList[1][1]
        }else if(turnCount == 6){
            cardWords = cardsList[1][0]
            enWords = cardsList[1][1]
            
            cardWords = cardWords.concat = cardsList[2][0]
            enWords = enWords.concat = cardsList[2][1]
        }else{
            cardWords = cardsList[2][0]
            enWords = cardsList[2][1]
        }
        
        
        var randomNums = []
        for(var i = 0;i<cardWords.length;i++){
            randomNums[randomNums.length] = i
        }
        Phaser.ArrayUtils.shuffle(randomNums)
        
        var cardsToUse = []
        var tagsToUse = []
        
        for(var i = 0;i<cardsNumber * 0.25;i++){
            
            for(var u = 0;u<2;u++){
                
                cardsToUse[cardsToUse.length] = cardWords[randomNums[i]][u]
                tagsToUse[tagsToUse.length] = enWords[randomNums[i]][u]

                cardsToUse[cardsToUse.length] = enWords[randomNums[i]][u]
                tagsToUse[tagsToUse.length] = enWords[randomNums[i]][u]
                
            }
            
        }
        
        randomNums = []
        for(var i = 0;i<cardsNumber;i++){
            randomNums[randomNums.length] = i
        }
        
        Phaser.ArrayUtils.shuffle(randomNums)
        
        var scaleToUse = 1
        if(cardsNumber == 8){
            scaleToUse = 0.8
        }else if(cardsNumber == 6){
            scaleToUse = 0.9
        }
        
        for(var i = 0; i < cardsNumber; i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            group.initScale = scaleToUse
            group.scale.y = scaleToUse
            group.scale.x = 0
            cardsGroup.add(group)
            
            var cardBack = group.create(0,0,'atlas.openEnglish_common','carta')
            cardBack.anchor.setTo(0.5,0.5)
            cardBack.pressed = false 
            cardBack.tag = tagsToUse[randomNums[i]]
            
            var cardFront = game.add.group()
            group.add(cardFront)
            
            if(cardsToUse[randomNums[i]][0] === cardsToUse[randomNums[i]][0].toUpperCase()){
                
                var img = cardFront.create(0,0,'atlas.openEnglish_common','blank')
                img.anchor.setTo(0.5,0.5)
                
                var fontSize = 35
                
                if(tagsToUse[randomNums[i]].length > 8){
                    fontSize = 27
                }else if(tagsToUse[randomNums[i]].length > 11){
                    fontSize = 24
                }
                
                var fontStyle = {font: fontSize+"px VAGRounded", fontWeight: "bold", fill: "#00000", align: "center"}
                
                var pointsText = new Phaser.Text(sceneGroup.game, -4, 0, tagsToUse[randomNums[i]], fontStyle)
                pointsText.anchor.setTo(0.5,0.5)
                cardFront.add(pointsText)
                
            }else{
                var img = cardFront.create(0,0,'atlas.openEnglish_cards',cardsToUse[randomNums[i]])
                img.anchor.setTo(0.5,0.5)
            }
            
            cardBack.inputEnabled = true
            cardBack.events.onInputDown.add(inputCard)

            changeImage(0,group)
                
            pivotX+= cardBack.width * 1.1
            
            if((i+1) % 2 == 0){
                pivotY+= cardBack.height * 0.95 * group.scale.y
                pivotX = pivot1
            }
            
        }
    }
    
    function flipCard(card, delay,lastOne){
        
        var last = lastOne || false
        
        game.time.events.add(200 + delay,function(){
            sound.play("flip")
            changeImage(0,card)
            game.add.tween(card.scale).to({x: card.initScale}, 200, Phaser.Easing.linear, true,0)
            //gameActive = true
            
            if(last){
                gameActive = true
            }
        })
    }
    
    function showCards(){
        
        gameActive = false
        var delay = 0
        for(var i = 0;i<cardsGroup.length;i++){
            
            delay+=200
            changeImage(1,cardsGroup.children[i])
            game.add.tween(cardsGroup.children[i].scale).to({x: cardsGroup.children[i].initScale}, 500, Phaser.Easing.linear, true, delay)
            
            game.time.events.add(delay,function(){
                sound.play("flip")
            } , this);
        }
        
        var delay = 0
        var lastOne = false
        game.time.events.add(delay + (cardsGroup.length * 200) + 400,function(){
            for(var i = 0;i<cardsGroup.length;i++){
                
                delay+=200
                
                if(i==cardsGroup.length - 1){
                    lastOne = true
                }
                
                var scaleTween = game.add.tween(cardsGroup.children[i].scale).to({x: 0}, 200, Phaser.Easing.linear, true,delay)
                flipCard(cardsGroup.children[i], delay,lastOne)
                
            }
        
        } , this);
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.openEnglish_common','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.5
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        //pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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

        var heartImg = group.create(0,0,'atlas.openEnglish_common','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        //pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function stopGame(win){
                
        //objectsGroup.timer.pause()
        gameActive = false
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(pointsBar.number,true)

			sceneloader.show("result")
		})
    }
    
    function preload(){
        /*var diff = difficultySection.getDifficulty()
        game.load.atlas('atlas.openEnglish_' + diff, 'images/openEnglish/atlas_' + diff + '.png', 'images/openEnglish/atlas_' + diff + '.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);*/
    }
    
    function addCorrect(correct){
        
        var obj = pointsGroup.children[turnCount]
        
        var color = 2
        if(correct == false){
            color = 3
        }
        
        changeImage(color,pointsGroup.children[turnCount - 1])
                
        /*var correct
        if(correct){
            correct = pointsGroup.create(obj.x, obj.y - 35,'atlas.openEnglish','correcto')
            
        }else{
            correct = pointsGroup.create(obj.x, obj.y - 35,'atlas.openEnglish','incorrecto')
        }
        
        correct.anchor.setTo(0.5,0.5)*/
    }
    
    function createPointsBar2(){
        
        var pointsLine = sceneGroup.create(game.world.centerX, 85, 'atlas.openEnglish_common','lineaGris')
        pointsLine.alpha = 0
        pointsLine.anchor.setTo(0.5,0.5)
        
        pointsGroup = game.add.group()
        sceneGroup.add(pointsLine)
        
        var pivotX = pointsLine.x - pointsLine.width * 0.45
        for(var i = 0;i<10;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pointsLine.y
            pointsGroup.add(group)
            
            var circle1 = group.create(0,0,'atlas.openEnglish_common','Cgris')
            circle1.anchor.setTo(0.5,0.5)
            
            var circle2 = group.create(0,0,'atlas.openEnglish_common','Cblanco')
            circle2.anchor.setTo(0.5,0.5)
            
            var circle3 = group.create(0,0,'atlas.openEnglish_common','Cverde')
            circle3.anchor.setTo(0.5,0.5)
            
            var circle4 = group.create(0,0,'atlas.openEnglish_common','Cnaranja')
            circle4.anchor.setTo(0.5,0.5)
            
            var fontStyle = {font: "22px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
            
            var trackerText = new Phaser.Text(sceneGroup.game, 0, 3, i + 1, fontStyle)
            trackerText.alpha = 0
            trackerText.anchor.setTo(0.5, 0.5)
            group.add(trackerText)
            
            pivotX+= circle1.width * 1.44
            
            changeImage(0,group)
            
        }
        
    }
    
	return {
		assets: assets,
        preload,preload,
		name: "openenglish",
		create: function(event){

            
			sceneGroup = game.add.group()
            
            /*var background = sceneGroup.create(0,0,'fondo')
            background.width = game.world.width
            background.height = game.world.height
            
            /*var background = new Phaser.Graphics(game)
            background.beginFill(0x3782bd)
            background.drawRect(0, 0, game.width, game.height)
            background.endFill()
            sceneGroup.add(background)*/
            
            var background = new Phaser.Graphics(game)
            background.beginFill(0x058fff)
            background.drawRect(0, 0, game.width, game.height)
            background.endFill()
            sceneGroup.add(background)
            
            var logo = sceneGroup.create(game.world.centerX, game.world.height - 50,'atlas.openEnglish_common','LogoPie')
            logo.anchor.setTo(0.5,0.5)
            
            initialize()
            
            cardsGroup = game.add.group()
            sceneGroup.add(cardsGroup)
            
            createHearts()
            createPointsBar()
            createCards()
            
            createPointsBar2()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()