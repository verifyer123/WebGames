var soundsPath = "../../shared/minigames/sounds/"
var geoJourney = function(){
    
	var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"inner":"Inner Core",
			"outer":"Outer Core",
			"convection":"Convection Currents",
			"lower":"Lower Mantle",
			"upper":"Upper Mantle",
			"crust":"The Crust",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"inner":"Núcleo Central",
			"outer":"Núcleo Externo",
			"convection":"Corriente de Convección",
			"lower":"Manto Inferior",
			"upper":"Manto Superior",
			"crust":"La Corteza",
		}
	}
	
	assets = {
        atlases: [
            {   
                name: "atlas.geo",
                json: "images/geoJourney/atlas.json",
                image: "images/geoJourney/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/geoJourney/background.png"},
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
		],
	}
    
    var COLORS = [0x22bbff,0x13ff84,0xffcf1f,0xe84612]
	var levels = ['inner','outer','convection','lower','upper','crust']
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 1050
    var DEBUG_PHYSICS = false
    var ANGLE_VALUE = 3
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    
    var gameIndex = 11
    
    var gameCollisionGroup, playerCollisionGroup
    var cursors
	var levelContainer
	var levelIndex
	var backgroundGroup
    var moveLeft, moveRight, moveUp
    var jungleSong = null
    var platNames,itemNames
    var objectsGroup
    var piecesGroup
    var lastOne = null
    var pivotObjects
    var player
    var skinTable
	var pivotBackground
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = null
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var heartsGroup = null 
	var backHeight

	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
	function initialize(){
        
        platNames = ['normal_plat']
        itemNames = ['coin','spring','coin','coin','coin']
        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        moveUp = false
        objectsGroup = null
		levelIndex = 0
		pivotBackground = game.world.height
        lives = 1
        pivotObjects = game.world.height - 125
        tooMuch = false
        lastOne = null
        moveLeft = false
        moveRight = false
        skinTable = []
        
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)      
    } 
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        
        game.load.spine('mascot', "images/spines/dinamita.json");
        game.stage.disableVisibilityChange = false;  
		buttons.getImages(game)
        
        game.load.spritesheet('coinS', 'images/geoJourney/sprites/coinS.png', 68, 70, 12);
        game.load.spritesheet('monster', 'images/geoJourney/sprites/monster.png', 292, 237, 17);
        
        game.load.audio('runningSong', soundsPath + 'songs/jungle_fun.mp3');
		
		game.load.image('howTo',"images/geoJourney/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/geoJourney/tutorial/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/geoJourney/tutorial/introscreen.png")
        
    }
    
    function inputButton(obj){
                
        if(gameActive == true){
            if(obj.tag == 'left'){
                moveLeft = true
                moveRight = false
                characterGroup.scale.x = -1
            }else{
                moveLeft = false
                moveRight = true
                characterGroup.scale.x = 1
            }
        }
        
    }
    
    function releaseButton(obj){
        
        if(gameActive == true){
            if(obj.tag =='left'){
                moveLeft = false
            }else{
                moveRight = false
            }
        }
        
    }
    
    function createControls(){
        
        var groupButton = game.add.group()
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var rButton = new Phaser.Graphics(game)
        rButton.beginFill(0x000000)
        rButton.drawRect(game.world.width,0,game.world.width * 0.5, game.world.height)
		rButton.x-= rButton.width
        rButton.alpha = 0
        rButton.endFill()
        rButton.inputEnabled = true
        rButton.tag = 'right'
        rButton.events.onInputDown.add(inputButton)
        rButton.events.onInputUp.add(releaseButton)
		groupButton.add(rButton)
        
        var groupButton = game.add.group()
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var lButton = new Phaser.Graphics(game)
        lButton.beginFill(0x000000)
        lButton.drawRect(0,0,game.world.width * 0.5, game.world.height)
        lButton.alpha = 0
        lButton.endFill()
        lButton.inputEnabled = true
        lButton.tag = 'left'
        lButton.events.onInputDown.add(inputButton)
        lButton.events.onInputUp.add(releaseButton)
		groupButton.add(lButton)
        
    }
    
    function stopWorld(){

        buddy.setAnimationByName(0,"LOSE",false)
        var tweenLose = game.add.tween(buddy).to({y:buddy.y - 150}, 1000, Phaser.Easing.Cubic.Out, true)
        tweenLose.onComplete.add(function(){
            game.add.tween(buddy).to({y:buddy.y + game.world.height + game.world.height * 0.2}, 500, Phaser.Easing.Cubic.In, true)
            game.add.tween(objectsGroup).to({y:objectsGroup.y - game.world.height * 0.4},500,Phaser.Easing.linear,true)
        })
    
    }
    
    function stopGame(win){
        
        jungleSong.stop()
        
        missPoint()
        sound.play("gameLose")
        stopWorld()
        //game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        worldGroup.alpha = 0
        game.add.tween(worldGroup).to({alpha:1},250,Phaser.Easing.linear,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            
            //amazing.saveScore(pointsBar.number) 
            
			sceneloader.show("result")
		})
    }
    
    function addPoint(obj,part){
        
        var partName = part || 'ring'
        sound.play("magic")
                
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        //console.log(obj.tag + ' tag')
        addNumberPart(pointsBar.text,'+1')
        
        if(pointsBar.number == 15){
            
            platNames[platNames.length] = 'broke_plat'
            platNames[platNames.length] = 'normal_plat'
            
            itemNames[itemNames.length] = 'balloons'
        }
        
        if(pointsBar.number == 25){
            
            platNames[platNames.length] = 'move_plat'
        }
        
        if(pointsBar.number == 35){
            
            itemNames[platNames.length] = 'monster'
            itemNames[platNames.length] = 'monster'
        }
        
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
        
        var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
        tweenScale.onComplete.add(function(){
            game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
        })
    }
    
    function missPoint(){
        
        if (lives >0){
            lives--;
        }
        
        sound.play('wrong')
        createPart('wrong',player)
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function positionPlayer(){
        
        if(player.body.x > game.world.height * 0.95){
            player.body.x = 5
        }else if(player.body.x < 10){
            player.body.x = game.world.height * 0.9
        }
        
        if(player.body.y > player.lastpos + 5){
            player.falling = true    
        }else{
            player.falling = false
        }
        
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        if(player.body.y > game.world.height - player.height * 0.25 && player.falling){
            
            stopGame()
        }
        
        player.lastpos = player.body.y

    }
    
    function deactivateObj(obj){
        
        obj.active = false
        obj.alpha = 0
        
        objectsGroup.remove(obj)
        piecesGroup.add(obj)
        
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function fadePlat(object){
        
        object.tween = game.add.tween(object).to({alpha:0},300,Phaser.Easing.liner,true).onComplete.add(function(){
            deactivateObj(object)
            addObjects()
        },this)
    }
    
    function setBalloons(){
        
        game.physics.p2.gravity.y = 0
        player.body.velocity.y = 0
        
        sound.play("magic")
        sound.play("balloon")
        
        player.active = false
        moveUp = true
        buddy.setAnimationByName(0, "JUMP_HELICOPTER", true)
        
        game.time.events.add(3000,function(){
                        
            player.active = true
            moveUp = false
            
			buddy.setAnimationByName(0,"JUMP",false)
            game.physics.p2.gravity.y = WORLD_GRAVITY

        },this)
    }
    
	function changeLevel(){
		
		sound.play("combo")
		levelContainer.text.setText(localization.getString(localizationData,levels[levelIndex + 1]))
		levelIndex++

		game.add.tween(levelContainer.scale).to({x:1.2,y:1.2},250,"Linear",true).onComplete.add(function(){
			game.add.tween(levelContainer.scale).to({x:1,y:1},250,"Linear",true)
		})
	}
	
    function checkObjects(){
        
		for(var i = 0; i < backgroundGroup.length;i++){
			
			var back = backgroundGroup.children[i]
			
			if(!back.isSep){
				back.tilePosition.x--
			}
			
			if(back.world.y > game.world.height + back.height && back.isSky){
				
				back.y = pivotBackground
				pivotBackground-= back.height
				//console.log('added back')
			}
			
			if(levelIndex < 6){
				
				if(checkOverlap(player,back) && levelIndex == back.index && back.isSep){
					
					console.log(back.index + ' index')
					if(levelIndex > 4){
						
						if(levelContainer.alpha == 1){
							game.add.tween(levelContainer).to({alpha:0},500,"Linear",true)
						}
					}else{
						
						changeLevel()
					}
					
				}
			}
		}
		
        for(var i = 0; i<objectsGroup.length;i++){
            
            var object = objectsGroup.children[i]
            
            if(object.active){
                
                var tag = object.tag
                
                if(checkOverlap(player,object)){
                    
                    var checkTop = player.world.y < object.world.y - object.height * 0.5 && player.falling && player.active
                    
                    if(tag.substring(1,tag.length) == 'normal_plat' || tag.substring(1,tag.length) == 'move_plat'){
                        
                        if(checkTop){
                    
                            doJump()
                        }
                    }else if(tag.substring(1,tag.length) == 'broke_plat' && object.alpha == 1){
                        if(checkTop){
                            
                            doJump(100)
                            
                            sound.play("break")
                            fadePlat(object)
                            
                        }
                        
                    }else if(tag == 'coin'){
                        
                        addPoint(object,'star')
                        deactivateObj(object)
                        
                    }else if(tag == 'spring' && checkTop){
                        
                        doJump(JUMP_FORCE * 2)
                        sound.play('powerup')
                        
                        var offset = 1
                        if(characterGroup.scale.x < 0){ offset = -1}
                        game.add.tween(characterGroup).to({angle:characterGroup.angle + (360 * offset)},500,Phaser.Easing.linear,true)
                    }else if(tag == 'balloons' && player.active){
                        
                        setBalloons()
                        deactivateObj(object)
                        createPart('star',object)
                    }else if(tag == 'monster' && player.active){
                        
                        if(Math.abs(player.body.x - object.world.x) < 50 && Math.abs(player.body.y - object.world.y) < 50)
                        stopGame()
                    }
                    
                }
                
                if(object.world.y > game.world.height + 50){
                    deactivateObj(object)
                    
                    if(tag.substring(tag.length - 4,tag.length) == 'plat'){
                        addObjects()
                    }
                    
                }
                
                if(object.tag.substring(1,object.tag.length) == 'move_plat'){
                    
                    if(object.moveRight){
                        
                        object.x+=2
                        if(object.world.x > game.world.width - 100){
                            
                            object.moveRight = false
                        }
                    }else{
                        
                        object.x-=2
                        if(object.world.x < 100){
                            object.moveRight = true
                        }
                    }
                }
            }
            
        }
        		
		var posY = game.world.centerY
        if(player.body.y <= posY){

            var value = (posY) - player.body.y
            
            value*=0.8
            
            objectsGroup.y+=value
            player.body.y+=value
        }
        
    }
    
    function doJump(value){
        
        if(!gameActive){
            return
        }
        
        var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
        
        buddy.setAnimationByName(0, "JUMP", false);
        //buddy.addAnimationByName(0, "LAND", false);

        if(game.physics.p2.gravity.y == 0){
            game.physics.p2.gravity.y = WORLD_GRAVITY
            //jungleSong.loopFull(0.5)
        }
        
        /*var bar = sceneGroup.limit
        if(player.body.y <= bar.body.y + bar.height){
            //console.log('move')
            game.add.tween(objectsGroup).to({y:objectsGroup.y + 150},200,Phaser.Easing.linear,true)
        }*/
        
        player.body.moveUp(jumpValue)        
    
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        positionPlayer()        
        
        if(cursors.left.isDown && !moveLeft){
            player.body.x-= 10
            
            if(characterGroup.scale.x != -1){
                
                characterGroup.scale.x = -1
            }
            
        }
        
        if(cursors.right.isDown && !moveRight){
            player.body.x+= 10
            if(characterGroup.scale.x != 1){
                
                characterGroup.scale.x = 1
            }
        }
        
        if(moveLeft){
            
            player.body.x-= 10
        }else if(moveRight){
            
            player.body.x+= 10
        }
        
        if(moveUp){
            player.body.y-=15
        }
        
        checkObjects()
    }

    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.geo','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.85
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(1,0)
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.x = game.world.width - 20
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartsImg = group.create(0,0,'atlas.geo','life_box')
        heartsImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = -heartsImg.width * 0.38
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)

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
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            obj.used = false
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
                particle = particlesGroup.create(-200,0,'atlas.geo',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
    function activateObject(child,posX,posY){
        
         if(child.tag == 'move_plat' && child.tween){
             child.tween.stop()
         }
        
         piecesGroup.remove(child)
         objectsGroup.add(child)

         var tag = child.tag
         child.active = true
         child.alpha = 1
         child.y = posY
         child.x = posX

         if(tag == 'move_plat'){
             child.moveRight = true

             if(Math.random()*2>1){
                 child.moveRight = false
             }
         }
         
    }
    
    function addItem(obj){
                
        Phaser.ArrayUtils.shuffle(itemNames)
        
        var tag = itemNames[0]
        
        //console.log(tag + ' tag')
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var item = piecesGroup.children[i]
            
            if(!item.active && item.tag == tag){
                
                var posX = obj.x
                
                if(item.tag == 'monster'){
                    posX = obj.x
                    while(Math.abs(obj.x - posX) < 100){
                        posX = game.rnd.integerInRange(100,game.world.width - 100)
                    }
                    
                }
                
                activateObject(item,posX,obj.y - obj.height * 0.5 - item.height * 0.6)
                break
            }
        
        }
    }
    
    function addObstacle(tag){
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var object = piecesGroup.children[i]
            if(!object.active && object.tag == tag){
                
                var posX = game.rnd.integerInRange(100,game.world.width - 100)
				if(objectsGroup.length == 1){
					posX = game.world.centerX
				}
                activateObject(object,posX,pivotObjects)
                
                if(Math.random()*3 >1.5 && object.tag.substring(1,object.tag.length) == 'normal_plat' && lastOne){
                    addItem(object)
                }
                
                //console.log('added ' + tag)
                
                lastOne = object
                
                pivotObjects-= 120
                
                break
            }
        }
    }
    
    function createObstacle(type, number){
        
        for(var o = 0; o<number;o++){
            
            if(type == 'coin'){
                
                obj = game.add.sprite(0, 0, 'coinS');
				obj.scale.setTo(0.8,0.8)
                piecesGroup.add(obj)
                obj.animations.add('walk');
                obj.animations.play('walk',24,true); 
                
            }else if(type == 'monster'){
                
                obj = game.add.sprite(0, 0, 'monster');
                obj.scale.setTo(0.5,0.5)
                piecesGroup.add(obj)
                obj.animations.add('walk');
                obj.animations.play('walk',24,true); 
            
            }else{
                
                var obj = piecesGroup.create(0,0,'atlas.geo',type)
            }
            
            if(type == 'move_plat'){
                
                obj.moveRight = true
            }
            
            obj.anchor.setTo(0.5,0.5)
            obj.tag = type
            obj.alpha = 0
            obj.active = false
        }
        
    }
    
    function createObjects(){
        
		for(var i = 0; i < 3;i++){
			createObstacle(i +'normal_plat',18)
			createObstacle(i + 'broke_plat',18)
			createObstacle(i + 'move_plat',10)
		}
   		
        createObstacle('coin',20)
        createObstacle('spring',10)
        createObstacle('balloons',5)
        createObstacle('monster',5)
        
        createParticles('star',5)
        createParticles('wrong',5)
        createParticles('text',8)
        
        for(var i = 0;i<12;i++){
            addObjects()
        }
        
        objectsGroup.children[0].x = player.body.x
        
    }
    
    function checkTag(){
        
        Phaser.ArrayUtils.shuffle(platNames)
        
        tag = platNames[0]
        
        if(lastOne && lastOne.tag.substring(1,lastOne.tag.length) == 'broke_plat'){
            tag = 'normal_plat'
        }
        
        return tag
    }
    
    function addObjects(){
        
		var indexAdd = 1
		
		if(pivotObjects < -backHeight * 1.755){
			indexAdd = 2
		}
		
		if(pivotObjects < -backHeight * 3.8	){
			indexAdd = 0
		}
		
        var tag = indexAdd + checkTag()		
        addObstacle(tag)
                
    }
    
    function getSkins(){
                
    	skinTable = [1,1,1,1]        
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
				gameActive = true
        		doJump()
				
				//game.time.events.add(4000,changeLevel)
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.geo','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.geo',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.geo','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
	
	function createBackgrounds(){
		
		pivotBackground = game.world.height * 2
		
		var indexSep = 0
		for(var i = -1; i < 8;i++){
			
			var imgName = 'back' + (i+1)
			var sep
			var isSky = false
			
			if(i>-1 && i < 6){
				
				var numberImage = i
				
				if(numberImage<1){numberImage = 1}
				sep = game.add.tileSprite(0,pivotBackground + 50,game.world.width, 113, 'atlas.geo','sep'+ numberImage)
				sep.anchor.setTo(0.5,1)
				sep.index = indexSep
				sep.isSep = true
				indexSep++
				
				
				if(i == 0){
					sep.y = -500
					sep.alpha = 0
				}
			}
			
			if(i>5){
				imgName = 'back6'
				isSky = true
			}
			
			if(i==-1){
				imgName = 'back1'
			}
			
			if( i == 0){
				pivotBackground = game.world.height
			}
			
			var back = game.add.tileSprite(0,pivotBackground,game.world.width, 0, 'atlas.geo',imgName);
			back.height*=16
			back.isSky = isSky
			back.anchor.setTo(0.5,1)
			backgroundGroup.add(back)
			
			backHeight = back.height
			
			pivotBackground-= back.height
			
			if(sep){
				backgroundGroup.add(sep)
			}			
		}
	}
	
	return {
        
		assets: assets,
		name: "geoJourney",
		create: function(event){
            
            cursors = game.input.keyboard.createCursorKeys()
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            game.physics.p2.setBoundsToWorld(true, true, true, true, true)
            
            playerCollisionGroup = game.physics.p2.createCollisionGroup()
            gameCollisionGroup = game.physics.p2.createCollisionGroup()
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);        
            
            worldGroup = game.add.group()
            //worldGroup.scale.setTo(0.5,0.5)
            //worldGroup.x = 100
            sceneGroup.add(worldGroup)
            
            loadSounds()
			initialize()       
            
            //sound.play("jungleSong")
            jungleSong = game.add.audio('runningSong')
            game.sound.setDecodedCallback(jungleSong, function(){
                jungleSong.loopFull(0.6)
            }, this);
            
            piecesGroup = game.add.group()
            worldGroup.add(piecesGroup)
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
			
			backgroundGroup = game.add.group()
			objectsGroup.add(backgroundGroup)    
			
			createBackgrounds()
            
            particlesGroup = game.add.group()
            worldGroup.add(particlesGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX
            characterGroup.y = game.world.height
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "mascot");
            //buddy.scale.setTo(0.55,0.55)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "IDLE", true);
            buddy.setSkinByName('normal');
            
            getSkins()
            
            var newSkin = buddy.createCombinedSkin(
                'combined',     
                'glasses' + skinTable[0],        
                'hair' +  skinTable[1],
                'skin' + skinTable[2],
                'torso' + skinTable[3]
            );
            
            buddy.setSkinByName('combined')
            
            //createTrail()
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.geo','dinamita')
            player.active = true
			player.scale.setTo(0.6,0.6)
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            player.body.setCollisionGroup(playerCollisionGroup)
            
            player.body.collides([gameCollisionGroup])
            
            player.body.collideWorldBounds = false;
            
            //createBase()
                        
            createObjects()
            
            createPointsBar()
            createHearts()
            createControls()   
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
			levelContainer = game.add.group()
			levelContainer.x = game.world.centerX
			levelContainer.y = game.world.height - 50
			sceneGroup.add(levelContainer)
			
			var container = levelContainer.create(0,0,'atlas.geo','container')
			container.anchor.setTo(0.5,0.5)
			
			var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData,levels[levelIndex]), fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			levelContainer.add(pointsText)
			
			levelContainer.text = pointsText
			
			buttons.getButton(jungleSong,sceneGroup)
            createOverlay()
            
            game.physics.p2.setImpactEvents(true);
            
            animateScene()
            
            
		},
        preload:preload,
        update:update,
	}

}()