
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var frac = function(){
    
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
                name: "atlas.frac",
                json: "images/frac/atlas.json",
                image: "images/frac/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

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
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background,topBack, botBack
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 83
	var indexGame
    var overlayGroup
    var spaceSong
	var cardsGroup
	var numberOfCards, tapNumber
	var cardsToUse
	var tapCards
	
	var numbers = ['cuarto','quinto','sexto','septimo','octavo','noveno','decimo','doceavo','treceavo','quinceavo','dieciseisavo']
	var digitNumbers = [4,5,6,7,8,9,10,12,13,15,16]

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		numberOfCards = 4
        cardsToUse = []
        loadSounds()
        
	}

    function popObject(obj,delay,appear,isTop){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
			if(appear){

				obj.alpha = 1
				obj.scale.setTo(1,1)
				
				if(obj.back){
					if(isTop){
						
						obj.back.alpha = 0
						obj.topImg.alpha = 1
						obj.topImg.active = true
						
					}else{
						obj.back.alpha = 1
						obj.topImg.alpha = 0
					}
					
				}
				
            	game.add.tween(obj.scale).from({x:0},200,Phaser.Easing.linear,true)
			}else{
				game.add.tween(obj.scale).to({x:0},200,"Linear",true)
			}
            
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
		//console.log(pointsText + ' text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)
			pointsText.alpha = 1

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
            
            game.add.tween(pointsText).to({y:pointsText.y + offsetY},800,Phaser.Easing.linear,true)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.frac','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.frac','life_box')

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
        
		gameActive = false
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
        
        game.load.audio('spaceSong', soundsPath + 'songs/technology_action.mp3');
        
		game.load.image('howTo',"images/frac/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/frac/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/frac/introscreen.png")
		
		var inputName = 'movil'
        
		if(game.device.desktop){
			inputName = 'desktop'
		}


		game.load.image('tutorial_image',"images/frac/tutorial_image_"+inputName+".png")
		//loadType(gameIndex)

		
		var games = yogomeGames.getGames()
		var stringUsed = ''
		for(var i = 0; i < games.length;i++){
			
			var gameShow = games[i]
			stringUsed+= gameShow.url + '\n'
		}
        
		console.log(stringUsed)
    }
	
	function placeCards(){
		
		cardsToUse = []
		
		var numsToUse = []
		for(var i = 0; i < numbers.length;i++){
			
			numsToUse[i] = i
		}
		
		Phaser.ArrayUtils.shuffle(numsToUse)
		
		for(var i = 0; i < (numberOfCards / 2); i++){
			
			var numToUse = numsToUse[i]
			var index = game.rnd.integerInRange(1,digitNumbers[numToUse] - 1)
			
			cardsToUse[cardsToUse.length] = getCard(numbers[numToUse],false,index)
			cardsToUse[cardsToUse.length] = getCard(numbers[numToUse],true,index)
			
		}
		
		Phaser.ArrayUtils.shuffle(cardsToUse)
		
		var pivotX,pivotY,initX
		var delay = 0
		var index = 2
		var offY = 200
		if(numberOfCards < 8){
			
			pivotX = game.world.centerX - 100
			pivotY = game.world.centerY - 150
			
			
			if(numberOfCards == 6){
				pivotY-= 50
			}
			
		}else{
			
			pivotX = game.world.centerX - 200
			pivotY = game.world.centerY - 200
			index = 3
			
			if(numberOfCards == 12){
				offY = 150
				pivotY-=20
			}
		}
		
		initX = pivotX
		for(var i = 0; i < cardsToUse.length;i++){
				
			var card = cardsToUse[i]
			card.x = pivotX
			card.y = pivotY

			pivotX+= 200
			if((i+1) % index == 0){
				pivotX = initX
				pivotY += offY
			}

			popObject(card,delay,true)
			delay+= 200
		}
		
		delay+= numberOfCards * 800
		
		
		for(var i = 0; i < cardsToUse.length;i++){
			
			var card = cardsToUse[i]
			popObject(card,delay)
			
			delay+= 200
			popObject(card,delay,true,true)
		}
		
		delay+= 200
		game.time.events.add(delay,function(){
			
			tapCards = []
			gameActive = true
			tapNumber = 0
		})
		
	}
	
	function getCard(tag,isGraphic,index){
		
		for(var i = 0; i < cardsGroup.length; i++){
			
			var card = cardsGroup.children[i]
			if(card.tag == tag && card.graphic == isGraphic){
				
				
				if(isGraphic){
					
					for(var u = 0; u < card.pieces.length;u++){
						
						var piece = card.pieces.children[u]
						piece.alpha = 0
						
						if(u < index){
							piece.alpha = 1
						}
					}
				}else{
					
					card.text.setText(index + '\n---\n' + card.number)
				}
				
				return card
				
			}
		}
	}
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)
        
        /*var rect = new Phaser.Graphics(game)
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
				placeCards()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.frac','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.frac',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.frac','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		placeCards()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.frac','tileFondo')
		sceneGroup.add(background)
		
		topBack = game.add.tileSprite(0,0,game.world.width,152,'atlas.frac','tile')
		sceneGroup.add(topBack)
		
		botBack = game.add.tileSprite(0,game.world.height,game.world.width,152,'atlas.frac','tile')
		botBack.scale.y*=-1
		sceneGroup.add(botBack)
		
	}
	
	function update(){
		
		background.tilePosition.y--
		topBack.tilePosition.x++
		botBack.tilePosition.x--

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
            if(particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
				if(key == 'text'){
					particlesGroup.remove(particle)
                	particlesUsed.add(particle)
				}
                
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);+
			particle.setAlpha(1,0,2000,Phaser.Easing.Cubic.In)
			
			/*game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})*/
			
        }
        
        
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

				particle.makeParticles('atlas.frac',tag);
				particle.minParticleSpeed.setTo(-400, -100);
				particle.maxParticleSpeed.setTo(400, -200);
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
		
		createParticles('star',1)
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
		
        var exp = sceneGroup.create(0,0,'atlas.frac','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.frac','smoke');
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
		
		var parent = obj.parent
		//console.log(obj.active + ' active')
		if(!gameActive || !obj.active){
			return
		}
		
		tapCards[tapCards.length] = parent
		
		obj.active = false
		popObject(parent,0,false)
		
		popObject(parent,200,true)
		
		if(tapCards.length > 1){
			//gameActive = false
			
			var stringPart = 'star'
			if(tapCards[0].tag == tapCards[1].tag){
				
				addPoint(1)
				tapNumber+= 2
				
				for(var i = 0; i < tapCards.length;i++){

					var tapCard = tapCards[i]

					createPart(stringPart,tapCard.topImg)
					var tween = game.add.tween(tapCard.scale).to({x:1.4,y:1.4},200,"Linear",true,0,0)
					tween.yoyo(true,0)


					hideCard(tapCard,1000)
				}
				
				tapCards = []
				
				if(tapNumber >= numberOfCards){
					gameActive = false
					tapNumber = 0
					game.time.events.add(1400,function(){
						
						if(numberOfCards < 8){
							numberOfCards+= 2
						}else{
							if(numberOfCards < 12){
								numberOfCards+= 4
							}
						}
						
						lives++
						heartsGroup.text.setText('X ' + lives)
						addNumberPart(heartsGroup.text,'+1',true)
						
						placeCards()

					})
					
				}				
				
			}else{
				
				stringPart = 'wrong'
				missPoint()				
				
				for(var i = 0; i < tapCards.length;i++){

					var tapCard = tapCards[i]

					createPart(stringPart,tapCard.topImg)
					var tween = game.add.tween(tapCard.scale).to({x:1.4,y:1.4},200,"Linear",true,0,0)
					tween.yoyo(true,0)

					popObject(tapCard,600,false)
					popObject(tapCard,800,true,true)
					
				}
				
				tapCards = []
				
			}
			
		}
	}
	
	function hideCard(card,delay){
		
		game.time.events.add(delay,function(){
			game.add.tween(card).to({alpha:0},200,"Linear",true).onComplete.add(function(){
				card.x = -200
				
			})
		})
	}
	
	function createCards(){
		
		cardsGroup = game.add.group()
		sceneGroup.add(cardsGroup)
		
		var pivotX = game.world.centerX - 200
		var pivotY = game.world.centerY - 300
		for(var i = 0; i < numbers.length * 2;i++){
			
			var card = game.add.group()
			card.x = -200
			card.alpha = 0
			card.graphic = true
			card.active = false
			card.tag = numbers[i]
			cardsGroup.add(card)
			
			var backGroup = game.add.group()
			card.add(backGroup)
			
			card.back = backGroup
			
			var cardImage = backGroup.create(0,0,'atlas.frac','card on')
			cardImage.anchor.setTo(0.5,0.5)
			
			if(i < numbers.length){
				
				var shadow = backGroup.create(0,-2,'atlas.frac','shadow')
				shadow.anchor.setTo(0.5,0.5)

				var piecesGroup = game.add.group()
				backGroup.add(piecesGroup)
				card.pieces = piecesGroup

				var angle = 360 / digitNumbers[i]
				var angleNum = angle
				for(var u = 0; u < digitNumbers[i];u++){

					var piece = piecesGroup.create(0,0,'atlas.frac',numbers[i] + 1)
					piece.anchor.setTo(0,1)
					piece.angle = angle

					angle+= angleNum
				}

				var part = backGroup.create(0,shadow.y,'atlas.frac',numbers[i])
				part.anchor.setTo(0.5,0.5)
				
			}else{
				
				var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
				var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
				pointsText.anchor.setTo(0.5,0.5)
				backGroup.add(pointsText)
				
				card.text = pointsText
				card.text.lineSpacing = -25
				card.graphic = false
				card.number = digitNumbers[i - numbers.length]
				
				card.tag = numbers[i - numbers.length]
			}
			
			var topImg = card.create(0,0,'atlas.frac','card off')
			topImg.anchor.setTo(0.5,0.5)
			topImg.alpha = 1
			topImg.active = false
			card.topImg = topImg			
			
			topImg.inputEnabled = true
			topImg.events.onInputDown.add(inputButton)
			
		}
	}
	
	return {
		
		assets: assets,
		name: "frac",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createCards()
                        			
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
			addParticles()
			
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
