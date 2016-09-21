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
    
    var SPEED = 2
    
	var sceneGroup = null
    var answersGroup = null
    var pointsGroup = null
    var questionText = null
    var questionGroup = null
    var purpleBack = null
    var gameActive = true
    var valuesList = null
    var moveLeft, moveRight
    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        moveLeft = false
        moveRight = false
        
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
    
    function endGame(){
        gameActive = false
        

		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("resultInstafit")
			resultScreen.setScore(checkNumbers(), valuesList)

			sceneloader.show("resultInstafit")
		})
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
            buddy.scale.x = -0.3
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
            buddy.scale.x = 0.3
        })
         button2.events.onInputUp.add(function(){
            moveRight = false
        })
        
    }
    function update(){
        
        if(moveRight == true){
            buddy.x+=SPEED;
        }else if(moveLeft == true){
            buddy.x-=SPEED;
        }
    }
    
	return {
		assets: assets,
		name: "chilimBalam",
		create: function(event){
            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(0,0,'atlas.chilimBalam','fondo')
            
            loadSounds()
			initialize()            
            
            //createPoints()
            
            
            buddy = game.add.spine(game.world.centerX, game.world.height - 175, "mascot");
            buddy.scale.setTo(0.3,0.3)
            sceneGroup.add(buddy)
            
            game.physics.enable(buddy, Phaser.Physics.ARCADE);

            buddy.setAnimationByName(0, "IDLE", true);
            buddy.setSkinByName('normal');
            
            animateScene()
            
            var button1 = this.game.add.button(20, 20, 'button1', function () {
                button1.scale.setTo(0.5,0.5)
                buddy.setSkinByName('normal');
                buddy.setToSetupPose();
            });
            button1.scale.setTo(0.5,0.5)

            var button1 = this.game.add.button(20, 145, 'button1', function () {
                buddy.setSkinByName('normal_a');
                buddy.setToSetupPose();
            });
            button1.scale.setTo(0.5,0.5)
            
            createControls()
            
		},
        preload:preload,
        update,update,
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()