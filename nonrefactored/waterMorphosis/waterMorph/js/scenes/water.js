
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
			{	name: "rockSound",
				file: soundsPath + "towercollapse.mp3"},
		],
    }
    
    var CARD_TIME = 300
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
	var firstMove
    var gameActive
	var continueGame
    var overlayGroup
	var arrowGroup
	var background
    var seaSong
    var dragCard
	var lastCard
    var numberToCheck
    var addNumber
    var cardsGroup, baseCards, usedCards
    var timer
    var answerIndex
    var selectGroup
	var particlesGroup, particlesUsed
    var wordGroup
    var gameIndex = 3
    var boardGroup
    var clock
	var rockPlaces
	var rockIndex
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
        lives = 1
        timeValue = 7
		continueGame = true
        answerIndex = 0
        cardsType = ['hielo','liquido','vapor']
		specialCards = ['sun','ice']
		firstMove = true
        cardsList = []
		rockIndex = 0
		
		rockPlaces = [0,3,12,15]
		Phaser.ArrayUtils.shuffle(rockPlaces)
        
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
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
    
    function addCard(){
		
        Phaser.ArrayUtils.shuffle(cardsType)
        
		if(firstMove){
			dragCard.double = false
		}
		
        if(!dragCard.double){
            
			groupButton.alpha = 0
			
            var tag = cardsType[0]
			
			if(firstMove){
				tag = 'hielo'
			}
						
			if(dragCard.specialItem){
				Phaser.ArrayUtils.shuffle(specialCards)
				tag = specialCards[0]
			}
			
			dragCard.y = dragCard.initialY
			
            var card = getCard(tag)

            card.alpha = 1
            card.x = dragCard.x
            card.y = dragCard.y
			card.special = false
            sound.play("pop")
            dragCard.card = card
			
			if(dragCard.specialItem){
				card.special = true
				dragCard.specialItem = false
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
        
		if(checkPoints(35) && pointsBar.number < 220){
			
			game.time.events.add(250,function(){
				
				var container = boardGroup.children[rockPlaces[rockIndex]]
				var cardToUse = null
				for(var i = 0; i < usedCards.length; i++){
					
					var card = usedCards.children[i]
					if(checkOverlap(container,card)){
						cardToUse = card
						break
					}
				}
				
				if(cardToUse){
					deactivateCard(cardToUse)
				}
				
				var newCard = getCard('rock')
				newCard.alpha = 1
				newCard.x = container.x
				newCard.y = container.y
				newCard.cont = container
				newCard.used = true

				cardsGroup.remove(newCard)
				usedCards.add(newCard)
				
				sound.play("rockSound")
				game.add.tween(newCard.scale).from({x:0.01, y:0.01},500,"Linear",true)

				newCard.cont.used = true
				rockIndex++
				
			},this)
		}
       
    }
	
	function addBlock(tag, container){
		
		var newCard = getCard(tag)
		newCard.alpha = 1
		newCard.x = container.x
		newCard.y = container.y
		newCard.cont = container
		newCard.used = true

		cardsGroup.remove(newCard)
		usedCards.add(newCard)

		newCard.cont.used = true
	}
    
    function update(){
        
		background.tilePosition.x += 0.5
		
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
		lastScore = pointsBar.number

		if(!dragCard.double){
			
			if(!obj.card){
				return
			}
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
							
							if(tagToUse && tagToUse != 'rock'){
								
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
							
							if(firstMove && Math.abs(card.x - arrowGroup.x) < 50 && Math.abs(card.y - arrowGroup.y) < 50){
								firstMove = false	
								game.add.tween(arrowGroup).to({alpha:0},500,"Linear",true).onComplete.add(function(){
									arrowGroup.tween.stop()
									arrowGroup.tween = null
								})
							}
							
							if(!firstMove){
								
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
	
	function checkPoints(value){
		
		var pointsValue = pointsBar.number
		var timesValue = 0
		
		if(pointsValue > 5){

			while(pointsValue >= value){
				pointsValue-=value
				timesValue++
			}
			
			if(pointsValue < 8){
				//console.log(lastScore + ' ' + (value * timesValue))
				if(lastScore < value * timesValue){
					return true
				}
			}else{
				return false
			}
		}else{
			return false
		}
	}
	
	function checkSpaces(){
		
		dragCard.double = Math.random()*1.7 > 1
		
		if(checkPoints(25)){
			dragCard.specialItem = true
			dragCard.double = false
		}
		
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
    
	function getTag(){
		
		Phaser.ArrayUtils.shuffle(cardsType)

        return cardsType[0]
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
		createCard(6,'rock')
		
		particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',10)
		createParticles('wrong',2)
        
        var cont = baseCards.container
        
        dragCard = sceneGroup.create(game.world.centerX,game.world.height - 150,'atlas.water','hielo')
        dragCard.anchor.setTo(0.5,0.5)
        dragCard.initialX = dragCard.x
        dragCard.initialY = dragCard.y
		dragCard.scale.setTo(1.5,1.5)
        dragCard.alpha = 0
		dragCard.y = -150

		dragCard.specialItem = false
        dragCard.inputEnabled = true
        dragCard.input.enableDrag(false)
        dragCard.events.onDragStart.add(onDragStart, this);
        dragCard.events.onDragStop.add(onDragStop, this);
		
		addBlock('hielo',boardGroup.children[5])
		addBlock('hielo',boardGroup.children[6])
		addBlock('hielo',boardGroup.children[9])
		
		var places = [0,1,2,3,4,7,8,11,12,13,14,15]
		
		Phaser.ArrayUtils.shuffle(places)
		
		for(var i = 0; i<3;i++){
			
			addBlock(getTag(),boardGroup.children[places[i]])
		}
		
		arrowGroup = game.add.group()
		arrowGroup.x = boardGroup.children[10].x
		arrowGroup.y = boardGroup.children[10].y
		sceneGroup.add(arrowGroup)
		
		var arrow = arrowGroup.create(75,0,'atlas.water','arrow')
		arrow.anchor.setTo(0,0.5)
		
		var arrow = arrowGroup.create(-75,0,'atlas.water','arrow')
		arrow.scale.x = -1
		arrow.anchor.setTo(0,0.5)
		
		var arrow = arrowGroup.create(30,92,'atlas.water','arrow')
		arrow.angle = 90
		arrow.anchor.setTo(0.5,0)
		
		var arrow = arrowGroup.create(30,-92,'atlas.water','arrow')
		arrow.angle = 90
		arrow.scale.x = -1
		arrow.anchor.setTo(0.5,0)
		
		arrowGroup.tween = game.add.tween(arrowGroup.scale).to( { x: 0.7, y:0.7 }, 500, Phaser.Easing.linear, true, 0,-1);
        arrowGroup.tween.yoyo(true, 0);
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
        seaSong.stop()
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
		
		boardGroup = game.add.group()
        sceneGroup.add(boardGroup)
        
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
        
		//addPoint(1)
		
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
		buttons.getImages(game)
        
        game.load.audio('seaSong', soundsPath + 'songs/happy_game_memories.mp3');
                
        game.load.image('introscreen',"images/water/introscreen.png")
		
		game.load.image('howTo',"images/water/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/water/play" + localization.getLanguage() + ".png")
        
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
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height
                game.time.events.add(500,addCard)

            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1.1,1.1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 75,'atlas.water','gametuto')
		tuto.anchor.setTo(0.5,0.5)
		tuto.scale.setTo(0.8,0.8)
		
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 250,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.7,0.7)
        
		var deviceName = 'pc'
        if(!game.device.desktop){
            
            deviceName = 'tablet'
        }
		
		var inputLogo = overlayGroup.create(game.world.centerX + 15,game.world.centerY + 145,'atlas.water',deviceName)
        inputLogo.anchor.setTo(0.5,0.5)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'atlas.water','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
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
        
        baseCards = game.add.tileSprite(0,game.world.height,game.world.width, 364, 'atlas.water','base_fichas')
        baseCards.anchor.setTo(0,1)
		baseCards.scale.y = 0.95
		sceneGroup.add(baseCards)
		
		var tween = game.add.tween(baseCards.scale).to( { y:1.02 }, 2000, Phaser.Easing.linear, true, 0,-1);
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
	
	function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
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
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
        }
        
        
    }
    
    function createParticles(tag,number){
        
        tag+='Part'
        
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'textPart'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                particle = particlesGroup.create(-200,0,'atlas.water',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	return {
		assets: assets,
        update: update,
		name: "water",
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);
            
            background = game.add.tileSprite(0,0,game.world.width, game.world.height, 'fondo');
			sceneGroup.add(background)
            
            seaSong = game.add.audio('seaSong')
            game.sound.setDecodedCallback(seaSong, function(){
                seaSong.loopFull(0.6)
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
            
			buttons.getButton(seaSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()