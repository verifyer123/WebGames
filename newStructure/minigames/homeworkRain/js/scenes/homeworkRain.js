var soundsPath = "../../shared/minigames/sounds/"


var homeworkRain = function(){

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/homeworkRain/atlas.json",
                image: "images/homeworkRain/atlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/homeworkRain/tutorial_image_%input.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
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
                file: soundsPath + 'songs/upbeat_casual_8.mp3'
                }

            
        ],
        spines:[
            {
                name:'oof',
                file:'images/spines/oof/oof.json'
            }

		]
    }

    var NUM_LIFES = 3
    var INITIAL_VELOCITY = 4
    var MAX_VELOCITY = 15
    var DELTA_VELOCITY = 0.2
    var OFFSET_BOOK_POSITION = 150
    var CHECK_Y_VALUE = 300
    var TUTORIAL_CHECK_Y_VALUE
    var POINT_ELEVATE_FLOOR = 5
    var DELTA_ELEVATE_FLOOR = 100
    var MAX_Y_FLOOR 
    var MAX_TUTORIAL_COUNT = 3
    var MIN_BOOK_ID = 0
    var MAX_BOOK_ID = 2
    
    var lives
	var sceneGroup = null
    var gameIndex = 168
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
    var correctParticle
    var smokeParticle

    var gameStarted

    var inTutorial
    var hand

    var floor
    var yogotar

    var booksToChangeColor
    var booksCatch

    var booksGroup
    var lastBook

    var currentVelocity
    var canTouch
    var tutorialCanTouch
    var tutorialCount
    var tutorialNextBook
    var tutorialBookIndex



	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        inTutorial = 0

        booksToChangeColor = game.rnd.integerInRange(2,4)
        booksCatch = 0

        gameStarted = false

        currentVelocity = INITIAL_VELOCITY

        canTouch = true

        MAX_Y_FLOOR = game.world.centerY
        TUTORIAL_CHECK_Y_VALUE = yogotar.y -200

        tutorialCanTouch = false

        tutorialCount = 0
        var wrongBook1 = yogotar.colorValue+1
        if(wrongBook1>2){
            wrongBook1=0
        }
        var wrongBook2 = yogotar.colorValue-1
        if(wrongBook2<0){
            wrongBook2=2
        }
        tutorialNextBook = [{color:yogotar.colorValue,side:-1},{color:wrongBook1,side:-1},{color:wrongBook2,side:1},{color:yogotar.colorValue,side:-1}]
        tutorialBookIndex = 0

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/homeworkRain/coin.png', 122, 123, 12)

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


    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.centerX
       coins.y=objectBorn.centerY

       numPoints++

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
        
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1250)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)		
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

        stopTouch = true
        
        if(lives === 0){
            yogotar.setAnimationByName(0,"lose",false)
            stopGame(false)
        }
        else{

        }

    }
    


    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        inputsEnabled = true
        setRound()

    }
    
    function update() {
        if(gameStarted){

            updateBooks()
            updateTouch()
        }
    }

    function updateTouch(){
        if(inTutorial!=-1 && !tutorialCanTouch){
            return
        }

        if(game.input.activePointer.isDown){
            var dist 
            if(game.input.activePointer.y >200){
                dist = 100
            }
            else{
               dist = Math.sqrt(Math.pow(game.world.centerX * 0.5 + 70 - game.input.activePointer.x,2) + Math.pow(30-game.input.activePointer.y,2))
            }
            if(dist > 35){
                if(canTouch){
                    canTouch = false
                    yogotar.side = yogotar.side*-1
                    yogotar.scale.setTo(yogotar.side*yogotar.initialXScale,yogotar.scale.y)
                    if(inTutorial!=-1){
                        tutorialCount ++
                        if(tutorialCount>=MAX_TUTORIAL_COUNT){
                            inTutorial=-1
                            hand.visible = false
                        }
                        else{
                            tutorialCanTouch = false
                            hand.visible = false
                        }
                    }
                }
            }
        }
        else{
            canTouch = true
        }
    }

    function updateBooks(){
        
        if(inTutorial!=-1 && tutorialCanTouch){
            return
        }

        for(var index = 0; index < booksGroup.length; index ++){
            if(booksGroup.children[index].visible){

                var book = booksGroup.children[index]
                book.y += currentVelocity

                if(inTutorial!=-1 && book.y > TUTORIAL_CHECK_Y_VALUE && !book.tutorialCheck){
                    tutorialCanTouch = true
                    hand.visible = true
                    book.tutorialCheck = true
                }

                if(book.y > yogotar.y){
                    evaluateBook(book)
                }
            }
        }

        if(lastBook.y > CHECK_Y_VALUE){

            getBook()
        }

        
    }

    function evaluateBook(book){
        if(lives <= 0){
             book.visible = false
            return
        }
        if(book.side == yogotar.side){
            sound.play("pop")
            if(book.colorValue == yogotar.colorValue){
                Coin(yogotar,pointsBar,100)
                booksCatch++
                if(booksCatch >= booksToChangeColor){
                    var newColorValue = game.rnd.integerInRange(MIN_BOOK_ID,MAX_BOOK_ID)
                    if(newColorValue == yogotar.colorValue){
                        newColorValue ++
                        if(newColorValue>2){
                            newColorValue = 0
                        }
                    }
                    yogotar.colorValue = newColorValue

                    yogotar.setSkinByName("normal"+yogotar.colorValue)
                    yogotar.setToSetupPose();
                    booksCatch = 0
                    booksToChangeColor = game.rnd.integerInRange(2,4)
                }
                if(numPoints%POINT_ELEVATE_FLOOR==0){
                    if(yogotar.y > MAX_Y_FLOOR){
                        game.add.tween(yogotar).to({y:yogotar.y - DELTA_ELEVATE_FLOOR}, 200, Phaser.Easing.linear,true)
                        game.add.tween(floor).to({y:floor.y - DELTA_ELEVATE_FLOOR}, 200, Phaser.Easing.linear,true)
                    }
                }

                if(currentVelocity< MAX_VELOCITY){
                    currentVelocity +=DELTA_VELOCITY
                }
            }
            else if(book.y <= yogotar.y +20){
                missPoint()
            }

            book.visible = false
        }
        else if(book.y>yogotar.y + 70){
            if(book.colorValue == yogotar.colorValue){
                missPoint()
            }
            book.visible = false
        }

        

    }
    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }


    function setRound(){
        gameStarted = true
        getBook()
    }

    function getBook(){
        var side = game.rnd.integerInRange(0,1)
        var colorValue = game.rnd.integerInRange(MIN_BOOK_ID,MAX_BOOK_ID)

        if(tutorialBookIndex<tutorialNextBook.length){
            side = tutorialNextBook[tutorialBookIndex].side
            colorValue = tutorialNextBook[tutorialBookIndex].color
            tutorialBookIndex++
        }

        if(side == 0){
            side = -1
        }
        for(var index = 0; index < booksGroup.length; index++){
            if(!booksGroup.children[index].visible){
                booksGroup.children[index].visible = true
                booksGroup.children[index].x = side*OFFSET_BOOK_POSITION
                booksGroup.children[index].y = 0
                booksGroup.children[index].loadTexture("atlas.game","book"+colorValue)
                booksGroup.children[index].colorValue = colorValue
                booksGroup.children[index].side = side
                booksGroup.children[index].tutorialCheck = false
                lastBook = booksGroup.children[index]
                return 
            }
        }

        var book = booksGroup.create(side*OFFSET_BOOK_POSITION,0,"atlas.game","book"+colorValue)
        book.anchor.setTo(0.5)
        book.colorValue = colorValue
        book.side = side
        book.tutorialCheck = false
        lastBook = book
        return
    }

    function setLoopHand() {

        if(inTutorial==-1){
            return
        }

        hand.loadTexture("atlas.game","handDown")
        setTimeout(function(){
            hand.loadTexture('atlas.game','handUp',0,false)
            setTimeout(setLoopHand,500)
        },500)
    }


    function createBackground(){

        var background = backgroundGroup.create(game.world.centerX,game.world.centerY,"atlas.game","fondo")
        background.anchor.setTo(0.5)

        var w = game.world.width / background.width
        var h = game.world.height/ background.height


        floor = backgroundGroup.create(game.world.centerX,game.world.height-150,"atlas.game","ground")
        floor.anchor.setTo(0.5,0)

        if(w >1 ||h >1){
            if(w > h){
                background.scale.setTo(w,w)
                floor.scale.setTo(w)
            }
            else{
                background.scale.setTo(h,h)
                floor.scale.setTo(h)
            }
        }

        /*var floorTile = game.add.sprite(0,0,game.world.width,game.world.height/2,"atlas.game","ground")
        floorTile.anchor.setTo(0.5,0)
        floor.addChild(floorTile)*/

        booksGroup = game.add.group()
        booksGroup.x = game.world.centerX
        booksGroup.y = - 100
        sceneGroup.add(booksGroup)


        yogotar = game.add.spine(game.world.centerX,game.world.height - 100, "oof")
        sceneGroup.add(yogotar)
        yogotar.colorValue = game.rnd.integerInRange(MIN_BOOK_ID,MAX_BOOK_ID)
        yogotar.setSkinByName("normal"+yogotar.colorValue)
        yogotar.setAnimationByName(0,"idle",true)
        yogotar.side = 1
        yogotar.scale.setTo(0.7)
        yogotar.initialXScale = 0.7

        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        hand = sceneGroup.create(yogotar.x,yogotar.y,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false

        setLoopHand()
    }
    

    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        createBackground()
        
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


        

        initialize()

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        

        createTutorial()
    
    }

    /*function render(){
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00"); 
    }*/

    
	return {
		assets: assets,
		name: "homeworkRain",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
        //render:render
	}
}()
