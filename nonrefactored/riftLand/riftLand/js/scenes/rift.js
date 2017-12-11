
var soundsPath = "../../shared/minigames/sounds/"
var rift = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"up":"up",
			"down":"down",
			"left":"left",
			"right":"right"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"up":"arriba",
			"down":"abajo",
			"left":"izquierda",
			"right":"derecha"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.rift",
                json: "images/rift/atlas.json",
                image: "images/rift/atlas.png",
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
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
			{	name: "falling",
				file: soundsPath + "falling.mp3"},
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			{	name: "glassbreak",
				file: soundsPath + "glassbreak.mp3"},
			{	name: "flesh",
				file: soundsPath + "flesh.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			{	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive
	var buttonsGroup,usedButtons
	var pivotDrag
	var timeToAdd
	var pivotButtons, pivotObjects
	var directionList, arrowsList
	var buttonCont
	var lastButton
	var particlesGroup, particlesUsed
	var gameSpeed
	var lastTile, lastNumber
	var piecesGroup
    var gameIndex = 9
	var timeShield
	var fieldGroup
	var yogotarGroup
	var moveSpace
	var indexGame
    var overlayGroup
    var medievalSong
	var itemChance
	var diamondColors = [0xFF3F8F,0x7D92FF,0x57E271]
	var tutorialHand
	var machineGroup
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		gameActive = false
		timeToAdd = 1000
		pivotDrag = 83
		pivotButtons = game.world.height - 75
		pivotObjects = 0
		pivotInit = pivotButtons
		arrowsList = ['↑','↓','←','→']
		directionList = ['up','down','left','right']
		moveSpace = 129.6
		gameSpeed = 0.1
		lastTile = []
		lastNumber = 0
		lastButton = null
		canShield = false
		timeShield = 12000
		itemChance = 2
        
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
        
        var pointsText = lookParticle('textPart')
		var pos = -100
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
				pos = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + pos},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function missPoint(){
        
		if(!gameActive){
			return
		}
		
        sound.play("wrong")
		
		createPart('wrong',yogotarGroup.yogoPos)
		        
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
		
		createPart('star',yogotarGroup.yogoPos)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		addNumberPart(yogotarGroup.yogoPos,'+' + number)
		
		var valueAdd = 0.05
		
		if(pointsBar.number > 25){
			valueAdd = 0.025
		}
		
		if(pointsBar.number % 5){
			gameSpeed+=0.04
		}
		
		if(pointsBar.number == 10){
			canShield = true
			itemChance = 1.7
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.rift','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.rift','life_box')

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
        medievalSong.stop()
		
		yogotarGroup.bubble.alpha = 0
		
		yogotarGroup.anim.setAnimationByName(0,"FALLING",false)
		
		if(yogotarGroup.fall){
			
			game.add.tween(yogotarGroup.anim.scale).to({x:0,y:0},500,"Linear",true)
			sound.play("falling")
		}else{
			
			sound.play("flesh")
			
			game.add.tween(yogotarGroup.anim.scale).to({x:2.5,y:2.5},250,"Linear",true)
			game.add.tween(yogotarGroup).to({x:0,y:game.world.centerY - fieldGroup.y, angle:25},250,"Linear",true).onComplete.add(function(){
				
				var rect = new Phaser.Graphics(game)
				rect.beginFill(0xffffff)
				rect.drawRect(0,0,game.world.width *2, game.world.height *2)
				rect.alpha = 0
				rect.endFill()
				sceneGroup.add(rect)
				
				game.add.tween(rect).from({alpha:1},500,"Linear",true)
				
				game.add.tween(yogotarGroup).to({y:yogotarGroup.y + 100},2000,"Linear",true)
				sound.play("glassbreak")
				
			})
		}
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;  
		buttons.getImages(game)
        
        game.load.spine('yogotar', "images/spines/Arthurius.json")  
        game.load.audio('medievalSong', soundsPath + 'songs/fantasy_ballad.mp3');
        
		game.load.image('howTo',"images/rift/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/rift/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/rift/introscreen.png")
		
		game.load.spritesheet('monster', 'images/rift/monster.png', 88, 114, 11);
		game.load.spritesheet('coin', 'images/rift/coin.png', 68, 70, 12);
		game.load.spritesheet('diamond', 'images/rift/diamond.png', 42, 81, 11);
		game.load.spritesheet('machine', 'images/rift/triturador.png', 39, 63, 8);
		        
    }
	
	function getButton(){
		
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var button = buttonsGroup.children[i]
			if(!button.active){
				return button
			}
		}
	}
	
	function activateButton(obj){
		
		buttonsGroup.remove(obj)
		usedButtons.add(obj)
		
		//Phaser.ArrayUtils.shuffle(directionList)
		
		var indexToUse = buttonsGroup.index
		
		if(lastButton){
			indexToUse = lastButton.index
			obj.index = lastButton.index
		}
		
		var direction = arrowsList[indexToUse]
		
		if(buttonsGroup.index <= 3){
			obj.index = buttonsGroup.index
		}
		buttonsGroup.index++
		
		var textToUse = direction
		
		obj.text.setText('')
		obj.text2.setText('')
				
		if(directionList[indexToUse] != 'down' && directionList[indexToUse]!='up'){
			obj.text.setText(textToUse)
		}else{
			obj.text2.setText(textToUse)
		}
											   
		
		obj.tag = directionList[indexToUse]
		
		obj.drag.inputEnabled = true
		obj.active = false
		
	}
	
	function deactivateButton(obj){
		
		obj.alpha = 1
		obj.drag.x = pivotDrag
		obj.drag.y = -200
		obj.active = false
		
		obj.x = obj.drag.x
		obj.y = obj.drag.y
		
		usedButtons.remove(obj)
		buttonsGroup.add(obj)
		
	}
	
	function addButton(){
		
		sound.play("cut")
		
		var button = getButton()
		activateButton(button)
		
		button.drag.tween = game.add.tween(button.drag).to({y:pivotButtons},750,"Linear",true)		
		pivotButtons-= button.height * 0.87
		
		//game.time.events.add(timeToAdd,addButton)
	}
	
	function startTutorial(){
		
		if(!tutorialHand.active){
			return
		}
		
		tutorialHand.alpha = 1
		tutorialHand.x = 100
		tutorialHand.y = game.world.height - 100
		
		game.add.tween(tutorialHand).to({x:buttonCont.x + 50,y:buttonCont.y},1000,"Linear",true).onComplete.add(function(){
			game.add.tween(tutorialHand).to({alpha:0},250,"Linear",true,250).onComplete.add(startTutorial)
		})
	}
	
	function stopTutorial(){
		
		tutorialHand.active = false
		gameSpeed = 0.25
	}
	
	function createTutorial(){
		
		tutorialHand = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.rift','tutorialHand')
		tutorialHand.scale.setTo(0.7,0.7)
		tutorialHand.anchor.setTo(0.5,0.5)
		tutorialHand.alpha = 0
		tutorialHand.active = true
	}
	
    function createOverlay(){
        
		createTutorial()
		
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
				gameActive = true
				
				game.time.events.add(1000,startTutorial)
				
				var delay = 100
				for(var i = 0; i < 4; i++){
					game.time.events.add(delay,addButton)
					delay+=100	
				}				
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1.1,1.1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 75,'atlas.rift','gametuto')
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
		
		var inputLogo = overlayGroup.create(game.world.centerX + 15,game.world.centerY + 145,'atlas.rift',deviceName)
        inputLogo.anchor.setTo(0.5,0.5)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'atlas.rift','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
		
    }
	
	function addTiles(){
		
		var tilesToUse = []
		
		for(var i = 0; i < 3;i++){
			tilesToUse[i] = false
			if(game.rnd.integerInRange(0,3) > 1){
				tilesToUse[i] = true
			}
						
			if(lastNumber == 1){
				if(lastTile[i]){
					tilesToUse[i] = true
				}
			}
		}
		
		if(!tilesToUse[0] && !tilesToUse[1] && !tilesToUse[2]){
			
			var randomIndex = game.rnd.integerInRange(0,tilesToUse.length - 1)
			tilesToUse[randomIndex] = true
						
		}
		
		if(lastNumber == 2){
			
			var indexList = []
			for(var i = 0; i < lastTile.length;i++){
				if(lastTile[i]){
					indexList[indexList.length] = i
				}
			}
			
			//console.log(indexList)
			
			var randomIndex = game.rnd.integerInRange(0,1)
			for(var i = 0; i < indexList.length;i++){
				
				if(i==randomIndex){
					tilesToUse[indexList[i]] = true
				}
			}
			
			if(lastTile[0] && !lastTile[1] && lastTile[2]){
				tilesToUse[0] = true
				tilesToUse[2] = true
			}
		}
		
		if(fieldGroup.length == 1){
			tilesToUse = [true,true,true]
		}
		
		var pivotX = -98
		lastNumber = 0
		
		//console.log(tilesToUse)
		for(var i = 0; i < tilesToUse.length; i++){
			
			if(tilesToUse[i]){
				
				var field = getObject('piece')
				activateObject(field,pivotX,pivotObjects,true)
				
				if(Math.random()*itemChance > 1){
					
					var obj
					if(canShield){
						checkShield()
						obj = getObject('shield')
					}else{
						
						if(pointsBar.number > 10 && Math.random()*2 > 1){
							obj = getObject('diamond')
							
							if(pointsBar.number < 15){
								obj.tint = diamondColors[0]
								obj.value = 3
							}else if(pointsBar.number < 20){
								obj.tint = diamondColors[1]
								obj.value = 5
							}else{
								obj.tint = diamondColors[2]
								obj.value = 10
							}
							
						}else{
							obj = getObject('coin')
						}
					}
					
					activateObject(obj,field.x,field.y,true)

				}
					
				lastNumber++
			}else{
				
				if(Math.random()*1.75 > 1){
					
					var field = getObject('piece')
					activateObject(field,pivotX,pivotObjects,true)

					var monster = getObject('monster')
					activateObject(monster,field.x, field.y,true)
				}
				
				
			}
			pivotX+= moveSpace
				
		}
		
		fieldGroup.remove(yogotarGroup)
		fieldGroup.add(yogotarGroup)
		
		lastTile = tilesToUse
		
		pivotObjects+= moveSpace
		
		//console.log(lastNumber + ' lastNumber, ' + lastTile)
	}
	
	function checkShield(){
		
		canShield = false
		game.time.events.add(timeShield * 2,function(){
			canShield = true
		})
		
	}
	
	function activateObject(obj,posX, posY,initial){
		
		var animateAlpha = initial || false
		
		obj.x = posX
		obj.y = posY
				
		piecesGroup.remove(obj)
		fieldGroup.add(obj)
				
		obj.active = true
		
		if(animateAlpha){
			game.add.tween(obj).to({alpha:1},500,"Linear",true)
		}else{
			obj.alpha = 1
		}
		
		if(obj.tag == 'shield'){
			obj.tween = game.add.tween(obj.scale).to({x:1.2,y:1.2},500,"Linear",true,0,-1)
        	obj.tween.yoyo(true,0)
		}
		
	}
	
	function deactivateObject(obj){
		
		//console.log('deactivated')
		
		fieldGroup.remove(obj)
		piecesGroup.add(obj)
		
		obj.active = false
		obj.alpha = 0
		obj.x = -200
		
		if(obj.tag == 'shield'){
			if(obj.tween){
				obj.tween.stop()
				obj.scale.setTo(1,1)
			}
		}
	}
	
	function getObject(tag){
		
		for(var i = 0; i < piecesGroup.length; i++){
			
			var piece = piecesGroup.children[i]
			
			if(piece.tag == tag && !piece.active){
				return piece
			}
		}
	}
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x3d97c4)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.endFill()
		sceneGroup.add(rect)
		
		var canon = game.add.tileSprite(game.world.centerX + 100 ,0,178, game.world.height, 'atlas.rift','canon');
		sceneGroup.add(canon)
		
		var canon2 = game.add.tileSprite(canon.x ,0,178, game.world.height, 'atlas.rift','canon');
		canon2.scale.x = -1
		sceneGroup.add(canon2)
		
		var backTop = sceneGroup.create(0,0,'atlas.rift','backtop')
		backTop.width = game.world.width
		
		var moon = sceneGroup.create(game.world.centerX,75,'atlas.rift','moon')
		moon.anchor.setTo(0.5,0.5)
		
	}
	
	function createInterface(){
		
		var container = sceneGroup.create(0,game.world.height,'atlas.rift','backleft')
		container.anchor.setTo(0,1)
		
		var backLeft = sceneGroup.create(0,game.world.height - container.height,'atlas.rift','container')
		backLeft.height = game.world.height - container.height
		backLeft.anchor.setTo(0,1)
		
		var containerBar = game.add.tileSprite(backLeft.width,game.world.height ,game.world.width,108, 'atlas.rift','dragcont');
		containerBar.anchor.setTo(0,1)
		containerBar.width = game.world.width - backLeft.width
		containerBar.scale.y = 1.1
		sceneGroup.add(containerBar)
		sceneGroup.cont = containerBar
		
		buttonCont = sceneGroup.create(containerBar.x + containerBar.width * 0.5, game.world.height - 50,'atlas.rift','buttoncont')
		buttonCont.anchor.setTo(0.5,0.5)

	}
	
	function update(){
		
		if(!gameActive){
			return
		}
		
		checkObjects()
	}
	
	function checkObjects(){
		
		fieldGroup.y-= gameSpeed
		
		for(var i = 0; i < usedButtons.length;i++){
			
			var button =  usedButtons.children[i]
			var drag = button.drag
			
			button.x = drag.x
			button.y = drag.y
		}
		
		for(var i = 0; i < fieldGroup.length;i++){
			
			var object = fieldGroup.children[i]
			
			if(object.active){
				
				if(checkOverlap(object,machineGroup)){
					
					if(object.tag == 'piece'){
						sound.play("explode")
						createPart('rock',object)
					}
					
					deactivateObject(object)
					break
				}
			}
			
		}
		
		if(checkOverlap(yogotarGroup.yogoPos,machineGroup)){
			yogotarGroup.fall = false
			missPoint()
		}
		
		if(yogotarGroup.yogoPos.world.y > game.world.height){
			missPoint()
		}
	}
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('textPart')
        
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
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x + offX
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
                particle = particlesGroup.create(-200,0,'atlas.rift',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
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
		
        var exp = sceneGroup.create(0,0,'atlas.rift','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.rift','smoke');
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
	
	function createButtons(){
		
		buttonsGroup = game.add.group()
		buttonsGroup.index = 0
		sceneGroup.add(buttonsGroup)
		
		usedButtons = game.add.group()
		sceneGroup.add(usedButtons)
		
		for(var i = 0; i < 7;i++){
			
			var group = game.add.group()
			group.x = game.world.centerX
			group.y = -200
			buttonsGroup.add(group)
			
			var buttonImage = group.create(0,0,'atlas.rift','dragobject')
			buttonImage.anchor.setTo(0.5,0.5)
			
			var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#000000", align: "left", wordWrap: true, wordWrapWidth: 220}
			
			var pointsText = new Phaser.Text(sceneGroup.game, 0, -5, "", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)
			
			group.text = pointsText
			
			var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "left", wordWrap: true, wordWrapWidth: 220}
			
			var pointsText = new Phaser.Text(sceneGroup.game, 0, -5, "", fontStyle)
			pointsText.scale.y = 0.7
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)
			
			group.text2 = pointsText
			
			var dragImage = sceneGroup.create(83,-200,'atlas.rift','dragobject')
			dragImage.anchor.setTo(0.5,0.5)
			dragImage.alpha = 0
			group.drag = dragImage
			
			dragImage.active = true
			dragImage.inputEnabled = true
			dragImage.input.enableDrag(true)
			dragImage.events.onDragStart.add(onDragStart, this);
			dragImage.events.onDragStop.add(onDragStop, this);
			dragImage.tween = null
			dragImage.button = group
			
			group.active = false
			group.tag = null
			
		}
	}
	
	function checkButtons(){
		
		pivotButtons = pivotInit
		
		for(var i = 0; i < usedButtons.length;i++){
			
			var button = usedButtons.children[i]
			if(!button.active){
				
				var drag = button.drag
				
				if(drag.tween){
					drag.tween.stop()
					drag.tween = null
				}
				
				button.drag.tween = game.add.tween(button.drag).to({y:pivotButtons},300,"Linear",true)
				pivotButtons-=button.height * 0.87
			}
		}
	}
	
	function onDragStart(obj){
        
        if(!gameActive){
            return
        }
		
		if(tutorialHand.active){
			stopTutorial()
		}
		
		lastButton = obj.button
		
		if(obj.tween){
			obj.tween.stop()
		}
		
		obj.button.active = true
		addButton()
		
		checkButtons()
        
        sound.play("flipCard")
        
    }
	
	function moveYogotar(direction){
		
		if(!gameActive){
			return
		}
		
		var moveX = 0
		var moveY = 0
		var animationName = 'IDLE'
		
		switch(direction){
			case 'up':
				moveY = -moveSpace
				animationName = 'FRONT_BACK'
			break;
			case 'down':
				moveY = moveSpace
				animationName = 'FRONT_BACK'
				addTiles()
			break;
			case 'right':
				animationName = 'LEFT_RIGTH'
				moveX = moveSpace
			break;
			case 'left':
				animationName = 'LEFT_RIGTH'
				yogotarGroup.anim.scale.x = Math.abs(yogotarGroup.anim.scale.x) * -1
				moveX = -moveSpace
			break;
		}
		
		yogotarGroup.anim.setAnimationByName(0,animationName,false)
		sound.play("whoosh")
		game.add.tween(yogotarGroup).to({x:yogotarGroup.x + moveX, y: yogotarGroup.y + moveY},500,"Linear",true).onComplete.add(function(){
			
			if(gameActive){
				yogotarGroup.anim.setAnimationByName(0,'IDLE',true)
				yogotarGroup.anim.scale.x = Math.abs(yogotarGroup.anim.scale.x)
				checkYogotar()
			}
			
		})
	}
	
	function checkYogotar(){
		
		var isStanding = false
		
		yogotarGroup.fall = true
		for(var i = 0; i < fieldGroup.length;i++){
			
			var object = fieldGroup.children[i]
			
			if(checkOverlap(yogotarGroup,object)){
				
				var tag = object.tag
				if(tag == 'piece'){
					isStanding = true
				}else if(tag == 'monster'){
					if(yogotarGroup.invincible){
						addPoint(1)
						deactivateObject(object)
					}else{
						yogotarGroup.fall = false
						isStanding = false
					}
					break
				}else if(tag == 'coin'){
					addPoint(1)
					deactivateObject(object)
					break
				}else if(tag == 'shield'){
					activateShield()
					deactivateObject(object)
					break
				}else if(tag == 'diamond'){
					addPoint(object.value)
					deactivateObject(object)
				}
				
			}
		}
		
		if(!isStanding){
			
			missPoint()
		}
	}
	
	function activateShield(){
		
		sound.play('powerup')
		yogotarGroup.bubble.alpha = 1
		yogotarGroup.invincible = true
		changeColorBubble()
		
		game.add.tween(yogotarGroup.bubble).to({alpha: 0},200,"Linear",true,timeShield,5).onComplete.add(function(){
			
			yogotarGroup.invincible = false
			yogotarGroup.bubble.alpha = 0
		})
	}
	
	function disappearButton(obj){
		
		game.add.tween(obj.button).to({alpha:0},250,"Linear",true).onComplete.add(function(){
			deactivateButton(obj.button)
		})
		
	}
	
	function onDragStop(obj){
		
		obj.inputEnabled = false
		
		if(checkOverlap(obj,sceneGroup.cont)){
			
			game.add.tween(obj.button.scale).from({x:1.4,y:1.4},500,"Linear",true)
			game.add.tween(obj).to({x:buttonCont.x,y:buttonCont.y},500,"Linear",true).onComplete.add(function(){
				disappearButton(obj)
			})
			moveYogotar(obj.button.tag)
			
		}else{
			
			sound.play('flipCard')
			game.add.tween(obj.button).to({alpha:0,angle:obj.button.angle + 720},300,"Linear",true).onComplete.add(function(){
				deactivateButton(obj.button)
			})
		}
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function addMusic(){
		
		medievalSong = game.add.audio('medievalSong')
		game.sound.setDecodedCallback(medievalSong, function(){
			medievalSong.loopFull(0.6)
		}, this);

		game.onPause.add(function(){
			game.sound.mute = true
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
		}, this);
	}
	
	function createField(){
		
		fieldGroup = game.add.group()
		fieldGroup.x = game.world.centerX + 80
		fieldGroup.y = game.world.centerY
		sceneGroup.add(fieldGroup)
		
		piecesGroup = game.add.group()
		sceneGroup.add(piecesGroup)
		
		createObjects('piece',1.2,24)
		createObjects('monster',0.8,12)
		createObjects('coin',1,12)
		createObjects('shield',1,12)
		createObjects('diamond',1,12)
		
		yogotarGroup = game.add.group()
		yogotarGroup.fall = false
		yogotarGroup.invincible = false
		fieldGroup.add(yogotarGroup)
		
		var yogotar = game.add.spine(33,40, "yogotar");
		yogotar.scale.setTo(0.8,0.8)
		yogotar.setSkinByName("normal")
		yogotar.setAnimationByName(0,"IDLE",true)
		yogotarGroup.add(yogotar)
		
		yogotarGroup.anim = yogotar
		
		var yogoPos = yogotarGroup.create(33,-5,'atlas.rift','yogotar')
		yogoPos.alpha = 0
		yogoPos.scale.setTo(0.7,0.7)
		yogoPos.anchor.setTo(0.5,0.5)
		yogotarGroup.yogoPos = yogoPos
		
		var bubble = yogotarGroup.create(33,-5,'atlas.rift','bubble')
		bubble.anchor.setTo(0.5,0.5)
		bubble.alpha = 0
		yogotarGroup.bubble = bubble
		
		createMachine()
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()	
		
		createParticles('star',5)
		createParticles('wrong',5)
		createParticles('text',6)
		createParticles('rock',5)
		
	}
	
	function createMachine(){
		
		machineGroup = game.add.group()
		machineGroup.x = game.world.centerX - 50
		machineGroup.y = 150
		sceneGroup.add(machineGroup)
		
		var pivotX = 0
		
		for(var i = 0; i< 8;i++){
			
			var obj = game.add.sprite(pivotX, 0, 'machine');
			obj.animations.add('walk');
			obj.animations.play('walk',12,true);
			machineGroup.add(obj)
			
			pivotX+= obj.width
		}
	}
	
	function changeColorBubble(){
        var delay = 0
        var timeDelay = 250
        
        for(var counter = 0; counter < 60;counter++){
            game.time.events.add(delay, function(){
                
                var color = Phaser.Color.getRandomColor(0,255,255)
                yogotarGroup.bubble.tint = color
                
            } , this);
            delay+=timeDelay
        }    
    }
	
	function createObjects(tag,scale,number){
		
		for(var i = 0; i< number;i++){
			
			var obj 
			if(tag == 'monster' || tag == 'coin' || tag == 'diamond'){
				
				obj = game.add.sprite(-200, 0, tag);
                piecesGroup.add(obj)
                obj.animations.add('walk');
                obj.animations.play('walk',12,true);
				
			}else{
				
				obj = piecesGroup.create(-200,0,'atlas.rift',tag)
			}
			
			obj.anchor.setTo(0.5,0.5)
			obj.scale.setTo(scale,scale)
			obj.active = false
			obj.tag = tag
			obj.alpha = 0
			
		}
	}
	
	return {
		
		assets: assets,
		name: "rift",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);
			
			addMusic()
			createBackground()
			createField()
			
            initialize()
			
			createInterface()
			createButtons()
			            
			createPointsBar()
			createHearts()
			
			sceneGroup.add(particlesUsed)
			
			for(var i = 0; i < 4;i++){
				addTiles()
			}
			
			buttons.getButton(medievalSong,sceneGroup)
			
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()