var soundsPath = "../../shared/minigames/sounds/"
var openenglish4 = function(){    

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
    
    var WORDS_LIST = [
        
        'naranja',
        'manzana',
        'durazno',
        'plátano',
        'guayaba',
        'uva',
        'cereza',
        'ciruela',
        'pera',
        'lima',
        
    ]      
    
    var LETTER_LIST = [
        
        ['O','R','A','N','G','E'],
        ['A','P','P','L','E'],
        ['P','E','A','C','H'],
        ['B','A','N','A','N','A'],
        ['G','U','A','V','A'],
        ['G','R','A','P','E'],
        ['C','H','E','R','R','Y'],
        ['P','L','U','M'],
        ['P','E','A','R'],
        ['L','I','M','E'],
        
    ] 
    
    var buttonsGroup = null
    var orderList = null
	var sceneGroup = null
    var containersGroup = null
    var gameIndex = 0
    var okBtn = null
    var imageGroup = null
    
    var questionPoints = null
    var pointsGroup = null
    
    var orderList = null
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function setOrder(){
        
        orderList = []
        for(var i = 0;i<WORDS_LIST.length;i++){
            
            orderList[i] = i
        }
        
        Phaser.ArrayUtils.shuffle(orderList)
        
    }
    
	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = false
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
                setQuestionIndex(gameIndex)
                setWords()
                setScene()
                //showCText()
            })
        })
    }
    
    function setScene(){
        
        var animList = [imageGroup,containersGroup,buttonsGroup.children[0],buttonsGroup.children[1],buttonsGroup.children[2],buttonsGroup.children[3],okBtn]
        
        var delay = 0
        for(var i = 0;i<animList.length;i++){
            
            var obj = animList[i]
            
            if(obj.isButton){
                if(obj.used){
                    popObject(obj,delay)
                }else{
                    delay-=200
                }
            }else{
                popObject(obj,delay)
            }
            
            delay+=200
            
            
        }
        
        game.time.events.add(delay, function(){
            activateButtons(true)
            gameActive = true
        },this)
        
    }
    
    function setWords(){
        
        for(var i = 0;i<buttonsGroup.length;i++){
            var button = buttonsGroup.children[i]
            changeButtonImg(0,button.imageList)
            button.dragSprite.x = button.dragSprite.initialX
            button.dragSprite.y = button.dragSprite.initialY
            button.scale.setTo(1,1)
            button.textAdd.tint = 0x000000
        }
        
        for(var i = 0;i<containersGroup.length;i++){
            var cont = containersGroup.children[i]
            cont.alpha = 0
            changeButtonImg(0,cont.imageList)
            cont.textUsed.setText('')
        }
        
        var word =  LETTER_LIST[orderList[gameIndex]]
        
        var pivotX = -1 * (72 * word.length * 0.5)
        var index = game.rnd.integerInRange(1, word.length)
        var index2 = null
        
        if(word.length >=6){
            index2 = index
            while(index2 == index){
                index2 = game.rnd.integerInRange(1,word.length)
            }
        }
        
        
        var offsetX = 100    
        var scaleToUse = 1
        
        if(word.length == 5){
            scaleToUse = 0.85
            offsetX = 90
        }else if(word.length == 6){
            scaleToUse = 0.8
            offsetX = 86
        }
        
        var list = []
        for(var i = 0;i<word.length;i++){
            
            var cont = containersGroup.children[i]
            cont.x = pivotX
            cont.alpha = 1
            cont.used = true
            cont.scale.setTo(scaleToUse,scaleToUse)
            cont.scaleUsed = scaleToUse
            cont.word = word[i]
            
            pivotX+= offsetX

            var checkNumber = i+1
            if(checkNumber == index || checkNumber == index2){
                
                cont.textUsed.setText(word[i])
                cont.used = false
            }
            
            if(cont.used){
                list[list.length] = word[i]
            }
            
        }
        
        Phaser.ArrayUtils.shuffle(list)
        
        //console.log(list)
        for(var i = 0; i<buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i]
            button.isButton = true
            button.cont = null
            
            if(list[i]){
                button.textAdd.setText(list[i])
                button.word = list[i]
                button.used = true
            }else{
                button.alpha = 0
                button.used = false
            }
            
        }
        
        changeButtonImg(gameIndex,imageGroup.imageList)
        
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
        
        var pivotX = pointsBar.x - pointsBar.width * 0.2
        for(var i = 0;i<5;i++){
            
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
        
        var pivotX = game.world.centerX - 150
        var pivotY = game.world.centerY + 200
        for(var i = 0; i <4;i++){
            
            var button = game.add.group()
            button.x = pivotX
            button.y = pivotY
            button.alpha = 0
            buttonsGroup.add(button)
            
            var listButtons = []
            
            for(var a = 0;a<3;a++){
                
                var butImg = button.create(0,0,'atlas.openEnglish','opcion' + (a+1))
                butImg.anchor.setTo(0.5,0.5)
                
                listButtons[listButtons.length] = butImg
            
            }
            
            button.imageList = listButtons
            changeButtonImg(0,listButtons)            
            
            var butText = game.add.bitmapText(0,0, 'wFont', '', 45);
            butText.anchor.setTo(0.5, 0.5)
            butText.tint = 0x000000
            button.add(butText)
            
            button.textAdd = butText
            
            pivotX+= 100
            
            var dragSprite = sceneGroup.create(button.x, button.y,'atlas.openEnglish','espacioBlanco')
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
                
        var animList = [imageGroup,containersGroup,buttonsGroup.children[0],buttonsGroup.children[1],buttonsGroup.children[2],buttonsGroup.children[3],okBtn]
        
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
    
    function checkPos(obj,target){
        
        if(Math.abs(obj.x - target.world.x) < target.width * 0.5 && Math.abs(obj.y - target.world.y) < target.height * 0.5){
            return true
        }
        return false
    }
    
    function onDragStop(obj){
        
        sound.play("pop")
        obj.inputEnabled = false
        
        var button = obj.button
        
        for(var i = 0;i<containersGroup.length;i++){
            var cont = containersGroup.children[i]
            var img = cont.img
            if(checkPos(obj,img) && cont.used){
                
                obj.button.cont = cont
                cont.used = false
                
                game.add.tween(obj.button.scale).to({x:cont.scaleUsed,y:cont.scaleUsed},300,Phaser.Easing.linear,true)
                
                game.add.tween(obj).to({x:img.world.x,y:img.world.y},300,Phaser.Easing.linear,true).onComplete.add(function(){
                    obj.inputEnabled = true
                })
                return
            }
        }   
        
        game.add.tween(obj.button.scale).to({x:1,y:1},300,Phaser.Easing.linear,true)
        game.add.tween(obj).to({x:obj.initialX,y:obj.initialY},300,Phaser.Easing.linear,true).onComplete.add(function(){
            obj.inputEnabled = true
        })
        
    }
    
    function onDragStart(obj){
        
        sound.play("flipCard")
        
        var button = obj.button
        var parent = button.parent
        
        parent.removeChild(button);		
        parent.addChild(button);
        
        var button = obj.button
        if(button.cont){
            
            button.cont.used = true
            button.cont = null
        }
    }
    
    function update(){
        
        for(var i = 0;i<buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i]
            button.x = button.dragSprite.x
            button.y = button.dragSprite.y
            
        }
        
    }
    
    function createImageGroup(){
        
        imageGroup = game.add.group()
        imageGroup.x = game.world.centerX 
        imageGroup.y = game.world.centerY - 185
        imageGroup.alpha = 0
        sceneGroup.add(imageGroup)
        
        var topBack = new Phaser.Graphics(game)
        topBack.beginFill(0xffffff);
        topBack.drawRoundedRect(0, 0, 300,300,30);
        topBack.endFill();
        topBack.x-= topBack.width * 0.5
        topBack.y-= topBack.height * 0.5
        imageGroup.add(topBack)
        
        var imagelist = []
        for(var i = 0; i<5;i++){
            
            var word = WORDS_LIST[orderList[i]]
            
            var group = game.add.group()
            imageGroup.add(group)
            
            word = word.replace(/á/gi,"a")
            
            var image = group.create(0,-25,'atlas.openEnglish',word)
            image.anchor.setTo(0.5,0.5)
            
            var imageText = game.add.bitmapText(0,115, 'wFont', word, 45);
            imageText.anchor.setTo(0.5, 0.5)
            imageText.tint = 0x000000
            group.add(imageText)
            
            imagelist[imagelist.length] = group
            
        }
        
        changeButtonImg(0,imagelist)
        imageGroup.imageList = imagelist
        
    }
    
    function createContainers(){
        
        containersGroup = game.add.group()
        containersGroup.x = game.world.centerX
        containersGroup.y = game.world.centerY + 70
        containersGroup.alpha = 0
        sceneGroup.add(containersGroup)
        
        for(var i = 0;i<6;i++){
            
            var group = game.add.group()
            group.alpha = 0
            group.used = false
            group.scale.setTo(0.9,0.9)
            containersGroup.add(group)
            
            var buttonList = []
            
            var container = group.create(0,0,'atlas.openEnglish','espacioAzul')
            container.anchor.setTo(0.5,0.5)
            buttonList[buttonList.length] = container
            
            for(var a = 0; a< 2;a++){
                
                var button = group.create(0,0,'atlas.openEnglish','opcion' + (a+2))
                button.anchor.setTo(0.5,0.5)
                buttonList[buttonList.length] = button
            }
            
            
            changeButtonImg(0,buttonList)
            
            group.imageList = buttonList
            
            group.img = container
            
            var imageText = game.add.bitmapText(0,0, 'wFont', '', 40);
            imageText.anchor.setTo(0.5, 0.5)
            group.add(imageText)
            
            group.textUsed = imageText
        
        }
        
    }
    
    function setCorrect(correct){
        
        var index = 2
        if(correct){
            sound.play("magic")
            addCorrect(true)
            questionPoints++
        }else{
            index = 1   
            sound.play("wrong")
            addCorrect(false)
        }
        
        for(var i=0;i<buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i]
            button.dragSprite.inputEnabled = false
            changeButtonImg(index,button.imageList)
            button.textAdd.tint = 0xffffff
            
            if(button.alpha == 1){
                
                if(index == 2){
                createPart('star',button)
                }else{
                    createPart('wrong',button)
                }
            }
            
        }
        
        for(var i=0;i<containersGroup.length;i++){
            
            var cont = containersGroup.children[i]
            changeButtonImg(index,cont.imageList)
            
        }
        
        game.time.events.add(1000,function(){
            
            gameIndex++
            hideScene()
            
            game.time.events.add(1000,function(){
                if(gameIndex >= 5){
                    
                    stopGame()
                }else{
                    setQuestionIndex(gameIndex)
                    setWords()
                    setScene()
                }
            })
            
        })
        
        
    }
    function inputButton(obj){
        
        if(!gameActive){
            return
        }
        
        gameActive = false
        
        game.add.tween(obj.scale).to({x:0.7,y:0.7},200,Phaser.Easing.linear,true).onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
        })
        
        game.add.tween(obj).to({alpha:0},300,Phaser.Easing.linear,true,600)
        
        //console.log('check')
        
        var correct = true
        for(var i = 0;i<buttonsGroup.length;i++){
            var button = buttonsGroup.children[i]
            
            if(button.used){
                if(button.cont && button.cont.word == button.word){
                    
                }else{
                    correct = false
                }
            }
        }
        
        if(correct){
            setCorrect(true)
        }else{
            setCorrect(false)
        }
        
        //console.log(correct)
        
    }
    
	return {
		assets: assets,
        preload: preload,
        update: update,
		name: "openenglish4",
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
            
            initialize()
            
            createImageGroup()
            createContainers()
            createButtons() 
            
            okBtn = sceneGroup.create(game.world.centerX, game.world.centerY + 325,'atlas.openEnglish','ok')
            okBtn.inputEnabled = true
            okBtn.alpha = 0
            okBtn.events.onInputDown.add(inputButton)
            okBtn.anchor.setTo(0.5,0.5)
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()