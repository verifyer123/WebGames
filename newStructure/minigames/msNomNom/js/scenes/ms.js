
var soundsPath = "../../shared/minigames/sounds/"
var ms = function(){
    
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
                name: "atlas.ms",
                json: "images/ms/atlas.json",
                image: "images/ms/atlas.png",
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
			{	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "bite",
				file: soundsPath + "bite.mp3"},
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			
		],
    }
    
	var DEBUG_PHYSICS = false
	
	var gameSpeed = 0
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 92
	var indexGame
    var overlayGroup
    var spaceSong
	var piecesToUse
	var characterGroup, enemiesGroup
	var tilesGroup
	var gameTiles
	var player
	var playerSpeed
	var dirX, dirY
	var numToUse
	var itemsGroup
	var lightItem
	var itemsNumber
	var patternsGroup
	var containerGroup, entrance
	var enemiesNumber
	var zombiesDoor
	var zombieSpeed
	var enemyActions = ['up','down','left','right']
	var playerCol, enemiesCol, tilesCol
	
	var tilePositions = [
		
		{x :  270, y : 30},
		{x :  210, y : 30},
		{x :  150, y : 30},
		{x :  90, y : 30},
		{x :  30, y : 30},
		{x :  -30, y : 30},
		{x :  -90, y : 30},
		{x :  -150, y : 30},
		{x :  -210, y : 30},
		{x :  -270, y : 30},
		{x :  150, y : 90},
		{x :  -150, y : 90},
		{x :  270, y : 150},
		{x :  30, y : 150},
		{x :  -30, y : 150},
		{x :  -270, y : 150},
		{x :  270, y : 210},
		{x :  90, y : 210},
		{x :  30, y : 210},
		{x :  -30, y : 210},
		{x :  -90, y : 210},
		{x :  -270, y : 210},
		{x :  270, y : 270},
		{x :  210, y : 270},
		{x :  -210, y : 270},
		{x :  -270, y : 270},
		{x :  270, y : 330},
		{x :  210, y : 330},
		{x :  90, y : 330},
		{x :  -90, y : 330},
		{x :  -210, y : 330},
		{x :  -270, y : 330},
		{x :  90, y : 390},
		{x :  -90, y : 390},
		{x :  210, y : 450},
		{x :  90, y : 450},
		{x :  30, y : 450},
		{x :  -30, y : 450},
		{x :  -90, y : 450},
		{x :  -210, y : 450},
		{x :  210, y : 510},
		{x :  -210, y : 510},
		{x :  210, y : 570},
		{x :  150, y : 570},
		{x :  30, y : 570},
		{x :  -30, y : 570},
		{x :  -150, y : 570},
		{x :  -210, y : 570},
		{x :  270, y : 630},
		{x :  210, y : 630},
		{x :  150, y : 630},
		{x :  30, y : 630},
		{x :  -30, y : 630},
		{x :  -150, y : 630},
		{x :  -210, y : 630},
		{x :  -270, y : 630},
		{x :  30, y : 690},
		{x :  -30, y : 690},
		{x :  270, y : 750},
		{x :  210, y : 750},
		{x :  90, y : 750},
		{x :  30, y : 750},
		{x :  -30, y : 750},
		{x :  -90, y : 750},
		{x :  -210, y : 750},
		{x :  -270, y : 750},
		{x :  270, y : 810},
		{x :  210, y : 810},
		{x :  90, y : 810},
		{x :  30, y : 810},
		{x :  -30, y : 810},
		{x :  -90, y : 810},
		{x :  -210, y : 810},
		{x :  -270, y : 810},
		{x :  270, y : 930},
		{x :  210, y : 930},
		{x :  150, y : 930},
		{x :  90, y : 930},
		{x :  30, y : 930},
		{x :  -30, y : 930},
		{x :  -90, y : 930},
		{x :  -150, y : 930},
		{x :  -210, y : 930},
		{x :  -270, y : 930}
	]
	
	var zombiePos = [
		
		{x :  30, y : 330},
		{x : -30, y : 330},
		{x :  30, y : 390},
		{x : -30, y : 390}
	]
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		piecesToUse = []
		gameSpeed = 200
		zombieSpeed = 150
        
		dirX = 0
		dirY = 0
		itemsNumber = 0
		enemiesNumber = 1
		
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0.01, y:0.01},250,Phaser.Easing.linear,true)
			
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
		
		if(pointsBar.number > 7){
			enemiesNumber = 2
		}
		
		if(pointsBar.number > 12){
			enemiesNumber = 3
		}
		
		if(pointsBar.number > 16){
			enemiesNumber = 4
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.ms','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.ms','life_box')

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
    
	function stopEnemies(){
		
		for(var i = 0; i < enemiesGroup.length;i++){
			
			var enemy = enemiesGroup.children[i]
			enemy.body.velocity.x = 0
			enemy.body.velocity.y = 0
		}
	}
	
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
		player.body.velocity.x = 0
		player.body.velocity.y = 0
		
		stopEnemies()
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
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
        
        game.load.spine('estrella', "images/spines/Estrella/estrella.json")  
		game.load.spine('light', "images/spines/Thunder/thunder.json") 
        game.load.audio('spaceSong', soundsPath + 'songs/timberman.mp3');
        
		game.load.image('howTo',"images/ms/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/ms/tutorial/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/ms/tutorial/introscreen.png")
		
		game.load.spritesheet('zombie', 'images/ms/spritesheets/zombie_idle.png', 76, 62, 6);
		
		console.log(localization.getLanguage() + ' language')
        
    }
	
	function restartTiles(){
		
		for(var i = 0; i < gameTiles.length;i++){
			
			var tile = gameTiles.children[i]
			tile.item = false
		}	
	}
	
	function getItems(){
		
		restartTiles()
		
		player.body.x = game.world.centerX - 272
		player.body.y = game.world.centerY + 25
		player.body.velocity.x = 0
		player.body.velocity.y = 0
				
		itemsNumber = game.rnd.integerInRange(2,10)
		numToUse = game.rnd.integerInRange(2,itemsNumber)
		
		console.log(itemsNumber + ' items,' + numToUse + ' number')
		
		var delay = 0
		player.items = 0
		
		game.add.tween(zombiesDoor).to({alpha:1},200,"Linear",true)
		
		for(var i = 0; i < enemiesNumber;i++){
			
			var enemy = enemiesGroup.children[i]
			enemy.body.x = game.world.centerX - zombiePos[i].x
			enemy.body.y = zombiePos[i].y
			enemy.active = true
			enemy.body.velocity.x = 0
			enemy.body.velocity.y = 0
						
			popObject(enemy,delay)
			delay+= 200

		}
		
		for(var i = 0; i < (itemsNumber + 1);i++){
			
			var item 
			
			if(i < itemsNumber){
				
				item = itemsGroup.children[i]	
			}else{
				item = lightItem
			}
			var tile
			var positioning = true
			
			var index = 0
			while(positioning){
				
				index = game.rnd.integerInRange(0,gameTiles.length - 1)
				tile = gameTiles.children[index]
				//console.log(tile.item + ' item')
				if(!tile.used && !tile.item){
					
					item.alpha = 0
					item.x = tile.x
					item.y = tile.y
					
					positioning = false
					tile.item = true
					item.active = true
					
					popObject(item,delay)
					delay+= 200
				}
								
			}

		}
		
		containerGroup.text.setText(numToUse)
		popObject(containerGroup,delay)
		
		game.time.events.add(delay,function(){
			
			popObject(characterGroup,0)
			gameActive = true
			player.active = true
			
			activateEnemies()
			
		})
		
	}
	
	function activateEnemies(){
		
		game.add.tween(zombiesDoor).to({alpha:0},100,"Linear",true,0,4).onComplete.add(function(){
			
			for(var i = 0; i < enemiesGroup.length;i++){
				
				var enemy = enemiesGroup.children[i]
				if(enemy.active){
					enemy.running = true
					enemy.direction = enemyActions[game.rnd.integerInRange(0,enemyActions.length - 1)]
				}
			}
		})
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
				
				getItems()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.ms','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.ms',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.ms','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createMap(){
				
		gameTiles = game.add.group()
		sceneGroup.add(gameTiles)
		
		tilesGroup = game.add.group()
		sceneGroup.add(tilesGroup)
		
		var building = true
		
		var pivotX = game.world.centerX - 300
		var initX = pivotX
		var pivotY = 0
		while(building){
			
			var part = gameTiles.create(pivotX,pivotY,'atlas.ms','swatch2')
			pivotX+= part.width
			part.item = false
			part.alpha = 0.5
			part.anchor.setTo(0.5,0.5)
			part.x+= part.width * 0.5
			part.y+= part.height * 0.5
			part.used = false
			
			/*part.inputEnabled = true
			part.active = false
			part.events.onInputDown.add(inputButton)*/
			
			if(pivotX > game.world.centerX + 300 - part.width){
				pivotX = initX
				pivotY+= part.height
				
				if(pivotY > game.world.height - part.height){
					building = false
				}
			}
			
			for(var u = 0; u < tilePositions.length;u++){
				
				var pos = tilePositions[u]
				if(part.x == game.world.centerX - pos.x && part.y == pos.y){
					part.used = true
				}
				
				if(u < zombiePos.length){
					var pos = zombiePos[u]
					if(part.x == game.world.centerX - pos.x && part.y == pos.y){
						part.used = true
					}
				}
			}
			
						
		}
		
		for(var i = 0; i < tilePositions.length;i++){
			
			var position = tilePositions[i]
			var part = tilesGroup.create(game.world.centerX - position.x,position.y,'atlas.ms','swatch')
			part.tag = 'wall'
			part.anchor.setTo(0.5,0.5)
						
			game.physics.p2.enable(part,DEBUG_PHYSICS)
            part.body.kinematic = true
			part.body.setCollisionGroup(tilesCol)
			part.body.collides([playerCol,enemiesCol])
			
		}
		
	}
	
	function createBackground(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x230d6d)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.endFill()
		sceneGroup.add(rect)
		
		createMap()
		
	}
	
	function moveCharacter(direction){
		
		if(!gameActive){
			return
		}
		
		characterGroup.direction = direction
		
		var spineGroup = characterGroup.spineGroup
		spineGroup.scale.x = 1
		
		switch(direction){
			case 'up':
				
				spineGroup.angle = -90
				dirY = -gameSpeed
			
			break;	
			case 'down':
			
				spineGroup.angle = 90
				dirY = gameSpeed
			break;
				
			case 'right':
				
				spineGroup.angle = 0
				dirX = gameSpeed
				
			break;
				
			case 'left':
				
				spineGroup.angle = 0
				spineGroup.scale.x = -1
				dirX = -gameSpeed
			break;
			
		}		
		
		if(direction == 'up' || direction == 'down'){
			dirX = 0
		}else if(direction == 'right' || direction == 'left'){
			dirY = 0
		}

		sound.play("whoosh")
		
	}
	
	function update(){
		
		if(!gameActive){
			return
		}
		
		var direction = this.swipe.check();
		console.log(this.swipe)
		
		if (direction!==null) {
		
			switch(direction.direction) {
				case this.swipe.DIRECTION_UP:
					moveCharacter('up')
					break;
				case this.swipe.DIRECTION_DOWN:
					moveCharacter('down')
					break;
				case this.swipe.DIRECTION_LEFT:
					moveCharacter('left')
					break;
       			case this.swipe.DIRECTION_RIGHT:
					moveCharacter('right')
					break;
			}
		}
		
		positionPlayer()
		checkObjects()
		
	}
	
	function checkObjects(){
		
		zombiesDoor.tilePosition.x++
		for(var i = 0; i < itemsGroup.length;i++){
			
			var item = itemsGroup.children[i]
			
			if(item.active){
				item.angle+= game.rnd.integerInRange(1,3)
			}
			if(checkOverlap(player,item)){
				
				item.x = -100
				createPart('star',player)
				sound.play('bite')
				createTextPart('+1',player)
				
				sound.play('magic')
				player.items++
				
				if(containerGroup.tween){
					containerGroup.tween.stop()
				}
				
				containerGroup.scale.setTo(1,1)
				
				containerGroup.tween = game.add.tween(containerGroup.scale).to({x:0.7,y:0.7},200,"Linear",true,0,0)
				containerGroup.tween.yoyo(true,0)
			}
		}
		
		for(var i = 0; i < patternsGroup.length;i++){
			
			var pattern = patternsGroup.children[i]
			if(checkOverlap(player,pattern) && player.active){
				
				player.active = false
				if(pattern.tag == 'left'){
					
					player.body.x = game.world.centerX + 275
				}else if(pattern.tag == 'right'){
					
					player.body.x = game.world.centerX - 275
				}
				game.time.events.add(500,function(){
					player.active = true
				})
			}
		}
		
		if(checkOverlap(player,entrance) && characterGroup.direction == 'up' && player.active){
			
			player.active = false
			gameActive = false
			game.add.tween(characterGroup).to({alpha:0,y:characterGroup.y - 50},500,"Linear",true)
			
			if(player.items == numToUse){
				
				addPoint(numToUse)
				createTextPart('+' + numToUse,player)
				
				createPart('star',containerGroup.text)
				
				hideItems()
				
				game.time.events.add(1000,getItems)
				
			}else{
				
				missPoint()
				createPart('wrong',containerGroup.text)
			}
			
		}
		
		for(var i = 0; i < enemiesGroup.length;i++){
			
			var enemy = enemiesGroup.children[i]
			
			if(checkOverlap(player,enemy)){
				
				if(player.invincible){
					
					sound.play("magic")
					createPart('star',player)
					enemy.running = false
					
					enemy.body.x = -100
					enemy.body.velocity.x = 0
					enemy.body.velocity.y = 0
					
				}else{
					missPoint()
					createPart('wrong',player)
					characterGroup.anim.setAnimationByName(0,"LOSE",false)
				}
				
				
			}
			
			for(var u = 0; u < tilesGroup.length;u++){
				
				var tile = tilesGroup.children[u]
				if(checkOverlap(enemy,tile)){
					
					changeDirection(enemy)
				}
			}
			
			for(var u = 0; u < patternsGroup.length;u++){
				
				var pattern = patternsGroup.children[u]
				if(checkOverlap(pattern,enemy) && enemy.running){
					if(pattern.tag == 'left'){
						enemy.body.x = game.world.centerX + 250
					}else if(pattern.tag == 'right'){
						enemy.body.x = game.world.centerX - 250
					}
				}
			}
			
			if(enemy.running){
				
				switch(enemy.direction){
					case 'up':
						
						enemy.dirY= -zombieSpeed
					break;
					case 'down':
						
						enemy.dirY= zombieSpeed
					break;
					case 'left':
						
						enemy.dirX = -zombieSpeed
					break;
					case 'right':
						
						enemy.dirX = zombieSpeed
					break;
				}
				
				if(enemy.direction == 'up' || enemy.direction == 'down'){
					enemy.dirX = 0
				}else if(enemy.direction == 'right' || enemy.direction == 'left'){
					enemy.dirY = 0
				}
				
				enemy.body.velocity.x = enemy.dirX
				enemy.body.velocity.y = enemy.dirY
				
			}
			
		}
		
		if(checkOverlap(player,lightItem.col)){
			
			lightItem.x = -100
			sound.play("powerup")
			createPart('star',player)
			setPowerUp()
			
		}
	}
	
	function setPowerUp(){
		
		characterGroup.bubble.alpha = 1
		characterGroup.anim.setAnimationByName(0,"TAKETHUNDER",true)
		player.invincible = true
		
		game.time.events.add(5000,function(){
			
			characterGroup.alpha = 0
			game.add.tween(characterGroup).to({alpha:1},200,"Linear",true,0,5).onComplete.add(function(){
				player.invincible = false
				characterGroup.anim.setAnimationByName(0,"IDLE",true)
				characterGroup.bubble.alpha = 0
			})
		})
	}
	
	function changeDirection(enemy){
		
		switch(enemy.direction){
			case 'up':

				enemy.body.y+= 4
			break;
			case 'down':

				enemy.body.y-= 4
			break;
			case 'left':

				enemy.body.x+= 4
			break;
			case 'right':

				enemy.body.x-= 4
			break;
		}

		enemy.dirX = 0
		enemy.dirY = 0					

		var direction = enemyActions[game.rnd.integerInRange(0,enemyActions.length - 1)]
		while(enemy.direction == direction){
			direction = enemyActions[game.rnd.integerInRange(0,enemyActions.length - 1)]
		}

		enemy.direction = direction
		//console.log(direction + ' direction')
		
	}
	
	function hideItems(){
		
		for(var i = 0; i < enemiesGroup.length;i++){
			
			var enemy = enemiesGroup.children[i]
			enemy.running = false
			enemy.active = false
			game.add.tween(enemy).to({alpha:0},500,"Linear",true)
			enemy.body.x = 50
			enemy.body.y = 50
			
		}
		
		for(var i = 0; i < itemsGroup.length;i++){
			
			var item = itemsGroup.children[i]
			item.x = -100
			item.y = -100
			game.add.tween(item).to({alpha:0},100,"Linear",true)
			item.active = false
		}
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

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
            particle.start(true, 1500, null, 4);
			
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

				particle.makeParticles('atlas.ms',tag);
				particle.minParticleSpeed.setTo(-250, -150);
				particle.maxParticleSpeed.setTo(250, -250);
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
		
        var exp = sceneGroup.create(0,0,'atlas.ms','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.ms','smoke');
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
		
		if(obj.active){
			obj.active = false
			obj.tint = 0xffffff
		}else{
			obj.active = true
			obj.tint = 0x000000
		}
		
		
	}
	
	function printPositions(){
		
		var stringToUse = ''
		
		for(var i = 0; i < gameTiles.length;i++){
			
			var tile = gameTiles.children[i]
			if(tile.active){
				stringToUse+= '[x = game.world.centerX - ' + (game.world.centerX - tile.x) + ', y = ' + tile.y + '],\n'
			}
		}
		
		console.log(stringToUse)
	}
	
	function createCharacter(){
		
		characterGroup = game.add.group()
		characterGroup.scale.setTo(0.8,0.8)
		characterGroup.x = 50
		characterGroup.alpha = 0
		characterGroup.y = game.world.centerY
		sceneGroup.add(characterGroup)
		
		player = sceneGroup.create(game.world.centerX - 250,game.world.centerY,'atlas.ms','estrella')
		player.anchor.setTo(0.5,0.5)
		player.scale.setTo(0.6,0.6)
		player.alpha = 0
		player.active = true
		game.physics.p2.enable(player,DEBUG_PHYSICS)
		/*player.inputEnabled = true
		player.events.onInputDown.add(printPositions)*/

		player.body.collideWorldBounds = false;
		player.body.fixedRotation = true
		player.body.setCircle(25)
		player.body.velocity.x = 0
		player.body.velocity.y = 0
		player.body.setCollisionGroup(playerCol)
		player.body.collides([tilesCol,enemiesCol])
		
		var spineGroup = game.add.group()
		characterGroup.add(spineGroup)
		
		var spine = game.add.spine(0,35,'estrella')
		spine.setSkinByName('normal')
		spine.setAnimationByName(0,"IDLE",true)
		spineGroup.add(spine)
		
		characterGroup.anim = spine
		characterGroup.spineGroup = spineGroup
		
		var bubble = characterGroup.create(0,0,'atlas.ms','bubble')
		bubble.anchor.setTo(0.5,0.5)
		bubble.alpha = 0
		characterGroup.bubble = bubble
	}
	
	function positionPlayer(){
        
		player.body.velocity.x = dirX
		player.body.velocity.y = dirY
		
        characterGroup.x = player.x
        characterGroup.y = player.y - 5
        
    }
	
	function createItems(){
		
		itemsGroup = game.add.group()
		sceneGroup.add(itemsGroup)
		
		for(var i = 0; i < 12;i++){
			
			var item = itemsGroup.create(-100,-100,'atlas.ms','manzana')
			item.anchor.setTo(0.5,0.5)
			item.scale.setTo(0.7,0.7)
			item.active = false
			
		}
		
		lightItem = game.add.group()
		lightItem.x = -100
		lightItem.y = -100
		lightItem.scale.setTo(0.7,0.7)
		sceneGroup.add(lightItem)
		
		var lightAnim = game.add.spine(0,0,'light')
		lightAnim.setSkinByName("normal")
		lightAnim.setAnimationByName(0,"IDLE",true)
		lightItem.add(lightAnim)
		
		var col = lightItem.create(0,0,'atlas.ms','manzana')
		col.anchor.setTo(0.5,0.5)
		col.alpha = 0
		lightItem.col = col
		
	}
	
	function createPatterns(){
		
		patternsGroup = game.add.group()
		sceneGroup.add(patternsGroup)
		
		var pattern = game.add.tileSprite(game.world.centerX-300,0,game.world.width,game.world.height,'atlas.ms','tile')
		pattern.anchor.setTo(1,0)
		pattern.tag = 'left'
		patternsGroup.add(pattern)
	
		var pattern = game.add.tileSprite(game.world.centerX + 300,0,game.world.width,game.world.height,'atlas.ms','tile')
		pattern.tag = 'right'
		patternsGroup.add(pattern)
		
	}
	
	function createContainer(){
		
		containerGroup = game.add.group()
		containerGroup.x = game.world.centerX
		containerGroup.y = game.world.height - 300
		containerGroup.alpha = 0
		sceneGroup.add(containerGroup)
		
		var containerImg = containerGroup.create(0,0,'atlas.ms','container')
		containerImg.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 3, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        containerGroup.add(pointsText)
		
		containerGroup.text =  pointsText
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
		
		entrance = sceneGroup.create(containerGroup.x, game.world.height - 112,'atlas.ms','entrance')
		entrance.anchor.setTo(0.5,1)
		
	}
	
	function createEnemies(){
		
		enemiesGroup = game.add.group()
		sceneGroup.add(enemiesGroup)
		
		for(var i = 0; i < 4;i++){
			
			var enemy = game.add.sprite(80, 80, 'zombie');
			enemy.alpha = 0
			enemy.index = 0
			enemy.anchor.setTo(0.5,0.5)
			enemy.scale.setTo(0.7,0.7)
			enemy.dirX = 0
			enemy.dirY = 0
			enemy.animations.add('walk');
			enemy.animations.play('walk',12,true);
			enemy.active = false
			enemy.running = false
			enemy.direction = null
			
			game.physics.p2.enable(enemy,DEBUG_PHYSICS)

			enemy.body.collideWorldBounds = true;
			enemy.body.fixedRotation = true
			enemy.body.setCircle(15)
			enemy.body.setCollisionGroup(enemiesCol)
			enemy.body.collides([tilesCol,playerCol])
			enemiesGroup.add(enemy)
			
		}
		
		zombiesDoor = game.add.tileSprite(game.world.centerX - 60,310,130,38,'atlas.ms','lightning')
		zombiesDoor.anchor.setTo(0,0.5)
		sceneGroup.add(zombiesDoor)
	}
	
	return {
		
		assets: assets,
		name: "ms",
		update: update,
        preload:preload,
		create: function(event){
            
			game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
			
			sceneGroup = game.add.group()
			this.swipe = new Swipe(this.game);
			
			playerCol = game.physics.p2.createCollisionGroup()
			tilesCol = game.physics.p2.createCollisionGroup()
			enemiesCol = game.physics.p2.createCollisionGroup()

			createBackground()
			createContainer()
			createEnemies()
			createCharacter()
			createPatterns()
			createItems()
                        			
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