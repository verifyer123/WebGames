var soundsPath = '../../shared/minigames/sounds/'
var ollasLocas = function(){
    assets = {
        atlases: [
            {   
                name: "atlas.ollas",
                json: "images/ollas/atlas.json",
                image: "images/ollas/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "splash",
				file: soundsPath + "explode.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
			{	name: "okTut",
				file: soundsPath + "pop.mp3"},
            
		],
	}
    

    
    var gameIndex = 3
    var reviewComic = false
    var characterGroup = null
    var pointsBar = null
    var groupButton = null
    var sceneGroup = null
    var groundGroup = null
    var answersGroup = null
    var pointsGroup = null
    var gameActive = null
    var marioSong = null
    var lives = null
    var gameStart = false
    var particlesGroup
    var particlesUsed
    var startedGame=false
    var estufa
    var scaleSpine=2.5
    var moveFirst=0
    var startPlaying=false
    var randomPots
    var cantMove=false
    var correctParticle, wrongParticle
    var splashWindow
    var limitToler
    var control
    
    var btn1,btn2,btn3,btn4,Cover
    var dificultyTime, dificultyHM
    
    var ollas=new Array(6)
    var ollasActivadas=new Array(6)
    var tiempoOllas=new Array(6)
    var posicionesJugador=new Array(5)
    var primerGame=false
    var keyPressed, keyPressed2, keyPressed3, keyPressed4
    
    var btn1,btn2,btn3,btn4,btn5
    
    var posicionActual=0
    
    var player=null
    
    var contTime=500
    
    var player
	
    var jumpTimer = 0
   
    var skinTable
    var heartsGroup = null 
    
	
	var back1,back2
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
	function initialize(){
        game.stage.backgroundColor = "#CFD9FF"
        gameActive = false
        startedGame=false
        primerGame=false
        gameStart=false
        moveFirst=0
        keyPressed=false
        keyPressed2=false
        keyPressed3=false
        keyPressed4=false
        startPlaying=false
        cantMove=false
        lives = 3
        dificultyTime=500
        dificultyHM=1
        pivotObjects = 0
        
        for(var i=0; i<ollas.length;i++)
        {
            
            //ollas[i]=spine
            ollasActivadas[i]=false
            tiempoOllas[i]=500
        }
        
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
    } 
    
    
    function preload() {
        game.stage.disableVisibilityChange = false;
		buttons.getImages(game)

        game.load.spine('pots', "images/spines/pots.json");
        
        //game.load.spritesheet('bMonster', 'images/ollas/sprites/bMonster.png', 193, 213, 23);
		
		game.load.image('howTo',"images/ollas/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/ollas/tutorial/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/ollas/tutorial/introscreen.png")
		
		game.load.image('comic1',"images/comic/1.png");
        game.load.image('comic2',"images/comic/2.png");
        game.load.image('comic3',"images/comic/3.png");
        game.load.image('comic4',"images/comic/4.png");
	
		game.load.audio('marioSong', soundsPath + 'songs/cooking_in_loop.mp3');
		
    }
	function createComic(totalPages){
        var comicGroup = game.add.group();
        var comicrect = new Phaser.Graphics(game)
        comicrect.beginFill(0x131033)
        comicrect.drawRect(0,0,game.world.width *2, game.world.height *2);
        comicrect.alpha = 1;
        comicrect.endFill();
        comicrect.inputEnabled = true;
        comicGroup.add(comicrect);
        var arrayComic = new Array;
        
        for(var i= totalPages-1;i>=0;i--){
            arrayComic[i] = comicGroup.create(0,0,"comic" + [i+1]);
            arrayComic[i].x = game.world.centerX;
            arrayComic[i].anchor.setTo(0.5,0);
        }
        var counterPage = 0;
        var button1 = new Phaser.Graphics(game);
        button1.beginFill(0xaaff95);
        button1.alpha = 0;
        button1.drawRect(0,0,100, 70);
        button1.x = game.world.centerX - 50;
        button1.y = game.height - button1.height*1.4;
        button1.endFill();
        button1.inputEnabled = true;
        comicGroup.add(button1); 
        var button2 = new Phaser.Graphics(game);
        button2.beginFill(0xaaff95);
        button2.alpha = 0;
        button2.drawRect(0,0,100, 70);
        button2.x = game.world.centerX - button2.width*1.1;
        button2.y = game.height - button2.height*1.4;
        button2.endFill();
        button2.inputEnabled = true;
        comicGroup.add(button2);
        button2.visible = false;
        button1.events.onInputDown.add(function(){
            sound.play("okTut");
            arrayComic[counterPage].alpha = 0;
            counterPage++;
                if(counterPage == 1){
                    button2.visible = true;
                    button1.x = button1.x + button1.width/1.5;
                }else{
                    if(counterPage == totalPages-1){
                        button2.visible = false;
                        button1.x = game.world.centerX - 50;
                        }else if(counterPage > totalPages-1){
							createOverlay();
                        game.add.tween(comicGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                                comicGroup.y = -game.world.height
                 
                                comicGroup.visible = false;
                                reviewComic = true;
                        });
                        }
                }  
        },this);        
        button2.events.onInputDown.add(function(){
            sound.play("okTut");
            counterPage--;
            arrayComic[counterPage].alpha = 1;
                if(counterPage == 0){
                    button2.visible = false;
                    button1.x = game.world.centerX - 50;
                }
        },this);
        
        sceneGroup.add(comicGroup);
    }
    
    
    function releaseButton(obj){
        
        groupButton.isPressed = false
        jumping = false
    }
    
    function createControls(){
        
		groupButton = game.add.group()
		sceneGroup.add(groupButton)
		
      
    }
	
	function createOverlay(){
        
		whiteFade = new Phaser.Graphics(game)
		whiteFade.beginFill(0xffffff)
		whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
		whiteFade.alpha = 0
		whiteFade.endFill()
		sceneGroup.add(whiteFade)
			
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("okTut")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
				startedGame=true
				overlayGroup.y = -game.world.height
				gameActive = true
				gameStart = true
                
                
            })
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.ollas','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		var offX = 0
		
		if(game.device.desktop){
			inputName = 'Desktop'
			offX = 13
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX + offX,game.world.centerY + 125,'atlas.ollas',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.ollas','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    

    function stopGame(win){
        
		marioSong.stop()
        
        sound.play("gameLose")
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            //amazing.saveScore(pointsBar.number)
			sceneloader.show("result")
		})
    }
    
    function addPoint(obj,part){
        
        var partName = part || 'star'
        sound.play("pop")
        
        //gameSpeed +=10
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        
        addNumberPart(pointsBar.text,'+1')
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
        if (lives >0){
            lives--;
        }
        
        
        if(lives==0){
            startPlaying=false
            cantMove=true
            stopGame()
        }
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        createTextPart('-1',heartsGroup.text)
        createPart('wrong',player)
        
    }
    

    function positionPlayer(){
        
        if(posicionActual==0){
            player.position.x=estufa.x+66   
            player.position.y=estufa.y-210
        }
        if(posicionActual==1){
            player.position.x=estufa.x+217     
            player.position.y=estufa.y-210
        }
        if(posicionActual==2){
            player.position.x=estufa.x+367
            player.position.y=estufa.y-175
        }
        if(posicionActual==3){
            player.position.x=estufa.x+66.5
            player.position.y=estufa.y-55
        }
        if(posicionActual==4){
            player.position.x=estufa.x+217     
            player.position.y=estufa.y-55
        }
        if(posicionActual==5){
            player.position.x=estufa.x+366.5     
            player.position.y=estufa.y-25
        }
    }
    
        function up(){
        
             if(posicionActual>=3)
            {
                posicionActual-=3  
            }
        }
        function down(){
            if(posicionActual<=2)
            {
                posicionActual+=3  
            }
        }
        function left(){
        
            if(posicionActual>0)
            {
                posicionActual--    
            }
        }
        function right(){
            if(posicionActual<5)
            {
                posicionActual++  
            }
        }
    
    
        function enter(){
            
            if(ollasActivadas[posicionActual]==true && cantMove==false){
                correctParticle.position.x=ollas[posicionActual].position.x
                correctParticle.position.y=ollas[posicionActual].position.y
                correctParticle.start(true, 1000, null, 5)
                cantMove=true
                addPoint()
                if(dificultyHM<5){
                    dificultyHM++
                }
                if(dificultyTime>100){
                    dificultyTime-=10
                    contTime-=5
                }
                ollasActivadas[posicionActual]=false
                ollas[posicionActual].setAnimationByName(0,"WIN",true);
                if(posicionActual<3){
                game.add.tween(player).to({y:player.y+50}, 300, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                ollas[posicionActual].setAnimationByName(0,"WINSTILL",false);
                    cantMove=false
                })
                }else{
                game.add.tween(player).to({y:player.y+50}, 300, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                ollas[posicionActual].setAnimationByName(0,"WINSTILL",false);
                    cantMove=false
                })
                }
            }
        }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        
        positionPlayer()
        if(startedGame==true){
          
            if(controles.down.isDown && keyPressed==false && cantMove==false){
                down()
                keyPressed=true
            }else if(controles.up.isDown && keyPressed2==false && cantMove==false){
                up()
                keyPressed2=true
            }else if(controles.right.isDown && keyPressed3==false && cantMove==false){
                right()
                keyPressed3=true
 
            }else if(controles.left.isDown && keyPressed4==false && cantMove==false){
                left()
                keyPressed4=true
            }
            
            if(controles.down.isUp && keyPressed==true && cantMove==false){
                keyPressed=false
            }else if(controles.up.isUp && keyPressed2==true && cantMove==false){
                keyPressed2=false
            }else if(controles.right.isUp && keyPressed3==true && cantMove==false){
                keyPressed3=false
 
            }else if(controles.left.isUp && keyPressed4==true && cantMove==false){
                keyPressed4=false
            } 
            
            controles2.onDown.add(enter, this)
            
            if(primerGame==false){
                
                for(var b=0;b<ollas.length;b++){
                    if(b==3){
                        moveFirst=0
                    }
                    if(b<3){
                        ollas[b] = worldGroup.game.add.spine(estufa.x+95+moveFirst,estufa.y+70, "pots");
                        ollas[b].scale.setTo(scaleSpine*.3,scaleSpine*.3)
                        ollas[b].setAnimationByName(0,"IDLE",true);
                        ollas[b].setSkinByName("pot"+(b+1));
                        ollas[b].alpha=0
                        moveFirst+=150
                        worldGroup.add(ollas[b])
                    }
                    
                    if(b>2 && b<6){
                        
                        ollas[b] = worldGroup.game.add.spine(estufa.x+95+moveFirst,estufa.y+220, "pots");
                        ollas[b].scale.setTo(scaleSpine*.3,scaleSpine*.3)
                        ollas[b].setAnimationByName(0,"IDLE",true);
                        ollas[b].setSkinByName("pot"+(b+1));
                        ollas[b].alpha=0
                        moveFirst+=150
                        worldGroup.add(ollas[b])
                    }
                }
            
        
                var crearOllas=game.rnd.integerInRange(1,dificultyHM)
        
                for(var m=0;m<crearOllas;m++)
                {
                    randomPots=game.rnd.integerInRange(0,5)
                    ollas[randomPots].alpha=1
                    tiempoOllas[randomPots]=game.rnd.integerInRange(dificultyTime,500)
                    ollasActivadas[randomPots]=true
                    
                }
                splashWindow=worldGroup.create(0,0,'atlas.ollas','mancha_sopa')
                splashWindow.width=game.world.width
                splashWindow.height=game.world.height
                splashWindow.alpha=0
                primerGame=true
                startPlaying=true
            }
            
            if(ollasActivadas[0]==false && ollasActivadas[1]==false && ollasActivadas[2]==false && ollasActivadas[3]==false && ollasActivadas[4]==false && ollasActivadas[5]==false && startPlaying==true && lives>0){
                reset()
            }
            
            for(var t=0; t<ollas.length;t++){
                if(ollasActivadas[t]==true){
                    tiempoOllas[t]--
                }
                //if(tiempoOllas[t]<=contTime/2 && tiempoOllas[t]>contTime/5){
                   //ollas[t].setAnimationByName(0,"Amarillo",true);
                //}
                if(tiempoOllas[t]==100){
                   ollas[t].setAnimationByName(0,"HOT",true);
                }
                
                if(tiempoOllas[t]==0){
                   ollas[t].setAnimationByName(0,"LOSE",false);
                   game.add.tween(this).to({x:100}, 400 , Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                   sound.play("splash")
                   splashWindow.alpha=1
                   })
                   for(var l=0;l<ollas.length;l++){
                        ollasActivadas[l]=false
                        tiempoOllas[l]=500
                    }
                   wrongParticle.position.x=ollas[t].position.x
                   wrongParticle.position.y=ollas[t].position.y
                   wrongParticle.start(true, 1000, null, 5)
                   game.add.tween(ollas[t]).to({alpha:0},400,Phaser.Easing.linear,true,300)
                   //explotion.alpha=1
                   game.add.tween(this).to({x:0}, 500 , Phaser.Easing.Linear.Out, true, 500).onComplete.add(function(){
                        startPlaying=false
                        missPoint()
                        posicionActual=0
                        
                 })
               }
            }
          }
        }
    
    function onClick(obj){
        
        if(obj.tag=="btn1" && cantMove==false){
            obj.loadTexture('atlas.ollas','left')
            if(posicionActual>0)
            {
                posicionActual--    
            }
        }
        if(obj.tag=="btn2" && cantMove==false){
            obj.loadTexture('atlas.ollas','right')
            if(posicionActual<5)
            {
                posicionActual++  
            }
            
        }
        if(obj.tag=="btn3" && cantMove==false){
            obj.loadTexture('atlas.ollas','up') 
            if(posicionActual>=3)
            {
                posicionActual-=3  
            }
        }
        if(obj.tag=="btn4" && cantMove==false){
            obj.loadTexture('atlas.ollas','down')
            if(posicionActual<=2)
            {
                posicionActual+=3
            }
        }
        if(obj.tag=="btn5" && cantMove==false){
            
            obj.loadTexture('atlas.ollas','botton_press')
            obj.position.x=control.x+325
            obj.position.y=control.y+70
            
            if(ollasActivadas[posicionActual]==true){
                correctParticle.position.x=ollas[posicionActual].position.x
                correctParticle.position.y=ollas[posicionActual].position.y
                correctParticle.start(true, 1000, null, 5)
                cantMove=true
                addPoint()
                if(dificultyHM<5){
                    dificultyHM++
                }
                if(dificultyTime>50){
                    dificultyTime-=10
                }
                
                ollasActivadas[posicionActual]=false
                ollas[posicionActual].setAnimationByName(0,"WIN",true);
                if(posicionActual<3){
                game.add.tween(player).to({y:player.y+50}, 300, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                ollas[posicionActual].setAnimationByName(0,"WINSTILL",false);
                    cantMove=false
                })
                }else{
                game.add.tween(player).to({y:player.y+50}, 300, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
                ollas[posicionActual].setAnimationByName(0,"WINSTILL",false);
                    cantMove=false
                })
                }
            }
        }
        
    }
    
    function onRelease(obj){
        
        if(obj.tag=="btn1"){    
            obj.loadTexture('atlas.ollas','left_unp')
        }
        if(obj.tag=="btn2"){
            obj.loadTexture('atlas.ollas','right_unp')
        }
        if(obj.tag=="btn3"){
            obj.loadTexture('atlas.ollas','up_unp')
        }
        if(obj.tag=="btn4"){
            obj.loadTexture('atlas.ollas','down_unp')
        }
        if(obj.tag=="btn5"){
            obj.loadTexture('atlas.ollas','boton')
            obj.position.x=control.x+325
            obj.position.y=control.y+40
        }
        
    }
        
    function reset()
    {
        
        startPlaying=false
        
        game.add.tween(this).to({x:0}, 100 , Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
        for(var n=0;n<ollas.length;n++)
        {
            
            if(ollas[n].alpha==1){
                game.add.tween(ollas[n]).to({alpha:0},400,Phaser.Easing.linear,true,300)
                ollasActivadas[n]=false
            }
            tiempoOllas[n]=500
        }
        })
         game.add.tween(this).to({x:0}, 500 , Phaser.Easing.Linear.Out, true, 900).onComplete.add(function(){
        
        
        var crearOllas=game.rnd.integerInRange(dificultyHM,dificultyHM)
        if(lives>0){
            game.add.tween(splashWindow).to({alpha:0},90,Phaser.Easing.linear,true,300)
            for(var m=0;m<crearOllas;m++)
            {
                randomPots=game.rnd.integerInRange(0,5)
                ollas[randomPots].alpha=1
                ollasActivadas[randomPots]=true
                ollas[randomPots].setAnimationByName(0,"IDLE",true);
                tiempoOllas[randomPots]=game.rnd.integerInRange(dificultyTime,contTime)
            }
        }
        startPlaying=true
        })
    }

   
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.ollas','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.x = game.world.width - 20
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartsImg = group.create(0,0,'atlas.ollas','life_box')
        heartsImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = -heartsImg.width * 0.38
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
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
        
        var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
        tweenScale.onComplete.add(function(){
            game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
        })
    }
	
    function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
				if(key == 'text'){
					particlesGroup.remove(particle)
                	particlesUsed.add(particle)
				}
                
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
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.ollas',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.5;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.ollas',tag);
				particle.minParticleSpeed.setTo(-400, -150);
				particle.maxParticleSpeed.setTo(400, -300);
				particle.minParticleScale = 0.4;
				particle.maxParticleScale = 1.2;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',1)
		createParticles('wrong',1)
		createParticles('text',5)

	}
	
    
	function createBackground(){

		var wall =game.add.tileSprite(0,game.world.y+100,game.world.width,game.world.y+46,'atlas.ollas',"tile")
		worldGroup.add(wall)
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        controles=game.input.keyboard.createCursorKeys()
        controles2=game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                
                estufa=worldGroup.create(game.world.centerX-245,game.world.height-680,'atlas.ollas','estufa')
                control=worldGroup.create(game.world.centerX-270,game.world.height-250,'atlas.ollas','barra_suelta')
                worldGroup.create(game.world.centerX-230,game.world.height-220,'atlas.ollas','fondo_cruz')
                worldGroup.create(game.world.centerX+40,game.world.height-190,'atlas.ollas','fondo_tapar')
                player=players.create(0,0,'atlas.ollas','mano')
                btn1=worldGroup.create(control.x+45,control.y+87,'atlas.ollas','left_unp')
                btn1.scale.setTo(1,1)
                btn1.tag="btn1"
                btn2=worldGroup.create(control.x+155,control.y+85,'atlas.ollas','right_unp')
                btn2.scale.setTo(1,1)
                btn2.tag="btn2"
                btn3=worldGroup.create(control.x+102,control.y+35,'atlas.ollas','up_unp')
                btn3.scale.setTo(1,1)
                btn3.tag="btn3" 
                btn4=worldGroup.create(control.x+102,control.y+140,'atlas.ollas','down_unp')
                btn4.scale.setTo(1,1)
                btn4.tag="btn4"
                btn5=worldGroup.create(control.x+325,control.y+40,'atlas.ollas','boton')
                btn5.scale.setTo(1)
                btn5.tag="btn5"
                btn1.inputEnabled=true
                btn1.events.onInputDown.add(onClick,this)
                btn1.events.onInputUp.add(onRelease,this)
                btn2.inputEnabled=true
                btn2.events.onInputDown.add(onClick,this)
                btn2.events.onInputUp.add(onRelease,this)
                btn3.inputEnabled=true
                btn3.events.onInputDown.add(onClick,this)
                btn3.events.onInputUp.add(onRelease,this)
                btn4.inputEnabled=true
                btn4.events.onInputDown.add(onClick,this)
                btn4.events.onInputUp.add(onRelease,this)
                btn5.inputEnabled=true
                btn5.events.onInputDown.add(onClick,this)
                btn5.events.onInputUp.add(onRelease,this)
                btn1.alpha=1
                btn2.alpha=1
                btn3.alpha=1
                btn4.alpha=1
                btn5.alpha=1
                
        }
        
	
	return {
		assets: assets,
		name: "ollasLocas",
		create: function(event){
            

			sceneGroup = game.add.group()
			
            worldGroup = game.add.group()
            sceneGroup.add(worldGroup)
			players = game.add.group()
            sceneGroup.add(players)
            
			createBackground()
            
            
                        
            groundGroup = game.add.group()
            worldGroup.add(groundGroup)
            
            loadSounds()
			initialize()       
            			
			marioSong = game.add.audio('marioSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);
                  
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
				
            }, this);
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = 100
            characterGroup.y = game.world.height - 300
            worldGroup.add(characterGroup)
            
            createPointsBar()
            createHearts()        
            
			addParticles()
            
            
			buttons.getButton(marioSong,sceneGroup)
			
			if(!reviewComic){
				createComic(4);
			}else{
			  createOverlay();  
			}
            animateScene()
            
            
		},
        preload:preload,
        update:update
	}

}()