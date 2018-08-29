
var soundsPath = "../../shared/minigames/sounds/"

var clash = function(){

    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"�C�mo jugar?"
        }
    }


    var assets = {
        atlases: [
            {
                name: "atlas.clash",
                json: "images/clash/atlas.json",
                image: "images/clash/atlas.png"
            },
        ],
        images: [
            {   name:"fondo",
                file: "images/clash/fondo.png"},
            {   name:"tutorial_image",
                file: "images/clash/tutorial_image.png"}
        ],
        sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
            {	name: "magic",
                file: soundsPath + "magic.mp3"},
            {	name: "throw",
                file: soundsPath + "throw.mp3"},
            {	name: "cut",
                file: soundsPath + "cut.mp3"},
            {	name: "flip",
                file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
                file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {	name: "right",
                file: soundsPath + "rightChoice.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "hit",
                file: soundsPath + "towercollapse.mp3"},
            {   name: "whoosh",
                file: soundsPath + "whoosh.mp3"},
            {   name: "bah",
                file: soundsPath + "bah.mp3"},
            {   name: "explosion",
                file: soundsPath + "fireExplosion.mp3"},
            {   name: "clashSong",
                file: soundsPath + "songs/technology_action.mp3"}
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
            },
            {   name: "redShot",
                file: "images/spines/red.png",
                width: 301,
                height: 255,
                frames: 19
            },
            {   name: "blueShot",
                file: "images/spines/blue.png",
                width: 243,
                height: 221,
                frames: 19
            },
            {   name: "whiteShot",
                file: "images/spines/white.png",
                width: 353,
                height: 240,
                frames: 10
            }
        ],
        spines:[
			{
				name:"monsters",
				file:"images/spines/monster/monster.json"
			},
            {
				name:"dino",
				file:"images/spines/dino/dino.json"
			}
		]
    }

    var NUM_LIFES = 3
    var NUM_OPTIONS = 3
    var MAX_HP = 7

    var ROUNDS = [
        {maxNumber: 5, operator:["+", "-"]}
        ]

    var MONSTERS = [
        {skin:"monster2", colorProyectile:"0xFFFE00", name:"Carpy"},
        {skin:"monster1", colorProyectile:"0x84FF00", name:"Tempest"},
        {skin:"monster3", colorProyectile:"0xFF8B00", name:"Serguh"},
        {skin:"monster4", colorProyectile:"0x30FF00", name:"Slipster"},
        {skin:"monster5", colorProyectile:"0x00FFF5", name:"Aquamander"},
        {skin:"monster6", colorProyectile:"0xF400FF", name:"Leglens"},
        {skin:"monster7", colorProyectile:"0xFF000C", name:"Armster"},
        {skin:"monster8", colorProyectile:"0x00FF89", name:"Bathead"},
        {skin:"BOSS", colorProyectile:"0x0057FF", name:"Skymera"}
        ]
    
    var DINOS = [
        {skin:"red", colorProyectile:"0xFF0000", name: "Blastrex"},
        {skin:"blue", colorProyectile:"0x00CCF5", name: "Icerex"},
        {skin:"white", colorProyectile:"0xFFFE00", name: "Windrex"},
        ]

    var lives
    var sceneGroup = null
    var tutoGroup
    var clashSong
    var pullGroup = null
    var timeValue
    var gameActive
    var pointsBar
    var monsterCounter
    var dinoCounter
    var monster
    var dino
    var clashGroup
    var indicator
    var coin
    var hand

    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff"

        lives = NUM_LIFES
        timeValue = 7
        monsterCounter = 0
        dinoCounter = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        gameActive = false

        loadSounds()
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.clash','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsBar.add(pointsText)
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

        var heartImg = group.create(0,0,'atlas.clash','life_box')

        pivotX += heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        heartsGroup.text = pointsText
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
    }
    
    function missPoint(obj){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame()
        }
    }

    function tweenTint(obj, startColor, endColor, time, delay, callback) {
        // check if is valid object
        time = time || 250
        delay = delay || 0

        if (obj) {
            // create a step object
            var colorBlend = { step: 0 };
            // create a tween to increment that step from 0 to 100.
            var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
            // add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
            colorTween.onUpdateCallback(function () {
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step)
            })
            // set object to the starting colour
            obj.tint = startColor;
            // if you passed a callback, add it to the tween on complete
            if (callback) {
                colorTween.onComplete.add(callback, this);
            }
            // finally, start the tween
            colorTween.start();
        }
    }
    
    function receiveAttack() {
        dino.hpBar.removeHealth(2)
        sound.play("hit")

        dino.statusAnimation = dino.hpBar.health < 3 ? "tired" : "idle"
        dino.setAnimation(["hit", dino.statusAnimation])
        dino.hit.start(true, 2000, null, 5)
        
        if(dino.hpBar.health > 0)
            game.time.events.add(1000, startRound)
        else{
            // dino.setAnimation(["HIT", "IDLE"])
            missPoint()
            if(lives > 0){
                changePet()
            }
            else{
                game.time.events.add(400, stopGame)
            }
        }
    }
    
    function changePet(){
        
        sound.play("bah")
        dino.setAlive(false)
        game.add.tween(dino).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true, 500).onComplete.add(function(){
            dinoCounter++
            dino.setSkinByName(DINOS[dinoCounter].skin)
            dino.hpBar.resetHealth()
            dino.alpha = 1
            dino.setAlive(true)
            dino.statusAnimation = "idle"
            dino.setAnimation([dino.statusAnimation])
            dino.name.setText(DINOS[dinoCounter].name)
            monster.hit.forEach(function(particle) {particle.tint = DINOS[dinoCounter].colorProyectile})
            game.add.tween(dino).from({x:-200}, 800, Phaser.Easing.Cubic.Out, true, 800).onComplete.add(startRound)
        })
    }

    function monsterAttack(){

        gameActive = false
        if (monster.hpBar.health > 0){
            monster.setAnimation(["ATTACK", monster.statusAnimation])

            var from = {}
            from.x = monster.x
            from.y = monster.y - monster.height * 0.5 - 20

            var target = {}
            target.x = dino.x + 80
            target.y = dino.y - dino.height * 0.5 + 40

            var scale = {from:{x: 0.4, y: 0.4}, to:{x: 1, y: 1}}

            createProyectile(from, target, scale, monster.proyectile, receiveAttack, false)
        }
    }
    
    function killMonster() {
        monster.setAnimation(["HIT", monster.statusAnimation])

        game.time.events.add(400, function () {
            monster.setAlive(false)
            var dissapear = game.add.tween(monster).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
            dissapear.onComplete.add(function () {
                sound.play("cut")

                monster.x = game.world.width + 120
                monster.alpha = 1
                monster.setAlive(true)
                monster.statusAnimation = "IDLE"
                monster.setAnimation([monster.statusAnimation])

                monsterCounter = monsterCounter + 1 < MONSTERS.length ? monsterCounter + 1 : 0
                monster.setSkinByName(MONSTERS[monsterCounter].skin)
                monster.hpBar.resetHealth()
                var newMonster = game.add.tween(monster).to({x:game.world.width - 150}, 800, Phaser.Easing.Cubic.Out, true, 1300)
                newMonster.onComplete.add(startRound)
                monster.name.setText(MONSTERS[monsterCounter].name)

                monster.proyectile = MONSTERS[monsterCounter].colorProyectile
                dino.hit.forEach(function(particle) {particle.tint = MONSTERS[monsterCounter].colorProyectile})
            })
        })

    }
    
    function monsterHit() {
        sound.play("hit")

        var healthToRemove
        if (indicator.x > 118)
            healthToRemove = 9
        else if(indicator.x > 55)
            healthToRemove = 4
        else if(indicator.x > 0)
            healthToRemove = 3
        else if(indicator.x > -122)
            healthToRemove = 2
        else
            healthToRemove = 1
        
        addCoin(dino)

        monster.hpBar.removeHealth(healthToRemove)
        monster.statusAnimation = monster.hpBar.health < 3 ? "TIRED" : "IDLE"
        monster.setAnimation(["HIT", monster.statusAnimation])
        monster.hit.start(true, 2000, null, 5)

        if(monster.hpBar.health > 0)
            game.time.events.add(1000, startRound)
        else
            game.time.events.add(1500, killMonster)
    }

    function createProyectile(from, target, scale, color, onComplete, animated){
        sound.play("throw")

        if(animated){
            
            var proyectile = game.add.sprite(0, 0, DINOS[dinoCounter].skin + "Shot")
            proyectile.animations.add('shot')
            proyectile.animations.play('shot', 24, true)
            sceneGroup.add(proyectile)
        }
        else{
            var proyectile = sceneGroup.create(0, 0, 'atlas.clash', 'proyectile')
            proyectile.tint = color
        }
        
        proyectile.x = from.x
        proyectile.y = from.y
        proyectile.scale.x = scale.from.x
        proyectile.scale.y = scale.from.y
        proyectile.anchor.setTo(0.5, 0.5)
        proyectile.angle = 0

        game.add.tween(proyectile).to({x: target.x, angle: 60}, 800, null, true)
        game.add.tween(proyectile.scale).to({x: scale.to.x, y: scale.to.y}, 800, null, true)

        var first = game.add.tween(proyectile).to({y: 40}, 400, Phaser.Easing.Cubic.Out, true)
        first.onComplete.add(function () {
            game.add.tween(proyectile).to({y: target.y}, 400, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                game.add.tween(proyectile).to({alpha: 0}, 200, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
                    proyectile.destroy()
                })
                if (onComplete)
                    onComplete()
            })
        })

    }

    function hideQuestion(){
        game.add.tween(clashGroup.number1).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(clashGroup.operator).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(clashGroup.number2).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)

        for(var optionIndex = 0; optionIndex < clashGroup.options.length; optionIndex++) {
            var option = clashGroup.options[optionIndex]
            game.add.tween(option.scale).to({x:0.2, y:0.2}, 800, Phaser.Easing.Cubic.Out, true)
            game.add.tween(option).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
        }
    }

    function checkAnswer(circle) {

        if(gameActive){
           
            gameActive = false
            var option = circle.parent
            indicator.timer.stop()
            if(hand){
                hand.destroy()
                turnBtns(true)
            }
                

            game.add.tween(option.scale).to({x: 1.2, y: 1.2}, 200, Phaser.Easing.Cubic.Out, true, 0, 0, true)
            
            var indicatorEffect = game.add.tween(indicator.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Cubic.Out, true)
            indicatorEffect.onComplete.add(function () {
                game.add.tween(indicator.scale).to({x: 0.6, y: 0.6}, 500, null, true, 1000)
            })

            if (option.number === clashGroup.answer) {
                tintBtns(circle)
                var particleCorrect = clashGroup.correctParticle
                particleCorrect.x = option.x
                particleCorrect.y = option.y
                particleCorrect.start(true, 2000, null, 6)

                var soundName
                sound.play("right")
                if(indicator.x > 118){
                    soundName = "explosion"
                    dino.setAnimation(["critical", dino.statusAnimation])
                }else{
                    dino.setAnimation(["attack", dino.statusAnimation])
                }

                game.time.events.add(500,function() {
                    var from = {}
                    from.x = dino.x + 140
                    from.y = dino.y - dino.height * 0.5 + 20

                    var target = {}
                    target.x = monster.x
                    target.y = monster.y - monster.height * 0.5

                    var scale = {from:{x: 1, y: 1}, to:{x: 0.4, y: 0.4}}
                    if(soundName)
                        sound.play(soundName)
                    createProyectile(from, target, scale, dino.proyectile, monsterHit, true)
                })

            }else{
                var particleWrong = clashGroup.wrongParticle
                particleWrong.x = option.x
                particleWrong.y = option.y
                sound.play("wrong")
                showCorrect()
                particleWrong.start(true, 2000, null, 6)
                game.time.events.add(500, monsterAttack)
            }
        }
    }
    
    function tintBtns(circle){
        var group = circle.parent
        for(var i = 0; i < clashGroup.options.length; i++){
            var cir = clashGroup.options[i].circle
            if(cir != circle)
                tweenTint(cir, 0xffffff, 0x9B9B9B, 300)
        }
    }
    
    function showCorrect(){
        
        for(var optionIndex = 0; optionIndex < clashGroup.options.length; optionIndex++) {
            var option = clashGroup.options[optionIndex]
            if(option.number !== clashGroup.answer){
                game.add.tween(option.scale).to({x:0.2, y:0.2}, 800, Phaser.Easing.Cubic.Out, true)
                game.add.tween(option).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
            }
            else{
                game.add.tween(option.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true, 0, 0, true)
            }
        }
    }

    function createHpbar(){
        var hpGroup = game.add.group()
        hpGroup.health = 7

        var hpBg = sceneGroup.create(0, 0, 'atlas.clash', 'hp_bar')
        hpBg.anchor.setTo(0.5, 0.5)
        hpGroup.add(hpBg)

        var startX = -hpBg.width * 0.5 + 20
        var spaceWidth = hpBg.width / MAX_HP - 2
        hpGroup.circles = []
        for(var circleIndex = 0; circleIndex < MAX_HP; circleIndex++){
            var x = startX + spaceWidth * circleIndex
            var graphics = game.add.graphics(0, 0);
            graphics.beginFill(0xFF0000, 1);
            graphics.drawCircle(x, 0, 22);
            hpGroup.add(graphics)
            hpGroup.circles.push(graphics)
        }

        hpGroup.removeHealth = function (number) {
            for(var hpIndex = 0; hpIndex < number; hpIndex++){
                var circle = this.circles[this.health - 1 - hpIndex]
                if(circle){
                    game.add.tween(circle).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true)
                    game.add.tween(circle).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 300)
                    game.add.tween(circle).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true, 600)
                    game.add.tween(circle).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 900)
                    game.add.tween(circle).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true, 1200)
                }
            }
            this.health -= number
        }

        hpGroup.resetHealth = function () {
            this.health = MAX_HP
            for(var hpIndex = 0; hpIndex < this.circles.length; hpIndex++){
                var circle = this.circles[hpIndex]
                if(circle){
                    game.add.tween(circle).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true)
                }
            }
        }

        return hpGroup
    }

    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        var grass = sceneGroup.create(0, 0, 'atlas.clash', 'grass')
        grass.anchor.setTo(0.5, 0.5)
        grass.scale.setTo(0.65, 0.65)
        // hpBar1.removeHealth(2)

        monster = createSpine("monsters", MONSTERS[monsterCounter].skin, "IDLE")
        monster.x = game.world.width - 140
        monster.y = monster.height + 50
        monster.scale.setTo(0.8, 0.8)
        sceneGroup.add(monster)
        grass.x = monster.x
        grass.y = monster.y
        monster.proyectile = MONSTERS[monsterCounter].colorProyectile
        monster.statusAnimation = "IDLE"

        var explode = createPart("proyectile")
        explode.y = -monster.height * 0.5
        monster.add(explode)
        monster.hit = explode
        monster.hit.forEach(function(particle) {particle.tint = 0xff0000})

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#350A00", align: "center"}
        var monsterName = new Phaser.Text(game, 0, 5, MONSTERS[monsterCounter].name, fontStyle)
        monsterName.x = monster.x - 340
        monsterName.y = monster.y - monster.height + 30
        monsterName.anchor.setTo(0,0.5)
        sceneGroup.add(monsterName)
        monster.name = monsterName

        var hpBar1 = createHpbar()
        hpBar1.x = monster.x - 240
        hpBar1.y = monsterName.y + 38
        sceneGroup.add(hpBar1)
        monster.hpBar = hpBar1

        var grass2 = sceneGroup.create(0, 0, 'atlas.clash', 'grass')
        grass2.anchor.setTo(0.5, 0.5)

        dino = createSpine("dino", "red")
        dino.x = 130
        dino.y = dino.height + 300
        dino.proyectile = DINOS[dinoCounter].colorProyectile
        sceneGroup.add(dino)
        grass2.x = dino.x - 8
        grass2.y = dino.y - 40
        dino.statusAnimation = "idle"

        var explodeDino = createPart("proyectile")
        dino.add(explodeDino)
        explodeDino.y = -dino.height * 0.5 + 40
        dino.hit = explodeDino
        dino.hit.forEach(function(particle) {particle.tint = MONSTERS[monsterCounter].colorProyectile})

        var dinoName = new Phaser.Text(game, 0, 5, DINOS[dinoCounter].name, fontStyle)
        dinoName.x = dino.x + 350
        dinoName.y = dino.y - 100
        dinoName.anchor.setTo(1,0.5)
        sceneGroup.add(dinoName)
        dino.name = dinoName

        var hpBar2 = createHpbar()
        hpBar2.x = dino.x + 290
        hpBar2.y = dinoName.y + 38
        sceneGroup.add(hpBar2)
        dino.hpBar = hpBar2

    }

    function createPart(key){

        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.clash',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2500, Phaser.Easing.Cubic.In)

        return particle

    }

    function stopGame(){

        //objectsGroup.timer.pause()
        //timer.pause()
        sound.play("bah")
        
        dino.setAlive(false)
        game.add.tween(dino).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true, 600)
        gameActive = false

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1800)
        tweenScene.onComplete.add(function(){

            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number)

            //amazing.saveScore(pointsBar.number)
            clashSong.stop()
            sceneloader.show("result")
            sound.play("gameLose")
        })
    }

    function preload(){

        game.stage.disableVisibilityChange = false
    }

    function startRound() {
        hideQuestion()
        indicator.tweenRestart.start()
        game.time.events.add(1000, generateQuestion)
        timeValue-=timeValue * 0.10
    }
    
    function numbersEffect() {
        sound.play("cut")

        clashGroup.number1.alpha = 0
        clashGroup.operator.alpha = 0
        clashGroup.number2.alpha = 0

        clashGroup.number1.scale.x = 0.2
        clashGroup.number1.scale.y = 0.2
        clashGroup.operator.scale.x = 0.2
        clashGroup.operator.scale.y = 0.2
        clashGroup.number2.scale.x = 0.2
        clashGroup.number2.scale.y = 0.2

        game.add.tween(clashGroup.number1.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(clashGroup.operator.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(clashGroup.number2.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(clashGroup.number1).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(clashGroup.operator).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(clashGroup.number2).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
    }

    function startIndicator(delay) {
        var timeTween = timeValue * 1000
        indicator.timer = game.add.tween(indicator).to({x:-190}, timeTween, null, true, delay)
        indicator.timer.onComplete.add(monsterAttack)
    }

    function generateQuestion() {
        // var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]
        var round = ROUNDS[0]

        var number1 = game.rnd.integerInRange(1, round.maxNumber)
        var number2 = game.rnd.integerInRange(1, round.maxNumber)
        var answer

        var operation = round.operator[game.rnd.integerInRange(0, 1)]
        // if(round.operator === "random")
        //     operation = OPERATIONS[game.rnd.integerInRange(0, OPERATIONS.length - 1)]

        if (operation === "+"){
            answer = number1 + number2
        }else if(operation === "-"){
            if (number2 > number1){
                var prev = number2
                number2 = number1
                number1 = prev
            }
            answer = number1 - number2
        }

        clashGroup.answer = answer
        clashGroup.number1.setText(number1)
        clashGroup.operator.setText(operation)
        clashGroup.number2.setText(number2)
        numbersEffect()

        var fakeAnswers = []
        for(var answerIndex = 0; answerIndex < round.maxNumber + round.maxNumber + 1; answerIndex++){
            if (answerIndex !== answer)
                fakeAnswers.push(answerIndex)
        }

        fakeAnswers = Phaser.ArrayUtils.shuffle(fakeAnswers)

        var delayBetween = 300
        var initialDelay = 800

        var correctBox = game.rnd.integerInRange(0, NUM_OPTIONS - 1)
        for (var optionIndex = 0; optionIndex < NUM_OPTIONS; optionIndex++){

            var option = clashGroup.options[optionIndex]
            option.circle.tint = "0xffffff"
            if (correctBox === optionIndex) {
                option.text.setText(answer)
                option.number = answer
            }
            else {
                option.text.setText(fakeAnswers[optionIndex])
                option.number = fakeAnswers[optionIndex]
            }

            var delayOption = delayBetween * optionIndex + initialDelay

            game.add.tween(option.scale).to({x:1, y:1}, 800, Phaser.Easing.Cubic.Out, true, delayOption)
            game.add.tween(option).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true, delayOption).onStart.add(function () {
                sound.play("pop")
            })
        }
        
        delayOption = initialDelay + delayBetween * (NUM_OPTIONS + 1)
        startIndicator(delayOption)

        game.time.events.add(delayOption,function(){
            gameActive = true
        })
    }
    
    function createClashUI() {

        clashGroup = game.add.group()
        clashGroup.x = game.world.centerX
        clashGroup.y = game.height - 200
        sceneGroup.add(clashGroup)

        var colorBox = new Phaser.Graphics(game)
        colorBox.beginFill(0x3D0163)
        colorBox.drawRect(0,0,game.width, 410)
        colorBox.endFill()
        colorBox.x = -game.width * 0.5
        colorBox.y = -200
        clashGroup.add(colorBox)

        var dashboad = clashGroup.create(0, 0, 'atlas.clash', 'dashboard')
        dashboad.anchor.setTo(0.5, 0.5)

        var fontStyle = {font: "54px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var options = []

        var spaceWidth = dashboad.width / 3
        var startX = -dashboad.width * 0.5 + 84
        
        for(var optionIndex = 0; optionIndex < NUM_OPTIONS; optionIndex++){
            var option = game.add.group()
            option.x = startX + spaceWidth * optionIndex
            option.y = 84
            option.alpha = 0
            clashGroup.add(option)

            var optionCircle = option.create(0, 0, 'atlas.clash', 'option')
            optionCircle.anchor.setTo(0.5, 0.5)
            optionCircle.inputEnabled = true
            optionCircle.hitArea = new Phaser.Circle(0,0,optionCircle.width * 1.1)
            optionCircle.events.onInputDown.add(checkAnswer, this)
            option.circle = optionCircle

            var numberText = new Phaser.Text(game, 0, 0, "0", fontStyle)
            // numberText.x = optionCircle.x
            // numberText.y = optionCircle.y - 3
            numberText.anchor.setTo(0.5,0.5)
            option.add(numberText)
            option.text = numberText
            options.push(option)
        }
        clashGroup.options = options

        fontStyle = {font: "72px VAGRounded", fontWeight: "bold", fill: "#350A00", align: "center"}

        var questionGroup = game.add.group()
        questionGroup.y = -50
        clashGroup.add(questionGroup)

        var number1 = new Phaser.Text(game, 0, 5, "00", fontStyle)
        number1.x = -40
        number1.y = 0
        number1.alpha = 0
        number1.anchor.setTo(1,0.5)
        questionGroup.add(number1)
        clashGroup.number1 = number1

        var operator = new Phaser.Text(game, 0, 5, "+", fontStyle)
        operator.x = 0
        operator.y = -5
        operator.alpha = 0
        operator.anchor.setTo(0.5,0.5)
        questionGroup.add(operator)
        clashGroup.operator = operator

        var number2 = new Phaser.Text(game, 0, 5, "00", fontStyle)
        number2.x = 40
        number2.y = 0
        number2.alpha = 0
        number2.anchor.setTo(0,0.5)
        questionGroup.add(number2)
        clashGroup.number2 = number2

        var correctParticle = createPart("star")
        clashGroup.add(correctParticle)
        clashGroup.correctParticle = correctParticle

        var wrongParticle = createPart("smoke")
        clashGroup.add(wrongParticle)
        clashGroup.wrongParticle = wrongParticle

        var barGraphics = game.add.graphics(0, 0)
        barGraphics.lineStyle(8, 0x000000, 1)
        barGraphics.beginFill(0xFFFFFF, 1)
        barGraphics.drawCircle(0, 0, 44)
        // clashGroup.add(barGraphics)
        //190
        indicator = game.add.sprite(-190, -141, barGraphics.generateTexture())
        indicator.anchor.setTo(0.5, 0.5)
        indicator.scale.x = 0.6
        indicator.scale.y = 0.6
        clashGroup.add(indicator)
        barGraphics.destroy()

        indicator.tweenRestart = game.add.tween(indicator).to({x:190}, 900, Phaser.Easing.Cubic.Out)
        indicator.tweenRestart.onStart.add(function () {
            sound.play("whoosh")
        })

    }
    
    function createSpine(skeleton, skin, idleAnimation, x, y) {
        
        idleAnimation = idleAnimation || "idle"
        var spineGroup = game.add.group()
        spineGroup.x = x || 0
        spineGroup.y = y || 0

        var spineSkeleton = game.add.spine(0, 0, skeleton)
        spineSkeleton.x = 0; spineSkeleton.y = 0
        // spineSkeleton.scale.setTo(0.8,0.8)
        spineSkeleton.setSkinByName(skin)
        spineSkeleton.setAnimationByName(0, idleAnimation, true)
        spineGroup.add(spineSkeleton)

        spineGroup.setAnimation = function (animations, onComplete) {

            var entry
            for(var index = 0; index < animations.length; index++) {
                var animation = animations[index]
                var loop = index === animations.length - 1
                if (index === 0)
                    entry = spineSkeleton.setAnimationByName(0, animation, loop)
                else
                    spineSkeleton.addAnimationByName(0, animation, loop)

            }
            if(onComplete){
                entry.onComplete = onComplete
            }
        }
        
        spineGroup.setSkinByName = function (skin) {
            spineSkeleton.setSkinByName(skin)
        }
        
        spineGroup.setAlive = function (alive) {
            spineSkeleton.autoUpdate = alive
        }

        return spineGroup
    }

    function onClickPlay(rect) {
        
        tutoGroup.y = -game.world.height
        //startRound()
        initTutorial()
    }

    function createTutorial(){

        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function createCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
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
    
    function initTutorial(){
        
        //hideQuestion()
        turnBtns(false)
        indicator.tweenRestart.start()
        game.time.events.add(1000, function(){
            generateQuestion()
        
            for (var i = 0; i < NUM_OPTIONS; i++){
                
                if(clashGroup.options[i].number === clashGroup.answer){
                    break
                }
            }
            game.time.events.add(1000, posHand, this, clashGroup.options[i])
        })
    }

    function turnBtns(state){

        for(var i = 0; i < clashGroup.options.length; i++){

            clashGroup.options[i].circle.inputEnabled = state
        }
    }
    
    function posHand(obj){
        
        hand.x = obj.circle.worldPosition.x
        hand.y = obj.circle.worldPosition.y
        indicator.timer.stop()

        game.add.tween(hand).to({alpha:1}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
            obj.circle.inputEnabled = true
        })
    }

    return {
        assets: assets,
        name: "clash",
        preload:preload,
        create: function(event){

            sceneGroup = game.add.group()

            var background = sceneGroup.create(-2, -200,'fondo')
            background.width = game.world.width + 4
            background.height = game.world.height
            
            initialize()
            
            clashSong = sound.play("clashSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this)

            game.onResume.add(function(){
                game.sound.mute = false
            }, this)

            createGameObjects()
            createClashUI()
            createPointsBar()
            createHearts()
            createCoin()
            createTutorial()

            buttons.getButton(clashSong,sceneGroup)

        }
    }
}()