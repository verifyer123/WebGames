
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
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var fishSong
    var nao
    var naoPos
    var aux
    var rows = [110, 440, 770]
    var rubbish = ['apple','bag','ball','banan','book','burger','cardboard','deadFish','pear','plastic','plate','steak','tomato','watermelon']
    var trashGroup
    var fishGroup
    var fishColliderGroup
    var pivot
    var box
    var velocity
    var items

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
        
        aux = 0
        velocity = -90
        items = 14
        pivot = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.river','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.river','life_box')

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
        fishSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
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
        
        game.load.audio('fishSong', soundsPath + 'songs/bubble_fishgame.mp3');
        
		game.load.image('howTo',"images/river/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/river/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/river/introscreen.png")
        
		game.load.image('fondo',"images/river/tile.png")
        game.load.image('fondo2',"images/river/tile2.png")
        
        game.load.spine("nao", "images/spines/Nao/nao.json");
        game.load.spine("fish", "images/spines/Fish/fish.json");
        
		console.log(localization.getLanguage() + ' language')
        
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
                startTrash()
                startFish()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.river','gametuto')
        tuto.scale.setTo(0.9, 0.9)
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.river',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.river','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
        var fondo
        var row0
        var row1
        var row2
        
        for(var d = 0; d < 11; d ++)
        {
            for(var f = 0; f < 14; f ++)
            {
                fondo = sceneGroup.create(0, 0, "fondo");
                fondo.x = f * fondo.width * 0.99
                fondo.y = d * fondo.height * 0.99
            }
        }   
        
        for(var f = 0; f < 13; f ++)
        {
              row0 = sceneGroup.create(0, 0, "fondo2");
              row0.x = f * row0.width * 0.99
              row0.y = 0
              row0.number = 0
              row0.inputEnabled = true
              row0.events.onInputDown.add(changeRow)
        }
        
        for(var f = 0; f < 13; f ++)
        {
              row1 = sceneGroup.create(0, 0, "fondo2");
              row1.x = f * row1.width * 0.99
              row1.y = row1.height
              row1.number = 1
              row1.inputEnabled = true
              row1.events.onInputDown.add(changeRow)
        }
        
        for(var f = 0; f < 13; f ++)
        {
              row2 = sceneGroup.create(0, 0, "fondo2");
              row2.x = f * row2.width * 0.99
              row2.y = 2 * row2.height
              row2.number = 2
              row2.inputEnabled = true
              row2.events.onInputDown.add(changeRow)
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
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

				particle.makeParticles('atlas.river',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.river','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.river','smoke');
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
	
    function createNao(){
        
        nao = game.add.spine(0, 0, "nao")
        nao.scale.setTo(0.4, 0.4)
        nao.setAnimationByName(0, "IDLE", true)
        nao.setSkinByName("normal")
        sceneGroup.add(nao)
        
        naoPos = game.add.sprite(0, 0, 'atlas.river', 'star')
        naoPos.scale.setTo(3.2, 3.2)
        naoPos.alpha = 0
        naoPos.inputEnabled = true
        naoPos.input.enableDrag()
        naoPos.input.allowVerticalDrag = false
        game.physics.arcade.enable(naoPos)
        naoPos.body.immovable = true
    }
    
    function changeRow(obj){
        aux = obj.number
        naoPos.x = 0
    }
    
    function update(){
        
        naoPos.y = rows[aux]
        
        nao.x = naoPos.x + naoPos.width * 0.4
        nao.y = naoPos.y + nao.height + 50
        
        game.physics.arcade.collide(box, trashGroup, trashCollision, null, this)
        game.physics.arcade.collide(box, fishColliderGroup, boxFishCollision, null, this)
        game.physics.arcade.collide(naoPos, trashGroup, naoCollision, null, this)
        game.physics.arcade.collide(naoPos, fishColliderGroup, fishCollision, null, this)
        
        if(items == 4){
            fillTrashGroup()
            startTrash()
            items = 15
        }
         
        for(var i = 0; i < fishGroup.length; i++)
        {
            if(fishGroup.children[i].active){
                fishGroup.children[i].x -= 1
                fishColliderGroup.children[i].x -= 1
            }
        }
	}
    
    function createFish(){
        
        fishGroup = game.add.group()
        sceneGroup.add(fishGroup)  
        
        for(var f = 0; f < 5; f++)
        { 
            var fish = game.add.spine(0, 0, "fish")
            fish.setAnimationByName(0, "IDLE", true)
            fish.setSkinByName("normal")
            fish.active = false
            fish.alpha = 0
            fishGroup.add(fish)
        }
        
        fishGroup.setAll('anchor.x', 1)
        fishGroup.setAll('anchor.y', 0.5)
        fishGroup.setAll('outOfBoundsKill', true)
        fishGroup.setAll('checkWorldBounds', true)
    }
    
    function createFishCollider(){
        
        fishColliderGroup = game.add.physicsGroup()
        fishColliderGroup.enableBody = true
        fishColliderGroup.physicsBodyType = Phaser.Physics.ARCADE
        
        for(var f = 0; f < 5; f++)
        { 
            var fishCollider = fishColliderGroup.create(0, 0, 'atlas.river', 'bar')
            game.physics.enable(fishCollider, Phaser.Physics.ARCADE)
            game.physics.arcade.enable(fishColliderGroup)
            fishCollider.alpha = 0
            fishCollider.number = f
        }
        
        fishColliderGroup.setAll('anchor.x', 1)
        fishColliderGroup.setAll('anchor.y', 0.5)
        fishColliderGroup.setAll('outOfBoundsKill', true)
        fishColliderGroup.setAll('checkWorldBounds', true)
    }
    
    function startFish(){
        
        var timer = 400
        
        for(var t = 0; t < 5; t++)
        {
            pullFish(timer)
            timer += 8000
        }
    }
    
    function pullFish(delay){
        
        game.time.events.add(delay,function(){
        if(pivot < 5)
        {
            fishGroup.children[pivot].alpha = 1
            fishGroup.children[pivot].x = game.world.width
            fishGroup.children[pivot].y = rows[game.rnd.integerInRange(0, 2)] + fishGroup.children[0].height 
            fishGroup.children[pivot].active = true
            fishColliderGroup.children[pivot].x = fishGroup.children[pivot].x
            fishColliderGroup.children[pivot].y = fishGroup.children[pivot].y - 50
            pivot++
        }
        else pivot = 0    
                 
        },this)
    }
    
    function createTrash(){
        
        trashGroup = game.add.physicsGroup()
        trashGroup.enableBody = true
        trashGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(trashGroup)  
        
        fillTrashGroup()
    }
    
    function fillTrashGroup(){
        
        for(var t = 0; t < 14; t++)
        {
            var trash = trashGroup.create(0, 0, 'atlas.river', rubbish[t])
            trash.number = t
            game.physics.enable(trash, Phaser.Physics.ARCADE)
        }
        trashGroup.setAll('anchor.x', 1)
        trashGroup.setAll('anchor.y', 0.5)
        trashGroup.setAll('outOfBoundsKill', true)
        trashGroup.setAll('checkWorldBounds', true)
    }
    
    function startTrash(){
        
        var timer = 400
        
        for(var t = 0; t < 14; t++)
        {
            trowTrash(trashGroup.children[t], timer)
            timer += 5000
        }
    }
    
    function trowTrash(obj,delay){
        
        game.time.events.add(delay,function(){

            if (obj)
            {
                obj.alpha = 1
                obj.reset(game.world.width, rows[game.rnd.integerInRange(0, 2)] + 100)
                obj.body.velocity.x = velocity
            }
            
        },this)
    }
    
    function createBox(){
        
        box = sceneGroup.create(0, 0, 'atlas.river', "bar")
        box.y = game.world.centerY 
        box.anchor.setTo(0, 0.5)
        box.alpha = 0
        box.scale.setTo(1, game.world.height)
        game.physics.enable(box, Phaser.Physics.ARCADE)
        box.body.immovable = true
        
    }
    
    function trashCollision (box, trash) {
        trash.alpha = 0
        trowTrash(trash, 2000)
    }

    function naoCollision(naoPos, trash){
        trash.kill()
        nao.setAnimationByName(0, "HIT", false)
        items--
        addPoint(1)
        idleNao()
    }
    
    function fishCollision(naoPos, fishCollider){    
        nao.setAnimationByName(0, "LOSE", true)
        naoPos.kill()
        missPoint()
    }
    
    function boxFishCollision (box, fishCollider) {
        fishGroup.children[fishCollider.number].active = false
        fishGroup.children[fishCollider.number].x = 0
        fishGroup.children[fishCollider.number].y = 0
        fishCollider.x = 0
        fishCollider.y = 0
        pullFish(7000)
    }
   
    function idleNao(){  
        nao.addAnimationByName(0, "IDLE", true)
    }
    
	return {
		
		assets: assets,
		name: "river",
		update: update,
        preload:preload,
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            fishSong = game.add.audio('fishSong')
            game.sound.setDecodedCallback(fishSong, function(){
                fishSong.loopFull(0.6)
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
			createNao()
            createTrash()
            createBox()
            createFish()
            createFishCollider()
            
			buttons.getButton(fishSong,sceneGroup)
            createOverlay()
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()