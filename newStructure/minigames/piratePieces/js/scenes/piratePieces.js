var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/piratePieces/";
var tutorialPath = "../../shared/minigames/"


var piratePieces = function(){
	
	var localizationData = {
		"EN":{
            "ready":"Ready",
		},

		"ES":{
            "ready":"Listo",
		}
	}
	
	assets = {
        atlases: [                
			{
                name: "atlas.pirate",
                json: "images/piratePieces/atlas.json",
                image: "images/piratePieces/atlas.png",
			},
],
        images: [
			
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
			{	name: "stop",
				file: soundsPath + "stop.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "waterRow",
				file: soundsPath + "waterRow.mp3"},
			{	name: "water_splash",
				file: soundsPath + "water_splash.mp3"},
		],
	}
    
    var INITIAL_LIVES = 3
	
	sceneGroup = null;
	
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var lives = INITIAL_LIVES;
	var cursors;
	var coins = 0;
	var bgm = null;
	var activeGame = true;
    var sea;
    var seaShip1;
    var seaShip2;
	var gameActive
	var coffinsNumber
	var shipContainers
	var clock
	var particlesGroup, particlesUsed
	var timeToAdd
	var shipList
	var gameIndex = 89
    
    
    function getSlotContainer (spineSkeleton, slotName) {
		
		var slotIndex
		for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
			var slotData = spineSkeleton.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index;


			}
		}
		if (slotIndex){     
			return spineSkeleton.slotContainers[slotIndex]
		}
	}    

	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
		
		game.load.audio('spaceSong', soundsPath + 'songs/pirates_song.mp3');
		/*Default*/
		;
		
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('pc',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		/*game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");*/
		
		/*GAME*/
		game.load.image("sea",imagePath + "sea.png");
        game.load.image("island",imagePath + "island.png");
        game.load.image("seaShip",imagePath + "sea_ship.png");
        game.load.image("chest",imagePath + "cofre.png");
		/*SPINE*/
		game.load.spine("ship", imagePath + "spine/ships.json");
		var inputName = 'movil'
        
		if(game.device.desktop){
			inputName = 'desktop'
		}

		game.load.image('tutorial_image',imagePath+"tutorial_image_"+inputName+".png")
		//loadType(gameIndex)

		
		
	}
	
	function stopGame(win){
   		
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

            sceneloader.show("result")
		})
    }

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
		
		lives = INITIAL_LIVES;
		coins = 0;
		speedGame = 5;
		starGame = false;
		gameActive = false
		coffinsNumber = 0
		timeToAdd = 25000

	}	
	
	function createShips(){
		
		shipContainers = []
		shipList = []
		
		shipGroup1 = game.add.group();
		shipGroup1.alpha = 0
		shipGroup1.x = game.world.centerX
		shipGroup1.y = game.world.centerY + 140
		
        var ship1 = game.add.spine(0,0,"ship");
        ship1.setAnimationByName(0, "IDLE", true);
		ship1.setSkinByName("barco_M2"); 
		shipGroup1.num = 2
        shipGroup1.add(ship1);
		shipGroup1.ship = ship1
		
		shipGroup1.containers = []
		
		var pivotX = -110
		
		for(var i = 0; i < 2;i++){
			
			var cont = shipGroup1.create(pivotX,-25,'atlas.pirate','sea')
			cont.alpha = 0
			cont.width = 100
			cont.height = -100
			cont.pivotY = 50
			pivotX+= 125
			
			shipContainers[i] = cont
			
		}
		
        //seaShip1 = game.add.tileSprite(-shipGroup1.x,ship1.y-30,game.width*2,35,"seaShip");
        seaShip1 = game.add.tileSprite(game.world.centerX+20,game.world.centerY-16,game.width*2,35,"seaShip");
        seaShip1.anchor.setTo(0.5,0.5)
        //shipGroup1.add(seaShip1);
		

        var mask = game.add.graphics(0,0)
        mask.beginFill(0xFFFFFF)
        mask.drawRoundedRect(0, 0, game.width, ship1.height-20,0)
        mask.endFill();
        mask.x = -shipGroup1.x;
        mask.y = ship1.y-ship1.height;
        shipGroup1.mask = mask;
		shipGroup1.add(mask)
        sceneGroup.add(shipGroup1);
		
        shipGroup2 = game.add.group();
		shipGroup2.alpha = 0
		shipGroup2.x = game.world.centerX
		shipGroup2.y = game.world.centerY + 100
		
        var ship1 = game.add.spine(0,0,"ship");
        ship1.setAnimationByName(0, "IDLE", true);
		ship1.setSkinByName("barco_M3"); 
        shipGroup2.add(ship1);
		shipGroup2.num = 3
		shipGroup2.ship = ship1
		
		shipGroup2.containers = []
		
		var pivotX = -160
		
		for(var i = 0; i < 3;i++){
			
			var cont = shipGroup2.create(pivotX,-25,'atlas.pirate','sea')
			cont.alpha = 0
			cont.width = 100
			cont.height = -100
			cont.pivotY = 50
			pivotX+= 115
			
			shipContainers[shipContainers.length] = cont
			
		}
		
        seaShip2 = game.add.tileSprite(-shipGroup2.x,ship1.y-30,game.width*2,35,"seaShip");
        //shipGroup2.add(seaShip2);
		
        var mask = game.add.graphics(0,0)
        mask.beginFill(0xFFFFFF)
        mask.drawRoundedRect(0, 0, game.width, ship1.height-20,0)
        mask.endFill();
        mask.x = -shipGroup2.x;
        mask.y = ship1.y-ship1.height;
        shipGroup2.mask = mask;
		shipGroup2.add(mask)
        sceneGroup.add(shipGroup2);
		
		shipList = [shipGroup1,shipGroup2]

		sceneGroup.add(seaShip1)
		
	}
	
	function createCoffins(){
		
		coffinsGroup = game.add.group()
		sceneGroup.add(coffinsGroup)
		
		for(var i = 0; i < 10;i++){
			
			var coffin = coffinsGroup.create(game.world.centerX,game.world.centerY + 100,'atlas.pirate','cofre')
			coffin.anchor.setTo(0.5,0.5)
			coffin.alpha = 0
			coffin.inputEnabled = true
			coffin.input.enableDrag(true)
			coffin.events.onDragStart.add(onDragStart, this);
			coffin.events.onDragStop.add(onDragStop, this);
			
		}
		
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function onDragStart(obj){
	
		/*if(!gameActive){
			return
		}*/
		
		obj.active = false
		
		if(obj.container){
			
			resetShipContainers()
			
			for(var i = 0; i < coffinsGroup.length;i++){
				
				var coffin = coffinsGroup.children[i]
				if(coffin.active && coffin.container){
					
					addChest(coffin.container,coffin)
				}
			}
		}
		
		obj.container = null
		
		sound.play("drag")
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
	
	function addPoint(number){
		
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
		
		createTextPart('+' + number,readyBtn.btn)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		
		if(timeToAdd > 10000){
			timeToAdd-= 500
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
	
	function addChest(container,obj){
		
		sound.play("stop")
		var ship = container.parent
		if(ship.tween){
			ship.tween.stop()
			ship.scale.setTo(1,1)
		}
		
		ship.tween = game.add.tween(ship.scale).to({x:1.2,y:1.2},200,"Linear",true,0,0)
		ship.tween.yoyo(true,0)
		
		game.add.tween(obj).to({x:container.world.x + container.width * 0.5, y:container.world.y - container.pivotY},500,"Linear",true)
		game.add.tween(obj.scale).to({x:0.4,y:0.4},500,"Linear",true).onComplete.add(function(){
			obj.inputEnabled = true
		})
		
		container.number++
		container.pivotY-= 30
		obj.active = true
		obj.container = container
				
	}
	
	function onDragStop(obj){
		
		obj.inputEnabled = false
		
		sound.play("pop")
		
		for(var i = 0; i < shipContainers.length;i++){
			
			var container = shipContainers[i]
			console.log(container.number + ' contNumber')
			if(checkOverlap(obj,container) && container.number < 3){
				
				addChest(container,obj)
				return
			}
		}
		
		game.add.tween(obj.scale).to({x:1,y:1},500,"Linear",true)
		game.add.tween(obj).to({x:obj.initX, y:obj.initY},500,"Linear",true).onComplete.add(function(){
			
			obj.inputEnabled = true
		})
	}
	
	function createReadyBtn(){
		
		readyBtn = game.add.group()
		readyBtn.x = game.world.centerX
		readyBtn.y = game.world.height - 275
		readyBtn.alpha = 0
		sceneGroup.add(readyBtn)
		
		var buttonImage = readyBtn.create(0,0,'atlas.pirate','button')
		buttonImage.anchor.setTo(0.5,0.5)
		buttonImage.inputEnabled = true
		buttonImage.events.onInputDown.add(inputButton)
		
		var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData,"ready"), fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		readyBtn.add(pointsText)
		
		readyBtn.btn = buttonImage
		
	}
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
		if(clock.tween){
			clock.tween.stop()
		}
		
		game.add.tween(clock).to({alpha:0},500,"Linear",true)
		game.add.tween(readyBtn).to({alpha:0},500,"Linear",true)
		
		obj.inputEnabled = false
		sound.play("pop")
		
		var tween = game.add.tween(obj.parent.scale).to({x:0.7,y:0.7},200,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		var correct = true
		
		var numberCheck
		for(var i = 0; i < shipContainers.length;i++){
			
			var cont = shipContainers[i]
			if(cont.parent.active){
				numberCheck = cont.number
				break
			}
		}
		
		if(numberCheck == 0){
			correct = false
		}
		
		for(var i = 0; i < shipContainers.length;i++){
			
			var container = shipContainers[i]
			if(numberCheck != container.number && container.parent.active){
				
				correct = false
			}
		}
		
		var partName = 'star'
		if(correct){
			
			addPoint(1)
			sendShip(true)
			
		}else{
			
			partName = 'wrong'
			missPoint()
			sendShip(false)
		}
		
		createPart(partName,readyBtn.btn, -200)
		
	}
	
	function sendShip(win){
		
		if(win){
			
			sound.play("waterRow")
			
			for(var i = 0; i < shipList.length;i++){
				
				var ship = shipList[i]
				if(ship.active){
					game.add.tween(ship).to({x:ship.x + game.world.width},2000,"Linear",true)
				}
				
			}
			
			for(var i = 0; i < coffinsGroup.length;i++){
				
				var cont = coffinsGroup.children[i]
				if(cont.container){
					game.add.tween(cont).to({x:cont.x + game.world.width},2000,"Linear",true)
				}
			}
			
			game.time.events.add(2100,function(){
				setNumber()
			})
		}else{
			
			game.add.tween(coffinsGroup).to({alpha:0},300,"Linear",true)
			for(var i = 0; i < shipList.length;i++){
				
				var ship = shipList[i]
				//ship.ship.setAnimationByName(0,"SINK_HIT",false)
				ship.ship.setAnimationByName(0,"SINK",false)

			}

			if(lives>0){

				game.time.events.add(2100,function(){
					for(var i = 0; i < shipList.length;i++){
						
						shipList[i].ship.setAnimationByName(0,"IDLE",false)
					}
					setNumber()
				})
			}
			
			sound.play("water_splash")
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
            
            particle.x = obj.world.x
            particle.y = obj.world.y + offX
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

				particle.makeParticles('atlas.pirate',tag);
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
	
    function createScene(){
		
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
        
		loadSounds();
		
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		sea = game.add.tileSprite(0,0,game.width,game.height,"sea");
		sceneGroup.add(sea);
        
        var island = sceneGroup.create(0,0,"island");
        island.width = game.width;
        island.y = game.height - island.height;
        
		initialize()
		
		createShips()
		createCoffins()
		createReadyBtn()
                        
		createHearts()
		createPointsBar()
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
		
		buttons.getButton(spaceSong,sceneGroup)
		createOverlay();
		animateScene()
		
	}
	
	function animateScene() {
                
        gameActive = false
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
	function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.pirate','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.pirate','hearts')

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
	
	function setNumber(){
		
		var numberShips = game.rnd.integerInRange(1,2)

		if(pointsBar.number < 3){
			numberShips = 1
		}
		
		shipGroup1.active = false
		shipGroup2.active = false
		shipGroup1.x = -500
		shipGroup2.x = -500
		
		sound.play("waterRow")
		
		if(numberShips == 1){
			
			var shipToUse = shipList[game.rnd.integerInRange(0,shipList.length - 1)]
			shipToUse.x = game.world.centerX
			shipToUse.y = game.world.centerY
			//shipToUse.alpha = 1
			shipToUse.active = true
			
			shipToUse.alpha = 1
			game.add.tween(shipToUse).from({x:shipGroup1.x - game.world.width},2000,"Linear",true)
			
			coffinsNumber = game.rnd.integerInRange(1,3) * shipToUse.num
			
		}else{
			
			var pivotY =  game.world.centerY - 100
			
			for(var i = 0; i < shipList.length;i++){
				
				var ship = shipList[i]
				ship.x = game.world.centerX
				ship.y = pivotY
				ship.alpha = 1
				ship.active = true
				
				pivotY+= 250
				
				game.add.tween(ship).from({x:ship.x - game.world.width},2000,"Linear",true)
				
			}
			
			coffinsNumber = game.rnd.integerInRange(1,2) * 5
			
		}
		
		resetShipContainers()
		
		game.time.events.add(1000,function(){
			
			setCoffins()
			popObject(clock,500)
			
			clock.bar.scale.x = clock.bar.origScale
			clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeToAdd,"Linear",true)
			
			clock.tween.onComplete.add(function(){
				
				sendShip(false)
				missPoint()
			})
		})
		
	}
	
	function resetShipContainers(){
		
		for(var i = 0; i < shipContainers.length;i++){
			
			var container = shipContainers[i]
			container.number = 0
			container.pivotY = 75
			container.initPivot = container.pivotY
		}
		
	}
	
	function setCoffins(){
		
		for(var i = 0; i < coffinsGroup.length;i++){
			
			var coffin = coffinsGroup.children[i]
			coffin.scale.setTo(1,1)
			coffin.alpha = 0
			coffin.active = false
			coffin.container = null
			
		}
		
		if(coffinsNumber < 7){
			
			var pivotX = game.world.centerX - (coffinsNumber * 0.5) * 80
		
			var delay = 100
			for(var i = 0; i < coffinsNumber;i++){

				var coffin = coffinsGroup.children[i]
				coffin.x = pivotX
				coffin.y = game.world.height - 75
				coffin.initX = coffin.x
				coffin.initY = coffin.y
				coffin.active = false
				coffin.container = null

				pivotX+= 100

				popObject(coffin,delay)
				delay+= 100

			}
		}else{
			
			console.log('more')
			var pivotX = game.world.centerX - (coffinsNumber * 0.25) * 80
			var initX = pivotX
			var pivotY = game.world.height - 150
			var delay = 100
			
			for(var i = 0; i < coffinsNumber;i++){
				
				var coffin = coffinsGroup.children[i]
				coffin.x = pivotX
				coffin.y = pivotY
				coffin.initX = coffin.x
				coffin.initY = coffin.y
				coffin.active = false
				coffin.container = null

				pivotX+= 100
				
				if((i+1) % 5 == 0){
					pivotX = initX
					pivotY+= 90
				}

				popObject(coffin,delay)
				delay+= 100
			}
		}
		
		game.time.events.add(delay,function(){coffinsGroup.alpha = 1})
		popObject(readyBtn,delay)
		readyBtn.btn.inputEnabled = true
	}
	
	function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({y:0.01},250,Phaser.Easing.linear,true)
			
        },this)
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
				setNumber()
				
				gameActive = true
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX + 20, game.world.centerY - 50,'atlas.pirate','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.pirate',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.pirate','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
		
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		setNumber()
		
		gameActive = true
    }
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 100
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.pirate','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.pirate','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	function update() {
		sea.tilePosition.x += 2;
        seaShip1.tilePosition.x += 2;
        seaShip2.tilePosition.x += 2;
	}
		

	
	
	return {
		assets: assets,
		name: "piratePieces",
		preload: preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
		update:update,	
	}
}()