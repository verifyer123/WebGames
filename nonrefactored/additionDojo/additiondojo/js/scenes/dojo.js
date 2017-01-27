
var soundsPath = "../../shared/minigames/sounds/"
var dojo = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.dojo",
                json: "images/dojo/atlas.json",
                image: "images/dojo/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/dojo/fondo.png"},
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "combo",
				file: soundsPath + "combo.mp3"},
            {	name: "flip",
				file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
		],
    }
    
    
    var CARD_TIME = 300
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var arrayComparison = null
    var overlayGroup
    var dojoSong
    var master
    var quantNumber
    var numberIndex = 0
    var numberToCheck
    var addNumber
    var lastObj
    var cardsGroup, boardGroup
    var timer
    var cardsNumber
    var selectGroup
    var comboCount
    var clock
    var timeValue

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        cardsNumber = 4
        lives = 5
        quantNumber = 0
        arrayComparison = []
        comboCount = 0
        numberIndex = 0
        timeValue = 5.5
        
        loadSounds()
        
	}
    
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        if(game.device.desktop == true){ 
            
            particlesNumber = 4
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.dojo',key);
            particlesGood.minParticleSpeed.setTo(-200, -50);
            particlesGood.maxParticleSpeed.setTo(200, -100);
            particlesGood.minParticleScale = 0.2;
            particlesGood.maxParticleScale = 1;
            particlesGood.gravity = 150;
            particlesGood.angularDrag = 30;

            particlesGood.x = obj.x;
            particlesGood.y = obj.y;
            particlesGood.start(true, 1000, null, particlesNumber);

            game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
            sceneGroup.add(particlesGood)

        }else{
            key+='Part'
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.dojo',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function setNumbers(){
        
        numberIndex = 0
        addNumber = 0
        
        quantNumber = game.rnd.integerInRange(2,3)
        
        var numbers = []
        numberToCheck = 0
        
        var numbersToAdd = []
        
        for(var i = 0; i< boardGroup.points.length;i++){
            
            var obj = boardGroup.points.children[i]
            obj.alpha = 0
        }
        
        for(var i = 0; i < quantNumber;i++){
            
            numbers[i] = game.rnd.integerInRange(1,9)
            numberToCheck+= numbers[i]
            numbersToAdd[numbersToAdd.length] = numbers[i]
            
            var obj = boardGroup.points.children[i]
            obj.alpha = 1
            changeImage(1,obj)
        }
        
        for(var i = 0; i < (9 - quantNumber); i++){
            
            numbersToAdd[numbersToAdd.length] = game.rnd.integerInRange(1,9)
        }
        
        Phaser.ArrayUtils.shuffle(numbersToAdd)
        
        for(var i = 0; i<cardsGroup.length;i++){
            
            var number = cardsGroup.children[i]
            
            number.number = numbersToAdd[i]
            
            number.text.setText(number.number)
            
        }
        
        boardGroup.number.setText(numberToCheck)
        
    }
    
    function hideO(){
        
        selectGroup.alpha = 1
        cardsGroup.alpha = 1
        boardGroup.alpha = 0
        
        for(var i = 0; i < selectGroup.length;i++){
            
           selectGroup.children[i].alpha = 0
        }
        
        for(var i = 0; i < cardsGroup.length;i++){
            
            var card = cardsGroup.children[i]
            card.alpha = 0
            card.image.pressed = false
        }
        
        game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},500,Phaser.Easing.linear,true)
        
    }
    function animateNumbers(){
        
        hideO()
        
        var delay = 500
        
        game.time.events.add(delay,function(){
            
            boardGroup.alpha = 1
            game.add.tween(boardGroup.scale).from({x:0.01},250, Phaser.Easing.linear,true)
            sound.play("cut")
            
        },this)
        
        delay+= 300
        
        for(var i = 0; i<cardsGroup.length;i++){
            
            var card = cardsGroup.children[i]
            popObject(card,delay)
            
            delay +=200
        }
        
        game.time.events.add(delay,function(){
            
            //console.log(timeValue + ' time')
            clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
            clock.tween.onComplete.add(function(){
                gameActive = false
                checkNumber()
            })
            gameActive = true
            
        },this)
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
        
        setNumbers()
        hideO()
        //game.time.events.add(500, showCards , this);

    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addLive(){
        
        sound.play("right")
        
        lives++;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(heartsGroup.text,'+1')
        
    }
    
    function addNumberPart(obj,number){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function addPoint(number){
        
        sound.play("pop")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number)
        
        if(pointsBar.number % 2 == 0){
            timeValue-=0.3
        }
        
    }
    
    function checkNumber(){
        
        if(clock.tween){
            clock.tween.stop()
        }
        
        if(addNumber == numberToCheck){
            addPoint(1)
            master.setAnimationByName(0,"WIN",false)
        }else{
            missPoint()
            master.setAnimationByName(0,"LOSE",false)
        }
        
        master.addAnimationByName(0, "IDLE", true);
        
        hideObjects()
        
    }
    
    function hideObjects(){
        
        var objectsToHide = [selectGroup,cardsGroup,boardGroup]
        
        var delay = 500
        
        for(var i = 0; i < objectsToHide.length;i++){
            
            game.add.tween(objectsToHide[i]).to({alpha:0},300,Phaser.Easing.linear,true,delay)
            delay +=200
        }
        
        delay+=300
        if(lives == 0){
            
            game.time.events.add(1000,stopGame,this)
        }else{
            
            game.time.events.add(delay,function(){
                setNumbers()
                animateNumbers()
            },this)
        }
    }
    
    function inputCard(obj){

        if(gameActive == false){ 
            return
        }
        
        if( obj.pressed == true){
            return
        }
        
        var selectObj = selectGroup.children[numberIndex]
        selectObj.x = obj.world.x
        selectObj.y = obj.world.y
        
        game.add.tween(selectObj).to({alpha:1},500,Phaser.Easing.linear,true)
        
        changeImage(0,boardGroup.points.children[numberIndex])
        
        numberIndex++
        
        addNumber+=obj.parent.number
        
        if(numberIndex == quantNumber){
            
            gameActive = false
            checkNumber()
        }
        
        sound.play("flip")
        
        var parent = obj.parent
        game.add.tween(parent.scale).to({x:0.6,y:0.6},200,Phaser.Easing.linear,true).onComplete.add(function(){
            game.add.tween(parent.scale).to({x:1,y:1},100,Phaser.Easing.linear,true)
        })
        
        //gameActive = false
        obj.pressed = true
        var parent = obj.parent
        
    }
    
    function createCards(){
        
        var background = new Phaser.Graphics(game)
        background.beginFill(0x000000);
        background.drawRoundedRect(game.world.centerX - 300, game.world.centerY - 115 , 600, 575);
        background.endFill();
        background.alpha = 0.6
        sceneGroup.add(background)
        
        cardsGroup = game.add.group()
        sceneGroup.add(cardsGroup)
        
        var initX = game.world.centerX - 190
        var pivotX = initX
        var pivotY = background.y + 160 + background.width * 0.5
        for(var i = 0; i<9;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            cardsGroup.add(group)
            
            var textColor = "#000000"
            var textAdd = 'Clear'
            
            var multiple = i+1
            
            if(multiple % 2 == 0){
                textAdd = 'Dark'
                textColor = "#ffffff"
            }
            
            var image = group.create(0,0,'atlas.dojo','panel' + textAdd)
            image.inputEnabled = true
            image.events.onInputDown.add(inputCard)
            image.pressed = false
            
            image.anchor.setTo(0.5,0.5)
            
            var fontStyle = {font: "75px VAGRounded", fontWeight: "bold", fill: textColor, align: "center"}
            
            var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
            pointsText.anchor.setTo(0.5,0.5)
            group.add(pointsText)
            
            group.text = pointsText
            group.image = image
            group.number = 0
            
            pivotX+= image.width * 1.2
            
            if(multiple % 3 == 0){
                pivotX = initX
                pivotY+= image.height * 1.2
            }
            
        }
        
        selectGroup = game.add.group()
        sceneGroup.add(selectGroup)
        
        for(var i = 0; i < 3; i++){
            
            var image = selectGroup.create(0,0,'atlas.dojo','marco')
            image.alpha = 0
            image.anchor.setTo(0.5,0.5)
            
        }
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.dojo','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.dojo','life_box')

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
                
        //objectsGroup.timer.pause()
        gameActive = false
        //timer.pause()
        dojoSong.stop()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function createBoard(){
        
        boardGroup = game.add.group()
        boardGroup.x = game.world.centerX + 150
        boardGroup.y = 200
        sceneGroup.add(boardGroup)
        
        var boardImage = boardGroup.create(0,0,'atlas.dojo','board')
        boardImage.anchor.setTo(0.5,0.5)
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -60, 0, fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        boardGroup.add(pointsText)
        
        boardGroup.number = pointsText
        
        var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 25, localization.getString(localizationData,"moves"), fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        boardGroup.add(pointsText)
        
        var pointsGrp = game.add.group()
        pointsGrp.y = 60
        boardGroup.add(pointsGrp)
        
        var pivotX = -50
        for(var i = 0; i<3;i++){
            
            var group = game.add.group()
            group.alpha = 0
            group.x = pivotX
            pointsGrp.add(group)
            
            var image = group.create(0,0,'atlas.dojo','backpoint')
            image.anchor.setTo(0.5,0.5)
            
            var image = group.create(0,0,'atlas.dojo','move')
            image.anchor.setTo(0.5,0.5)
            
            pivotX += 50
        }
        
        boardGroup.points = pointsGrp
        
        master = game.add.spine(game.world.centerX - 200,400, "master");
        master.scale.setTo(1,1)
        master.setAnimationByName(0, "IDLE", true);
        master.setSkinByName('normal');
        sceneGroup.add(master)
                
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('master', "images/spines/skeleton.json")  
        game.load.audio('dojoSong', soundsPath + 'songs/asianLoop2.mp3');
        
        game.load.image('introscreen',"images/dojo/introscreen.png")
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width, game.world.height)
        rect.alpha = 0.6
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height
                //start()
                gameStart = true
                animateNumbers()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
        plane.anchor.setTo(0.5,0.5)
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, localization.getString(localizationData, "howTo"), fontStyle)
        pointsText.x = game.world.centerX
        pointsText.y = game.world.centerY - plane.height * 0.375
        pointsText.anchor.setTo(0.5,0.5)
        overlayGroup.add(pointsText)
        
        if(!game.device.desktop){
            
            var inputLogo = overlayGroup.create(game.world.centerX,game.world.centerY + 175,'atlas.dojo','tablet')
            inputLogo.anchor.setTo(0.5,0.5)
            
        }else{
            
            var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
            var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, localization.getString(localizationData, "or"), fontStyle)
            pointsText.x = game.world.centerX - 20
            pointsText.y = game.world.centerY + 175
            pointsText.anchor.setTo(0.5,0.5)
            overlayGroup.add(pointsText)
            
            var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 175,'atlas.dojo','pc')
            inputLogo.anchor.setTo(0.5,0.5)
            
        }
        
    }
    
    function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = boardGroup.y + 120
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.dojo','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.dojo','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
    
	return {
		assets: assets,
		name: "dojo",
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            dojoSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(dojoSong, function(){
                dojoSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
        
            createBoard()
            createCards()
            createClock()
            
            createHearts()
            createPointsBar()
            
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()