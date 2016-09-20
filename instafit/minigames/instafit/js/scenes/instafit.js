var instafit = function(){
    
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
                name: "atlas.instafit",
                json: "images/instafit/atlas.json",
                image: "images/instafit/atlas.png",
            },
            {
				name: 'atlas.ads',
				json: "../shared/images/ads/atlas.json",
				image: "../shared/images/ads/atlas.png"}
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

	var sceneGroup = null
    var answersGroup = null
    var pointsGroup = null
    var indexQuestion = null
    var questionText = null
    var questionGroup = null
    var purpleBack = null
    var gameActive = true
    var valuesList = null
    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        indexQuestion = 0
        valuesList = []
        gameActive = true
        
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
    
    function createQuestionGroup(){
        
        var qGroup = game.add.group()
        questionGroup.add(qGroup)
        
        var buttonsGroup = game.add.group()
        qGroup.add(buttonsGroup)
        
        var topImage = buttonsGroup.create(game.world.centerX, game.world.centerY - 200,'atlas.instafit','img' + (indexQuestion + 1))
        topImage.anchor.set(0.5,0.5)
        
        var fontStyle = {font: "25px VAGRounded", fill: "#ffffff", align: "center"}

        var topText = new Phaser.Text(sceneGroup.game, game.world.centerX, purpleBack.y + purpleBack.height * 0.24, QUESTIONS[indexQuestion], fontStyle)
        topText.anchor.setTo(0.5, 0.5)
        qGroup.add(topText)
        
        var buttonColors = ['Verde','Rosa','Azul','Amarillo']
        
        var pivotX = game.world.centerX
        var pivotY = purpleBack.y + 145
        
        var qValues = [1,2,3,4]
        var orderIndex = [0,1,2,3]
        Phaser.ArrayUtils.shuffle(orderIndex)
        for(var i = 0; i<buttonColors.length;i++){
            
            var questionImg = game.add.group()
            questionImg.x = pivotX
            questionImg.y = pivotY
            qGroup.add(questionImg)
            
            var img = questionImg.create(0,0, 'atlas.instafit','respuesta' + buttonColors[i])
            img.width = game.world.width
            img.anchor.setTo(0.5,0.5)
            
            img.value = qValues[orderIndex[i]]
            
            var fontStyle = {font: "23px Arial", fill: "#ffffff", align: "center"}

            var topText = new Phaser.Text(sceneGroup.game, 0,0, ANSWERS[indexQuestion][orderIndex[i]], fontStyle)
            topText.anchor.setTo(0.5, 0.5)
            questionImg.add(topText)
            
            pivotY = pivotY + img.height * 0.94
            
            img.inputEnabled = true
			img.events.onInputDown.add(onTapButton)
        }
        
        return qGroup
                
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }
    function createPoints() {
        
        var pivotX = game.world.centerX - 153
        var pivotY = 130
        
        var pointNames = ['gris','claro','azul']
        for (var i = 0; i<7;i++){
            
            var pGroup = game.add.group()
            pGroup.x = pivotX
            pGroup.y = pivotY
            pointsGroup.add(pGroup)
            
            for(var u = 0;u<3;u++){
                var point = pGroup.create(0,0,'atlas.instafit','b-' + pointNames[u])
                point.anchor.setTo(0.5,0.5)
            }
            
            changeImage(0,pGroup)
            
            pivotX += 50
            
            
        }
        changeImage(2,pointsGroup.children[indexQuestion])
    }
    
    
    
	return {
		assets: assets,
		name: "instafit",
		create: function(event){
            
			sceneGroup = game.add.group()
            
            loadSounds()
			initialize()            
            
            var topBanner = sceneGroup.create(game.world.centerX, 0, 'atlas.instafit','Banner')
            topBanner.anchor.set(0.5,0)
            
            purpleBack = sceneGroup.create(game.world.centerX, game.world.centerY - 75,'atlas.instafit','fondoMorado')
            purpleBack.anchor.set(0.5,.5)
            purpleBack.width = game.world.width
            
            pointsGroup = game.add.group()
            sceneGroup.add(pointsGroup)
            
            createPoints()
            
            questionGroup = game.add.group()
            sceneGroup.add(questionGroup)
            
            createQuestionGroup()

            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()