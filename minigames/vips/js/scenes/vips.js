var soundsPath = "../../shared/minigames/sounds/"
var vips = function(){
	assets = {
        atlases: [
            {   
                name: "atlas.vips",
                json: "images/vips/atlas.json?v5",
                image: "images/vips/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/vips/fondo.png"},
            {   name:"logo",
				file: "images/vips/logo.png"},
            
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "splash",
				file: soundsPath + "splashMud.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
            {	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
            {	name: "click",
				file: soundsPath + "pop.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "bomb",
				file: soundsPath + "bomb.mp3"},
		],
	}
    
    var speed = 4
    var gravity 
    var baseWidth = 540
    
    var gameIndex = 17
    var marioSong = null
	var sceneGroup = null
    var answersGroup = null
    var pointsGroup = null
    var questionText = null
    var questionGroup = null
    var purpleBack = null
    var gameActive = true
    var valuesList = null
    var moveLeft, moveRight
    var objectsGroup, usedObjects
    var characterGroup = null
    var timer
    var timeGroup = null
    var pointsBar = null
    var throwTime = null
    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null
    var buddy = null
    var buttonPressed = null
    var tableList
	var isGoal=null
	var proxyGoal
	var first,second
	var shoot
	var objects=new Array(3)
    var block1, block2, block3, block4, block5
	var proxyGame
	var posFinal, posInicial,speed
	var shooted=false
	var powerBar
    var powerTween
	var killzoneProxy, killzoneProxy2
	var winProxy
	var inGoal
	var inGround
	var newPlat1, newPlat2, newPlat3
    var dificulty=5
    var level
    var levelDeleteBlock = 2
	var evaluate
    var randCharac=0
    var goal
    var proxyGoal, goalLight, arrowGoal, zoom
    var correctParticle, wrongParticle, boomParticle, backgroundGroup
    var efectZoom
	
	var randPlats, randPlats2

	var platformsWin
	var platformsWinPosition 
	var initialPlatforms = 4
	var positionRange
	var currentId
	var deltaBlock = 104
	var goalCount
    
    function getSkins(){
        
        /*var dataStore = [
            
            [
                {"tableID":"idGlasses"},
                {"id":"style1","name":"style 80´s","img":"lentes_defautl.png","price":"0","choice":false,"buy":true},
                {"id":"style2","name":"style 90´s","img":"lentes_80s.png","price":"10","choice":true,"buy":false},{"id":"style3","name":"Sunglass","img":"black_glass.png","price":"10","choice":false,"buy":false},
                {"id":"style4","name":"3D Glass","img":"lentes_3d.png","price":0,"choice":true,"buy":false}
            ],
            
            [
                {"tableID":"idHair"},
                {"id":"hairStyle1","name":"Estilo Elvis","img":"hair_style1.png","price":"10","choice":true,"buy":false},
                {"id":"hairStyle2","name":"Estilo punk","img":"hair_style2.png","price":0,"choice":false,"buy":true},
                {"id":"hairStyle3","name":"Estilo emo","img":"hair_style3.png","price":"10","choice":false,"buy":false},
                {"id":"hairStyle4","name":"Estilo smith","img":"hair_style4.png","price":"10","choice":false,"buy":false}
            ],
            
            [
                {"tableID":"idColorBody"},
                {"name":"Morado","color":"0deg","img":"crayon_morado.png","price":"0","choice":true,"buy":false},
                {"name":"Rojo","color":"75deg","img":"crayon_rojo.png","price":"10","choice":false,"buy":false},
                {"name":"Azul","color":"300deg","img":"crayon_azul.png","price":0,"choice":false,"buy":true},
                {"name":"Verde","color":"200deg","img":"crayon_verde.png","price":"10","choice":false,"buy":false}
            ]
            
        ]*/
        
        var dataStore = amazing.getProfile()
        
        
    }
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        lives = 5
        gravity = 500
		shoot=false
		inGoal=false
		inGround=false
		evaluate=false
        dificulty=5
        shooted=false
        randCharac=0
	}
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true

    }
    
    function checkNumbers(){
        
        //console.log(valuesList.length)
        var valuesCompare = [1,2,3,4]
        var tableCompare = [0,0,0,0]
        
        for(var i = 0 ; i < valuesCompare.length;i++){
            
            for(var e = 0; e < valuesList.length;e++){
                //console.log(valuesCompare[i] + ' i ' + valuesList[e] + ' u ')
                if(valuesCompare[i] == valuesList[e]){
                    tableCompare[i]++
                }
            }
        }
        
        //console.log(tableCompare)
        var indexToUse = 0
        var findNumber = false
        for(var i = 0;i < tableCompare.length;i++){
            indexToUse = i
            for(var u = 0;u<tableCompare.length;u++){
                if (i != u){
                    if (tableCompare[i] < tableCompare[u]){
                        break
                    }
                }
                if(u == tableCompare.length - 1){
                    findNumber = true
                }
            }
            if (findNumber == true){
                break
            }
        }
        //console.log(indexToUse + ' number To use')
        return indexToUse
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }    
    
    
    function preload() {
        
		game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
	    game.load.physics('physicsData', 'physics/sprite_physics.json?v3');

		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/circus_gentlejammers.mp3',0.3)
		}else{
			game.load.audio('arcadeSong', soundsPath + 'songs/running_game.mp3');
		}
		
	
    }
    
   
    
    function stopGame(win){
        
        
        sound.play("gameLose")
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        
		if(amazing.getMinigameId()){
			 marioSong.pause()
		 }else{
			 marioSong.stop()
		 }
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function addPoint(number){
        
        sound.play("pop")
        createPart('star', characterGroup.cup)
        // createTextPart('+' + number, +Group.cup)
        
        pointsBar.number+= number
        pointsBar.text.setText(pointsBar.number)
        
    }
    
    function missPoint(){
        
        sound.play("explode")
        
        lives--;
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        if(lives == 0){

            stopGame(false)
        }
        
    }
    
    function deactivateObject(obj){
        
        obj.alpha = 0
        obj.active = false
        obj.x = -100
        
        if(obj.tag != 'obstacle'){
            usedObjects.remove(obj)
            objectsGroup.add(obj)
        }
        
    }
    
    
    function update(){
        if(gameActive == false){
            return
        }
        efectZoom.position.x=character.position.x-100
        efectZoom.position.y=character.position.y-30

        if(character.position.y > game.world.height*0.9){
            evaluate=true
            inGoal = false
            miniReset()
        }

        if(character.position.x > game.world.width*0.95){
        	 evaluate=true
            inGoal = false
            miniReset()
        }


      if(character.body.velocity.x<3 && character.body.velocity.x>-3 && shooted==true && character.body.velocity.y<.5 && character.body.velocity.y>-.5){
		  evaluate=true
            if(randCharac==0){
		      character.loadTexture("atlas.vips","cafe1")
		      }
		      if(randCharac==1){
		      character.loadTexture("atlas.vips","enchiladas1")
		      }
		      if(randCharac==2){
		      character.loadTexture("atlas.vips","malteada1")
		      }
		      if(randCharac==3){
		      character.loadTexture("atlas.vips","soda1")
		      }
              if(randCharac==4){
		      character.loadTexture("atlas.vips","pay1")
		      }
		  miniReset()

	  }
      //console.log(character.body.angularVelocity);
      //console.log(character.body.velocity.x);
      

      if(character.body.velocity.x < 10 && shooted==true){
        character.body.angularVelocity = 0;
        character.body.setZeroRotation()
        character.body.rotation = lerp(character.body.rotation,0,0.02)
        //console.log("lerpAng")
      }

      //console.log(character.body.rotation + "vel "+ character.body.velocity.x)

    if(character.body.rotation > Math.PI/6 ){

        character.body.rotation = Math.PI/6
        
      }
      else if(character.body.rotation < -Math.PI/6){
        character.body.rotation = -Math.PI/6
      }



      character.body.setZeroRotation()
      //console.log(character.body.rotation);
	  
	 	//character.body.rotateLeft(1);
    }

    function lerp(a,b,t){
       return a + t * (b - a);
    }
    
    function onDragStop(obj)
    {
       posFinal=game.input.activePointer.position.x
	   proxyGame.position.x=0
	   proxyGame.position.y=0
	   
	   if(posFinal<posInicial && shooted==false && inGround==true)
		{
            sound.play("swipe")
             var widthRelation = document.body.clientWidth/baseWidth;
		 	speed=(posInicial-posFinal)*widthRelation
			posFinal=0
			posInicial=0
			character.body.velocity.x =speed;
            efectZoom.alpha=1
            game.add.tween(efectZoom).to({alpha:0},speed, Phaser.Easing.Cubic.Out,true)
       
			shooted=true
			speed=0
			game.add.tween(powerBar.scale).to({x: 0,y:2}, 200, Phaser.Easing.linear, true)
		}else{
			posFinal=0
			posInicial=0
			game.add.tween(powerBar.scale).to({x: 0,y:2}, 200, Phaser.Easing.linear, true)
		}
    }
    
	 function onDragUpdate(obj)
    {
		posFinal=game.input.activePointer.position.x
        var widthRelation = document.body.clientWidth/baseWidth;
		speed=posInicial-posFinal
        

        var speedRealtionPixels = 60/widthRelation;
		if(shooted==false && posFinal<posInicial){
			
			game.add.tween(powerBar.scale).to({x: -speed/speedRealtionPixels}, 100, Phaser.Easing.linear, true)
		}
    }
    
    function onDragStart(obj)
    {
		if(shooted==false && inGround==true){
		  posInicial=game.input.activePointer.position.x
		}
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.vips','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height*=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.vips','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
     function updateSeconds(){
        
        timeGroup.number += 1;
        timeGroup.textI.setText(timeGroup.number / 100)
        
    }
    
    function checkPosObj(posX){
        
        var samePos = false
        for(var i = 0;i<usedObjects.length;i++){
            var obj = usedObjects.children[i]
            if(Math.abs(obj.x - posX) < 75 && Math.abs(obj.y - -50) < 100){
                samePos = true
            }
        }
        return samePos
        
    }
    
    
    
    function createAssets(tag,points,number){
        
        itemList[itemList.length] = tag
        for(var i = 0; i < number;i++){
            var item = objectsGroup.create(-100,0,'atlas.vips',tag)
            item.anchor.setTo(0.5,0.5)
            item.tag = 'candy'
            item.points = points
            item.id = tag
        }
        
    }
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        // for(var i = 0;i<particlesGroup.length;i++){
            
            // var particle = particlesGroup.children[i]
            // if(!particle.used && particle.tag == key){
                
                // particle.used = true
                // particle.alpha = 1
                
                // particlesGroup.remove(particle)
                // particlesUsed.add(particle)
                
                // return particle
                // break
            // }
        // }
        
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
        particle.makeParticles('atlas.vips',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .5;
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

				particle.makeParticles('atlas.vips',tag);
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
    
    function reset(){
        
        if(dificulty>2){
			
			dificulty--
			
		}
        randPlats=game.rnd.integerInRange(dificulty,5)
				newPlat1.kill()
				if(randPlats==1){
                newPlat1.reset(game.world.x+80,game.world.height-100)
				newPlat1.loadTexture('atlas.vips','bloque'+randPlats)
				newPlat1.body.clearShapes()
				newPlat1.body.loadPolygon('physicsData', "bloque"+randPlats)

				}
				if(randPlats==4){
                newPlat1.reset(game.world.x+150,game.world.height-98) 
				newPlat1.loadTexture('atlas.vips','bloque'+randPlats)
				newPlat1.body.clearShapes()
				newPlat1.body.loadPolygon('physicsData', "bloque"+randPlats)

				}
				if(randPlats==2){
                newPlat1.reset(game.world.x+150,game.world.height-98) 
				newPlat1.loadTexture('atlas.vips','bloque'+randPlats)
				newPlat1.body.clearShapes()
				newPlat1.body.loadPolygon('physicsData', "bloque"+randPlats)

				}
                if(randPlats==3){
                newPlat1.reset(game.world.x+150,game.world.height-100.5) 
				newPlat1.loadTexture('atlas.vips','bloque'+randPlats)
				newPlat1.body.clearShapes()
				newPlat1.body.loadPolygon('physicsData', "bloque"+randPlats)

				}
                if(randPlats==5){
                newPlat1.reset(game.world.x+150,game.world.height-100.5) 
				newPlat1.loadTexture('atlas.vips','bloque'+randPlats)
				newPlat1.body.clearShapes()
				newPlat1.body.loadPolygon('physicsData', "bloque"+randPlats)

                }
                
        
     

		level++
		console.log("CurrentLevel "+level)
		if(level < levelDeleteBlock*4){
			if(level%levelDeleteBlock==0){
				currentId = initialPlatforms-(level/levelDeleteBlock)
				platformsArray[currentId].proxy.kill()
				//platformsArray[currentId].green.kill()
				//platformsArray[currentId].light.kill()
				platformsArray[currentId].group.visible = false
				platformsArray[currentId].kill()
			}
		}

		var x = game.rnd.integerInRange(positionRange.min,positionRange.max)
		//x = 100
		var idCorret
		if(currentId>=3){
			idCorrect = game.rnd.integerInRange(0,currentId-1)
		}
		else{
			idCorrect = game.rnd.integerInRange(0,currentId)
		}

		for(var i = 0 ; i < currentId; i ++){
			platformsArray[i].body.x = x+(i*deltaBlock)
			platformsArray[i].proxy.body.x = x+(i*deltaBlock);
			/*platformsArray[i].green.x = platformsArray[i].x-52
			platformsArray[i].light.x = platformsArray[i].x-55*/
			platformsArray[i].group.x = x - platformsWinPosition
			platformsArray[i].group.visible = false
			//platformsArray[i].proxy.visible = false
			platformsArray[i].proxy.kill()
			if(currentId>=3){
				if(i == idCorrect || i == (idCorrect+1)){
					platformsArray[i].proxy.visible = true
					platformsArray[i].group.visible = true
					platformsArray[i].proxy.revive()
					if(i == (idCorrect+1)){
						platformsArray[i].light.visible = false
					}
					else{
						platformsArray[i].light.visible = true
					}
				}
			}
			else{
				if(i == idCorrect){
					platformsArray[i].proxy.visible = true
					platformsArray[i].group.visible = true
					platformsArray[i].proxy.revive()
				}
			}

		}

		

		//platformsWin.x = 100


		randCharac=3
		if(randCharac==0){
		character.loadTexture("atlas.vips","cafe1")
		character.body.clearShapes()
		//game.physics.p2.enable([ character ],true)
		character.body.loadPolygon('physicsData', "cafe1")
        character.reset(game.world.x+50,game.world.centerY+170)
		}
		if(randCharac==1){
		character.loadTexture("atlas.vips","enchiladas1")
		character.body.clearShapes()
		character.body.loadPolygon('physicsData', "enchiladas1")
        character.reset(game.world.x+100,game.world.centerY+170)
		}
		if(randCharac==2){
		character.loadTexture("atlas.vips","malteada1")
		character.body.clearShapes()
		character.body.loadPolygon('physicsData', "malteada1")
        character.reset(game.world.x+50,game.world.centerY+100)
		}
		if(randCharac==3){
		character.loadTexture("atlas.vips","soda1")
		character.body.clearShapes()
		character.body.loadPolygon('physicsData', "soda1")
        character.reset(game.world.x+50,game.world.centerY+150)
		}
        if(randCharac==4){
		character.loadTexture("atlas.vips","pay1")
		character.body.clearShapes()
		character.body.loadPolygon('physicsData', "pay1")
        character.reset(game.world.x+90,game.world.centerY+170)
		}
		character.position.x=game.world.x+30
		character.position.y=game.world.centerY+230
        character.body.angle=0
        
    }
	function miniReset(){
		goalCount = 0
		character.body.setZeroVelocity();
		
		if(inGoal==false && lives>0){
			missPoint()

            wrongParticle.position.x=character.position.x+50
            wrongParticle.position.y=character.position.y
            wrongParticle.start(true, 1000, null, 5)
            
				if(lives>0){
                    if(randCharac==0){
					character.reset(game.world.x+50,game.world.centerY+170)
                    }
                    if(randCharac==1){
					character.reset(game.world.x+100,game.world.centerY+100)
                    }
                    if(randCharac==2){
					character.reset(game.world.x+50,game.world.centerY+100)
                    }
                    if(randCharac==3){
					character.reset(game.world.x+50,game.world.centerY+170)
                    }
					if(randCharac==4){
					character.reset(game.world.x+90,game.world.centerY+170)
                    }
                    character.body.angle=0
					shooted=false
					inGoal=false
                    inGround = true
			}
		}
		else if(inGoal==true){
			addPoint(1)
            console.log("goal compleate");
            correctParticle.position.x=character.position.x+50
            correctParticle.position.y=character.position.y
            correctParticle.start(true, 1000, null, 5)
			shooted=false
			inGoal=false
			reset()
		}
		else if(lives<=0){
			character.kill()
		}
		evaluate=false
		inGround=false
    }
	
	function where(body, bodyB, shapeA, shapeB, equation)
	{
		if(evaluate==false){
		  inGoal=false
		}
		inGround=true
		if(body){
            if(body.sprite.tag=="goal"){
                console.log("touch goal")
                evaluate = true
                inGoal=true
                goalCount++
            }
           /* else{
            	console.log(body.sprite.tag)
            	inGoal=false
            	evaluate = false
            }*/
			/*else if(body.sprite.tag=="kill"){
				//console.log("touch goal")
                inGoal = false
                evaluate = false
				character.kill()
				character.body.velocity.x=0
				character.body.velocity.y=0
                boomParticle.position.x=character.position.x+50
                boomParticle.position.y=character.position.y
                boomParticle.start(true, 1000, null, 5)
				miniReset()
                
			}*/
			
			
		}
		
	}

	function endContact(body, bodyB, shapeA, shapeB){
		if(body){
			if(body.sprite){
				if(body.sprite.tag=="goal"){
					goalCount--
					console.log(body.sprite.tag+"   endcontact")
					if(goalCount<=1){
		            	inGoal=false
		            	evaluate = false	
		            }
				}
			}
		}
	}

    function create(){
        
        
        sceneGroup = game.add.group()
        backgroundGroup=game.add.group()
        sceneGroup.add(backgroundGroup)
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
         
        positionRange = {min:game.world.centerX-120, max:game.world.centerX}
        platformsWinPosition = game.world.centerX-120
        currentId = initialPlatforms
        level = 0
        goalCount = 0
        
        var background = backgroundGroup.create(-2,-2,'fondo')
		//var background=game.add.tileSprite(0,0,game.world.width,game.world.height,'fondo')
        backgroundGroup.create(game.world.centerX-100,game.world.centerY-200,'logo')
         
		 
		 background.width = game.world.width
         background.height = game.world.height
        
        loadSounds()
        initialize()  
        
        
		platformsGroup4 = game.add.group()
        sceneGroup.add(platformsGroup4)
		platformsGroup3 = game.add.group()
        sceneGroup.add(platformsGroup3)
		platformsGroup2 = game.add.group()
        sceneGroup.add(platformsGroup2)
        platformsGroup1 = game.add.group()
        sceneGroup.add(platformsGroup1)
        platformsWin = game.add.group()
		sceneGroup.add(platformsWin)
		UIfront = game.add.group()
        sceneGroup.add(UIfront)
		
		
		proxyGame=sceneGroup.create(-2,-2,'fondo')
		proxyGame.width=game.world.width
		proxyGame.height=game.world.height
		proxyGame.inputEnabled = true;
		proxyGame.input.enableDrag(true);
		proxyGame.events.onDragStop.add(onDragStop,proxyGame);
		proxyGame.events.onDragUpdate.add(onDragUpdate,proxyGame);
		proxyGame.events.onDragStart.add(onDragStart,proxyGame);
		proxyGame.alpha=0
		

	
		//game.world.setBounds(-2000,0,game.world.width, game.world.height);
        
        characterGroup = game.add.group()
        characterGroup.x = game.world.centerX
        //characterGroup.y = background.height * 0.768
        sceneGroup.add(characterGroup)
        
		//Creamos las fisicas del proyecto
        
        game.physics.startSystem(Phaser.Physics.P2JS)
		game.physics.p2.world.defaultContactMaterial.friction = .8;
        //Aqui creamos las plataformas y las agrupamos con sus debidas especificaciones
        
		
		
        var arrowPower=sceneGroup.create(game.world.centerX-200, game.world.height-180,"atlas.vips","slip")
        arrowPower.scale.setTo(.8)
        UIfront.add(arrowPower)
		//Todas las plataformas del juego
		

		//platformsGroup2.position.x = game.world.centerX;
		//platformsGroup1.alpha=1


		platformsArray = []
		//platformsWin.x = game.world.centerX +200

		
		var x = game.rnd.integerInRange(positionRange.min,positionRange.max)
		platformsWinPosition = x
		var idCorret = game.rnd.integerInRange(0,initialPlatforms-2)
        for(var i = 0 ; i < initialPlatforms; i++){
        	var blockGroup = game.add.group()
            var block=game.add.sprite(x+(i*deltaBlock),game.world.height-60,'atlas.vips','bloque1')
            block.scale.setTo(1,1)
            platformsWin.add(block)
            game.physics.p2.enable([ block ]);
            //block.body.x = platformsWin.x+(i*100)
            block.body.static=true
            block.body.clearShapes()
            block.body.loadPolygon('physicsData', "bloque1")
            platformsArray.push(block)
            block.group = blockGroup
            block.tag="ground"
            
            var g = new Phaser.Graphics(game)
            g.beginFill(0x48E02A)
            g.drawRect(block.x-53,block.y-160,105, 30)
            g.alpha = 1
            g.endFill()
            //platformsWin.add(g)
            blockGroup.add(g)

            var gLight=platformsWin.create(block.x-55,block.y-170,'atlas.vips','resplandor_AreaVerde')
            gLight.scale.setTo(.4,.3)
            gLight.visible = false
            block.light = gLight
            blockGroup.add(gLight)
            blockGroup.visible = false
            
            var proxyG=platformsWin.create(block.x,block.y-110,'fondo')
            proxyG.width=105
            proxyG.height=100
            proxyG.alpha=0
            game.physics.p2.enable(proxyG);
            proxyG.body.x = platformsWin.x+block.x;
            proxyG.visible = false
            proxyG.body.static = true
            proxyG.tag="goal"
            block.proxy = proxyG

            if(i == idCorret || i == idCorret+1){
            	blockGroup.visible = true
            	proxyG.visible = true
            	if(i == idCorret){
            		gLight.visible = true
            	}
            }
            else{
            	proxyG.kill()
            }
        }

        
		randPlats = 3

		newPlat1=game.add.sprite(game.world.x+150,game.world.height-100.5,'atlas.vips','bloque'+randPlats)
		platformsGroup2.add(newPlat1)

		game.physics.p2.enable([ newPlat1 ]);
		newPlat1.body.static=true
		newPlat1.body.clearShapes()
		newPlat1.body.loadPolygon('physicsData', "bloque"+randPlats)

		
				
		
		
		var lamp=sceneGroup.create(game.world.centerX-100,game.world.y,'atlas.vips','lampara')

		
        
        character=game.add.sprite(game.world.x+50,game.world.centerY+150,"atlas.vips","cafe1")
        sceneGroup.add(character)
        
        game.physics.p2.enable([ character ]);
        character.body.friction=4
        //character.body.fixedRotation=true
        character.body.angularVelocity = 0;
        character.body.clearShapes()
        character.body.loadPolygon('physicsData', "cafe1");
		character.body.onBeginContact.add(where, this);
		character.body.onEndContact.add(endContact, this);
		
        efectZoom=game.add.sprite(character.x-90,character.y,"atlas.vips","zooom")
        sceneGroup.add(efectZoom)
        efectZoom.alpha=0
        
        game.physics.p2.gravity.y = gravity;
        
        
        
		//Terminan todas las plataformas del juego}
		
		
		//Colocamos la mascara de fuerza
		
		powerBar=game.add.sprite(game.world.centerX+180,game.world.height-170,"atlas.vips","bar")
		powerBar.scale.setTo(0,2)
		powerBar.alpha=.5
		
		var poly = new Phaser.Polygon([ new Phaser.Point(game.world.x+693, game.world.height+630), 
		new Phaser.Point(game.world.x+637, game.world.height+688), 
		new Phaser.Point(game.world.x+693, game.world.height+750), 
		new Phaser.Point(game.world.x+710, game.world.height+710), 
		new Phaser.Point(game.world.x+1335, game.world.height+710),
		new Phaser.Point(game.world.x+1355, game.world.height+690),	
		new Phaser.Point(game.world.x+1335, game.world.height+670),		
		new Phaser.Point(game.world.x+710, game.world.height+670)]);

        graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.endFill();
        graphics.anchor.setTo(0)
        graphics.scale.setTo(.5,.5)
		graphics.alpha=.5
        
        graphics.position.x=game.world.centerX-500
        
        powerBar.mask=graphics
		
		//Aqui termina mascara
		
        game.onPause.add(function(){
			
			game.sound.mute = true
			if(amazing.getMinigameId()){
				marioSong.pause()
			}
			
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
			
			if(amazing.getMinigameId()){
				if(lives>0){
					marioSong.play()
				}
			}
			
		}, this);
        
            
		if(!amazing.getMinigameId()){
			
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.3)
			 }, this);	
		}
        
        var topRect = new Phaser.Graphics(game)
        topRect.beginFill(0xffffff);
        topRect.drawRect(0, 0, game.world.width, 60);
        topRect.endFill();
        topRect.anchor.setTo(0,0)
        sceneGroup.add(topRect)
        
        createPointsBar()
        createHearts()
        animateScene()
        
    }
    
	return {
		assets: assets,
		name: "vips",
		create: create,
        preload: preload,
        update: update,
	}
}()