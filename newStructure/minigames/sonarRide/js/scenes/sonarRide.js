
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var sonarRide = function(){
    
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
                name: "atlas.sonarRide",
                json: "images/sonarRide/atlas.json",
                image: "images/sonarRide/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/sonarRide/gametuto.png"
			},
            {
				name:'back',
				file:"images/sonarRide/background.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "moleHit",
				file: soundsPath + "moleHit.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'sonarSong',
                file: soundsPath + 'songs/jungle_fun.mp3'
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
        spines:[
			{
				name:"bat",
				file:"images/spines/bat.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 167
    var tutoGroup
    var sonarSong
    var coin
    var bat 
    var rocksGroup
    var speed
    var delay
    var click
    var counterLap
    var gameCoin
    var rand
    var canThrow
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        speed = 200
        delay = 1800
        click = false
        canThrow = false
        counterLap = 0
        
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
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.sonarRide','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.sonarRide','life_box')

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
        sonarSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var back = sceneGroup.create(-5, 0, 'back')
        back.width = game.world.width + 50
        back.height = game.world.height + 10

        var cave = sceneGroup.create(0, 0, 'atlas.sonarRide', 'cave')
        cave.width = game.world.width
    }

	function update(){
            
        if(gameActive){
            
            bat.spine.x = bat.collider.x

            if(click){
                
                bat.movil.x = game.input.x
            }
            
            game.physics.arcade.moveToObject(bat.collider, bat.movil, bat.speed)

            if (Phaser.Rectangle.intersects(bat.collider, bat.movil))
            {
                bat.movil.body.velocity.setTo(0, 0)
                bat.collider.body.velocity.setTo(0, 0)
            }
        
            game.physics.arcade.overlap(bat.collider, rocksGroup, batVSrock, null, this)
            game.physics.arcade.overlap(bat.collider, gameCoin, grabCoin, null, this)
        }
    }
    
    function batVSrock(baticol, rocks){
        
        if(!rocks.crash){
            canThrow = false
            sound.play('moleHit')
           
            bat.movil.body.velocity.setTo(0, 0)
            bat.collider.body.velocity.setTo(0, 0)
            
            bat.spine.setAnimationByName(0, "LOSE", false)
            bat.spine.addAnimationByName(0, "LOSESTILL", true)
            game.add.tween(bat.spine).to({x: game.world.centerX}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                bat.movil.x = bat.spine.x
                bat.collider.x = bat.spine.x
                missPoint()
            })
            
            rocks.crash = true
            rocksGroup.setAll('body.velocity.y', 0)
            
            for(var f = 0; f < rocksGroup.length; f++){
                
                var rock = rocksGroup.children[f]
                
                if(rock){
                    
                    if(rock.y < rocks.y){
                        rock.crash = true
                    }

                    game.add.tween(rock).to({y: rock.y + 300},500,Phaser.Easing.Cubic.Out,true)
                }
            }
            
            if(gameCoin.visible){
                gameCoin.body.velocity.y = 0
                game.add.tween(gameCoin).to({y: gameCoin.y + 300},500,Phaser.Easing.Cubic.Out,true)
            }
            
            game.time.events.add(2000,function(){
                if(lives !== 0){
                    bat.spine.setAnimationByName(0, "IDLE", true)
                    game.time.events.add(delay - 1900,function(){
                        rocksGroup.setAll('body.velocity.y', -speed)
                        if(gameCoin.visible)
                            gameCoin.body.velocity.y = -speed
                        canThrow = true
                        rockThrow()
                    },this)
                }
            },this)
        }
    }
    
    function grabCoin(baticol, coin){
        
        if(!coin.crash){
            coin.crash = true
            coin.kill()
            addCoin(coin)
            
            if(pointsBar.number !== 0 && pointsBar.number % 3 === 0){
                canThrow = false
                speed += 100
                delay -= 200
                bat.speed += 200
                game.time.events.add(1000,function(){
                    canThrow = true
                    twoRocks()
                },this)
            }
        }
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
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.sonarRide',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
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

				particle.makeParticles('atlas.sonarRide',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.sonarRide','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.sonarRide','smoke');
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
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(objectBorn){
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function batmanBeigns(){
        
        bat = game.add.group()
        bat.speed = 800
        sceneGroup.add(bat)
        
        var spine = game.add.spine(game.world.centerX, 260, "bat")
        spine.setAnimationByName(0, "IDLE", true)
        spine.setSkinByName("normal")
        bat.add(spine)
        bat.spine = spine
        
        var movil = bat.create(game.world.centerX, 270, 'atlas.sonarRide', 'star')
        movil.anchor.setTo(0.5)
        movil.alpha = 0
        game.physics.enable(movil, Phaser.Physics.ARCADE)
        bat.movil = movil
        
        var collider = bat.create(game.world.centerX, 200, 'atlas.sonarRide', 'smoke')
        collider.anchor.setTo(0.5)
        collider.alpha = 0
        collider.scale.setTo(0.5)
        game.physics.arcade.enable(collider)
        bat.collider = collider
        
        game.input.onDown.add(clickDown,this)
		game.input.onUp.add(clickUp,this)
    }
    
    function clickDown(){
        
        if(gameActive){
            click = true
            sound.play('pop')
        }
    }
    
    function clickUp(){
        
        click = false
    }
    
    function rockAndRoll(){
        
        rocksGroup = game.add.group()
        rocksGroup.enableBody = true
        rocksGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(rocksGroup)
        
        for(var i = 0; i < 10; i++){
            
            var rock = rocksGroup.create(0, 0, 'atlas.sonarRide', 'rock')
            rock.anchor.setTo(1,0)
            rock.exists = false
            rock.visible = false
            rock.checkWorldBounds = true
            rock.events.onOutOfBounds.add(resetObj, this)
            rock.crash = false
        }
    }
    
    function resetObj(obj){
        obj.kill()
    }
    
    function rockThrow(){
        
        game.time.events.add(delay,function(){

            counterLap++
            
            var rocky = rocksGroup.getFirstExists(false)
            rand = getRand()
            
            if (rocky && canThrow)
            {
                rocky.scale.setTo(1.3)

                if(rand === 0){
                    rocky.scale.setTo(-1.3,1.3)
                    rocky.reset(-50, game.world.height)
                }
                else{
                    rocky.reset(game.world.width + 50, game.world.height)
                }
                rocky.body.velocity.y = -speed
                rocky.crash = false
                
                if(canThrow){
                    if(counterLap % 5 == 0){
                        twoRocks()
                    }
                    else{
                        rockThrow()
                    }
                }
            }
            
        }, this)
    }
    
    function twoRocks(){
        
        counterLap = 0
        
        game.time.events.add(delay,function(){
            
            for(var i = 0; i < 2; i++){
                
                var rocky = rocksGroup.getFirstExists(false)
                
                if (rocky && canThrow)
                {
                    rocky.scale.setTo(1)

                    if(i === 0){
                        rocky.scale.setTo(-1,1)
                        rocky.reset(-50, game.world.height)
                    }
                    else{
                        rocky.reset(game.world.width + 50, game.world.height)
                    }
                    rocky.body.velocity.y = -speed
                    rocky.crash = false
                }
            }
            throwCoin()
            
            if(canThrow){
                rockThrow()
            }
            
        }, this)
    }
    
    function theCoin(){
        
        gameCoin = sceneGroup.create(0, 0, 'atlas.sonarRide', 'coins')
        gameCoin.anchor.setTo(0.5, 0)
        gameCoin.exists = false
        gameCoin.visible = false
        gameCoin.checkWorldBounds = true;
        gameCoin.events.onOutOfBounds.add(resetObj, this)
        gameCoin.crash = false
        game.physics.arcade.enable(gameCoin)
        gameCoin.body.enable = true
    }
    
    function throwCoin(){
         
        if(canThrow){
            gameCoin.reset(game.world.centerX, game.world.height)
            gameCoin.body.velocity.y = -speed
            gameCoin.crash = false
        }
    }
    
    function initGame(){
        
        canThrow = true
        gameActive = true
        rockThrow()
          
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 1)
        if(x === rand)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "sonarRide",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
            
            initialize()
            sonarSong = sound.play("sonarSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
            rockAndRoll()
			createPointsBar()
			createHearts()
            batmanBeigns()
            theCoin()
            initCoin()
            createParticles()
			
			buttons.getButton(sonarSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()