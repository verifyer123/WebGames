
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var hungry = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"addition":"Fraction \n Addition",
			
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"addition":"Suma de \n fracciones",
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.hungry",
                json: "images/hungry/atlas.json",
                image: "images/hungry/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
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
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "frog",
				file: soundsPath + "frog.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background,water
	var base, toadsGroup
    var gameActive = true
	var numToUse
	var lineToUse
	var shoot
	var particlesGroup, particlesUsed
	var clock
	var timeToUse
    var gameIndex = 43
	var indexGame
    var overlayGroup
    var spaceSong
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		timeToUse = 15000
        
        loadSounds()
        
	}

    function popObject(obj,delay,appear){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
			if(appear){

				obj.alpha = 1
            	game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
				if(obj.bee){
					obj.bee.pressed = false
				}
			}else{
				game.add.tween(obj.scale).to({x:0,y:0},250,"Linear",true).onComplete.add(function(){
					obj.scale.setTo(1,1)
					obj.alpha = 0
				})
			}
            
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
	
	function setOperation(){
		
		var number1 = game.rnd.integerInRange(6,10)
		var number2 = game.rnd.integerInRange(2,number1 - 1)
		
		toadsGroup.list[0].text.setText(number2 + '/' + number1)

		//Find numbers that ever can complete the fraction
		var value = number2 - 1
		var fractionValues = []
		while(value>0){
			if(value == 1){
				value = 0
				fractionValues.push(1)
			}
			else{
				var r 
				if(value > 4){
					r = game.rnd.integerInRange(2,3)
				}
				else{
					r = game.rnd.integerInRange(1,3)
				}

				if(value - r >= 0){
					value-=r
					fractionValues.push(r)
				}
				else if(value == 2){
					value = 0
					fractionValues.push(2)
				}
			}
		}

		

		//set correct bees
		var tempBeesIds = [0,1,2,3,4,5]
		var selectedBeesIds = []
		var currentId = 0

		for(var i = 0; i < fractionValues.length; i++){
			var r = game.rnd.integerInRange(0,tempBeesIds.length-1)
			selectedBeesIds.push(tempBeesIds[r])
		}

		selectedBeesIds.sort()



		for(var i = 0; i < beesGroup.length;i++){
			
			var number
			if(currentId < selectedBeesIds.length){
				if(i == selectedBeesIds[currentId]){
					var random = game.rnd.integerInRange(0,fractionValues.length-1)
					number = fractionValues[random]
					fractionValues.splice(r,1)
					currentId++
				}
				else{
					number = game.rnd.integerInRange(1,3)
				}
			}
			else{
				number = game.rnd.integerInRange(1,3)
			}
			
			var bee = beesGroup.children[i]
			bee.text.setText(number + '/' + number1)
			bee.number = number
		}
		
		toadsGroup.list[1].text.setText('1/' + number1)
		
		numToUse = number2
		toadsGroup.number = 1
		toadsGroup.number2 = number1
	}
	
	function setToadsAnim(name){
		
		toadsGroup.list[0].toad.setAnimationByName(0,name,true)
		toadsGroup.list[1].toad.setAnimationByName(0,name,true)
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
		
		if(pointsBar.number % 3 == 0){
			if(timeToUse> 3000){
				timeToUse-= 1000
			}
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.hungry','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.hungry','life_box')

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
    
	function angleToad(toad,multAngle,startAngle){
		
		if(toad.tween){
			toad.tween.stop()
		}
		
		game.add.tween(toad).to({angle:startAngle},100,"Linear",true)
		
		game.time.events.add(game.rnd.integerInRange(1,4) * 100,function(){
			toad.tween = game.add.tween(toad).to({angle:toad.angle + multAngle},500,"Linear",true,0,-1)
			toad.tween.yoyo(true,0)
		})
		
	}
	
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
		var numUsed = 5
		var angle1 = -25
		var angle2 = 40
		if(toadsGroup.number < numToUse){
			numUsed = -5
			angle1 = -40
			angle2 = 25
		}
		
		angleToad(toadsGroup.list[0],numUsed,angle1)
		angleToad(toadsGroup.list[1],numUsed,angle2)
			
		game.time.events.add(700,function(){
			setToadsAnim("LOSE")
		})
		
        gameActive = false
        spaceSong.stop()
        		
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
		buttons.getImages(game)
        
        game.load.spine('toad', "images/spines/frog.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/adventure.mp3');
        
		game.load.spritesheet('bee', 'images/hungry/bee.png', 138, 169, 20);
		/*game.load.image('howTo',"images/hungry/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/hungry/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/hungry/introscreen.png")*/
		game.load.image('tutorial_image',"images/hungry/tutorial_image.png")
		//loadType(gameIndex)


        
    }
    
	function showButtons(appear){
		
		var delay = 200
		
		for(var i = 0; i < beesGroup.length; i++){
			
			
			
			var button = beesGroup.children[i]
			
			if(!appear && button.alpha == 0){
				
			}else{
				delay+= 200
				popObject(button,delay,appear)
			}
			
		}
		
		if(appear){
			
			sound.play("frog")
			
			setToadsAnim("IDLE")
			
			
			
			for(var i = 0; i < toadsGroup.list.length;i++){

				var number = 1

				if(i==1){
					number = -1
				}
				
				var toad = toadsGroup.list[i].toad
				game.add.tween(toad).to({angle:toad.angle + (360 * number)},500,"Linear",true)

				var tween = game.add.tween(toad).to({y:toad.y - 200},250,"Linear",true,0,0)
				tween.yoyo(true,0)

				game.add.tween(toadsGroup.list[i].text).to({alpha:1},500,"Linear",true,500)
			}
			
			angleToad(toadsGroup.list[0],-5,-40)
			angleToad(toadsGroup.list[1],-5,25)
			
			game.time.events.add(delay,function(){
				
				gameActive = true
				
				var bar = clock.bar
				bar.scale.x = bar.origScale
				
				popObject(clock,0,true)
				
				bar.tween = game.add.tween(bar.scale).to({x:0},timeToUse,"Linear",true)
				bar.tween.onComplete.add(function(){
					missPoint()
				})
			})
		}
		
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)

       
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		setOperation()
		showButtons(true)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,411,'atlas.hungry','cielo')
		sceneGroup.add(background)
		
		var plants = sceneGroup.create(0,background.height,'atlas.hungry','plants')
		plants.width = game.world.width
		plants.anchor.setTo(0,1)
		
		var tween = game.add.tween(plants.scale).to({y:0.8},1500,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		water = game.add.tileSprite(0,background.height,game.world.width,game.world.height - background.height,'atlas.hungry','agua')
		sceneGroup.add(water)
		
	}
	
	function update(){
		
		background.tilePosition.x+= 0.4
		water.tilePosition.x--
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

				particle.makeParticles('atlas.hungry',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.hungry','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.hungry','smoke');
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
		
		if(!gameActive || obj.pressed){
			return
		}
		
		sound.play("frog")
		obj.pressed = true

		var parent = obj.parent
		
		var toad = toadsGroup.list[1].toad
		var text = toadsGroup.list[1].text
		
		toad.setAnimationByName(0,"EAT",false)
		toad.addAnimationByName(0,"IDLE",true)
		
		toadsGroup.number+= parent.number
		text.setText(toadsGroup.number + '/' + toadsGroup.number2)
		
		createTextPart('+' + parent.number,text)
		
		lineToUse.clear()
		lineToUse.lineStyle(10,0x105419,1);
		lineToUse.moveTo(text.world.x,text.world.y - 75)
		lineToUse.lineTo(obj.world.x, obj.world.y)
		lineToUse.alpha = 1
		game.add.tween(lineToUse).to({alpha:0},200,"Linear",true)
		
		game.add.tween(parent).to({x:text.world.x,y:text.world.y - 75,alpha:0},500,"Linear",true)
		game.add.tween(parent.scale).to({x:0.5,y:0.5},500,"Linear",true).onComplete.add(function(){
			parent.x = parent.origX
			parent.y = parent.origY
			parent.scale.setTo(1,1)
			
			lineToUse.scale.setTo(1,1)
		})
		
		sound.play("cut")
		
		if(toadsGroup.number == numToUse){
			
			clock.bar.tween.stop()
			gameActive = false
			addPoint(1)
			createPart('star',text)
			
			angleToad(toadsGroup.list[0],-10,-25)
			angleToad(toadsGroup.list[1],10,25)
			
			for(var i = 0; i < toadsGroup.list.length;i++){
				var text = toadsGroup.list[i].text
				game.add.tween(text).to({alpha:0},500,"Linear",true)
			}
			
			game.time.events.add(700,function(){
				setToadsAnim("WIN")
			})
			
			game.add.tween(clock).to({alpha:0},500,"Linear",true)
			
			showButtons(false)
			game.time.events.add(2000,function(){
				
				setOperation()
				showButtons(true)
			})
		}else if(toadsGroup.number > numToUse){
			clock.bar.tween.stop()
			missPoint()
			
			createPart('wrong',text)
		}
	}
	
	function createToads(){
		
		base = sceneGroup.create(game.world.centerX, game.world.height - 150,'atlas.hungry','baseBalanza')
		base.anchor.setTo(0.5,0.5)
		
		toadsGroup = game.add.group()
		toadsGroup.x = base.x
		toadsGroup.y = base.y - 25
		sceneGroup.add(toadsGroup)
		
		var groupLeft = game.add.group()
		groupLeft.angle = -25
		groupLeft.startAngle = groupLeft.angle
		toadsGroup.add(groupLeft)
		
		var armLeft = groupLeft.create(0,0,'atlas.hungry','arm')
		armLeft.anchor.setTo(1,1)
		armLeft.scale.setTo(1.5,1.5)
		
		var leafBase = groupLeft.create(-100,-215,'atlas.hungry','balanza')
		leafBase.angle = 25
		leafBase.anchor.setTo(0.5,0.5)
		
		var toad = game.add.spine(leafBase.x,leafBase.y,"toad")
		toad.angle = 25
		toad.setAnimationByName(0,"IDLE",true)
		toad.setSkinByName("coffee")
		groupLeft.add(toad)
		
		var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, toad.x + 18, toad.y - 35, "0/0", fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
		pointsText.angle = -groupLeft.angle
        groupLeft.add(pointsText)
		
		groupLeft.toad = toad
		groupLeft.text = pointsText
		
		var groupRight = game.add.group()
		groupRight.angle = 25
		groupRight.startAngle = groupRight.angle
		toadsGroup.add(groupRight)
		
		var armRight = groupRight.create(0,0,'atlas.hungry','arm')
		armRight.anchor.setTo(1,1)
		armRight.scale.setTo(-1.5,1.5)
		
		var leafBase = groupRight.create(100,-215,'atlas.hungry','balanza')
		leafBase.scale.x = -1
		leafBase.angle = -25
		leafBase.anchor.setTo(0.5,0.5)
		
		var toad = game.add.spine(leafBase.x,leafBase.y,"toad")
		toad.angle = -25
		toad.setAnimationByName(0,"IDLE",true)
		toad.setSkinByName("green")
		groupRight.add(toad)
		
		var pointsText = new Phaser.Text(sceneGroup.game, toad.x - 18, toad.y - 35, "0/0", fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
		pointsText.angle = -groupRight.angle
        groupRight.add(pointsText)
		
		groupRight.toad = toad
		groupRight.text = pointsText
		
		var centerBase = toadsGroup.create(0,0,'atlas.hungry','centroBalanza')
		centerBase.anchor.setTo(0.5,0.5)
		
		toadsGroup.list = [groupLeft,groupRight]
		
		groupLeft.text.alpha = 0
		groupRight.text.alpha = 0
		
		for(var i = 0; i < toadsGroup.list.length;i++){
			
			var group = toadsGroup.list[i]
			
			//group.tween = game.add.tween(group).to({angle:group.angle * 1.2},500,"Linear",true,0,-1)
			//group.tween.yoyo(true,0)
		}
		
		lineToUse = game.add.graphics(0,0);
		lineToUse.lineStyle(10,0x105419,1);
		lineToUse.beginFill();
		lineToUse.moveTo(0,0);
		lineToUse.lineTo(game.world.centerX,game.world.centerY);
		lineToUse.endFill();
		lineToUse.alpha = 0
		sceneGroup.add(lineToUse)
		
	}
	
	function playDelay(obj,delay,animName){
		
		game.time.events.add(delay, function(){
			obj.animations.play(animName,24,true)
		})
	}
	
	function createBees(number){
	
		beesGroup = game.add.group()
		sceneGroup.add(beesGroup)
		
		var pivotX = game.world.centerX - 200
		var pivotY = game.world.centerY - 300
		
		for(var i = 0; i < 6; i ++){
			
			var group = game.add.group()
			group.x = pivotX
			group.y = pivotY - game.rnd.integerInRange(10,50)
			group.origX = group.x
			group.origY = group.y
			group.alpha = 0
			beesGroup.add(group)
			
			var object = game.add.sprite(0, 0, 'bee');
			object.animations.add('walk');
			object.anchor.setTo(0.5,0.5)
			playDelay(object,game.rnd.integerInRange(100,600),'walk')
			object.inputEnabled = true
			object.events.onInputDown.add(inputButton)
			object.pressed = false
			group.add(object)
			
			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 20, 30, "0/0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)
			
			group.text = pointsText
			group.bee = object
			
			pivotX+= game.rnd.integerInRange(200,230)
			
			if((i+1) % 3 == 0){
				pivotX = game.world.centerX - 200
				pivotY+= 200
			}
		}
	}			
		
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = game.world.height - 75
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.hungry','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.hungry','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "hungry",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createToads()
			createBees()
			createClock()
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