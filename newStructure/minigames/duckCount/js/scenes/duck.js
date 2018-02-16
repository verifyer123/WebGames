
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var duck = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"multiple":"Multiple of 10",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"multiple":"Múltiplo de 10",
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.duck",
                json: "images/duck/atlas.json",
                image: "images/duck/atlas.png",
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
			{	name: "shoot",
				file: soundsPath + "laser2.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background, topBack,stars
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 66
    var overlayGroup
    var spaceSong
	var ducksGroup
	var timeToUse
	var indexGame
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		indexGame = 1
		timeToUse = 6000
        
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
        
        var pointsText = lookParticle('textPart')
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
		
		if(timeToUse > 1500){
			timeToUse-= 500
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.duck','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.duck','life_box')

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
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        

		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/dancing_baby.mp3');
		game.load.spine('duck', "images/spines/duck.json")  
        
		/*game.load.image('howTo',"images/duck/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/duck/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/duck/introscreen.png")*/

        game.load.image('tutorial_image',"images/duck/tutorial_image.png")
        //loadType(gameIndex)

		
		
        
    }
    
	function setNumbers(){
		
		var index = game.rnd.integerInRange(0,2)
		
		for(var i = 0; i < ducksGroup.length;i++){
			
			var duck = ducksGroup.children[i]
			duck.number = (game.rnd.integerInRange(1,9) * 10) + game.rnd.integerInRange(1,9)
			
			if(index == i){
				duck.number = indexGame * 10
			}
			
			//console.log(duck.number + ' number')
			duck.text.setText(duck.number)
		}	
	}
	
	function sendDucks(){
		
		setNumbers()
		
		gameActive = true
		var delay = 0
		for(var i = 0; i < ducksGroup.length;i++){
			
			var duck = ducksGroup.children[i]
			
			if(duck.tween){
				duck.tween.stop()
			}
			
			duck.x = game.world.width + 300
			duck.y = game.world.height - 350
			duck.pressed = false
			duck.alpha = 1
			
			duck.anim.setAnimationByName(0,"WALK",true)
			duck.tween = game.add.tween(duck).to({x:-300},timeToUse,"Linear",true,delay)
			delay+= timeToUse / 6
			
			if(duck.number % 10 == 0){
				duck.tween.onComplete.add(function(){
					missPoint()
                    game.time.events.add(400,function(){
                        if(lives !== 0)
                            sendDucks()
                    },this)
				})
			}
		}
		
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

        
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        sendDucks()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.duck','bg')
		background.anchor.setTo(0.5,0.5)
		background.width = game.world.width
		
		stars = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.duck','swatch_star')
		sceneGroup.add(stars)
		
		var botBack = sceneGroup.create(0,game.world.height,'atlas.duck','suelo')
		botBack.anchor.setTo(0,1)
		botBack.width = game.world.width
		
		topBack = game.add.tileSprite(0,0,game.world.width,222,'atlas.duck','techo')
		sceneGroup.add(topBack)
		
		
	}
	
	function update(){
		
		topBack.tilePosition.x+= 1
		
		stars.tilePosition.y-= 3
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

				particle.makeParticles('atlas.duck',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.duck','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.duck','smoke');
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
	
	function setDucks(animName){
		
		for(var i = 0; i < ducksGroup.length;i++){
			
			var duck = ducksGroup.children[i]
            
            if(duck.tween){
                duck.tween.stop()
            }
			
			if(!duck.pressed){

				duck.anim.setAnimationByName(0,animName,true)
				
				hideDuck(duck,animName)
				
			}
			
		}
	}
	
	function hideDuck(duck,animName){
		
		game.time.events.add(1000,function(){
					
			if(animName == "WIN"){
				duck.anim.setAnimationByName(0,"WALK",true)
				duck.tween = game.add.tween(duck).to({x:duck.x - game.world.width * 1.2},2000,"Linear",true,0)
			}
		})
	}
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
		sound.play("shoot")
		
		var parent = obj.parent
		
		if(parent.tween){
			parent.tween.stop()
		}
		parent.pressed = true
		gameActive = false
		
		game.add.tween(parent).to({angle:parent.angle + 360},500,"Linear",true)
		
		game.add.tween(parent).to({y:parent.y - 100},300,"Linear",true).onComplete.add(function(){
			game.add.tween(parent).to({y:game.world.height + 200},700,"Linear",true)
		})
		parent.anim.setAnimationByName(0,"JUMP",false)
		if(parent.number % 10 == 0){
            indexGame++
            if(indexGame > 10){
                indexGame = 1
            }
            
			addPoint(1)
			createPart('star',obj)
			setDucks("WIN")
			game.time.events.add(3000,sendDucks)
		}else{
            
			missPoint()
			createPart('wrong',obj)
			setDucks("LOSE")
            for(var i = 0; i < ducksGroup.length;i++){
                 game.add.tween(ducksGroup.children[i]).to({alpha:0},1500,"Linear",true)
            }
            game.time.events.add(3000,function(){
                if(lives !== 0)
                    sendDucks()
            },this)
		}
		
	}
	
	function createDucks(){
		
		ducksGroup = game.add.group()
		sceneGroup.add(ducksGroup)
		
		for(var i = 0; i < 3;i++){
			
			var duck = game.add.group()
			duck.x = game.world.width + 300
			duck.y = game.world.height - 350
			ducksGroup.add(duck)
			
			var anim = game.add.spine(0,100,'duck')
			anim.setAnimationByName(0,"WALK",true)
			anim.setSkinByName('normal')
			duck.add(anim)
			
			var slot = getSpineSlot(anim,"empty")

			var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var numberText = new Phaser.Text(game, 0, 0, '1', fontStyle)
			numberText.anchor.setTo(0.5, 0.5)
			duck.numberText = numberText
			slot.add(numberText)
			
			duck.anim = anim
			duck.text = numberText
			anim.autoUpdateTransform()
			
			var duckImage = duck.create(0,0,'atlas.duck','star')
			duckImage.scale.setTo(1.5,1.5)
			duckImage.alpha = 0
			duckImage.inputEnabled = true
			duckImage.events.onInputDown.add(inputButton)
			duckImage.anchor.setTo(0.5,0.5)
			
			duck.number = 0
			
		}
	}
	
	function getSpineSlot(spine, slotName){
		
		var slotIndex
		for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
			var slotData = spine.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index
			}
		}

		if (slotIndex){
			return spine.slotContainers[slotIndex]
		}
	}
	
	return {
		
		assets: assets,
		name: "duck",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createDucks()
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
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
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()