
var soundsPath = "../../shared/minigames/sounds/"
var garbageDiving = function(){
    
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
                name: "atlas.garbage",
                json: "images/garbage/atlas.json",
                image: "images/garbage/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/garbage/timeAtlas.json",
                image: "images/garbage/timeAtlas.png",
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
    var backgroundGroup, gameGroup
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 101
	var indexGame
    var overlayGroup
    var spaceSong
	var backG
    var speed
    var timeBar
    var mine
    var trash= new Array(10)
    var trashActive= new Array(10)
    var trail1 = new Array (4)
    var trail2 = new Array (4)
    var trail3 = new Array (4)
    var timeTween
    var randomCreation
    var bigFish
    var actualTrail
    var startGame
    var delayer
    var trest
    var randomTrail
    var goal
    var scoreBarMove, scoreBar
    var trashCollected
    var scaleSpine
    var keyPressed, keyPressed2
    var character

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#112C5C"
        lives = 3
        speed=2
        scaleSpine=.55
        trest=false
        keyPressed=false
        keyPressed2=false
        startGame=false
        delayer=0
        actualTrail=1
        mineActive=false
        loadSounds()
        
        for(var ini=0;ini<10;ini++){
            
            trashActive[ini]=false
            trash[ini]
            
        }
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.garbage','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.garbage','life_box')

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
        
		game.load.image('howTo',"images/garbage/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/garbage/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/garbage/introscreen.png")
		
        game.load.spine('bigFish',"images/spine/skeleton/Skeleton.json")
        
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
            
            
            character = game.add.spine(game.world.centerX-1000,game.world.height-350, "bigFish");
            character.scale.setTo(scaleSpine*2,scaleSpine*2)
            character.scale.setTo(scaleSpine*2,scaleSpine*2)
            character.setAnimationByName(0,"IDLE",true);
            character.setSkinByName("normal");
            gameGroup.add(character)
            
            
            
            
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                startGame=true
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.garbage','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'tablet'
		
		if(game.device.desktop){
			inputName = 'desktop'
        var inputLogo2 = overlayGroup.create(game.world.centerX +70,game.world.centerY + 125,'atlas.garbage',"Mesa de trabajo 48")
        inputLogo2.anchor.setTo(0.5,0.5)
		inputLogo2.scale.setTo(0.7,0.7)
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX,game.world.centerY + 125,'atlas.garbage',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
        
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.garbage','button')
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
        
        backG=game.add.tileSprite(0,100,game.world.width,game.world.height*2,'atlas.garbage',"tile")
        backG.scale.setTo(1,.75)
        backgroundGroup.add(backG)
        
        clock=game.add.image(game.world.centerX-200,0,"atlas.time","clock")
        
        
        timeBar=game.add.image(clock.position.x+55,clock.position.y+57,"atlas.time","bar")
        timeBar.scale.setTo(11.5,.7)
        backgroundGroup.add(clock)
        backgroundGroup.add(timeBar)
        
        for(var fill=0;fill<10;fill++){
            
            trash[fill]=game.add.sprite(clock.position.x+55,clock.position.y+57,"atlas.garbage",fill+1)
            trash[fill].alpha=0
        }
        
        var floor1 = new Phaser.Graphics(game)
        floor1.beginFill(0x000000)
        floor1.drawRect(0,0,game.world.width *2, 300)
        floor1.alpha = 0
        floor1.endFill()
        floor1.inputEnabled = true
        backgroundGroup.add(floor1)
        floor1.events.onInputDown.add(function(){
            actualTrail=2
            console.log(actualTrail)
        })
        var floor2 = new Phaser.Graphics(game)
        floor2.beginFill(0x000000)
        floor2.drawRect(0,350,game.world.width *2, 300)
        floor2.alpha = 0
        floor2.endFill()
        floor2.inputEnabled = true
        backgroundGroup.add(floor2)
        floor2.events.onInputDown.add(function(){
            actualTrail=1
        })
        var floor3 = new Phaser.Graphics(game)
        floor3.beginFill(0x000000)
        floor3.drawRect(0,700,game.world.width *2, 300)
        floor3.alpha = 0
        floor3.endFill()
        floor3.inputEnabled = true
        backgroundGroup.add(floor3)
        floor3.events.onInputDown.add(function(){
        actualTrail=0
        })
        // Aqui entra la barra recolecciòn de basura
        
        
        var poly = new Phaser.Polygon([ new Phaser.Point(200, 100), new Phaser.Point(450, 50), new Phaser.Point(450, 150), new Phaser.Point(200, 150)]);

        graphics = game.add.graphics(0, 0);

        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.endFill();
        graphics.anchor.setTo(0)
        graphics.scale.setTo(0,1)
        graphics.position.x=game.world.centerX-700
        graphics.position.y=game.world.height-300
		sceneGroup.add(graphics)
        
        
        //scoreBar.mask=graphics
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
	}
	
    function up(){
        
        if(actualTrail<2){
            actualTrail++
        }
    }
    function down(){
        if(actualTrail>0){
            actualTrail--
        }
    }
    
	function update(){
        
        
        if(trashCollected==20){
            
            trashCollected=0
            game.add.tween(scoreBarMove.scale).to({x:0,y:10}, 500, Phaser.Easing.Linear.Out, true, 100)
            
        }
        
        if(controles.down.isDown && keyPressed==false){
            
            down()
            keyPressed=true
            
        }else if(controles.up.isDown && keyPressed2==false){
            
            up()
            keyPressed2=true
            
        }
        
        if(controles.down.isUp && keyPressed==true){
            
            keyPressed=false
            
            
            
        }else if(controles.up.isUp && keyPressed2==true){
            
            keyPressed2=false
        }
        
        
        
        //Trick to game
        if(pointsBar.number==10)
        {
            clock.alpha=1
            timeBar.alpha=1
        }
        
            
            
        if(startGame){
            
        delayer++
        //Se mueve el fondo
        backG.tilePosition.x-=speed
            
        //Hacemos el moviemiento del personaje
        if(actualTrail==2)
        {
            character.position.y=game.world.height-650     
        }
        if(actualTrail==1)
        {
            character.position.y=game.world.height-350     
        }
        if(actualTrail==0)
        {
            character.position.y=game.world.height-50      
        }
        
            //Crear objetos
        if(delayer==100){
            randomCreation=game.rnd.integerInRange(0,11)
            randomTrail=game.rnd.integerInRange(0,2)
            var spaceInTrail=game.rnd.integerInRange(0,4)
            
            if(randomCreation<10){
                
                if(randomTrail==0 && trashActive[randomCreation]==false && trail1[spaceInTrail]==null){
                    
                    trail1[spaceInTrail]=trash[randomCreation]
                    trail1[spaceInTrail].position.x=game.world.centerX+800
                    trail1[spaceInTrail].position.y=game.world.centerY+50
                    trail1[spaceInTrail].alpha=1
                    console.log(trail1[spaceInTrail])
                    trail1[spaceInTrail].tag=randomCreation
                    game.physics.enable(trail1[spaceInTrail], Phaser.Physics.ARCADE)
                    trail1[spaceInTrail].body.onCollide = new Phaser.Signal();    
                    trail1[spaceInTrail].body.onCollide.add(hitTheFish, this);
                    trashActive[randomCreation]=true
                    
                    
                }
                if(randomTrail==1 && trashActive[randomCreation]==false && trail2[spaceInTrail]==null){
                    
                    trail2[spaceInTrail]=trash[randomCreation]
                    trail2[spaceInTrail].position.x=game.world.centerX+800
                    trail2[spaceInTrail].position.y=game.world.centerY+100
                    trail2[spaceInTrail].alpha=1
                    console.log(trail2[spaceInTrail])
                    trail2[spaceInTrail].tag=randomCreation
                    game.physics.enable(trail2[spaceInTrail], Phaser.Physics.ARCADE)
                    trail2[spaceInTrail].body.onCollide = new Phaser.Signal();    
                    trail2[spaceInTrail].body.onCollide.add(hitTheFish, this);
                    trashActive[randomCreation]=true
                    
                }
                if(randomTrail==2 && trashActive[randomCreation]==false && trail3[spaceInTrail]==null){
                    
                    trail3[spaceInTrail]=trash[randomCreation]
                    trail3[spaceInTrail].position.x=game.world.centerX+800
                    trail3[spaceInTrail].position.y=game.world.centerY+200
                    trail3[spaceInTrail].alpha=1
                    trail3[spaceInTrail].tag=randomCreation
                    console.log(trail3[spaceInTrail])
                    game.physics.enable(trail3[spaceInTrail], Phaser.Physics.ARCADE)
                    trail3[spaceInTrail].body.onCollide = new Phaser.Signal();    
                    trail3[spaceInTrail].body.onCollide.add(hitTheFish, this);
                    trashActive[randomCreation]=true
                    
                }
            }
            
            if(randomCreation==11){
                
                if(randomTrail==0 && mineActive==false){
                    
                    mine.position.x=game.world.centerX+800
                    mine.position.y=game.world.centerY+50
                    mine.tag="mine"
                    mineActive=true
                    game.physics.enable(trail1[spaceInTrail], Phaser.Physics.ARCADE)
                    trail1[spaceInTrail].body.onCollide = new Phaser.Signal();    
                    trail1[spaceInTrail].body.onCollide.add(hitTheFish, this);
                    trashActive[randomCreation]
                    
                    
                }
                if(randomTrail==1 && mineActive==false){
                    
                    mine.position.x=game.world.centerX+800
                    mine.position.y=game.world.centerY+100
                    mine.tag="mine"
                    mineActive=true
                    game.physics.enable(trail2[spaceInTrail], Phaser.Physics.ARCADE)
                    trail2[spaceInTrail].body.onCollide = new Phaser.Signal();    
                    trail2[spaceInTrail].body.onCollide.add(hitTheFish, this);
                    trashActive[randomCreation]
                    
                }
                if(randomTrail==2 && mineActive==false){
                    
                    mine.position.x=game.world.centerX+800
                    mine.position.y=game.world.centerY+200
                    mine.tag="mine"
                    mineActive=true
                    game.physics.enable(trail3[spaceInTrail], Phaser.Physics.ARCADE)
                    trail3[spaceInTrail].body.onCollide = new Phaser.Signal();    
                    trail3[spaceInTrail].body.onCollide.add(hitTheFish, this);
                    trashActive[randomCreation]
                    
                }
               
            }
            
            //Mover Objetos
            
            for(var moveObjects=0; moveObjects<4;moveObjects++){
                
                if(trail1[moveObjects]!=null){
                    trail1[moveObjects].position.x-=speed
                }
                if(trail2[moveObjects]!=null){
                    trail2[moveObjects].position.x-=speed
                }
                if(trail3[moveObjects]!=null){
                    trail3[moveObjects].position.x-=speed
                }
            }
            
            if(mineActive==true){
                
                mine.position.x-=speed
                
            }
            
            
                
            delayer=0
        }
            
            //colisiones
            for(var colliding=0; colliding<10; colliding++)
            {
                if(trail1[colliding]!=null){
                    game.physics.arcade.collide(bigFish,trail1[colliding])
                }
                    if(trail2[colliding]!=null){
                    game.physics.arcade.collide(bigFish,trail2[colliding])
                }
                   if(trail3[colliding]!=null){
                    game.physics.arcade.collide(bigFish,trail3[colliding])
                }
            }
            for(var crashWithTrash=0; crashWithTrash<4;crashWithTrash++){
                
                if(trail1[crashWithTrash]!=null){
                    game.physics.enable(trail1[crashWithTrash], Phaser.Physics.ARCADE)
                    trail1[crashWithTrash].body.onCollide = new Phaser.Signal();    
                    trail1[crashWithTrash].body.onCollide.add(hitTheFish, this);
                }
                if(trail2[crashWithTrash]!=null){
                    game.physics.enable(trail2[crashWithTrash], Phaser.Physics.ARCADE)
                    trail2[crashWithTrash].body.onCollide = new Phaser.Signal();    
                    trail2[crashWithTrash].body.onCollide.add(hitTheFish, this);
                }
                if(trail3[crashWithTrash]!=null){
                    game.physics.enable(trail3[crashWithTrash], Phaser.Physics.ARCADE)
                    trail3[crashWithTrash].body.onCollide = new Phaser.Signal();    
                    trail3[crashWithTrash].body.onCollide.add(hitTheFish, this);
                }
            }
        
        }
	}
    
    
    function hitTheFish(obj){
        
        if(obj.tag!="mine"){
            
            trachCollected++
            
            if(pointsBar.number%goal==0){
                
                goal+=20
                speed+=.5
                delayer-=1
                reset()
                tweenTiempo.stop()
            }
            
            for(var checkObjects=0;checkObjects<4;checkObjects++){
                if(trail1[chackObjects]==obj)
                {
                    obj.alpha=0
                    trail1[chackObjects]=null
                    obj.position.x=game.world.centerX+800
                    obj.position.x=game.world.centerY+50
                    
                }
                if(trail2[chackObjects]==obj)
                {
                    obj.alpha=0
                    trail2[chackObjects]=null
                    obj.position.x=game.world.centerX+800
                    obj.position.x=game.world.centerY+100
                }
                if(trail3[chackObjects]==obj)
                {
                    obj.alpha=0
                    trail3[chackObjects]=null
                    obj.position.x=game.world.centerX+800
                    obj.position.x=game.world.centerY+200
                }   
            }
        }else
        {
            mine.alpha=0
            mineActive=false
            startGame=false
            mine.position.x=game.world.centerX+800
            if(pointsBar.number>=10){
                
                tweenTiempo=game.add.tween(timeBar.scale).to({x:11.5,y:.7}, 400, Phaser.Easing.Linear.Out, true, 100)
                tweenTiempo.onComplete.add(function(){
                missPoint()
                reset()
            })
            }else{
                
                game.add.tween(scale).to({x:10}, 10000, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                missPoint()
                reset()
            })    
            }
            
            
            
        }
        
    }
    
    function outOfThisWorld(obj){
        
        
        
        
    }
    
    function reset()
    {
        //limpamos todos los objetos
        
        for(var reseting=0;reseting<4;reseting++){
            
            if(trail1[reseting]!=null){
            trail1[reseting].alpha=0
            
            trail1[reseting].position.x=800
            }
            if(trail2[reseting]!=null){
            trail2[reseting].alpha=0
            trail2[reseting].position.x=800
            }
            if(trail3[reseting]!=null){
            trail3[reseting].alpha=0
            trail3[reseting].position.x=800
            }
            
        }
        
        character.alpha=1
        actualTrail=1
        if(lives==2){
            character.setAnimationByName(1,"LOSE",true);
        }
        if(lives==1){
            character.setAnimationByName(1,"LOSESTILL",true);
        }
        
        
    }
	
    function objectOut(obj) {


    obj.position.x=0
    obj.alpha=0
    obj=null
        
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
        particle.makeParticles('atlas.garbage',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.5;
        particle.maxParticleScale = 1;
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

				particle.makeParticles('atlas.garbage',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.garbage','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.garbage','smoke');
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
		name: "garbageDiving",
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