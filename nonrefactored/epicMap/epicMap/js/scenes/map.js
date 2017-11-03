
var soundsPath = "../../shared/minigames/sounds/"
var map = function(){
    
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
                name: "atlas.map",
                json: "images/map/atlas.json",
                image: "images/map/atlas.png",
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
    var spaceSong
	var scroller
	var tileColors = [ 0xff92ad]
	var horizontalScroll, verticalScroll,kineticMovement
	var ballsPosition
	var mouseActive
	var start
	
	var iconsPositions = [
		
		{x:885,y:7474.944751381216},
		{x:998,y:7475.189076789056},
		{x:1043,y:7413.939226519336},
		{x:1040,y:7251.623885578169},
		{x:965,y:7219.8446864792895},
		{x:820,y:7218.021000073124},
		{x:773,y:7152.43078610617},
		{x:792,y:7026.977747432136},
		{x:871,y:7056.698464121502},
		{x:925,y:7108.885653248414},
		{x:1046,y:7070.574958449699},
		{x:1042,y:6892.831689458795},
		{x:965,y:6840.77388382294},
		{x:811,y:6839.241874461357},
		{x:778,y:6780.326964090746},
		{x:780,y:6670.063371271264},
		{x:860,y:6645.74927553578},
		{x:908,y:6733.4643587464125},
		{x:1018,y:6722.690878083429},
		{x:1046,y:6648.607064844089},
		{x:1040,y:6504.382371454001},
		{x:961,y:6468.238179729422},
		{x:820,y:6461.679272387886},
		{x:778,y:6391.191902697094},
		{x:784,y:6285.355925915179},
		{x:864,y:6285.79630876416},
		{x:913,y:6358.376896215781},
		{x:1012,y:6354.0778699185885},
		{x:1047,y:6281.798941203933},
		{x:1038,y:6130.519381751755},
		{x:945,y:6096.92022440072},
		{x:815,y:6081.691377023624},
		{x:775,y:6015.237705714111},
		{x:783,y:5915.137241328757},
		{x:865,y:5912.568172423197},
		{x:917,y:5979.648653960827},
		{x:1026,y:5973.485378694191},
		{x:1043,y:5899.126963247762},
		{x:1028,y:5732.981923510895},
		{x:950,y:5717.394605665894},
		{x:816,y:5709.096848865336},
		{x:775,y:5636.52875773156},
		{x:792,y:5530.576011925224},
		{x:868,y:5532.077177401563},
		{x:918,y:5606.34140450047},
		{x:1028,y:5593.000024826223},
		{x:1040,y:5395.032231853043},
		{x:962,y:5340.502917229031},
		{x:811,y:5337.138276345053},
		{x:780,y:5260.549702418664},
		{x:790,y:5154.73555489621},
		{x:872,y:5161.7608802212235},
		{x:916,y:5231.710521012586},
		{x:1032,y:5219.839884239056},
		{x:1023,y:4980.320331007077},
		{x:830,y:4964.9359888556155},
		{x:778,y:4901.553670812966},
		{x:783,y:4779.908197983344},
		{x:869,y:4784.29163828438},
		{x:920,y:4852.552982736441},
		{x:1035,y:4844.097458311165},
		{x:1027,y:4603.879307969499},
		{x:824,y:4590.246617737086},
		{x:778,y:4522.846913968708},
		{x:795,y:4389.252716321165},
		{x:872,y:4447},
		{x:1011,y:4483},
		{x:1046,y:4408},
		{x:1038,y:4270},
		{x:969,y:4218},
		{x:819,y:4209},
		{x:775,y:4146},
		{x:802,y:4023},
		{x:873,y:4072},
		{x:1018,y:4105},
		{x:1040,y:3987},
		
	]

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		mouseActive = false

        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.map','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.map','life_box')

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
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
		game.load.spine('eagle',"images/spines/eagle.json")
		
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
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.map','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.map',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.map','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
	
	function createBallsPos(){
		
		ballsPosition = game.add.group()
		scroller.add(ballsPosition)
		
		for(var i = 0; i < iconsPositions.length;i++){
			
			var ball = ballsPosition.create(iconsPositions[i].x - start.x,iconsPositions[i].y - start.y,'atlas.map','number_container')
			ball.anchor.setTo(0.5,0.5)
			console.log(ball.x + ' posX,' +  ball.y + ' posY')
		}
	}
	
	function addPosition(obj){
		
		
	}
	
	function createBackground(){
		
		scroller = game.add.existing(new ScrollableArea(0, 0, game.width, game.height));
		scroller.start();
		sceneGroup.add(scroller)

		horizontalScroll = false;
		verticalScroll = true;
		kineticMovement = true;
		
		configureScroll()
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height * 4,'atlas.map','texture')
		background.anchor.setTo(0,0)
		background.tint = tileColors[0]
		background.inputEnabled = true
		background.events.onInputDown.add(addPosition)
		scroller.add(background)
		
		start = scroller.create(game.world.centerX + 150,background.height - 75,'atlas.map','roadbegin')
		start.anchor.setTo(1,1)
		
		var road = game.add.tileSprite(start.x, start.y - start.height,328,374 * 9,'atlas.map','road')
		road.anchor.setTo(1,1)
		scroller.add(road)
		
		createBallsPos()
		
	}
	
	function configureScroll() {
		
		scroller.configure({
			horizontalScroll:horizontalScroll,
			verticalScroll:verticalScroll,
			kineticMovement:kineticMovement
		});
	}
	
	function update(){
		
		//console.log(scroller.x + ' posX,' + scroller.y + ' posY')
		
		/*if(!mouseActive && game.input.activePointer.middleButton.isDown){
			
			mouseActive = true
			
			var circle = ballsPosition.create(game.input.x,game.input.y - scroller.y,'atlas.map','number_container')
			circle.anchor.setTo(0.5,0.5)
			sound.play("pop")
		}
		
		if(game.input.activePointer.middleButton.isUp){
			mouseActive = false
		}
		
		if(game.input.activePointer.rightButton.isDown && !gameActive){
			
			printCirclePositions()
			gameActive = true
		}*/
	}
	
	function printCirclePositions(){
		
		
		var stringToUse = ''
		
		for(var i = 0; i < ballsPosition.length;i++){
			
			var circle = ballsPosition.children[i]
			
			stringToUse+= '{x:' + (circle.x + start.x) +',y:' + (circle.y + start.y) + '},\n'
		}
		
		console.log(stringToUse)
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

				particle.makeParticles('atlas.map',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.map','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.map','smoke');
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
	
	return {
		
		assets: assets,
		name: "map",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                //spaceSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			//createPointsBar()
			//createHearts()
			
			buttons.getButton(spaceSong,sceneGroup)
            //createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()