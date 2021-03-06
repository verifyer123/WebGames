
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var gem = function(){
    
	var localizationData = {
		"EN":{
	        "howTo":"How to Play?",
	        "moves":"Moves left",
			"stop":"Stop!",
			"objective":"Objective",
		},

		"ES":{
	        "moves":"Movimientos extra",
	        "howTo":"¿Cómo jugar?",
	        "stop":"¡Detener!",
			"objective":"Objetivo",
		}
	}


	assets = {
	    atlases: [
	        {   
	            name: "atlas.gem",
	            json: "images/gem/atlas.json",
	            image: "images/gem/atlas.png",
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
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			
		],
	}
	    
	var lives = null
	var numLimit
	var result
	var listUsed
	var gameTime
	var sceneGroup = null
	var background
	var gameActive = true
	var pointerActive
	var shoot
	var particlesGroup, particlesUsed
	var gameIndex = 26
	var container, objectsGroup, usedObjects, glowGroup
	var answerCont
	var linesGroup
	var pointer
	var rowList
	var indexGame
	var overlayGroup
	var spaceSong
	var indexTap


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
	    game.stage.backgroundColor = "#ffffff"
	    lives = 1
		pointerActive = false
		numLimit = 3
		gameTime = 20000

	    loadSounds() 
	}

	function popObject(obj,delay){
	    game.time.events.add(delay,function(){
	        sound.play("cut")
	        obj.alpha = 1
	        game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
	    }, this)
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
		
		if(pointsBar.number % 4 == 0){
			
			if(numLimit<10){
				numLimit++
			}
			
			if(gameTime > 4000){
				gameTime-= 750
			}
		}
	}

	function createPointsBar(){
	    pointsBar = game.add.group()
	    pointsBar.x = game.world.width
	    pointsBar.y = 0
	    sceneGroup.add(pointsBar)
	    
	    var pointsImg = pointsBar.create(-10,10,'atlas.gem','xpcoins')
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

	    var heartImg = group.create(0,0,'atlas.gem','life_box')

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
		
		if(clock.tween){
			clock.tween.stop()
		}
		
	    gameActive = false
	    spaceSong.stop()
	    		
	    tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
	        
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
		
	        sceneloader.show("result")
		})
	}

	function preload(){
	    game.stage.disableVisibilityChange = false;
	    game.load.audio('spaceSong', soundsPath + 'songs/retrowave.mp3');
		game.load.image('tutorial_image',"images/gem/tutorial_image.png")
	}

	function sendObject(obj,delay,posY){
		game.time.events.add(delay,function(){
			sound.play("cut")
			game.add.tween(obj).to({y:posY},500,"Linear",true)
		})
	}

	function placeButtons(number){
		indexTap = 0
		
		result = game.rnd.integerInRange(2,numLimit + 1)
		answerCont.text.setText(result)
		
		popObject(answerCont,0)
		
		var delay = 500
		
		for(var i = 0; i < number;i++){
			var tagToUse = 'number'
			if((i+1) % 3 == 0){
				tagToUse = 'sign'	
			}
			
			var button = getObject(tagToUse)			
			var rowNumber = game.rnd.integerInRange(0,rowList.length -1)
			
			while(rowList[rowNumber].number > 4){
				rowNumber = game.rnd.integerInRange(0,rowList.length -1)
			}
			
			button.row = rowNumber
			
			activateObject(button,rowList[rowNumber].pivotX,-100)
			
			sendObject(button,delay,rowList[rowNumber].pivotY)			
			rowList[rowNumber].pivotY-= button.height * 1.4
			
			rowList[rowNumber].number++
			
			delay+= 100
		}
		
		game.time.events.add(delay + 500, function(){
			popObject(clock,0)
			clock.bar.scale.x = clock.bar.origScale
			
			clock.tween = game.add.tween(clock.bar.scale).to({x:0},gameTime,"Linear",true)
			clock.tween.onComplete.add(function(){
				missPoint()	
			})
			
			setSignResult()
			
			for(var i = 0; i < usedObjects.length;i++){
				var obj = usedObjects.children[i]
				game.add.tween(obj.text.scale).from({x:0,y:0},200,"Linear",true)	
			}
			
			gameActive = true
			listUsed = []
		})
	}


	function setSignResult(){
		var signsList = []
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			if(obj.tag == 'sign'){
				signsList[signsList.length] = obj
			}
		}
		
		var index = game.rnd.integerInRange(0,signsList.length - 1)
		var signToUse = signsList[index]
		signToUse.initX = signToUse.x
		signToUse.initY = signToUse.y
		
		var numList = [-1,0,1]
		var numsToUse = []
		
		for(var i = 0 ; i < numList.length;i++){
			
			for(var u = 0; u < numList.length;u++){
				signToUse.x+= 115 * numList[i]
				signToUse.y+= 115 * numList[u]
				
				for(var o = 0; o < usedObjects.length;o++){
					var obj = usedObjects.children[o]
					if(checkOverlap(obj,signToUse) && obj.tag == 'number'){
						numsToUse[numsToUse.length] = obj
					}
				}
				signToUse.x = signToUse.initX
				signToUse.y = signToUse.initY
			}
			
			signToUse.x = signToUse.initX
			signToUse.y = signToUse.initY
		}
		
		var sign = '+'
		if(Math.random() * 2 > 1){
			sign = '-'
		}
		
		Phaser.ArrayUtils.shuffle(numsToUse)
		
		if(numsToUse.length < 2){
			setSignResult()
			return
		}
		
		signToUse.number = sign
		signToUse.text.setText(sign)
		
		var number1 
		var number2
		
		if(sign == '+'){
			
			number1 = game.rnd.integerInRange(1,result - 1)
			number2 = result - number1
		}else{
			
			number1 = result + (game.rnd.integerInRange(1,result))
			number2 = number1 - result
		}
		
		numsToUse[0].number = number1
		numsToUse[0].text.setText(number1)
		
		numsToUse[1].number = number2
		numsToUse[1].text.setText(number2)
	}

	function activateObject(child,posX,posY){
	     objectsGroup.remove(child)
	     usedObjects.add(child)

	     child.active = true
	     child.alpha = 1
	     child.y = posY
	     child.x = posX
		 
		 if(child.tag == 'number'){
			 
			 child.number = game.rnd.integerInRange(1,numLimit)
			 child.text.setText(child.number)
				
		 }else{
			 
			 var signToUse = '+'
			 if(game.rnd.integerInRange(0,2) > 1){
				 signToUse = '-'
			 }
			 
			 child.number = signToUse
			 child.text.setText(child.number)
			 child.text.tint = 0xffffff
		 }
	}

	function deactivateObj(obj){
	    obj.active = false
	    obj.alpha = 0
		obj.y = -200
	    
	    usedObjects.remove(obj)
	    objectsGroup.add(obj)
	}

	function createOverlay(){ 
	    overlayGroup = game.add.group()
	    sceneGroup.add(overlayGroup)

	    tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
	}

	function onClickPlay(){
		overlayGroup.y = -game.world.height
		placeButtons(20)
	}

	function releaseButton(obj){
	    obj.parent.children[1].alpha = 1
	}

	function createBackground(){
		var sky = sceneGroup.create(0,0,'atlas.gem','sky')
		sky.width = game.world.width
		sky.height = game.world.height
		
		var moon = sceneGroup.create(game.world.centerX, 100,'atlas.gem','moon')
		moon.anchor.setTo(0.5,0.5)
		moon.scale.setTo(0.6,0.6)
		
		background = game.add.tileSprite(0,game.world.height + 100,game.world.width, 926,'atlas.gem','cueva')
		background.anchor.setTo(0,1)
		sceneGroup.add(background)
	}

	function checkOverlap(spriteA, spriteB) {
	    var boundsA = spriteA.getBounds();
	    var boundsB = spriteB.getBounds();

	    return Phaser.Rectangle.intersects(boundsA , boundsB );
	}

	function update(){
		background.tilePosition.x++
		
		checkObjects()
	}

	function checkObjects(){
		if(pointerActive){
			pointer.x = game.input.x
			pointer.y = game.input.y
			
			for(var i = 0; i < usedObjects.length; i++){
				var obj = usedObjects.children[i].image
				
				if(checkOverlap(pointer,obj)){
					if(Math.abs(pointer.x - obj.world.x) < 40 && Math.abs(pointer.y - obj.world.y) < 40){	
						inputButton(obj)
					}
				}
			}
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
	            particle = particlesGroup.create(-200,0,'atlas.gem',tag)
	        }
	        
	        particle.alpha = 0
	        particle.tag = tag
	        particle.used = false
	        particle.anchor.setTo(0.5,0.5)
	        particle.scale.setTo(1,1)
	    }
	}

	function addParticles(){
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',5)
		createParticles('text',5)
		createParticles('drop',5)
		createParticles('ring',5)
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
		
	    var exp = sceneGroup.create(0,0,'atlas.gem','cakeSplat')
	    exp.x = posX
	    exp.y = posY
	    exp.anchor.setTo(0.5,0.5)

	    exp.scale.setTo(6,6)
	    game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
	    var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
	    
	    particlesNumber = 8
	        
	    var particlesGood = game.add.emitter(0, 0, 100);

	    particlesGood.makeParticles('atlas.gem','smoke');
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
		if(!gameActive || !obj.parent.active || indexTap > 4){
			return
		}
		
		var parent = obj.parent
		
		var index = indexTap + 1
		if(index % 2 == 0 && parent.tag == 'number'){
			return
		}else if(index % 2 != 0 && parent.tag == 'sign'){
			return
		}
		
		listUsed[listUsed.length] = parent

		gameActive = false
		game.time.events.add(250,function(){
			gameActive = true
		})
		   
		parent.active = false
		
		var glow = glowGroup.children[indexTap]
		glow.x = parent.x
		glow.y = parent.y
		glow.alpha = 1
		
		if(listUsed.length > 1){
			
			var lastObj = listUsed[indexTap - 1]
			
			var line = linesGroup.children[indexTap]
			line.moveTo(lastObj.x,lastObj.y)
			line.lineTo(parent.x, parent.y)
			line.alpha = 1
		}
		
		sound.play("pop")
		
		var tween = game.add.tween(parent.scale).to({x:0.6,y:0.6},100,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		indexTap++
	}

	function getObject(tag){
		
		for(var i = 0; i < objectsGroup.length;i++){
			var object = objectsGroup.children[i]
			
			if(object.tag == tag && !object.active){
				return object
			}
		}
	}

	function createAssets(tag,scale,number){
		for( var i = 0; i < number;i++){
			var obj = game.add.group()
			obj.x = 0
			obj.y = 0
			obj.alpha = 0
			obj.active = false
			obj.tag = tag
			obj.scale.setTo(scale,scale)
			objectsGroup.add(obj)
			obj.number = 0

			var image = obj.create(0,0,'atlas.gem',tag + 'Gem')
			image.anchor.setTo(0.5,0.5)
			obj.image = image
			
			var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			
			if(tag == 'sign'){
				fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			}

			var pointsText = new Phaser.Text(sceneGroup.game, 0, 3, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			obj.add(pointsText)

			obj.text = pointsText
		}
	}

	function createObjects(){
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAssets('number',0.9,20)
		createAssets('sign',0.9,20)
		
		glowGroup = game.add.group()
		sceneGroup.add(glowGroup)
		
		for(var i = 0; i < 6;i++){
			var glow = glowGroup.create(0,0,'atlas.gem','glow')
			glow.anchor.setTo(0.5,0.5)
			glow.alpha = 0
		}
		
		linesGroup = game.add.group()
		sceneGroup.add(linesGroup)
		
		for(var i = 0; i < 6;i++){
			
			var g = game.add.graphics(0,0);
			g.lineStyle(10,0x0088FF,1);
			g.beginFill();
			g.moveTo(0,0);
			g.lineTo(-100,-100);
			g.endFill();
			g.alpha = 0
			linesGroup.add(g)
			
		}
		
		rowList = []
		
		var pivotX = game.world.centerX - 170
		for(var i = 0; i < 4; i++){
			
			rowList[i] = []
			rowList[i].pivotY = game.world.height - 120
			rowList[i].pivotX = pivotX
			rowList[i].number = 0
			
			pivotX+= 115
		}
		
		game.input.onDown.add(activatePointer,this)
		game.input.onUp.add(deactivatePointer,this)
		
		pointer = sceneGroup.create(0,0,'atlas.gem','star')
		pointer.scale.setTo(0.4,0.4)
		pointer.anchor.setTo(0.5,0.5)
	}

	function activatePointer(){
		pointerActive = true
	}

	function deactivatePointer(){
		pointerActive = false
		pointer.y = -100
		
		var lastNum = listUsed[listUsed.length - 1]
		var numberItems
		
		if(listUsed && listUsed.length >2 && (lastNum.number != '+' && lastNum.number != '-')){
			var partName = 'wrong'
			
			numberItems = listUsed.length
			
			var stringToUse = ''
			for(var i = 0; i < listUsed.length;i++){
				stringToUse+= listUsed[i].number
			}
			
			var buttonsResult = eval(stringToUse)
			
			console.log(buttonsResult + ' result,' + result + ' result')
			
			if(buttonsResult == result){
				partName = 'star'
				addPoint(1)
				
				if(clock.tween){
					clock.tween.stop()
					game.add.tween(clock).to({alpha:0},500,"Linear",true)
				}
				
			}else{
				missPoint()
			}
			
			for(var i = 0; i < listUsed.length;i++){
				var obj = listUsed[i]
				createPart(partName,obj.image)
				deactivateObj(obj)
			}
					
			for(var i = 0; i < rowList.length; i++){
				rowList[i].pivotY = game.world.height - 120
				rowList[i].number = 0
			}
			
			sound.play("cut")
			for(var i = 0; i < usedObjects.length;i++){
				var obj = usedObjects.children[i]
				
				game.add.tween(obj).to({y:rowList[obj.row].pivotY},250,"Linear",true)
				rowList[obj.row].pivotY-= obj.height * 1.4
				
				rowList[obj.row].number++
			}
			
			if(partName == 'star'){
				placeButtons(numberItems)
			}
			
		}
		
		for(var i = 0; i < glowGroup.length;i++){
			var glow = glowGroup.children[i]
			glow.alpha = 0
		}
		
		for(var i = 0; i < linesGroup.length; i++){
			var line = linesGroup.children[i]
			line.clear()
			line.lineStyle(10,0x0088FF,1);
			line.moveTo(0,0)
			line.lineTo(0,0)
			line.alpha = 0
		}
		
		for(var i = 0; i < usedObjects.length;i++){
			var obj = usedObjects.children[i]
			obj.active = true
		}
		
		indexTap = 0
		listUsed = []
	}

	function createContainer(){
		container = sceneGroup.create(game.world.centerX, game.world.height,'atlas.gem','container')
		container.anchor.setTo(0.5,0.5)
		container.y-= container.height * 0.53
	}

	function createAnswerCont(){
		answerCont = game.add.group()
		answerCont.x = game.world.centerX
		answerCont.y = 75
		sceneGroup.add(answerCont)
		
		var image = answerCont.create(0,0,'atlas.gem','objGem')
		image.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
	    var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
	    answerCont.add(pointsText)
		
		answerCont.text = pointsText
		answerCont.alpha = 0
		
		var rect = new Phaser.Graphics(game)
	    rect.beginFill(0x000000)
	    rect.drawRoundedRect(0,80,150, 35,12)
	    rect.alpha = 0.7
	    rect.endFill()
		rect.x-= rect.width * 0.5
		rect.y-= rect.height * 0.5
		answerCont.add(rect)
		
		var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
	    var pointsText = new Phaser.Text(sceneGroup.game, 0, 85, localization.getString(localizationData,"objective"), fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
	    answerCont.add(pointsText)
	}

	function createClock(){
	    clock = game.add.group()
	    clock.x = game.world.centerX
	    clock.y = 235
		clock.alpha = 0
	    sceneGroup.add(clock)
	    
	    var clockImage = clock.create(0,0,'atlas.gem','clock')
	    clockImage.anchor.setTo(0.5,0.5)
	    
	    var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.gem','bar')
	    clockBar.anchor.setTo(0,0.5)
	    clockBar.width = clockImage.width*0.76
	    clockBar.height = 22
	    clockBar.origScale = clockBar.scale.x
	    
	    clock.bar = clockBar
	}

	return {
		assets: assets,
		name: "gem",
		update: update,
	    preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
	        
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createAnswerCont()
			createContainer()
			createClock()
			createObjects()
	                    			
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
		}
	}
}()