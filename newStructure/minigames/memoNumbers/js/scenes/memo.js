
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var memo = function(){
    
    var localizationData = {
		"EN":{
		
		},

		"ES":{

		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.memo",
                json: "images/memo/atlas.json",
                image: "images/memo/atlas.png",
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
			{	name: "whoosh",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "spaceShip",
				file: soundsPath + "spaceShip.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			{	name: "bomb",
				file: soundsPath + "bomb.mp3"},
			
		],
    }
    
	var angleToUse = -15
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive
	var particlesGroup, particlesUsed
	var offWorld = -15
    var gameIndex = 12
	var buttonsGroup
	var numberPanel,bar
    var overlayGroup
    var puzzleSong
	var objectsGroup,usedObjects
	var multiple
	var gameSpeed
	var digitNumber, tableNumber, tableUsed, textUse
		
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		gameSpeed = 3
		gameActive = false
		digitNumber = 2
		multiple = 10
        
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
	
	function showButtons(){
		
		popObject(numberPanel,0)
		var delay = 500
		
		for(var i = 0; i < buttonsGroup.length; i++){
			
			var button = buttonsGroup.children[i]
			popObject(button,delay)
			
			delay+= 100
		}

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
        
		gameActive = false		
		
        sound.play("wrong")
		sound.play("bomb")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }else{
			
			restartPlayer()
		}
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
		
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
		
		createTextPart('+' + number,numberPanel.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		
		gameSpeed+= 0.2
		
		if(pointsBar.number % multiple == 0){
			digitNumber++			
			if(digitNumber>=5){
				numberPanel.number.scale.x *=0.8
				numberPanel.number.scale.y *=0.8
				
				numberPanel.scaleToUse = numberPanel.scale.x
			}
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.memo','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.memo','life_box')

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
        puzzleSong.stop()
        		
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

        
        game.load.spine('figures', "images/spines/skeleton.json")  
        game.load.audio('puzzleSong', soundsPath + 'songs/upbeat_casual_8.mp3');
        
		/*game.load.image('howTo',"images/memo/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/memo/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/memo/introscreen.png")*/
		game.load.image('gradient',"images/memo/gradient.png")
		
		game.load.image('tutorial_image',"images/memo/tutorial_image.png")
		//loadType(gameIndex)

        
    }
	
	function activateObject(obj,posX, posY){
		
		objectsGroup.remove(obj)
		usedObjects.add(obj)
		
		obj.alpha = 1
		obj.active = true
		obj.x = posX
		obj.y = posY
		
	}
	
	function deactivateObject(obj){
		
		//console.log('deactivate')
		
		obj.alpha = 0
		obj.active = false
		
		usedObjects.remove(obj)
		objectsGroup.add(obj)
	}
	
	function getObject(tag){
		
		for(var i = 0; i < objectsGroup.length;i++){
			var object = objectsGroup.children[i]
			
			if(object.tag == tag && !object.active){
				return object
			}
		}
	}
	
	function setButtonsAlpha(alpha){
		
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var btn = buttonsGroup.children[i]
			btn.alpha = alpha
		}
	}
	
	function setNumber(){
		
		setButtonsAlpha(0.5)
		
		tableNumber = []
		tableUsed = []
		textUse = ''
		
		numberPanel.number.alpha = 1
		
		for(var i = 0; i < digitNumber;i++){
			
			tableNumber[i] = game.rnd.integerInRange(1,8)
			textUse+= tableNumber[i]
		}
		
		sound.play("pop")
		
		var number = numberPanel.number
		number.setText(textUse)
		game.add.tween(number.scale).from({x:0,y:0},200,"Linear",true)
		
		game.time.events.add(1000,function(){
			
			game.add.tween(number.scale).to({x:0,y:0},200,"Linear",true).onComplete.add(function(){
				
				number.scale.setTo(number.scaleToUse,number.scaleToUse)
				number.setText('')
				textUse = ''
				gameActive = true
				
				setButtonsAlpha(1)
			})
			
		})
		
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
        
        /*var rect = new Phaser.Graphics(game)
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
				showButtons()
				
				game.time.events.add(1500,setNumber)
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.memo','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.memo',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.memo','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		showButtons()
		
		game.time.events.add(1500,setNumber)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height, 'atlas.memo','back');
		sceneGroup.add(background)
		
		var gradient = sceneGroup.create(0,0,'gradient')
		gradient.width = game.world.width
		gradient.height = game.world.height	
		
		bar = game.add.tileSprite(0,game.world.centerY - 200,game.world.width,70,'atlas.memo','bar')
		sceneGroup.add(bar)
		
		
		numberPanel = game.add.group()
		numberPanel.x = game.world.centerX
		numberPanel.y = game.world.centerY - 170
		numberPanel.alpha = 0	
		sceneGroup.add(numberPanel)
		
		var panel = numberPanel.create(0,0,'atlas.memo','numberPanel')
		panel.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
		var numberText = new Phaser.Text(sceneGroup.game, 0, 10, '', fontStyle)
		numberText.anchor.setTo(0.5,0.5)
		numberText.scaleToUse = numberText.scale.x
		numberPanel.add(numberText)
		
		numberPanel.number = numberText
	}
	
	function inputButton(button){
		
		if(!gameActive || !button.active){
			return
		}
		
		button.active = false
		
		sound.play('pop')
		
		tableUsed[tableUsed.length] = button.value
		var index = tableUsed.length - 1
		
		textUse+=tableUsed[index]
		numberPanel.number.setText(textUse)
		
		if(button.value != tableNumber[index]){
			
			missPoint()
			setExplosion(numberPanel)
			
			createPart('wrong',button)
			game.add.tween(numberPanel).to({alpha:0,angle:360},500,"Linear",true)

		}else{
			
			createPart('star', button)
			var timesTween = 2
			
			if((index + 1) == tableNumber.length){
				
				setButtonsAlpha(0.5)
				addPoint(1)
				
				sound.play('combo')
				gameActive = false
				
				game.add.tween(numberPanel.number).to({alpha:0},500,"Linear",true,1000)
				game.time.events.add(2000,setNumber)
				
				setExplosion(numberPanel,'star',100)
				
				
			}else{
				addPoint(1)
				
				timesTween = 0
			}
			
			var tween = game.add.tween(numberPanel.scale).to({x:0.6,y:0.6},150,"Linear",true,0,timesTween)
			tween.yoyo(true,0)
			
		}
		
		var parent = button.parent
		
		game.add.tween(parent.scale).to({x:0.7,y:0.7},100,"Linear",true).onComplete.add(function(){
			game.add.tween(parent.scale).to({x:1,y:1},100,"Linear",true).onComplete.add(function(){
				button.active = true
			})
		})
	}
	
	function createButtons(){
		
		var buttonsBar = new Phaser.Graphics(game)
        buttonsBar.beginFill(0x000000)
        buttonsBar.drawRect(0,game.world.centerY + 70,game.world.width,300)
        buttonsBar.alpha = 0.5
        buttonsBar.endFill()
		sceneGroup.add(buttonsBar)
		
		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
		
		var pivotX = game.world.centerX - 200
		var pivotY = game.world.centerY + 150
		
		for(var i = 0; i < 8;i++){
			
			var button = game.add.group()
			button.alpha = 0
			button.x = pivotX
			button.y = pivotY
			buttonsGroup.add(button)
			
			var buttonImage = button.create(0,0,'atlas.memo','button')
			buttonImage.anchor.setTo(0.5,0.5)
			buttonImage.value = i+1
			buttonImage.inputEnabled = true
			buttonImage.active = true
			buttonImage.events.onInputDown.add(inputButton)
			
			var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
                
			var numberText = new Phaser.Text(sceneGroup.game, 0,5, i+1, fontStyle)
			numberText.anchor.setTo(0.5,0.5)
			button.add(numberText)
			
			pivotX+= buttonImage.width * 1.2
			
			if((i+1) % 4 == 0){
				pivotX = game.world.centerX - 200
				pivotY+= buttonImage.height * 1.2
			}

		}
		
		
	}
	
	function update(){
		
		background.tilePosition.x+= 5
		bar.tilePosition.x--
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('textPart')
        
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
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
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
                particle = particlesGroup.create(-200,0,'atlas.memo',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }

	function setExplosion(obj,tag,offset){
		
		var tagToUse = tag || 'smoke'
        var offY = offset || 0

		var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
		
		if(!tag){
			
			var exp = sceneGroup.create(0,0,'atlas.memo','cakeSplat')
			exp.x = posX
			exp.y = posY
			exp.anchor.setTo(0.5,0.5)

			exp.scale.setTo(6,6)
			game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
			var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
			
			var rect = new Phaser.Graphics(game)
			rect.beginFill(0xffffff)
			rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
			rect.alpha = 0
			rect.endFill()
			sceneGroup.add(rect)

			game.add.tween(rect).from({alpha:1},500,"Linear",true)
			
		}
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.memo',tagToUse);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY + offY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function createAssets(tag,scale,number){
		
		for( var i = 0; i < number;i++){
			
			var obj = objectsGroup.create(0,0,'atlas.memo',tag + 'Base')
			obj.anchor.setTo(0.5,0.5)
			obj.tag = tag
			obj.angle= -angleToUse
			obj.scale.setTo(scale,scale)
			obj.alpha = 0
			obj.active = false
		}
	}
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',5)
		createParticles('text',5)
	}
	
	return {
		
		assets: assets,
		name: "memo",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			this.swipe = new Swipe(this.game);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createButtons()
			addParticles()
                        			
            puzzleSong = game.add.audio('puzzleSong')
            game.sound.setDecodedCallback(puzzleSong, function(){
                puzzleSong.loopFull(0.6)
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
			
			buttons.getButton(puzzleSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()