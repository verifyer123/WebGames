
var soundsPath = "../../shared/minigames/sounds/"
var greenRescue = function(){
    
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
                name: "atlas.green",
                json: "images/green/atlas.json",
                image: "images/green/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/green/timeAtlas.json",
                image: "images/green/timeAtlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "vacc",
				file: soundsPath + "swipe.mp3"},
            
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var particlesGroup, particlesUsed
    var gameIndex = 102
	var indexGame
    var overlayGroup
    var spaceSong
    var velocidadNubes=4
    
    var backgroundGroup=null
    var clock, timeBar,tweenTiempo;
    
    var proxy=new Array(9);
    var trash=new Array(9);
    var tree=new Array(9);
    var estados=new Array(9);
    var animations=new Array(7);
    var objectOverlaping;
    var dificulty;
    var checked, allClean,canPlant;

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

       for(var falseStates=0;falseStates<estados.length;falseStates++){
            estados[falseStates]=0;   
            proxy[falseStates].tag=falseStates;
       }
        
        animations[0]="BAG";
        animations[1]="BOMB";
        animations[2]="BOX";
        animations[3]="CASSETS";
        animations[4]="SODA";
        animations[5]="TIRE";
        animations[6]="TV";
        
        canPlant=false;
        checked=0;
        allClean=0;
        dificulty=3;
        velocidadNubes=4;
        lives = 3
        
        loadSounds()
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

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
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
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.green','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.green','life_box')

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
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/electro_trance_minus.mp3');
        
		game.load.image('howTo',"images/green/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/green/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/green/introscreen.png")
        
        game.load.spine("floor","images/Spine/Floor/floor.json")
        game.load.spine("trash","images/Spine/Trash/trash.json")
        game.load.spine("trees","images/Spine/Trees/trees.json")
        
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
        
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
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
        rect.events.onInputDown.add(function(){ 
            rect.inputEnabled = false
			sound.play("pop")
            
            //Aqui va la primera funciòn que realizara el juego
            game.time.events.add(1250, function(){
                putTrash();
            });
            
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.green','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.green',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.green','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)


        //Grupo de nubes
        cloudsGroup=game.add.group();
        sceneGroup.add(cloudsGroup);

        platformGroup=game.add.group();
        sceneGroup.add(platformGroup)

        UIGroup=game.add.group();
        sceneGroup.add(UIGroup);




        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()

        correctParticle = createPart("star");
        sceneGroup.add(correctParticle);
        boomParticle = createPart("smoke");
        sceneGroup.add(boomParticle);

        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        //Colocamos el escenario

        var out = [];

        var bmd = game.add.bitmapData(game.world.width, game.world.height);
        var gradient=bmd.addToWorld();

        var y = 0;

        for (var i = 0; i < 400; i++)
        {
            var c = Phaser.Color.interpolateColor(0x398270, 0xf5e46e, 400, i);

            // console.log(Phaser.Color.getWebRGB(c));

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            out.push(Phaser.Color.getWebRGB(c));

            y += 2;
        }
        backgroundGroup.add(gradient)


        sun=game.add.sprite(game.rnd.integerInRange(100,game.world.width-100),200,"atlas.green","SUN");

        clouds1=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");
        clouds2=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");
        clouds3=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");
        clouds4=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");

        clouds1.anchor.setTo(0.5)
        clouds2.anchor.setTo(0.5)
        clouds3.anchor.setTo(0.5)
        clouds4.anchor.setTo(0.5)

        cloudsGroup.add(clouds1)
        cloudsGroup.add(clouds2)
        cloudsGroup.add(clouds3)
        cloudsGroup.add(clouds4)
        backgroundGroup.add(sun)

        board=game.add.sprite(game.world.centerX-273,game.world.height-180,"atlas.green","BOARD")
        
        
        shovelIcon=game.add.sprite(board.centerX-230,board.centerY-70,"atlas.green","ICON SHOVEL")
        sprinklerIcon=game.add.sprite(board.centerX-90,board.centerY-70,"atlas.green","ICON SPRINKLER")
        sproutIcon=game.add.sprite(board.centerX+130,board.centerY-70,"atlas.green","ICON SPROUT")
        
        
        shovel=game.add.sprite(board.centerX-180,board.centerY,"atlas.green","SHOVEL")
        sprinkler=game.add.sprite(board.centerX-10,board.centerY,"atlas.green","SPRINKLER")
        sprout=game.add.sprite(board.centerX+180,board.centerY,"atlas.green","SPROUT")
        
        shovelProxy=game.add.sprite(board.centerX-180,board.centerY,"atlas.green","SHOVEL")
        sprinklerProxy=game.add.sprite(board.centerX-10,board.centerY,"atlas.green","SPRINKLER")
        sproutProxy=game.add.sprite(board.centerX+180,board.centerY,"atlas.green","SPROUT")
        
        shovelProxy.alpha=0;
        sprinklerProxy.alpha=0;
        sproutProxy.alpha=0;
        
        shovelProxy.scale.setTo(0.5);
        shovelProxy.anchor.setTo(0.5);
        
        sprinklerProxy.scale.setTo(0.5);
        sprinklerProxy.anchor.setTo(0.5);
        
        sproutProxy.scale.setTo(0.5);
        sproutProxy.anchor.setTo(0.5);
        
        shovel.inputEnabled=true;
        sprinkler.inputEnabled=true;
        sprout.inputEnabled=true;
        
        shovel.anchor.setTo(0.5);
        sprinkler.anchor.setTo(0.5);
        sprout.anchor.setTo(0.5);
        
        shovel.tag="sho";
        sprinkler.tag="sprin";
        sprout.tag="sprout";
        
        shovel.input.enableDrag(true);
        sprinkler.input.enableDrag(true);
        sprout.input.enableDrag(true);
        
        shovel.events.onDragStop.add(onDragStop, this);
        sprinkler.events.onDragStop.add(onDragStop, this);
        sprout.events.onDragStop.add(onDragStop, this);

        UIGroup.add(board)
        UIGroup.add(shovel)
        UIGroup.add(sprinkler)
        UIGroup.add(sprout)
        UIGroup.add(shovelIcon)
        UIGroup.add(sprinklerIcon)
        UIGroup.add(sproutIcon)

        platform1=game.add.spine(game.world.centerX,game.world.centerY,"floor")
        platform1.scale.setTo(1,1)
        platform1.alpha=1
        platform1.speed =0.5
        platform1.setSkinByName("normal");
        platform1.setAnimationByName(0,"STAR_DIRTY",false)
        platformGroup.add(platform1)
        
                          
        //Put the trash and the trees in their place
        
        var acomodateX=100;
        var standarX=200;
        var acomodateY=40;
        var standarY=50;
        var general=0;
        var treeScale=0.5
        
        for(var translate=0;translate<9;translate++){
            
            
            if(translate==3){
                standarX=120;
                standarY=100;
                acomodateY=50;
                general=0
            }
            if(translate==6){
                standarX=30;
                standarY=200;
                acomodateX=110;
                acomodateY=80;
                general=0
            }
            
            if(translate==0 || translate==1 || translate==2 || translate==5 || translate==8){
                treeScale=0.7
            }else if(translate==3 || translate==4 || translate==7){
                treeScale=0.6
            }else if(translate==6){
                treeScale=0.5
            }
            
            
            trash[translate]=game.add.spine(game.world.centerX-standarX+acomodateX*general,game.world.centerY+standarY-acomodateY*general,"trash")
            trash[translate].scale.setTo(1,1)
            trash[translate].alpha=0
            trash[translate].setSkinByName("normal");
            //trash[translate].setAnimationByName(0,"START_BAG",false)
            platformGroup.add(trash[translate])
            
            tree[translate]=game.add.spine(game.world.centerX-standarX+acomodateX*general,game.world.centerY+standarY-acomodateY*general,"trees")
            tree[translate].scale.setTo(treeScale,treeScale)
            tree[translate].alpha=0
            tree[translate].setSkinByName("normal");
            //tree[translate].setAnimationByName(0,"SHOOT",false)
            platformGroup.add(tree[translate])
            
            proxy[translate]=game.add.sprite(game.world.centerX-standarX+10+acomodateX*general,game.world.centerY-40+standarY-acomodateY*general,"atlas.green","OLD BAG")
            proxy[translate].scale.setTo(1,1)
            proxy[translate].anchor.setTo(0.5,0.5)
            proxy[translate].alpha=0
            platformGroup.add(proxy[translate])
            
            general++;
            
            
        }
        
        
        positionTimer()
    }
	
    
    function positionTimer(){
           clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
           clock.scale.setTo(.7)
           timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
           timeBar.scale.setTo(8,.45)
           backgroundGroup.add(clock)
           backgroundGroup.add(timeBar)
           timeBar.alpha=1
           clock.alpha=1
       }
       function stopTimer(){
           tweenTiempo.stop()
           tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
               reset()
           })
       }
       function startTimer(time){
            tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
            tweenTiempo.onComplete.add(function(){
                missPoint()
        })
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
    
	function update(){
        
        
        if(startGame){
        
            //Nubes moviendose
            cloudsGroup.position.x-=velocidadNubes;
            if(cloudsGroup.x<-game.world.width*2.4){
                cloudsGroup.position.x=+100
                clouds1.position.y=game.rnd.integerInRange(0,game.world.height);
                clouds2.position.y=game.rnd.integerInRange(0,game.world.height);
                clouds3.position.y=game.rnd.integerInRange(0,game.world.height);
                clouds4.position.y=game.rnd.integerInRange(0,game.world.height);
                
                clouds1.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
                clouds2.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
                clouds3.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
                clouds4.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
            }
            
            animations[0]="BAG";
            animations[1]="BOMB";
            animations[2]="BOX";
            animations[3]="CASSETS";
            animations[4]="SODA";
            animations[5]="TIRE";
            animations[6]="TV";
            
            for(var checkOverlaping=0;checkOverlaping<estados.length;checkOverlaping++){
                if (checkOverlap(sprinklerProxy,proxy[checkOverlaping]))
                {
                    objectOverlaping=proxy[checkOverlaping];
                    objectOverlaping.tag=proxy[checkOverlaping].tag
                }
                if (checkOverlap(sproutProxy,proxy[checkOverlaping]))
                {
                    objectOverlaping=proxy[checkOverlaping];
                    objectOverlaping.tag=proxy[checkOverlaping].tag
                }
                if (checkOverlap(shovelProxy,proxy[checkOverlaping]))
                {
                    objectOverlaping=proxy[checkOverlaping];
                    objectOverlaping.tag=proxy[checkOverlaping].tag
                }
            }
            
            shovelProxy.position.x=shovel.x;
            shovelProxy.position.y=shovel.y;
            
            sprinklerProxy.position.x=sprinkler.x;
            sprinklerProxy.position.y=sprinkler.y;
            
            sproutProxy.position.x=sprout.x;
            sproutProxy.position.y=sprout.y;
        }

	}
    
    
    
    function onDragStop(obj){
        if(obj.tag=="sho"){
            obj.position.x=board.centerX-180
            obj.position.y=board.centerY
        }else if(obj.tag=="sprin"){
            obj.position.x=board.centerX-10
            obj.position.y=board.centerY 
        }else if(obj.tag=="sprout"){
            obj.position.x=board.centerX+180
            obj.position.y=board.centerY
        }
        
        if(objectOverlaping){
            if(obj.tag=="sho" && estados[objectOverlaping.tag]==1){
                clean(objectOverlaping);
            }
            if(obj.tag=="sprout" && estados[objectOverlaping.tag]==2){
                plant(objectOverlaping);
            }
            if(obj.tag=="sprin" && estados[objectOverlaping.tag]>=3){
                water(objectOverlaping);
            }
        }
    }
    
    function putTrash(){
        
        var counter=0;
        var donde=0;
        var whichOne=0;
        
        while(counter<dificulty){ 
            donde=game.rnd.integerInRange(0,8)
            if(estados[donde]==0){
                estados[donde]=1;
                counter++;
            }
        }
        for(var placeTrash=0;placeTrash<estados.length;placeTrash++){
            
            if(estados[placeTrash]==1){
                var este=placeTrash;
                whichOne=game.rnd.integerInRange(0,6);
                trash[placeTrash].setAnimationByName(0,"START_"+animations[whichOne],false);
                trash[placeTrash].alpha=1;
            } 
        }
    }
    
    
    function clean(obj){
        game.add.tween(trash[obj.tag]).to({y:trash[obj.tag].y-200},200,Phaser.Easing.Cubic.In,true);
        game.add.tween(trash[obj.tag]).to({alpha:0},200,Phaser.Easing.Cubic.Out,true,200);
        game.add.tween(trash[obj.tag]).to({y:trash[obj.tag].y+200},200,Phaser.Easing.Cubic.In,true,1200);
        estados[obj.tag]=2;
        allClean++;
        
        if(allClean==dificulty){
            allClean=0;
            platform1.setAnimationByName(0,"OUT_DIRTY",false);
            game.time.events.add(2500,function(){
                platform1.setAnimationByName(0,"START_CLEAN",false)
                game.time.events.add(500,function(){
                    canPlant=true;
                })
            })
            
            
        }
    }
    
    function plant(obj){
        if(canPlant){
            tree[obj.tag].setAnimationByName(0,"SHOOT",false);
            tree[obj.tag].alpha=1;
            estados[obj.tag]=3;
        }
    }
    function water(obj){
        
        
        
        if(estados[obj.tag]==3){
            tree[obj.tag].setAnimationByName(0,"HALF",false);
            estados[obj.tag]=4
        }else if(estados[obj.tag]==4){
            tree[obj.tag].setAnimationByName(0,"COMPLETE",false);
            estados[obj.tag]=5
            checked++
        }
        if(checked==dificulty){
            Coin(platform1,pointsBar,200)
            checked=0;
            
        }
    }
    
    function Coin(objectBorn,objectDestiny,time){
        
        
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
                nextLevel()
            })
        })
    }
    
    function reset(){
            
            
    }
    
    function nextLevel(){
        
        
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
            if(!particle.used && particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
				                
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
        particle.makeParticles('atlas.green',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
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

				particle.makeParticles('atlas.green',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
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
		
		createParticles('star',3)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.green','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.green','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	return {
		
		assets: assets,
		name: "greenRescue",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
//            spaceSong = game.add.audio('spaceSong')
//            game.sound.setDecodedCallback(spaceSong, function(){
//                spaceSong.loopFull(0.6)
//            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()