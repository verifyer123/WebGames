var soundsPath = "../../shared/minigames/sounds/"
var tapatopo = function(){    

	assets = {
        atlases: [
            {   
                name: "atlas.tapatopo",
                json: "images/tapatopo/atlas.json",
                image: "images/tapatopo/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/tapatopo/fondo.png"},
		],
		sounds: [
            {	name: "punch1",
				file: soundsPath + "punch1.mp3"},
            {	name: "punch2",
				file: soundsPath + "punch2.mp3"},
            {	name: "punch3",
				file: soundsPath + "punch3.mp3"},
            {	name: "explode",
				file: soundsPath + "explode.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "moleHit",
				file: soundsPath + "moleHit.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
		],
	}
        
    var SPEED = 7
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OFFSET_PZ = 73 * 1.5
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    
    var randomBomb
    var gameLevel = null
    var timeToHide = null
    var diamondsGroup = null
    var gameSong = null
    var timeAdd = null
    var levelNumber = 0
    var orderList = null
    var scaleSpeed = null
    var timeBar = null
    var lastObj
	var sceneGroup = null
    var answersGroup = null
    var gameActive = true
    var pointsBar = null
    var throwTime = null
    var holesGroup = null
    var lives = null
    var heartsGroup = null
    var buddy = null    

	function loadSounds(){
		sound.decode(assets.sounds)
	}
    
    function setOrderList(){
        
        for(var i = 0;i<9;i++){
            orderList[i] = i
        }
        
    }

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        randomBomb = 2
        timeAdd = 500
        timeToHide = 1400
        scaleSpeed = 0.0004
        lives = 1
        gameLevel = 1
        loadSounds()
        levelNumber = 1
        orderList = []
        setOrderList()
        
	}

    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

		
        gameActive = true
        
        sceneGroup.alpha = 0
        
        var sceneTween = game.add.tween(sceneGroup).to({alpha:1},500,Phaser.Easing.linear,true)
        
        sceneTween.onComplete.add(function(){
            game.time.events.add(1000,activateHole,this)
            setLevel(gameLevel)
        })

        //timer.start()
        //game.time.events.add(throwTime *0.1, dropObjects , this);
        //objectsGroup.timer.start()

    }
    
    function activateHole(){
        
        if(gameActive == false){
            return
        }
        
        Phaser.ArrayUtils.shuffle(orderList)
        
        for(var i = 0;i<orderList.length;i++){
            
            //console.log(i + ' index')
            var hole = holesGroup.children[orderList[i]]
            
            if(hole.activated == false && hole.hit == false ){
                
                sound.play("cut")
                
                activateObject(hole,randomize(randomBomb))
                hole.activated = true
                
                break
            }
            
        }
        
        game.time.events.add(timeAdd,activateHole,this)
        
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
    function createPart(key,obj,offX, offY,much){
        
        var offsetX = offX || 0
        var offsetY = offY || 0
        
        var particlesNumber = 2
        
        tooMuch = much || true
        //console.log('fps ' + game.time.fps)
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
        if( tooMuch == false){ 
            
        
        }else{
            key+='Part'
            var particle = sceneGroup.create(posX,posY - offsetY,'atlas.tapatopo',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0

        var exp = sceneGroup.create(0,0,'atlas.tapatopo','explosion')
        exp.x = obj.x
        exp.y = obj.y + offY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        starParticles(obj,'smoke')
        
    }
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.tapatopo',idString);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y- 25;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function stopGame(){
        
        gameSong.stop()
        //objectsGroup.timer.pause()
        gameActive = false
        
        lives--
        heartsGroup.text.setText(lives)
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true,pointsBar.number)

			amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.tapatopo','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.9
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(1,0)
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

        var heartsImg = group.create(0,0,'atlas.tapatopo','life_box')
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
    
    function addLevel(){
        
        if(timeToHide >= 0){
            timeToHide -= timeToHide * 0.1
        }
        
        if (timeAdd >= 0 ){
            timeAdd-= timeAdd * 0.07
        }
        
        scaleSpeed+= 0.00015
        
        gameLevel++
        
        setLevel(gameLevel)
        
        console.log('add Level' + gameLevel)
        
    }
    
    function setLevel(number){
    
        var text = sceneGroup.levelText
        
        text.y = game.world.centerY - 200
        
        text.setText('Nivel ' + number)
        
        var addTween = game.add.tween(text).to({y:game.world.centerY - 150,alpha:1},500,Phaser.Easing.linear,true)
        addTween.onComplete.add(function(){
            game.add.tween(text).to({y:game.world.centerY - 200,alpha:0},250,Phaser.Easing.linear,true,500)
        })
    }
    
    function addPoint(number){
        
        //sound.play("pop")
        
        addNumberPart(pointsBar.text,'+' + number,true)
        
        pointsBar.number+=  number
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number % 15 == 0){
            addLevel()
        }
        
        if(pointsBar.number == 40){
            randomBomb = 3
        }
        
    }
    
    function update(){
        
        if(!gameActive){
            return
        }
        
        if(timeBar.scaleBar.scale.x > 0){
            timeBar.scaleBar.scale.x-= scaleSpeed
        }else{
            timeBar.scaleBar.scale.x = 0
            sound.play("wrong")
            stopGame()
        }
        
    }
    
    function preload(){
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;

        game.load.spine('topo', "images/spines/skeleton.json");
        
        game.load.audio('moleSong', soundsPath + 'songs/sillyAdventureGameLoop.mp3');
        
        
    }
    
    function createLevelText(){
        
        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var levelText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        levelText.x = game.world.centerX
        levelText.y = game.world.centerY - 150
        levelText.anchor.setTo(0.5,0.5)
        sceneGroup.add(levelText)
        
        levelText.alpha = 0
        
        sceneGroup.levelText = levelText
        
        levelText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
        
    }
    
    
    function createTimeBar(){
        
        timeBar = game.add.group()
        timeBar.x = game.world.centerX
        timeBar.y = 100
        sceneGroup.add(timeBar)
        
        
        var container = timeBar.create(0,0,'atlas.tapatopo','timebar')
        container.anchor.setTo(0.5,0.5)
        
        var fillGroup = game.add.group()
        fillGroup.x = -container.width * 0.485
        timeBar.add(fillGroup)
        
        var fillImg1 = fillGroup.create(0,0,'atlas.tapatopo','timebarFill')
        fillImg1.anchor.setTo(0,0.5)
        
        fillGroup.scale.x = 0.5
        timeBar.scaleBar = fillGroup
        
        var fillImg2 = fillGroup.create(0,0,'atlas.tapatopo','whiteFill')
        fillImg2.anchor.setTo(0,0.5)
        
        changeImage(0,timeBar.scaleBar)
        
    }    
    
    function createHoles(){
        
        var pivotX = game.world.centerX - 200
        var pivotY = game.world.centerY - 100
        
        for(var i = 0;i<9;i++){
            
            var hole = holesGroup.create(pivotX, pivotY,'atlas.tapatopo','hole')
            hole.anchor.setTo(0.5,0.5)
            
            hole.activated = false
            hole.hit = false
            
            pivotX += 200
            
            if((i + 1)% 3 == 0){
                pivotX = game.world.centerX - 200
                pivotY+= 200
            }
            
            
        }
    }
    
    function hideMole(mole){
        
        mole.hole.activated = false
        mole.hole.hit = true
        
        game.time.events.add(300,function(){
            
            var hideTween = game.add.tween(mole.scale).to({x:0.01,y:0.01},250,Phaser.Easing.linear,true)
            hideTween.onComplete.add(function(){
                mole.hole.hit = false
            })
            
        },this)
        
    }
    
    function hitMole(obj){
        
        if(gameActive == false){
            return
        }
        
        var tag = obj.tag
        if(tag == 'mole'){
            
            var parent = obj.parent
            obj.inputEnabled = false

            parent.anim.setAnimationByName(0,"PUNCH",false)

            sound.play("punch" + game.rnd.integerInRange(1, 3))

            hideMole(parent)

            createPart('star',obj)
            
            if(parent.hole.timer){
                
                game.time.events.remove(parent.hole.timer)
                parent.hole.timer = null
            }
            
            if(timeBar.scaleBar.scale.x<0.962){
                timeBar.scaleBar.scale.x+=0.038
            }
            
            changeImage(1,timeBar.scaleBar)
            
            game.time.events.add(50,function(){
                changeImage(0,timeBar.scaleBar)
            },this)
            
            sound.play("moleHit")
            addPoint(1)
            
            addNumberPart(obj,'+1', false)
            
        }else if(tag == 'bomb'){
            
            game.add.tween(obj.scale).to({x:2,y:2},100,Phaser.Easing.linear,true)
            game.add.tween(obj).to({alpha:0},100,Phaser.Easing.linear,true)
            
            setExplosion(obj,0)
            sound.play("explode")
            
            stopGame()
        }else if(tag == 'diamond'){
            
            game.add.tween(obj.scale).to({x:2,y:2},100,Phaser.Easing.linear,true)
            game.add.tween(obj).to({alpha:0},100,Phaser.Easing.linear,true)
            
            starParticles(obj,'star')
            
            addPoint(5)
            
            if(timeBar.scaleBar.scale.x<0.9){
                timeBar.scaleBar.scale.x+=0.1
            }
            
            sound.play("magic")
            
            addNumberPart(obj,'+5', false)
            
        }else if(tag == 'bombMole'){
            
            var parent = obj.parent
            parent.anim.setAnimationByName(0,"PUNCH",false)

            sound.play("punch" + game.rnd.integerInRange(1, 3))

            hideMole(parent)
            
            setExplosion(parent,0)
            sound.play("explode")
            
            //stopGame()
            
            timeBar.scaleBar.scale.x-=0.1
                        
        }
        
    }
    
    function deactivateObject(hole,obj){

        hole.timer = game.time.events.add(timeToHide,function(){
            if(hole.activated == true){
                
                game.add.tween(obj.scale).to({x:1.2,y:1.2},100,Phaser.Easing.linear,true)
                var hideTween = game.add.tween(obj.scale).to({x:0.01,y:0.01},150, Phaser.Easing.Bounce.InOut,true,200)
                
                hideTween.onComplete.add(function(){
                    hole.activated = false
                })
            }
        },this)
        
    }
    
    function addNumberPart(obj,number,scaleIt){
        
        var offsetY = -100
        if(scaleIt){
            offsetY = 100
        }
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + offsetY},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        if(scaleIt){
            
            var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
            tweenScale.onComplete.add(function(){
                game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
            })
            
        }
        
    }
    
    function activateObject(hole, isBomb){
        
        if(isBomb){
            
            if(pointsBar.number > 80 && randomize(8)){
                
                var diamond = hole.diamond
            
                diamond.scale.setTo(1,1)
                diamond.inputEnabled = true
                diamond.alpha = 1
                game.add.tween(diamond.scale).from({x:0.01,y:0.01},250,Phaser.Easing.linear,true)

                hole.activated = true

                deactivateObject(hole,diamond)
                
            }else{
                
                var bomb = hole.bomb
            
                bomb.scale.setTo(1,1)
                bomb.inputEnabled = true
                bomb.alpha = 1
                game.add.tween(bomb.scale).from({x:0.01,y:0.01},250,Phaser.Easing.linear,true)

                hole.activated = true

                deactivateObject(hole,bomb)   
                
            }
            
        }else{
            
            var mole = hole.mole
            
            mole.scale.setTo(1,1)
            mole.alpha = 1
            
            mole.anim.setAnimationByName(0,"OUT",false)
            mole.anim.addAnimationByName(0,"IDLE",true)
            mole.anim.setSkinByName('normal')
            
            mole.mole.inputEnabled = true
            mole.mole.tag = 'mole'
            
            hole.activated = true
            deactivateObject(hole,mole)
            
            if(pointsBar.number > 40 && randomize(5)){
                mole.anim.setSkinByName('normal2')
                mole.mole.tag = 'bombMole'
            }
            
        }
    }
               
    function randomize(index){
        var isTrue = false
        
        if(Math.random()*index < 1){
            isTrue = true
        }
                
        return isTrue
    }
    
    function createMoles(number){
        
        molesGroup = game.add.group()
        sceneGroup.add(molesGroup)
        
        for(var i = 0; i<number; i++){
            
            var hole = holesGroup.children[i]
            
            var topGroup = game.add.group()
            topGroup.x = hole.x
            topGroup.y = hole.y
            molesGroup.add(topGroup)
            
            var mole = topGroup.create(0,-60,'atlas.tapatopo','gopher')
            mole.alpha = 0
            
            mole.anchor.setTo(0.5,0.5)
            
            mole.inputEnabled = false
            mole.events.onInputDown.add(hitMole)
            mole.tag = 'mole'
            topGroup.mole = mole
            
            
            var buddy = game.add.spine(0,0, "topo");
            buddy.scale.setTo(1,1)
            buddy.setAnimationByName(0, "OUT", false);
            buddy.addAnimationByName(0,"IDLE",true)
            buddy.setSkinByName('normal');
            topGroup.add(buddy)
            
            topGroup.anim = buddy
            hole.mole = topGroup
            topGroup.hole = hole
            
            topGroup.alpha = 0
            
            var bomb = bombsGroup.create(hole.x,hole.y,'atlas.tapatopo','bomb')
            bomb.anchor.setTo(0.5,1)
            
            bomb.inputEnabled = false
            bomb.tag = 'bomb'
            bomb.events.onInputDown.add(hitMole)
            
            hole.bomb = bomb
            bomb.alpha = 0
            
            var diamond = diamondsGroup.create(hole.x, hole.y,'atlas.tapatopo','diamond')
            diamond.anchor.setTo(0.5,1)
            
            diamond.inputEnabled = true
            diamond.tag = 'diamond'
            diamond.events.onInputDown.add(hitMole)
            
            diamond.alpha = 0
            diamond.scale.setTo(0.01,0.01)
            hole.diamond = diamond
            
        }
        
    }
    
	return {
		assets: assets,
        preload: preload,
        update:update,
		name: "tapatopo",
		create: function(event){

			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            holesGroup = game.add.group()
            sceneGroup.add(holesGroup)
            
            bombsGroup = game.add.group()
            sceneGroup.add(bombsGroup)
            
            diamondsGroup = game.add.group()
            sceneGroup.add(diamondsGroup)
            
            createHoles()
            createMoles(9)
            
            /*buddy = game.add.spine(0,0, "kong");
            buddy.scale.setTo(1,1)
            buddy.setAnimationByName(0, "IDLE", true);
            buddy.setSkinByName('normal');
            characterGroup.add(buddy)*/
            
            initialize()
            animateScene()
            
            createLevelText()
            
            gameSong = game.add.audio('moleSong')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.5)
            }, this);
            
            createHearts()
            createPointsBar()
            
            createTimeBar()
            
            var grassFront = sceneGroup.create(game.world.centerX + 50,game.world.height,'atlas.tapatopo','grassfront')
            grassFront.width = game.world.width * 1.1
            grassFront.anchor.setTo(0.5,1)
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()