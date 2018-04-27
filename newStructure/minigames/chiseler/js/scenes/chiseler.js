
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"

var chiseler = function(){
    
	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/chiseler/atlas.json",
                image: "images/chiseler/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/chiseler/timeAtlas.json",
                image: "images/chiseler/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
				file: "images/chiseler/tutorial_image.png"}
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
            	name:"sculptureSpine",
            	file:"images/spines/Escultura/sculpture.json"
            },
            {
            	name:"marbleSpine",
            	file:"images/spines/Marmol/marble.json"
            }
        ]
    }

    var NUM_LIFES = 3
    var X_SPACES = 4
    var DELTA_SPACE_X = 112
    var DELTA_SPACE_Y = 140
    var Y_SPACES = 5

    var LEVELS_TO_HIDE = 3

    var INITIAL_TIME = 16000
    var DELTA_TIME = 250
    var MIN_TIME = 10000
    var LEVLES_TO_TIMER = 3

    var SCULPTURE_NAMES = ['thinker','david','venus','mermaid','ladyJustice']
    
    var lives
	var sceneGroup = null
    var gameIndex = 154
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var timeOn = false
    var clock, tweenTiempo, timeBar
    var currentLevel = 0
    var currentTime

    var gridArray
    var spacesInLine
    var currentDirection

    var space_0

    var inTutorial
    var hand
    var tutorialTween

    var sculptureImage 
    var canTouch 

    var scaleFactor 
    var offset = 30

    var currentClearSpaces 
    var releaseTouch

    var marbleSpine
    var sculptureSpine
    var lineBackground
    var marble

    var quadsHide

    var worngImages



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
        releaseTouch = true

        quadsHide = 0
        inTutorial = 0

        loadSounds()
        
	}



    function preload(){
        game.stage.disableVisibilityChange = false;
        game.load.spritesheet("coin", 'images/chiseler/coin.png', 122, 123, 12)
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
               addPoint(1)
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
        	marble.visible = false
			lineBackground.visible = false
			sculptureImage.visible = false

			for(var i = 0; i< worngImages.length; i++){
				worngImages.children[i].visible=false
			}

			marbleSpine.visible = true
			marbleSpine.setAnimationByName(0,'BROKE',false)

			if(timeOn){
				stopTimer()
			}

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
        		if(!releaseTouch){
        			return
        		}
        		var pos = evaluateTouchPosition()

        		if(inTutorial!=-1){
        			if((pos.x == sculptureImage.initX && pos.y == sculptureImage.initY && inTutorial==0) || (pos.x == (sculptureImage.initX+1) && pos.y == sculptureImage.initY && inTutorial==1) || (pos.x == sculptureImage.initX && pos.y == (sculptureImage.initY+1) && inTutorial==2) || (pos.x == (sculptureImage.initX+1) && pos.y == (sculptureImage.initY+1) && inTutorial==3)){
        				//console.log("NextTutorial")
        			}
        			else{
        				//console.log(pos,inTutorial,sculptureImage.initX,sculptureImage.initY)
        				return
        			}
        		}


        		if(pos.inGrid){
        			releaseTouch = false
        			var touchImage = false
        			for(var i = 0; i < 2; i ++){
        				for(var j = 0; j < 2; j++){
        					var index = (i*2)+j

        					if(pos.x == sculptureImage.initX+i && pos.y == sculptureImage.initY+j){
        						touchImage = true
        						if(currentClearSpaces.indexOf(index)!=-1){
	        						break
	        					}
        						if(sculptureImage.initialMask){
        							sculptureImage.mask.clear()
        							sculptureImage.initialMask = false
        						}

        						sculptureImage.mask.beginFill(0xffffff)
						        sculptureImage.mask.drawRect((DELTA_SPACE_X*i)*scaleFactor, (DELTA_SPACE_Y*j)*scaleFactor, DELTA_SPACE_X*scaleFactor,DELTA_SPACE_Y*scaleFactor);
						        sculptureImage.mask.endFill()

						        currentClearSpaces.push(index)

						        if(inTutorial !=-1 ){
						        	inTutorial++
						        	console.log(inTutorial)
						        	evalPosTutorial()
						        }

						        break
        					}
        				}
        				if(touchImage){
        					break
        				}
        			}
        			sound.play('explode')
        			if(!touchImage){
        				sound.play('wrong')
        				for(var i = 0; i< worngImages.length; i++){
        					if(!worngImages.children[i].visible){
        						worngImages.children[i].visible=true
        						worngImages.children[i].x = space_0.x+(pos.x*DELTA_SPACE_X)
        						worngImages.children[i].y = space_0.y+(pos.y*DELTA_SPACE_Y)+(offset/2)
        						break
        					}
        				}
        				missPoint()
        			}
        			else{
        				sound.play('right')
        				if(currentClearSpaces.length==4){
        					if(timeOn){
        						stopTimer()
        					}
        					Coin(sculptureImage,pointsBar,200)

        					for(var i = 0; i< worngImages.length; i++){
        						worngImages.children[i].visible=false
        					}

        					marble.visible = false
        					lineBackground.visible = false
        					sculptureImage.visible = false
        					sculptureSpine.visible= true
        					sculptureSpine.setSkinByName('sculpture'+sculptureImage.id)
        					sculptureSpine.setAnimationByName(0,'WIN',false)

        					marbleSpine.visible = true
        					marbleSpine.setAnimationByName(0,'BROKE',false)

        					setTimeout(nextRound,2000)
        				}
        			}
        		}
        	}
        	else{
        		releaseTouch = true
        	}
        }
    }


    function evaluateTouchPosition(){
        var position = {x:0,y:0,inGrid: false}
        var x = (game.input.activePointer.x - space_0.x)/DELTA_SPACE_X 
        var y = (game.input.activePointer.y - (space_0.y+(offset/2)))/DELTA_SPACE_Y 
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
    	currentClearSpaces = []
    	//canTouch = true
        
        var x = game.rnd.integerInRange(0,X_SPACES-2)
        var y = game.rnd.integerInRange(0,Y_SPACES-2)

        console.log(x,y)

        var r = game.rnd.integerInRange(0,SCULPTURE_NAMES.length-1)

        sculptureImage.id = r+1

        sculptureImage.loadTexture('atlas.game',SCULPTURE_NAMES[r],0,false)

        sculptureImage.x = space_0.x+(x*DELTA_SPACE_X)+(DELTA_SPACE_X/2)
        sculptureImage.y = space_0.y+(y*DELTA_SPACE_Y)+(DELTA_SPACE_Y/2)+(offset/2)

        sculptureImage.initX = x
        sculptureImage.initY = y

        sculptureImage.mask.clear()

        if(quadsHide!=0){
			sculptureImage.mask.beginFill(0xffffff)
        	var show = 4 - quadsHide
        	var groupQuads = [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}]
        	for(var i = 0; i < show; i++){
        		var r = game.rnd.integerInRange(0,groupQuads.length-1)
        		var point = groupQuads[r]
        		groupQuads.splice(r,1)

        		sculptureImage.mask.drawRect((DELTA_SPACE_X*point.x)*scaleFactor, (DELTA_SPACE_Y*point.y)*scaleFactor, DELTA_SPACE_X*scaleFactor,DELTA_SPACE_Y*scaleFactor);

        	}
        	sculptureImage.mask.endFill()
        }
        /*sculptureImage.mask.beginFill(0xffffff)
        sculptureImage.mask.drawRect(0, 0, 0, 0);
        sculptureImage.mask.endFill()*/
        sculptureImage.alpha = 0
        var tween = game.add.tween(sculptureImage).to({alpha:1},500,Phaser.Easing.linear,false)
        var tween2 = game.add.tween(sculptureImage).to({alpha:0},500,Phaser.Easing.linear,false,200)
        tween.chain(tween2)
        tween2.onComplete.add(startRound)
        tween.start()

        sculptureImage.initialMask = true

        if(currentLevel > LEVLES_TO_TIMER){
            if(!timeOn){
               timeOn = true
               positionTimer()
            }
        }
        

    }

    function startRound(){
    	canTouch = true
    	sculptureImage.alpha = 1

    	sculptureImage.mask.clear()
    	sculptureImage.mask.beginFill(0xffffff)
        sculptureImage.mask.drawRect(0, 0, 0, 0);
        sculptureImage.mask.endFill()

        if(inTutorial!=-1){
        	evalTutorial()
        }

        if(timeOn){
            startTimer(currentTime)
            if(currentTime > MIN_TIME){
                currentTime -= DELTA_TIME
            }
        }
    }


    function nextRound(){
    	currentLevel++

    	if(currentLevel%LEVELS_TO_HIDE==0){
    		if(quadsHide<3){
	    		quadsHide++
	    	}
    	}

    	marble.visible = true
    	lineBackground.visible = true
    	sculptureImage.visible = true
    	marbleSpine.visible = false
    	sculptureSpine.visible= false
    	setRound()
    }

    function evalPosTutorial(){
    	switch(inTutorial){
    		case 0:
    		hand.x = space_0.x+(sculptureImage.initX*DELTA_SPACE_X)
        	hand.y = space_0.y+(sculptureImage.initY*DELTA_SPACE_Y)+(offset/2)
    		break

    		case 1:
    		hand.x = space_0.x+((sculptureImage.initX+1)*DELTA_SPACE_X)
        	hand.y = space_0.y+(sculptureImage.initY*DELTA_SPACE_Y)+(offset/2)
    		break

    		case 2:
    		hand.x = space_0.x+((sculptureImage.initX)*DELTA_SPACE_X)
        	hand.y = space_0.y+((sculptureImage.initY+1)*DELTA_SPACE_Y)+(offset/2)

    		break

    		case 3:
    		hand.x = space_0.x+((sculptureImage.initX+1)*DELTA_SPACE_X)
        	hand.y = space_0.y+((sculptureImage.initY+1)*DELTA_SPACE_Y)+(offset/2)
    		break

    		default:
    		break
    	}
    }

    function evalTutorial(){
    	if(tutorialTween !=null){
    		return
    	}

    	hand.visible = true
    	evalPosTutorial()
    	switch(inTutorial){
    		case 0:
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


    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var background = game.add.graphics(0,0)
        background.beginFill(0x4e99cb)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        backgroundGroup.add(background)

        var backgroundTile = backgroundGroup.create(game.world.centerX,game.world.centerY,'atlas.game','background')
        backgroundTile.anchor.setTo(0.5)

        marble = sceneGroup.create(game.world.centerX,game.world.centerY-60,'atlas.game','marble')
        marble.anchor.setTo(0.5)

        space_0 = {x:marble.x - (((X_SPACES-1)/2)*DELTA_SPACE_X), y: marble.y -(((Y_SPACES-1)/2)*DELTA_SPACE_Y)}

        var topLefCorner = {x:marble.x - (marble.width/2), y: marble.y -(marble.height/2)+offset}
        lineBackground = game.add.graphics(0,0)

        for(var i = 0; i <= X_SPACES; i++){
            lineBackground.lineStyle(5, 0xffffff);
            lineBackground.moveTo(topLefCorner.x +(DELTA_SPACE_X*i),topLefCorner.y);
            lineBackground.lineTo(topLefCorner.x +(DELTA_SPACE_X*i), topLefCorner.y + (marble.height-offset) );
        }

        for(var i = 0; i <= Y_SPACES; i++){
            lineBackground.lineStyle(5, 0xffffff);
            lineBackground.moveTo(topLefCorner.x ,topLefCorner.y+(DELTA_SPACE_Y*i));
            lineBackground.lineTo(topLefCorner.x+ marble.width, topLefCorner.y +(DELTA_SPACE_Y*i) );
        }
        sceneGroup.add(lineBackground)

        

        initialize()

        sculptureImage = sceneGroup.create(0,0,'atlas.game','david')
        sculptureImage.anchor.setTo(0.5)
        sculptureImage.scale.setTo(0.4)

        scaleFactor = (1/sculptureImage.scale.x)

        var mask = game.add.graphics(-DELTA_SPACE_X*scaleFactor,-DELTA_SPACE_Y*scaleFactor)
        mask.beginFill(0xffffff)
        mask.drawRect(0, 0, 0, 0);
        //mask.drawRect(120,0,100,100)
        mask.endFill()

        sculptureImage.mask = mask
        sculptureImage.addChild(mask)

        worngImages = game.add.group()
        for(var i = 0; i < 3; i ++){
        	var wrong = worngImages.create(0,0,'atlas.game','bad_crack')
        	wrong.anchor.setTo(0.5)
        	wrong.scale.setTo(0.8)
        	wrong.visible = false
        }
        sceneGroup.add(worngImages)
        

        sculptureSpine = game.add.spine(game.world.centerX+30,game.world.centerY+50,'sculptureSpine')
        sculptureSpine.setSkinByName('marble')
        sculptureSpine.visible = false
        sceneGroup.add(sculptureSpine)

        marbleSpine = game.add.spine(game.world.centerX,game.world.centerY,'marbleSpine')
        marbleSpine.setSkinByName('marble')
        marbleSpine.visible = false
        sceneGroup.add(marbleSpine)
        
        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = game.world.centerY
        sceneGroup.add(gameGroup)


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
		name: "chiseler",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()



function lerp(a,b,t){
    return a + (b - a) * t;
}