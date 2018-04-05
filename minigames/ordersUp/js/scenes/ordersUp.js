var soundsPath = "../../shared/minigames/sounds/"
var spinePath = "../../shared/minigames/images/spines/"
var ordersUp = function(){

    var PERSON_STATE = {
        WALK:1,
        SIDE:2,
        RETURN:3,
    },

	assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/ordersUp/atlas.json",
                image: "images/ordersUp/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "bomb.mp3"},
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {
                name: "turbo",
                file:soundsPath+"inflateballoon.mp3"
            },
            {
                name: "cashRegister",
                file:soundsPath+"cashRegister.mp3"
            },
            
		]
	}
    
    var INITIAL_LIVES = 3
    var PEOPLE_TYPES = 6
    var MAX_PRODUCTS_PER_TYPE = 3
    var PRODUCT_TYPES = 3

    var INITIAL_DIFFICULT = 1.9
    var DELTA_DIFFICULT = 0.1
    var MAX_DIFFICULT = 6
    var BOSS_DIFFICULT = 9
    var BOSS_PROBABILIY = 0.3
    var PEOPLE_TO_BOSS = 5

    var INITIAL_APPEAR_PERSON = 6000
    var DELTA_APPEAR_PERSON = 100
    var MIN_APPEAR_PERSON = 3000

    var INITIAL_VELOCITY = 1
    var MAX_VELOCITY = 3
    var DELTA_VELOCITY = 0.02

    var DELTA_IN_SECUENCE = 40
    var DELTA_IN_SECUENCE_BOSS = 35

    var NUMBER_SECUENCE_TO_CHANGE_STATION = 5

    var PRODUCTS_EACH_TYPE = [6,6,6]
    var PRODUCT_TYPES_ARRAYS

    var MOM_OFFSET = 30

    var LIMIT_DIE

    var SKIN_NAMES = ["normal","man","woman","warrior","chaman","balam"]

    var BUTTON_COLOR

    var Y_PERSON_SECUENCE = 150
    var PEOPLE_X_DELTA = 60

    var COIN_BY_BOOSS = 3

    var BALLON_SCALE = 1.5

    var BALLOON_TRANSITION = 100
    
    var gameIndex = 26
    var gameId = 100003
    var marioSong = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive
    var valuesList = null
    var objectsGroup

    var pointsBar = null

    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var currentPeopleArray
    var peopleList
    var returnList
    var secuence
    var ballonGroup
    var currentButtonGroup
    var secondButtonGroup

    var currentProduct
    var difficult
    var currentPeoplePassed

    var currentTimeAppearPerson
    var secuencePublish
    var currentDifficult

    var currentSecuence

    var secuenceToChangeStation
    var currentSecuenceCompleted

    var products_showing

    var productLigths

    var lastPerson

    var meizy

    var personTimeOut

    var currentVelocity

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){
        gameIndex = amazing.getId(gameId)
        lives = INITIAL_LIVES
        gameActive = false
        currentPeopleArray = []
        currentPeoplePassed = 0
        currentTimeAppearPerson = INITIAL_APPEAR_PERSON

        LIMIT_DIE = game.world.height-300
        PRODUCT_TYPES_ARRAYS = []
        for(var i = 0; i < PRODUCT_TYPES; i++){
        	PRODUCT_TYPES_ARRAYS[i] = []
        	for(var j = 1; j <= PRODUCTS_EACH_TYPE[i]; j++){
        		PRODUCT_TYPES_ARRAYS[i].push(j)
        	}
        }

        currentVelocity = INITIAL_VELOCITY

        secuencePublish = false

        currentDifficult = INITIAL_DIFFICULT
        currentSecuence = []

        secuenceToChangeStation = game.rnd.integerInRange(NUMBER_SECUENCE_TO_CHANGE_STATION-1,NUMBER_SECUENCE_TO_CHANGE_STATION+1)
        currentSecuenceCompleted = 0

        products_showing = []
        productLigths = []

        BUTTON_COLOR = []
        BUTTON_COLOR[0] = [0xe66000,0xf6c500,0xb5006b,0xe66000,0xf6c500,0xb5006b]
        BUTTON_COLOR[1] = [0x612774,0x5ebdd4,0x8dba38,0x612774,0x5ebdd4,0x8dba38]
        BUTTON_COLOR[2] = [0xd3752e,0xd12b38,0x6dac3b,0xd3752e,0xd12b38,0x6dac3b]
	}
    

    function animateScene() {
                
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        

		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
    
    
    function preload() {
        
		game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
       	
        
        game.load.spine('balam', "images/spines/balam/balam.json");
        game.load.spine('chaman_warrior', "images/spines/chaman_warrior/chaman_warrior.json");
        game.load.spine('man_woman', "images/spines/man_woman/man_woman.json");
        game.load.spine('mom_son', "images/spines/mom_son/mom_son.json");
        game.load.spine('meizy', "images/spines/meizy/meizy.json");

		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/jungle_fun.mp3',1)
		}else{
			game.load.audio('arcadeSong', soundsPath + 'songs/jungle_fun.mp3');
		}

    }

    
    function stopGame(){

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false
        
		if(amazing.getMinigameId()){
			marioSong.pause()
		}else{
			marioSong.stop()
		}
        clearTimeout(personTimeOut)
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
		
            sceneloader.show("result")
		})
    }
    
    function addPoint(number,obj){
        
        sound.play("magic")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.game','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
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

        group.create(0,0,'atlas.game','life_box')

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
    
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.x
            pointsText.y = obj.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

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
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.x
            particle.y = obj.y
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
                particle = particlesGroup.create(-200,0,'atlas.game',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function missPoint(){
        gameActive = false
        var anim = currentPeopleArray[0].addAnimationByName(0,"lose",false)
        meizy.setAnimationByName(0,"bad",true)
        //var anim = currentPeopleArray[0].addAnimationByName(0,"lose_still",false)
        anim.onComplete = function(){
            currentPeopleArray[0].addAnimationByName(0,"lose",true)
            setTimeout(function(){
                meizy.setAnimationByName(0,"idle",true)
                returnPerson(currentPeopleArray[0])
                currentPeopleArray.splice(0,1)
                gameActive = true
                secuencePublish = false
                ballonGroup.scale.setTo(BALLON_SCALE)
                game.add.tween(ballonGroup.scale).to({x:0,y:0},BALLOON_TRANSITION,Phaser.Easing.linear,true)
                for(var i = 0 ; i < secuence.length; i++){
                    secuence.children[i].visible = false
                }
            },1000)
        }

        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        //addNumberPart(heartsGroup.text,'-1')

        stopTouch = true
        
        if(lives === 0){
            stopGame()
        }
    }

    
    function update(){
        
        if(gameActive == false){
            return
        }

        for(var i = 0; i < peopleList.length; i++){
            //for(var j = 0; j < peopleList[i].length; j++){
                var person = peopleList.children[i]
                if(person.walkState == PERSON_STATE.WALK){
                    person.y+=currentVelocity
                }
                else if(person.walkState == PERSON_STATE.SIDE){
                    person.x+=currentVelocity
                    var goal
                    if(person.type==0){
                        goal = PEOPLE_X_DELTA-30
                    }
                    else{
                        goal = PEOPLE_X_DELTA
                    }
                    if(person.x >= goal){
                        person.walkState = PERSON_STATE.RETURN
                        person.setAnimationByName(0,"walk_back",true)
                        person.x = goal
                        if(returnList.length>0){
                            var lastY = returnList.children[returnList.length-1].y
                            returnList.add(person)
                            //console.log(lastY,person.y)
                            if(lastY<person.y){
                                returnList.bringToTop(person)
                            }
                            else{
                                returnList.sendToBack(person)
                            }

                        }
                        else{
                            returnList.add(person)
                        }

                    }
                }

        }

        for(var i = 0; i < returnList.length; i++){
            //for(var j = 0; j < peopleList[i].length; j++){
                var person = returnList.children[i]
                
                person.y -= currentVelocity*2
                if(person.y < 0){
                    person.visible = false
                    peopleList.add(person)
                }
                
        }

        if(secuencePublish){
            ballonGroup.y = currentPeopleArray[0].y-170
            if(currentPeopleArray[0].y >LIMIT_DIE){
               
                missPoint()
            }
        }
        else{
            if(currentPeopleArray.length>0 && ballonGroup.scale.x < 0.5){
                if(currentPeopleArray[0].y > Y_PERSON_SECUENCE){
                    setSecuence(currentPeopleArray[0].isBoos)
                    secuencePublish = true
                }
                
            }
        }
        
    }
    

    function returnPerson(person){
        person.walkState = PERSON_STATE.SIDE
        person.setAnimationByName(0,"walk_sidetoside",true)
    }
    

    function clickButton(button,pointer){
        sound.play("pop")
        button.loadTexture("atlas.game","boton_on")
        button.line.loadTexture("atlas.game","boton_on_linea")
        button.productImage.y = 0
        if(ballonGroup.scale.x < BALLON_SCALE-0.1 || !gameActive){
            return
        }

        var idPush = button.id
        var correct = false

        for(var i = 0 ; i < secuence.length; i++){
        	if(secuence.children[i].visible){
	            if(secuence.children[i].id == idPush){
	                secuence.children[i].visible = false
	                correct = true
	                break
	            }
	        }
        }

        if(correct){
            secuence.needProducts--
            if(secuence.needProducts<=0){
                //currentPeopleArray[0].visible = false
                if(secuence.isBoos){
                    addPoint(COIN_BY_BOOSS,{x:game.world.centerX,y:currentPeopleArray[0].y})
                }
                else{
                    addPoint(1,{x:game.world.centerX,y:currentPeopleArray[0].y})
                }
                meizy.setAnimationByName(0,"good",true)
                setTimeout(function(){
                    meizy.setAnimationByName(0,"idle",true)
                },500)
                //currentPeopleArray[0].walkState = PERSON_STATE.SIDE
                returnPerson(currentPeopleArray[0])
                currentPeopleArray.splice(0,1)

                sound.play("cashRegister")

                if(currentVelocity < currentVelocity){
                    currentVelocity +=DELTA_VELOCITY
                }

                currentSecuenceCompleted++
                currentPeoplePassed++

                if(currentSecuenceCompleted==secuenceToChangeStation){
                	changeStation()
                }


                secuencePublish = false
                ballonGroup.scale.setTo(BALLON_SCALE)
                game.add.tween(ballonGroup.scale).to({x:0,y:0},BALLOON_TRANSITION,Phaser.Easing.linear,true)

            }
            else{
                var delta = DELTA_IN_SECUENCE
                if(secuence.isBoos){
                    delta = DELTA_IN_SECUENCE_BOSS
                }
                var initX = -((secuence.needProducts-1)/2)*delta
                var currentIndex = 0
                for(var i = 0; i < secuence.length; i++){
                    if(secuence.children[i].visible){
                        secuence.children[i].x = initX +(currentIndex*delta)
                        currentIndex++
                    }
                }
            }
        }
        else{

            missPoint()
        }
    }

    function upButton(button){
        button.loadTexture("atlas.game","boton_off")
        button.line.loadTexture("atlas.game","boton_off_linea")

        button.productImage.y = -10
    }


    function changeStation(){
    	currentSecuenceCompleted=0
    	var arrayStations = []
    	for(var i = 1; i <= PRODUCT_TYPES; i++){
    		if(i!=currentProduct){
    			arrayStations.push(i)
    		}
    	}
        productLigths[currentProduct-1].visible = false
    	currentProduct = arrayStations[game.rnd.integerInRange(0,arrayStations.length-1)]
        productLigths[currentProduct-1].visible = true

    	setButtonGroup(secondButtonGroup,currentProduct)
    	var temp = currentButtonGroup
    	currentButtonGroup = secondButtonGroup
    	secondButtonGroup = temp
    	game.add.tween(secondButtonGroup).to({y:game.world.height+100},300,Phaser.Easing.linear,true)
    	game.add.tween(currentButtonGroup).to({y:game.world.height-100},300,Phaser.Easing.linear,true)

    	//currentButtonGroup.y = game.world.height-200
    }

    
    function setRound(){
        gameActive = true
        setPerson()
        
    }

    function setPerson(){

        /*if(!gameActive){
            return
        }*/

        var isBoos = false
        if(currentPeoplePassed>PEOPLE_TO_BOSS){
        	var r = game.rnd.frac()
        	if(r < BOSS_PROBABILIY){
        		isBoos = true
        		currentPeoplePassed = 0
        	}
        }

        if(currentTimeAppearPerson>MIN_APPEAR_PERSON){
            currentTimeAppearPerson-=DELTA_APPEAR_PERSON
        }

        personTimeOut = setTimeout(setPerson,currentTimeAppearPerson)

        
        var randomSkin
        var peopleType = game.rnd.integerInRange(0,PEOPLE_TYPES-2)
        if(isBoos){
            peopleType = PEOPLE_TYPES-1
        }
        //var group = peopleList[peopleType]
        for(var i = 0; i< peopleList.length; i++){
            if(peopleList.children.type==peopleType){
                if(!peopleList.children[i].visible){
                    peopleList.children[i].visible = true
                    peopleList.children[i].y = 0
                    peopleList.children[i].isBoos = isBoos
                    peopleList.children[i].setSkinByName(SKIN_NAMES[peopleType])
                    currentPeopleArray.push(peopleList.children[i])
                    lastPerson = peopleList.children[i]
                    peopleList.children[i].walkState = PERSON_STATE.WALK
                    if(peopleType==0){
                        peopleList.children[i].x = -PEOPLE_X_DELTA-MOM_OFFSET
                    }
                    else{
                        peopleList.children[i].x = -PEOPLE_X_DELTA
                    }
                    
                    peopleList.children[i].setAnimationByName(0,"walk_front",true)

                    peopleList.setToBack(peopleList.children[i])
                    return
                }
            }
        }
        var person
        if(peopleType==0){
            person = game.add.spine(-PEOPLE_X_DELTA-MOM_OFFSET,0,"mom_son")
        }
        else if(peopleType == 1 ||peopleType == 2){
            person = game.add.spine(-PEOPLE_X_DELTA,0,"man_woman")
        }
        else if(peopleType == 3 ||peopleType == 4){
            person = game.add.spine(-PEOPLE_X_DELTA,0,"chaman_warrior")
        }
        else{
            person = game.add.spine(-PEOPLE_X_DELTA,0,"balam")
        }
        person.setSkinByName(SKIN_NAMES[peopleType])
        person.setAnimationByName(0,"walk_front",true)
        person.isBoos = isBoos
        //person.anchor.setTo(0.5)
        currentPeopleArray.push(person)
        peopleList.add(person)
        lastPerson = person
        person.type = peopleType
        person.walkState = PERSON_STATE.WALK

    }


    function setSecuence(isBoos){
        ballonGroup.scale.setTo(0)
        game.add.tween(ballonGroup.scale).to({x:BALLON_SCALE,y:BALLON_SCALE},BALLOON_TRANSITION,Phaser.Easing.linear,true)

        var difficultRounded = Math.floor(currentDifficult)
        if(isBoos){
        	//console.log("Warning!!! boss")
        	difficultRounded=BOSS_DIFFICULT
        }

        if(currentDifficult<MAX_DIFFICULT){
            currentDifficult+=DELTA_DIFFICULT
        }

        currentSecuence = []

        for(var i = 0; i < difficultRounded; i++){
            currentSecuence.push(game.rnd.integerInRange(1,MAX_PRODUCTS_PER_TYPE))
        }
        var scale = (difficultRounded/10)+0.05
        if(scale < 0.3){
            scale = 0.3
        }
        ballonGroup.ballon.scale.setTo(scale,1)

        secuence.isBoos = isBoos
        secuence.needProducts = difficultRounded
        var delta = DELTA_IN_SECUENCE
        if(isBoos){
            delta = DELTA_IN_SECUENCE_BOSS
        }
        //console.log("Delta "+delta)

        var initX = -((difficultRounded-1)/2)*delta
        var max = secuence.length
        if(currentSecuence.length< secuence.length){
        	max = currentSecuence.length
        }
        for(var i = 0; i < max; i++){
            secuence.children[i].visible = true
            secuence.children[i].loadTexture("atlas.game",products_showing[currentSecuence[i]-1])
            secuence.children[i].x = initX + (delta*i)
            secuence.children[i].id = currentSecuence[i]
            //console.log(i,currentSecuence[i])
        }
        var initLength = secuence.length
        if(secuence.length < currentSecuence.length){
            var needProducts = currentSecuence.length - secuence.length
            var startId = secuence.length
            for(var i = 0; i < needProducts; i++){
                var x = initX+(delta*(i+initLength))

                
                var icon = secuence.create(x,-15,"atlas.game",products_showing[currentSecuence[startId+i]-1])
                icon.anchor.setTo(0.5)
                icon.scale.setTo(0.6)
                icon.id = currentSecuence[startId+i]
                //console.log(startId+i,currentSecuence[startId+i])
            }
        }
    }

    function setButtonGroup(group,idProduct){
    	products_showing = []
    	var idsUsed = []
        for(var i = 1; i<=MAX_PRODUCTS_PER_TYPE; i++){
        	//var r = game.rnd.integerInRange(0,PRODUCT_TYPES_ARRAYS[idProduct-1].length-1)
            var r = 0
        	var key = 'product_'+idProduct+'_'+PRODUCT_TYPES_ARRAYS[idProduct-1][r]
        	idsUsed.push(PRODUCT_TYPES_ARRAYS[idProduct-1][r])
            var productId = PRODUCT_TYPES_ARRAYS[idProduct-1][r]-1
   			PRODUCT_TYPES_ARRAYS[idProduct-1].splice(r,1)
   			//console.log(PRODUCT_TYPES_ARRAYS[idProduct-1])
   			if(PRODUCT_TYPES_ARRAYS[idProduct-1].length<=0){
   				for(var j = 1; j <= PRODUCTS_EACH_TYPE[idProduct-1];j++){
   					var index = idsUsed.indexOf(j)
   					if(index==-1){
	   					PRODUCT_TYPES_ARRAYS[idProduct-1].push(j)
	   					//console.log("Podrict id plus"+j)
	   				}
   				}
   			}

        	products_showing.push(key)
            group.children[i-1].productImage.loadTexture("atlas.game",key)
            var tint = BUTTON_COLOR[idProduct-1][i-1]
            group.children[i-1].tint = tint
            //console.log(tint,idProduct-1,productId)
        }
    }


    function createBackground(){
        var background = game.add.tileSprite(0,270,game.world.width,game.world.height-270,"atlas.game","piso_patron")
        sceneGroup.add(background)

        var backgroundBackFloor = game.add.tileSprite(0,0,game.world.width,270,"atlas.game","piso_gris")
        sceneGroup.add(backgroundBackFloor)


        peopleList = game.add.group()
        peopleList.x = game.world.centerX
        sceneGroup.add(peopleList)

        returnList = game.add.group()
        returnList.x = game.world.centerX
        sceneGroup.add(returnList)

        //currentProduct = game.rnd.integerInRange(1,PRODUCT_TYPES)
        var angle = 20*(Math.PI/180)
        var leftWall = game.add.graphics(0,0)
        leftWall.beginFill(0xc4c4c4)
        leftWall.moveTo(game.world.centerX-(480/2),0)
        leftWall.lineTo(0,0)
        leftWall.lineTo(0,274+((game.world.centerX-(480/2))*Math.tan(angle)))
        leftWall.lineTo(game.world.centerX-(480/2),274)
        leftWall.endFill()
        sceneGroup.add(leftWall)

        var x = (game.world.centerX-(480/2))
        var h = (x/Math.cos(angle))+10
        var tileSpriteLine = game.add.tileSprite(0,0,h,24,"atlas.game","decorado")
        tileSpriteLine.anchor.setTo(1,0)
        tileSpriteLine.angle = -20
        tileSpriteLine.x = x
        tileSpriteLine.y = 116
        sceneGroup.add(tileSpriteLine)

        

        var rigthWall = game.add.graphics(0,0)
        rigthWall.beginFill(0xc4c4c4)
        rigthWall.moveTo(game.world.centerX+(480/2),0)
        rigthWall.lineTo(game.world.width,0)
        rigthWall.lineTo(game.world.width,274+((game.world.centerX-(480/2))*Math.tan(angle)))
        rigthWall.lineTo(game.world.centerX+(480/2),274)
        rigthWall.endFill()
        sceneGroup.add(rigthWall)


        tileSpriteLine = game.add.tileSprite(0,0,h,24,"atlas.game","decorado")
        tileSpriteLine.anchor.setTo(0,0)
        tileSpriteLine.angle = 20
        tileSpriteLine.x = game.world.width-x
        tileSpriteLine.y = 116
        sceneGroup.add(tileSpriteLine)

        var door = sceneGroup.create(game.world.centerX,-2,"atlas.game","Entrada")
        door.anchor.setTo(0.5,0)
        sceneGroup.add(door)


        var circleDecoration = sceneGroup.create(door.x + 196, door.y + 200, "atlas.game","decoracion_derecha")
        circleDecoration.anchor.setTo(0.5)

        circleDecoration = sceneGroup.create(door.x - 200, door.y + 200, "atlas.game","decoracion_izquierda")
        circleDecoration.anchor.setTo(0.5)


        


        var cubeDecoration = sceneGroup.create(70,game.world.centerY-150,"atlas.game","stands")
        cubeDecoration.anchor.setTo(0.5)

        var barrelDecoration = sceneGroup.create(50,game.world.centerY+50,"atlas.game","barriles")
        barrelDecoration.anchor.setTo(0.5)

        var granel = sceneGroup.create(game.world.width,game.world.centerY-50,"atlas.game","barra_granel")
        granel.anchor.setTo(1,0.5)
        

        
        var stand = sceneGroup.create(game.world.centerX,game.world.height-135,"atlas.game","barras_juntas")
        stand.anchor.setTo(0.5)



        meizy = game.add.spine(game.world.centerX - 50, game.world.height-155,"meizy") 
        meizy.setSkinByName("normal")
        meizy.setAnimationByName(0,"idle",true)



        currentProduct = 1
        currentButtonGroup = game.add.group()
        currentButtonGroup.x = game.world.centerX
        currentButtonGroup.y = game.world.height - 100

        var deltaButtons = 200
        var initX = deltaButtons*((MAX_PRODUCTS_PER_TYPE-1)/2)
 
        for(var i = 0; i < MAX_PRODUCTS_PER_TYPE; i++){
            var image = currentButtonGroup.create(-initX+(deltaButtons*i),0,"atlas.game",'boton_off')
            image.anchor.setTo(0.5)
            image.inputEnabled = true
            image.id = i+1
            image.events.onInputDown.add(clickButton,this)
            image.events.onInputUp.add(upButton,this)

            var line = sceneGroup.create(0,0,"atlas.game","boton_off_linea")
            line.anchor.setTo(0.5)
            image.addChild(line)
            image.line = line

            var productImage = sceneGroup.create(0,-10,"atlas.game","product_1_1")
            productImage.anchor.setTo(0.5)
            image.addChild(productImage)

            image.productImage = productImage

            

        }



        setButtonGroup(currentButtonGroup,currentProduct)

        secondButtonGroup = game.add.group()
        secondButtonGroup.x = game.world.centerX
        secondButtonGroup.y = game.world.height+100

        for(var i =0; i < MAX_PRODUCTS_PER_TYPE; i++){
            var image = secondButtonGroup.create(-initX+(deltaButtons*i),0,"atlas.game",'boton_off')
            image.anchor.setTo(0.5)
            image.inputEnabled = true
            image.id = i+1
            image.events.onInputDown.add(clickButton,this)
            image.events.onInputUp.add(upButton,this)


            var line = sceneGroup.create(0,0,"atlas.game","boton_off_linea")
            line.anchor.setTo(0.5)
            image.addChild(line)
            image.line = line

            var productImage = sceneGroup.create(0,-10,"atlas.game","product_1_1")
            productImage.anchor.setTo(0.5)
            image.addChild(productImage)
            image.productImage = productImage

        }


         

        var chipsLigth = sceneGroup.create(game.world.centerX+240,game.world.height-135,"atlas.game","papas_selecion")
        chipsLigth.anchor.setTo(0.5)
        productLigths.push(chipsLigth)
        //chipsLigth.visible = true



        var specialLigth = sceneGroup.create(game.world.centerX-240,game.world.height-135,"atlas.game","especial_seleccion")
        specialLigth.anchor.setTo(0.5)
        productLigths.push(specialLigth)
        specialLigth.visible = false


        var granelLigth = sceneGroup.create(granel.x,granel.y,"atlas.game","granel_seleccion")
        granelLigth.anchor.setTo(1,0.5)
        productLigths.push(granelLigth)
        granelLigth.visible = false

        var ice = sceneGroup.create(game.world.width,game.world.centerY+140,"atlas.game","ice")
        ice.anchor.setTo(1,0.5)
        

        secuence = game.add.group()
        ballonGroup = game.add.group()
        ballonGroup.x = game.world.centerX
        ballonGroup.y = -100
        ballonGroup.scale.setTo(0)


        var ballonDots = ballonGroup.create(0,30,"atlas.game","globitos")
        ballonDots.anchor.setTo(0.5)

        var ballonImage = ballonGroup.create(0,-15,"atlas.game","globo_grande")
        ballonImage.anchor.setTo(0.5)
        ballonImage.scale.setTo(0.4,1)

        ballonGroup.ballon = ballonImage

        ballonGroup.add(secuence)
        sceneGroup.add(ballonGroup)

        var maskSecuence = game.add.graphics(0,0)
        maskSecuence.beginFill(0xff0000)
        maskSecuence.drawRect(-200,-50,400,60)
        maskSecuence.endFill()
        ballonGroup.add(maskSecuence)

        secuence.mask = maskSecuence
    }

    function create(){

        initialize()  
        
        sceneGroup = game.add.group()

        loadSounds()

        game.onPause.add(function(){
			if(personTimeOut!=null && gameActive){
                clearTimeout(personTimeOut)
            }
			game.sound.mute = true
			if(amazing.getMinigameId()){
				marioSong.pause()
			}
			
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
            if(gameActive){
    			personTimeOut = setTimeout(setPerson,currentTimeAppearPerson)
            }
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

        createBackground()
        createObjects()
        createPointsBar()
        createHearts()
        animateScene()


        setRound()
        

    }

    
	return {
		assets: assets,
		name: "ordersUp",
		create: create,
        preload: preload,
        update: update,
        //render:render
	}
}()