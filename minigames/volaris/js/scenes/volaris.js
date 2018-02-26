var soundsPath = "../../shared/minigames/sounds/"
var spinePath = "../../shared/minigames/images/spines/"
var volaris = function(){

	assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/volaris/atlas.json",
                image: "images/volaris/atlas.png",
            },
        ],
        /*images: [
            {   name:"fondo",
				file: "images/delicafe/fondo.png"},
		],*/
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {
                name: "turbo",
                file:soundsPath+"inflateballoon.mp3"
            },
            {
                name: "turbo",
                file:soundsPath+"inflateballoon.mp3"
            },
            
		],
	}
    var PROBABILITY_OBSTACLE = 0.3
    
    var INITIAL_LIVES = 1
    var DELTA_LOSE = 0.0005
    var DELTA_ENEMY = 0.1
    var DELTA_PLUS = 0.3

    var Y_MAX_VELOCITY = 10
    var DELTA_VELOCITY = 0.3

    var DELTA_TIME_OBSTACLE = 200
    var INIT_TIME_OBSTACLE = 4000
    var MIN_TIME_OBSTACLE = 3000

    var INIT_X

    var TURBO_VELOCITY = 5
    var TURBO_TIME = 5000

    var TIME_PERMIT_TURBO = 10000
    var DELTA_VEL_OBS = 0.1
    var MAX_DELTA_VEL_OBS = 2



    
    
    var gameIndex = 24
    var marioSong = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive
    var valuesList = null
    var objectsGroup

    var pointsBar = null

    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player
    var velocity

    var cloudsGroup
    var ticketsGroup
    var cardsGroup
    var ballonsGroup
    var birdsGroup
    var haloGroup
    var ovniGroup
    var rainbowGroup

    var backGroup

    var timeNewObstacle
    var currentDeltaTime

    var backgroundGroup
    var topCloudsGroup
    var mountain_1_Group
    var mountain_2_Group
    var mountain_3_Group
    var floorGroup
    var cespedGroup
    var backgroundAdornGroup

    var groups

    var liveBar
    var tweenLive

    var onCollisionBackground
    var turboActivated 
    var timeTurbo

    var timePermitTurbo 

    var deltaVel


	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){
        INIT_X = game.world.width + 200
        velocity = 0
        lives = INITIAL_LIVES
        gameActive = false
        groups = []
        onCollisionBackground = 0
        turboActivated = false
        timePermitTurbo = 5000
        deltaVel = 0
	}
    

    function animateScene() {
                
        
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        

		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        


    }
    
    
    function preload() {
        
		game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
       	game.load.physics('physicsData', 'physics/physics.json?v7');
        		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/upbeat_casual.mp3',1)
		}else{
			game.load.audio('arcadeSong', soundsPath + 'songs/upbeat_casual.mp3');
		}

        game.load.spine('ducks','images/spines/Ducks/ducks.json')
        game.load.spine('plane','images/spines/Plane/plane.json')
        game.load.spine('storm','images/spines/Storm/storm.json')
        game.load.spine('ufo','images/spines/UFO/ship.json')

        game.load.image('helper', 'images/volaris/helper.png')

    }

    
    function stopGame(win){
        liveBar.mask.scale.setTo(0.001,1)
        

    	game.add.tween(player.body).to({x:game.world.width-200,y:game.world.height-100},3000,Phaser.Easing.linear,true)

        //heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        player.spine.setAnimationByName(0,'lose',true)
        
		if(amazing.getMinigameId()){
			marioSong.pause()
		}else{
			marioSong.stop()
		}
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
		
            sceneloader.show("result")
		})
    }
    
    function addPoint(number,obj){
        
        sound.play("magic")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }


    
    function update(){
        
        if(gameActive == false){
            return
        }

        if(game.input.activePointer.isDown){
        	if(player.body.y > 100){
            	if(velocity>-Y_MAX_VELOCITY){
                	velocity-=DELTA_VELOCITY
            	}
            }
            else{
            	velocity = 0
            }
        }
        else{
        	if(player.body.y < game.world.height-100){
	            if(velocity<Y_MAX_VELOCITY){
	                velocity+=DELTA_VELOCITY
	            }
	        }else{
	        	velocity = 0
	        }


        }
        if((player.body.y >100 && velocity<0)||(player.body.y < game.world.height-100 && velocity>1)){ 
	        player.body.y += velocity
	    }



        if(timeNewObstacle < game.time.now){
            if(currentDeltaTime>MIN_TIME_OBSTACLE){
                currentDeltaTime-=DELTA_TIME_OBSTACLE
            }
            timeNewObstacle = game.time.now + currentDeltaTime

            if(turboActivated){
                timeNewObstacle-=1000
            }
            var r = game.rnd.integerInRange(1,2)

            var x = game.rnd.integerInRange(-100,100)

            for(var i = 0 ; i < r; i ++){
                var id
                var obs = game.rnd.frac()

                if(timePermitTurbo<game.time.now){
                    if(obs<=PROBABILITY_OBSTACLE){
                        id = game.rnd.integerInRange(0,2)
                    }
                    else{
                        id = game.rnd.integerInRange(3,groups.length-1)
                    }
                    if(id == groups.length-1){
                        timePermitTurbo = game.time.now + TIME_PERMIT_TURBO
                    }
                }
                else{

                    if(obs<=PROBABILITY_OBSTACLE){
                        id = game.rnd.integerInRange(0,2)
                    }
                    else{
                        id = game.rnd.integerInRange(3,groups.length-2)
                    }
                }
                var o = getObjectFromGroup(groups[id])
                o.visible = true
                o.body.x = INIT_X + x
                x += game.rnd.integerInRange(0,300)
                o.body.y = game.rnd.integerInRange(game.world.centerY - 220, game.world.centerY+180)
                o.vel = game.rnd.integerInRange(2+deltaVel,3+deltaVel)
                //console.log("Set object ",o)
            }
            if(deltaVel < MAX_DELTA_VEL_OBS){
                deltaVel += DELTA_VEL_OBS
            }
        }
        var turbo = 0
        if(turboActivated){
        	turbo = TURBO_VELOCITY
        	if(timeTurbo<game.time.now){
        		turboActivated = false
                player.spine.setAnimationByName(0,'idle',true)
        	}
        }

        for(var i = 0; i < groups.length; i++){
            //console.log(groups.length,groups[i].length)
            for(var j = 0; j < groups[i].length; j++){
                if(groups[i].children[j].visible){

                    groups[i].children[j].body.x -= (groups[i].children[j].vel + turbo)

                    if(groups[i].children[j].secondPart!=null){
                        groups[i].children[j].secondPart.x = groups[i].children[j].body.x+groups[i].children[j].secondPart.delta.x
                        groups[i].children[j].secondPart.y = groups[i].children[j].body.y+groups[i].children[j].secondPart.delta.y
                    }
                    //console.log("vel")
                    if(groups[i].children[j].body.x < -200){
                        groups[i].children[j].visible = false
                    }
                }
            }
        }

        moveBackground(topCloudsGroup,turbo)
        moveBackground(mountain_3_Group,turbo)
        moveBackground(mountain_2_Group,turbo)
        moveBackground(mountain_1_Group,turbo)
        moveBackground(floorGroup,turbo)
        moveBackground(cespedGroup,turbo)
        moveBackground(backgroundAdornGroup,turbo)

        if(liveBar.canDecrease){
            liveBar.mask.scale.setTo(liveBar.mask.scale.x - DELTA_LOSE, 1)
            if(liveBar.mask.scale.x <= 0){
                stopGame()
            }
        }

    }

    function moveBackground(group,turbo){
        for(var i = 0; i < group.length; i++){
            //console.log()
            if(group.children[i].body!=null){
                group.children[i].body.x -= (group.children[i].vel +turbo)
                if(group.children[i].body.x < -800){
                    group.children[i].body.x += group.children[i].width*group.length- (group.length)
                }
            }
            else{
                group.children[i].x -= (group.children[i].vel+turbo)
                if(group.children[i].x < -800){
                    if(group == backgroundAdornGroup){
                        group.children[i].x = game.world.width + game.rnd.integerInRange(group.children[i].width,group.children[i].width+200)
                        group.children[i].y = game.world.centerY + game.rnd.integerInRange(-200,150)
                    }
                    else{
                        group.children[i].x += group.children[i].width*group.length - (group.length)
                    }
                }
            }
        }
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
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
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
    
    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    
    function setRound(){
        currentDeltaTime = INIT_TIME_OBSTACLE
        timeNewObstacle = game.time.now + currentDeltaTime
    	aceleration = 0
        gameActive = true
    }


    function getObjectFromGroup(group){
        for(var i = 0; i < group.length; i++){
            if(!group.children[i].visible){
                group.children[i].visible = true
                group.children[i].body.enable = true
                return group.children[i]
            }
        }

        var o 
        /*o= createBallon()
        group.add(o)
        return o*/

        switch(group){
            case birdsGroup:
                o = createBird()
            break
            case rainbowGroup:
                o = createRainbow()
            break
            case cloudsGroup:
                o = createCloud()
            break
            case ticketsGroup:
                o = createTicket()
            break
            case cardsGroup:
                o = createCard()
            break
            case ovniGroup:
                o = createOvni()
            break
            case haloGroup:
                o = createHalo()
            break
            case ballonsGroup:
                o = createBallon()
            break
        }
        group.add(o)
        return o

    }

    function createBird(){
        //var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','Parvada')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "enemy"
        s.body.enable = true
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','birds')
        s.body.data.shapes[0].sensor = true;
        s.loadTexture('helper',0,false)
        //group.add(s)

        var spine = game.add.spine(-30,0,'ducks')
        //spine.anchor.setTo(0.5)
        spine.setSkinByName('normal')
        spine.setAnimationByName(0,'idle',true)
        s.addChild(spine)

        return s
    }

    function createRainbow(){
        //var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','arcoiris_frente')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "plusTime"
        s.body.enable = true
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','rainbow')
        s.body.data.shapes[0].sensor = true;
        s.body.ballon = false


        var front = game.add.sprite(50,0,'atlas.game','arcoiris_detras')
        front.anchor.setTo(0.5)
        //s.addChild(front)
        backGroup.add(front)
        s.secondPart = front
        s.secondPart.delta = {x:80,y:-22}

        //group.add(s)

        return s
    }

    function createCloud() {
       // var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','Nube_lluvia')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "enemy"
        s.body.enable = true
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','rainCloud')
        s.body.data.shapes[0].sensor = true;
        s.loadTexture('helper',0,false)
        //group.add(s)

        var spine = game.add.spine(0,30,'storm')
        //spine.anchor.setTo(0.5)
        spine.setSkinByName('normal')
        spine.setAnimationByName(0,'idle',true)
        s.addChild(spine)

        return s
    }

    function createTicket(){
        //var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','boleto')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "coin"
        s.body.enable = true
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','ticket')
        s.body.data.shapes[0].sensor = true;
        //group.coin = s
        //group.add(s)

        return s
    }

    function createCard(){
        //var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','Vclub')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "coin"
        s.body.enable = true
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','card')
        s.body.data.shapes[0].sensor = true;
        //group.coin = s
        //group.add(s)

        return s
    }

    function createHalo(){

        //var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','aro_frente')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "turbo"
        s.body.enable = true
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','halo')
        s.body.data.shapes[0].sensor = true;

        var front = game.add.sprite(-50,0,'atlas.game','aro_detras')
        front.anchor.setTo(0.5)
        backGroup.add(front)
        s.secondPart = front
        s.secondPart.delta = {x:-37,y:0}

        return s
    }

    function createOvni() {
        //var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','Ovni')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "enemy"
        s.body.enable = true
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','ovni')
        s.body.data.shapes[0].sensor = true;
        s.loadTexture('helper',0,false)

        //group.add(s)

        var spine = game.add.spine(0,0,'ufo')
        //spine.anchor.setTo(0.5)
        spine.setSkinByName('normal')
        spine.setAnimationByName(0,'idle',true)
        s.addChild(spine)

        return s
    }

    function createBallon(){

        //var group = game.add.group()

        var s = game.add.sprite(0,0,'atlas.game','globo')
        s.anchor.setTo(0.5)
        game.physics.p2.enable(s,false)
        s.body.type = "plusTime"
        s.body.ballon = true
        s.body.enable = true
        //for(var i = 0; i< s.body.data.shapes.length;)
        
        s.body.clearShapes()
        s.body.loadPolygon('physicsData','ballon')
        s.body.data.shapes[0].sensor = true;

        //group.add(s)

        return s
    }

    function evaluateCollisionBackground(){
    	if(!gameActive){
    		return
    	}
    	if(onCollisionBackground>0){
    		if(liveBar.mask.scale.x - DELTA_ENEMY < 0){
                liveBar.mask.scale.setTo(0,1)
                stopGame()
            }
            else{
                liveBar.mask.scale.setTo(liveBar.mask.scale.x - DELTA_ENEMY,1)
            }
            createPart('wrong',player)
            sound.play('wrong')
            setTimeout(evaluateCollisionBackground,1000)
    	}
    }

    function collisionPlayer(body, bodyB, shapeA, shapeB, equation){
    	if(!gameActive){
    		return
    	}
        if(!body.enable){
            return
        }

        if(turboActivated){
        	if(body.type != "background"){
        		//body.sprite.visible = false
        		body.x = -200
        		liveBar.mask.canDecrease = false
	            var s 
	            if(liveBar.mask.scale.x + DELTA_PLUS>1){
	                s = 1
	            }
	            else{
	                s = liveBar.mask.scale.x + DELTA_PLUS
	            }

	            liveBar.mask.scale.setTo(s,1)
	            createPart('star',body.sprite)
	            sound.play('magic')
	            addPoint(1,player)
        	}
        	return
        }

        body.enable = false
        if(body.type == "background"){
            if(liveBar.mask.scale.x - DELTA_ENEMY < 0){
                liveBar.mask.scale.setTo(0,1)
                stopGame()
            }
            else{
                liveBar.mask.scale.setTo(liveBar.mask.scale.x - DELTA_ENEMY,1)
            }
            createPart('wrong',player)
            sound.play('wrong')
            body.enable = true
            var animation = player.spine.setAnimationByName(0,'hit',false)
            animation.onComplete = function(){player.spine.setAnimationByName(0,'idle',true)}
            if(onCollisionBackground==0){
            	onCollisionBackground ++
	            setTimeout(evaluateCollisionBackground,1000)
	        }
	        
        }
        else if(body.type == "enemy"){
            if(liveBar.mask.scale.x - DELTA_ENEMY < 0){
                liveBar.mask.scale.setTo(0,1)
                stopGame()
            }
            else{
                liveBar.mask.scale.setTo(liveBar.mask.scale.x - DELTA_ENEMY,1)
            }
            createPart('wrong',body.sprite)
            sound.play('wrong')

            var animation = player.spine.setAnimationByName(0,'hit',false)
            animation.onComplete = function(){player.spine.setAnimationByName(0,'idle',true)}

        }
        else if(body.type == "plusTime"){
            liveBar.mask.canDecrease = false
            var s 
            if(liveBar.mask.scale.x + DELTA_PLUS>1){
                s = 1
            }
            else{
                s = liveBar.mask.scale.x + DELTA_PLUS
            }
            tweenLive = game.add.tween(liveBar.mask.scale).to({x: s},400,Phaser.Easing.linear,true)
            tweenLive.onComplete.add(function(){liveBar.mask.canDecrease = true})
            createPart('star',body.sprite)
            sound.play('magic')

            if(body.ballon){
                body.sprite.visible = false
            }

        }
        else if(body.type == "coin"){
            body.sprite.visible = false
            addPoint(1,body.sprite)
        }
        else if(body.type == "turbo"){
        	//addPoint(10,body.sprite)
            sound.play('turbo')
        	turboActivated = true
        	timeTurbo = game.time.now + TURBO_TIME
            player.spine.setAnimationByName(0,'turbo',true)
        }
    }

    function endCollisionPlayer(body, bodyB, shapeA, shapeB, equation){
    	if(!gameActive){
    		return
    	}
    	if(body.type == 'background'){
    		onCollisionBackground --
            if(onCollisionBackground>0){
                onCollisionBackground = 0
            }
    		console.log('backfrounds ',onCollisionBackground)
    	}
    }
    

    function create(){

        initialize()  
        
        sceneGroup = game.add.group()

        game.physics.startSystem(Phaser.Physics.P2JS)
        game.physics.p2.gravity.y = 0;
        game.physics.p2.setBoundsToWorld(false,false,false,false,false)


        var bmd = game.add.bitmapData(1, game.world.height)
        var y = 0;
        for (var j = 0; j <= game.world.height/2; j++)
        {
            var c = Phaser.Color.interpolateColor(0xa4dff5, 0xdbe9f2, game.world.height/2, j);

            // console.log(Phaser.Color.getWebRGB(c));

            bmd.rect(0, y, 1, y+2, Phaser.Color.getWebRGB(c));

            //out.push(Phaser.Color.getWebRGB(c));

            y += 2;
        }

        var background = sceneGroup.create(0,0,bmd)
        //background.anchor.setTo(0.5)
        background.scale.setTo(game.world.width,1)
        sceneGroup.add(background)

        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        backgroundAdornGroup = game.add.group()
        sceneGroup.add(backgroundAdornGroup)

        topCloudsGroup = game.add.group()
        sceneGroup.add(topCloudsGroup)

        mountain_3_Group = game.add.group()
        sceneGroup.add(mountain_3_Group)
        mountain_2_Group = game.add.group()
        sceneGroup.add(mountain_2_Group)
        mountain_1_Group = game.add.group()
        sceneGroup.add(mountain_1_Group)

        cespedGroup = game.add.group()
        sceneGroup.add(cespedGroup)

        floorGroup = game.add.group()
        sceneGroup.add(floorGroup)


        var x = game.world.centerX

        var upperCloud
        for(var i = 0; i < 3; i ++){
	        upperCloud = topCloudsGroup.create(x,100,'atlas.game','Nube_grande')
	        upperCloud.anchor.setTo(0)
	        game.physics.p2.enable(upperCloud,false)
	        
	        upperCloud.body.type="background"
	        upperCloud.body.enable = true
	        upperCloud.body.clearShapes()
        	upperCloud.body.loadPolygon('physicsData','cloud')
	        upperCloud.body.data.shapes[0].sensor = true;
	        upperCloud.vel = 1
	        x+=upperCloud.width-1
	    }

        
        x = 0
        var mountain_1
        for(var i = 0; i < 6; i++){
            mountain_1 = mountain_1_Group.create(x,game.world.height,'atlas.game','monte1')
            mountain_1.anchor.setTo(0,1)
            mountain_1.scale.setTo(0.5)
            mountain_1.vel = 1
            x += mountain_1.width-1
        }

        x = 0
        var mountain_2

        for(var i = 0; i < 5; i++){
            mountain_2 = mountain_2_Group.create(x,game.world.height,'atlas.game','monte2')
            mountain_2.anchor.setTo(0,1)
            mountain_2.scale.setTo(1)
            mountain_2.vel = 0.7
            x+=mountain_2.width-1
        }

        

        x = 0
        var mountain_3
        for(var i = 0; i < 4; i ++){
            mountain_3 = mountain_3_Group.create(x,game.world.height-100,'atlas.game','Montanas')
            mountain_3.anchor.setTo(0,1)
            mountain_3.scale.setTo(1)
            mountain_3.vel = 0.5
            x +=mountain_3.width-1
            game.physics.p2.enable(mountain_3,false)
            mountain_3.body.type = "background"
	        mountain_3.body.enable = true
	        mountain_3.body.clearShapes()
	        mountain_3.body.loadPolygon('physicsData','mountain')
	        mountain_3.body.data.shapes[0].sensor = true;
	        
        }

        x = 0
        var floor
        for(var i = 0; i < 10; i ++){
            floor = floorGroup.create(x,game.world.height,'atlas.game','piso')
            floor.anchor.setTo(0,1)
            floor.scale.setTo(1)
            floor.vel = 1
            x +=floor.width-1
     		
        }

        var adorn = backgroundAdornGroup.create(game.world.width+game.rnd.integerInRange(-200,500),game.world.centerY+game.rnd.integerInRange(-200,200),'atlas.game','viento_fondo')
        adorn.anchor.setTo(0.5)
        adorn.scale.setTo(1)
        adorn.vel = 0.4

        adorn = backgroundAdornGroup.create(game.world.width+game.rnd.integerInRange(0,500),game.world.centerY+game.rnd.integerInRange(-200,150),'atlas.game','nubes_fondo')
        adorn.anchor.setTo(0.5)
        adorn.scale.setTo(1)
        adorn.vel = 0.3

        adorn = backgroundAdornGroup.create(game.world.centerX+game.rnd.integerInRange(-200,0),game.world.centerY+game.rnd.integerInRange(-200,150),'atlas.game','nubes_fondo')
        adorn.anchor.setTo(0.5)
        adorn.scale.setTo(1)
        adorn.vel = 0.25

        var adorn = backgroundAdornGroup.create((game.world.width*2)+game.rnd.integerInRange(-200,500),game.world.centerY+game.rnd.integerInRange(-200,200),'atlas.game','viento_fondo')
        adorn.anchor.setTo(0.5)
        adorn.scale.setTo(1)
        adorn.vel = 0.4

        adorn = backgroundAdornGroup.create((game.world.width*2)+game.rnd.integerInRange(-200,500),game.world.centerY+game.rnd.integerInRange(-200,150),'atlas.game','nubes_fondo')
        adorn.anchor.setTo(0.5)
        adorn.scale.setTo(1)
        adorn.vel = 0.3

        

        backGroup = game.add.group()
        sceneGroup.add(backGroup)


        

        cloudsGroup = game.add.group()
        sceneGroup.add(cloudsGroup)
        birdsGroup = game.add.group()
        sceneGroup.add(birdsGroup)
        ovniGroup = game.add.group()
        sceneGroup.add(ovniGroup)

        ticketsGroup = game.add.group()
        sceneGroup.add(ticketsGroup)
        cardsGroup = game.add.group()
        sceneGroup.add(cardsGroup)
        ballonsGroup = game.add.group()
        sceneGroup.add(ballonsGroup)
        
        
        player = sceneGroup.create(100,game.world.centerY,'atlas.game','avion')
        player.anchor.setTo(0.5)
        //player.alpha = 0.5
        game.physics.p2.enable(player,false)
        player.body.clearShapes()
        player.body.loadPolygon('physicsData','player')
        player.body.onBeginContact.add(collisionPlayer,this)
        player.body.onEndContact.add(endCollisionPlayer,this)

        player.loadTexture('helper',0,false)



        var spine = game.add.spine(0,30,'plane')
        spine.setSkinByName('normal')
        spine.setAnimationByName(0,'idle',true)
        //spine.anchor.setTo(0.5)
        player.addChild(spine)
        player.spine = spine

        rainbowGroup = game.add.group()
        sceneGroup.add(rainbowGroup)

        haloGroup = game.add.group()
        sceneGroup.add(haloGroup)

        groups.push(cloudsGroup)
        groups.push(ovniGroup)
        groups.push(birdsGroup)
        groups.push(ticketsGroup)
        groups.push(cardsGroup)
        groups.push(ballonsGroup)
        groups.push(rainbowGroup)
        groups.push(haloGroup)


        

        

        //sceneGroup.add()


        loadSounds()
        


        game.onPause.add(function(){
			
			game.sound.mute = true
			if(amazing.getMinigameId()){
				marioSong.pause()
			}
			
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
			
			if(amazing.getMinigameId()){
				if(lives>0){

					marioSong.play()
				}
			}
			
		}, this);
        
        
            
		if(!amazing.getMinigameId()){
			
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.3)
			}, this);
		}
        

        /*liveBar = game.add.graphics(0,0)
        liveBar.beginFill(0xff0000)
        liveBar.drawRect(game.world.cemterX-200,200, 200,50)
        liveBar.endFill()
        liveBar.canDecrease = true
        sceneGroup.add(liveBar)*/

        var containerBar = sceneGroup.create(game.world.centerX-160,100,'atlas.game','Contenedor_barra')
        containerBar.anchor.setTo(0,0.5)

        liveBar = sceneGroup.create(containerBar.x+5,containerBar.y,'atlas.game','barra_vida')
        liveBar.anchor.setTo(0,0.5)
        liveBar.canDecrease = true


        var mask = game.add.graphics(0,0)
        mask.beginFill(0xff0000)
        mask.drawRect(0,-25, 330,50)
        mask.endFill()
        liveBar.mask = mask
        liveBar.addChild(mask)



        createObjects()
        createPointsBar()
        createHearts()
        animateScene()
        

        setRound()
        

    }

    
	return {
		assets: assets,
		name: "volaris",
		create: create,
        preload: preload,
        update: update,
        //render:render
	}
}()