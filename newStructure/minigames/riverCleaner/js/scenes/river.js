
var soundsPath = "../../shared/minigames/sounds/"

var river = function(){
    
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
                name: "atlas.river",
                json: "images/river/atlas.json",
                image: "images/river/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/river/tutorial_image.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "drag",
				file: soundsPath + "drag.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
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
				name:"nao",
				file:"images/spines/nao/nao.json"
			},
            {
				name:"fish",
				file:"images/spines/fish/fish.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
    var particleCorrect, particleWrong
    var gameIndex = 100
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var rowsGroup
    var trashGroup
    var fishGroup
    var meterGroup
    var polutionGroup
    var nao
    var cursors
    var speed
    var lastObj
    var level
    var playTuto
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        cursors = game.input.keyboard.createCursorKeys()
        speed = 200
        level = 4
        playTuto = false
        
        loadSounds()
	}
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.river','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsBar.add(pointsText)
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

        var heartImg = group.create(0,0,'atlas.river','life_box')

        pivotX += heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        heartsGroup.text = pointsText
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
            trashGroup.forEachAlive(deactivateObj, this)
            fishGroup.forEachAlive(deactivateObj, this)
            stopGame()
        }
    }
    
    function stopGame(){
        
		sound.play("wrong")
		sound.play("gameLose")
		nao.setAnimationByName(0, "lose", true)
        gameActive = false
        gameSong.stop()
        		
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            gameSong.stop()
			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
		
        game.stage.disableVisibilityChange = false
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initTuto()
    }

	function createBackground(){
        
        var tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.river", "tile")
        sceneGroup.add(tile)
        
        rowsGroup = game.add.group()
        sceneGroup.add(rowsGroup)
        
        var pivotY = 0
        
        for(var i = 0; i < 3; i ++){
            
            var row = game.add.tileSprite(0, game.world.centerY * pivotY, game.world.width, 330, "atlas.river", "row")
            row.scale.setTo(1, 0.85)
            row.inputEnabled = true
            row.events.onInputDown.add(function(line){
                playTuto ? changeRowTuto(line) : changeRow(line)
            }, this)
            rowsGroup.add(row)
            
            pivotY += 0.53
        }
        rowsGroup.tag = 1
        rowsGroup.lastRow = -1
        
        rowsGroup.children[1].tilePosition.x += 200
        rowsGroup.children[1].tilePosition.x += 100
        rowsGroup.tile = tile
    }

	function update(){
        
        if(gameActive){
            
            if(nao.canMove){
                if(cursors.up.isDown){
                    if(rowsGroup.tag > 0){
                        rowsGroup.tag--
                        changeRow(rowsGroup.children[rowsGroup.tag])
                    }
                }
                if(cursors.down.isDown){
                     if(rowsGroup.tag < 2){
                        rowsGroup.tag++
                        changeRow(rowsGroup.children[rowsGroup.tag])
                    }
                }
            }
            
            rowsGroup.forEach(function(row){
                row.tilePosition.x -= speed * 0.017
            }, this)
            rowsGroup.tile.tilePosition.x -= speed * 0.005
            
            if(lastObj && lastObj.x <= game.world.width - 310)
                throwObstacle()
            
            game.physics.arcade.overlap(nao.box2, fishGroup, hitFish, null, this)
            game.physics.arcade.overlap(nao.box, trashGroup, hitTrash, null, this)
        }
    }
    
    function changeRow(row){
        
        if(gameActive){
            rowsGroup.tag = rowsGroup.getIndex(row)
            nao.canMove = false
            sound.play("swipe")
            game.add.tween(nao).to({y:row.centerY + 40}, 250, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                nao.canMove = true
            })
        }
    }
    
    function createPart(key){
        
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.river',key);
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
    
	function createCoin(){
        
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
        
        var rocko = fishGroup.children[7]
        rocko.reset(game.world.centerX - 100, rowsGroup.children[2].centerY - rocko.deltaY)
        hand.rocko = rocko

    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)
        sound.play("rightChoice")

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createNao(){
        
        nao = game.add.spine(100, rowsGroup.children[1].centerY + 40, "nao")
        nao.scale.setTo(0.4, 0.4)
        nao.setAnimationByName(0, "idle", true)
        nao.setSkinByName("normal")
        nao.canMove = true
        sceneGroup.add(nao)
        
        var box = game.add.graphics(300, -200)
        box.beginFill(0x0000ff,0)
        box.drawRect(0, 0, 100, 200)
        box.endFill()
        game.physics.arcade.enable(box)
        box.body.syncBounds = true
        nao.addChild(box) 
        nao.box = box

        var box2 = game.add.graphics(100, -200)
        box2.beginFill(0x0000ff,0)
        box2.drawRect(0, 0, 300, 200)
        box2.endFill()
        game.physics.arcade.enable(box2)
        box2.body.syncBounds = true
        nao.addChild(box2) 
        nao.box2 = box2
    }
    
    function createTrash(){
        
        trashGroup = game.add.group()
        trashGroup.enableBody = true
        trashGroup.physicsBodyType = Phaser.Physics.ARCADE
        trashGroup.createMultiple(30, "atlas.river", 'trash0')
        trashGroup.setAll('anchor.x', 0)
        trashGroup.setAll('anchor.y', 0.5)
        trashGroup.setAll('collected', false)
        trashGroup.setAll('checkWorldBounds', true)
        trashGroup.setAll('deltaY', -50)
        trashGroup.setAll('outOfBoundsKill', true)
        trashGroup.setAll('exists', false)
        trashGroup.setAll('visible', false)
        sceneGroup.add(trashGroup)
        
        trashGroup.forEach(function(obj){
            obj.events.onOutOfBounds.add(missedTrash, this, true)
        }, this)
    }
    
    function createFish(){
        
        fishGroup = game.add.group()
        fishGroup.enableBody = true
        fishGroup.physicsBodyType = Phaser.Physics.ARCADE
        
        for(var f = 0; f < 5; f++){
            
            var box = game.add.graphics(0, 0)
            box.beginFill(0xff0000, 0)
            box.drawRect(0, 0, 70, 100)
            box.endFill()
            box.deltaY = box.height * 0.5
            fishGroup.add(box)

            var fish = game.add.spine(box.x + 50, box.height, "fish")
            fish.setAnimationByName(0, "idle_small", true)
            fish.setSkinByName("normal")
            box.addChild(fish)
            box.fish = fish
        }
        
        fishGroup.createMultiple(5, "atlas.river", 'rock')
        fishGroup.setAll('anchor.y', 0.65)
        fishGroup.setAll('collected', false)
        fishGroup.setAll('checkWorldBounds', true)
        fishGroup.setAll('outOfBoundsKill', true)
        fishGroup.setAll('exists', false)
        fishGroup.setAll('visible', false)
        sceneGroup.add(fishGroup)
        
        for(var i = 5; i < fishGroup.length; i++){
            var obj = fishGroup.children[i]
            obj.body.setSize(obj.width * 0.5, obj.height * 0.5, 60, 50)
        }
    }
    
    function createTrashMeter(){
        
        meterGroup = game.add.group()
        sceneGroup.add(meterGroup)
        
        var containter = meterGroup.create(game.world.centerX, game.world.height - 80 , 'atlas.river', "containerBack")
        containter.anchor.setTo(0.5)
        //containter.scale.setTo(1.7)
        
        var bar = meterGroup.create(containter.x - containter.width * 0.31, containter.y - 10, 'atlas.river', "bar")
        bar.scale.setTo(0, 2.3)
        bar.anchor.setTo(0, 0.5)
        bar.MAX_SIZE = 10
        meterGroup.bar = bar
        
        var containter = meterGroup.create(containter.x, containter.y, 'atlas.river', "container")
        containter.anchor.setTo(0.5)

        meterGroup.grow = bar.MAX_SIZE/level
        meterGroup.counter = 0
    }
    
    function createPolution(){
        
        polutionGroup = game.add.group()
        
        var cloud = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.river", 'grime')
        cloud.alpha = 0
        cloud.alive = false
        polutionGroup.add(cloud)
        polutionGroup.cloud = cloud
        polutionGroup.polution = 1/level
        polutionGroup.counter = 0
        polutionGroup.level = level
        
        polutionGroup.createMultiple(20, "atlas.river", 'trash0')
        polutionGroup.setAll('anchor.x', 0.5)
        polutionGroup.setAll('anchor.y', 0.5)
        polutionGroup.setAll('exists', false)
        polutionGroup.setAll('visible', false)
        sceneGroup.add(polutionGroup)

        cloud.anchor.setTo(0)
        polutionGroup.cloud.exists = true
        polutionGroup.cloud.visible = true
    }
    
    function hitFish(box, fish){
        
        if(gameActive && !fish.collected){
            
            fish.collected = true
            if(fish.fish){
                fish.fish.setAnimationByName(0, "grow", false)
                fish.fish.addAnimationByName(0, "idle_big", true)
            }
            missPoint(fish)
            game.add.tween(nao).from({alpha: 0},100,Phaser.Easing.linear,true,0,5,true)
        }
    }
    
    function hitTrash(box, trash){
    
        if(gameActive && !trash.collected){
            
            trash.collected = true
            nao.setAnimationByName(0, "attack", false)
            nao.addAnimationByName(0, "run", true)
            
            game.time.events.add(200,function(){
                addCoin(trash)
                killObj(trash)
                growUpBarMeter()
            })
        }
    }
    
    function missedTrash(obj){
        
        killObj(obj)
        
        if(meterGroup.counter > 0){
            
            meterGroup.counter--
            
            var dirty = meterGroup.bar.scale.x - meterGroup.grow
            
            if(dirty < 0){
                dirty = 0
            }
            game.add.tween(meterGroup.bar.scale).to({x:dirty}, 500, Phaser.Easing.Cubic.Out, true)
        }
        addPolution()
    }
    
    function growUpBarMeter(){
        
        var amount = meterGroup.bar.scale.x + meterGroup.grow
        
        if(amount > meterGroup.bar.MAX_SIZE){
            amount = meterGroup.bar.MAX_SIZE
        }
        meterGroup.counter++
            
        game.add.tween(meterGroup.bar.scale).to({x:amount}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
            if(meterGroup.counter >= level){
                levelUp()
            }
        })
    }
    
    function addPolution(){
        
        var shade = polutionGroup.cloud.alpha + polutionGroup.polution
        polutionGroup.counter++
        
        game.add.tween(polutionGroup.cloud).to({alpha:shade}, 400, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
            if(polutionGroup.counter >= polutionGroup.level){ 
                missPoint(nao)
                tryAgain()
            }
        })
        
        for(var i = 0; i < 2; i++){
            do {
                var trash = polutionGroup.getRandom(1, polutionGroup.length - 1)
            }while(trash.alive)

            if(trash){

                var size = game.rnd.realInRange(1.5, 2)
                var spawnX = game.world.randomX
                var spawnY
                game.rnd.integerInRange(0,1) ? spawnY = game.rnd.integerInRange(10, 50) : spawnY = game.rnd.integerInRange(game.world.height,  game.world.height - 160)
                trash.loadTexture("atlas.river", "trash" + game.rnd.integerInRange(0, 13))
                trash.angle = game.rnd.integerInRange(0,12) * 30
                polutionGroup.bringToTop(trash)
                trash.reset(spawnX, spawnY)
                game.add.tween(trash.scale).to({x: size, y: size}, 100, Phaser.Easing.Cubic.In, true)
                sound.play("drag")
            }
        }
    }
    
    function killObj(obj){
        
        obj.body.velocity.x = 0
        obj.kill()
    }
    
    function levelUp(){
        
        gameActive = false
        level++
        meterGroup.grow = meterGroup.bar.MAX_SIZE/level
        meterGroup.counter = 0
        polutionGroup.counter = 0
        level > 5 ? polutionGroup.level = 5 : polutionGroup.level = level
        polutionGroup.polution = 1/polutionGroup.level
        
        nao.setAnimationByName(0, "win", true)
        
        speed += 100
        
        cleanScreen()
        
        game.time.events.add(2500, initGame)
    }
    
    function tryAgain(){
        
        gameActive = false
        meterGroup.grow = meterGroup.bar.MAX_SIZE/level
        meterGroup.counter = 0
        polutionGroup.polution = 1/level
        polutionGroup.counter = 0
        
        nao.setAnimationByName(0, "lose", true)
        
        if(lives > 0){
            cleanScreen()
            game.time.events.add(2500, initGame)
        }
    }
    
    function cleanScreen(){
        
        trashGroup.forEachAlive(deactivateObj, this)
        fishGroup.forEachAlive(function(obj){
            obj.body.velocity.x = 0
        }, this)
        polutionGroup.forEachAlive(fadeOut, this)
        
        game.add.tween(polutionGroup.cloud).to({alpha:0}, 1000, Phaser.Easing.Cubic.Out, true, 500)
        game.add.tween(meterGroup.bar.scale).to({x:0}, 500, Phaser.Easing.Cubic.Out, true, 1000)
    }
    
    function deactivateObj(obj){

        obj.body.velocity.x = 0
        fadeOut(obj, 500, 0)
    }
    
    function fadeOut(obj, timer, delay){
        
        var t = timer || 1000
        var d = delay || 500
        
        game.add.tween(obj).to({alpha:0}, t, Phaser.Easing.Cubic.Out, true, d).onComplete.add(function(){
            obj.y = -500
            obj.alpha = 1
            obj.kill()
        })
    }
    
    function initGame(){
        
        gameActive = true
        nao.setAnimationByName(0, "run", true)
        game.time.events.add(1000, throwObstacle)
        
        fishGroup.forEachAlive(function(obj){
            obj.body.velocity.x = -speed
        }, this)
    }
    
    function throwObstacle(){
        
        var rand = game.rnd.integerInRange(0, 1)
        
        if(rand === 1){
            
            do {
                var obj = fishGroup.getRandom(0, fishGroup.length - 1)
            } while (obj.exists == true)
        }
        else{
            var obj = trashGroup.getFirstExists(false)
        }
        
        if(obj){
            if(rand === 1){
                if(obj.fish){
                    obj.fish.setAnimationByName(0, "idle_small", true)
                    obj.fish.x = 50
                    game.add.tween(obj.fish).to({x: -20},600,Phaser.Easing.linear,true)
                }
            }
            else{
                obj.loadTexture("atlas.river", "trash" + game.rnd.integerInRange(0, 13))
            }
            
            rowsGroup.lastRow = getRand(rowsGroup.lastRow)
            obj.collected = false
            obj.reset(game.world.width, rowsGroup.children[rowsGroup.lastRow].centerY - obj.deltaY)
            obj.body.velocity.x = -speed
            lastObj = obj
        }
    }
    
    function getRand(opt){
        var x = game.rnd.integerInRange(0, 2)
        if(x == opt)
            return getRand(opt)
        else return x    
    }
    
    //····················tuto····················//
    
    function initTuto(){
        
        throwFishTuto()
    }
    
    function changeRowTuto(row){
        
        if(playTuto){
            nao.canMove = false
            sound.play("swipe")
            game.add.tween(nao).to({y:row.centerY + 40}, 250, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                nao.canMove = true
                if(rowsGroup.getIndex(row) == hand.pos){
                    if(hand.pos == 0){
                        game.add.tween(hand.obj).to({x: -100}, 1500, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                            hand.obj.kill()
                            hand.obj = null
                            game.add.tween(hand).to({alpha: 0}, 200, Phaser.Easing.linear, true)
                            playTuto = false
                            throwTrashTuto()
                        })
                    }
                    else{
                        game.add.tween(hand).to({alpha: 0}, 200, Phaser.Easing.linear, true)
                        hitTrashTuto(hand.obj)
                    }
                }
            })
        }
    }
    
    function throwTrashTuto(){
        
        var obj = trashGroup.getFirstExists(false)
        
        if(obj){
            obj.loadTexture("atlas.river", "trash" + game.rnd.integerInRange(0, 13))
            obj.collected = false
            obj.reset(game.world.width, rowsGroup.children[2].centerY - obj.deltaY)
            rowsGroup.forEach(function(line){
                game.add.tween(line.tilePosition).to({x: line.tilePosition.x - 500}, 2500, Phaser.Easing.linear, true)
            }, this)
            game.add.tween(hand.rocko).to({x: -250}, 2500, Phaser.Easing.linear, true).onComplete.add(function(){
                hand.rocko.kill()
                hand.rocko = null
            })
            nao.setAnimationByName(0, "run", true)
            game.add.tween(obj).to({x: nao.box.x}, 1900, Phaser.Easing.linear, true, 600).onComplete.add(function(){
                posHand(obj, 2)
                nao.setAnimationByName(0, "idle", true)
                rowsGroup.tag = 2
            })
        }
    }
    
    function throwFishTuto(){
        
        var obj = fishGroup.getFirstExists(false)
        
        if(obj){
            obj.fish.x = 50
            game.add.tween(obj.fish).to({x: -20},600,Phaser.Easing.linear,true)
            rowsGroup.lastRow = getRand(rowsGroup.lastRow)
            obj.collected = true
            obj.reset(game.world.width, rowsGroup.children[1].centerY - obj.deltaY)
            game.add.tween(obj).to({x: nao.box.x + 50}, 2500, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                posHand(obj, 0)
            })
        }
    }
    
    function posHand(obj, pos){
        
        hand.obj = obj
        hand.x = nao.box.x
        hand.pos = pos
        hand.y = rowsGroup.children[hand.pos].centerY
        game.add.tween(hand).to({alpha: 1}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
            playTuto = true
        })
    }
    
    function hitTrashTuto(trash){
    
        if(playTuto && !trash.collected){
            
            playTuto = false
            trash.collected = true
            nao.setAnimationByName(0, "attack", false)
            nao.addAnimationByName(0, "win", true)
            
            killObj(trash)
            particleCorrect.x = trash.centerX 
            particleCorrect.y = trash.centerY
            particleCorrect.start(true, 1200, null, 10)
            sound.play("rightChoice")
            
            hand.obj = null
            hand.destroy()
            
            game.time.events.add(2500, initGame)
        }
    }

	return {
		
        assets: assets,
		name: "river",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this)

            game.onResume.add(function(){
                game.sound.mute = false
            }, this)
			            
            createTrash()
            createFish()
            createTrashMeter()
            createPolution()
            createNao()
            
            createPointsBar()
			createHearts()
            createCoin()
            createParticles()
            buttons.getButton(gameSong,sceneGroup)
            
            createTutorial()
		}
	}
}()