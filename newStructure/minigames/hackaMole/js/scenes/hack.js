
var soundsPath = "../../shared/minigames/sounds/"

var hack = function(){
    
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
                name: "atlas.hack",
                json: "images/hack/atlas.json",
                image: "images/hack/atlas.png",
            },

        ],
        images: [
        	{   name:"tutorial_image",
				file: "images/hack/tutorial_image.png"}
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
				file: soundsPath + "rightChoice.mp3"},
			{	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "punch",
				file: soundsPath + "punch3.mp3"},
            {	name: "medievalSong",
				file: soundsPath + "songs/upbeat_casual_8.mp3"},
		],
        spines:[
			{
				name:"topo",
				file:"images/spines/front.json"
			},
            {
				name:"topo_side",
				file:"images/spines/side.json"
			}
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            }
        ],
    }
       
    var INITIAL_LIVES = 3
    var lives = null
	var sceneGroup = null
    var gameActive
	var buttonsGroup,usedButtons
    var particleCorrect, particleWrong
	var pivotDrag
	var pivotButtons
	var directionList, arrowsList
	var buttonCont
	var lastButton
	var lastTile, lastNumber
	var piecesGroup
    var gameIndex = 27
	var timeShield
	var fieldGroup
	var yogotarGroup
	var moveSpace
	var indexGame
    var overlayGroup
    var medievalSong
	var itemChance
	var tutorialHand
	var machineGroup
	var background
	var badTopo
    var coin
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
		gameActive = false
		pivotDrag = game.world.height - 200
		pivotButtons = game.world.centerX - 220
		pivotInit = pivotButtons
		arrowsList = ['↑','↓','←','→']
		directionList = ['up','down','left','right']
		moveSpace = 150
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
            
			obj.scale.setTo(1,1)
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
    
    function missPoint(){
        
		if(!gameActive){
			return
		}
        
        particleWrong.x = yogotarGroup.centerX 
        particleWrong.y = yogotarGroup.centerY
        particleWrong.start(true, 1200, null, 10)

		yogotarGroup.anim.setAnimationByName(0,"hit",true)
		yogotarGroup.side.setAnimationByName(0,"hit",true)
		
		badTopo.anim.setAnimationByName(0,"hit",true)
		badTopo.side.setAnimationByName(0,"hit",true)
		//badTopo.side.setAnimationByName(0,"hit",true)
		
		gameActive = false
		setTimeout(function(){
			gameActive = true
			yogotarGroup.anim.setAnimationByName(0,"idle",true)
			yogotarGroup.side.setAnimationByName(0,"idle",true)
			badTopo.anim.setAnimationByName(0,"idle",true)
			badTopo.side.setAnimationByName(0,"idle",true)
			if(badTopo.ready){
				addBadTopo()
			}

		},500)
		
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
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
		
		if(pointsBar.number % 2 == 0){
			addObject('hit')
		}
		
		if(pointsBar.number > 9 && pointsBar.number % 5 == 0 && !badTopo.ready){
			addBadTopo()
		}
    }
	
	function addBadTopo(){
		
		var holeIndex = 0
		
		badTopo.ready = true
		
		badTopo.x = holesGroup.children[holeIndex].x
		badTopo.y = holesGroup.children[holeIndex].y - 35
		
		while(checkOverlap(badTopo,yogotarGroup)){
			holeIndex++
			badTopo.x = holesGroup.children[holeIndex].x
			badTopo.y = holesGroup.children[holeIndex].y
		}
		sound.play("flesh")
	}
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.hack','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.hack','life_box')

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
    
    function stopGame(){
 	 	//parent._QUANTRIX.Mixpanel.endMinigame(pointsBar.number)

    	//var validSession = new parent._QUANTRIX.NotifyPlayed({data : {'child_id' : parent._QUANTRIX.Storage.getInLocalstorage(parent._QUANTRIX.LOCALSTORAGE.CHILD_ID),'token' : parent._QUANTRIX.Storage.getInLocalstorage(parent._QUANTRIX.LOCALSTORAGE.TOKEN),'minigame_id' : parent._QUANTRIX.GAMES[parent._QUANTRIX._activeRoute].index,'score' : pointsBar.number},onSuccess : parent._QUANTRIX._notifyMinigamePlayed,onError : parent._QUANTRIX._goDashboard});
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        medievalSong.stop()

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
    }
	
	function getButton(){

		if(buttonsGroup.length == 0){
			createSingleButton()
		}

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

		//usedButtons.bringToTop(obj)
		obj.alpha = 1
		obj.drag.x = -200
		obj.drag.y = pivotDrag
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
		obj.drag.y = pivotDrag
		obj.drag.x = -200
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
		//buttonsGroup.bringToTop(button)
		
		button.drag.tween = game.add.tween(button.drag).to({x:pivotButtons,y:pivotDrag},300,"Linear",true)		
		pivotButtons+= button.width * 1.1
        
        if(tutorialHand.active){
            button.drag.inputEnabled = false
            tutorialHand.btns.push(button)
        }
	}
	
	function startTutorial(){
		
		if(!tutorialHand.active){
			return
		}
        
        tutorialHand.btns = []
        
        var delay = 100
		for(var i = 0; i < 4; i++){
			game.time.events.add(delay,addButton)
			delay+=100	
		}	
		
		tutorialHand.alpha = 1
		tutorialHand.x = game.world.centerX - 200
		tutorialHand.y = game.world.height - 150
		
		var handTween = game.add.tween(tutorialHand).to({x:buttonCont.x + 50,y:buttonCont.y + 25},1000,"Linear",true, delay)
        handTween.onComplete.add(function(){
            tutorialHand.btns[0].drag.inputEnabled = true
			game.add.tween(tutorialHand).to({alpha:0},250,"Linear",true,250).onComplete.add(function(){
                if(tutorialHand.active){
                    tutorialHand.alpha = 1
                    tutorialHand.x = game.world.centerX - 200
                    tutorialHand.y = game.world.height - 150
                    handTween.start()
                }
            })
		})
	}
	
	function stopTutorial(){
		
		tutorialHand.active = false
        tutorialHand.btns.forEach(function(btn){
            btn.drag.inputEnabled = true
        })
        tutorialHand.destroy()
	}
	
	function createTutorial(){
		
		tutorialHand = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.hack','tutorialHand')
		tutorialHand.scale.setTo(0.7,0.7)
		tutorialHand.anchor.setTo(0.5,0.5)
		tutorialHand.alpha = 0
		tutorialHand.active = true
	}
	
	function addObject(tag){
		
		var index = game.rnd.integerInRange(0,holesGroup.length - 1)
			
		while(holesGroup.children[index].carrot.active || checkOverlap(holesGroup.children[index].carrot,yogotarGroup.yogoPos) || (badTopo.ready && index == 4)){
			index = game.rnd.integerInRange(0,holesGroup.length - 1)
		}

		
		var hole = holesGroup.children[index]
				
		if(tag == 'carrot'){
			
			var carrot = hole.carrot
			carrot.alpha = 1
			carrot.active = true
			
			popObject(carrot,0)
			
		}else if(tag == 'hit'){
			
			hole.hit.alpha = 1
			hole.hit.number = game.rnd.integerInRange(2,9)
			hole.hit.text.setText(hole.hit.number)
			
			popObject(hole.hit,0)
		}
			
	}
	
    function createOverlay(){
        
		createTutorial()
		
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
		
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		gameActive = true
		
		game.time.events.add(1000,startTutorial)
        
		addObject('carrot')
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

		background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.hack','background')
		sceneGroup.add(background)
	}
	
	function createInterface(){
		
		var containerBar = game.add.tileSprite(0,game.world.height + 100 ,game.world.width,402, 'atlas.hack','dragcont');
		containerBar.anchor.setTo(0,1)
		containerBar.width = game.world.width
		containerBar.scale.y = 1.1
		sceneGroup.add(containerBar)
		
		var backContainer = sceneGroup.create(game.world.centerX, game.world.height,'atlas.hack','baseContainer')
		backContainer.anchor.setTo(0.5,1)
		sceneGroup.cont = backContainer
		
		var gameName = sceneGroup.create(backContainer.x, game.world.height - 140,'atlas.hack','gameName')
		gameName.anchor.setTo(0.5,0.5)
		
		buttonCont = sceneGroup.create(containerBar.x + containerBar.width * 0.5, game.world.height - 60,'atlas.hack','buttoncont')
		buttonCont.anchor.setTo(0.5,0.5)
		buttonCont.scale.setTo(0.8,0.8)
	}
	
	function update(){
		
		//background.tilePosition.x-=0.5
		if(!gameActive){
			return
		}
		
		checkObjects()
	}
	
	function checkObjects(){
		
		for(var i = 0; i < usedButtons.length;i++){
			
			var button =  usedButtons.children[i]
			var drag = button.drag
			
			button.x = drag.x
			button.y = drag.y
		}
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
		
		for(var i = 0; i < 9;i++){
			createSingleButton()
			
		}
	}

	function createSingleButton(){
		var group = game.add.group()
		group.x = game.world.centerX
		group.y = -200
		group.alpha = 0
		buttonsGroup.add(group)
		
		var buttonImage = group.create(0,0,'atlas.hack','dragobject')
		buttonImage.anchor.setTo(0.5,0.5)
		buttonImage.scale.setTo(1.2,1.2)
		
		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#000000", align: "left", wordWrap: true, wordWrapWidth: 220}
		
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		group.add(pointsText)
		
		group.text = pointsText
		
		var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "left", wordWrap: true, wordWrapWidth: 220}
		
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "", fontStyle)
		pointsText.scale.y = 0.7
		pointsText.anchor.setTo(0.5,0.5)
		group.add(pointsText)
		
		group.text2 = pointsText
		
		var dragImage = sceneGroup.create(83,-200,'atlas.hack','dragobject')
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
				
				button.drag.tween = game.add.tween(button.drag).to({x:pivotButtons},300,"Linear",true)
				pivotButtons+= button.width * 1.1
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
		//usedButtons.bringToTop(obj.button)
		addButton()
		
		checkButtons()
        usedButtons.bringToTop(obj.button)
        sound.play("flipCard")
        
    }
	
	function moveYogotar(direction){
		
		if(!gameActive){
			return
		}
		
		var moveX = 0
		var moveY = 0
		var animationName = 'out&in'
		
		switch(direction){
			case 'up':
				moveY = -moveSpace
				if(yogotarGroup.y < game.world.centerY - 250){
					moveY = 0
				}
                yogotarGroup.anim.alpha = 1
                yogotarGroup.side.alpha = 0
			break;
			case 'down':
				moveY = moveSpace
				if(yogotarGroup.y > game.world.centerY - 100){
					moveY = 0
				}
                yogotarGroup.anim.alpha = 1
                yogotarGroup.side.alpha = 0
			break;
			case 'right':
				moveX = moveSpace * 1.33
				if(yogotarGroup.x > game.world.centerX + 100){
					moveX = 0
				}
                yogotarGroup.anim.alpha = 0
                yogotarGroup.side.alpha = 1
                yogotarGroup.side.scale.setTo(-0.8, 0.8)
			break;
			case 'left':
				moveX = -moveSpace * 1.33
				if(yogotarGroup.x < game.world.centerX - 100){
					moveX = 0
				}
                yogotarGroup.anim.alpha = 0
                yogotarGroup.side.alpha = 1
                yogotarGroup.side.scale.setTo(0.8)
			break;
		}
		
		minusNumber()
		
		if(badTopo.ready){
            
            switch(direction){
                case 'up':
                    badTopo.anim.alpha = 1
                    badTopo.side.alpha = 0
                break;
                case 'down':
                    badTopo.anim.alpha = 1
                    badTopo.side.alpha = 0
                break;
                case 'right':
                    badTopo.anim.alpha = 0
                    badTopo.side.alpha = 1
                    badTopo.side.scale.setTo(0.8)
                break;
                case 'left':
                    badTopo.anim.alpha = 0
                    badTopo.side.alpha = 1
                    badTopo.side.scale.setTo(-0.8, 0.8)
                break;
            }
			
			var moveTopoX = -moveX
			var moveTopoY = -moveY
			
			if(badTopo.x < game.world.centerX - 100 && moveTopoX < 0){
				moveTopoX = 0
			}else if(badTopo.x > game.world.centerX + 100 && moveTopoX > 0){
				moveTopoX = 0
			}
			
			if(badTopo.y < game.world.centerY - 250 && moveTopoY < 0){
				moveTopoY = 0
			}else if(badTopo.y > game.world.centerY -100 && moveTopoY > 0){
				moveTopoY = 0
			}
						
			game.add.tween(badTopo.scale).to({x:0,y:0},50,"Linear",true)
			game.add.tween(badTopo).to({x:badTopo.x + moveTopoX,y:badTopo.y + moveTopoY},200,"Linear",true).onComplete.add(function(){
				game.add.tween(badTopo.scale).to({x:1,y:1},50,"Linear",true)
			})
			badTopo.anim.setAnimationByName(0,animationName,true)
			badTopo.side.setAnimationByName(0,animationName,true) 
		}
		
		game.add.tween(yogotarGroup.scale).to({x:0.01,y:0.01},50,"Linear",true)
		
		yogotarGroup.anim.setAnimationByName(0,animationName,false)
		yogotarGroup.side.setAnimationByName(0,animationName,false)
		sound.play("whoosh")
		game.add.tween(yogotarGroup).to({x:yogotarGroup.x + moveX, y: yogotarGroup.y + moveY},200,"Linear",true).onComplete.add(function(){
			
			game.add.tween(yogotarGroup.scale).to({x:1,y:1},50,"Linear",true)
			
			if(gameActive){
				
				yogotarGroup.anim.setAnimationByName(0,'idle',true)
				yogotarGroup.side.setAnimationByName(0,'idle',true)
				
				if(badTopo.ready){
					badTopo.anim.setAnimationByName(0,"idle",true)
					badTopo.side.setAnimationByName(0,"idle",true)
				}

				
			}
			checkHoles()
			
		})
	}
	
	function hitHammer(hammer){
		
		hammer.alpha = 1
		game.add.tween(hammer).from({angle:-45},200,"Linear",true).onComplete.add(function(){

			if(checkOverlap(yogotarGroup.yogoPos,hammer) && Math.abs(yogotarGroup.y - hammer.world.y) < 50){
				missPoint()
			}
            if(checkOverlap(badTopo.yogoPos,hammer)){
				
                game.time.events.add(250, function(){
                    badTopo.x = -200
                    badTopo.ready = false
                })
			}

			sound.play("punch")
			game.add.tween(hammer).to({angle:0,alpha:0},500,"Linear",true)

			addObject('hit')
		})

		sound.play("cut")
	}
	
	function minusNumber(){
		
		for(var i = 0; i < holesGroup.length;i++){
			
			var hole = holesGroup.children[i].hit
			if(hole.alpha == 1){
				
				popObject(hole,0)
				hole.number--
				hole.text.setText(hole.number)
				
				if(hole.number == 0){
					var hammer = holesGroup.children[i].hammer
					
					hitHammer(hammer)
					
					game.add.tween(hole).to({alpha : 0},500,"Linear",true)
				}
			}
		}
	}
	
	function checkHoles(){
		
		for(var i = 0; i < holesGroup.length;i++){
			
			var hole = holesGroup.children[i]
			
			if(checkOverlap(yogotarGroup.yogoPos,hole.carrot) && hole.carrot.active){
				yogotarGroup.anim.setAnimationByName(0,"eat_front",true)
                yogotarGroup.anim.addAnimationByName(0,"idle",true)
                yogotarGroup.side.setAnimationByName(0,"eat",true)
                yogotarGroup.side.addAnimationByName(0,"idle",true)
				addCoin(yogotarGroup)
				
				addObject('carrot')
				
				hole.carrot.alpha = 0
				hole.carrot.active = false
			}
		}
		
		if(checkOverlap(yogotarGroup,badTopo)){
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
		
        if(!gameActive){
			return
		}
        
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
	
	function createObjects(){
		
		yogotarGroup = game.add.group()
		yogotarGroup.x = game.world.centerX
		yogotarGroup.y = game.world.centerY - 190
		yogotarGroup.fall = false
		yogotarGroup.invincible = false
		sceneGroup.add(yogotarGroup)
		
		var yogotar = game.add.spine(0,40, "topo");
		yogotar.scale.setTo(0.8,0.8)
		yogotar.setSkinByName("normal1")
		yogotar.setAnimationByName(0,"idle",true)
		yogotarGroup.add(yogotar)
        
        var side = game.add.spine(0,40, "topo_side");
		side.scale.setTo(0.8,0.8)
		side.setSkinByName("normal1")
		side.setAnimationByName(0,"idle",true)
        side.alpha = 0
		yogotarGroup.add(side)
		
		yogotarGroup.anim = yogotar
        yogotarGroup.side = side
		
		var yogoPos = yogotarGroup.create(33,-5,'atlas.hack','yogotar')
		yogoPos.alpha = 0
		yogoPos.scale.setTo(0.7,0.7)
		yogoPos.anchor.setTo(0.5,0.5)
		yogotarGroup.yogoPos = yogoPos
		
		var yogotar = game.add.spine(0,40, "topo");
		yogotar.scale.setTo(0.8,0.8)
		yogotar.setSkinByName("normal2")
		yogotar.setAnimationByName(0,"idle",true)
		badTopo.add(yogotar)
        
        var side = game.add.spine(0,40, "topo_side");
		side.scale.setTo(0.8,0.8)
		side.setSkinByName("normal2")
		side.setAnimationByName(0,"idle",true)
        side.alpha = 0
		badTopo.add(side)
		
		badTopo.anim = yogotar
		badTopo.side = side
		
		var yogoPos = badTopo.create(33,-5,'atlas.hack','yogotar')
		yogoPos.alpha = 0
		yogoPos.scale.setTo(0.7,0.7)
		yogoPos.anchor.setTo(0.5,0.5)
        badTopo.yogoPos = yogoPos
	}
	
	function createHoles(){

		badTopo = game.add.group()
		badTopo.x = -200
		badTopo.y = game.world.centerY - 190
		badTopo.ready = false
		sceneGroup.add(badTopo)
		badTopo.indexPos = sceneGroup.getChildIndex(badTopo)
		
		holesGroup = game.add.group()
		sceneGroup.add(holesGroup)
		
		var pivotX = game.world.centerX - 200
		var pivotY = game.world.centerY - 300
		for(var i = 0; i < 9;i++){
			
			var hole = game.add.group()
			hole.x = pivotX
			hole.y = pivotY
			holesGroup.add(hole)
			
			var holeImg = hole.create(0,0,'atlas.hack','hole')
			holeImg.anchor.setTo(0.5,0.5)
			
			var carrot = hole.create(0,10,'atlas.hack','carrot')
			carrot.anchor.setTo(0.5,1)
			carrot.alpha = 0
			carrot.active = false
			hole.carrot = carrot
			
			var hitGroup = game.add.group()
			hitGroup.alpha = 0
			hitGroup.x = 0
			hitGroup.y = -75
			hole.add(hitGroup)
			hole.hit = hitGroup
			
			var hit = hitGroup.create(0,0,'atlas.hack','hitTime')
			hit.anchor.setTo(0.5,0.5)
			
			var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, -5, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
			hitGroup.add(pointsText)
			hitGroup.text = pointsText
			
			var holeBack = hole.create(0,20,'atlas.hack','holeBack')
			holeBack.anchor.setTo(0.5,0.5)
			
			var hammer = hole.create(-85,-70,'atlas.hack','hammer')
			hammer.anchor.setTo(0,0.5)
			hammer.alpha = 0
			hole.hammer = hammer
			
			pivotX+= 200
			
			if((i+1) % 3 == 0){
				pivotX = game.world.centerX - 200
				pivotY += 150
			}
			
		}
		
	}
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.hack',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
    }
    
    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)
        sound.play("combo")

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
	
	return {
		
		assets: assets,
		name: "hack",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
			//parent._QUANTRIX.Mixpanel.startMinigame()

			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			addMusic()
			createBackground()
			
            initialize()
			
			createHoles()
			createObjects()
            createInterface()
			createButtons()
			            
			createPointsBar()
			createHearts()
            createCoin()
			createParticles()
			
			buttons.getButton(medievalSong,sceneGroup)
			
            createOverlay()
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
            animateScene()
            
		},
	}
}()