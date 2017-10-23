
var soundsPath = "../../shared/minigames/sounds/"
var imagesPath = "../../shared/minigames/images/"
var gameScene = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/game/atlas.json",
                image: "images/game/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
			{	name: "pop",
				file: soundsPath + "flipCard.mp3"},
            {
                name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {
                name: "flip",
				file: soundsPath + "cut.mp3"},
            {
                name: "correct",
				file: soundsPath + "magic.mp3"},
            {
                name: "inicio",
				file: soundsPath + "pop.mp3"},
			
		],
    }
    
        
    var lives = null
    var puntos = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
	var barratiempo
    var tiempovel=6000
    var tiempodeaparecer
    var pergaminocreado
    var empezado=false
    var fondog
    var c
    var act_sonido
    
    
    //los botones
    
    var tiles=new Array(8)
    var buttonNames = ['btn1','btn2','btn3','btn4','btn5','btn6','btn7','btn8','btn9']
    
    //cuadros donde se pondran los numeros seleccionados
    var cuadrofalt1, cuadrofalt2, cuadrofalt3
    
    //booleanos de botones y bordes de los botones
    var bordes=new Array(8)
    var activados=new Array(8)
    
    //variables del control del juego
    var numeros=new Array(8)
    var cuantossel
    var seleccionados
    var numerores,numero1,numero2,numero3
    var aleatorio1,aleatorio2,aleatorio3
    var signo1,signo2,signores
    var numerosencas1,numerosencas2,numerosencas3
    var scaleSpine = 0.55
    var topHeight
    var btn_sound
    
    //Animacion de -1  y +1
    
    var menos,mas,minus,plus
    
    //animaciones
    var tweentiles=new Array(8)
    var l

    
    //estilo de los numeros de botones, de vidas y puntos
    var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
    var fontStyle2 = {font: "70px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
    var fontStyle3 = {font: "70px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
    
    //estilo de signos y resultados
    var fontStyle10 = {font: "50px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
    var fontStyle11 = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
    
    //variables de animaciones
    
    var animationName,buddy
     
    
    var num10
    var nums=new Array(8)
      
    
    //Para cargar los sonidos
	function loadSounds(){
		sound.decode(assets.sounds)
        
	}

    //Aqui se inicializan las variables
	function initialize(){

        game.stage.backgroundColor = "#000000"
        lives = 5
        seleccionados=0
        puntos=0
        
        loadSounds()
        numerores=0
        tiempovel=6000
        c=0
        l=0
        tiempodeaparecer=0
        activados[0]=false
        act_sonido=true
        
	}
    
    //Aqui se quitan las vidas si el usuario no contesto correctamente
    
    function missPoint(){
        
        sound.play("wrong")
        
		seleccionados=0
        
        
        
        
        
        topHeight = game.world.height * 0.8 
        
        buddy.scale.setTo(scaleSpine,scaleSpine)
        buddy.setAnimationByName(1, "LOSE");
        buddy.setSkinByName('normal');     
        
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: .9,y:.9}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        //Posicionar menos en el texto
        
        minus= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle)
        minus.x =  90
        minus.y = game.world.centerY
        fondog.text = minus
        minus.setText("-1")
        heartsGroup.add(minus)
        
        
        //Animacion de -1
        
        game.add.tween(minus).from({y:40}, game.world.centerY+800, Phaser.Easing.Linear.In, true);
        var minustween=game.add.tween(minus).to({alpha:0}, 600, "Linear", true, 100);
        
        minustween.onComplete.add(function(){
        
        game.add.tween(pergaminocreado.scale).to({x:0,y:.6}, 600, Phaser.Easing.Linear.Out, true, 100);
        game.add.tween(pergaminocreado).to({alpha:0}, 600, "Linear", true, 100);
        for(var k=0;k<9;k++){
            
            activados[k]=false
            tweentiles[k]=game.add.tween(tiles[k]).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true, 100);
            tweentiles[k]=game.add.tween(tiles[k].scale).to({x:.7,y:0}, 500, Phaser.Easing.Linear.Out, true, 100);
            bordes[k].alpha=false
        }
        

            
            tweentiempo=game.add.tween(barratiempo.scale).to({x:-11.5,y:.7}, 700, Phaser.Easing.Linear.Out, true, 100);
            tweentiempo.onComplete.add(function(){
                    
                    reiniciar()
                    seleccionados=0
                
                })
        })
            
            
        
        
           
            
        
        
        
        
        
        
       
                
                
        
        
        
        
    }
    
    //Aqui se agregan los puntos si el usuario tuvo aciertos
    
    function addPoint(number){
        
        puntos++
        
        if(puntos%2==0)tiempovel-=360
        
        sound.play("correct")
        pointsBar.number+=number;
        pointsBar.text.setText(puntos)
        
        
        
        
        
        seleccionados=0
        
        topHeight = game.world.height * 0.8 
        
        buddy.scale.setTo(scaleSpine,scaleSpine)
        buddy.setAnimationByName(1, "WIN");
        buddy.setSkinByName('normal'); 
		
		 //Posicionar mas en el texto
        
        plus= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle)
        plus.x = game.world.width-93
        plus.y = game.world.centerY
        fondog.text = plus
        plus.setText("+1")
        sceneGroup.add(plus)
        plus.alpha=1
        
        
        //Animacion de +1
        
        game.add.tween(plus).from({y:0}, game.world.centerY+800, Phaser.Easing.Linear.In, true);
        var plustween=game.add.tween(plus).to({alpha:0}, 600, "Linear", true, 100);
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: .9,y:.9}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
            
            
        })
        
        plustween.onComplete.add(function(){
        
        game.add.tween(pergaminocreado.scale).to({x:0,y:.6}, 600, Phaser.Easing.Linear.Out, true, 100);
        game.add.tween(pergaminocreado).to({alpha:0}, 600, "Linear", true, 100);
        
            for(var k=0;k<9;k++){
            
            activados[k]=false
            tweentiles[k]=game.add.tween(tiles[k]).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true, 100);
            tweentiles[k]=game.add.tween(tiles[k].scale).to({x:.7,y:0}, 500, Phaser.Easing.Linear.Out, true, 100);
            bordes[k].alpha=false
        }
            
            tweentiempo=game.add.tween(barratiempo.scale).to({x:-11.5,y:.7}, 700, Phaser.Easing.Linear.Out, true, 100);
            tweentiempo.onComplete.add(function(){
                    
                    reiniciar()
                    seleccionados=0
                
                })
        })
        
        
        
    }
    
    //Aqui se crean y se acomodan los puntos en la pantalla
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    //Aqui se crean y se acomodan las vidas en la pantalla
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)
        

        var heartImg = group.create(0,0,'atlas.game','life_box')

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
    
    //Esto sucede cuando pierde todas sus vidas
    
    function stopGame(win){
        
		//sound.play("wrong")
		//sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 100)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, puntos,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
     
    //Aqui se carga el primer menu del juego, los sprites y la animacion del master
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/asianLoop2.mp3');
        
        
        
		game.load.image('howTo',"images/game/how" + localization.getLanguage() + ".png")
        
        
		game.load.image('buttonText',"images/game/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/game/introscreen.png")
        game.load.image('fondo',"images/game/fondo.png")
        game.load.image('reloj',"images/game/clock.png")
        game.load.image('barra',"images/game/bar.png")
        game.load.image('cuadroinv',"images/game/numFaltante.png")
        
        //Cargar viejito
        game.load.spine('master', imagesPath + "spines/skeleton.json");
    
        //cuadros de numeros
        
        game.load.image('cclear',"images/game/panelClear.png")
        game.load.image('cdark',"images/game/panelDark.png")
        
        //caragar boton de sonido
        
        game.load.image('on',"images/game/audio_on.png")
        game.load.image('off',"images/game/audio_off.png")
        
        //borde numeros seleccionados
        
        
        game.load.image('borde',"images/game/marco.png")
        
        //Pergamino
        
        game.load.image('pergamino',"images/game/pergamino.png")
        
        
        
        
        
        
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    //Aqui manejamos el juego despues de su respuesta o despues de que termina el tiempo esta viene desde missPoint y addPoint
    
    function reiniciar(){
    
        numero1=0
        numero2=0
        numero3=0
        numerores=0
        
        aleatorio1=0
        aleatorio2=0
        aleatorio3=0
        
        if(lives == 0){
            stopGame(false)
        }
        
        //Aqui veo los cuadros dependiendo de cuantos hay para agregar o desaparecer cuadros
        
       
         if(cuantossel==2){
                
                
                pergaminocreado.removeChild(cuadrofalt1)
                pergaminocreado.removeChild(cuadrofalt2)
                pergaminocreado.removeChild(signo1)
                pergaminocreado.removeChild(signores)
                pergaminocreado.removeChild(numerosencas1)
                pergaminocreado.removeChild(numerosencas2)
                
             
             cuadrofalt1.alpha=0
             cuadrofalt2.alpha=0
                
                
            }
            if(cuantossel==3){
                
                pergaminocreado.removeChild(cuadrofalt1)
                pergaminocreado.removeChild(cuadrofalt2)
                pergaminocreado.removeChild(cuadrofalt3)
                pergaminocreado.removeChild(signo1)
                pergaminocreado.removeChild(signo2)
                pergaminocreado.removeChild(signores)
                pergaminocreado.removeChild(numerosencas1)
                pergaminocreado.removeChild(numerosencas2)
                pergaminocreado.removeChild(numerosencas3)
             
             cuadrofalt1.alpha=0
             cuadrofalt2.alpha=0
             cuadrofalt3.alpha=0
                
            }
        
        
        while(numerores==0 || numerores>9){
            for(var i=0;i<9;i++){
        
            numeros[i]=parseInt(Math.random()*9+1);
            
             }
            
             
        while(aleatorio1==aleatorio2 || aleatorio1 == aleatorio3 || aleatorio2==aleatorio3){
            aleatorio1=parseInt(Math.random()*8+1);
            aleatorio3=parseInt(Math.random()*8+1);
            aleatorio2=parseInt(Math.random()*8+1);
            }
            
            
            cuantossel=parseInt(Math.random()*2+2)
            
            
            
            if(cuantossel==2)numerores=numeros[aleatorio1]+numeros[aleatorio2]
            if(cuantossel==3)numerores=numeros[aleatorio1]+numeros[aleatorio2]+numeros[aleatorio3]
        
        }
        
        
         
       
            
            if(cuantossel==2){
                
                cuadrofalt1=fondog.create(game.world.x-280,game.world.y-70,'cuadroinv')
                cuadrofalt1.scale.setTo(1,1)
                pergaminocreado.addChild(cuadrofalt1)
                
                
                cuadrofalt2=fondog.create(game.world.x-120,game.world.y-70,'cuadroinv')
                cuadrofalt2.scale.setTo(1,1)
                pergaminocreado.addChild(cuadrofalt2)
                
                
                signo1= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle2)
                signores= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle2)
               
                signo1.x =  pergaminocreado.x/window.innerWidth-175
                signo1.y = pergaminocreado.y/window.innerHeight-70
                fondog.text = signo1
                signo1.setText("+")
                fondog.add(signo1)
                pergaminocreado.addChild(signo1)
                
                signores.x =  pergaminocreado.x/window.innerWidth-20
                signores.y = pergaminocreado.y/window.innerHeight-70
                fondog.text = signores
                signores.setText("=")
                fondog.add(signores)
                pergaminocreado.addChild(signores)
                
                
                
            }
            if(cuantossel==3){
                
               cuadrofalt1=fondog.create(game.world.x-270,game.world.y-65,'cuadroinv')
                cuadrofalt1.scale.setTo(.8,.8)
                pergaminocreado.addChild(cuadrofalt1)
                
                
                cuadrofalt2=fondog.create(game.world.x-170,game.world.y-65,'cuadroinv')
                cuadrofalt2.scale.setTo(.8,.8)
                pergaminocreado.addChild(cuadrofalt2)
                
                cuadrofalt3=fondog.create(game.world.x-70,game.world.y-65,'cuadroinv')
                cuadrofalt3.scale.setTo(.8,.8)
                pergaminocreado.addChild(cuadrofalt3)
                
                
                
                //signos
                
                signo1= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle10)
                signo2= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle10)
                signores= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle10)
                
                
                signo1.x =  pergaminocreado.x/window.innerWidth-203
                signo1.y = pergaminocreado.y/window.innerHeight-60
                fondog.text = signo1
                signo1.setText("+")
                fondog.add(signo1)
                pergaminocreado.addChild(signo1)
                
                signo2.x =  pergaminocreado.x/window.innerWidth-103
                signo2.y = pergaminocreado.y/window.innerHeight-60
                fondog.text = signo2
                signo2.setText("+")
                fondog.add(signo2)
                pergaminocreado.addChild(signo2)
                
                signores.x =  pergaminocreado.x/window.innerWidth
                signores.y = pergaminocreado.y/window.innerHeight-60
                fondog.text = signores
                signores.setText("=")
                fondog.add(signores)
                pergaminocreado.addChild(signores)
                
                
            }
        
            
        
        
        //Aqui iran los resets de los textos numericos
        
        
        for (var f=0;f<9;f++){
        
        nums[f].setText(numeros[f])
        
            
        game.add.tween(tiles[f]).to({alpha:1}, 600, "Linear", true, 100);
            
        }
        num10.setText(numerores)
        
        game.add.tween(pergaminocreado).to({alpha:1}, 600, "Linear", true, 100); 
        
        
        var tweenPergamino=game.add.tween(pergaminocreado.scale).to({x:.7,y:.6}, 300, Phaser.Easing.Linear.Out, true, 100);
        
        sound.play("flip")
        
        
        
         tweenPergamino.onComplete.add(function(){
                    
             
            for(var m=0;m<9;m++){
                
                tiempodeaparecer=tiempodeaparecer+200
                popObject(tiles[m],tiempodeaparecer)
                
            }
            
			sound.play("pop")
             
                })
            
        
    }
    
    //Aqui se crea la primer pantalla
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        
        //Aqui empieza la funcion de cuando se da clic en la pantalla de instrucciones
        rect.events.onInputDown.add(function(){
        rect.inputEnabled = false
            
        
            sound.play("inicio")
            game.add.tween(btn_sound).to({alpha:.9}, 600, "Linear", true, 100);
            
            //Desde antes ordeno los numeros
            
            numero1=0
            numero2=0
            numero3=0
            
            
            while(numerores==0 || numerores>9){
            for(var i=0;i<9;i++){
        
            numeros[i]=parseInt(Math.random()*9+1);
            
             }
            
             
        while(aleatorio1==aleatorio2 || aleatorio1 == aleatorio3 || aleatorio2==aleatorio3){
            aleatorio1=parseInt(Math.random()*8+1);
            aleatorio3=parseInt(Math.random()*8+1);
            aleatorio2=parseInt(Math.random()*8+1);
            }
            
            
            cuantossel=parseInt(Math.random()*2+2)
            
            
            
            if(cuantossel==2)numerores=numeros[aleatorio1]+numeros[aleatorio2]
            if(cuantossel==3)numerores=numeros[aleatorio1]+numeros[aleatorio2]+numeros[aleatorio3]
        
        }
            
            //Aqui acomodamos los textos y los emparentamos
            
            
        for(var a=0; a<9;a++){ 
            
        if((a+1)%2==0){  
        nums[a] = new Phaser.Text(fondog.game, 0, 0, "0", fontStyle3)
        }else{
         nums[a] = new Phaser.Text(fondog.game, 0, 0, "0", fontStyle2)   
        }
                nums[a].x = tiles[a].x/window.innerWidth-50
                nums[a].y = tiles[a].y/window.innerHeight-70
                fondog.text = numeros[a]
                nums[a].setText(numeros[a])
                fondog.add(nums[a])
                tiles[a].addChild(nums[a])
        
        }
            
                num10 = new Phaser.Text(fondog.game, 0, 0, "0", fontStyle2)
                num10.x =  pergaminocreado.x/window.innerWidth+35
                num10.y = pergaminocreado.y/window.innerHeight-70
                fondog.text = num10
                num10.setText(numerores)
                fondog.add(num10)
                pergaminocreado.addChild(num10)
            
            
            //Aqui veo los cuadros dependiendo de cuantos hay para seleccionar
            
            if(cuantossel==2){
                
                cuadrofalt1=fondog.create(game.world.x-280,game.world.y-70,'cuadroinv')
                cuadrofalt1.scale.setTo(1,1)
                pergaminocreado.addChild(cuadrofalt1)
                
                
                cuadrofalt2=fondog.create(game.world.x-120,game.world.y-70,'cuadroinv')
                cuadrofalt2.scale.setTo(1,1)
                pergaminocreado.addChild(cuadrofalt2)
                
                //signos
                
                signo1= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle2)
                signores= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle2)
                
                
                signo1.x =  pergaminocreado.x/window.innerWidth-175
                signo1.y = pergaminocreado.y/window.innerHeight-70
                fondog.text = signo1
                signo1.setText("+")
                fondog.add(signo1)
                pergaminocreado.addChild(signo1)
                
                signores.x =  pergaminocreado.x/window.innerWidth-20
                signores.y = pergaminocreado.y/window.innerHeight-70
                fondog.text = signores
                signores.setText("=")
                fondog.add(signores)
                pergaminocreado.addChild(signores)
                
                
                
                
            }
            if(cuantossel==3){
                
                cuadrofalt1=fondog.create(game.world.x-270,game.world.y-65,'cuadroinv')
                cuadrofalt1.scale.setTo(.8,.8)
                pergaminocreado.addChild(cuadrofalt1)
                
                
                cuadrofalt2=fondog.create(game.world.x-170,game.world.y-65,'cuadroinv')
                cuadrofalt2.scale.setTo(.8,.8)
                pergaminocreado.addChild(cuadrofalt2)
                
                cuadrofalt3=fondog.create(game.world.x-70,game.world.y-65,'cuadroinv')
                cuadrofalt3.scale.setTo(.8,.8)
                pergaminocreado.addChild(cuadrofalt3)
                
                
                //signos
                
                signo1= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle10)
                signo2= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle10)
                signores= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle10)
                
                
                signo1.x =  pergaminocreado.x/window.innerWidth-203
                signo1.y = pergaminocreado.y/window.innerHeight-60
                fondog.text = signo1
                signo1.setText("+")
                fondog.add(signo1)
                pergaminocreado.addChild(signo1)
                
                signo2.x =  pergaminocreado.x/window.innerWidth-103
                signo2.y = pergaminocreado.y/window.innerHeight-60
                fondog.text = signo2
                signo2.setText("+")
                fondog.add(signo2)
                pergaminocreado.addChild(signo2)
                
                signores.x =  pergaminocreado.x/window.innerWidth
                signores.y = pergaminocreado.y/window.innerHeight-60
                fondog.text = signores
                signores.setText("=")
                fondog.add(signores)
                pergaminocreado.addChild(signores)
                
                
                
            }
            
            
            //Aqui corren las animaciones
            
            
             
           
            
            game.add.tween(pergaminocreado).to({alpha:1}, 600, "Linear", true, 100); 
            var tweenPergamino=game.add.tween(pergaminocreado.scale).to({x:.7,y:.6}, 300, Phaser.Easing.Linear.Out, true, 100);
            
            sound.play("flip")
            
          tweenPergamino.onComplete.add(function(){
              
              for(var m=0;m<9;m++){
                tiempodeaparecer=200+tiempodeaparecer
                popObject(tiles[m],tiempodeaparecer)
                
            }
            
			sound.play("pop")
                    
                })
            
             

            
            
            

            
            
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                
                
            })
            
        
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY,'atlas.game','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY-180,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
        
            
		}
		
		var inputLogo = overlayGroup.create(game.world.centerX+15,game.world.centerY+130,'atlas.game',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX+5, inputLogo.y+ + inputLogo.height * 1.5,'atlas.game','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX+5, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
        
        
    }
    
    
    //Aqui se crea el fondo
	function createBackground(){
		
        fondog = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(fondog)
        
        
        
        
         
        topHeight = game.world.height * 0.8 
        
               
            
        btn_sound=fondog.game.add.button(game.world.width-250,10,'on')
        btn_sound.scale.setTo(.45,.45)
        btn_sound.events.onInputDown.add(act_musica)
        btn_sound.alpha=.2
        
        
        var backg=fondog.create(game.world.centerX,game.world.centerY,'fondo')
        backg.width=game.world.width
        backg.height=game.world.height
        backg.anchor.setTo(.5,.5)
        var reloj=fondog.create(game.world.centerX-180,game.world.centerY-80,'reloj')
        reloj.anchor.setTo(.1,.1)
       
        
        barratiempo=fondog.create(game.world.centerX-170,game.world.centerY-9,'barra')
        barratiempo.anchor.setTo(1,1)
        barratiempo.scale.setTo(-11.5,.7)
        
        buddy = fondog.game.add.spine(game.world.centerX-90,topHeight * 0.4, "master");
        buddy.scale.setTo(scaleSpine,scaleSpine)
        buddy.setAnimationByName(0, "IDLE",true);
        buddy.setSkinByName('normal');
        fondog.add(buddy) 
        
        pergaminocreado=fondog.create(game.world.centerX+70,game.world.centerY-130,'pergamino')
        pergaminocreado.anchor.setTo(.7,.6) 
        pergaminocreado.scale.setTo(0,.6)
        pergaminocreado.alpha=0
          
        
        
        //aqui esta el rectangulo del fondo
        
         var rect2 = new Phaser.Graphics(game)
        
        rect2.beginFill(0x000000)
        rect2.drawRoundedRect(game.world.centerX-235,game.world.centerY+20,470, 457,45)
        rect2.alpha = 0.7
        rect2.endFill()
        fondog.add(rect2)
         
        
        
        for(var a=0; a<9;a++){ 
            
       if((a+1)%2==0){
        
           
           
        if(a==3){
            tiles[a]=fondog.game.add.button(game.world.centerX-138,game.world.y+760,'cdark')
            bordes[a]=fondog.create(game.world.centerX-135,game.world.y+760,'borde')
            tiles[a].events.onInputDown.add(botonfunc)
            tiles[a].active = true
            tiles[a].tag = buttonNames[a]
        }
        if(a==1){
            tiles[a]=fondog.game.add.button(game.world.x+160+tiles[a-1].x,game.world.centerY+115,'cdark')
            bordes[a]=fondog.create(game.world.x+163+tiles[a-1].x,game.world.centerY+115,'borde')
            tiles[a].events.onInputDown.add(botonfunc)
            tiles[a].active = true
            tiles[a].tag = buttonNames[a]
            
        }
        if(a==5){
            tiles[a]=fondog.game.add.button(game.world.x+160+tiles[a-1].x,game.world.y+760,'cdark')
            bordes[a]=fondog.create(game.world.x+163+tiles[a-1].x,game.world.y+760,'borde')
            tiles[a].events.onInputDown.add(botonfunc)
            tiles[a].active = true
            tiles[a].tag = buttonNames[a]
            }
        if(a==7){
            tiles[a]=fondog.game.add.button(game.world.x+160+tiles[a-1].x,game.world.y+920,'cdark')
           bordes[a]=fondog.create(game.world.x+163+tiles[a-1].x,game.world.y+920,'borde')
            tiles[a].events.onInputDown.add(botonfunc)
            tiles[a].active = true
            tiles[a].tag = buttonNames[a]
           }
       }else{
        
        if(a==0){
        tiles[a]=fondog.game.add.button(game.world.centerX-138,game.world.centerY+115,'cclear')
        bordes[a]=fondog.create(game.world.centerX-135,game.world.centerY+115,'borde')
        tiles[a].events.onInputDown.add(botonfunc)
        tiles[a].active = true
        tiles[a].tag = buttonNames[a]
        }
        if(a==6){
        tiles[a]=fondog.game.add.button(game.world.centerX-138,game.world.y+920,'cclear')
        bordes[a]=fondog.create(game.world.centerX-135,game.world.y+920,'borde')
        tiles[a].events.onInputDown.add(botonfunc)
        tiles[a].active = true
        tiles[a].tag = buttonNames[a]
            } 
           if(a==2){
        
            tiles[a]=fondog.game.add.button(game.world.x+160+tiles[a-1].x,game.world.centerY+115,'cclear')
            bordes[a]=fondog.create(game.world.x+163+tiles[a-1].x,game.world.centerY+115,'borde')
            tiles[a].events.onInputDown.add(botonfunc)
            tiles[a].active = true
            tiles[a].tag = buttonNames[a]
            } 
           if(a==4){
        
               tiles[a]=fondog.game.add.button(game.world.x+160+tiles[a-1].x,game.world.y+760,'cclear')
               bordes[a]=fondog.create(game.world.x+163+tiles[a-1].x,game.world.y+760,'borde')
               tiles[a].events.onInputDown.add(botonfunc)
               tiles[a].active = true
               tiles[a].tag = buttonNames[a]
            } 
           if(a==8){
        
               tiles[a]=fondog.game.add.button(game.world.x+160+tiles[a-1].x,game.world.y+920,'cclear')
               bordes[a]=fondog.create(game.world.x+163+tiles[a-1].x,game.world.y+920,'borde')
               tiles[a].events.onInputDown.add(botonfunc)
               tiles[a].active = true
               tiles[a].tag = buttonNames[a]
               
            } 
       }     
        tiles[a].anchor.setTo(.7,.7)
        tiles[a].scale.setTo(.7,0)
        bordes[a].anchor.setTo(.7,.7)
        bordes[a].scale.setTo(.7,.7)
        bordes[a].alpha=0
            
            
        }
         
        
	}
    
    
	//funciones de botones (Tienen orden de color no por casilla)
 
    function botonfunc(obj){
        
        
        
        for(var d=0;d<9;d++){
        
        if(obj.tag==buttonNames[d] && !activados[d] && empezado && seleccionados<cuantossel){
                
            
            sound.play("pop")
            
            game.add.tween(nums[d].anchor).to({x:.285,y:.285}, 100, Phaser.Easing.Linear.Out, true, 100);
            
         bordes[d].alpha=1
        tweentiles[d]=game.add.tween(tiles[d].anchor).to({x:.9,y:.9}, 200, Phaser.Easing.Linear.Out, true, 100);
        game.add.tween(tiles[d].scale).to({x:.4,y:.4}, 200, Phaser.Easing.Linear.Out, true, 100);
        tweentiles[d].onComplete.add(function(){
                    
        tweentiles[d]=game.add.tween(tiles[d].anchor).to({x:.7,y:.7}, 200, Phaser.Easing.Linear.Out, true, 100);
        game.add.tween(tiles[d].scale).to({x:.7,y:.7}, 200, Phaser.Easing.Linear.Out, true, 100);
        game.add.tween(nums[d].anchor).to({x:0,y:0}, 200, Phaser.Easing.Linear.Out, true, 100);      
            
            
            
            if(numero1!=0 && numero2!=0){
                numero3=numeros[d]
                
                numerosencas3= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle11)
                numerosencas3.x =  cuadrofalt3.x/window.innerWidth-42
                numerosencas3.y = cuadrofalt3.y/window.innerHeight-60
                numerosencas3.anchor.setTo(.1,-.05)
                fondog.text = numerosencas3
                numerosencas3.setText(numeros[d])
                fondog.add(numerosencas3)
                game.add.tween(numerosencas3.scale).from({x:0,y:1}, 50, Phaser.Easing.Linear.Out, true, 100);
                pergaminocreado.addChild(numerosencas3)
                
                                         
            }
            if(numero1!=0 && numero2==0){
                numero2=numeros[d]
                
                numerosencas2= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle11)
                if(cuantossel==2){
                numerosencas2.x =  cuadrofalt2.x/window.innerWidth-100
                numerosencas2.anchor.setTo(-.4,-.05)
                }
                else {
                numerosencas2.x =  cuadrofalt2.x/window.innerWidth-145
                numerosencas2.anchor.setTo(.1,-.05)
                }
            
                numerosencas2.y = cuadrofalt2.y/window.innerHeight-60
                fondog.text = numerosencas3
                numerosencas2.setText(numeros[d])
                fondog.add(numerosencas2)
                game.add.tween(numerosencas2.scale).from({x:0,y:1}, 100, Phaser.Easing.Linear.Out, true, 100);
                pergaminocreado.addChild(numerosencas2)
                
            }
            if(numero1==0){
                numero1=numeros[d]
                
                numerosencas1= new Phaser.Text(fondog.game, 0, 0, "0", fontStyle11)
                numerosencas1.x =  cuadrofalt1.x/window.innerWidth-240
                numerosencas1.y = cuadrofalt1.y/window.innerHeight-60
                numerosencas1.anchor.setTo(.3,-.05)
                fondog.text = numerosencas3
                numerosencas1.setText(numeros[d])
                fondog.add(numerosencas1)
                game.add.tween(numerosencas1.scale).from({x:0,y:1}, 100, Phaser.Easing.Linear.Out, true, 100);
                pergaminocreado.addChild(numerosencas1)
                
            }
            
        })
            seleccionados++
            activados[d]=true
            break;
        }
        
    }
        
    
    }
    
    
    
    function act_musica(){
        
    
        
        if(act_sonido==true){
            
        btn_sound.loadTexture('off',0)
        act_sonido=false
        game.sound.mute=true
            
        }else{
            
        btn_sound.loadTexture('on',0)
        act_sonido=true
        game.sound.mute=false
        }
        
        
    }
    
    
	function update(){
        
        
        
        
         
        if(cuantossel==2 && seleccionados==2 && numerores==numero1+numero2 && numero2!=0){
            
            tweentiempo.stop()
            empezado=false
            seleccionados=0
            addPoint()
            
            
        }
        
        if(cuantossel==3 && seleccionados==3 && numerores==numero1+numero2+numero3 && numero3!=0){
            
            tweentiempo.stop()
            empezado=false
            seleccionados=0
            addPoint()
            
        }
        
        if(cuantossel==2 && seleccionados==2 && numerores!=numero1+numero2 && numero2!=0){
            
            tweentiempo.stop()
            empezado=false
            seleccionados=0
            missPoint()
            
        }
        
        
        if(cuantossel==3 && seleccionados==3 && numerores!=numero1+numero2+numero3 && numero3!=0){
            
            tweentiempo.stop()
            empezado=false
            seleccionados=0
            missPoint()
        }

	}
	
	
     function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("flip")
            
            game.add.tween(obj.scale).to({x:.7,y:.7}, 300, Phaser.Easing.Linear.Out, true, 100);
            
            if(obj.tag=="btn9"){
                
                
                tiempodeaparecer=0
                tweentiempo=game.add.tween(barratiempo.scale).to({x:0,y:.7}, tiempovel, Phaser.Easing.Linear.Out, true, 100);
                 empezado=true
                
                tweentiempo.onComplete.add(function(){
                    
        
                    if(numerores==numero1+numero2+numero3){
            
                    empezado=false
                    seleccionados=0
                    addPoint()
            
                    }
        
        
                    if(numerores!=numero1+numero2+numero3){
            
                    empezado=false
                    seleccionados=0
                    missPoint()
                    }
                    
                })
                
                
            }
            
            l++
        },this)
         
         
    }
  
    
   
	
	
	return {
		
		assets: assets,
		name: "gameScene",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
                       			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
            spaceSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			       
            createBackground()
			createPointsBar()
			createHearts()
            createOverlay()
            
            
            
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()