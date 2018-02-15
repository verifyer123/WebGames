
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var flag = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"mexico":"Mexico",
			"spain":"Spain",
			"brazil":"Brazil",
			"argentina":"Argentina",
			"angola":"Angola",
			"france":"France",
			"canada":"Canada",
			"japan":"Japan",
			"china":"China",
			"usa":"USA"			
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"mexico":"México",
			"spain":"España",
			"brazil":"Brasil",
			"argentina":"Argentina",
			"angola":"Angola",
			"france":"Francia",
			"canada":"Canadá",
			"japan":"Japón",
			"china":"China",
			"usa":"EU"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.flag",
                json: "images/flag/atlas.json",
                image: "images/flag/atlas.png",
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
			{	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "spaceShip",
				file: soundsPath + "whoosh.mp3"},
			{	name: "fly",
				file: soundsPath + "inflateballoon.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
	var laneSpeed
    var gameActive
	var robot
	var particlesGroup, particlesUsed
    var gameIndex = 8
	var cursors
	var tagsToUse
	var correctIndex
	var offsetObjs
	var lanesGroup
	var indexGame
    var overlayGroup
	var boxesGroup
	var pivotObjects
    var spaceSong
	var objectsGroup,usedObjects
	
	var flagList = ['angola','argentina','france','canada','china','mexico','usa','spain','japan','brazil']
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		laneSpeed = 2
		tagsToUse = ['enemy']
		offsetObjs = 300
		gameActive = false
        
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
    
	function restartPlayer(){
		
		gameActive = false
		robot.alpha = 0
		
		game.time.events.add(1000,function(){
			
			for(var i = 0; i < boxesGroup.length;i++){
			
				var box = boxesGroup.children[i]
				box.anim.setAnimationByName(0,"IDLE",true)
			}
			
			robot.x = robot.initX
			robot.y = robot.initY
			robot.alpha = 1
			robot.index = 0
			robot.anim.setAnimationByName(0,"IDLEBOX",true)
			
			sound.play("cut")
			game.add.tween(robot).from({y: -50},500,"Linear",true).onComplete.add(function(){
				gameActive = true
			})
		})
	}
	
    function missPoint(){
        
		gameActive = false
		if(game.device.desktop){
			robot.ready = false
		}
		
		
		setExplosion(robot)
        sound.play("wrong")
		createPart('wrong',robot)
		sound.play("explosion")
		
		game.add.tween(robot).to({angle:robot.angle+720},500,"Linear",true)
		robot.anim.setAnimationByName(0,"LOSEBOX",false)
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }else{
			
			restartPlayer()
		}
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
		createPart('star',robot)
		
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.flag','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.flag','life_box')

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
        
        game.stage.disableVisibilityChange = false;  

        
        game.load.spine('robot', "images/spines/robot.json")  
		game.load.spine('helicopter', "images/spines/helicopter.json") 
        game.load.audio('spaceSong', soundsPath + 'songs/musicVideogame9.mp3');
        
		/*game.load.image('howTo',"images/flag/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/flag/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/flag/introscreen.png")*/
		game.load.spritesheet('light', 'images/flag/light.png', 128, 128, 8);
		
		game.load.image('tutorial_image',"images/flag/tutorial_image.png")
		//loadType(gameIndex)

        
    }
    
	function addObject(name){
		
		Phaser.ArrayUtils.shuffle(tagsToUse)
		
		var tag = name || tagsToUse[0]
		
		for(var i = 0; i < objectsGroup.length;i++){
			
			var obj = objectsGroup.children[i]
			if(!obj.used && obj.tag == tag){
				
				activateObject(obj)
				break
			}
		}
	}
	
	function activateObject(obj){
		
		obj.alpha = 1
		obj.used = false
		
		objectsGroup.remove(obj)
		usedObjects.add(obj)
		
		var laneToUse = game.rnd.integerInRange(1,5)
		
		obj.lane = lanesGroup.children[laneToUse]
		
		if(obj.lane.left == 0){
			obj.x = -50
			obj.scale.x = Math.abs(obj.scale.x) * -1
		}else{
			obj.x = game.world.width + 50
			obj.scale.x = Math.abs(obj.scale.x)
		}
		
		obj.y = obj.lane.y + obj.lane.height * 0.37
		var posX = obj.x
		var posY = obj.y
		
		while(checkPosObj(posX,posY)){
			if(obj.lane.left == 0){
				posX-=offsetObjs
			}else{
				posX+=offsetObjs
			}
		}
		
		obj.x = posX
				
		obj.used = true
	}
	
	 function checkPosObj(posX, posY){
        
        var samePos = false
        for(var i = 0;i<usedObjects.length;i++){
            var obj = usedObjects.children[i]
            if(Math.abs(obj.x - posX) < 75 && Math.abs(obj.y - posY) < 25 && obj.used){
                samePos = true
            }
        }
        return samePos
        
    }
	
	function setScene(){
						
		for(var i = 0; i < 8; i++){
			addObject()
		}
		
		setCountrys()
		
		for(var i = 0; i < boxesGroup.length;i++){
			
			var box = boxesGroup.children[i]
			
			box.alpha = 1
			game.add.tween(box).from({y:game.world.height*1.1},500,"Linear",true)
			box.anim.setAnimationByName(0,"IDLE",true)
		}
		
		game.time.events.add(500,function(){
			
			sound.play("cut")
			
			robot.alpha = 1
			game.add.tween(robot).from({y:-50},500,"Linear",true).onComplete.add(function(){
				gameActive = true	
			})
			
		})
	}
	
	function setCountrys(){
		
		correctIndex = game.rnd.integerInRange(0,flagList.length - 1)
		
		var otherIndex = correctIndex
		while(otherIndex == correctIndex){
			otherIndex = game.rnd.integerInRange(0,flagList.length - 1)
		}
		
		var indexList = [correctIndex,otherIndex]
		Phaser.ArrayUtils.shuffle(indexList)
		
		for(var i = 0; i < boxesGroup.length;i++){
			
			var box = boxesGroup.children[i]
			box.text.setText(localization.getString(localizationData, flagList[indexList[i]]))
			box.index = indexList[i]
		}
		
		var skinToUse = localization.getString(localizationData,flagList[correctIndex])
		//console.log(skinToUse + ' skin')
		
		robot.index = 0
		robot.anim.setAnimationByName(0,"IDLEBOX",true)
		robot.anim.setSkinByName(flagList[correctIndex])
		robot.flagIndex = correctIndex
		
	}
	
	function deactivateObject(obj){
		
		obj.alpha = 1
		obj.lane = null
		obj.used = false
		
		usedObjects.remove(obj)
		objectsGroup.add(obj)
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
        
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
				setScene()				
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.flag','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.flag',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.flag','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		setScene()	
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		lanesGroup = game.add.group()
		sceneGroup.add(lanesGroup)
		
		var pivotY = 0
		
		for(var i = 0; i < 8;i++){
			
			var tileName
			var left = 0
			var tileHeight = 128
			
			if(i % 2 == 0){
				tileName = 'leftP'
				left = 0
			}else{
				tileName = 'rightP'
			}
			
			if(i == 0 || i > 5){
				tileName = 'safeP'
				left = -10
				tileHeight = 160
			}
			
			var tile = game.add.tileSprite(0,pivotY,game.world.width+10, tileHeight, 'atlas.flag',tileName);
			tile.left = left
			lanesGroup.add(tile)
			
			pivotY+= tile.height
		}
		
	}
	
	
	function update(){
		
		if(!gameActive){
			return
		}
		
		for(var i = 0; i < lanesGroup.length; i++){
			
			var lane = lanesGroup.children[i]
			if(lane.left == 0){
				lane.tilePosition.x+= laneSpeed
			}else if(lane.left == 1){
				lane.tilePosition.x-= laneSpeed
			}
		}
		
		var direction = this.swipe.check();
		
		if (direction!==null && gameActive) {
		// direction= { x: x, y: y, direction: direction }
			switch(direction.direction) {
				case this.swipe.DIRECTION_UP:
					moveRobot('up')
					break;
				case this.swipe.DIRECTION_DOWN:
					moveRobot('down')
					break;
				case this.swipe.DIRECTION_LEFT:
					moveRobot('left')
					break;
       			case this.swipe.DIRECTION_RIGHT:
					moveRobot('right')
					break;
			}
		}
		
		checkObjects()
	}
	
	function checkObjects(){
		
		if(robot.index > 0  && robot.index < 6){
			
			var lane = lanesGroup.children[robot.index]
			if(lane.left == 0){
				robot.x+= laneSpeed
			}else{
				robot.x-= laneSpeed
			}
		}
		
		if(robot.x < 0 || robot.x > game.world.width){
			
			missPoint()
		}
		
		for(var i = 0; i<usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			if(obj.lane.left == 0){
				obj.x+=laneSpeed
			}else{
				obj.x-=laneSpeed
			}
			
			if(checkOverlap(robot,obj) && obj.used && robot.active){
				missPoint()
				break
			}
			
			if(obj.lane && obj.lane.left == 0 && obj.world.x > game.world.width + 50){
				deactivateObject(obj)
				addObject()
			}

			if(obj.lane && obj.lane.left == 1 && obj.world.x < -50){

				deactivateObject(obj)
				addObject()
			}
			
		}
		
		for(var i = 0; i < boxesGroup.length;i++){
			
			var box = boxesGroup.children[i]
			
			if(checkOverlap(robot,box)){
				
				if(robot.flagIndex == box.index){
					
					addPoint(1)
					laneSpeed+=0.35
					box.anim.setAnimationByName(0,"WIN",true)
					
					robot.anim.setAnimationByName(0,"WIN",true)
					addObject()
					
					hideScene()
					gameActive = false
					
				}else{
					
					missPoint()
					box.anim.setAnimationByName(0,"LOSE",true)
				}
				break
			}
		}
	}
	
	function hideScene(){
		
		for(var i = 0; i < boxesGroup.length;i++){
			
			var box = boxesGroup.children[i]
			game.add.tween(box).to({y:game.world.height * 1.1},500,"Linear",true)
		}
		sound.play("fly")
		
		game.time.events.add(1000,function(){
			
			sound.play("spaceShip")
			game.add.tween(robot).to({alpha : 0, angle:robot.angle + 360},500,"Linear",true).onComplete.add(function(){
				robot.x = robot.initX
				robot.y = robot.initY
			})
			
			for(var i = 0; i < boxesGroup.length;i++){
				
				var box = boxesGroup.children[i]
				box.alpha = 0
				box.y = box.initY
			}
			
			game.time.events.add(1000,setScene)
		})
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function moveRobot(direction){
		
		if(!robot.active || !gameActive){
			return
		}
		
		if(!robot.ready){
			robot.ready = true
			return
		}
		
		var jumpY = 0
		var jumpX = 0
		robot.active = false
		
		var lane = lanesGroup.children[robot.index]
		
		switch(direction){
			case 'up':
				
				jumpY = -128
				if(robot.index == 0){
					robot.active = true
					return
				}else if(robot.index == 6 || robot.index == 1){
					jumpY = -140
				}
			
				robot.index--
				break;
				
			case 'down':
				
				jumpY = 128
				if(robot.index == 6){
					robot.active = true
					return
				}else if(robot.index == 0 || robot.index == 5){

					jumpY = 140
				}

				robot.index++
			break;
				
			case 'right':
				jumpX = 128
				if(lane.left == 1){
					jumpX = 90
				}
				robot.anim.setAnimationByName(0,"RIGHTBOX",false)
			break;
				
			case 'left':
				jumpX = -128
				if(lane.left == 0){
					jumpX = -90
				}
				robot.anim.setAnimationByName(0,"LEFTBOX",false)
			break;
			
		}
		
		//console.log(jumpX + ' x ' + jumpY + ' y ' + direction )
				
		game.add.tween(robot).to({x:robot.x + jumpX,y:robot.y + jumpY},100,"Linear",true).onComplete.add(function(){
			robot.active = true
			if(gameActive){
				robot.anim.setAnimationByName(0,"IDLEBOX",true)
			}
			
		})
		sound.play("whoosh")
		
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
            
            particle.x = obj.x + offX
            particle.y = obj.y
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
                particle = particlesGroup.create(-200,0,'atlas.flag',tag)
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
		
        var exp = sceneGroup.create(0,0,'atlas.flag','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.flag','smoke');
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
	
	function createRobot(){
		
		robot = game.add.group()
		robot.x = game.world.centerX
		robot.y = 75
		robot.initX = robot.x
		robot.initY = robot.y
		robot.index = 0
		robot.flagIndex = null
		robot.ready = true
		robot.alpha = 0
		robot.active = true
		sceneGroup.add(robot)
		
		/*var robotImg = robot.create(0,0,'atlas.flag','robot')
		robotImg.anchor.setTo(0.5,0.5)
		robotImg.scale.setTo(0.8,0.8)
		robot.img = robotImg*/
		
		var sRobot = game.add.spine(0,5,'robot')
		sRobot.scale.setTo(0.7,0.7)
		sRobot.setSkinByName('angola')
		sRobot.setAnimationByName(0,'IDLE',true)
		robot.add(sRobot)
		
		robot.anim = sRobot
		
	}
	
	function createObjects(){
				
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAsset('enemy',0.8,10)
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',1)
		createParticles('text',5)
	}
	
	function createAsset(tag, scale,number){
		
		for(var i = 0; i < number; i++){
			
			enemy = game.add.sprite(-300, 200, 'light');
			objectsGroup.add(enemy)
			enemy.animations.add('walk');
			enemy.animations.play('walk',12,true);
			enemy.scale.setTo(scale,scale)
			enemy.anchor.setTo(0.5,0.5)
			enemy.lane = null
			enemy.used = false
			enemy.tag = tag
		}
	}
	
	function createBoxes(){
		
		boxesGroup = game.add.group()
		sceneGroup.add(boxesGroup)
		
		var pivotX = game.world.centerX - 150
		for(var i = 0; i < 2; i++){
			
			var boxGroup = game.add.group()
			boxGroup.x = pivotX
			boxGroup.y = game.world.height * 0.94
			boxGroup.initY = boxGroup.y
			boxGroup.scale.setTo(0.7,0.7)
			boxGroup.country = ''
			boxGroup.alpha = 0
			boxesGroup.add(boxGroup)
			
			var boxImage = game.add.spine(0,75,'helicopter')
			boxImage.setSkinByName("helicopter")
			boxImage.setAnimationByName(0,"IDLE",true)
			boxGroup.add(boxImage)
			boxGroup.anim = boxImage
			
			var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center",wordWrap: true, wordWrapWidth: 220}
			
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 35, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			boxGroup.add(pointsText)
			
			boxGroup.text = pointsText
			
			pivotX += 300
			
		}		
		
	}
	
	return {
		
		assets: assets,
		name: "flag",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			cursors = game.input.keyboard.createCursorKeys();
			this.swipe = new Swipe(this.game);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createBoxes()
			createRobot()
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
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()