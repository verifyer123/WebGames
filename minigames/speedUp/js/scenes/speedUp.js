var soundsPath = "../../shared/minigames/sounds/"
var speedUp = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/speedUp/atlas.json",
                image: "images/speedUp/atlas.png",
            },
        ],
        images: [
            {   name: "backgroundTile",
                file:  "images/speedUp/backgroundTile.png"},
            {   name: "marco",
                file:  "images/speedUp/marco_tile.png"},

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "bomb",
                file: soundsPath + "explosion.mp3"},
            {   name: "pop",
                file: soundsPath + "coin.wav"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "misile",
                file: soundsPath + "inflateballoon.mp3"},
        ],
        
    }
    
    var INITIAL_LIVES = 1
    var INITIAL_TIME_JEWEL = 8000
    var DELTA_TIME_GET_JEWEL = 50
    var MIN_TIME_GET_JEWEL = 3000

    var BLINK_TIMES = 5
    var TIME_BLINK = 300
    var CONTS_VELOCITY = 12

    var DELTA_MOVE_ANGLE = 4

    var MISILE_VELOCITY = 13
    var DELTA_SEND_SMOKE = 30
    var SMOKE_DELTA_SCALE = 0.01
    var SMOKE_DELTA_ROTATION = 0.5
    var MISILE_TIME_BLINK = 300
    var MISILE_BLINK_TIMES = 3

    var TIME_EXPLOSION_CHANGE_FRAME = 300


    var INITIAL_TIME_BOMB = 3000
    var DELTA_TIME_BOMB = 50
    var MIN_TIME_BOMB = 1000
    var BOMB_IDLE_TIME = 2000
    var SKULL_SCALE_DELTA = 0.05

    var INITIAL_TIME_MISILE = 6000
    var DELTA_TIME_MISILE = 50
    var MIN_TIME_MISILE = 1000

    var RADIUS_EXPLOSION = 60

    var LINE_TIME_IDLE = 1500

    var gameIndex = 31
    var gameId = 1000019
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var carPlayer
    var bombGroup, skullGroup, misileGroup, smokeGroup, warningGroup, explosionGroup, lineGroup
    var jewel

    var timeGetJewel, timeGetBomb, timeGetMisile

    var leftArrow, rigthArrow
    var misileTimeout, bombTimeout
    var gameInPause
    

    function loadSounds(){
        sound.decode(assets.sounds)
        sound.setVolumeAudios(0.1,assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        timeGetJewel = INITIAL_TIME_JEWEL
        timeGetBomb = INITIAL_TIME_BOMB
        timeGetMisile = INITIAL_TIME_MISILE
        gameActive = false
        gameInPause = false
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
                
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/game_on.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/game_on.mp3');
        }


    }

    
    function stopGame(win){

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        carPlayer.visible = false
        
        if(amazing.getMinigameId() && marioSong!=null){
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
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(0.5,0)
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

    function missPoint(){

        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        stopTouch = true
        
        if(lives === 0){
            stopGame()
        }
    
    }

    

    function update(){


        if(game.time.now > jewel.timeBlink && !jewel.inBlink){
            jewel.inBlink = true
            blinkJewel()
        }

        updateBomb()
        updateMisile()

    	if(!gameActive){
    		return
    	}


        if(carPlayer.visible){
            if(jewel!=null && carPlayer!=null){
    	        if(checkOverlap(carPlayer,jewel.jewelSon) && jewel.timeBlink+200 > game.time.now){
    	            getJewel()
    	        }
            }

	        if(leftArrow.isDown){
	            carPlayer.angle -= DELTA_MOVE_ANGLE
	            carPlayer.tire1.angle = -25
	            carPlayer.tire2.angle = -25
	            carPlayer.tire3.angle = -25
	            carPlayer.tire4.angle = -25
	            getLine(carPlayer.x,carPlayer.y,carPlayer.angle)
	        }
	        else if(rigthArrow.isDown){
	            carPlayer.angle += DELTA_MOVE_ANGLE
	            carPlayer.tire1.angle = 25
	            carPlayer.tire2.angle = 25
	            carPlayer.tire3.angle = 25
	            carPlayer.tire4.angle = 25
	            getLine(carPlayer.x,carPlayer.y,carPlayer.angle)
	        }
	        else{
	        	carPlayer.tire1.angle = 0
	            carPlayer.tire2.angle = 0
	            carPlayer.tire3.angle = 0
	            carPlayer.tire4.angle = 0
	        }

	        var _x = (CONTS_VELOCITY*Math.cos((carPlayer.angle-90)*(Math.PI/180))) + carPlayer.x
	        var _y = (CONTS_VELOCITY*Math.sin((carPlayer.angle-90)*(Math.PI/180))) + carPlayer.y


	        if(_x > game.world.width +100){
	            _x = -100
	        }
	        else if(_x<-100){
	            _x=game.world.width +100
	        }

	        if(_y > game.world.height +100){
	            _y = -100
	        }
	        else if(_y<-100){
	            _y=game.world.height +100
	        }

	        carPlayer.x = _x
        	carPlayer.y = _y

        	for(var i=0; i < lineGroup.length; i++){
        		if(lineGroup.children[i].visible){
        			var line = lineGroup.children[i]
        			if(line.timeIdle < game.time.now){
        				line.alpha -=0.01
        				if(line.alpha<=0){
        					line.alpha = 0
        					line.visible = false
        				}
        			}
        		}
        	}
        }
        
    }

    function updateMisile(){
        for(var i =0; i < warningGroup.length; i++){
            if(warningGroup.children[i].visible){
                var warning = warningGroup.children[i]

                // console.log(warning.timeBlinlk,"  warning  ",warning.blink)
                if(warning.timeBlinlk < game.time.now){
                    warning.timeBlinlk = game.time.now + MISILE_TIME_BLINK
                    if(warning.alpha ==1){
                        warning.alpha = 0
                    }
                    else{
                        warning.blink ++
                        warning.alpha = 1
                        if(warning.blink>=MISILE_BLINK_TIMES){

                            warning.blink = 0
                            warning.visible = false;
                            warning.misile.active = true;
                            sound.play("misile")
                        }
                    }
                }
            }
        }

        for(var i =0; i < misileGroup.length; i++){
            if(misileGroup.children[i].visible && misileGroup.children[i].active){
                var misile = misileGroup.children[i]

                if(carPlayer.visible){
                	if(checkOverlap(carPlayer,misile)){
                		getExplosion(misile.x,misile.y)
                		misile.visible = false
			            stopGame()
			        }
                }
                if(misile.scale.x > 0){
                    misile.x += MISILE_VELOCITY
                    if(misile.x > game.world.width+100){
                        misile.visible = false
                    }
                }
                else{
                    misile.x -= MISILE_VELOCITY
                    if(misile.x < -100){
                        misile.visible = false
                    }
                }

                misile.deltaSmoke += MISILE_VELOCITY
                if(misile.deltaSmoke > DELTA_SEND_SMOKE){
                    misile.deltaSmoke = 0

                    getSmoke(misile.x,misile.y)
                }

            }
        }

        for(var i =0; i < smokeGroup.length; i++){
            if(smokeGroup.children[i].visible){
                var smoke = smokeGroup.children[i]
                smoke.scale.setTo(smoke.scale.x + SMOKE_DELTA_SCALE)
                smoke.angle += smoke.rotationDirection*SMOKE_DELTA_ROTATION
                smoke.alpha -= 0.01
                if(smoke.alpha <=0){
                	smoke.alpha = 0
                	smoke.visible = false
                }
            }
        }

    }

    function updateBomb(){

        for(var i=0; i<skullGroup.length; i++){
            if(skullGroup.children[i].visible){
                var skull = skullGroup.children[i]
                if(skull.timeIdle > game.time.now){
	                if(skull.scaleDirection >0){
	                	skull.scale.setTo(skull.scale.x+SKULL_SCALE_DELTA)
	                	if(skull.scale.x >= 1){
	                		skull.scale.setTo(1)
	                		skull.scaleDirection = -1
	                	}
	                }
	                else if(skull.scaleDirection <0){
	                	skull.scale.setTo(skull.scale.x-SKULL_SCALE_DELTA)
	                	if(skull.scale.x <= 0.7){
	                		skull.scale.setTo(0.7)
	                		skull.scaleDirection = 1
	                	}
	                }
	            }
	            else{
	            	if(!skull.haveBomb){
	            		skull.haveBomb = true
	            		getBomb(skull.x,skull.y)
	            	}

	            	skull.scale.setTo(skull.scale.x-SKULL_SCALE_DELTA)
                	if(skull.scale.x <= 0){
                		skull.scale.setTo(0)
                		skull.scaleDirection = 1
                		skull.visible = false
                	}

	            }
            }
        }

        for(var i=0; i < bombGroup.length; i++){
            if(bombGroup.children[i].visible){
                var bomb = bombGroup.children[i]

                var d = Math.sqrt(Math.pow(carPlayer.x - bomb.x,2) + Math.pow(carPlayer.y - bomb.y,2))
                if(d < RADIUS_EXPLOSION){
                	stopGame()
                	bomb.visible = false
		            getExplosion(bomb.x,bomb.y)
                }

                if(bomb.timeIdle > game.time.now){
	                if(bomb.scaleDirection >0){
	                	bomb.scale.setTo(bomb.scale.x+SKULL_SCALE_DELTA)
	                	if(bomb.scale.x >= 1){
	                		bomb.scale.setTo(1)
	                		bomb.scaleDirection = -1
	                	}
	                }
	                else if(bomb.scaleDirection <0){
	                	bomb.scale.setTo(bomb.scale.x-SKULL_SCALE_DELTA)
	                	if(bomb.scale.x <= 0.7){
	                		bomb.scale.setTo(0.7)
	                		bomb.scaleDirection = 1
	                	}
	                }
	            }
	            else{
	            	if(bomb.bombState == 1 || bomb.bombState == 2 || bomb.bombState == 3 || bomb.bombState == 4){
	            		if(bomb.scaleDirection >0){
		                	bomb.scale.setTo(bomb.scale.x+(SKULL_SCALE_DELTA*2))
		                	if(bomb.scale.x >= 1){
		                		bomb.scale.setTo(1)
		                		bomb.scaleDirection = -1
		                	}
		                }
		                else if(bomb.scaleDirection <0){
		                	bomb.scale.setTo(bomb.scale.x-(SKULL_SCALE_DELTA*2))
		                	if(bomb.scale.x <= 0.7){
		                		bomb.scale.setTo(0.7)
		                		bomb.scaleDirection = 1
		                		bomb.bombState ++
		                		if(bomb.bombState<5){
		                			bomb.loadTexture("atlas.game","bomb_"+bomb.bombState)
		                		}
		                		else{
		                			bomb.visible = false
		                			getExplosion(bomb.x,bomb.y)
		                		}

		                	}
		                }
	            	}
	            }
            }
        }

        for(var i=0; i < explosionGroup.length; i++){
        	if(explosionGroup.children[i].visible){
        		var explosion = explosionGroup.children[i]
        		if(explosion.timeChangeFrame < game.time.now){
        			explosion.currenFrame++
        			if(explosion.currenFrame <= 5){
        				explosion.loadTexture("atlas.game","explosion_"+explosion.currenFrame)
        			}
        			else{
        				explosion.visible = false
        			}
        		}
        	}
        }
    }


    function blinkJewel(){

        if(jewel.alpha ==1){
            jewel.alpha = 0
        }
        else{
            jewel.blink ++
            jewel.alpha = 1
            if(jewel.blink>=BLINK_TIMES){

                jewel.blink = 0
                createJewel(game.rnd.integerInRange(100,game.world.width-100),game.rnd.integerInRange(100,game.world.height-100))
                return
            }
        }
        setTimeout(blinkJewel,TIME_BLINK)
    }

    function getWarning(_y, side){
        for(var i =0 ;i < warningGroup.length; i++){
            if(!warningGroup.children[i].visible){
                var warning = warningGroup.children[i]
                warning.visible = true
                if(side == 0){
                    warning.x = 50
                    warning.scale.setTo(-1,1)
                }
                else{
                    warning.x = game.world.width - 50
                    warning.scale.setTo(1,1)
                }
                warning.y = _y
                warning.timeBlinlk = game.time.now + MISILE_TIME_BLINK
                warning.blink = 0
                return warning
            }
        }

        var x
        var scaleSide
        if(side == 0){
            x = 50
            scaleSide = -1
        }
        else{
            x = game.world.width - 50
            scaleSide = 1
        }

        var warning = warningGroup.create(x,_y,"atlas.game","warning")
        warning.anchor.setTo(0.5)
        warning.scale.setTo(scaleSide,1)
        warning.timeBlinlk = game.time.now + MISILE_TIME_BLINK
        warning.blink = 0
        return warning
    }

    function getMisile(_y, side){

        for(var i =0 ;i < misileGroup.length; i++){
            if(!misileGroup.children[i].visible){
                var misile = misileGroup.children[i]
                misile.visible = true
                
                if(side == 0){
                    misile.x = -100
                    misile.scale.setTo(1,1)
                }
                else{
                    misile.x = game.world.width + 100
                    misile.scale.setTo(-1,1)
                }

                misile.y = _y
                misile.deltaSmoke = 0
                misile.active = false
                return misile
            }
            
        }

        var misile = misileGroup.create(0,_y,"atlas.game","misile")
        misile.anchor.setTo(0.5)
        misile.deltaSmoke = 0
        misile.active = false
        if(side == 0){
            misile.x = -100
            misile.scale.setTo(1,1)
        }
        else{
            misile.x = game.world.width + 100
            misile.scale.setTo(-1,1)
        }
        return misile

    }

    function getSmoke(_x,_y){

        for(var i =0; i < smokeGroup.length; i++){
            if(!smokeGroup.children[i].visible){
                var smoke = smokeGroup.children[i]
                smoke.visible = true
                smoke.x = _x
                smoke.y = _y
                smoke.scale.setTo(0.2)
                smoke.alpha = 1
                smoke.angle = game.rnd.integerInRange(0,360)
                smoke.rotationDirection = game.rnd.integerInRange(0,1)
                if(smoke.rotationDirection == 0){
                    smoke.rotationDirection = -1
                }
                return
            }
        }

        var smoke = smokeGroup.create(_x,_y,"atlas.game","smoke")
        smoke.anchor.setTo(0.5)
        smoke.angle = game.rnd.integerInRange(0,360)
        smoke.rotationDirection = game.rnd.integerInRange(0,1)
        if(smoke.rotationDirection == 0){
            smoke.rotationDirection = -1
        }
        smoke.scale.setTo(0.2)
        smoke.alpha = 1

    }

    function getSkull(_x,_y){
        for(var i =0; i < skullGroup.length; i++){
            if(!skullGroup.children[i].visible){
                var skull = skullGroup.children[i]
                skull.visible = true
                skull.x = _x
                skull.y = _y
                skull.scale.setTo(0)
                skull.timeIdle = game.time.now + BOMB_IDLE_TIME
                skull.scaleDirection = 1
                skull.haveBomb = false
                return
            }
        }

        var skull = skullGroup.create(_x,_y,"atlas.game","skull")
        skull.anchor.setTo(0.5)
        skull.scale.setTo(0)
        skull.timeIdle = game.time.now + BOMB_IDLE_TIME
        skull.scaleDirection = 1
        skull.haveBomb = false


    }

    function getBomb(_x,_y){

        for(var i =0; i < bombGroup.length; i++){
            if(!bombGroup.children[i].visible){
                var bomb = bombGroup.children[i]
                bomb.visible = true
                bomb.x = _x
                bomb.y = _y
                bomb.scale.setTo(0)
                bomb.timeIdle = game.time.now + BOMB_IDLE_TIME
                bomb.scaleDirection = 1
                bomb.bombState = 1
                bomb.loadTexture("atlas.game","bomb_1")
                return
            }
        }

        var bomb = bombGroup.create(_x,_y,"atlas.game","bomb")
        bomb.anchor.setTo(0.5)
        bomb.scale.setTo(0)
        bomb.timeIdle = game.time.now + BOMB_IDLE_TIME
        bomb.scaleDirection = 1
        bomb.bombState = 1
        bomb.loadTexture("atlas.game","bomb_1")
    }

    function getExplosion(_x,_y){
        sound.play("bomb")
        for(var i =0; i < explosionGroup.length; i++){
            if(!explosionGroup.children[i].visible){
                var explosion = explosionGroup.children[i]
                explosion.visible = true
                explosion.x=_x
                explosion.y=_y
                explosion.currenFrame = 1
                explosion.loadTexture("atlas.game","explosion_1")
                explosion.timeChangeFrame = game.time.now + TIME_EXPLOSION_CHANGE_FRAME

                return
            }
        }

        var explosion = explosionGroup.create(_x,_y,"atlas.game","explosion_1")
        explosion.anchor.setTo(0.5)
        explosion.currenFrame = 1
        explosion.timeChangeFrame = game.time.now + TIME_EXPLOSION_CHANGE_FRAME

    }

    function getLine(_x,_y,_angle){
    	for(var i=0; i < lineGroup.length; i++){
    		if(!lineGroup.children[i].visible){
    			lineGroup.children[i].visible = true
    			lineGroup.children[i].x = _x
    			lineGroup.children[i].y = _y
    			lineGroup.children[i].angle = _angle
    			lineGroup.children[i].timeIdle = game.time.now + LINE_TIME_IDLE
    			lineGroup.children[i].alpha = 0.6
    			return
    		}
    	}

    	var line = game.add.graphics()
    	line.beginFill(0x17223e)
    	line.drawRect(-20,-6,10,12)
    	line.drawRect(15,-6,10,12)
    	line.endFill()
    	lineGroup.add(line)
    	line.x = _x
    	line.y = _y
    	line.angle = _angle
    	line.timeIdle = game.time.now + LINE_TIME_IDLE
    	line.alpha = 0.6
    }

    

    function createJewel(_x,_y){

        jewel.blink = 0
        jewel.alpha = 1
        jewel.x = _x
        jewel.y = _y
        jewel.timeBlink = game.time.now + timeGetJewel
        jewel.inBlink = false

        if(timeGetJewel > MIN_TIME_GET_JEWEL){
            timeGetJewel-=DELTA_TIME_GET_JEWEL
        }


    }

    function getJewel(){
        sound.play("pop")
        addPoint(1,{x:game.world.width-80,y:80})
        createJewel(game.rnd.integerInRange(100,game.world.width-100),game.rnd.integerInRange(100,game.world.height-100))
    
        if(pointsBar.number == 1){
            setTimeout(setBomb,timeGetBomb)
        }
        else if(pointsBar.number == 3){
            setTimeout(setMisile,timeGetMisile)
        }

        if(pointsBar.number>1){
            if(timeGetBomb>MIN_TIME_BOMB){
                timeGetBomb-=DELTA_TIME_BOMB
            }
        }

        if(pointsBar.number>3){
            if(timeGetMisile>MIN_TIME_MISILE){
                timeGetMisile-=DELTA_TIME_MISILE
            }
        }

    }

    function setBomb(){
        if(!gameActive){
            return
        }
        if(!gameInPause){
            getSkull(game.rnd.integerInRange(100,game.world.width-100),game.rnd.integerInRange(100,game.world.height-100))
        }
        setTimeout(setBomb,timeGetBomb)
    }

    function setMisile(){
        if(!gameActive){
            return
        }
        if(!gameInPause){
            var _y = game.rnd.integerInRange(100,game.world.height-100)
            var side = game.rnd.integerInRange(0,1)
            var warning = getWarning(_y,side)
            var misile = getMisile(_y,side)
            warning.misile = misile
        }

        setTimeout(setMisile,timeGetMisile)
    }
    
    function checkOverlap(spriteA, spriteB) {

        if(spriteA.worldTransform==null || spriteB.worldTransform==null){
            return false
        }

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB);

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

    function createBackground(){

        var background = game.add.tileSprite(0,0,game.world.width,game.world.height,"backgroundTile")
        sceneGroup.add(background)

        var marco = game.add.tileSprite(0,-30,game.world.width,64,"marco")
        sceneGroup.add(marco)

        marco = game.add.tileSprite(game.world.width,game.world.height+30,game.world.width,64,"marco")
        sceneGroup.add(marco)
        marco.angle = 180

        marco = game.add.tileSprite(-30,game.world.height,game.world.height,64,"marco")
        sceneGroup.add(marco)
        marco.angle = -90

        marco = game.add.tileSprite(game.world.width+30,0,game.world.height,64,"marco")
        sceneGroup.add(marco)
        marco.angle = 90

        lineGroup = game.add.group()
        sceneGroup.add(lineGroup)

        skullGroup = game.add.group()
        sceneGroup.add(skullGroup)

        jewel = sceneGroup.create(0,0,"atlas.game","jewel")
        jewel.anchor.setTo(0.5)
        jewel.scale.setTo(0.8)

        jewel.jewelSon = sceneGroup.create(0,0,"atlas.game","jewel")
        jewel.jewelSon.anchor.setTo(0.5)
        jewel.jewelSon.scale.setTo(0.2)
        jewel.jewelSon.alpha = 0
        jewel.addChild(jewel.jewelSon)

        createJewel(game.world.centerX,200)

        bombGroup = game.add.group()
        sceneGroup.add(bombGroup)

        warningGroup = game.add.group()
        sceneGroup.add(warningGroup)

        smokeGroup = game.add.group()
        sceneGroup.add(smokeGroup)

        misileGroup = game.add.group()
        sceneGroup.add(misileGroup)

        explosionGroup = game.add.group()
        sceneGroup.add(explosionGroup)

    }

    
    function createPlayer(){
        carPlayer = sceneGroup.create(game.world.centerX,game.world.height-200,"atlas.game","carPlayer")
        carPlayer.anchor.setTo(0.5)
        carPlayer.scale.setTo(0.5)

        carPlayer.tire1 = sceneGroup.create(40,-40,"atlas.game","tire_1")
        carPlayer.tire1.anchor.setTo(0.5)
        carPlayer.addChild(carPlayer.tire1)

        carPlayer.tire2 = sceneGroup.create(-40,-40,"atlas.game","tire_1")
        carPlayer.tire2.anchor.setTo(0.5)
        carPlayer.addChild(carPlayer.tire2)

        carPlayer.tire3 = sceneGroup.create(40,30,"atlas.game","tire_1")
        carPlayer.tire3.anchor.setTo(0.5)
        carPlayer.addChild(carPlayer.tire3)

        carPlayer.tire4 = sceneGroup.create(-40,30,"atlas.game","tire_1")
        carPlayer.tire4.anchor.setTo(0.5)
        carPlayer.addChild(carPlayer.tire4)


    }

    function create(){
    	
        sceneGroup = game.add.group()

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()
        createPlayer()

        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('timberman')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
			
			if(amazing.getMinigameId()){
				marioSong.pause()
			}

	        game.sound.mute = true
            gameInPause = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			
	        game.sound.mute = false
            gameInPause = false
	    }, this);


        animateScene()

        loadSounds()

        createObjects()


        createPointsBar()
        createHearts()

        

        leftArrow = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rigthArrow = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        

    }

    
    return {
        assets: assets,
        name: "speedUp",
        create: create,
        preload: preload,
        update: update
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
