var chilimBalam = function(){
    
    var localizationData = {
		"EN":{
            "language":"en",
			"assetReady":"readyEn",
			"assetGo":"goEn",
			"assetExcellent":"excEn",
            "assetGiveUp":"giveUpEn"
		},

		"ES":{
            "languague":"es",
			"assetReady":"readyEs",
			"assetGo":"goEs",
			"assetExcellent":"excEs",
            "assetGiveUp":"giveUpEs",
            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.chilimBalam",
                json: "images/chilimBalam/atlas.json",
                image: "images/chilimBalam/atlas.png",
            },
        ],
		sounds: [
            {	name: "pop",
				file: "sounds/pop.mp3"},
            {	name: "swipe",
				file: "sounds/swipe.mp3"},
            {	name: "wrong",
				file: "sounds/wrong.mp3"},
			
		],
	}
    
    var QUESTIONS = [
        'Cuando vas al gym, \n¿cuál es tu actividad favorita?',
        '¿Cuál es la canción que \ndescribe tu "workout"?',
        '¿Cuando necesitas un "boost" \nde energía qué snack comes?',
        'Tu "date" ideal sería:',
        'Cuando lees una revista de \nsalud y fitness tú...',
        'Tienes una cita a 2 km y tu \ncoche se descompone, tú...',
        '¿Cuánto te tardas en correr 1 km?',        
    ]
    
    var ANSWERS = [
        [
            '- 20 minutos en la elíptica \n(además quemas calorías extras mientras\n platicas con tus amigas)',
            '- Sólo pago para ir al sauna',
            '- Voy para ponerme al corriente de la \nplática de la semana',
            '- Bootcamp, Pilates, reto del mes... \npruebas de todo lo que haya', 
        ],
        [
            '- Work B**ch - Britney Spears',
            '- Lazy song - Bruno Marz',
            '- Wannabe - Spice Girls',
            '- Stronger (What Doesn´t Kill You) \n- Kelly Clarkson',
        ],
        [
            '- Un cupcake de chocolate para quemar \ncalorías con más ganas después',
            '- ¿Snack? yo voy por la pizza completa',
            '- Un batido de proteína \nque vi en facebook',
            '- Un shot de té verde \ncon wheatgrass',
        ],
        [
            '- Ir a un parque a caminar mientras \nplatican y ríen (la mejor forma \nde romper el hielo)',
            '- Ver una película con palomitas \nen tu casa (mejor si es en pants y sudadera)',
            '- Ir con tus amigas a una fiesta',
            '- Inscribirse a una carrera de obstáculos \njuntos (no hay nada más romántico \nque verlo atravesar el lodo por ti)',
        ],
        [
            '- Te robas los mejores tips de las celebridades \npara estar en forma (aunque luego se te olviden)',
            '- La hojeas mientras comes helado \ny te burlas de las modas ridículas de los famosos',
            '- No puedes creer que la gente piense \nque las Kardashian no están operadas',
            '- Tú misma pudiste haber escrito eso, \ntodo te parece familiar',
        ],
        [
            '- Me voy en bici, además es un buen paseo',
            '- ¿Caminar dos km? Mejor la cancelo',
            '- Me voy caminando... \nal sitio de taxis más cercano',
            '- Perfecta oportunidad para quemar calorías \nextra, me voy corriendo y doy dos vueltas',
        ],
        [
            '- No me fijo, solo voy a la color run con mis amigas',
            '- Depende, si es para alcanzar a \nla bici que vende pan unos 2 minutos',
            '- Según mi reloj de máxima \ntecnología, hago 5.37 minutos',
            '- Rompo mi record cada vez que lo \nintento, (a veces juego carreritas contra los coches)',
        ],
    ]
    
    var SPEED = 5
    var TIME_OBJECTS = 1500
    var GRAVITY_OBJECTS = 7
    
	var sceneGroup = null
    var answersGroup = null
    var pointsGroup = null
    var questionText = null
    var questionGroup = null
    var purpleBack = null
    var gameActive = true
    var valuesList = null
    var moveLeft, moveRight
    var characterGroup = null
    var timer
    var timeGroup = null
    var pointsBar = null
    var throwTime = null
    var lives = null
    var heartsGroup = null
    var leftKey = null
    var rightKey = null
    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        moveLeft = false
        moveRight = false
        throwTime = 1000
        lives = 3
        
	}
    

    
    function animateScene() {
        
        //gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

		return startGroup
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
    
    function onTapButton(target){
        
        if (gameActive == false){
            return
        }
        
        gameActive = false
        
        var delayQuestion = 500
        
        valuesList[valuesList.length + 1] = target.value
        
        sound.play("pop")
        
        target.alpha = 0.6
        var targetP = target.parent
        var lastHeight = targetP.height
        var lastWidth = targetP.width
        var scaleTween = game.add.tween(target.parent).to( { width: targetP.width * 0.85, height: targetP.height * 0.85 }, 250, Phaser.Easing.Cubic.In, true);
        scaleTween.onComplete.add(function(){
            game.add.tween(target.parent).to( { width: lastWidth, height: lastHeight }, 250, Phaser.Easing.Cubic.Out, true);
        })
            
        if (indexQuestion >5){
            
            endGame()
        }else{
            
            var lastGroup = questionGroup.children[indexQuestion]
            game.add.tween(lastGroup).to({x: lastGroup.x - game.world.width}, 500, Phaser.Easing.Cubic.Out, true, delayQuestion)
        
            changeImage(1,pointsGroup.children[indexQuestion])

            indexQuestion++

           

            var nextGroup = createQuestionGroup()
            nextGroup.x = game.world.width
            var tweenNext = game.add.tween(nextGroup).to({x: nextGroup.x - game.world.width}, 500, Phaser.Easing.Cubic.Out, true, delayQuestion)
            
            tweenNext.onStart.add(function(){ 
                changeImage(2,pointsGroup.children[indexQuestion])

                var scaleTween = game.add.tween(pointsGroup.children[indexQuestion].scale).to( { x:1.2, y:1.2 }, 200, Phaser.Easing.Cubic.In, true);
                scaleTween.onComplete.add(function(){
                    game.add.tween(pointsGroup.children[indexQuestion].scale).to( { x:1, y:1 }, 200, Phaser.Easing.Cubic.Out, true);
                })
                sound.play("swipe")
            })
            tweenNext.onComplete.add(function(){

                gameActive = true
            })
        }
        
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
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;

        game.load.spine('mascot', "images/spines/mascotaAmazing.json");
        game.load.image('button1', "images/instafit/btnok.png");
        
    }
    
    function createControls(){
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xffffff);
        bottomRect.drawRect(0, game.world.height, game.world.width, -game.world.height * 0.175);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        
        var button1 = sceneGroup.create(game.world.centerX - 150, game.world.height - 150, 'atlas.chilimBalam','boton')
        button1.inputEnabled = true
        button1.events.onInputDown.add(function(){
            moveLeft = true
            moveRight = false
            characterGroup.scale.x = -1
        })
        button1.events.onInputUp.add(function(){
            moveLeft = false
        })
        
        var button2 = sceneGroup.create(game.world.centerX + 150, game.world.height - 150, 'atlas.chilimBalam','boton')
        button2.scale.x = -1
        button2.inputEnabled = true
        button2.events.onInputDown.add(function(){
            moveLeft = false
            moveRight = true
            characterGroup.scale.x = 1
        })
         button2.events.onInputUp.add(function(){
            moveRight = false
        })
        
    }
    
    function moveChRight(){
        characterGroup.x+=SPEED;
        if (characterGroup.x>=game.world.width - 50){
            characterGroup.x = game.world.width - 50
        }
    }
    
    function moveChLeft(){
        characterGroup.x-=SPEED;
        if (characterGroup.x<=50){
            characterGroup.x = 50
        }
    }
    
    function stopGame(win){
        
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        objectsGroup.timer.pause()
        gameActive = false
        timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("resultChilimBalam")
			resultScreen.setScore(timeGroup.textI.text,win)

			sceneloader.show("resultChilimBalam")
		})
    }
    function addPoint(){
        
        sound.play("pop")
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number >= 10){
            stopGame(true)
        }
    }
    
    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        changeImage(0,heartsGroup.children[lives])
        if(lives == 0){
            stopGame(false)
        }
    }
    
    function checkPos(obj){
        
        var cup = characterGroup.cup
        //console.log(cup.world.x + ' cupx')
        if(obj.active == true){
            if(Math.abs(cup.world.x - obj.x) < 75 && Math.abs(cup.world.y - obj.y) < 75){
                obj.alpha = 0
                obj.active = false
                if(obj.tag == 'candy'){
                    addPoint()
                    var scaleTo = game.add.tween(cup.scale).to({x:0.8, y:0.8}, 100, Phaser.Easing.Cubic.Out, true)
                    scaleTo.onComplete.add(function(){
                        game.add.tween(cup.scale).to({x:1, y:1}, 100, Phaser.Easing.Cubic.Out, true)
                    })
                }else{
                    missPoint()
                    game.add.tween(cup).to({angle:'+360'}, 300, Phaser.Easing.Linear.None, true);
                }
            }
        }
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        if(moveRight == true){
            moveChRight()
            
        }else if(moveLeft == true){
            moveChLeft()
        }
        
         if (leftKey.isDown)
        {
            moveChLeft()
            characterGroup.scale.x = -1
        } else if(rightKey.isDown){
            moveChRight()
            characterGroup.scale.x = 1
        }
        
        for(var i = 0; i < objectsGroup.length;i++){
            var obj = objectsGroup.children[i]
            obj.y+= GRAVITY_OBJECTS
            
            checkPos(obj)
        }
        
    }
    
    function createTime(){
        
        timeGroup = game.add.group()
        timeGroup.x = game.world.right
        timeGroup.y = 0
        sceneGroup.add(timeGroup)
        
        var timeImg = timeGroup.create(0,0,'atlas.chilimBalam','time')
        timeImg.width*=1.3
        timeImg.height*=1.3
        timeImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "27px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var timerText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        timerText.x = -timeImg.width * 0.55
        timerText.y = timeImg.height * 0.18
        timeGroup.add(timerText)
        
        timeGroup.textI = timerText
        timeGroup.number = 0
        
        timer = game.time.create(false);
        timer.loop(1, updateSeconds, this);
        
        timer.start()
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,0,'atlas.chilimBalam','xpcoins')
        pointsImg.width *=1.1
        pointsImg.height*=1.1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.1
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 60
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        for(var i = 0; i <3; i++){
            var group = game.add.group()
            group.x = pivotX
            heartsGroup.add(group)
            
            group.create(0,0,'atlas.chilimBalam','heartsempty')
            
            group.create(0,0,'atlas.chilimBalam','heartsfull')
            
            pivotX+= 55
        }
    }
    
     function updateSeconds(){
        
        timeGroup.number += 1;
        timeGroup.textI.setText(timeGroup.number / 100)
        
    }
    
    function dropObjects(){
        
        var objectsNames = ['cacahuate','gomita1','gomita2','manzana','paleta','palomita1','palomita2','papa']
        
        var obstaclesNames = ['sombrero','tennis','tornillo','tuerca','zapato']
        
        var posX = Math.random() * game.world.width - 75
        if(posX < 75){ posX = 75}
        if(Math.random() * 9 < 4){
            var obj = objectsGroup.create(posX,-50,'atlas.chilimBalam',objectsNames[Math.round(Math.random()*(objectsNames.length - 1))])
            obj.tag = 'candy'   
            obj.active = true
        }else{
            var obj = objectsGroup.create(posX,-50,'atlas.chilimBalam',obstaclesNames[Math.round(Math.random()*(obstaclesNames.length - 1))])
            obj.tag = 'obstacle'
            obj.active = true
        }
        
         
    }
    
	return {
		assets: assets,
		name: "chilimBalam",
		create: function(event){
            
            leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(0,0,'atlas.chilimBalam','fondo')
            
            loadSounds()
			initialize()            
            
            objectsGroup = game.add.group()
            sceneGroup.add(objectsGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX
            characterGroup.y = game.world.height - 175
            sceneGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "mascot");
            buddy.scale.setTo(0.2,0.2)
            characterGroup.add(buddy)
            
            var cup = characterGroup.create(0,-175,'atlas.chilimBalam','vaso')
            cup.anchor.setTo(0.5,0.5)
            characterGroup.cup = cup
            
            buddy.setAnimationByName(0, "IDLE", true);
            buddy.setSkinByName('normal');
            
            createTime()
            createPointsBar()
            createHearts()
            animateScene()
            
            /*var button1 = this.game.add.button(20, 20, 'button1', function () {
                button1.scale.setTo(0.5,0.5)
                buddy.setSkinByName('normal');
                buddy.setToSetupPose();
            });
            button1.scale.setTo(0.5,0.5)

            var button1 = this.game.add.button(20, 145, 'button1', function () {
                buddy.setSkinByName('normal_a');
                buddy.setToSetupPose();
            });
            button1.scale.setTo(0.5,0.5)*/
            
            createControls()
            
            objectsGroup.timer = game.time.create(false);
            objectsGroup.timer.loop(throwTime, dropObjects, this);
            objectsGroup.timer.start()

            timer.start()
            
            
		},
        preload:preload,
        update,update,
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()