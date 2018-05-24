
var soundsPath = "../../shared/minigames/sounds/"

var oceanQuest = function(){
    
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
                name: "atlas.oceanQuest",
                json: "images/oceanQuest/atlas.json",
                image: "images/oceanQuest/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/oceanQuest/gametuto.png"
			},
            {
				name:'audioOn',
				file:"../../shared/minigames/images/buttons/audio_on.png"
			},
            {
				name:'audioOff',
				file:"../../shared/minigames/images/buttons/audio_off.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "evilLaugh",
				file: soundsPath + "evilLaugh.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "robotWin.mp3"},
            {	name: "swordSmash",
				file: soundsPath + "swordSmash.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/bubble_fishgame.mp3'
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
            }
        ],
        spines:[
			{
				name:"fish",
				file:"images/spines/fish/fish.json"
			},
            {
				name:"octopus",
				file:"images/spines/octopus/octopus.json"
			},
            {
				name:"piranha",
				file:"images/spines/piranha/piranha.json"
			},
            {
				name:"seadog",
				file:"images/spines/seadog/seadog.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 210
    var tutoGroup
    var pointsBar
    var heartsGroup
    var gameSong
    var coin
    var hand
    var cursors
    var player
    var monstersGroup
    var radarGroup
    var click
    var keyState = {up: false, down: false, right: false, left: false}
    var mapPositions = [{spawnX: 90, spawnY: 970, targetX: 250, targetY: 600},
                        {spawnX: 90, spawnY: 970, targetX: 330, targetY: 860},
                        {spawnX: 630, spawnY: 400, targetX: 500, targetY: 600},
                        {spawnX: 630, spawnY: 400, targetX: 700, targetY: 600},
                        {spawnX: 725, spawnY: 990, targetX: 515, targetY: 783},
                        {spawnX: 725, spawnY: 990, targetX: 883, targetY: 851},
                        {spawnX: 1640, spawnY: 81, targetX: 1320, targetY: 250},
                        {spawnX: 1640, spawnY: 530, targetX: 1404, targetY: 540},
                        {spawnX: 1640, spawnY: 530, targetX: 1500, targetY: 800},
                        {spawnX: 1100, spawnY: 960, targetX: 1100, targetY: 660},
                        {spawnX: 1100, spawnY: 960, targetX: 1250, targetY: 860},
                        {spawnX: 680, spawnY: 50, targetX: 1070, targetY: 230}]
    var monsterAlive
    var rand
    var MONSTER_SPEED
    var PLAYER_SPEED
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        cursors = game.input.keyboard.createCursorKeys()
        click = false
        monsterAlive = false
        rand = -1
        MONSTER_SPEED = 10000
        PLAYER_SPEED = 300
        
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

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width 
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.oceanQuest','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsBar.add(pointsText)
        pointsBar.text = pointsText
        pointsBar.number = 0
        
        pointsBar.setAll("fixedToCamera", true)
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        heartsGroup.x = 10
        sceneGroup.add(heartsGroup)

        var heartImg = heartsGroup.create(0,0,'atlas.oceanQuest','life_box')
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = 10 + heartImg.width * 0.45
        pointsText.y = heartImg.height * 0.15
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        heartsGroup.text = pointsText
        
        heartsGroup.setAll("fixedToCamera", true)
    }
    
    function createSoundBtn(){
        
        var soundBtn = game.add.group()
		soundBtn.x = game.world.width - 215
		soundBtn.y = 30
		//soundBtn.scale.setTo(0.45, 0.45)
		sceneGroup.add(soundBtn)

		var buttonImage = soundBtn.create(0, 0, 'audioOff')
		buttonImage.anchor.setTo(0.5, 0.5)
		buttonImage.scale.setTo(0.45)

		var buttonImage = soundBtn.create(0, 0, 'audioOn')
		buttonImage.pressed = false
		buttonImage.inputEnabled = true
		buttonImage.events.onInputDown.add(inputButton)
		buttonImage.InputDown = inputButton
		buttonImage.anchor.setTo(0.5, 0.5)
        buttonImage.scale.setTo(0.45)
		buttonImage.input.priorityID = 1
        
        soundBtn.setAll("fixedToCamera", true)
    }
    
    function inputButton(btn) {

		btn.pressed = !btn.pressed

		btn.parent.children[0].alpha = btn.pressed
		btn.parent.children[1].alpha = !btn.pressed

		if (btn.pressed) {
				gameSong.stop()
		} else {
				gameSong.play()
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
    }
    
    function missPoint(obj){
        
        sound.play("wrong")
        
        particleWrong.x = obj.centerX 
        particleWrong.y = obj.centerY
        particleWrong.start(true, 1200, null, 10)
		        
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
    
    function stopGame(){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        player.body.setZeroVelocity()
        gameActive = false
        gameSong.stop()
        		
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
        
		tweenScene.onComplete.add(function(){
            game.world.setBounds(0, 0, 540, 960)
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        for(var i = 0; i < 4; i++)
            game.load.physics("ph_conti" + i, "images/physics/conti" + i + ".json");
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        game.world.setBounds(0, 0, 1700, 1300)
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
      
        sceneGroup.add(game.add.tileSprite(0, 0, 1700, 1300, "atlas.oceanQuest", "tile"))
        
        var contiGroup = game.add.group()
        sceneGroup.add(contiGroup)
        
        for(var i = 0; i < 4; i++){
            var conti = contiGroup.create(360, game.world.centerY + 60, "atlas.oceanQuest", "conti" + i)
        }
        
        contiGroup.children[1].x = 800
        contiGroup.children[1].y = game.world.height + 100
        
        contiGroup.children[2].x = 1460
        contiGroup.children[2].y = game.world.height - 100
        
        contiGroup.children[3].x = 1100
        contiGroup.children[3].y -= 50
       
        for(var i = 0; i < 4; i++){
            game.physics.p2.enable(contiGroup.children[i])
            contiGroup.children[i].body.static = true
            contiGroup.children[i].body.clearShapes()
            contiGroup.children[i].body.loadPolygon("ph_conti" + i, "conti" + i)
        }
        
        var graphics = game.add.graphics(0, game.world.height + 155)
        graphics.lineStyle(1, 0xff0000, 0)
        graphics.drawRect(0, 0, 3400, 10)
        game.physics.p2.enable(graphics)
        graphics.body.static = true
        sceneGroup.add(graphics)
    }

	function update(){
        
        if(gameActive){
            player.body.setZeroVelocity()

            if(cursors.up.isDown){
                player.body.moveUp(PLAYER_SPEED)
                
                if(!keyState.up){
                    keyState.up = true
                    changeAnim("run")
                }
            }
            else{
                if(keyState.up){
                    keyState.up = false
                    changeAnim("idle")
                }
            }
            
            
            if(cursors.down.isDown){
                player.body.moveDown(PLAYER_SPEED)
                
                if(!keyState.down){
                    keyState.down = true
                    changeAnim("run")
                }
            }
            else{
                if(keyState.down){
                    keyState.down = false
                    changeAnim("idle")
                }
            }

            if(cursors.left.isDown){
                player.body.velocity.x = -PLAYER_SPEED
                player.anim.scale.setTo(0.5)
                
                if(!keyState.left){
                    keyState.left = true
                    changeAnim("run")
                }
            }
            else{
                if(keyState.left){
                    keyState.left = false
                    changeAnim("idle")
                }
            }
            
            if(cursors.right.isDown){
                player.body.moveRight(PLAYER_SPEED)
                player.anim.scale.setTo(-0.5, 0.5)
                
                if(!keyState.right){
                    keyState.right = true
                    changeAnim("run")
                }
            }
            else{
                if(keyState.right){
                    keyState.right = false
                    changeAnim("idle")
                }
            }   

            if(click){
                game.physics.arcade.moveToPointer(player, 400)

                if(Phaser.Rectangle.contains(player.getBounds(), game.input.x, game.input.y))
                {
                    player.body.setZeroVelocity()
                }
            }
            
            if(monsterAlive){
                for(var i = 0; i < monstersGroup.length; i++){
                    if(checkOverlap(player, monstersGroup.children[i]) && monstersGroup.children[i].attacking){
                        catchMonster(monstersGroup.children[i], true)
                    }
                }
            }
        }
    }
    
    function clickDown(){
        
        if(gameActive){
            click = true
            
            if(game.input.mousePointer.x - player.anim.worldPosition.x > 0){
                player.anim.scale.setTo(-0.5, 0.5)
            }
            else{
                player.anim.scale.setTo(0.5)
            }
            player.anim.setAnimationByName(0, "run", true)
        }
    }
    
    function clickUp(){
        click = false
        if(gameActive)
            player.anim.setAnimationByName(0, "idle", true)
    }
    
    function changeAnim(animation){
        
        player.anim.setAnimationByName(0, animation, true)
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.oceanQuest',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
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
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number > 10 && pointsBar.number % 2 === 0){
                       MONSTER_SPEED > 2000 ? MONSTER_SPEED -= 1000 : MONSTER_SPEED = 1500
                       PLAYER_SPEED < 500 ? PLAYER_SPEED += 25 : PLAYER_SPEED = 510
                   }
               })
           })
        })
    }
    
    function createPlayer(){
        
        player = sceneGroup.create(game.world.centerX - 250, game.world.centerY + 50, "atlas.oceanQuest", "star")
        game.physics.p2.enable(player)
        player.body.setCircle(50)
        player.body.fixedRotation = true
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
        
        var anim = game.add.spine(0, 40, "fish")
        anim.setAnimationByName(0, "idle", true)
        anim.setSkinByName("normal")
        anim.scale.setTo(0.5)
        player.addChild(anim)
        player.anim = anim
    }
    
    function createMonsters(){
        
        monstersGroup = game.add.group()
        sceneGroup.add(monstersGroup)
        
        var aux = 1
        
        for(var i = 1; i < 7; i++){
            var anim = game.add.spine(-100, -100, assets.spines[aux].name)
            anim.setAnimationByName(0, "idle", true)
            anim.setSkinByName("normal")
            anim.scale.setTo(0)
            anim.attacking = false
            monstersGroup.add(anim)
            
            var box = game.add.graphics(0, 0)
            box.beginFill(0x00aaff)
            box.drawRect(-150, -190, 300, 200)
            box.alpha = 0
            box.inputEnabled = true
            anim.addChild(box)
            anim.box = box

            aux++
            
            if(i === 3){
                aux = 1
            }
        }
        
        monstersGroup.children[0].box.y -= 20
        monstersGroup.children[0].box.height += 70
    }
    
    function createRadar(){
        
        radarGroup = game.add.group()
        sceneGroup.add(radarGroup)
        
        var screen = radarGroup.create(0, game.world.height, "atlas.oceanQuest", "picScreen")
        screen.anchor.setTo(0,1)
        
        var tomiko = radarGroup.create(screen.centerX, screen.centerY, "atlas.oceanQuest", "idle")
        tomiko.anchor.setTo(0.5)
        tomiko.scale.setTo(0.9)
        radarGroup.tomiko = tomiko
        
        var map = radarGroup.create(game.world.width, game.world.height, "atlas.oceanQuest", "map")
        map.anchor.setTo(1)
        radarGroup.map = map
        
        var dot = game.add.sprite(0, 0, "atlas.oceanQuest", "enemyPos")
        dot.anchor.setTo(0.5)
        dot.alpha = 0
        map.addChild(dot)
        map.dot = dot
        
        var miniMap = [{x: -290, y: -60},
                       {x: -290, y: -60},
                       {x: -215, y: -130},
                       {x: -215, y: -130},
                       {x: -215, y: -45},
                       {x: -215, y: -45},
                       {x: -60, y: -150},
                       {x: -60, y: -100},
                       {x: -60, y: -100},
                       {x: -130, y: -45},
                       {x: -130, y: -45},
                       {x: -210, y: -155}]
        radarGroup.miniMap = miniMap
        
        radarGroup.setAll("fixedToCamera", true)
        
        game.input.onDown.add(clickDown,this)
		game.input.onUp.add(clickUp,this)
    }
    
    function catchMonster(monst, ans){
        
        if(gameActive){
            monst.attacking = false
            monsterAlive = false
            
            if(ans){
                monst.setAnimationByName(0, "lose", false)
                monst.attackMove.stop()
                addCoin(player)
                changeTomiko(true, "happy")
                sound.play("rightChoice")
            }
            else{
                monst.setAnimationByName(0, "idle", true)
                missPoint(player)
                changeTomiko(true, "sad")
                sound.play("evilLaugh")
            }
            
            var hide = game.add.tween(monst.scale).to({x:0, y:0},400,Phaser.Easing.linear,true, 1400).onComplete.add(function(){
                monst.x = -200
                
                if(lives !== 0)
                    initGame()
            })
        }
    }
    
    function changeTomiko(yes, image){
        
        if(yes){
            radarGroup.tomiko.loadTexture("atlas.oceanQuest", image)
            game.time.events.add(1000, function(){
                changeTomiko(false, "idle")
            })
        }
        else{
            radarGroup.tomiko.loadTexture("atlas.oceanQuest", image)
        }
    } 
    
    function initGame(){
        
        gameActive = true
        game.time.events.add(300, releaseMonster)       
    }
    
    function releaseMonster(){
        
        rand = getRand()
        
        var monster = getMonster()
        
        if(monster){
            monster.x = mapPositions[rand].spawnX 
            monster.y = mapPositions[rand].spawnY
            
            radarGroup.map.dot.alpha = 1
            radarGroup.map.dot.x = radarGroup.miniMap[rand].x 
            radarGroup.map.dot.y = radarGroup.miniMap[rand].y 
            
            sound.play("swordSmash")
            var radarSignal = game.add.tween(radarGroup.map.dot.scale).from({x:7, y:7},500,Phaser.Easing.linear,true)
            
            monster.setAnimationByName(0, "idle", true)
            monster.attackMove = game.add.tween(monster).to({x: mapPositions[rand].targetX, y:mapPositions[rand].targetY}, MONSTER_SPEED, Phaser.Easing.linear, false, MONSTER_SPEED * 0.05)
            monster.attackMove.onComplete.add(function(){
                catchMonster(monster, false)
            })
            
            var dir 
            mapPositions[rand].spawnX - mapPositions[rand].targetX > 0 ? dir = 0.5 : dir = -0.5
            
            var rise = game.add.tween(monster.scale).to({x:dir, y:0.5},300,Phaser.Easing.linear,false)
            rise.onComplete.add(function(){
                monster.setAnimationByName(0, "run", true)
                monster.attacking = true
                monsterAlive = true
            })
            
            rise.chain(monster.attackMove)
            radarSignal.chain(rise)
        }
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, mapPositions.length - 1)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function getMonster(){
        
        var opt = game.rnd.integerInRange(0, monstersGroup.length - 1)
        
        if(monstersGroup.children[opt].attacking)
            return getMonster()
        else
            return monstersGroup.children[opt]
    }
	
	return {
		
		assets: assets,
		name: "oceanQuest",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS)
			sceneGroup = game.add.group()
			createBackground()
            initialize()            			
            
            gameSong = sound.play("gameSong", {loop:true, volume:0.5})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
			            
			
            createMonsters()
            createPlayer()
            createPointsBar()
			createHearts()
            createSoundBtn()
            createRadar()
            initCoin()
            createParticles()
			
            //buttons.getButton(gameSong, sceneGroup)
            
            createTutorial()
            animateScene()
		}
	}
}()