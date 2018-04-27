
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"

var beach = function(){
    
    var localizationData = {
		"EN":{
		
		},

		"ES":{

		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.beach",
                json: "images/beach/atlas.json",
                image: "images/beach/atlas.png",
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
			{	name: "splash",
				file: soundsPath + "splash.mp3"},
			{	name: "splashMud",
				file: soundsPath + "splashMud.mp3"},
			
		],
    }
    
	var angleToUse = -15
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 13
	var seaTile
	var result
	var bar,slash
	var sky
    var overlayGroup
	var hitSquare
	var whiteFade
    var puzzleSong
	var objectsGroup,usedObjects, containerGroup
	var treeGroup
	var multiple
	var gameSpeed
	var yogotar
		
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		gameSpeed = 3
		gameActive = false
        
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
        
		gameActive = false		
		
        sound.play("wrong")
		        
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
		
		createTextPart('+' + number,containerGroup.text)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)	
		
		gameSpeed+= 0.25
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.beach','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.beach','life_box')

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
		
		yogotar.setAnimationByName(0,"LOSE",false)
		yogotar.addAnimationByName(0,"LOSESTILL",true)
		
        gameActive = false
        puzzleSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;  

        
        game.load.spine('nao', "images/spines/skeleton.json")  
        game.load.audio('puzzleSong', soundsPath + 'songs/chinese_new_year.mp3');
        
		/*game.load.image('howTo',"images/beach/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/beach/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/beach/introscreen.png")*/

		game.load.image('tutorial_image',"images/beach/tutorial_image.png")
		//loadType(gameIndex)

		
		//console.log(localization.getLanguage() + ' language')
        
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
	
	function setNumber(){
		
		var sign = '+'
		
		var number1 = game.rnd.integerInRange(1,10)
		var number2 = game.rnd.integerInRange(1,10)
		var textToUse
		
		if(Math.random()*2 < 1){
			
			sign = '-'
			while(number1 < number2){
				number1 = game.rnd.integerInRange(1,10)
			}
		}
		
		if(sign == '+'){
			result = number1 + number2
		}else{
			result = number1 - number2
		}
		
		textToUse = number1 + ' ' + sign + ' ' + number2
		
		var text = containerGroup.text
		text.setText(textToUse)
		text.alpha = 0
		
		popObject(text,500)
		game.time.events.add(1500,sendCocos)
	}
	
	function sendCocos(){
		
		gameActive = true
			
		var pivotX = game.world.centerX - 215
		var indexCorrect = game.rnd.integerInRange(0,2)
		
		for(var i = 0; i < 3; i++){
			
			var coco = getObject('coconut')
			coco.cut = false
			activateObject(coco,pivotX,game.rnd.integerInRange(1,4) * -20)
			
			var numberToUse = result
			
			if(i == indexCorrect){
				
				coco.text.setText(numberToUse)
			}else{
				
				while(numberToUse == result){
					numberToUse = game.rnd.integerInRange(1,20)
				}
				
				coco.text.setText(numberToUse)
			}
			
			coco.value = numberToUse
			
			pivotX+= 225
			
		}
		
		//console.log(usedObjects.length + ' length')
	}
	
    function createOverlay(){
        
		hitSquare = sceneGroup.create(0,game.world.height,'atlas.beach','cocoBreak')
		hitSquare.anchor.setTo(0.5,0.5)
		hitSquare.scale.setTo(0.6,0.6)
		hitSquare.alpha = 0
		sceneGroup.add(hitSquare)
		
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width *2, game.world.height *2)
        whiteFade.alpha = 0
        whiteFade.endFill()
		sceneGroup.add(whiteFade)
		
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
				
				setNumber()
								
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.beach','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.beach',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.beach','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }
   

   function onClickPlay(){
   		overlayGroup.y = -game.world.height
				
		setNumber()
   }

	function createBackground(){
		
		var bottom = game.add.tileSprite(0,game.world.height,game.world.width,176,'atlas.beach','bottom')
		bottom.anchor.setTo(0,1)
		sceneGroup.add(bottom)
		
		sky = game.add.tileSprite(0,0,game.world.width,game.world.height - bottom.height,'atlas.beach','sky')
		sceneGroup.add(sky)
		
		seaTile = game.add.tileSprite(0,game.world.height - 176,game.world.width,146,'atlas.beach','sea')
		seaTile.anchor.setTo(0,1)
		sceneGroup.add(seaTile)
		
	}
	
	function update(){
		//tutorialUpdate()
		sky.tilePosition.x+=0.5
		seaTile.tilePosition.x--
		
		if(!gameActive){
			return
		}
		
		checkObjects()
	}
	
	function checkObjects(){
		
		//hitSquare.x = -200
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i].coconut
			var parent = obj.parent
			
			if(parent.active){
				parent.y+=gameSpeed
			}
			
			if(parent.y >= game.world.height - 250){
				missPoint()
				breakCocos(false)
				sound.play("splash")
			}
			
			if(checkOverlap(hitSquare,obj)){
				
				slash.x = obj.world.x
				slash.y = obj.world.y
				game.add.tween(slash).from({alpha:1},500,"Linear",true)
				
				parent.cut = true

				game.add.tween(whiteFade).from({alpha:1},500,"Linear",true)

				sound.play("cut")
				//console.log(parent.value + ' value')
				yogotar.setAnimationByName(0,"ATTACK",false)
				yogotar.addAnimationByName(0,"IDLE",true)

				if(parent.value == result){
					addPoint(1)
					sound.play("splashMud")
				}else{
					missPoint()
					createPart('wrong',obj)
					sound.play("splash")
				}
				breakCocos(true)
			}
			
		}
	}
	
	function disappearCoco(bCoco){
		
		game.add.tween(bCoco).to({y:bCoco.y+game.rnd.integerInRange(3,6) * 30,alpha:0},500,"Linear",true).onComplete.add(function(){
			bCoco.active = false
		})
		
	}
	
	function fadeCoco(coco){
		
		game.add.tween(coco).to({alpha:0, y:coco.y + 100},500,"Linear",true).onComplete.add(function(){
			deactivateObject(coco)
		})
	}
	
	function breakCocos(cocoBreak){
		
		while(usedObjects.length > 0){
			
			var coco = usedObjects.children[0]	
			if(coco){
				
				if(coco.cut){
					createPart('splash',coco.coconut)
					deactivateObject(coco)
				}else{
					usedObjects.remove(coco)
					objectsGroup.add(coco)
					fadeCoco(coco)
				}
				
				if(!cocoBreak){
					createPart('splash',coco.coconut)
				}
								
				if(cocoBreak && coco.cut){
					
					var pivotX = -50
					var angle = 30

					for(var i = 0; i < 2;i++){

						var bCoco = getObject('cocoBreak')
						bCoco.active = true
						bCoco.alpha = 1
						bCoco.angle = angle
						bCoco.x = coco.x + pivotX
						bCoco.y = coco.y

						disappearCoco(bCoco)
						pivotX+= 100
						angle-=60
					}
				}
				
			}
			
		}
		
		if(gameActive){
			game.time.events.add(1500,setNumber)
		}
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

            game.add.tween(pointsText).to({y:pointsText.y - 75},1250,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 750)

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
		
		var posX = obj.x
		var posY = obj.y
		
		if(obj.world){
			posX = obj.world.x
			posY = obj.world.y
		}
        if(particle){
            
            particle.x = posX + offX
            particle.y = posY
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
                particle = particlesGroup.create(-200,0,'atlas.beach',tag)
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
			
			var exp = sceneGroup.create(0,0,'atlas.beach','cakeSplat')
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

        particlesGood.makeParticles('atlas.beach',tagToUse);
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
			
			var group = game.add.group()
			group.tag = tag
			group.scale.setTo(scale,scale)
			group.alpha = 0
			group.active = false
			objectsGroup.add(group)
			
			var obj = group.create(0,0,'atlas.beach',tag)
			obj.anchor.setTo(0.5,0.5)
			
			if(tag == 'coconut'){
				
				obj.inputEnabled = true
				group.coconut = obj
				obj.cut = false
				
				var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		
				var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "", fontStyle)
				pointsText.anchor.setTo(0.5,0.5)
				group.add(pointsText)
				
				group.text = pointsText
				group.value = 0
			}
			
		}
	}
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',5)
		createParticles('splash',5)
		createParticles('text',5)
		
	}
	
	function createTrees(){
		
		treeGroup = game.add.group()
		sceneGroup.add(treeGroup)
		
		var pivotX = game.world.centerX - 210
		
		for(var i = 0; i < 3; i++){
			
			var tree = treeGroup.create(pivotX,0,'atlas.beach','tree')
			tree.anchor.setTo(0.5,0)
			tree.height = game.world.height - 175
			
			pivotX+= 225
			
		}
	}
	
	function createContainer(){
		
		containerGroup = game.add.group()
		containerGroup.x = game.world.centerX
		containerGroup.y = game.world.height - 50
		sceneGroup.add(containerGroup)
		
		var container = containerGroup.create(0,0,'atlas.beach','container')
		container.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        containerGroup.add(pointsText)
		
		containerGroup.text = pointsText
		
		yogotar = game.add.spine(containerGroup.x, containerGroup.y - 40,"nao")
		yogotar.setSkinByName("normal")
		yogotar.setAnimationByName(0,"IDLE",true)
		sceneGroup.add(yogotar)
		
	}
	
	function createCoconuts(){
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAssets('coconut',1,6)
		createAssets('cocoBreak',1,6)
		//createAssets('slash',1,5)
		
		slash = sceneGroup.create(0,0,'atlas.beach','slash')
		slash.scale.setTo(2.5,2.5)
		slash.anchor.setTo(0.5,0.5)
		slash.alpha = 0
	}
	
	function movePointer(pointer){
		
		if(!gameActive){
			return
		}
		
		var follow = false
		
		if(game.device.desktop){
			
			if(game.input.activePointer.isDown){
				follow = true	
			}
		}else{
			follow = true
		}
		
		if(follow){
			
			hitSquare.x = pointer.x 
			hitSquare.y = pointer.y
		}
		
	}
	
	function deactivatePart(part){
		
		game.add.tween(part.scale).to({x:0,y:0},50,"Linear",true).onComplete.add(function(){
			part.scale.setTo(1,1)
			part.active = false
		})
	}
	
	function restartPointer(){
		
		hitSquare.x = -200
		
		game.time.events.add(100,restartPointer)
	}
	return {
		
		assets: assets,
		name: "beach",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			this.swipe = new Swipe(this.game);
			game.input.addMoveCallback(movePointer, this);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createTrees()
			createContainer()
			createCoconuts()
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
			
			restartPointer()
            
		},
	}
}()