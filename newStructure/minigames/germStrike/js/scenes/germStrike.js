
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var germStrike = function(){
    
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
                name: "atlas.germStrike",
                json: "images/germStrike/atlas.json",
                image: "images/germStrike/atlas.png",
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
				file:"images/germStrike/tutorial_image_%input.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "shoot",
				file: soundsPath + "laser2.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "space",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "bomb",
				file: soundsPath + "bomb.mp3"},
            {	name: "falling",
				file: soundsPath + "falling.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'strikeSong',
                file: soundsPath + 'songs/technology_action.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            },
            {   name: "virus0",
                file: "images/spines/virus0.png",
                width: 313,
                height: 206,
                frames: 24
            },
            {   name: "virus1",
                file: "images/spines/virus1.png",
                width: 369,
                height: 293,
                frames: 20 //fps : 30
            },
            {   name: "virus2",
                file: "images/spines/virus2.png",
                width: 339,
                height: 370,
                frames: 31 //fps 30
            },
            {   name: "virus3",
                file: "images/spines/virus0.png",
                width: 313,
                height: 206,
                frames: 24
            }
        ],
        spines:[
			{
				name:"spaceship",
				file:"images/spines/spaceship/spaceship.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 172
    var tutoGroup
    var strikeSong
    var coin
    var hand
    var tile 
    var ship
    var bulletsGroup
    var monstersGroup
    var click
    var shooter 
    var mark
    var bulletTime
    var enemyTime
    var counterTime
    var speed
    var rand
    var timeToChange
    var numEnemies
    var enemyKills
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        click = false
        shooter = 3
        bulletTime = 0
        counterTime = 0
        rand = -1
        speed = 1
        timeToChange = 10000
        enemyTime = 2000
        numEnemies = 1
        enemyKills = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.germStrike','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.germStrike','life_box')

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
        strikeSong.stop()
        		
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
        
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.germStrike", "tile")
        sceneGroup.add(tile)
    }

	function update(){
        
        if(gameActive){
            
            tile.tilePosition.y += speed
            
            if(click){
                ship.movil.x = game.input.x
                ship.anim.x = ship.movil.x
                fireBullet()
            }
            monstersAttack()
            
            for(var i = 0; i < monstersGroup.length; i++){
                game.physics.arcade.overlap(bulletsGroup, monstersGroup.children[i], bulletVSmonster, null, this)
                game.physics.arcade.overlap(ship.movil, monstersGroup.children[i], shipVSmonster, null, this)
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
        particle.makeParticles('atlas.germStrike',key);
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

				particle.makeParticles('atlas.germStrike',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.germStrike','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.germStrike','smoke');
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
        
        /*hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0*/
    }

    function addCoin(){
        
        coin.x = ship.movil.centerX
        coin.y = ship.movil.centerY
        var time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function millenniumFalcon(){
        
        ship = game.add.group()
        sceneGroup.add(ship)
        
        var movil = ship.create(game.world.centerX, game.world.height - 200, 'atlas.germStrike', 'star')
        movil.anchor.setTo(0.5)
        movil.scale.setTo(2)
        movil.alpha = 0
        movil.crashed = false
        game.physics.enable(movil, Phaser.Physics.ARCADE)
        ship.movil = movil
        
        var anim = game.add.spine(movil.centerX, movil.centerY + 40, "spaceship")
        anim.scale.setTo(0.5)
        anim.setAnimationByName(0, "IDLE", true)
        anim.setSkinByName("normal")
        ship.add(anim)
        ship.anim = anim
        
        game.input.onDown.add(clickDown,this)
        game.input.onUp.add(clickUp,this)
    }
    
    function gunsBar(){
        
        var bar = sceneGroup.create(game.world.centerX, game.world.height - 25, "atlas.germStrike", "bar")
        bar.anchor.setTo(0.5, 1)
        bar.scale.setTo(1.2)
        bar.width = game.world.width * 0.8
        
        var pivot = 0.4
        
        for(var i = 0; i < 4; i++){
            var bullet = sceneGroup.create(bar.centerX * (pivot), bar.centerY, "atlas.germStrike", "icon" + i)
            bullet.anchor.setTo(0.5)
            bullet.ammo = i
            bullet.inputEnabled = true
            bullet.events.onInputDown.add(reloadAmmo, this)
            pivot += 0.4
        }

        mark = sceneGroup.create(bullet.centerX, bullet.centerY, "atlas.germStrike", "mark")
        mark.anchor.setTo(0.5)
    }
    
    function reloadAmmo(bullet){
        
        if(gameActive){
            shooter = bullet.ammo
            mark.x = bullet.centerX
        }
    }
    
    function clickDown(){
        
        if(gameActive){
            click = true
            ship.anim.setAnimationByName(0, "SHOOT_CENTER", true)
        }
    }
    
    function clickUp(){
        
        click = false
        ship.anim.setAnimationByName(0, "IDLE", true)
        bulletTime = 0
    }
    
    function shootSomething(){
        
        bulletsGroup = game.add.group()
        bulletsGroup.enableBody = true
        bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(bulletsGroup)
        
        for(var i = 0; i < 20; i++){
            var bullet = bulletsGroup.create(0, 0, "atlas.germStrike", "bullet0")
            bullet.anchor.setTo(0.5)
            bullet.exists = false
            bullet.visible = false
            bullet.tag = -1
            bullet.checkWorldBounds = true
            bullet.events.onOutOfBounds.add(killObj, this)
        }
    }
    
    function fireBullet(){

        if (game.time.now > bulletTime)
        {
            var bullet = bulletsGroup.getFirstExists(false)

            if (bullet)
            {
                sound.play("shoot")
                bullet.reset(ship.movil.x, ship.movil.y - 60)
                bullet.loadTexture('atlas.germStrike', 'bullet' + shooter)
                bullet.body.velocity.y = -400
                bullet.tag = shooter
                bulletTime = game.time.now + 300
            }
        }
    }
    
    function killObj(obj){
        obj.kill()
    }
    
    function monstersInc(){
        
        monstersGroup = game.add.group()
        sceneGroup.add(monstersGroup)
        
        for(var i = 0; i < 4; i++){
            
            var subGroup = game.add.group()
            subGroup.enableBody = true
            subGroup.physicsBodyType = Phaser.Physics.ARCADE
            monstersGroup.add(subGroup)
            
            for(var j = 0; j < 10; j++){

                var collider = subGroup.create(0, 0, "atlas.germStrike", "smoke")//game.add.graphics(0, 0)
                //collider.beginFill(0x0000ff)
                //collider.drawRect(0, 0, 120, 80)
                collider.scale.setTo(0.5)
                collider.anchor.setTo(0.5, 1)
                collider.weakness = i
                collider.exists = false
                collider.visible = false
                collider.checkWorldBounds = true
                collider.events.onOutOfBounds.add(killObj, this)
                //subGroup.add(collider)

                var monst = game.add.sprite(collider.centerX, collider.centerY - 30, "virus" + i)
                monst.anchor.setTo(0.5)
                //monst.scale.setTo(0.7)
                monst.animations.add('idle')
                monst.animations.play('idle', 24, true)
                collider.monster = monst
                collider.addChild(monst)
            }
        }
        
        monstersGroup.children[0].setAll('monster.tint', 0xE5FF66)
        monstersGroup.children[3].setAll('monster.tint', 0xFF94BA)
        
        for(var i = 0; i < 10; i++){
            monstersGroup.children[1].children[i].monster.animations.play('idle', 30, true)
            monstersGroup.children[2].children[i].monster.animations.play('idle', 30, true)
            monstersGroup.children[1].children[i].monster.x -= 50
            monstersGroup.children[1].children[i].monster.y += 15
        }
    }
    
    function monstersAttack(){
        
        if (game.time.now > counterTime)
        {
            for(var i = 0; i < numEnemies; i++){
                var creature = monstersGroup.children[rand].getFirstExists(false)

                if (creature)
                {
                    creature.reset(game.rnd.integerInRange(100, game.world.width - 100), 0)//-71)
                    creature.body.velocity.y = speed * 100
                    counterTime = game.time.now + enemyTime
                }
            }
        }
    }
    
    function bulletVSmonster(bullet, monster){
       
        if(bullet.tag === monster.weakness){
            enemyKills++
            monster.kill()
            sound.play("bomb")
        }
        
        if(enemyKills === 5){
            enemyKills = 0
            addCoin()
            
            particleCorrect.x = monster.x 
            particleCorrect.y = monster.y
            particleCorrect.start(true, 1200, null, 6)
            
            if(pointsBar.number !== 0 && pointsBar.number % 10 === 0){
                if(speed < 3){
                    speed++
                }
                else{
                    speed++
                    enemyTime = 1500
                }
                timeToChange -= 1000
                numEnemies < 3 ? numEnemies += 1 : numEnemies = 3
            }
        }
        
        bullet.kill()
    }
    
    function shipVSmonster(ship, monster){
        
        if(!ship.crashed){
            ship.crashed = true
            gameActive = false
            
            sound.play("falling")
            game.add.tween(tile.tilePosition).to({y: tile.tilePosition.y + 200}, 1000, Phaser.Easing.linear, true)
            game.add.tween(ship.parent.anim).to({y: ship.parent.anim.y - 200}, 1000, Phaser.Easing.linear, true)
            game.add.tween(ship.parent.anim).to({angle: 360}, 1000, Phaser.Easing.linear, true)
            game.add.tween(ship.parent.anim.scale).to({x: 0, y: 0}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                
                sound.stop("falling")
                particleWrong.x = ship.parent.anim.x 
                particleWrong.y = ship.parent.anim.y
                particleWrong.start(true, 1200, null, 6)
                missPoint()
                
                if(lives !== 0)
                    restarShip()
            })
            
            for(var i = 0; i < monstersGroup.length; i++){
                    killAll(monstersGroup.children[i])
            }
        }
    }
    
    function killAll(obj){
        
         game.add.tween(obj).to({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
            obj.callAll('kill')
            obj.alpha = 1
        })
    }
    
    function restarShip(){
        
        game.time.events.add(1000,function(){
            
            ship.movil.x = game.world.centerX
            ship.anim.x = ship.movil.centerX
            ship.anim.y = ship.movil.centerY
            ship.anim.scale.setTo(0.5)
            ship.anim.angle = 0
            
            sound.play("space")
            game.add.tween(ship.anim).from({y: game.world.height + 300}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                initGame()
            })
        }, this)
    }
    
    function initGame(){
        
        changeEnemy()
        game.time.events.add(1000,function(){
            gameActive = true
            ship.movil.crashed = false
        }, this)
    }
    
    function changeEnemy(){
       
        rand = getRand()
        
        game.time.events.add(timeToChange,function(){
            if(gameActive)
                changeEnemy()
        }, this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === rand)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "germStrike",
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
            strikeSong = sound.play("strikeSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			             
            shootSomething()
            millenniumFalcon()
            monstersInc()
            gunsBar()
            createPointsBar()
			createHearts()
            initCoin()
            createParticles()
			
			buttons.getButton(strikeSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()