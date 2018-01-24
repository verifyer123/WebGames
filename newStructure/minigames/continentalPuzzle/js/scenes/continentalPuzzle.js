
var soundsPath = "../../shared/minigames/sounds/"
var continentalPuzzle = function(){
    
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
                name: "atlas.continentalPuzzle",
                json: "images/continentalPuzzle/atlas.json",
                image: "images/continentalPuzzle/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/continentalPuzzle/timeAtlas.json",
                image: "images/continentalPuzzle/timeAtlas.png",
            }
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "energy",
				file: soundsPath + "energyCharge2.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 127
    var overlayGroup
    var continentSong
    var coin
    var continentGroup
    var buttonGroup
    var rnd
    var banner
    var nameGroup
    var contiName
    var fontStyle
    var index
    var cloudBitmap
    var pivotinent
    var clean 
    var handsGroup
    var flyingCloud
    var colors = [0xffff00, 0x00ffff, 0xff00ff, 0xff0000]
    var playTuto = true
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rnd = -1
        index = 0
        pivotinent = 0
        clean = false
        fontStyle = {font: "54px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        if(localization.getLanguage() === 'EN'){
            contiName = ['Africa', 'America', 'Antarctica', 'Asia', 'Europe', 'Australia'] 
        }
        else{
            contiName = ['África', 'América', 'Antártida', 'Asia', 'Europa', 'Oceanía'] 
        }
        
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
    
    function rotateImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].angle = 0
            if( i == index){
                group.children[i].angle = game.rnd.integerInRange(1, 7) * 45
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.continentalPuzzle','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.continentalPuzzle','life_box')

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
        continentSong.stop()
        		
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
        
        game.load.audio('continentSong', soundsPath + 'songs/the_buildup.mp3');
        
		game.load.image('howTo',"images/continentalPuzzle/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/continentalPuzzle/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/continentalPuzzle/introscreen.png")
		
        game.load.image('continent0',"images/continentalPuzzle/continentes/africa.png")
        game.load.image('continent1',"images/continentalPuzzle/continentes/america.png")
        game.load.image('continent2',"images/continentalPuzzle/continentes/antartida.png")
        game.load.image('continent3',"images/continentalPuzzle/continentes/asia.png")
        game.load.image('continent4',"images/continentalPuzzle/continentes/europa.png")
        game.load.image('continent5',"images/continentalPuzzle/continentes/oceania.png")
        game.load.image('board',"images/continentalPuzzle/board.png")
        game.load.image('clouds',"images/continentalPuzzle/clouds.png")
        
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        game.load.spritesheet("IDLE", 'images/spines/576 × 236_40f_24fps_idle.png', 576, 236, 40)
        game.load.spritesheet("WIN", 'images/spines/576 × 245_26f_24fps_win.png', 576, 245, 26)
		
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
                if(playTuto)
                    initTuto()
                else{
                    buttonGroup.alpha = 1
                    buttonGroup.setAll('inputEnabled', true)
                    nameGroup.setAll('alpha', 0)
                    banner.loadTexture('IDLE', 0, true)
                    banner.play('IDLE')
                    handsGroup.alpha = 1
                    posHand(buttonGroup.children[2])
                    initGame()
                }
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.continentalPuzzle','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.continentalPuzzle',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.continentalPuzzle','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.continentalPuzzle", 'tile')
        sceneGroup.add(tile)
    }

	function update(){
        
        if (game.input.activePointer.isDown && gameActive){
          var x = game.input.x - cloudBitmap.x
          var y = game.input.y - cloudBitmap.y
          var rgba = cloudBitmap.getPixel(x, y)
          if (rgba.a > 0)
          {
            cloudBitmap.blendDestinationOut()
            cloudBitmap.circle(x, y, 50, 'rgba(0, 0, 0, 255')
            cloudBitmap.blendReset()
            cloudBitmap.dirty = true
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
        particle.makeParticles('atlas.continentalPuzzle',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        //particle.maxParticleScale = .8;
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

				particle.makeParticles('atlas.continentalPuzzle',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.continentalPuzzle','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.continentalPuzzle','smoke');
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
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        timer = 300

        game.add.tween(coin).to({alpha:1}, timer, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, timer + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function pangea(){
        
        board = sceneGroup.create(game.world.centerX, game.world.centerY - 100, 'board')
        board.anchor.setTo(0.5)
        
        continentGroup = game.add.group()
        sceneGroup.add(continentGroup)
        
        for(var c = 0; c < 6; c++){
            var continent = continentGroup.create(board.centerX, board.centerY, 'continent'+c)
            continent.anchor.setTo(0.5)
            continent.alpha = 0
            continent.active = false
        }
    }
    
    function flag(){
        
        banner = game.add.sprite(game.world.centerX, game.world.height - 220, 'IDLE')
        banner.anchor.setTo(0.5)
        banner.animations.add('IDLE', null, 24, true)
        banner.animations.add('WIN', null, 24, true)
        sceneGroup.add(banner)
                
        banner.play('IDLE')
        
        nameGroup = game.add.group()
        sceneGroup.add(nameGroup)
        
        for(var c = 0; c < 6; c++){
            var name = new Phaser.Text(sceneGroup.game, 0, 0, '0', fontStyle)
            name.anchor.setTo(0.5)
            name.y = banner.y - 10
            name.x = banner.x
            name.alpha = 0
            name.setText(contiName[c])
            nameGroup.add(name)
        }
    }
    
    function buttonnes(){
        
        buttonGroup = game.add.group()
        buttonGroup.alpha = 0
        sceneGroup.add(buttonGroup)
        
        var aux = -1
        
        for(var b = 0; b < 3; b++){
            var btn = buttonGroup.create(game.world.centerX + 170 * aux, game.world.height - 100, "atlas.continentalPuzzle", "btn" + b)
            btn.anchor.setTo(0.5)
            btn.option = b
            btn.inputEnabled = false
            btn.events.onInputDown.add(press, this)
            aux++
        }
    }
    
    function press(btn){
        
        if(gameActive){
            game.add.tween(btn.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                options(btn.option)
                game.add.tween(btn.scale).to({x: 1, y: 1}, 100, Phaser.Easing.linear, true).onComplete.add(function(){
                })
            })
        }
        if(handsGroup !== undefined){
            handsGroup.destroy()
        }
    }
    
    function options(op){
        
        switch(op){
            case 0:
                sound.play('cut')
                game.add.tween(nameGroup.children[index]).to({ x: nameGroup.children[index].x - 50}, 100,Phaser.Easing.linear,true).onComplete.add(function(){
                    nameGroup.children[index].x = banner.x
                    if(index > 0){
                     index--
                    }
                    else{
                        index = 5
                    }
                    changeImage(index, nameGroup)
                    game.add.tween(nameGroup.children[index]).from({ x: nameGroup.children[index].x + 50}, 100,Phaser.Easing.linear,true)
                })
            break
            case 1:
                sound.play('pop')
                cloudBitmap.clear()
                win()
            break
            case 2:
                sound.play('cut')
                game.add.tween(nameGroup.children[index]).to({ x: nameGroup.children[index].x + 50}, 100,Phaser.Easing.linear,true).onComplete.add(function(){
                    nameGroup.children[index].x = banner.x
                    if(index < 5){
                         index++
                    }
                    else{
                        index = 0
                    }
                    changeImage(index, nameGroup)
                    game.add.tween(nameGroup.children[index]).from({ x: nameGroup.children[index].x - 50}, 100,Phaser.Easing.linear,true)
                })
            break
        }
        
        
    }
    
    function win(){
        
        gameActive = false
        
        if(index === rnd){
            sound.play('rightChoice')
            addCoin()
            banner.loadTexture('WIN', 0, true)
            banner.play('WIN')
        }
        else{
            missPoint()
        }
        
        
        
        if(pointsBar.number === 12 || pointsBar.number === 6){
            flyingCloud.alpha = 1
            sound.play('energy')
            game.add.tween(flyingCloud.scale).from({x: 0, y: 0}, 1500, Phaser.Easing.linear,true).onComplete.add(function(){
                banner.loadTexture('IDLE', 0, true)
                banner.play('IDLE')
                game.add.tween(flyingCloud).to({alpha: 0}, 1000, Phaser.Easing.linear,true)
                if(lives !== 0)
                    initGame()                                                                                              
            })   
        }
        else{
            game.time.events.add(1300,function(){
                banner.loadTexture('IDLE', 0, true)
                banner.play('IDLE')
                if(lives !== 0)
                    initGame()
            },this)
        }
    }
    
    function initGame(){
        
        rnd = getRand()
        cloudBitmap.load('clouds')
        changeImage(rnd, continentGroup)
        nameGroup.setAll('alpha', 0)
        
        if(pointsBar.number > 6){
            rotateImage(rnd, continentGroup)  
        }
        
        if(pointsBar.number > 12){
            continentGroup.children[rnd].tint = colors[game.rnd.integerInRange(0, 3)]   
        }
        
        game.time.events.add(500,function(){
            gameActive = true
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 5)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
    
    function initBitmap(){
        
        cloudBitmap = game.add.bitmapData(board.width, board.height)
        cloudBitmap.load('clouds')
        cloudBitmap.update()
        cloudBitmap.x = board.centerX - (board.width * 0.5)
        cloudBitmap.y = board.centerY - (board.height * 0.5)
        cloudBitmap.addToWorld(cloudBitmap.x, cloudBitmap.y)
        cloudBitmap.clear()
    }
    
    function initTuto(){
        
        cloudBitmap.load('clouds')
        clean = false
        changeImage(pivotinent, continentGroup)
        changeImage(pivotinent, nameGroup)
        
        game.input.onUp.add(countPixels, this)

        game.time.events.add(500,function(){
            gameActive = true
        },this)
    }
    
    function countPixels(){
      
        if(!clean && getPixels(cloudBitmap.ctx) < 0.2){
            clean = true
            cloudBitmap.clear()
            landInSight()
        }
    }
    
    function getPixels(ctx) {
        
        var alphaPixels = 0
        var data = ctx.getImageData(0,0, ctx.canvas.width,ctx.canvas.height).data

        for(var i=3; i<data.length; i+=4){
            if(data[i] > 0) 
                alphaPixels++
        }

        return alphaPixels / (ctx.canvas.width * ctx.canvas.height)
    }
    
    function landInSight(){
        
        pivotinent++
        banner.loadTexture('WIN', 0, true)
        banner.play('WIN')
        sound.play("magic")
        particleCorrect.x = banner.x 
        particleCorrect.y = banner.y - 50
        particleCorrect.start(true, 1200, null, 10)

        if(pivotinent < 6){
            game.time.events.add(1200,function(){
                banner.loadTexture('IDLE', 0, true)
                banner.play('IDLE')
            },this)
            game.time.events.add(2500,function(){
                initTuto()
            },this)
        }
        else{
            addCoin()
            game.time.events.add(1200,function(){
                flyingCloud.alpha = 1
                sound.play('energy')
                game.add.tween(flyingCloud.scale).from({x: 0, y: 0}, 1500, Phaser.Easing.linear,true).onComplete.add(function(){
                    buttonGroup.alpha = 1
                    nameGroup.setAll('alpha', 0)
                    banner.loadTexture('IDLE', 0, true)
                    banner.play('IDLE')
                    handsGroup.alpha = 1
                    buttonGroup.setAll('inputEnabled', true)
                    posHand(buttonGroup.children[2])
                    playTuto = false
                    initGame()
                    game.add.tween(flyingCloud).to({alpha: 0}, 1000, Phaser.Easing.linear,true)
                })
            },this)
        }
    }
    
    function initHand(){
        
        handsGroup = game.add.group()
        handsGroup.alpha = 0
        sceneGroup.add(handsGroup)
        
        var handUp = handsGroup.create(0, 0, 'atlas.continentalPuzzle', 'handUp') // 0
        handUp.alpha = 0
        
        var handDown = handsGroup.create(0, 0, 'atlas.continentalPuzzle', 'handDown') // 1
        handDown.alpha = 0
         
        handsGroup.tween = game.add.tween(handsGroup).to({y:handsGroup.y + 10}, 400, Phaser.Easing.linear, true)
            
        handsGroup.tween.onComplete.add(function() 
        {
            changeImage(0, handsGroup)
            game.add.tween(handsGroup).to({y:handsGroup.y - 10}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                handsGroup.tween.start()
                changeImage(1, handsGroup)
            })
        })
    }
    
    function posHand(pos){
        
        handsGroup.setAll("x", pos.x)
        handsGroup.setAll("y", pos.y - 20)
        handsGroup.alpha = 1
    }
    
    function flyCloud(){
        
        flyingCloud = sceneGroup.create(game.world.centerX, game.world.centerY, 'clouds')
        flyingCloud.scale.setTo(3)
        flyingCloud.anchor.setTo(0.5)
        flyingCloud.alpha = 0
    }
    
	return {
		
		assets: assets,
		name: "continentalPuzzle",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            continentSong = game.add.audio('continentSong')
            game.sound.setDecodedCallback(continentSong, function(){
                continentSong.loopFull(0.6)
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
            pangea()
            flag()
            buttonnes()
            initBitmap()
            initHand()
            flyCloud()
            initCoin() 
            createParticles()
			
			buttons.getButton(continentSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()