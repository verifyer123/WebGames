
var soundsPath = "../../shared/minigames/sounds/"
var evening = function(){
    
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
                name: "atlas.evening",
                json: "images/evening/atlas.json",
                image: "images/evening/atlas.png",
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
			{	name: "robotBeep",
				file: soundsPath + "robotBeep.mp3"},
			{	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background,clouds
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 45
	var indexGame
    var overlayGroup
    var spaceSong
	var starCont, mainCont
	var objectsGroup, usedObjects, animObjects
	var indexColor
	var pieceList
	var isOdd
	var timeUsed
	
	var colorsToUse = [0x62F68F,0xF6F462,0xF662E6,0xA462F6,0xF68562]

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		indexColor = 0
		timeUsed = 13000
		
        
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0.01, y:0.01},250,Phaser.Easing.linear,true)
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
        
        sound.play("pop")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		
		if(pointsBar.number % 12){
			if(timeUsed > 5000){
				timeUsed-= 500
			}
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.evening','xpcoins')
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
	
	function checkOdd(number){
		
		if(isOdd){
			if(number % 2 == 0){
				return true
			}else{
				return false
			}
		}else{
			if(number % 2 != 0){
				return true
			}else{
				return false
			}
		}
	}
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.evening','life_box')

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
		buttons.getImages(game)
        
        game.load.audio('spaceSong', soundsPath + 'songs/technology_action.mp3');
        
		game.load.spritesheet('sleepStar', 'images/evening/starSprite.png', 99, 97, 23);
		game.load.image('howTo',"images/evening/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/evening/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/evening/introscreen.png")
		
		console.log(localization.getLanguage() + ' language')
        
    }
	
	function setColorCont(){
		
		mainCont.star.tint = colorsToUse[indexColor]
		mainCont.number = game.rnd.integerInRange(1,9)
		mainCont.text.setText(mainCont.number)
		indexColor++
		
		if(indexColor > colorsToUse.length - 1){
			indexColor = 0
		}
		
		var star = mainCont.star
		star.alpha = 1
		mainCont.text.alpha = 1
		
		game.add.tween(star).from({alpha:0,angle:star.angle - 360},500,"Linear",true)
		game.add.tween(mainCont.text).from({alpha:0},500,"Linear",true)
		
	}
    
	function delayAdd(row, delay){
		
		game.time.events.add(delay, function(){
			addStar(row)		
		})
	}
	
    function createOverlay(){
        
		setColorCont()
		
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
				gameActive = true
				
				var delay = 200
				for(var i = 0; i < 3; i++){
					delayAdd(usedObjects.rows[i*2],delay)
					delay+=300
				}
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.evening','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.evening',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.evening','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		var base = sceneGroup.create(0,game.world.height,'atlas.evening','base')
		base.anchor.setTo(0,1)
		base.width = game.world.width
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height - base.height,'atlas.evening','sky')
		sceneGroup.add(background)
		
		clouds = game.add.tileSprite(0,background.height,game.world.width,148,'atlas.evening','clouds')
		clouds.anchor.setTo(0,1)
		sceneGroup.add(clouds)
		
		starCont = sceneGroup.create(game.world.centerX,game.world.height - 15,'atlas.evening','cont')
		starCont.width*= 1.1
		starCont.anchor.setTo(0.5,1)
		
	}
	
	function update(){
		
		background.tilePosition.x+= 0.3
		clouds.tilePosition.x-= 0.2
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

				particle.makeParticles('atlas.evening',tag);
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
		
		createParticles('star',4)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',3)

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
		
        var exp = sceneGroup.create(0,0,'atlas.evening','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.evening','smoke');
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
		
		gameActive = false
		
		var row = obj.row
		addStar(row)
		
	}
	
	function deactivateObject(obj){
		
		usedObjects.remove(obj)
		objectsGroup.add(obj)
		
		obj.alpha = 0
		obj.y = -200
		obj.row = null
		
		if(obj.tween){
			obj.tween.stop()
			obj.tween = null
			obj.scale.setTo(1,1)
		}
	}
	
	function activateObject(obj,posX, posY){
		
		objectsGroup.remove(obj)
		usedObjects.add(obj)
		
		if(!obj.anim){
			
			obj.star.tint = mainCont.star.tint
			obj.number = mainCont.number
			obj.text.setText(obj.number)
			
			if(Math.random()*2 > 1){
				
				//console.log('dissappear')
				obj.tween = game.add.tween(obj.scale).to({x:0.8,y:0.8},timeUsed + game.rnd.integerInRange(1,timeUsed/1000) * 1000,"Linear",true)
				obj.tween.onComplete.add(function(){

					var anim = getAnim()
					animObjects.remove(anim)
					anim.alpha = 1
					obj.add(anim)
					anim.x = 0
					anim.y = 0
					obj.anim = true

					//addStar(anim.row,anim)
					popObject(obj,0)
					sound.play("robotBeep")
					createPart("smoke",obj.star)
					//game.add.tween(anim).from({alpha:0,angle:anim.angle-360},500,"Linear",true)
				})
			}
			
		}
		
		obj.x = posX
		obj.y = posY
		obj.alpha = 1
				
	}
	
	function getAnim(){
		
		for(var i = 0; i < animObjects.length;i++){
			var anim = animObjects.children[i]
			if(anim.alpha == 0){
				return anim
			}
		}
		
	}
	
	function addStar(row, piece){
		
		var star = piece || getStar()
		var startY = -100
		var timeToUse = 500
		var angleToUse = star.angle + 720
		
		if(piece){
			timeToUse = 150
			startY = piece.y
			angleToUse = piece.angle
			
			if(piece.anim){
				timeToUse = 500
			}
			
		}else{
			
			star.row = row
			activateObject(star,row.pivotX,startY)
			setColorCont()
		}
		
		
		game.add.tween(star).to({y:row.pivotY,angle:angleToUse},timeToUse,"Linear",true).onComplete.add(function(){
			
			if(!piece){
				sound.play("flipCard")
			}
			
			if(star.y < 200){
				createPart("wrong",star.star)
				missPoint()
			}else{
				checkPieces(star)
				gameActive = true
			}
			
		})
		
		sound.play("cut")
		
		row.pivotY-= 95
		
	}
	
	function checkPieces(piece){
		
		isOdd = false
		if(piece.number % 2 == 0){
			isOdd = true
		}
		
		pieceList = []
                
        for(var i = 0; i < usedObjects.length; i ++){
            usedObjects.children[i].check = false
        }
        
        checkAllPieces(piece)
        
		//console.log(pieceList.length + ' length')
        if(pieceList.length >= 4){

            sound.play("magic")
			
            for(var i = 0; i < pieceList.length;i++){
				
                var piece = pieceList[i]
                createPart('star',piece.star)
				createTextPart('+1',piece.star)
                deactivateObject(piece)
				addPoint(1)
            }
						
			restartRows()
						
        }
		
	}
	
	function restartRows(){
		
		for(var i = 0; i < usedObjects.rows.length;i++){
				
			var row = usedObjects.rows[i]
			row.pivotY = row.startPivot	
		}

		for(var i = 0; i < usedObjects.length;i++){

			var obj = usedObjects.children[i]
			addStar(obj.row,obj)
		}
	}
	
	function checkAllPieces(piece){
		
		if(checkOdd(piece.number) && !piece.anim){
			
			piece.check = true
        	pieceList[pieceList.length] = piece
		}else{
			return
		}
        
        for(var i = 0; i < usedObjects.length;i++){
            
            var checkPiece = usedObjects.children[i]
            
            if(!checkPiece.check && checkOdd(checkPiece.number)){
                				
                if(Math.abs(piece.x - checkPiece.x) < piece.width * 0.3){
                    if(Math.abs(piece.y - checkPiece.y) < piece.width * 1.5){
                        checkAllPieces(checkPiece)
                    }
                }else if(Math.abs(piece.y - checkPiece.y) < piece.height * 0.3){
                    if(Math.abs(piece.x - checkPiece.x) < piece.width * 1.5){
                        checkAllPieces(checkPiece)
                    }
                }
            }
            
            
            
        }
		
	}
	
	function getStar(){
		
		for(var i = 0; i < objectsGroup.length;i++){
			
			var star = objectsGroup.children[i]
			return star
		}
	}
	
	function createStars(){
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		for(var i = 0; i < 40;i++){
			
			var starGroup = game.add.group()
			starGroup.x = 0
			starGroup.y = -200
			starGroup.alpha = 0
			objectsGroup.add(starGroup)
			
			var star = starGroup.create(0,0,'atlas.evening','gameStar')
			star.anchor.setTo(0.5,0.5)
			starGroup.star = star
			
			var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 7, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			starGroup.add(pointsText)
			starGroup.text = pointsText
			
		}
		
		usedObjects.rows = []
		
		var pivotX = starCont.x - 187
		for(var i = 0; i < 5;i++){
						
			//var row = usedObjects.rows[i]
			var row = []
			
			row.pivotX = pivotX
			row.pivotY = starCont.y - 100
			row.startPivot = row.pivotY
						
			var rect = new Phaser.Graphics(game)
			rect.beginFill(0x000000)
			rect.drawRect(row.pivotX,row.pivotY,91,starCont.height)
			rect.alpha = 0
			rect.endFill()
			rect.inputEnabled = true
			rect.x-= rect.width * 0.5
			rect.y-= rect.height * 0.85
			rect.events.onInputDown.add(inputButton)
			sceneGroup.add(rect)
			
			rect.row = row
			
			pivotX += 95
			
			usedObjects.rows[i] = row
		}
		
	}
	
	function createContainer(){
		
		mainCont = game.add.group()
		mainCont.x = game.world.centerX
		mainCont.y = 70
		mainCont.scale.setTo(0.85,0.85)
		sceneGroup.add(mainCont)
		
		var contImage = mainCont.create(0,0,'atlas.evening','container')
		contImage.anchor.setTo(0.5,0.5)
		
		var star = mainCont.create(0,-3,'atlas.evening','gameStar')
		star.anchor.setTo(0.5,0.5)
		mainCont.star = star
		
		var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 2, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        mainCont.add(pointsText)
		mainCont.text = pointsText
		
	}
	
	function createAnim(){
		
		animObjects = game.add.group()
		sceneGroup.add(animObjects)
		
		for(var i = 0; i < 40; i++){
			
			var object = game.add.sprite(-300, 200, 'sleepStar')
			object.scale.setTo(0.95,0.95)
			object.animations.add('walk');
			object.animations.play('walk',24,true);
			object.anchor.setTo(0.5,0.5)
			object.alpha = 0
			object.anim = true
			animObjects.add(object)
		}
		
	}
	
	return {
		
		assets: assets,
		name: "evening",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createStars()
			createContainer()
			createAnim()
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