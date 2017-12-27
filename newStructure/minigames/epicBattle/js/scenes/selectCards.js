
var soundsPath = "../../shared/minigames/sounds/"
var selectCards = function(){
    
    var localizationData = {
		"EN":{
			"challenger":"CHALLENGER"
		},

		"ES":{
			"challenger":"RETADOR"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.select",
                json: "images/selectCards/atlas.json",
                image: "images/selectCards/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},

			
			
		],
    }
    
	var CARD_SCALE = 0.5
        
    var lives = null
	var sceneGroup = null
	var background, stars
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
	var vsSpine
	var whiteFade
	var spineList
	var characterGroup
	var playerGUI
	var battleButton
	var characterList
	var enemyCard
	var slotCards
	var playerCards
	var currentPlayer
	var whiteFade
	
	var colorsGradient = {
    	fire:0xff2e2e,
		water:0x436bff,
		wind:0xfffd73,
		earth:0x4cff39
    }
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1

        
        loadSounds()
        
	}

    function popObject(obj,delay,fromX,fromY){
        
		var scaleX = fromX || 0
		var scaleY = fromY || 0
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x: scaleX, y: scaleY},250,Phaser.Easing.linear,true)
        },this)
    }
	
	function fadeObject(obj,delay,alpha){
        
		var alphaUse = alpha || 1
        game.time.events.add(delay,function(){
            
            game.add.tween(obj).to({ alpha:alphaUse},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
		game.add.tween(sceneGroup).from({alpha:0},1000,"Linear",true).onComplete.add(function(){
			gameActive = true
			
			var animObjects = [sceneGroup.challengerText,enemyCard,slotCards]
			
			var delay = 0
			for(var i = 0; i < animObjects.length;i++){
				
				var obj = animObjects[i]
				fadeObject(obj,delay)
				
				delay+= 200
			}
			
			popObject(playerGUI,delay,0,1)
			delay+= 200
			for(var i = 0; i < playerCards.length;i++){
				
				var card = playerCards.children[i]
				popObject(card,delay)
				
				delay+= 200
			}
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
    
    function stopGame(win){
        
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
		
		game.load.bitmapFont('luckiest', 'images/bitfont/font.png', imagesPath + 'bitfont/font.fnt');
        
        game.load.spine('vs', "images/spines/vsLight/VS.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/versusSong.mp3');
		
		console.log(localization.getLanguage() + ' language')

		// for(var i = 0; i < spineList.length;i++){
		//
		// 	var character = spineList[i]
		// 	game.load.spine(character.name,character.dir)
		// }
        
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		var topBack = sceneGroup.create(0,0,'atlas.select','topgradient')
		topBack.width = game.world.width
		topBack.height *= 0.85
		
		var challengerGroup = game.add.group()
		challengerGroup.x = game.world.centerX
		challengerGroup.y = 25
		challengerGroup.alpha = 0
		sceneGroup.add(challengerGroup)
		
		var chalText = game.add.bitmapText(5,5, 'luckiest', localization.getString(localizationData,'challenger'), 45);
		chalText.tint = 0x000000
		chalText.anchor.setTo(0.5,0.5)
		challengerGroup.add(chalText)
		
		var chalText = game.add.bitmapText(0,0, 'luckiest', localization.getString(localizationData,'challenger'), 45);
		chalText.anchor.setTo(0.5,0.5)
		challengerGroup.add(chalText)
		
		sceneGroup.challengerText = challengerGroup
		
		var midBack = sceneGroup.create(0,topBack.height,'atlas.select','middle')
		midBack.anchor.setTo(0,0)
		midBack.width = game.world.width
		
		var deck = sceneGroup.create(0,midBack.y,'atlas.select','deck_deploy')
		deck.anchor.setTo(0,0)
		deck.width = game.world.width
		deck.height*= 0.9
		
		sceneGroup.remove(midBack)
		sceneGroup.add(midBack)
		
		var deckBot = sceneGroup.create(0,deck.y + deck.height,'atlas.select','deck_gradient')
		deckBot.anchor.setTo(0,0)
		deckBot.width = game.world.width
		
		playerGUI = game.add.group()
		playerGUI.alpha = 0
		playerGUI.x = deckBot.x
		playerGUI.y = deckBot.y - 50
		sceneGroup.add(playerGUI)		
		
		var level = playerGUI.create(0,0,'atlas.select','username_leve')
		
		var bar = game.add.tileSprite(level.width,27,game.world.width,36,'atlas.select','username-bar')
		playerGUI.add(bar)
		
		var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
		var levelText = new Phaser.Text(sceneGroup.game, 130, 15, currentPlayer.level, fontStyle)
		playerGUI.add(levelText)
				
		var name = parent.epicModel.getCredentials().name || "Yogotarsin"
		
		var playerName = game.add.bitmapText(310,40, 'luckiest', name, 35);
		playerName.anchor.setTo(0.5,0.5)
		playerGUI.add(playerName)
		
		playerGUI.nameText = playerName
		playerGUI.levelText = levelText
	}
	
	function update(){
		

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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
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

				particle.makeParticles('atlas.select',tag);
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
		
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        whiteFade.alpha = 0
        whiteFade.endFill()
		sceneGroup.add(whiteFade)

	}
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
		if(obj.tween){
			obj.tween.stop()
			obj.scale.setTo(1,1)
		}
		
		sound.play("pop")
		var tween = game.add.tween(obj.scale).to({x:0.8,y:0.8},200,"Linear",true,0,0)
		tween.yoyo(true,0)
		
	}
	
	function setCharacters(charactersLoad){
		
		spineList = []
		
		for(var i = 0; i < charactersLoad.length;i++){
			
			var character = charactersLoad[i]
			spineList[i]= {}
			spineList[i].id = character.data.id
			spineList[i].name = character.data.name
			spineList[i].dir = character.data.directory
			spineList[i].scale = character.data.spine.options.scale
			spineList[i].element = character.data.stats.element
		}
		
	}
	
	function createCards(){
		
		var card = {id : spineList[1].id, xp : 0, data : epicCharacters[spineList[1].id]}

		enemyCard = charactersEntity.getCard(card)
		enemyCard.x = game.world.centerX
		enemyCard.y = 135
		enemyCard.alpha = 0
		enemyCard.scale.setTo(CARD_SCALE,CARD_SCALE)
		sceneGroup.add(enemyCard)
		
		slotCards = sceneGroup.create(game.world.centerX, game.world.centerY - 25,'atlas.select','caard_slot')
		slotCards.alpha = 0
		slotCards.anchor.setTo(0.5,0.5)
		slotCards.empty = true
		
		playerCards = game.add.group()
		sceneGroup.add(playerCards)
		
		if(currentPlayer.cards.length < 1){
			currentPlayer.cards[currentPlayer.cards.length] = {id:"yogotarEagle", xp:0, data:epicCharacters["yogotarEagle"]}
		}
		
		var pivotX = game.world.centerX - 150
		var pivotY = game.world.centerY + 250
		var initPivotX = pivotX
		for(var i = 0; i < currentPlayer.cards.length;i++){
			
			var card = charactersEntity.getCard(currentPlayer.cards[i])
			card.alpha = 0
			card.x = pivotX
			card.y = pivotY
			card.scale.setTo(CARD_SCALE,CARD_SCALE)
			playerCards.add(card)
			
			var cardInput = card.create(0,0,'atlas.select','star')
			cardInput.alpha = 0
			cardInput.inputEnabled = true
			cardInput.scale.setTo(3,3)
			cardInput.anchor.setTo(0.5,0.5)
			cardInput.events.onInputDown.add(inputCard)
			
			pivotX+= 150
			if((i+1) % 3 == 0){
				pivotY+= 150
				pivotX = initPivotX
			}
			
		}
		
		battleButton = sceneGroup.create(game.world.centerX,sceneGroup.children[2].y + 10,'atlas.select','chaallenge')
		battleButton.anchor.setTo(0.5,0.5)
		battleButton.alpha = 0
		battleButton.inputEnabled = false
		battleButton.events.onInputDown.add(inputButton)
		
	}
	
	function inputCard(card){
				
		if(!slotCards.empty && !gameActive){
			return
		}
		
		var parent = card.parent
		sound.play("magic")
		
		createPart('star',card)
		
		game.add.tween(parent).to({x:slotCards.x,y:slotCards.y,angle:parent.angle + 360},500,"Linear",true)
		slotCards.empty = false
		
		if(battleButton.alpha == 0){
			popObject(battleButton,0)
			
			game.time.events.add(300,function(){
				
				battleButton.inputEnabled = true
				
				battleButton.tween = game.add.tween(battleButton.scale).to({x:0.8,y:0.8},200,"Linear",true,0,-1)
				battleButton.tween.yoyo(true,0)
			})
			
		}
		
	}
	
	return {
		
		assets: assets,
		name: "selectCards",
		update: update,
        preload:preload,
		setCharacters:setCharacters,
		create: function(event){
            
			var preloadAlpha = document.getElementById("preloadBattle");
        	preloadAlpha.style.visibility = "hidden";
			
			sceneGroup = game.add.group()
			currentPlayer = parent.epicModel.getPlayer()
			
			createBackground()
			createCards()
			
			addParticles()
                        	
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
				game.time.events.add(1000,function(){
					//spaceSong.loopFull(0.8)
				})
                
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			
			buttons.getButton(spaceSong,sceneGroup,game.world.width - 100)
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()