var soundsPath = "../../shared/minigames/sounds/"
var openenglish3 = function(){    

	assets = {
        atlases: [
            {   
                name: "atlas.openEnglish",
                json: "images/openEnglish/atlas.json",
                image: "images/openEnglish/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
		],
	}
    
    var QUESTION_LIST = [
        
        ['              are you \ngoing?'],
        ['              that your\n mother?'],
        ['Do you like            \nsweater?'],
        ['            you sleep\n yesterday?'],
        ['            she call \nyou yet?'],
        ['She              always \nwanted to drive a car.'],
        ['He              making\n cookies for everyone.'],
        ['Have you         \nskiing this year?'],
        ['        you like\n cake?'],
        ['They              really\n happy today.'],
        
    ]
    
    var OFFSET_BOX = [-100,-100,135,-125,-100,-38,-48,135,-125,-5]
    
    var WORDS_LIST = [
        
        ['Where','Were','Coming'],
        ['Is','Are','The'],
        ['my','we','they'],
        ['Did','Do','We'],
        ['Did','Do','Is'],
        ['has','have','was'],
        ['was','were','been'],
        ['been','were','was'],
        ['Do','Does','Have'],
        ['are','was','is'],
        
    ]        
    
    var buttonsGroup = null
    var orderList = null
    var listIndex
	var sceneGroup = null
    var gameIndex = 0
    var questionPoints = null
    var mainText = null
    var textContainer = null
    var pointsGroup = null
    
    var orderList = null
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function setOrder(){
        
        orderList = []
        for(var i = 0;i<QUESTION_LIST.length;i++){
            
            orderList[i] = i
        }
        
        Phaser.ArrayUtils.shuffle(orderList)
        
    }
    
	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        listIndex = 0
        gameIndex = 0
        questionPoints = 0
        setOrder()
                
        loadSounds()
        
	}
        
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

		var blackScreen = new Phaser.Graphics(game)
		blackScreen.alpha = 0.3
		blackScreen.beginFill(0x0)
		blackScreen.drawRect(0, 0, game.width, game.height)
		blackScreen.endFill()

		startGroup.add(blackScreen)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)


        var goSign = startGroup.create(0, 0, "atlas.openEnglish", 'goEs')
        goSign.alpha = 0
        goSign.anchor.setTo(0.5, 0.5)
        goSign.x = game.world.centerX
        goSign.y = game.world.centerY - 50
        startGroup.add(goSign)

        var tweenSign = game.add.tween(goSign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Cubic.Out, true, 750)
        tweenSign.onComplete.add(function(){
            //sound.play("go_es")

            var finalTween = game.add.tween(goSign).to({y: game.world.centerY - 100, alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            game.add.tween(startGroup).to({ alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            finalTween.onComplete.add(function(){
                gameActive = true
                setQuestionIndex(gameIndex)
                setWords()
                setScene()
                //showCText()
            })
        })
    }
    
    function setScene(){
        
        var animList = [textContainer,mainText,buttonsGroup.children[0],buttonsGroup.children[1],buttonsGroup.children[2]]
        
        var delay = 0
        for(var i = 0;i<animList.length;i++){
            
            var obj = animList[i]
            
            popObject(obj,delay)
            delay+=200
            
            
        }
        
        game.time.events.add(delay, function(){
            activateButtons(true)
        },this)
        
    }
    
    function setWords(){
        
        textContainer.x = game.world.centerX + OFFSET_BOX[orderList[gameIndex]]
        mainText.setText(QUESTION_LIST[orderList[gameIndex]])
        
        var wordsList = WORDS_LIST[orderList[gameIndex]]
        
        var order = [0,1,2]
        Phaser.ArrayUtils.shuffle(order)
        
        for(var i = 0; i< buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i]
            button.textAdd.setText(wordsList[order[i]])
            
            var dragSprite = button.dragSprite
            dragSprite.x = dragSprite.initialX
            dragSprite.y = dragSprite.initialY
            
            changeButtonImg(0,button.listButton)
            
            dragSprite.correct = false
            if(order[i] == 0){
                dragSprite.correct = true
                //console.log(wordsList[order[i]] + ' word')
            }
            
        }
                
    }
    
    
    function stopGame(win){
        
        
        //objectsGroup.timer.pause()
        gameActive = false
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 200)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(questionPoints,win)

			sceneloader.show("result")
		})
    }
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        if(game.device.desktop == true){ 
            
            particlesNumber = 6
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.openEnglish',key);
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
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.openEnglish',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    
    
    function addCorrect(correct){
        
        var obj = pointsGroup.children[gameIndex]
        
        var color = 2
        if(correct == false){
            color = 3
        }
        
        changeImage(color,pointsGroup.children[gameIndex])
                
        var correct
        if(correct){
            correct = pointsGroup.create(obj.x, obj.y - 35,'atlas.openEnglish','correcto')
            
        }else{
            correct = pointsGroup.create(obj.x, obj.y - 35,'atlas.openEnglish','incorrecto')
        }
        
        correct.anchor.setTo(0.5,0.5)
    }
    
    function popObject(obj, delay){
        
        game.time.events.add(delay,function(){
            sound.play("swipe")
            obj.alpha = 1
            
            var scaleList = [0.01, 0.01]
            
            scaleList[Math.floor(Math.random() * 2)] = 1
            game.add.tween(obj.scale).from({x: scaleList[0], y: scaleList[1]}, 200, Phaser.Easing.linear, true,0)
        })
    }
    
    function changeImage(index,group,isWord){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
        
        if(isWord){
            group.children[3].alpha = 1
        }
    }
    
    function changeButtonImg(index,group){
        
        for (var i = 0;i< group.length; i ++){
            group[i].alpha = 0
            if( i == index){
                group[i].alpha = 1
            }
        }

    }
    
    function createPointsBar(){
        
        var pointsBar = sceneGroup.create(game.world.centerX, 70, 'atlas.openEnglish','lineaGris')
        pointsBar.alpha = 0
        pointsBar.anchor.setTo(0.5,0.5)
        
        pointsGroup = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pivotX = pointsBar.x - pointsBar.width * 0.45
        for(var i = 0;i<10;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pointsBar.y
            pointsGroup.add(group)
            
            var circle1 = group.create(0,0,'atlas.openEnglish','Cgris')
            circle1.anchor.setTo(0.5,0.5)
            
            var circle2 = group.create(0,0,'atlas.openEnglish','Cblanco')
            circle2.anchor.setTo(0.5,0.5)
            
            var circle3 = group.create(0,0,'atlas.openEnglish','Cverde')
            circle3.anchor.setTo(0.5,0.5)
            
            var circle4 = group.create(0,0,'atlas.openEnglish','Cnaranja')
            circle4.anchor.setTo(0.5,0.5)
            
            var fontStyle = {font: "22px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
            
            var trackerText = new Phaser.Text(sceneGroup.game, 0, 3, i + 1, fontStyle)
            trackerText.alpha = 0
            trackerText.anchor.setTo(0.5, 0.5)
            group.add(trackerText)
            
            pivotX+= circle1.width * 1.44
            
            changeImage(0,group)
            
        }
        
    }
    
    function preload(){
        game.load.bitmapFont('wFont', 'images/font/wFont.png', 'images/font/wFont.fnt');
    }
    
    function createButtons(){
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var pivotY = game.world.centerY + 50
        for(var i = 0; i <3;i++){
            
            var button = game.add.group()
            button.x = game.world.centerX
            button.y = pivotY
            button.alpha = 0
            buttonsGroup.add(button)
            
            var listButtons = []
            
            for(var a = 0;a<3;a++){
                
                var butImg = button.create(0,0,'atlas.openEnglish','opcion' + (a+2))
                butImg.width = textContainer.width
                butImg.anchor.setTo(0.5,0.5)
                
                listButtons[listButtons.length] = butImg
            
            }
            
            button.listButton = listButtons
            changeButtonImg(0,listButtons)            
            
            var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            
            var butText = new Phaser.Text(sceneGroup.game,0,0,'hola', fontStyle)
            butText.anchor.setTo(0.5, 0.5)
            button.add(butText)
            
            button.textAdd = butText
            
            pivotY+= butImg.height * 1.3
            
            var dragSprite = sceneGroup.create(button.x, button.y,'atlas.openEnglish','opcion2')
            dragSprite.anchor.setTo(0.5,0.5)
            dragSprite.alpha = 0
            dragSprite.initialX = button.x
            dragSprite.initialY = button.y
            
            dragSprite.inputEnabled = true
            dragSprite.input.enableDrag(true)
            dragSprite.events.onDragStart.add(onDragStart, this);
            dragSprite.events.onDragStop.add(onDragStop, this);
            
            button.dragSprite = dragSprite
            dragSprite.button = button
            
        }
    }
    
    function setQuestionIndex(index){
        
        var obj = pointsGroup.children[index]
        changeImage(1,obj)
        
        /*if(index > 0){
            changeImage(2,pointsGroup.children[index - 1])
        }*/
        
        var scaleTween = game.add.tween(obj.scale).to({x:1.3,y:1.3}, 200, Phaser.Easing.linear, true)
        
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 200, Phaser.Easing.linear, true)
                        
        })
        
    }
    
    function hideScene(){
        
        var animList = [textContainer,mainText,buttonsGroup.children[0],buttonsGroup.children[1],buttonsGroup.children[2]]
        
        var delay = 0
        for(var i = 0;i<animList.length;i++){
            game.add.tween(animList[i]).to({alpha:0},300,Phaser.Easing.linear,true,delay)
            delay+= 100
        }
    }
    
    function activateButtons(activate){
        
        for(var i = 0;i<buttonsGroup.length;i++){
            var button = buttonsGroup.children[i]
            button.dragSprite.inputEnabled = activate
        }
    }
    
    function checkSprite(obj){
        
        var list = obj.button.listButton

        if(obj.correct){
            
            addCorrect(true)
            createPart('star',obj)
            sound.play("magic")
            questionPoints++
            changeButtonImg(2,list)
            
        }else{
            
            addCorrect(false)
            createPart('wrong',obj)
            sound.play("wrong")
            changeButtonImg(1,list)
        }
        
        game.add.tween(obj.button.scale).to({x:1.2,y:1.2},250,Phaser.Easing.linear,true).onComplete.add(function(){
            game.add.tween(obj.button.scale).to({x:1,y:1},250,Phaser.Easing.linear,true)
        })
        
        
        game.time.events.add(1000,function(){
            
            gameIndex++
            hideScene()
            
            game.time.events.add(750,function(){
                
                if(gameIndex < 10){
                    
                    setQuestionIndex(gameIndex)
                    setWords()
                    setScene()
                }else{
                    stopGame()
                }
                
            })
            
        },this)
        
    }
    
    function onDragStop(obj){
        
        sound.play("pop")
        obj.inputEnabled = false
        
        if(Math.abs(obj.x - textContainer.x) < textContainer.width * 0.5 && Math.abs(obj.y - textContainer.y) < textContainer.height * 0.5){
            game.add.tween(obj).to({x:textContainer.x,y:textContainer.y},300,Phaser.Easing.linear,true).onComplete.add(function(){
                checkSprite(obj)
                activateButtons(false)
            })
        }else{
            game.add.tween(obj).to({x:obj.initialX,y:obj.initialY},300,Phaser.Easing.linear,true).onComplete.add(function(){
                obj.inputEnabled = true
            })
        }        
        
    }
    
    function onDragStart(obj){
        
        sound.play("flipCard")
    }
    
    function update(){
        
        if(!gameActive){
            return
        }
        
        for(var i = 0;i<buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i]
            button.x = button.dragSprite.x
            button.y = button.dragSprite.y
            
        }
        
    }
    
	return {
		assets: assets,
        preload: preload,
        update: update,
		name: "openenglish3",
		create: function(event){

			sceneGroup = game.add.group()
            
            var topBack = new Phaser.Graphics(game)
            topBack.beginFill(0x058fff );
            topBack.drawRect(0, 0, game.world.width, game.world.height);
            topBack.endFill();
            topBack.anchor.setTo(0,0)
            sceneGroup.add(topBack)
            
            var openLogo = sceneGroup.create(game.world.centerX,game.world.height - 25,'atlas.openEnglish','openEnglishLogo')
            openLogo.anchor.setTo(0.5,1)
            
            createPointsBar()
            
            var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            
            mainText = new Phaser.Text(sceneGroup.game,game.world.centerX,game.world.centerY - 200,QUESTION_LIST[0], fontStyle)
            mainText.anchor.setTo(0.5, 0.5)
            sceneGroup.add(mainText)
            mainText.alpha = 0
            
            textContainer = sceneGroup.create(game.world.centerX, game.world.centerY - 235,'atlas.openEnglish','option')
            textContainer.width *=0.5
            textContainer.anchor.setTo(0.5,0.5)
            textContainer.alpha = 0
            
            createButtons()
            
            initialize()
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()