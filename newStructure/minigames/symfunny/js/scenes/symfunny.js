
var soundsPath = "../../shared/minigames/sounds/"
var symfunny = function(){
    
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
                name: "atlas.symfunny",
                json: "images/symfunny/atlas.json",
                image: "images/symfunny/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {	name: "error",
				file: soundsPath + "error.mp3"},
            {	name: "harp",
				file: "sounds/" + "harp.mp3"},
			{	name: "piano",
				file: "sounds/" + "piano.mp3"},
            {	name: "tuba",
				file: "sounds/" + "tuba.mp3"},
            {	name: "violin",
				file: "sounds/" + "violin.mp3"},
            {	name: "flute",
				file: "sounds/" + "flute.mp3"},
            {	name: "song",
				file: "sounds/" + "song.mp3"},
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 107
	var indexGame
    var overlayGroup
    var spaceSong
    var orchestaGroup
    var buttonsGroup
    var orchesta = 
        [
            {name:'harp', value:0}, 
            {name:'piano', value:1}, 
            {name:'tuba', value:2}, 
            {name:'violin', value:3}, 
            {name:'flute', value:4}
        ]
    var correctAnswer = []
    var cap, pivot, lvl
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        cap = 3
        pivot = 0
        lvl = 0
        
        correctAnswer = [cap]
     
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.symfunny','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.symfunny','life_box')

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
        //spaceSong.stop()
        		
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
        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
        
		game.load.image('howTo',"images/symfunny/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/symfunny/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/symfunny/introscreen.png")
        
        game.load.spine("normal", "images/spines/normal/normal.json");
        game.load.spine("normal1", "images/spines/normal1/normal1.json");
        game.load.spine("normal2", "images/spines/normal2/normal2.json");
        game.load.spine("normal3", "images/spines/normal3/normal3.json");
        game.load.spine("normal4", "images/spines/normal4/normal4.json");
		
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
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.symfunny','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.symfunny',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.symfunny','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.symfunny', "floor")
        sceneGroup.add(tile)
        
        tileTexture = sceneGroup.create(game.world.centerX, game.world.centerY, 'atlas.symfunny', "tile_texture")
        tileTexture.anchor.setTo(0.5)
        tileTexture.scale.setTo(2, 3)
        tileTexture.alpha = 0.35
        
        curtain = sceneGroup.create(game.world.centerX, 0, 'atlas.symfunny', "tile")
        curtain.anchor.setTo(0.5, 0)
        curtain.width = game.world.width
        curtain.height = game.world.height * 0.45
	}
	
	function update(){

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

        particle.makeParticles('atlas.symfunny',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

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

				particle.makeParticles('atlas.symfunny',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.symfunny','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.symfunny','smoke');
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
    
    function initOrchesta(){
        
        orchestaGroup = game.add.group()
        orchestaGroup.x =  game.world.centerX
        orchestaGroup.y = game.world.centerY
        //orchestaGroup.scale.setTo(0.5)
        sceneGroup.add(orchestaGroup)
        
        harp = game.add.spine(- 200, 0, "normal3")
        //harp.scale.setTo(0.7)
        harp.setAnimationByName(0, "IDLE", true)
        harp.setSkinByName("normal")
        orchestaGroup.add(harp)
        
        piano = game.add.spine(0, 200, "normal4")
        //piano.scale.setTo(0.7)
        piano.setAnimationByName(0, "IDLE", true)
        piano.setSkinByName("normal")
        orchestaGroup.add(piano)
        
        tuba = game.add.spine(200, 0, "normal")
        //tuba.scale.setTo(0.7)
        tuba.setAnimationByName(0, "IDLE", true)
        tuba.setSkinByName("normal")
        orchestaGroup.add(tuba)
        
        violin = game.add.spine(- 200, 400, "normal2")
        //violin.scale.setTo(0.7)
        violin.setAnimationByName(0, "IDLE", true)
        violin.setSkinByName("normal")
        orchestaGroup.add(violin)
        
        flute = game.add.spine(200, 400, "normal1")
        //flute.scale.setTo(0.7)
        flute.setAnimationByName(0, "IDLE", true)
        flute.setSkinByName("normal")
        orchestaGroup.add(flute)
        
    }
    
    function initBtn(){
        
        buttonsGroup = game.add.group()
        buttonsGroup.x = game.world.centerX
        buttonsGroup.y = game.world.centerY
        sceneGroup.add(buttonsGroup)  
        
        for(var t = 0; t < 5; t++)
        {
            var instument = buttonsGroup.create(0, 0, 'atlas.symfunny', 'floor')
            instument.anchor.setTo(0.5, 0)
            instument.scale.setTo(1, 1.5)
            instument.alpha = 0
            instument.inputEnabled = true
            instument.events.onInputDown.add(inputButton)
            instument.instument = orchesta[t].name
            instument.value = orchesta[t].value
        }
        
        //harp
        buttonsGroup.children[0].x = -200
        buttonsGroup.children[0].y = -200
        
        //piano
        buttonsGroup.children[1].x = 0
        buttonsGroup.children[1].y = 0
        
        //tuba
        buttonsGroup.children[2].x = 200
        buttonsGroup.children[2].y = -200
        
        //violin
        buttonsGroup.children[3].x = -200
        buttonsGroup.children[3].y = 200
        
        //flute
        buttonsGroup.children[4].x = 200
        buttonsGroup.children[4].y = 200
    }
    
    function inputButton(instument){
		          
        if(pivot < cap && gameActive){
        
            if(correctAnswer[pivot] === instument.value){
                orchestaGroup.children[instument.value].setAnimationByName(0, "PLAY", false)
                pivot++
                sound.play(orchesta[instument.value].name)
                if(pivot === cap)
                    crescendo(true)
            }
            else{
                sound.play('error')
                orchestaGroup.children[instument.value].setAnimationByName(0, "PLAY_WRONG", false)
                crescendo(false)
            }
        }
        
        orchestaGroup.children[instument.value].addAnimationByName(0, "IDLE", true)
	}
    
    function crescendo(good){
        
        gameActive = false
        
        if(good){
            
            lvl++
            if(lvl % 2 === 0)
                cap++

            game.time.events.add(1000,function(){
                sound.play('song')
                for(var a = 0; a < orchestaGroup.length; a++){
                    orchestaGroup.children[a].setAnimationByName(0, "PLAY", false)
                    orchestaGroup.children[a].addAnimationByName(0, "IDLE", true)
                }
            },this)

            game.time.events.add(2500,function(){
                addPoint(1)
                initGame()
            },this)
        }
        else{
            
            game.time.events.add(1000,function(){
                sound.play('gameLose')
                for(var a = 0; a < orchestaGroup.length; a++){
                    orchestaGroup.children[a].setAnimationByName(0, "PLAY_WRONG", false)
                    orchestaGroup.children[a].addAnimationByName(0, "IDLE", true)
                }
            },this)

            game.time.events.add(2500,function(){
                missPoint()
                initGame()
            },this)
        }
    }
    
    function initGame(){
        
        pivot = 0
        gameActive = false
        
        for(var i = 0; i < cap; i++){
            correctAnswer[i] = game.rnd.integerInRange(0, 4)
        }
        
        if(lives !== 0){
            game.time.events.add(500,function(){
                var time = playDemo()

                game.time.events.add(time,function(){
                    gameActive = true
                },this)
            },this)
        }
        
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 4)
        if(x === numberSelect)
            return getRand()
        else
            return x     
    }
    
    function playDemo(){

        gameActive = false
        var delay = 500
        
        for(var i = 0; i < cap; i++){
            
            var r = correctAnswer[i]
            play(delay, r)
            delay += 1500
        }
        return delay
    }
    
    function play(delay, r){
        
        game.time.events.add(delay,function(){
            
            game.add.tween(orchestaGroup.children[r].scale).to({x:1.5, y:1.5},300,Phaser.Easing.linear,true).onComplete.add(function(){
                sound.play(orchesta[r].name)
                game.add.tween(orchestaGroup.children[r].scale).to({x:1, y:1},150,Phaser.Easing.linear,true)
            })
            orchestaGroup.children[r].setAnimationByName(0, "PLAY", false)
            orchestaGroup.children[r].addAnimationByName(0, "IDLE", true)
        },this)
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
	
	return {
		
		assets: assets,
		name: "symfunny",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);*/
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            initOrchesta()
            initBtn()
            createParticles()
			
			//buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()