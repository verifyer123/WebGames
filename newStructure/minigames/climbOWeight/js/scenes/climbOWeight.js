
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var climbOWeight = function(){
    
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
                name: "atlas.climbOWeight",
                json: "images/climbOWeight/atlas.json",
                image: "images/climbOWeight/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/climbOWeight/gametuto.png"
			},
            {
				name:'back',
				file:"images/climbOWeight/back.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'spaceSong',
                file: soundsPath + 'songs/wormwood.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            }
        ],
        spines:[
			{
				name:"justice",
				file:"images/spines/justice.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 179
    var tutoGroup
    var spaceSong
    var coin
    var hand
    var leftGroup
    var rightGroup
    var circleGroup
    var justice
    var topPos = {rope: 0, base: 0}
    var bottomPos = {rope: 0, base: 0}
    var towerlevels = [ {rope: 0, base: 0},
                        {rope: 0, base: 0},
                        {rope: 0, base: 0},
                        {rope: 0, base: 0},
                        {rope: 0, base: 0},]
    var rand 
    var swingTime
    var stopBtn
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rand = -1
        swingTime = 3000
        
        loadSounds()
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.climbOWeight','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.climbOWeight','life_box')

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
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "back"))
        
        var floor = game.add.tileSprite(0, game.world.height, game.world.width, 200, "atlas.climbOWeight", "tileFloor")
        floor.anchor.setTo(0, 1) 
        sceneGroup.add(floor)
        
        var tower = sceneGroup.create(game.world.centerX, floor.centerY - 70, "atlas.climbOWeight", "tower")
        tower.anchor.setTo(0.5, 1)
        tower.scale.setTo(0.7)
        
        var aux = 0.65
        for(var i = 0; i < 4; i++){
            
            towerlevels[i].base = tower.centerY - tower.height * aux
            towerlevels[i].rope = tower.centerY - (tower.height * aux) - 80
    
            if(i < 2)
                aux -= 0.2
            else
                aux -= 0.1
        }
        towerlevels[4].base = tower.centerY - tower.height * -0.05
        towerlevels[4].rope = tower.centerY - (tower.height * -0.05) - 80
    }

	function update(){
        
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
        particle.makeParticles('atlas.climbOWeight',key);
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

				particle.makeParticles('atlas.climbOWeight',tag);
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
		createParticles('wrong',1)
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
		
        var exp = sceneGroup.create(0,0,'atlas.climbOWeight','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.climbOWeight','smoke');
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
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(objectBorn){
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
        var time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function judgeDredd(){
        
        justice = game.add.spine(game.world.centerX - 100, game.world.height - 50, "justice")
        justice.setAnimationByName(0, "IDLE", true)
        justice.setSkinByName("normal")
        sceneGroup.add(justice)
        
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        if(localization.getLanguage() === 'EN'){
            var stopText = "STOP"
        }
        else{
            var stopText = "Parar"
        }
        
        stopBtn = game.add.group()
        sceneGroup.add(stopBtn)
        
        var btnOn = stopBtn.create(justice.x + 130, justice.y - 100, "atlas.climbOWeight", "btnOn")
        var btnOff = stopBtn.create(justice.x + 130, justice.y - 100, "atlas.climbOWeight", "btnOff")
        
        var text = new Phaser.Text(sceneGroup.game, btnOff.centerX, btnOff.centerY + 5, stopText, fontStyle)
        text.anchor.setTo(0.5)
        stopBtn.add(text)
        stopBtn.text = text

        btnOff.inputEnabled = true
        btnOff.events.onInputDown.add(getCircle, this)
        btnOff.events.onInputUp.add(function(){
            changeImage(1, stopBtn)
            text.alpha = 1
            stopBtn.text.scale.setTo(1)
        },this)
    }
    
    function pulleyDance(){
        
        var pulleyBar = sceneGroup.create(game.world.centerX, 90, "atlas.climbOWeight", "pulleyBar")
        pulleyBar.anchor.setTo(0.5)
        pulleyBar.scale.setTo(1.4, 1)
        
        leftGroup = game.add.group()
        sceneGroup.add(leftGroup) 
        
        rightGroup = game.add.group()
        sceneGroup.add(rightGroup)
        
        for(var i = -0.6; i < 0.7; i += 1.2){
            
            var pulley = sceneGroup.create(pulleyBar.x + (pulleyBar.x * i), pulleyBar.centerY - 2, "atlas.climbOWeight", "pulley")
            pulley.anchor.setTo(0.5, 0)
            pulley.scale.setTo(1.2)
            
            var rope = game.add.tileSprite(pulley.x + (i * 90), pulley.y, 10, game.world.centerY + 80, "atlas.climbOWeight", "rope")
            rope.anchor.setTo(0.5, 0)
            
            var subGroup = game.add.group()
            subGroup.x = rope.x
            subGroup.y = rope.height + rope.y - 12
            leftGroup.add(subGroup)
            
            var base = subGroup.create(0, 0, "atlas.climbOWeight", "base")
            base.anchor.setTo(0.5, 0)
            subGroup.base = base
            
            leftGroup.add(rope)
        }
        
        rightGroup.add(subGroup)
        rightGroup.platform = subGroup
        
        rightGroup.add(rope)
        rightGroup.rope = rope
        
        rightGroup.rope.height = 50
        rightGroup.platform.y = rightGroup.rope.height + rightGroup.rope.y - 12
        
        leftGroup.platform = leftGroup.children[0]
        leftGroup.rope = leftGroup.children[1]
        
        topPos.rope = rightGroup.rope.height
        topPos.base = rightGroup.platform.y
        
        bottomPos.rope = leftGroup.rope.height
        bottomPos.base = leftGroup.platform.y
    }
    
    function createAssets(){
        
        var itemsGroup = game.add.group()
        leftGroup.platform.add(itemsGroup)
        leftGroup.items = itemsGroup
        
        var marksGroup = game.add.group()
        leftGroup.platform.add(marksGroup)
        leftGroup.marks = marksGroup
        
        
        var weightsGroup = game.add.group()
        rightGroup.platform.add(weightsGroup)
        rightGroup.weights = weightsGroup
        
        
        for(var i = 0; i < 5; i++){
            
            var item = itemsGroup.create(leftGroup.platform.base.x, leftGroup.platform.base.centerY, "atlas.climbOWeight", "item" + i)
            item.anchor.setTo(0.5)
            item.scale.setTo(0.7)
            item.alpha = 0
            
            var mark = marksGroup.create(leftGroup.platform.base.x, leftGroup.platform.base.centerY + 60,  "atlas.climbOWeight", "mark" + i)
            mark.anchor.setTo(0.5, 0)
            mark.alpha = 0
            
            
            var weight = weightsGroup.create(rightGroup.platform.base.x, rightGroup.platform.base.centerY + ((5 - i) * 7), "atlas.climbOWeight", "weight" + i)
            weight.anchor.setTo(0.5, 0)
            weight.scale.setTo(1.2)
            weight.alpha = 0
        }
    
        item = itemsGroup.create(leftGroup.platform.base.x, leftGroup.platform.base.centerY + 20, "atlas.climbOWeight", "item5")
        item.anchor.setTo(0.5)
        item.scale.setTo(0.8)
        item.alpha = 0
        
        item = itemsGroup.create(leftGroup.platform.base.x, leftGroup.platform.base.centerY + 50, "atlas.climbOWeight", "item6")
        item.anchor.setTo(0.5)
        item.scale.setTo(0.8)
        item.alpha = 0
        
        itemsGroup.children[2].y += 20
    }
    
    function looneyTunes(){
        
        circleGroup = game.add.group()
        sceneGroup.add(circleGroup)
        
        for(var i = 0; i < 5; i++){
            
            var circle = circleGroup.create(game.world.centerX, game.world.centerY - 300, "atlas.climbOWeight", "circle" + (4 - i))
            circle.anchor.setTo(0.5) 
            circle.scale.setTo(1.7, 1.6)
        }

        circleGroup.circle = circle
    
        var ball = game.add.graphics(0,0)
        ball.beginFill(0xFFFFFF)
        ball.drawCircle(circle.centerX, circle.centerY, 20)
        circleGroup.add(ball)
        circleGroup.ball = ball
    }
    
    function swingWithMe(){
        
        circleGroup.ball.startTween = game.add.tween(circleGroup.ball).to({x:  - circleGroup.circle.width * 0.5 + 10}, swingTime * 0.5, Phaser.Easing.linear, true)
        circleGroup.ball.startTween.onComplete.add(function(){
            circleGroup.ball.tween.start()
        })
        
        circleGroup.ball.tween = game.add.tween(circleGroup.ball).to({x: circleGroup.circle.width * 0.5 - 10}, swingTime, Phaser.Easing.linear, false, 0, -1)
        circleGroup.ball.tween.yoyo(true, 0)
    }
    
    function getCircle(){
        
        if(gameActive){
            
            changeImage(0, stopBtn)
            stopBtn.text.alpha = 1
            stopBtn.text.scale.setTo(0.9)
            
            gameActive = false
            
            if(circleGroup.ball.startTween)
                circleGroup.ball.startTween.stop()
            circleGroup.ball.tween.stop()
            
            var pos = Math.abs(circleGroup.ball.x)
            var circle = circleGroup.circle
            
//            console.log("circle " + circle.width * 0.125)
//            console.log(pos)
            
            switch(true){
                case pos >= circle.width * 0.37: //red
                    dropWeight(4)
                break
                case pos < circle.width * 0.37 && pos >= circle.width * 0.28: //orange
                    dropWeight(3)
                break
                case pos < circle.width * 0.28 && pos >= circle.width * 0.2: //yellow
                    dropWeight(2)
                break
                case pos < circle.width * 0.2 && pos >= circle.width * 0.125: //green
                    dropWeight(1)
                break
                case pos < circle.width * 0.125: //blue
                    dropWeight(0)
                break
            }
        }
    }
    
    function dropWeight(index){
        
        changeImage(index ,rightGroup.weights)
        
        var level = Math.abs(index - 4)
        var timer = (index * 200) + 100
        
        game.add.tween(rightGroup.weights.children[index]).from({y: -100}, 300, Phaser.Easing.linear, true).onComplete.add(function(){
            particleWrong.x = rightGroup.weights.centerX
            particleWrong.y = rightGroup.weights.centerY + 30
            particleWrong.start(true, 600, null, 10)
            
            game.add.tween(leftGroup.rope).to({height: towerlevels[level].rope}, timer, Phaser.Easing.linear, true)
            game.add.tween(leftGroup.platform).to({y: towerlevels[level].base}, timer, Phaser.Easing.linear, true)

            game.add.tween(rightGroup.rope).to({height: towerlevels[index].rope}, timer, Phaser.Easing.linear, true)
            game.add.tween(rightGroup.platform).to({y: towerlevels[index].base}, timer, Phaser.Easing.linear, true).onComplete.add(function(){
                win(index)
            })
        })
    }
    
    function win(ans){
        
        if(ans === rand){
            addCoin(leftGroup.items)
            justice.setAnimationByName(0, "WIN", true)
            particleCorrect.x = leftGroup.items.centerX
            particleCorrect.y = leftGroup.items.centerY 
            particleCorrect.start(true, 1200, null, 10)
        }
        else{
            missPoint()
            justice.setAnimationByName(0, "LOSE", true)
            particleWrong.x = leftGroup.items.centerX
            particleWrong.y = leftGroup.items.centerY 
            particleWrong.start(true, 1200, null, 10)
        }
        
        if(pointsBar.number !== 0 && pointsBar.number % 5 === 0){
            swingTime -= 500
        }
        
        if(lives !== 0){
            game.time.events.add(1500,function(){

                game.add.tween(circleGroup.ball).to({x:  0}, 800, Phaser.Easing.linear, true)

                for(var i = 0; i < leftGroup.items.length; i++)
                    game.add.tween(leftGroup.items.children[i]).to({alpha: 0}, 300, Phaser.Easing.linear, true)

                game.add.tween(leftGroup.marks.children[rand]).to({alpha: 0}, 300, Phaser.Easing.linear, true)
                game.add.tween(leftGroup.rope).to({height: bottomPos.rope}, 800, Phaser.Easing.linear, true)
                game.add.tween(leftGroup.platform).to({y: bottomPos.base}, 800, Phaser.Easing.linear, true)

                game.add.tween(rightGroup.weights.children[rand]).to({alpha: 0}, 300, Phaser.Easing.linear, true)
                game.add.tween(rightGroup.rope).to({height: topPos.rope}, 800, Phaser.Easing.linear, true)
                game.add.tween(rightGroup.platform).to({y: topPos.base}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
                    justice.setAnimationByName(0, "IDLE", true)
                    initGame()
                })
            },this)
        }
    }
    
    function initGame(){
        
        var time = riddleMeThis()
        
        game.time.events.add(time + 500,function(){
            gameActive = true
            swingWithMe()
            //circleGroup.ball.startTween.start()
        },this)
    }
    
    function riddleMeThis(){
        
        var delay = 200
        
        rand = getRand()
        
        popObject(leftGroup.marks.children[rand], delay)
        delay += 200
        popObject(leftGroup.items.children[game.rnd.integerInRange(0, leftGroup.items.length-1)], delay)
        
        return delay
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, leftGroup.marks.length-1)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x: 0, y:0},200,Phaser.Easing.linear,true)
        },this)
    }
	
	return {
		
		assets: assets,
		name: "climbOWeight",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            spaceSong = sound.play("spaceSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            pulleyDance()
            createAssets()
            looneyTunes()
            judgeDredd()
            initCoin()
            createParticles()
			
			buttons.getButton(spaceSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()