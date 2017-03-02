
var soundsPath = "../../shared/minigames/sounds/"
var water = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.water",
                json: "images/water/atlas.json",
                image: "images/water/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/water/background.png"},
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "fall",
				file: soundsPath + "falling.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
			{	name: "stop",
				file: soundsPath + "stop.mp3"},
			{	name: "frozen",
				file: soundsPath + "glassbreak.mp3"},
			{	name: "steam",
				file: soundsPath + "steam.mp3"},
		],
    }
    
    var CARD_TIME = 300
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive
    var arrayComparison = null
	var continueGame
    var overlayGroup
	var background
    var dojoSong
    var dragCard
    var quantNumber
    var numberIndex = 3
    var numberToCheck
    var addNumber
    var lastObj
    var cardsGroup, baseCards, usedCards
    var timer
    var cardsNumber
    var maxNumber
    var answerIndex
    var selectGroup
    var comboCount
    var wordGroup
    var gameIndex = 3
    var boardGroup
    var clock
    var cardsType
    var timeValue
    var cardsList
	var groupButton

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        cardsNumber = 4
        maxNumber = 3
        lives = 1
        quantNumber = 0
        arrayComparison = []
        comboCount = 0
        numberIndex = 0
        timeValue = 7
		continueGame = true
        answerIndex = 0
        cardsType = ['hielo','liquido','vapor']
		specialCards = ['sun','ice']
        cardsList = []
        
        loadSounds()
        
	}
    
    function createPart(key,obj){
        
            key+='Part'
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.water',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        
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
    
    function addCard(){
		
        Phaser.ArrayUtils.shuffle(cardsType)
        
        if(!dragCard.double){
            
			groupButton.alpha = 0
			
            var tag = cardsType[0]
			
			var specialItem = Math.random()*2 > 1 && usedCards.length >= 1
			
			if(specialItem){
				Phaser.ArrayUtils.shuffle(specialCards)
				tag = specialCards[0]
			}

            var card = getCard(tag)

            card.alpha = 1
            card.x = dragCard.x
            card.y = dragCard.y
			card.special = false
            sound.play("pop")
            dragCard.card = card
			
			if(specialItem){
				card.special = true
			}

            game.add.tween(card.scale).from({x:0.01,y:0.01},500,"Linear",true).onComplete.add(function(){
				
				if(continueGame){
					gameActive = true
				}else{
					missPoint()
				}
            })
        }else{
            
			groupButton.alpha = 1
			
			dragCard.count = 0
			
            var tag = cardsType[0]
            var tag2 = cardsType[1]
            
            var card1 = getCard(tag)
            var card2 = getCard(tag2)
			
			card1.x = dragCard.x
			card1.y = dragCard.y - card1.height * 0.5
			card1.alpha = 1
			card1.offX = 0
			card1.offY = -card1.height * 0.5
			
			card2.x = dragCard.x
			card2.y = dragCard.y + card2.height * 0.5
			card2.alpha = 1
			card2.offX = 0
			card2.offY = card2.height * 0.5
			
			dragCard.card1 = card1
			dragCard.card2 = card2
			
			game.add.tween(card1.scale).from({x:0.01, y:0.01},500,"Linear",true)
			game.add.tween(card2.scale).from({x:0.01, y:0.01},500,"Linear",true).onComplete.add(function(){
				
				if(continueGame){
					gameActive = true
				}else{
					stopGame()
				}
			},this)
			
			sound.play("pop")
        }     
        
       
    }
    
    function update(){
        
        if(dragCard.double){
			
			if(dragCard.card1){
				
				dragCard.card1.x = dragCard.x + dragCard.card1.offX
				dragCard.card1.y = dragCard.y + dragCard.card1.offY

				dragCard.card2.x = dragCard.x + dragCard.card2.offX
				dragCard.card2.y = dragCard.y + dragCard.card2.offY	
			}
		}else{
			
			if(dragCard.card){
            
				dragCard.card.x = dragCard.x
				dragCard.card.y = dragCard.y
			}
		}
		
        
    }
    
    function getCard(tag){
        
        for(var i = 0;i<cardsGroup.length;i++){
            
            var card = cardsGroup.children[i]
            if(card.tag == tag && !card.used){
                
                return card
                break
            }
        }
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
        
        sound.play("pop")
        
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
            stopGame()
        }
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function addPoint(number){
        
        sound.play("pop")

        answerIndex++
        
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
    }
    
    function createCard(times, type){
        
        for(var i = 0; i < times; i++){
            
            var card = cardsGroup.create(0,0,'atlas.water',type)
            card.anchor.setTo(0.5,0.5)
            card.used = false
            card.tag = type
            card.alpha = 0
            card.check = false
        }
        
    }
    
    function checkCards(card){
    
        cardsList = []
                
        for(var i = 0; i < usedCards.length; i ++){
            usedCards.children[i].check = false
        }
        
        checkAllCards(card)
        		
        if(cardsList.length >= 4){

            Phaser.ArrayUtils.shuffle(cardsType)

            var tag = cardsType[0]

            var newCard = getCard(tag)
            newCard.alpha = 1
            newCard.x = card.cont.x
            newCard.y = card.cont.y
            newCard.cont = card.cont
            newCard.used = true
            
            cardsGroup.remove(newCard)
            usedCards.add(newCard)
            
            game.add.tween(newCard.scale).from({x:0.01, y:0.01},250,"Linear",true).onComplete.add(function(){
				checkCards(newCard)
			})

            sound.play("magic")
			addPoint(cardsList.length)
            for(var i = 0; i < cardsList.length;i++){
                var card = cardsList[i]
                createPart('star',card)
                deactivateCard(card)
            }
			
			newCard.cont.used = true
			
        }
            
        
    }
    
    function deactivateCard(card){
        
		if(card.tween){
			card.tween.stop()
			card.tween = null
			card.angle = 0
		}
		
        card.alpha = 0.6
		card.x = -200
        card.used = false
        card.check = false
		
		if(card.cont){
			card.cont.used = false
        	card.cont = null
		}
        
        usedCards.remove(card)
        cardsGroup.add(card)
        
    }
    
    function checkAllCards(card){
        
        card.check = true
        cardsList[cardsList.length] = card
        
        for(var i = 0; i < usedCards.length;i++){
            
            var checkCard = usedCards.children[i]
            
            if(!checkCard.check && card.tag == checkCard.tag && checkCard.used){
                
                if(Math.abs(card.x - checkCard.x) < card.width * 0.3){
                    if(Math.abs(card.y - checkCard.y) < card.width * 1.5){
                        checkAllCards(checkCard)
                    }
                }else if(Math.abs(card.y - checkCard.y) < card.height * 0.3){
                    if(Math.abs(card.x - checkCard.x) < card.width * 1.5){
                        checkAllCards(checkCard)
                    }
                }
            }
            
            
            
        }
    }
    
    function onDragStop(obj){
        
        obj.inputEnabled = false
        
		if(!dragCard.double){
			var card = obj.card
			
			if(card.special){
				
				for(var i = 0; i < usedCards.length;i++){
					
					var usedCard = usedCards.children[i]
					if(checkOverlap(card,usedCard) && usedCard.used){
						
						if(Math.abs(usedCard.x - card.x) < card.width * 0.5 && Math.abs(usedCard.y - card.y) < card.height * 0.5){
							
							var tag = card.tag
							var usedTag = usedCard.tag
							var tagToUse = null
							
							if(tag == 'sun'){
								
								if(usedTag == 'hielo'){
									tagToUse = 'liquido'
								}else if(usedTag == 'liquido'){
									tagToUse = 'vapor'
								}

							}else if(tag == 'ice'){
								if(usedTag == 'vapor'){
									tagToUse = 'liquido'
								}else if(usedTag == 'liquido'){
									tagToUse = 'hielo'
								}
							}
							
							if(tagToUse){
								
								if(tag == 'ice'){
									sound.play("frozen")
								}else if (tag == 'sun'){
									sound.play("steam")
								}
								
								dragCard.card = null
								
								var newCard = getCard(tagToUse)
								newCard.alpha = 1
								newCard.x = usedCard.x
								newCard.y = usedCard.y
								newCard.cont = usedCard.cont
								newCard.used = true

								cardsGroup.remove(newCard)
								usedCards.add(newCard)
								
								deactivateCard(usedCard)
								
								newCard.cont.used = true
								
								card.tween = game.add.tween(card).to({angle:card.angle + 360,alpha:0},250,"Linear",true)
								game.add.tween(newCard.scale).from({x:0.01, y:0.01},250,"Linear",true).onComplete.add(function(){
									deactivateCard(card)
									checkCards(newCard)

								})
							}else{
								
								dragCard.card = null
								game.add.tween(card).to({angle:card.angle + 360,alpha:0},250,"Linear",true).onComplete.add(function(){
									
									sound.play("wrong")
									deactivateCard(card)

								},this)
							}
							
							break
						}
					}
				}
			}else{
				
				for(var i = 0; i<boardGroup.length;i++){

					var cont = boardGroup.children[i]
					if(checkOverlap(card,cont) && !cont.used){

						if(Math.abs(cont.x - card.x) < cont.width*0.4 && Math.abs(cont.y - card.y) < cont.height * 0.4){

							cont.used = true
							card.cont = cont
							sound.play("cut")
							card.x = cont.x
							card.y = cont.y

							card.tween = game.add.tween(card).to({angle:card.angle + 360},500,"Linear",true)
							
							card.used = true
							dragCard.card = null

							cardsGroup.remove(card)
							usedCards.add(card)

							checkCards(card)
							break
						}
					}
				}
			}
			

			if(dragCard.card){
				
				sound.play("stop")
				game.add.tween(obj).to({x:obj.initialX,y:obj.initialY},300,Phaser.Easing.linear,true).onComplete.add(function(){
					obj.inputEnabled = true
				})
			}else{

				obj.inputEnabled = true
				gameActive = false
				obj.x = obj.initialX
				obj.y = obj.initialY
				
				continueGame = checkSpaces()
				game.time.events.add(500,addCard)
				
			}
		}else{
			
			var cards = [dragCard.card1,dragCard.card2]
			
			for(var i = 0; i < cards.length; i++){
				
				var card = cards[i]
				
				for(var u = 0; u < boardGroup.length; u++){
					
					var cont = boardGroup.children[u]
					if(checkOverlap(card,cont) && !cont.used){
						
						if(Math.abs(card.x - cont.x) < cont.width * 0.5 && Math.abs(card.y - cont.y) < cont.height * 0.5){
							
							cont.used = true
							card.cont = cont
							
							card.used = true
							break
						}
					}
				}
			}
			
			if(cards[0].used && cards[1].used){
				
				sound.play("cut")
				
				for(var i = 0; i < cards.length; i++){
					
					var card = cards[i]
					
					card.x = card.cont.x
					card.y = card.cont.y
					card.tween = game.add.tween(card).to({angle: card.angle + 360},500,"Linear",true)
					
					cardsGroup.remove(card)
					usedCards.add(card)
					
					checkCards(card)
				}
				
				dragCard.card1 = null
				dragCard.card2 = null
				
				dragCard.x = dragCard.initialX
				dragCard.y = dragCard.initialY
				
				obj.inputEnabled = true
				
				continueGame = checkSpaces()
				game.time.events.add(500,addCard)
				
			}else{
				
				for(var i = 0; i < cards.length; i++){
					
					var card = cards[i]
					
					card.used = false
					if(card.cont){
						
						card.cont.used = false
						card.cont = null
					}
					
					
				}
				sound.play("stop")
				game.add.tween(obj).to({x:obj.initialX,y:obj.initialY},300,Phaser.Easing.linear,true).onComplete.add(function(){
					obj.inputEnabled = true
				})
				
			}
		}
        
        
    }
	
	function checkSpaces(){
		
		dragCard.double = Math.random()*1.7 > 1
		
		var spacesList = []
		
		for(var i = 0; i < boardGroup.length; i++){
			
			var space = boardGroup.children[i]	
			
			if(!space.used){
				
				spacesList[spacesList.length] = space
				
			}
		}
		
		var sLength = spacesList.length
		

		if(sLength == 0){
			return false
		}else if(sLength == 1 && dragCard.double){
			return false
		}
		
		if(dragCard.double && sLength >= 2){
			
			//console.log('entra')
			for(var i = 0; i < sLength;i++){
				var space = spacesList[i]
				
				for(var u = 0; u < sLength; u++){
					var space2 = spacesList[u]
					
					var difX = Math.abs(space.x - space2.x)
					var difY = Math.abs(space.y - space2.y)
					
					//console.log(difX + ' difX ' + difY + ' difY')
					
					if(difX < space.width * 0.3){
						if(difY < space.height * 1.5 && difY > space.height * 0.3){
							return true
						}
					}else if(difY < space.height * 0.3){
						if(difX < space.width * 1.5 && difX > space.width * 0.3){
							return true
						}
					}
					
				}
			}
			
		}		
		
		if(!dragCard.double && sLength >= 1){
			return true
		}
	}
	
    
    function onDragStart(obj){
        
        if(!gameActive){
            return
        }
        
        sound.play("flipCard")
        
    }
    
    function createCards(){
        
        usedCards = game.add.group()
        sceneGroup.add(usedCards)
        
        cardsGroup = game.add.group()
        sceneGroup.add(cardsGroup)
        
        createCard(12,'hielo')
        createCard(12,'liquido')
        createCard(12,'vapor')
		createCard(6,'sun')
		createCard(6,'ice')
        
        var cont = baseCards.container
        
        dragCard = sceneGroup.create(game.world.centerX,game.world.height - 150,'atlas.water','hielo')
        dragCard.anchor.setTo(0.5,0.5)
        dragCard.initialX = dragCard.x
        dragCard.initialY = dragCard.y
		dragCard.scale.setTo(1.5,1.5)
        dragCard.alpha = 0

        dragCard.inputEnabled = true
        dragCard.input.enableDrag(true)
        dragCard.events.onDragStart.add(onDragStart, this);
        dragCard.events.onDragStop.add(onDragStop, this);
    }
        
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.water','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.water','life_box')

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
		dragCard.inputEnabled = false
        gameActive = false
        //timer.pause()
        dojoSong.stop()
        sound.play("gameLose")
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function createBoard(){
        
        boardGroup = game.add.group()
        sceneGroup.add(boardGroup)
        
        var container = new Phaser.Graphics(game)
        container.beginFill(0x000000)
        container.drawRoundedRect(game.world.centerX,game.world.centerY - 150, 550,550,12)
        container.x-= container.width * 0.5
        container.y-= container.height * 0.5
        container.alpha = 0.4
        container.endFill()
        container.anchor.setTo(0.5,0.5)
        container.used = false
        sceneGroup.add(container)
        
        var pivotX = game.world.centerX - 192
        var pivotY = container.y + container.height * 0.75
        var initPivotX = pivotX
        
        for(var i = 0; i < 16; i++){
            
            var container = boardGroup.create(pivotX, pivotY,'atlas.water','cuadroTablero')
            container.anchor.setTo(0.5,0.5)
            
            pivotX+= container.width * 1.2
            if((i+1) % 4 == 0){
                
                pivotX = initPivotX
                pivotY+= container.height * 1.2
            }
        }
        
    }
	
	function inputButton(obj){
        
        if(!gameActive){
            return
        }
        
		if(dragCard.double){
			
			var c1 = dragCard.card1
			var c2 = dragCard.card2
			
			dragCard.count++
			
			if(dragCard.count == 4){
				dragCard.count = 0
			}
			
			c1.offX = 0
			c1.offY = 0
			
			c2.offX = 0
			c2.offY = 0
			if(dragCard.count == 0){
				
				c1.offY = -c1.height * 0.5
				c2.offY = c2.height * 0.5
			}else if(dragCard.count == 1){
				
				c1.offX = c1.width * 0.5
				c2.offX = -c2.width * 0.5
			}else if(dragCard.count == 2){
				
				c1.offY = c1.height * 0.5
				c2.offY = -c2.height * 0.5
			}else if(dragCard.count == 3){
				
				c1.offX = -c1.width * 0.5
				c2.offX = c2.width * 0.5
			}
			
		}
        obj.parent.children[1].alpha = 0
		sound.play("pop")
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/space_music.mp3');
                
        game.load.image('introscreen',"images/water/introscreen.png")
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height
                game.time.events.add(500,addCard)
				tweenBackground()
                //start()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX + 75, game.world.centerY,'introscreen')
        plane.scale.setTo(0.6,0.6)
        plane.anchor.setTo(0.5,0.5)
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, +100, 10, localization.getString(localizationData, "howTo"), fontStyle)
        pointsText.x = plane.x + 105
        pointsText.y = game.world.centerY - plane.height * 0.35
        pointsText.anchor.setTo(0.5,0.5)
        overlayGroup.add(pointsText)
        
        if(!game.device.desktop){
            
            var inputLogo = overlayGroup.create(game.world.centerX,game.world.centerY + 175,'atlas.water','tablet')
            inputLogo.anchor.setTo(0.5,0.5)
            
        }else{
            
            /*var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
            var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, localization.getString(localizationData, "or"), fontStyle)
            pointsText.x = game.world.centerX - 20
            pointsText.y = game.world.centerY + 175
            pointsText.anchor.setTo(0.5,0.5)
            overlayGroup.add(pointsText)*/
            
            var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 175,'atlas.water','pc')
            inputLogo.anchor.setTo(0.5,0.5)
            
        }
        
    }
    
	function tweenTint(obj, startColor, endColor, time) {
		
		var colorBlend = {step: 0};     
		var colorTween = game.add.tween(colorBlend).to({step: 100}, time)    
		
		colorTween.onUpdateCallback(function() {      
			obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
		});    
		
		obj.tint = startColor;           
		colorTween.start();
	}
	
    function createBase(){
        
        baseCards = sceneGroup.create(0,game.world.height,'atlas.water','base_fichas')
        baseCards.anchor.setTo(0,1)
		baseCards.scale.y = 0.95
        baseCards.width = game.world.width
		
		var tween = game.add.tween(baseCards.scale).to( { y:1.05 }, 2000, Phaser.Easing.linear, true, 0,-1);
        tween.yoyo(true, 0);
        
        var container = new Phaser.Graphics(game)
        container.beginFill(0x000000)
        container.drawRoundedRect(game.world.centerX,game.world.height - 150, 230,230,12)
        container.x-= container.width * 0.5
        container.y-= container.height * 0.5
        container.alpha = 0.4
        container.endFill()
        container.anchor.setTo(0.5,0.5)
        sceneGroup.add(container)
        
        baseCards.container = container
		
		groupButton = game.add.group()
        groupButton.x = game.world.centerX - 200
        groupButton.y = game.world.height -125
		groupButton.alpha = 0
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.water','giroOn')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.water','giroOff')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }
    
	function tweenBackground(){
		
		var startColor = 0xffffff
		var endColor = Phaser.Color.getRandomColor(0,255,255)
		
		if(background.colored){
			startColor = background.tint
			endColor = 0xffffff
		}
		
		var timeToUse = 4000
		
		tweenTint(background, startColor, endColor, timeToUse)
		
		background.colored = !background.colored
		
		//console.log(background.colored + ' colored')
		
		game.time.events.add(timeToUse,tweenBackground,this)
	}
	
	return {
		assets: assets,
        update: update,
		name: "water",
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
            
            background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
			background.colored = false
            
            dojoSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(dojoSong, function(){
                dojoSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
        
            createBoard()
            createBase()
            createCards()
            
            createHearts()
            createPointsBar()
            
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()