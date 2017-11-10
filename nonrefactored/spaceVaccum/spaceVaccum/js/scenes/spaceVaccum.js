
var soundsPath = "../../shared/minigames/sounds/"
var spaceVaccum = function(){
    
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
                name: "atlas.vaccum",
                json: "images/space/atlas.json",
                image: "images/space/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/space/timeAtlas.json",
                image: "images/space/timeAtlas.png",
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
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "vacc",
				file: soundsPath + "powerup.mp3"},
            
			
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
    
    var backgroundGroup=null
    var gameGroup=null
    
    var spaceTrash=new Array(4)
    var activeTrash=new Array(4)
    var spaceTrashProxy=new Array(4)
    
    var meteors=null
    var meteorsProxy=null
    var meteorsActive=false
    
    
    var trail1=new Array(5)
    var trail2=new Array(5)
    var trail3=new Array(5)
    var trail4, trail5
    
	var trails
    var startGame
    var fuel
    var fuelBar
    var speed
    
    var proxy1
    var ship
    var scaleSpine=.5
    var adition
    var delayer
    var goal
    var tween1, tween2, tween3, tweenTiempo
    var clock, timeBar
    var clockStarts

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#220341"
        lives = 3
        delayer=0
        trail4=null
        trail5=null
        goal=20
        startGame=false
        clockStarts=false
        speed=10
        adition=100
        trails=0
        fuel=0
        for(var cleaning1=0; cleaning1<4;cleaning1++){
            
            spaceTrashProxy[cleaning1]=game.add.sprite(game.world.centerX-450+adition,100,"atlas.vaccum","TRASH"+(cleaning1+1))
            spaceTrashProxy[cleaning1].anchor.setTo(.5)
            spaceTrashProxy[cleaning1].alpha=0
            
            spaceTrash[cleaning1] = game.add.spine(spaceTrashProxy[cleaning1].x,spaceTrashProxy[cleaning1].y, "trash");
            spaceTrash[cleaning1].scale.setTo(1,1)
            spaceTrash[cleaning1].setAnimationByName(0,"IDLE",true);
            spaceTrash[cleaning1].setSkinByName("trash"+(cleaning1+1));
            spaceTrash[cleaning1].alpha=0
            gameGroup.add(spaceTrash[cleaning1])
            gameGroup.add(spaceTrashProxy[cleaning1])
            activeTrash[cleaning1]=false
            adition+=230
        }
        
            
            meteorsProxy=game.add.sprite(game.world.centerX+200,100,"atlas.vaccum","TRASH1")
            meteorsProxy.anchor.setTo(0.5)
            meteorsProxy.scale.setTo(.2,.2)
            meteorsProxy.alpha=0
            
            meteors = game.add.spine(meteorsProxy.x,meteorsProxy.y, "meteor");
            meteors.scale.setTo(.4,.4)
            meteors.angle=305
            meteors.setAnimationByName(0,"IDLE",true);
            meteors.setSkinByName("normal");
            meteors.alpha=0
            meteorsActive=false
        
        for(var cleaning2=0;cleaning2<5;cleaning2++){
            trail1[cleaning2]=null
            trail2[cleaning2]=null
            trail3[cleaning2]=null  
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.vaccum','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.vaccum','life_box')

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
        
        game.load.audio('spaceSong', soundsPath + 'songs/electro_trance_minus.mp3');
        
		game.load.image('howTo',"images/space/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/space/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/space/introscreen.png")
        
        game.load.spine("ship","images/Spine/ship/ship.json")
        game.load.spine("trash","images/Spine/Trash/trash.json")
        game.load.spine("meteor","images/Spine/Meteoro/meteoro.json")
        
        game.load.image("proxy1","images/space/SHIP.png")
		
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
            positionTimer()
            game.physics.startSystem(Phaser.Physics.ARCADE);
            proxy1=game.add.sprite(game.world.centerX,game.world.height-80, "proxy1")
            proxy1.anchor.setTo(.5)
            proxy1.scale.setTo(.5)
            proxy1.alpha=0
            proxy1.inputEnabled = true;
            proxy1.input.enableDrag(true);
            gameGroup.add(proxy1)
            game.physics.enable(proxy1, Phaser.Physics.ARCADE)
            proxy1.body.immovable=true
            proxy1.body.collideWorldBounds = true;
            proxy1.events.onDragStart.add(onDragStart,proxy1);
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.vaccum','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.vaccum',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.vaccum','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		backgroundGroup = game.add.group()
        gameGroup = game.add.group()
        sceneGroup.add(backgroundGroup)
        sceneGroup.add(gameGroup)
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        backG=game.add.tileSprite(0,100,game.world.width,game.world.height*2,'atlas.vaccum',"TILING1")
        backG.scale.setTo(1,.75)
        backgroundGroup.add(backG)
        backG2=game.add.tileSprite(0,100,game.world.width,game.world.height*2,'atlas.vaccum',"TILING2")
        backG2.scale.setTo(1,.75)
        backgroundGroup.add(backG2)
        
        var fuelMarc=game.add.sprite(game.world.width-100,game.world.height-250,"atlas.vaccum","FUEL")
        
        fuelBar=game.add.sprite(fuelMarc.x+55,fuelMarc.y+180,"atlas.vaccum","BLUE FUEL BAR")
        fuelBar.anchor.setTo(1)
        fuelBar.scale.setTo(1.5,0)
        backgroundGroup.add(fuelMarc)
        backgroundGroup.add(fuelBar)
        
        
        
        var poly = new Phaser.Polygon([ new Phaser.Point(280, -140), new Phaser.Point(290, -160), new Phaser.Point(315, -166), new Phaser.Point(335, -160), new Phaser.Point(350, -140), new Phaser.Point(350, 160), new Phaser.Point(280, 160)]);

        graphics = game.add.graphics(0, 0);

        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.endFill();
        graphics.anchor.setTo(0)
        graphics.scale.setTo(.5,.5)
        graphics.position.x=fuelMarc.position.x-118
        graphics.position.y=fuelMarc.position.y+100
		backgroundGroup.add(graphics)
        fuelBar.mask=graphics
        
        // create ship
        
            ship = game.add.spine(game.world.centerX,game.world.height-80, "ship");
            ship.scale.setTo(scaleSpine,scaleSpine)
            ship.scale.setTo(scaleSpine,scaleSpine)
            ship.setAnimationByName(0,"IDLE",true);
            ship.setSkinByName("normal");
            gameGroup.add(ship)
        
	}
	
    function onDragStart(obj){
        
        sound.play("ship")
        
        
    }
    
    function positionTimer(){
        clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
        clock.scale.setTo(.7)
        
        timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
        timeBar.scale.setTo(8,.45)
        backgroundGroup.add(clock)
        backgroundGroup.add(timeBar)
        timeBar.alpha=0
        clock.alpha=0
        
        
    }
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
        
    }
    function startTimer(time){
        
                
            tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
            tweenTiempo.onComplete.add(function(){
            missPoint()
            startGame=false
            reset()
            })
    }
    
	function update(){
        
        
        if(startGame){
            
            
        if(fuel==10 && clockStarts==false)
        {
            clock.alpha=1
            timeBar.alpha=1
            startTimer(65000)
            clockStarts=true
        }
            
            if(fuel<20 && fuel!=0){
                game.add.tween(fuelBar.scale).to({x:1.5,y:fuel/16.3}, 5, Phaser.Easing.Linear.Out, true, 100)
            }

            //colisiones
            for(var colliding=0; colliding<5; colliding++)
            {
                if(activeTrash[colliding]==true){
                    game.physics.arcade.collide(proxy1,spaceTrashProxy[colliding])

                }
            }
            game.physics.arcade.collide(proxy1,meteorsProxy)
            for(var moveProxy=0;moveProxy<5;moveProxy++){
                
                if(activeTrash[moveProxy]==true){
                    
                    spaceTrashProxy[moveProxy].position.y+=speed
                    
                }

            }
            
            if(meteorsActive==true){
                    
                    meteorsProxy.position.y+=speed
                    if(trail4==meteors){ 
                        meteorsProxy.position.x+=speed/1.5
                    }
                    if(trail5==meteors){ 
                        meteorsProxy.position.x-=speed/1.5
                    }
                    
            }
        
            for(var parent=0;parent<4;parent++){
                for(var parent2=0;parent2<4;parent2++){
                
                if(trail1[parent]==spaceTrash[parent2] && activeTrash[parent2]==true){
                    
                    trail1[parent].position.x=spaceTrashProxy[parent2].position.x
                    trail1[parent].position.y=spaceTrashProxy[parent2].position.y
                }
                if(trail2[parent]==spaceTrash[parent2] && activeTrash[parent2]==true){
                 
                    trail2[parent].position.x=spaceTrashProxy[parent2].position.x
                    trail2[parent].position.y=spaceTrashProxy[parent2].position.y
                }
                if(trail3[parent]==spaceTrash[parent2] && activeTrash[parent2]==true){
                 
                    trail3[parent].position.x=spaceTrashProxy[parent2].position.x
                    trail3[parent].position.y=spaceTrashProxy[parent2].position.y
                }
                if(trail1[parent]==meteors && meteorsActive==true){
                    
                    trail1[parent].position.x=meteorsProxy.position.x
                    trail1[parent].position.y=meteorsProxy.position.y
                }
                if(trail2[parent]==meteors && meteorsActive==true){
                    
                    trail2[parent].position.x=meteorsProxy.position.x
                    trail2[parent].position.y=meteorsProxy.position.y
                }
                if(trail3[parent]==meteors && meteorsActive==true){
                    
                    trail3[parent].position.x=meteorsProxy.position.x
                    trail3[parent].position.y=meteorsProxy.position.y
                }
            }
        }
            if(trail4==meteors && meteorsActive==true){
                trail4.position.x=meteorsProxy.position.x
                trail4.position.y=meteorsProxy.position.y
            }
            if(trail5==meteors && meteorsActive==true){
                trail5.position.x=meteorsProxy.position.x
                trail5.position.y=meteorsProxy.position.y
            }
            
            delayer++
            
            ship.position.x=proxy1.x
            ship.position.y=proxy1.y
            proxy1.position.y=game.world.height-80
            ship.position.y=game.world.height-80
            
            if(delayer==60){
                
               
                
                randomCreation=game.rnd.integerInRange(0,5)
                trails=game.rnd.integerInRange(0,4)
                var spaceInTrail=game.rnd.integerInRange(0,3)
                
                if(randomCreation<4){
                if(trails==0 && trail1[spaceInTrail]==null && activeTrash[randomCreation]==false){
                    
                    trail1[spaceInTrail]=spaceTrash[randomCreation]
                    trail1[spaceInTrail].setAnimationByName(0,"IDLE",true);
                    trail1[spaceInTrail].position.x=game.world.x+100
                    trail1[spaceInTrail].position.y=-10
                    trail1[spaceInTrail].scale.setTo(1,1)
                    spaceTrashProxy[randomCreation].position.x=game.world.x+100
                    spaceTrashProxy[randomCreation].position.y=10
                    trail1[spaceInTrail].alpha=1
                    activeTrash[randomCreation]=true
                    spaceTrashProxy[randomCreation].tag=randomCreation
                    game.physics.enable(spaceTrashProxy[randomCreation], Phaser.Physics.ARCADE)
                    spaceTrashProxy[randomCreation].checkWorldBounds = true;
                    spaceTrashProxy[randomCreation].events.onOutOfBounds.add(outOfThisWorld, this);
                    spaceTrashProxy[randomCreation].body.onCollide = new Phaser.Signal();    
                    spaceTrashProxy[randomCreation].body.onCollide.add(hitTheShip, this);
                    gameGroup.add(spaceTrashProxy[randomCreation])
                }
                if(trails==1 && trail2[spaceInTrail]==null && activeTrash[randomCreation]==false){
                    
                    trail2[spaceInTrail]=spaceTrash[randomCreation]
                    trail2[spaceInTrail].setAnimationByName(0,"IDLE",true);
                    trail2[spaceInTrail].position.x=game.world.x+300
                    trail2[spaceInTrail].position.y=-10
                    trail2[spaceInTrail].scale.setTo(1,1)
                    spaceTrashProxy[randomCreation].position.x=game.world.x+300
                    spaceTrashProxy[randomCreation].position.y=10
                    trail2[spaceInTrail].alpha=1
                    activeTrash[randomCreation]=true
                    spaceTrashProxy[randomCreation].tag=randomCreation
                    game.physics.enable(spaceTrashProxy[randomCreation], Phaser.Physics.ARCADE)
                    spaceTrashProxy[randomCreation].checkWorldBounds = true;
                    spaceTrashProxy[randomCreation].events.onOutOfBounds.add(outOfThisWorld, this);
                    spaceTrashProxy[randomCreation].body.onCollide = new Phaser.Signal();    
                    spaceTrashProxy[randomCreation].body.onCollide.add(hitTheShip, this);
                    gameGroup.add(spaceTrashProxy[randomCreation])
                }
                if(trails==2 && trail3[spaceInTrail]==null && activeTrash[randomCreation]==false){
                    
                    trail3[spaceInTrail]=spaceTrash[randomCreation]
                    trail3[spaceInTrail].setAnimationByName(0,"IDLE",true);
                    trail3[spaceInTrail].position.x=game.world.x+500
                    trail3[spaceInTrail].position.y=-10
                    trail3[spaceInTrail].scale.setTo(1,1)
                    spaceTrashProxy[randomCreation].position.x=game.world.x+500
                    spaceTrashProxy[randomCreation].position.y=10
                    trail3[spaceInTrail].alpha=1
                    activeTrash[randomCreation]=true
                    spaceTrashProxy[randomCreation].tag=randomCreation
                    game.physics.enable(spaceTrashProxy[randomCreation], Phaser.Physics.ARCADE)
                    spaceTrashProxy[randomCreation].checkWorldBounds = true;
                    spaceTrashProxy[randomCreation].events.onOutOfBounds.add(outOfThisWorld, this);
                    spaceTrashProxy[randomCreation].body.onCollide = new Phaser.Signal();    
                    spaceTrashProxy[randomCreation].body.onCollide.add(hitTheShip, this);
                    gameGroup.add(spaceTrashProxy[randomCreation])
                }
                
                    
            }else{
                
                if(trails==0 && trail1[spaceInTrail]==null && meteorsActive==false){
                    trail1[spaceInTrail]=meteors
                    trail1[spaceInTrail].setAnimationByName(0,"IDLE",true);
                    trail1[spaceInTrail].position.x=game.world.x+100
                    trail1[spaceInTrail].position.y=-10
                    trail1[spaceInTrail].scale.setTo(1,1)
                    meteorsProxy.position.x=trail1[spaceInTrail].x
                    meteorsProxy.position.y=10
                    trail1[spaceInTrail].alpha=1
                    meteorsActive=true
                    meteors.angle=305
                    meteorsProxy.tag="meteor1"
                    game.physics.enable(meteorsProxy, Phaser.Physics.ARCADE)
                    meteorsProxy.checkWorldBounds = true;
                    meteorsProxy.events.onOutOfBounds.add(outOfThisWorld, this);
                    meteorsProxy.body.onCollide = new Phaser.Signal();    
                    meteorsProxy.body.onCollide.add(hitTheShip, this);
                    gameGroup.add(meteorsProxy)
                } 
                if(trails==1 && trail2[spaceInTrail]==null && meteorsActive==false){
                    trail2[spaceInTrail]=meteors
                    trail2[spaceInTrail].setAnimationByName(0,"IDLE",true);
                    trail2[spaceInTrail].position.x=game.world.x+300
                    trail2[spaceInTrail].position.y=-10
                    trail2[spaceInTrail].scale.setTo(1,1)
                    meteorsProxy.position.x=trail2[spaceInTrail].x
                    meteorsProxy.position.y=10
                    trail2[spaceInTrail].alpha=1
                    meteorsActive=true
                    meteors.angle=305
                    meteorsProxy.tag="meteor1"
                    game.physics.enable(meteorsProxy, Phaser.Physics.ARCADE)
                    meteorsProxy.checkWorldBounds = true;
                    meteorsProxy.events.onOutOfBounds.add(outOfThisWorld, this);
                    meteorsProxy.body.onCollide = new Phaser.Signal();    
                    meteorsProxy.body.onCollide.add(hitTheShip, this);
                    gameGroup.add(meteorsProxy)
                } 
                if(trails==2 && trail3[spaceInTrail]==null && meteorsActive==false){
                    trail3[spaceInTrail]=meteors
                    trail3[spaceInTrail].setAnimationByName(0,"IDLE",true);
                    trail3[spaceInTrail].position.x=game.world.x+500
                    trail3[spaceInTrail].position.y=-10
                    trail3[spaceInTrail].scale.setTo(1,1)
                    meteorsProxy.position.x=trail3[spaceInTrail].x
                    meteorsProxy.position.y=10
                    meteors.angle=305
                    trail3[spaceInTrail].alpha=1
                    meteorsActive=true
                    meteorsProxy.tag="meteor1"
                    game.physics.enable(meteorsProxy, Phaser.Physics.ARCADE)
                    meteorsProxy.checkWorldBounds = true;
                    meteorsProxy.events.onOutOfBounds.add(outOfThisWorld, this);
                    meteorsProxy.body.onCollide = new Phaser.Signal();    
                    meteorsProxy.body.onCollide.add(hitTheShip, this);
                    gameGroup.add(meteorsProxy)
                } 
                if(trails==3 && trail4==null && meteorsActive==false){
                    trail4=meteors
                    trail4.setAnimationByName(0,"IDLE",true);
                    trail4.position.x=-10
                    trail4.position.y=0
                    trail4.scale.setTo(1,1)
                    meteorsProxy.position.x=trail4.x
                    meteorsProxy.position.y=10
                    trail4.angle=270
                    trail4.alpha=1
                    meteorsActive=true
                    meteorsProxy.tag="meteor1"
                    game.physics.enable(meteorsProxy, Phaser.Physics.ARCADE)
                    meteorsProxy.checkWorldBounds = true;
                    meteorsProxy.events.onOutOfBounds.add(outOfThisWorld, this);
                    meteorsProxy.body.onCollide = new Phaser.Signal();    
                    meteorsProxy.body.onCollide.add(hitTheShip, this);
                    gameGroup.add(meteorsProxy)
                } 
                if(trails==4 && trail5==null && meteorsActive==false){
                    trail5=meteors
                    trail5.setAnimationByName(0,"IDLE",true);
                    trail5.position.x=game.world.width+10
                    trail5.position.y=0
                    trail5.scale.setTo(1,1)
                    meteorsProxy.position.x=trail5.x
                    meteorsProxy.position.y=10
                    trail5.angle=-8
                    trail5.alpha=1
                    meteorsActive=true
                    meteorsProxy.tag="meteor1"
                    game.physics.enable(meteorsProxy, Phaser.Physics.ARCADE)
                    meteorsProxy.checkWorldBounds = true;
                    meteorsProxy.events.onOutOfBounds.add(outOfThisWorld, this);
                    meteorsProxy.body.onCollide = new Phaser.Signal();    
                    meteorsProxy.body.onCollide.add(hitTheShip, this);
                    gameGroup.add(meteorsProxy)
                } 
                
                
            }
                delayer=0
                   
                    
                    
                    
                
            }
            
        }

	}
    
    
       function hitTheShip(obj){
           
           ship.setAnimationByName(0,"TAKETRASH",false);
           
           if(obj.tag=="meteor1"){
               
              sound.play("explosion")
              boomParticle.position.x=obj.position.x+50
              boomParticle.position.y=obj.position.y
              boomParticle.start(true, 1000, null, 5)
              obj.position.x=game.world.width+100
              obj.position.y=10
              missPoint()
               
               startGame=false
              reset()
           }else{   
               
               sound.play("vacc")
               correctParticle.position.x=obj.position.x
               correctParticle.position.y=obj.position.y
               correctParticle.start(true, 1000, null, 5)
               for(var cleanObj=0;cleanObj<5;cleanObj++){
                   
                if(trail1[cleanObj]==spaceTrash[obj.tag])
                {
                trail1[cleanObj].setAnimationByName(0,"LOSE",true)
                   tween1=game.add.tween(trail1[cleanObj].scale).to({x:0,y:0}, 75, Phaser.Easing.Linear.Out, true, 1).onComplete.add(function(){
                    obj.position.x=game.world.width+100
                    obj.position.y=10
                    
                        if(activeTrash[obj.tag]==true){
                            fuel++
                            if(fuel%20==0){
                                addPoint(1)
                                reset()
                                speed+=.5
                            }
                        }
                    activeTrash[obj.tag]=false
                    
                    
                        })
                    trail1[cleanObj]=null
                }
                   
                if(trail2[cleanObj]==spaceTrash[obj.tag])
                {
                trail2[cleanObj].setAnimationByName(0,"LOSE",true)
                   tween2=game.add.tween(trail2[cleanObj].scale).to({x:0,y:0}, 75, Phaser.Easing.Linear.Out, true, 1).onComplete.add(function(){
                    obj.position.x=game.world.width+400
                    obj.position.y=10
                    
                        if(activeTrash[obj.tag]==true){
                            fuel++
                            if(fuel%20==0){
                                addPoint(1)
                                reset()
                                speed+=.5
                            }
                        }
                    activeTrash[obj.tag]=false
                    
                        })
                    trail2[cleanObj]=null
                }
                   
                
                if(trail3[cleanObj]==spaceTrash[obj.tag])
                {
                trail3[cleanObj].setAnimationByName(0,"LOSE",true)
                   tween3=game.add.tween(trail3[cleanObj].scale).to({x:0,y:0}, 75, Phaser.Easing.Linear.Out, true, 1).onComplete.add(function(){
                    obj.position.x=game.world.width+800
                    obj.position.y=10
                    
                        if(activeTrash[obj.tag]==true){
                            fuel++
                            if(fuel%20==0){
                                addPoint(1)
                                reset()
                                speed+=.5
                            }
                        }
                    activeTrash[obj.tag]=false
                    
                        })
                    
                }
                   
                   
               }
               
           }
           
           
       }
    
        function reset(){
            
            if(clockStarts==true){
                stopTimer()
            }
            for(var order=0;order<5;order++){
                
                if(trail1[order]!=null){
                    game.add.tween(trail1[order]).to({alpha:0},200,Phaser.Easing.linear,true)   
                }
                if(trail2[order]!=null){
                    game.add.tween(trail2[order]).to({alpha:0},200,Phaser.Easing.linear,true)
                }
                if(trail3[order]!=null){
                    game.add.tween(trail3[order]).to({alpha:0},200,Phaser.Easing.linear,true)
                }
                if(trail4!=null){
                    game.add.tween(trail4).to({alpha:0},200,Phaser.Easing.linear,true)
                }
                if(trail5!=null){
                    game.add.tween(trail5).to({alpha:0},200,Phaser.Easing.linear,true)
                }
                if(activeTrash[order]==true){
                    activeTrash[order]=false
                }
                meteorsActive=false
                
            }
            game.add.tween(fuelBar.scale).to({x:1.5,y:0}, 300, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                if(lives>0){
                startGame=true
                    if(clockStarts==true){
                        startTimer(65000)
                        fuel=0
                    }else{
                    fuel=0
                    }
                }
                for(var order=0;order<5;order++){
                if(trail1[order]!=null){
                    trail1[order].position.x=game.world.width+800
                    trail1[order].position.y=10
                }
                if(trail2[order]!=null){
                    trail2[order].position.x=game.world.width+800
                    trail2[order].position.y=10
                }
                if(trail3[order]!=null){
                    trail3[order].position.x=game.world.width+800
                    trail3[order].position.y=10
                }
                }
                trail4=null
                trail5=null
            })
        }
    
       function outOfThisWorld(obj){
       
        if(obj.position.y>1){
        
        if(obj.position.y>game.world.height+10){
            
        for(var checkMeteors=0;checkMeteors<5;checkMeteors++){
            if(meteorsActive==true && obj.tag=="meteor1" && trail1[checkMeteors]==meteors){
                meteorsActive=false
                game.add.tween(trail1[checkMeteors]).to({alpha:0},200,Phaser.Easing.linear,true)
                obj.position.y=10
                trail1[checkMeteors]=null
            }
            if(meteorsActive==true && obj.tag=="meteor1" && trail2[checkMeteors]==meteors){
                meteorsActive=false
                game.add.tween(trail2[checkMeteors]).to({alpha:0},200,Phaser.Easing.linear,true)
                obj.position.y=10
                trail2[checkMeteors]=null
            }
            if(meteorsActive==true && obj.tag=="meteor1" && trail3[checkMeteors]==meteors){
                meteorsActive=false
                game.add.tween(trail3[checkMeteors]).to({alpha:0},200,Phaser.Easing.linear,true)
                obj.position.y=10
                trail3[checkMeteors]=null
            }
            
        }
            
            if(meteorsActive==true && obj.tag=="meteor1" && trail4==meteors){
                console.log(trail4)
                meteorsActive=false
                game.add.tween(trail4).to({alpha:0},200,Phaser.Easing.linear,true)
                obj.position.y=10
                trail4=null
            }
            if(meteorsActive==true && obj.tag=="meteor1" && trail5==meteors){
                meteorsActive=false
                game.add.tween(trail5).to({alpha:0},200,Phaser.Easing.linear,true)
                obj.position.y=10
                trail5=null
            }
            
        for(var checkObjects=0;checkObjects<4;checkObjects++){
            
                if(trail1[checkObjects]==spaceTrash[obj.tag] && activeTrash[obj.tag]==true)
                {
                
                    trail1[checkObjects].alpha=0
                    obj.position.x=game.world.width+100
                    obj.position.y=10
                    trail1[checkObjects]=null
                    activeTrash[obj.tag]=false
                    
                }
                if(trail2[checkObjects]==spaceTrash[obj.tag] && activeTrash[obj.tag]==true)
                {
                
                    trail2[checkObjects].alpha=0
                    obj.position.x=game.world.width+400
                    obj.position.y=10
                    trail2[checkObjects]=null
                    activeTrash[obj.tag]=false
                    
                }
                if(trail3[checkObjects]==spaceTrash[obj.tag] && activeTrash[obj.tag]==true)
                {
                
                    trail3[checkObjects].alpha=0
                    obj.position.x=game.world.width+750
                    obj.position.y=10
                    trail3[checkObjects]=null
                    activeTrash[obj.tag]=false
                    
                }
            
                }
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
        particle.makeParticles('atlas.vaccum',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
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

				particle.makeParticles('atlas.vaccum',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.vaccum','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.vaccum','smoke');
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
		name: "spaceVaccum",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
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