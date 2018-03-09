
var soundsPath = "../../shared/minigames/sounds/"

var pictoTribe = function(){
    
	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/pictoTribe/atlas.json",
                image: "images/pictoTribe/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/pictoTribe/timeAtlas.json",
                image: "images/pictoTribe/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
				file: "images/pictoTribe/tutorial_image.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "explode",
				file: soundsPath + "explode.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "magic",
                //file: soundsPath + "gameLose.mp3"},
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                //file: soundsPath + "magic.mp3"}
                file: soundsPath + "gameLose.mp3"},
            {
                name: 'gameSong',
                file: soundsPath + 'songs/happy_game_memories.mp3'
                }
		],
        spines:[
            {
            	name:"caveManSpine",
            	file:"images/spines/CaveMan/caveman.json"
            },
            {
            	name:"eagleSpine",
            	file:"images/spines/Eagle/eagle.json"
            }
        ]
    }

    var NUM_LIFES = 3
    var X_SPACES = 6
    var DELTA_SPACE_X = 41.5
    var DELTA_SPACE_Y =41.5
    var Y_SPACES = 10

    var INITIAL_TIME = 16000
    var DELTA_TIME = 250
    var MIN_TIME = 10000
    var LEVLES_TO_TIMER = 3

    var INITIAL_QUADS_PAINTED = 10
    var DELTA_QUADS = 2

    var LEVELS = [
        [
            [0,0,0,0,0,0],
            [0,1,0,0,1,0],
            [1,1,1,1,1,1],
            [1,0,0,0,0,1],
            [1,1,0,0,1,1],
            [1,0,0,0,0,1],
            [1,0,1,1,0,1],
            [1,0,0,0,0,1],
            [0,1,1,1,1,0],
            [0,0,0,0,0,0]
        ],
        [
            [0,0,1,1,0,0],
            [0,0,1,1,0,0],
            [0,1,1,1,1,0],
            [0,1,0,0,1,0],
            [0,1,0,1,1,0],
            [0,1,0,0,1,0],
            [1,1,0,0,1,1],
            [0,1,1,1,1,0],
            [0,0,1,1,0,0],
            [0,1,1,1,1,0]
        ],
        [
            [0,0,0,0,0,0],
            [1,1,0,0,1,1],
            [1,0,0,0,0,1],
            [1,1,1,1,1,1],
            [1,0,0,0,0,1],
            [1,1,0,1,0,1],
            [1,0,0,0,0,1],
            [1,0,1,1,0,1],
            [1,1,1,1,1,1],
            [0,0,0,0,0,0]
        ],
        [
            [0,0,0,0,0,0],
            [0,0,1,1,0,0],
            [0,1,1,1,1,0],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,0,1,0,1,0],
            [0,1,1,1,1,0],
            [0,0,1,0,0,0],
            [0,0,1,0,0,0],
            [0,1,1,1,1,0]
        ],
        [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,1,1],
            [0,0,0,1,1,1],
            [0,0,1,1,1,0],
            [1,0,1,1,0,0],
            [0,1,0,0,0,0],
            [1,0,1,0,0,0]
        ],
        [
            [0,0,0,0,0,0],
            [0,1,1,1,1,1],
            [0,1,0,0,0,1],
            [0,1,0,0,0,1],
            [0,1,0,0,0,1],
            [1,1,0,0,1,1],
            [1,1,0,0,1,1],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]
        ],
        [
            [0,0,0,0,0,0],
            [0,0,1,1,0,0],
            [0,1,1,1,1,0],
            [1,1,0,1,1,1],
            [1,1,1,0,1,1],
            [0,1,1,1,1,0],
            [0,0,1,1,0,0],
            [1,1,1,1,1,1],
            [1,0,1,1,0,1],
            [1,0,1,1,0,1]
        ]

    ]

    
    var lives
	var sceneGroup = null
    var gameIndex = 156
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var timeOn = false
    var clock, tweenTiempo, timeBar
    var currentLevel
    var currentTime

    var pointsArray

    var space_0

    var inTutorial
    var hand
    var tutorialTween

    var canTouch 

    var caveMan
    var eagle

    var textsArray

    var offset = {x:10,y:1}
    var quadsPainted

    var imageGraphic 
    var realiseTouch
 	var totalPointsArray
 	var wrongGraphic

 	var grid


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        currentTime = INITIAL_TIME
        canTouch = false
        currentLevel = null
        inTutorial = 0
        realiseTouch = true

        horizontalTexts = []
        verticalTexts = []

        quadsPainted = INITIAL_QUADS_PAINTED

        loadSounds()
        
	}



    function preload(){
        game.stage.disableVisibilityChange = false;
        game.load.spritesheet("coin", 'images/pictoTribe/coin.png', 122, 123, 12)
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.game','hearts')

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

    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins')
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
    
    function createPart(atlas,key){

        var particles = game.add.emitter(0, 0, 100);

        particles.makeParticles(atlas,key);
        particles.minParticleSpeed.setTo(-200, -50);
        particles.maxParticleSpeed.setTo(200, -100);
        particles.minParticleScale = 0.2;
        particles.maxParticleScale = 1;
        particles.gravity = 150;
        particles.angularDrag = 30;

        return particles
    }

    function positionTimer(){
      clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
      timeBar.scale.setTo(8,.45)
      sceneGroup.add(clock)
      sceneGroup.add(timeBar)
      timeBar.alpha=1
      clock.alpha=1

    }

    function stopTimer(){
        if(tweenTiempo){
        	tweenTiempo.stop()
      	}
      tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
      })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
           missPoint()
           stopTimer()
           if(lives>0){
           		startTimer(currentTime)


           		
           }
       })
    }

    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.centerX
       coins.y=objectBorn.centerY
       
       /*var emitter = epicparticles.newEmitter("pickedEnergy")
       emitter.duration=1;
       emitter.x = coins.x
       emitter.y = coins.y*/

       correctParticle.x = objectBorn.x
        correctParticle.y = objectBorn.y
        correctParticle.start(true, 1000, null, 5)

       game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
       game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
           game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
               coins.x=objectBorn.centerX
               coins.y=objectBorn.centerY
               addPoint(5)
           })
       })
    }

    function stopGame(){

        backgroundSound.stop()
        inputsEnabled = false
        
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
            sound.play("gameLose")
		})
    }
    
    

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.Linear.none,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.Linear.none,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function addPoint(number){

        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        numPoints++
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

    }
    
    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(heartsGroup.text,'-1')
        
        if(lives === 0){

			if(timeOn){
				stopTimer()
			}
			caveMan.setAnimationByName(0,'lose',true)
	    	eagle.setAnimationByName(0,'lose',true)
            stopGame(false)
        }

    }
    


    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        inputsEnabled = true
        setRound()

    }
    
    function update() {
        if(canTouch){
            if(game.input.activePointer.isDown){
                if(!realiseTouch){
                    return
                }
                var pos = evaluateTouchPosition()
                //console.log(pos)
                realiseTouch = false
                //console.log(pointsArray)
                if(pos.inGrid){
                    var correct = false
                    for(var i = 0; i < pointsArray.length; i++){
                        if(pos.x == pointsArray[i].x && pos.y == pointsArray[i].y){
                            correct = true
                            var x = space_0.x + (pointsArray[i].x*DELTA_SPACE_X) - (DELTA_SPACE_X/2)
                            var y = space_0.y + (pointsArray[i].y*DELTA_SPACE_Y) - (DELTA_SPACE_Y/2)
                            totalPointsArray.push(pointsArray[i])
                            pointsArray.splice(i,1)
                            imageGraphic.beginFill(0xffffff)
                            imageGraphic.drawRect(x,y,DELTA_SPACE_X,DELTA_SPACE_Y)
                            imageGraphic.endFill()
                            break
                        }
                    }

                    if(correct){
                    	if(pointsArray.length==0){
                    		canTouch = false
                    		wrongGraphic.clear()
                    		caveMan.setAnimationByName(0,'win',true)
	                    	eagle.setAnimationByName(0,'win',true)
                    		Coin(grid,pointsBar,500)
                    		setTimeout(nextRound,3000)
                    	}
                    }
                    else{
                    	for(var i = 0; i < totalPointsArray.length; i++){
	                        if(pos.x == totalPointsArray[i].x && pos.y == totalPointsArray[i].y){
	                            correct = true
	                            break
	                        }
	                    }
	                    if(!correct){
	                    	totalPointsArray.push({x:pos.x,y:pos.y})
	                    	var x = space_0.x + (pos.x*DELTA_SPACE_X) - (DELTA_SPACE_X/2)
                            var y = space_0.y + (pos.y*DELTA_SPACE_Y) - (DELTA_SPACE_Y/2)
	                    	wrongGraphic.beginFill(0xff0000)
                            wrongGraphic.drawRect(x,y,DELTA_SPACE_X,DELTA_SPACE_Y)
                            wrongGraphic.endFill()
	                    	missPoint()
	                    	caveMan.setAnimationByName(0,'bad',false)
	                    	caveMan.addAnimationByName(0,'idle',true)
	                    	eagle.setAnimationByName(0,'bad',false)
	                    	eagle.addAnimationByName(0,'idle',true)

	                    }
                    }
                }
            }
            else{
                realiseTouch = true
            }

        }
    }


    function evaluateTouchPosition(){
        var position = {x:0,y:0,inGrid: false}
        var x = (game.input.activePointer.x - space_0.x)/DELTA_SPACE_X 
        var y = (game.input.activePointer.y - space_0.y)/DELTA_SPACE_Y 
        x = Math.round(x)
        y = Math.round(y)

        if(x >= 0 && x <X_SPACES && y >= 0 && y < Y_SPACES){
            position.x = x
            position.y = y
            position.inGrid = true
        }

        return position

    }

    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }


    

    function setRound(){
    	caveMan.setAnimationByName(0,'idle',true)
	    eagle.setAnimationByName(0,'idle',true)
        currentLevel = LEVELS[game.rnd.integerInRange(0,LEVELS.length-1)]
        //currentLevel = LEVELS[5]
        var horizontalNumbers = []
        var verticalNumbers = []
        pointsArray = []
        totalPointsArray = []

        for(var i = 0; i < Y_SPACES; i++){
            horizontalNumbers[i] = []
            var last = 0
            for(var j = 0; j < X_SPACES; j++){
                if(currentLevel[i][j]==1){
                	var p = {x:j,y:i}
                    pointsArray.push(p)
                    
                    last++
                }
                else{
                    if(last!=0){
                        horizontalNumbers[i].push(last)
                        last = 0
                    }
                }
            }
            if(last!=0){
                horizontalNumbers[i].push(last)
                last = 0
            }
            else if(horizontalNumbers[i].length==0){
               horizontalNumbers[i].push(0) 
            }
        }


        for(var i = 0; i< horizontalNumbers.length; i++){
        	var number = 1
            for(var j = horizontalNumbers[i].length-1; j>=0; j--){
                if(horizontalNumbers[i][j]==0){
                    continue
                }
                var x = space_0.x - (DELTA_SPACE_X*number)
                var y = space_0.y + (DELTA_SPACE_Y * i)
                number ++
                createTex(x,y,horizontalNumbers[i][j])
            }
        }

        for(var i = 0; i < X_SPACES; i++){
            verticalNumbers[i] = []
            var last = 0
            for(var j = 0; j < Y_SPACES; j++){
                if(currentLevel[j][i]==1){
                    last++
                }
                else{
                    if(last!=0){
                        verticalNumbers[i].push(last)
                        last = 0
                    }
                }
            }
            if(last!=0){
                verticalNumbers[i].push(last)
                last = 0
            }
            else{
               verticalNumbers[i].push(0) 
            }
        }

        for(var i = 0; i< verticalNumbers.length; i++){
            var number = 1
            for(var j = verticalNumbers[i].length-1; j>=0; j--){
                if(verticalNumbers[i][j]==0){
                    continue
                }
                var x = space_0.x +(DELTA_SPACE_X*i)
                var y = space_0.y - (DELTA_SPACE_Y*number)
                number ++
                createTex(x,y,verticalNumbers[i][j])
            }


        }
        
        for(var i = 0; i < quadsPainted; i++){
            var r = game.rnd.integerInRange(0,pointsArray.length-1)
            var x = space_0.x + (pointsArray[r].x*DELTA_SPACE_X) - (DELTA_SPACE_X/2)
            var y = space_0.y + (pointsArray[r].y*DELTA_SPACE_Y) - (DELTA_SPACE_Y/2)
            totalPointsArray.push(pointsArray[r])
            pointsArray.splice(r,1)
            imageGraphic.beginFill(0xffffff)
            imageGraphic.drawRect(x,y,DELTA_SPACE_X,DELTA_SPACE_Y)
            imageGraphic.endFill()
        }

        if(quadsPainted>0){
            quadsPainted-=DELTA_QUADS
            if(quadsPainted < 0){
                quadsPainted = 0
            }
        }

        canTouch = true

    }

    


    function nextRound(){
    	imageGraphic.clear()
    	wrongGraphic.clear()
    	for(var i = 0; i < textsArray.length; i++){
    		textsArray.children[i].visible = false
    	}
    	setRound()
    }



    function evalTutorial(){
    	if(tutorialTween !=null){
    		return
    	}

    	hand.visible = true
    	evalPosTutorial()
    	switch(inTutorial){
    		case 0:
            hand.x = space_0.x+(sculptureImage.initX*DELTA_SPACE_X)
            hand.y = space_0.y+(sculptureImage.initY*DELTA_SPACE_Y)+(offset/2)
    		hand.loadTexture('atlas.game','handDown')
    		setTimeout(function(){
    			
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		},500)
    		break

    		case 1:
    		hand.loadTexture('atlas.game','handDown')

    		setTimeout(function(){
    			
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		},500)
    		break

    		case 2:
    		hand.loadTexture('atlas.game','handDown')

    		setTimeout(function(){
    			
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		},500)
    		break

    		case 3:
    		hand.loadTexture('atlas.game','handDown')

    		setTimeout(function(){
    			
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		},500)
    		break

    		default:
    		inTutorial = -1
    		hand.visible = false
    		break
    	}
    }

    function createTex(x,y,number){
        for(var i = 0; i < textsArray.length; i++){
            if(!textsArray.children[i].visible){
            	//console.log("Text created")
                textsArray.children[i].visible = true
                textsArray.children[i].x = x
                textsArray.children[i].y = y
                textsArray.children[i].number.setText(number)
                return
            }
        }

        var quad = textsArray.create(x,y,'atlas.game','cuadrillo')
        quad.anchor.setTo(0.5)
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var text = new Phaser.Text(sceneGroup.game, -quad.width/4, -quad.height/2, number, fontStyle)
        quad.addChild(text)
        quad.number = text

    }


    
    function createScene(){

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var backgroundTile = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.game','tile')
        backgroundGroup.add(backgroundTile)
        backgroundTile.tilePosition.x = game.world.centerX - (544/2)

        grid = sceneGroup.create(game.world.centerX,game.world.centerY-120,'atlas.game','grid')
        grid.anchor.setTo(0.5)

        space_0 = {x:grid.x - (((X_SPACES-1)/2)*DELTA_SPACE_X)+offset.x, y: grid.y -(((Y_SPACES-1)/2)*DELTA_SPACE_Y)+offset.y}
    
        /*var test = game.add.graphics(0.0)
        test.beginFill(0xffffff)
        test.drawCircle(space_0.x,space_0.y,10)
        test.drawCircle(grid.x+offset.x,grid.y+offset.y,10)*/
        initialize()

        var rocks = sceneGroup.create(game.world.centerX,game.world.height+50,'atlas.game','rocas')
        rocks.anchor.setTo(0.5,1)

        caveMan = game.add.spine(game.world.centerX - 200, game.world.height-50,'caveManSpine')
        caveMan.setSkinByName('normal')
        caveMan.setAnimationByName(0,'idle',true)
        sceneGroup.add(caveMan)

        eagle = game.add.spine(game.world.centerX + 200, game.world.height-50,'eagleSpine')
        eagle.scale.setTo(-1,1)
        eagle.setSkinByName('normal')
        eagle.setAnimationByName(0,'idle',true)
        sceneGroup.add(eagle)
        

        imageGraphic = game.add.graphics(0,0)
        sceneGroup.add(imageGraphic)

        wrongGraphic = game.add.graphics(0,0)
        sceneGroup.add(wrongGraphic)

        textsArray = game.add.group()
        sceneGroup.add(textsArray)


        backgroundSound = game.add.audio('gameSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            game.sound.mute = false
        }, this);


        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        
        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false
        
        createTutorial()

        createPointsBar()
        createHearts()


        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        
    }
    
	return {
		assets: assets,
		name: "pictoTribe",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()



function lerp(a,b,t){
    return a + (b - a) * t;
}