var soundsPath = "../../shared/minigames/sounds/"
var zoe = function(){

    var OBJETC_TYPES = {
        REPISA:0,
        CHAIR:1,
        CLOCK:2,
        TABLE:3,
        AIRPLANE:4,
        BOCINA: 5,
        ARCADE:6,
        BURRO:7,
        CAJONERA:8,
        CUADRO1:9,
        CUADRO2:10,
        CUADRO3:11,
        ESCRITORIO:12,
        LAMPARA:13,
        LIBRERO:14,
        LIBROS:15,
        MESA:16,
        TELE:17,
        IRON:18,

    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/zoe/atlas.json",
                image: "images/zoe/atlas.png",
            },
        ],
        images: [
        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "swipe",
                file: soundsPath + "swipe.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "explode",
                file: soundsPath + "explode.mp3"},
        ],
    }
    
    var INITIAL_LIVES = 3
    var PLAYER_SPEED = {x:-10,y:45}
    var PATTERN_COUNT = 5
    var PLANE_VEL = 3
    var GIVED_COINS = 5
    var FORCE_AVAILBLE = false
    var MIN_TIME = 0
    var MAX_TIME = 1000
    var EXTRA_FORCE ={x:-5,y:20}

    var skinTable
    
    var gameIndex = 32
    var gameId = 100009
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player
    var objectsGroup
    var inTap
    var currentX
    var background 
    var tapButton
    var patternGroup1, patternGroup2
    var repisa
    var chairGroup, ariplaneGroup, clockGroup, tableGroup, bocinaGroup, arcadeGroup, burroGroup, cajoneraGroup
    var cuadro1Group, cuadro2Group, cuadro3Group, escritorioGroup, lamparaGroup, libreroGroup, librosGroup
    var mesaGroup, teleGroup, ironGroup
    var initTap
    var lastObject

    function getSkins(){
        
        var dataStore = amazing.getProfile()
        
        if(!dataStore){
            skinTable = [1,1,1,1]
        }else{
            skinTable = dataStore
        }

    }
    
    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        skinTable = []
        inTap = false
        currentX = 100
        if(FORCE_AVAILBLE){
        	PLAYER_SPEED.x = -5
        	PLAYER_SPEED.y = 25
        }
    }
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true

    }
    
    
    function preload() {
        
        game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
        game.load.physics('physicsData', 'physics/physics.json');
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/retrowave.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/retrowave.mp3');
        }


    }

    
    function stopGame(win){
        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId()){
            marioSong.pause()
        }else{
            marioSong.stop()
        }
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
        tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number,gameIndex)
        
            sceneloader.show("result")
        })
    }
    
    function addPoint(number,obj){
        
        sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.game','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.game','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
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
            
            pointsText.x = obj.x
            pointsText.y = obj.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }

    
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.game',idString);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y- 25;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
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
            
            particle.x = obj.x
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
                particle = particlesGroup.create(-200,0,'atlas.game',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
    }

    function update(){
        
        if(!gameActive){
            return
        }

        for(var i =0; i < ariplaneGroup.length;i++){
    		if(ariplaneGroup.children[i].visible){
    			var plane = ariplaneGroup.children[i]
    			if(plane.scale.x == 1){
    				plane.body.x -= PLANE_VEL
    				if(plane.body.x < plane.centerLoop-200 ){
    					plane.scale.setTo(-1,1)
    				}
    			}
    			else{
    				plane.body.x += PLANE_VEL
    				if(plane.body.x > plane.centerLoop+200 ){
    					plane.scale.setTo(1,1)
    				}
    			}
    		}
    	}

        updatePlayer()
        
    }
    
    function updatePlayer(){
        if(player.body.x>250){
        	//console.log(player.body.x)
            var delta = player.body.x -250
            player.body.x -= delta
            repisa.body.x -= delta
            
            updateGroup(chairGroup,delta)
            updateGroup(clockGroup,delta)
            updateGroup(tableGroup,delta)
            updateGroup(arcadeGroup,delta)
            updateGroup(bocinaGroup,delta)
            updateGroup(burroGroup,delta)
            updateGroup(ironGroup,delta)
            updateGroup(cuadro1Group,delta)
            updateGroup(cuadro2Group,delta)
            updateGroup(cuadro3Group,delta)
            updateGroup(cajoneraGroup,delta)
            updateGroup(escritorioGroup,delta)
            updateGroup(lamparaGroup,delta)
            updateGroup(libreroGroup,delta)
            updateGroup(mesaGroup,delta)
            updateGroup(teleGroup,delta)

            for(var i =0; i < ariplaneGroup.length;i++){
				if(ariplaneGroup.children[i].visible){
					ariplaneGroup.children[i].body.x -= delta
					ariplaneGroup.children[i].centerLoop -= delta
					if(ariplaneGroup.children[i].body.x < -100){
						ariplaneGroup.children[i].visible = false
					}
				}
			}
            if(lastObject.body.x < game.world.width){
            	currentX=lastObject.body.x+350
            	createPattern()
            }

        }
    }

    function updateGroup(group,delta){
    	//console.log(group)
    	for(var i =0; i < group.length;i++){
			if(group.children[i].visible){
				group.children[i].body.x -= delta
				if(group.children[i].body.x < -200){
					group.children[i].visible = false
					//group.children[i].body.x = -1000
                    //console.log("sdfad",group.children[i])
					//if(group.children[i].objectType == OBJETC_TYPES.CHAIR){
						//group.children[i].static = true
						group.children[i].body.data.shapes[0].sensor=true;
					//}
				}
			}
		}
    }

    function tap(){

        if(player.inGround){
        	//initTap = game.time.now
        	player.inGround = false
        	player.body.applyImpulse([PLAYER_SPEED.x,PLAYER_SPEED.y],player.contactPoint.x,player.contactPoint.y)
        	player.body.angularVelocity+= 2
        }
    }

    function tapForce(){
    	player.inGround = false

    	var offset = {x:0,y:0}
    	var deltaTime = game.time.now - inTap

    	console.log(deltaTime)

    	if(deltaTime < MAX_TIME){
    		offset.x = EXTRA_FORCE.x * (deltaTime/MAX_TIME)
    		offset.y = EXTRA_FORCE.y * (deltaTime/MAX_TIME)
    	}
    	else{
    		offset.x = EXTRA_FORCE.x
    		offset.y = EXTRA_FORCE.y
    	}

        player.body.applyImpulse([PLAYER_SPEED.x+ offset.x,PLAYER_SPEED.y+offset.y],player.contactPoint.x,player.contactPoint.y)
        player.body.angularVelocity+= 2
    }

    function collideBody(body, bodyBody, shapeA, shapeB, equation){
    	if(!gameActive){
    		return
    	}

    	if(body!=null){
    		if(body.collisionType == "gameOver"){
	    		stopGame()
	    		return
	    	}
	    	else if(body.sprite.objectType == OBJETC_TYPES.CHAIR){
	    		body.angularVelocity = 4
	    		player.body.velocity.x = 0
	    		player.body.velocity.y = 0
	    		player.body.angularVelocity = 0
	    	}
	    	else if(body.sprite.objectType == OBJETC_TYPES.CLOCK){
	    		body.angularVelocity = 5
	    	}

	    	if(body.sprite.givedCoin){
	    		addPoint(GIVED_COINS,{x:game.world.width - 100,y:30})
	    		body.sprite.givedCoin = false
	    	}

            if(equation[0]!=null){
                var localX = equation[0].contactPointB[0];
                var localY = equation[0].contactPointB[1];
                player.inGround = true
                player.contactPoint = {x:localX,y:localY}
            }
            else{
                player.inGround = true
                player.contactPoint = {x:3.4249191284179688,y:-5.950046539306641}
            }
    	}
        
    
    }

    function createBackground(){
    	background = game.add.tileSprite(0,0,game.world.width,game.world.height-320,"atlas.game","patron_fondo")
    	sceneGroup.add(background)

    	var controlsRentangle = game.add.graphics()
    	controlsRentangle.y = game.world.height - 200
    	controlsRentangle.lineStyle(2,0x0000ff,1)
    	controlsRentangle.drawRect(0,0,game.world.width,game.world.height - controlsRentangle.y)
    	sceneGroup.add(controlsRentangle)

    	controlsRentangle = game.add.graphics()
    	controlsRentangle.y = game.world.height - 180
    	controlsRentangle.x = 20
    	controlsRentangle.lineStyle(2,0x0000ff,1)
    	controlsRentangle.drawRect(0,0,game.world.width-40,game.world.height - controlsRentangle.y -20)
    	sceneGroup.add(controlsRentangle)

    	var logo = sceneGroup.create(game.world.centerX - 150, game.world.height - 100,"atlas.game","lgo")
    	logo.anchor.setTo(0.5)

    	logo = sceneGroup.create(game.world.centerX + 150, game.world.height - 100,"atlas.game","lgo")
    	logo.anchor.setTo(0.5)

    	tapButton = sceneGroup.create(game.world.centerX, game.world.height - 100,"atlas.game","boton")
    	tapButton.anchor.setTo(0.5)
    	tapButton.inputEnabled = true
    	tapButton.events.onInputDown.add(tap,this)
    	//tapButton.events.onInputUp.add(tapForce,this)

    	floorLines1 = game.add.graphics()
    	floorLines1.y = game.world.height - 320
    	floorLines1.x = -10
    	floorLines1.lineStyle(2,0x000000,1)
    	floorLines1.drawRect(0,0,game.world.width+20,35)
    	sceneGroup.add(floorLines1)

    	floorLines2 = game.add.graphics()
    	floorLines2.y = game.world.height - 310
    	floorLines2.x = -10
    	floorLines2.lineStyle(2,0x000000,1)
    	floorLines2.drawRect(0,0,game.world.width+20,15)
    	sceneGroup.add(floorLines2)

    	chairGroup = game.add.group()
    	sceneGroup.add(chairGroup)

    	ariplaneGroup = game.add.group()
    	sceneGroup.add(ariplaneGroup)

    	clockGroup = game.add.group()
    	sceneGroup.add(clockGroup)

    	tableGroup = game.add.group()
    	sceneGroup.add(tableGroup)

    	bocinaGroup = game.add.group()
    	sceneGroup.add(bocinaGroup)

    	arcadeGroup = game.add.group()
    	sceneGroup.add(arcadeGroup)

    	burroGroup = game.add.group()
    	sceneGroup.add(burroGroup)

    	ironGroup = game.add.group()
    	sceneGroup.add(ironGroup)

    	cajoneraGroup = game.add.group()
    	sceneGroup.add(cajoneraGroup)

    	cuadro1Group = game.add.group()
    	sceneGroup.add(cuadro1Group)

    	cuadro2Group = game.add.group()
    	sceneGroup.add(cuadro2Group)

    	cuadro3Group = game.add.group()
    	sceneGroup.add(cuadro3Group)

    	escritorioGroup = game.add.group()
    	sceneGroup.add(escritorioGroup)

    	libreroGroup = game.add.group()
    	sceneGroup.add(libreroGroup)

    	librosGroup = game.add.group()
    	sceneGroup.add(librosGroup)

    	mesaGroup = game.add.group()
    	sceneGroup.add(mesaGroup)

    	teleGroup = game.add.group()
    	sceneGroup.add(teleGroup)

    	lamparaGroup = game.add.group()
    	sceneGroup.add(lamparaGroup)

    }

    function createPlayer(){
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)


       	repisa = sceneGroup.create(currentX,game.world.centerY + 100,"atlas.game","base")
       	repisa.anchor.setTo(0.5)
       	game.physics.p2.enable(repisa,false)
       	repisa.body.kinematic = true

       	currentX = 420
       	createPattern()

        player = sceneGroup.create(repisa.x,repisa.y-100,"atlas.game","agua_ZOE")
        player.anchor.setTo(0.5)
        game.physics.p2.enable(player,false)
        player.inGround = false
        player.body.onBeginContact.add(collideBody,this)

        var floorLimit = sceneGroup.create(game.world.centerX,game.world.height - 250)
        game.physics.p2.enable(floorLimit,false)
        floorLimit.body.clearShapes()
        floorLimit.body.setRectangle(game.world.width*10,10,0,0)
        floorLimit.body.kinematic = true
        floorLimit.body.collisionType = "gameOver"

    }

    function getChair(x,y){
    	for(var i =0; i < chairGroup.length;i++){
    		if(!chairGroup.children[i].visible){
    			chairGroup.children[i].body.velocity.x = 0
    			chairGroup.children[i].body.velocity.y = 0
    			chairGroup.children[i].body.angularVelocity = 0
    			chairGroup.children[i].body.angle = 0
	    		chairGroup.children[i].body.x = x
	    		chairGroup.children[i].body.y = y
	    		chairGroup.children[i].visible = true
	    		chairGroup.children[i].givedCoin = true
	    		//chairGroup.children[i].static = false
	    		chairGroup.children[i].body.data.shapes[0].sensor=false;
	    		return chairGroup.children[i]
	    	}
    	}

    	var chair = chairGroup.create(x,y,"atlas.game","silla2")
    	chair.anchor.setTo(0.5)
    	game.physics.p2.enable(chair,false)
    	chair.objectType = OBJETC_TYPES.CHAIR
    	chair.givedCoin = true
    	//chair.body.clearShapes()
        //chair.body.loadPolygon('physicsData','chair2')

    	return chair
    }

    function getClock(x,y){
    	for(var i =0; i < clockGroup.length;i++){
    		if(!clockGroup.children[i].visible){
	    		clockGroup.children[i].body.x = x
	    		clockGroup.children[i].body.y = y
	    		clockGroup.children[i].givedCoin = true
	    		clockGroup.children[i].body.angularVelocity = 0
	    		clockGroup.children[i].body.angle = 0
	    		clockGroup.children[i].visible = true
	    		clockGroup.children[i].body.data.shapes[0].sensor=false;
	    		return clockGroup.children[i]
	    	}
    	}

    	var clock = clockGroup.create(x,y,"atlas.game","reloj2")
    	clock.anchor.setTo(0.5)
    	clock.givedCoin = true
    	game.physics.p2.enable(clock,false)
    	clock.body.clearShapes()
    	clock.body.setCircle(60,0,0)
    	clock.body.kinematic = true
    	clock.objectType = OBJETC_TYPES.CHAIR
    	return clock
    }

    function getTable(x,y){
    	for(var i =0; i < tableGroup.length;i++){
    		if(!tableGroup.children[i].visible){
                tableGroup.children[i].visible = true
	    		tableGroup.children[i].body.x = x
	    		tableGroup.children[i].body.y = y
	    		tableGroup.children[i].givedCoin = true
	    		tableGroup.children[i].body.data.shapes[0].sensor=false;
	    		return tableGroup.children[i]
	    	}
    	}

    	var table = tableGroup.create(x,y,"atlas.game","mesa1")
    	table.anchor.setTo(0.5)
    	table.givedCoin = true
    	game.physics.p2.enable(table,true)
    	table.body.static = true
    	//table.body.allowGravity = false
    	table.objectType = OBJETC_TYPES.TABLE
    	return table
    }

    function getAirplane(x,y){
    	for(var i =0; i < ariplaneGroup.length;i++){
    		if(!ariplaneGroup.children[i].visible){
	    		ariplaneGroup.children[i].body.x = x
	    		ariplaneGroup.children[i].body.y = y
	    		ariplaneGroup.children[i].centerLoop = x
	    		ariplaneGroup.children[i].visible = true
	    		ariplaneGroup.children[i].givedCoin = true
	    		ariplaneGroup.children[i].body.data.shapes[0].sensor=false;
	    		return ariplaneGroup.children[i]
	    	}
    	}

    	var airplane = ariplaneGroup.create(x,y,"atlas.game","avion")
    	airplane.anchor.setTo(0.5)
    	airplane.centerLoop = x 
    	airplane.givedCoin = true
    	game.physics.p2.enable(airplane,false)
    	airplane.body.static = true
    	airplane.objectType = OBJETC_TYPES.AIRPLANE
    	return airplane
    }

    function getBocina(x,y){
    	for(var i =0; i < bocinaGroup.length;i++){
    		if(!bocinaGroup.children[i].visible){
	    		bocinaGroup.children[i].body.x = x
	    		bocinaGroup.children[i].body.y = y
	    		bocinaGroup.children[i].visible = true
	    		bocinaGroup.children[i].givedCoin = true
	    		bocinaGroup.children[i].body.data.shapes[0].sensor=false;
	    		return bocinaGroup.children[i]
	    	}
    	}

    	var bocina = bocinaGroup.create(x,y,"atlas.game","bocina")
    	bocina.anchor.setTo(0.5)
    	bocina.givedCoin = true
    	game.physics.p2.enable(bocina,false)
    	bocina.body.kinematic = true
    	bocina.objectType = OBJETC_TYPES.BOCINA
    	return bocina
    }

    function getArcade(x,y){
    	for(var i =0; i < arcadeGroup.length;i++){
    		if(!arcadeGroup.children[i].visible){
	    		arcadeGroup.children[i].body.x = x
	    		arcadeGroup.children[i].body.y = y
	    		arcadeGroup.children[i].visible = true
	    		arcadeGroup.children[i].givedCoin = true
	    		arcadeGroup.children[i].body.data.shapes[0].sensor=false;
	    		return arcadeGroup.children[i]
	    	}
    	}

    	var arcade = arcadeGroup.create(x,y,"atlas.game","arcade")
    	arcade.anchor.setTo(0.5)
    	arcade.givedCoin = true
    	game.physics.p2.enable(arcade,false)
    	arcade.body.kinematic = true
    	arcade.objectType = OBJETC_TYPES.BOCINA
    	return arcade
    }

    function getBurro(x,y){
    	for(var i =0; i < burroGroup.length;i++){
    		if(!burroGroup.children[i].visible){
	    		burroGroup.children[i].body.x = x
	    		burroGroup.children[i].body.y = y
	    		burroGroup.children[i].visible = true
	    		burroGroup.children[i].givedCoin = true
	    		burroGroup.children[i].body.data.shapes[0].sensor=false;
	    		getIron(x+50,y-110)
	    		return burroGroup.children[i]
	    	}
    	}

    	var burro = burroGroup.create(x,y,"atlas.game","burro")
    	burro.anchor.setTo(0.5)
    	burro.givedCoin = true
    	game.physics.p2.enable(burro,false)
    	burro.body.kinematic = true
    	burro.objectType = OBJETC_TYPES.BURRO
    	getIron(x+50,y-110)
    	return burro
    }

    function getIron(x,y){
    	for(var i =0; i < ironGroup.length;i++){
    		if(!ironGroup.children[i].visible){
    			ironGroup.children[i].body.velocity.x = 0
    			ironGroup.children[i].body.velocity.y = 0
    			ironGroup.children[i].body.angle = 0
    			ironGroup.children[i].body.angularVelocity = 0

	    		ironGroup.children[i].body.x = x
	    		ironGroup.children[i].body.y = y
	    		ironGroup.children[i].visible = true
	    		ironGroup.children[i].givedCoin = false
	    		ironGroup.children[i].body.data.shapes[0].sensor=false;
	    		//return ironGroup.children[i]
	    	}
    	}

    	var iron = ironGroup.create(x,y,"atlas.game","plancha")
    	iron.anchor.setTo(0.5)
    	iron.centerLoop = x 
    	iron.givedCoin = false
    	game.physics.p2.enable(iron,false)
    	iron.objectType = OBJETC_TYPES.IRON
    	//return burro
    }

    function getEscritorio(x,y){
    	for(var i =0; i < escritorioGroup.length;i++){
    		if(!escritorioGroup.children[i].visible){
	    		escritorioGroup.children[i].body.x = x
	    		escritorioGroup.children[i].body.y = y
	    		escritorioGroup.children[i].visible = true
	    		escritorioGroup.children[i].givedCoin = true
	    		return escritorioGroup.children[i]
	    	}
    	}

    	var escritorio = escritorioGroup.create(x,y,"atlas.game","escritorio")
    	escritorio.anchor.setTo(0.5)
    	escritorio.givedCoin = true
    	game.physics.p2.enable(escritorio,false)
    	escritorio.body.clearShapes()
    	escritorio.body.setRectangle(340,150,10,40)
    	escritorio.body.kinematic = true
    	escritorio.objectType = OBJETC_TYPES.ESCRITORIO
    	return escritorio
    }

    function getCuadro1(x,y){
    	for(var i =0; i < cuadro1Group.length;i++){
    		if(!cuadro1Group.children[i].visible){
	    		cuadro1Group.children[i].body.x = x
	    		cuadro1Group.children[i].body.y = y
	    		cuadro1Group.children[i].visible = true
	    		cuadro1Group.children[i].givedCoin = true
	    		return cuadro1Group.children[i]
	    	}
    	}

    	var cuadro1 = cuadro1Group.create(x,y,"atlas.game","cuadro1")
    	cuadro1.anchor.setTo(0.5)
    	cuadro1.givedCoin = true
    	game.physics.p2.enable(cuadro1,false)
    	cuadro1.body.kinematic = true
    	cuadro1.objectType = OBJETC_TYPES.CUADRO1
    	return cuadro1
    }

    function getCuadro2(x,y){
    	for(var i =0; i < cuadro2Group.length;i++){
    		if(!cuadro2Group.children[i].visible){
	    		cuadro2Group.children[i].body.x = x
	    		cuadro2Group.children[i].body.y = y
	    		cuadro2Group.children[i].visible = true
	    		cuadro2Group.children[i].givedCoin = true
	    		return cuadro2Group.children[i]
	    	}
    	}

    	var cuadro2 = cuadro2Group.create(x,y,"atlas.game","cuadro2")
    	cuadro2.anchor.setTo(0.5)
    	cuadro2.givedCoin = true
    	game.physics.p2.enable(cuadro2,false)
    	cuadro2.body.kinematic = true
    	cuadro2.objectType = OBJETC_TYPES.CUADRO2
    	return cuadro2
    }

    function getCuadro3(x,y){
    	for(var i =0; i < cuadro3Group.length;i++){
    		if(!cuadro3Group.children[i].visible){
	    		cuadro3Group.children[i].body.x = x
	    		cuadro3Group.children[i].body.y = y
	    		cuadro3Group.children[i].visible = true
	    		cuadro3Group.children[i].givedCoin = true
	    		return cuadro3Group.children[i]
	    	}
    	}

    	var cuadro3 = cuadro3Group.create(x,y,"atlas.game","cuadro3")
    	cuadro3.anchor.setTo(0.5)
    	cuadro3.givedCoin = true
    	game.physics.p2.enable(cuadro3,false)
    	cuadro3.body.kinematic = true
    	cuadro3.objectType = OBJETC_TYPES.CUADRO3
    	return cuadro3
    }

    function getLibrero(x,y){
    	for(var i =0; i < libreroGroup.length;i++){
    		if(!libreroGroup.children[i].visible){
	    		libreroGroup.children[i].body.x = x
	    		libreroGroup.children[i].body.y = y
	    		libreroGroup.children[i].visible = true
	    		libreroGroup.children[i].givedCoin = true
	    		return libreroGroup.children[i]
	    	}
    	}

    	var librero = libreroGroup.create(x,y,"atlas.game","librero")
    	librero.anchor.setTo(0.5)
    	librero.givedCoin = true
    	game.physics.p2.enable(librero,false)
    	librero.body.kinematic = true
    	librero.objectType = OBJETC_TYPES.LIBRERO
    	return librero
    }

    function getLampara(x,y){
    	for(var i =0; i < lamparaGroup.length;i++){
    		if(!lamparaGroup.children[i].visible){
    			lamparaGroup.children[i].body.velocity.x = 0
    			lamparaGroup.children[i].body.velocity.y = 0
    			lamparaGroup.children[i].body.angularVelocity = 0
    			lamparaGroup.children[i].body.angle = 0
	    		lamparaGroup.children[i].body.x = x
	    		lamparaGroup.children[i].body.y = y
	    		lamparaGroup.children[i].visible = true
	    		lamparaGroup.children[i].givedCoin = true
	    		return lamparaGroup.children[i]
	    	}
    	}

    	var lampara = lamparaGroup.create(x,y,"atlas.game","lampara")
    	lampara.anchor.setTo(0.5)
    	lampara.givedCoin = true
    	game.physics.p2.enable(lampara,false)
    	//lampara.body.kinematic = true
    	lampara.objectType = OBJETC_TYPES.LAMPARA
    	return lampara
    }

    function getLibro(x,y){
    	for(var i =0; i < librosGroup.length;i++){
    		if(!librosGroup.children[i].visible){
	    		librosGroup.children[i].body.x = x
	    		librosGroup.children[i].body.y = y
	    		librosGroup.children[i].visible = true
	    		librosGroup.children[i].givedCoin = true
	    		return librosGroup.children[i]
	    	}
    	}

    	var libros = librosGroup.create(x,y,"atlas.game","libros")
    	libros.anchor.setTo(0.5)
    	libros.givedCoin = true
    	game.physics.p2.enable(libros,false)
    	libros.body.kinematic = true
        //libros.body.
    	libros.objectType = OBJETC_TYPES.LIBROS
    	return libros
    }

    function getMesa(x,y){
    	for(var i =0; i < mesaGroup.length;i++){
    		if(!mesaGroup.children[i].visible){
	    		mesaGroup.children[i].body.x = x
	    		mesaGroup.children[i].body.y = y
	    		mesaGroup.children[i].visible = true
	    		mesaGroup.children[i].givedCoin = true
	    		return mesaGroup.children[i]
	    	}
    	}

    	var mesa = mesaGroup.create(x,y,"atlas.game","mesa3")
    	mesa.anchor.setTo(0.5)
    	mesa.givedCoin = true
    	game.physics.p2.enable(mesa,false)
    	mesa.body.kinematic = true
    	mesa.objectType = OBJETC_TYPES.MESA
    	return mesa
    }

    function getTele(x,y){
    	for(var i =0; i < teleGroup.length;i++){
    		if(!teleGroup.children[i].visible){
	    		teleGroup.children[i].body.x = x
	    		teleGroup.children[i].body.y = y
	    		teleGroup.children[i].visible = true
	    		teleGroup.children[i].givedCoin = true
	    		return teleGroup.children[i]
	    	}
    	}

    	var tele = teleGroup.create(x,y,"atlas.game","tele")
    	tele.anchor.setTo(0.5)
    	tele.givedCoin = true
    	game.physics.p2.enable(tele,false)
    	tele.body.kinematic = true
    	tele.objectType = OBJETC_TYPES.TELE
    	return tele
    }

    function getCajonera(x,y){
    	for(var i =0; i < cajoneraGroup.length;i++){
    		if(!cajoneraGroup.children[i].visible){
	    		cajoneraGroup.children[i].body.x = x
	    		cajoneraGroup.children[i].body.y = y
	    		cajoneraGroup.children[i].visible = true
	    		cajoneraGroup.children[i].givedCoin = true
	    		return cajoneraGroup.children[i]
	    	}
    	}

    	var cajonera = cajoneraGroup.create(x,y,"atlas.game","cajonera")
    	cajonera.anchor.setTo(0.5)
    	cajonera.givedCoin = true
    	game.physics.p2.enable(cajonera,false)
    	cajonera.body.kinematic = true
    	cajonera.objectType = OBJETC_TYPES.cajonera
    	return cajonera
    }


    function createPattern(){
    	var r = game.rnd.integerInRange(1,6)
    	//r = 6
    	switch(r){
    		case 1:
    			createPatter1()
    		break
    		case 2:
    			createPatter2()
    		break
    		case 3:
    			createPatter3()
    		break
    		case 4:
    			createPatter4()
    		break
    		case 5:
    			createPatter5()
    		break
    		case 6:
    			createPatter6()
    		break
    		case 7:
    			createPatter7()
    		break
    		case 8:
    			createPatter8()
    		break
    		case 9:
    			createPatter9()
    		break
    		case 10:
    			createPatter10()
    		break
    	}
    }

    function createPatter1(){
    	var chair = getChair(currentX,game.world.height - 430)
    	currentX+=400
    	var clock = getClock(currentX,game.world.height - 700)
    	currentX+=240
    	var table = getTable(currentX,game.world.height - 350)
    	currentX += 200
    	var aiprlane = getAirplane(currentX,game.world.height - 550)
    	currentX += 500
    	var bocina = getBocina(currentX,game.world.height - 350)
    	lastObject = bocina
    }

    function createPatter2(){
    	var burro = getBurro(currentX,game.world.height - 330)
    	currentX+=200
    	var cuadro = getCuadro1(currentX,game.world.height - 700)
    	currentX+=140
    	cuadro = getCuadro2(currentX,game.world.height - 600)
    	currentX += 150
    	cuadro = getCuadro3(currentX,game.world.height - 550)
    	currentX += 250
    	var arcade = getTable(currentX,game.world.height - 350)
    	currentX+=350
    	var cajonera = getCajonera(currentX,game.world.height - 350)
    	lastObject = cajonera
    }

    function createPatter3(){
    	var cajonera = getCajonera(currentX,game.world.height - 300)
    	var lampara = getLampara(currentX, game.world.height - 400)
    	currentX += 500
    	var librero = getLibrero(currentX,game.world.height - 450)
    	currentX += 500
    	var clock = getClock(currentX, game.world.height - 500)
    	currentX += 300
    	var chair = getChair(currentX, game.world.height - 430)
    	currentX += 300
    	var table = getTable(currentX, game.world.height - 350)
    	lastObject = table

    }

    function createPatter4(){
        var table = getTable(currentX,game.world.height - 350)
    	currentX += 500
    	var burro = getBurro(currentX,game.world.height - 330)
        currentX+=350
        var clock = getClock(currentX, game.world.height - 500)
        currentX +=200
    	var bocina = getBocina(currentX,game.world.height - 350)
    	currentX += 200
    	var chair = getChair(currentX, game.world.height - 430)
    	currentX += 300
        var aiprlane = getAirplane(currentX,game.world.height - 550)
        currentX += 200
        var cajonera = getCajonera(currentX, game.world.height - 350)
        lastObject = cajonera
    }

    function createPatter5(){
        var arcade = getArcade(currentX,game.world.height - 400)
        currentX += 200
        var ariplane = getAirplane(currentX, game.world.height - 500)
        currentX += 500
        var librero = getLibrero(currentX,game.world.height - 450)
        currentX += 500
        var clock = getClock(currentX, game.world.height - 500)
        currentX += 300
        var chair = getChair(currentX, game.world.height - 430)
        currentX += 300
        var table = getTable(currentX, game.world.height - 350)
        lastObject = table
    }

    
    function createPatter6(){
        var escritorio = getEscritorio(currentX+100,game.world.height - 350)
        currentX += 300
        var cuadro = getCuadro1(currentX,game.world.height - 550)
        currentX+=140
        cuadro = getCuadro1(currentX,game.world.height - 600)
        currentX += 150
        cuadro = getCuadro3(currentX,game.world.height - 650)
        currentX += 250
        var clock = getClock(currentX, game.world.height - 500)
        currentX +=350
        var arcade = getArcade(currentX,game.world.height - 400)
        currentX += 200
        lastObject = arcade
    }

    function createPatter7(){
        var clock = getClock(currentX, game.world.height - 500)
        currentX +=350
        var cuadro = getCuadro1(currentX,game.world.height - 550)
        currentX+=140
        cuadro = getCuadro1(currentX,game.world.height - 600)
        currentX += 150
        cuadro = getCuadro3(currentX,game.world.height - 650)
        currentX += 250
        var clock = getClock(currentX, game.world.height - 500)
        currentX +=350
        var arcade = getArcade(currentX,game.world.height - 400)
        currentX += 200
        lastObject = arcade
    }
    
    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function create(){
    	
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 900
        sceneGroup = game.add.group()
        game.physics.p2.setBoundsToWorld(false,false,false,false,false)


        initialize()

        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

		 game.onPause.add(function(){
				
			if(amazing.getMinigameId()){
				marioSong.pause()
			}
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			
	        game.sound.mute = false
	    }, this);

        createBackground()
        createPlayer()

        createPointsBar()
        createHearts()

        createObjects()

        animateScene()
        loadSounds()

        gameActive = true
    }

    
    return {
        assets: assets,
        name: "zoe",
        create: create,
        preload: preload,
        update: update
    }
}()