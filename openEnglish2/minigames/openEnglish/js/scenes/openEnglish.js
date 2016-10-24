var openEnglish = function(){
    
    var localizationData = {
		"EN":{

		},

		"ES":{

            
		}
	}
    

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
            {	name: "pop",
				file: "sounds/magic.mp3"},
            {	name: "swipe",
				file: "sounds/swipe.mp3"},
            {	name: "wrong",
				file: "sounds/wrong.mp3"},
            {	name: "ready_es",
				file: "sounds/ready_es.mp3"},
            {	name: "go_es",
				file: "sounds/go_es.mp3"},
            {	name: "click",
				file: "sounds/pop.mp3"},
		],
	}
        
    var SPEED = 7
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    
    var buttonsGroup = null
	var sceneGroup = null
    var gameIndex = 0
    var questionPoints = null
    var pointsGroup = null
    
    var orderList = null
    var wordsList = ['brazo','cena','cuerno','fecha','arma','carton','contestar','pan','once','advertir','noticia']
        
    var transList = [

        ['Arm','Armory'],
        ['Dinner','Diner'],
        ['Horn','Corn'],
        ['Date','Fetch'],   
        ['Gun','Arm'],
        ['Cardboad','Cartoon'],
        ['Answer','Contest'],
        ['Bread','Pan'],
        ['Eleven','Once'],
        ['To warn','Advertise'],
        ['News','Notice'],

    ]
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function setOrderList(){
        
        orderList = []
        for(var i = 0;i<wordsList.length;i++){
            orderList[orderList.length] = i
        }
        
        Phaser.ArrayUtils.shuffle(orderList)
    }
    
	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        gameIndex = 0
        questionPoints = 0
        
        setOrderList()
        
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
            sound.play("go_es")

            var finalTween = game.add.tween(goSign).to({y: game.world.centerY - 100, alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            game.add.tween(startGroup).to({ alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            finalTween.onComplete.add(function(){
                gameActive = true
                setWords()
                //timer.start()
                //objectsGroup.timer.start()
            })
        })
    }
    
    function stopGame(){
        
        
        //objectsGroup.timer.pause()
        gameActive = false
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 200)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("resultOpenEnglish")
			resultScreen.setScore(questionPoints)

			sceneloader.show("resultOpenEnglish")
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
    
    function restartCards(){
        
        var objectsList = [cardToUse, buttonsGroup.children[0], buttonsGroup.children[1]]
        
        var delay = 700
        for(var i = 0; i< objectsList.length;i++){
            delay+=75
            game.add.tween(objectsList[i]).to({alpha:0}, 200, Phaser.Easing.linear, true, delay)
        }
        
        game.time.events.add(delay + 500,function(){
            gameIndex++
            
            if(gameIndex> 9){
                stopGame()
            }else{
                setWords()
            }
            
        })
    }
    
    function addCorrect(correct){
        
        var obj = pointsGroup.children[gameIndex]
        var correct
        if(correct){
            correct = sceneGroup.create(obj.x, obj.y - 35,'atlas.openEnglish','correcto')
            
        }else{
            correct = sceneGroup.create(obj.x, obj.y - 35,'atlas.openEnglish','incorrecto')
        }
        correct.anchor.setTo(0.5,0.5)
    }
    
    function inputCard(obj){
        
        if(gameActive == false){
            return
        }
        
        gameActive = false
        
        obj = obj.parent
        var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
                        
        })
        
        if(obj.correct == true){
            createPart('star',obj)
            sound.play("pop")
            questionPoints++
            addCorrect(true)
        }else{
            createPart('wrong',obj)
            sound.play("wrong")
            addCorrect(false)
        }
        
        restartCards()
        
    }
    
    function createButtons(){
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var pivotX = game.world.centerX
        var pivotY = game.world.height - game.world.height * 0.3
        
        for(var i = 0;i<2;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            group.alpha = 0
            buttonsGroup.add(group)
            
            var img = group.create(0,0,'atlas.openEnglish','_opcion')
            img.anchor.setTo(0.5,0.5)
            
            img.inputEnabled = true
            img.events.onInputDown.add(inputCard)
            
            var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
            
            var trackerText = new Phaser.Text(sceneGroup.game, 0, 0, "button", fontStyle)
            trackerText.anchor.setTo(0.5, 0.5)
            group.add(trackerText)
            
            group.text = trackerText
            
            pivotY+= img.height * 1.2
            
        }
    }
    
    function setButtonsText(texts){
        
        buttonsGroup.children[0].text.setText(texts[0])
        buttonsGroup.children[0].correct = true
        buttonsGroup.children[0].alpha = 0
        
        buttonsGroup.children[1].text.setText(texts[1])
        buttonsGroup.children[1].correct = false
        buttonsGroup.children[1].alpha = 0
        
        var randomList = [0,1]
        
        Phaser.ArrayUtils.shuffle(randomList)
        
        buttonsGroup.children[randomList[0]].y = game.world.height * 0.725
        buttonsGroup.children[randomList[1]].y = buttonsGroup.children[randomList[0]].y + buttonsGroup.children[0].height * 1.2
        
    }
    
    function setCard(imageName){
        
        cardToUse = sceneGroup.create(game.world.centerX,game.world.height * 0.3,'atlas.openEnglish',imageName)
        cardToUse.anchor.setTo(0.5,0.5)
        cardToUse.alpha = 0
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
    
    function setQuestionIndex(index){
        
        var obj = pointsGroup.children[index]
        changeImage(1,obj)
        
        if(index > 0){
            changeImage(2,pointsGroup.children[index - 1])
        }
        
        var scaleTween = game.add.tween(obj.scale).to({x:1.3,y:1.3}, 200, Phaser.Easing.linear, true)
        
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 200, Phaser.Easing.linear, true)
                        
        })
        
    }
    
    function animateCards(){
        
        var listObjects = [cardToUse,buttonsGroup.children[0],buttonsGroup.children[1]]
        
        if(buttonsGroup.children[0].y > buttonsGroup.children[1].y){
            listObjects[1] = buttonsGroup.children[1]
            listObjects[2] = buttonsGroup.children[0]
        }
        
        var delay = 0
        for(var i = 0;i < listObjects.length;i++){
            
            delay+= 175
            
            popObject(listObjects[i],delay)

        }
        
        setQuestionIndex(gameIndex)
        
        game.time.events.add(delay + 500,function(){
            gameActive = true
        })
        
    }
    
    function setWords(){
        
        //console.log(orderList)
        
        setCard(wordsList[orderList[gameIndex]])
        
        setButtonsText(transList[orderList[gameIndex]])     
        
        animateCards()
        
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
        group.children[3].alpha = 1
    }
    
    function createPointsBar(){
        
        var pointsBar = sceneGroup.create(game.world.centerX, 70, 'atlas.openEnglish','lineaGris')
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
            
            var circle2 = group.create(0,0,'atlas.openEnglish','Cazul')
            circle2.anchor.setTo(0.5,0.5)
            
            var circle3 = group.create(0,0,'atlas.openEnglish','Cverde')
            circle3.anchor.setTo(0.5,0.5)
            
            var fontStyle = {font: "22px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
            
            var trackerText = new Phaser.Text(sceneGroup.game, 0, 3, i + 1, fontStyle)
            trackerText.anchor.setTo(0.5, 0.5)
            group.add(trackerText)
            
            pivotX+= circle1.width * 1.315
            
            changeImage(0,group)
            
        }
        
    }
	return {
		assets: assets,
		name: "openEnglish",
		create: function(event){

			sceneGroup = game.add.group()
            
            var botBack = new Phaser.Graphics(game)
            botBack.beginFill(0x93c100);
            botBack.drawRect(0, game.world.height, game.world.width, -game.world.height * 0.5);
            botBack.endFill();
            botBack.anchor.setTo(0,1)
            sceneGroup.add(botBack)
            
            var topBack = new Phaser.Graphics(game)
            topBack.beginFill(0x2868b6);
            topBack.drawRect(0, 0, game.world.width, game.world.height * 0.55);
            topBack.endFill();
            topBack.anchor.setTo(0,0)
            sceneGroup.add(topBack)
            
            var midBack = new Phaser.Graphics(game)
            midBack.beginFill(0xffffff);
            midBack.drawRect(0, game.world.height * 0.55, game.world.width, 20);
            midBack.endFill();
            midBack.anchor.setTo(0,0.5)
            sceneGroup.add(midBack)
            
            createButtons()
            createPointsBar()
            
            initialize()
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()