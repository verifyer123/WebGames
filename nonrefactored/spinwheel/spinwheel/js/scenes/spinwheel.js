var soundsPath = "../../shared/minigames/sounds/"
var spinwheel = function(){

	assets = {
        atlases: [                
			{
				name: "atlas.jump",
                json: "images/spinwheel/atlas.json",
                image: "images/spinwheel/atlas.png"
			}],
        images: [],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"}
		],
	}
    

	
    function preload() {
        game.load.spine('animations', "images/spines/skeleton.json");		
		game.load.image("fondo", "images/spinwheel/fondo-01.png");
		game.load.image("barra2", "images/spinwheel/barra2.png");
		game.load.image("barra2", "images/spinwheel/barra2.png");
		game.load.image('yogotar', 'images/spinwheel/yogotar.png');
		game.load.image('corazon', 'images/spinwheel/life_box.png');
		game.load.image('stars', 'images/spinwheel/starPart.png');
		game.load.image('xpcoins', 'images/spinwheel/xpcoins.png');
		game.load.physics('fisica', 'images/spinwheel/fisica2.json');
		game.load.audio('runningSong', soundsPath + 'songs/running_game.mp3');
   		game.load.spritesheet('coins', 'images/spinwheel/coinS.png', 68, 70, 12);

	}
	
	
	
	var bars = new Array;
	var coinsArray = new Array;
	var bgm = null;
	var pressButton = null;
	var moveBar = null;
	var yogotar;
	var stars;
	var yogotarPosition;
	var buddy;
	var bgSpine;
	var bgSpine2;
	var blockCollisionGroup;
	var activeBar;
	var gameStart = false;
	var bgGroup;	
	var times = 10;
	var count = 0;
	var lastBar;
	var gameOver = null;
	var pointsBar = null;
	var coinsSprite;
	var hearts;
	var heartsText;
	var xpcoins;
	var xpcoinsText;
	var lives = 1;
	var coins = 0;
	
	var timeDelay = 2000;
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	
	function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
        gameActive = false
        moveUp = false
        objectsGroup = null
        lives = 1 
	}	
	
	function addPoint(obj,part){
	 //var pointsImg = pointsBar.create(10,10,'atlas.amazingbros','xpcoins')
	}
	

    function createScene(){
	loadSounds();	
	bgGroup = game.add.group();
	
		
	
	game.physics.startSystem(Phaser.Physics.ARCADE);	
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 300;
    
	
		
	bgSpine = bgGroup.create(0, 0,"fondo");
	bgSpine.anchor.setTo(0, 0);	
	
		
	bgSpine2 = bgGroup.create(0, 0,"fondo");
	bgSpine2.anchor.setTo(0, 0);	
	bgSpine2.x = bgSpine.x + bgSpine.width - 10;
		
		
	xpcoins = game.add.sprite(0,15,"xpcoins");
	xpcoinsText = game.add.text(50, 10, " " + "0", style);	
		
	hearts = game.add.sprite(450,5,"corazon");
	heartsText = game.add.text(500, 10, " x " + lives, style);
		
    yogotar = game.add.sprite(140, 200,"yogotar");
	yogotar.anchor.setTo(0.5, 0.5);	
		
	stars = game.add.sprite(0,0,"stars");	
	stars.anchor.setTo(0.5, 0.5);		
	stars.alpha = 0;	
	buddy = game.add.spine(140,200, "animations");
    buddy.scale.setTo(0.22,0.22);
    buddy.setAnimationByName(0, "RUN", true);
    buddy.setSkinByName('normal');	
		
				
	blockCollisionGroup = game.physics.p2.createCollisionGroup();
		
	game.physics.p2.updateBoundsCollisionGroup();
		game.physics.p2.setImpactEvents(true);
    
    //  Enable the physics bodies on all the sprites
    game.physics.p2.enable(yogotar , true);
		
    yogotar.body.clearShapes();
    yogotar.body.setCircle(55);
    yogotar.body.setCollisionGroup(blockCollisionGroup);
    yogotar.body.collides([blockCollisionGroup]);	
	yogotar.body.collideWorldBounds = true;
	yogotar.body.mass = 1000;	
	

		 
	
	function createBars(times){
		for(var i = 0;i<times;i++){
			bars[i] = game.add.sprite(0, 0,"barra2");
			bars[i].anchor.setTo(0.5, 0.5);	

			if(i != 0){
				bars[i].x = bars[i-1].x + bars[i-1].width + 20;
				bars[i].y = bars[0].y + getRandomArbitrary(-100, 100) ;	

			}else{
				bars[i].x = 140;
				bars[i].y = 400;		
			}
		
		
			
				coinsArray[i] = game.add.sprite(0, 0,"coins");
				coinsArray[i].anchor.setTo(0.5, 0.5);
				
				coinsArray[i].x = (bars[i].x  + getRandomArbitrary(0, 200) ) * 2;
				coinsArray[i].y =  bars[i].y - getRandomArbitrary(150, 200); 
				
			
			    coinsArray[i].animations.add('walk');
				coinsArray[i].animations.play('walk',24,true); 
			
			
				
			
			game.physics.p2.enable([bars[i], coinsArray[i]], false);

			
			coinsArray[i].body.clearShapes();
			coinsArray[i].body.setRectangle(coinsArray[i].width, coinsArray[i].height);
			coinsArray[i].body.setCollisionGroup(blockCollisionGroup);
			coinsArray[i].body.collides([blockCollisionGroup],hitYogotar,this);
			coinsArray[i].body.static = true;
            coinsArray[i].enableBody = true;
    		coinsArray[i].physicsBodyType = Phaser.Physics.P2JS;
			coinsArray[i].body.allowSleep = true;
			//coinsArray[i].body.data.shapes[0].sensor = true;
			coinsArray[i].body.mass = -10000;
			
							
			bars[i].body.clearShapes();
			bars[i].body.setRectangle(bars[i].width, bars[i].height);
    		bars[i].body.setCollisionGroup(blockCollisionGroup);
    		bars[i].body.collides([blockCollisionGroup]);
			bars[i].body.static = true;
			//bars[i].body.data.gravityScale = 0;
			bars[i].body.mass = 0;
			bars[i].inputEnabled = true;
    		bars[i].input.enableDrag(true);
			bars[i].events.onDragStart.add(dragStart,this);
			bars[i].events.onDragUpdate.add(dragUpdate,this);
			bars[i].input.setDragLock(false, false);			
		}
		
		activeBar = bars[0] 
	}
	
	createBars(times)	
	
	lastBar = bars.length-1;
		console.log(lastBar);

	function hitYogotar(body1 , body2){
		coins++;
		xpcoinsText.setText(coins);
		console.log("coins");
		body1.sprite.alpha = 0;
		body1.data.shapes[0].sensor = true;
		sound.play("pop");
		game.physics.p2.gravity.y = game.physics.p2.gravity.y + 20;
		stars.x = body1.x;
		stars.y = body1.y;
		
		game.add.tween(stars.scale).to( { x:1.1 }, timeDelay, Phaser.Easing.Linear.None, true);
		var tweenAlpha = game.add.tween(stars).to({alpha : 1},timeDelay*0.1,Phaser.Easing.linear,true)
                tweenAlpha.onComplete.add(function(){
                    game.add.tween(stars).to({alpha : 0},timeDelay*0.1,Phaser.Easing.linear,true);
					
                })
	}	
		
	function dragStart(object){
	activeBar = object
	gameStart = true;
	}
		
	
		
	function dragUpdate(object){
	//activeBar = object
		yogotarPosition = yogotar.y;
	object.body.angle = game.physics.arcade.angleToPointer(object) *20;
		if(yogotarPosition < yogotarPosition * 2){
			//sound.play("shootBall");
		}
	
		
	}		
	

		
			bgm = game.add.audio('runningSong')
            game.sound.setDecodedCallback(bgm, function(){
                //marioSong.loopFull(0.6)
            }, this);
		
		bgm.loopFull(0.5);
		
    }
	

	function moveBars(times){
		for(var i = 0; i<=times -1 ; i++){
			
			/*var posx1 = coinsArray[i].body.x
			var posy1 = coinsArray[i].body.y
			
			var posx2 = yogotar.body.x
			var posy2 = yogotar.body.y	
			
			var actualpositionx = posx1 - posx2;
			var actualpositiony = posy1 - posy2;
			
			
			if(actualpositionx <= 10 && actualpositiony <= 10){
			console.log("choco la combi")
			};*/
			
			bars[i].body.x = bars[i].body.x - yogotar.body.x/100;
			coinsArray[i].body.x = coinsArray[i].body.x - yogotar.body.x/100;
			if(bars[i].body.x <= 0){
				bars[i].body.x = bars[lastBar].body.x + bars[lastBar].width + 20;
				bars[i].body.y = bars[0].body.y + getRandomArbitrary(-100, 100); 
				lastBar = i;
			}
			
			if((coinsArray[i].body.x)*2 <= 0){
				coinsArray[i].body.sprite.alpha = 1;
				coinsArray[i].body.x = (bars[lastBar].body.x + bars[lastBar].width + 20) * 2;
				coinsArray[i].y =  bars[i].y - getRandomArbitrary(150, 200);
				coinsArray[i].body.data.shapes[0].sensor = false;
			}
			
		}
		

	}
	


	function gameOverFunction(){
		
		
		if(count == 1){
		yogotar.body.static = false;
		heartsText.setText("x 0");
		heartsText.x = 510;
		game.add.tween(heartsText.scale).to({x:1.2, y:1.2}, 1000, Phaser.Easing.Back.Out, true);		
		buddy.setAnimationByName(0, "HITWEAK", false);
		console.log("perdio");
		gameOver = false;
			 bgm.stop();
			sound.play("gameLose");
		 var tweenLose1 = game.add.tween(yogotar.scale).to({x:3, y:3}, 1000, Phaser.Easing.Back.Out, true);	
		 var tweenLose1 = game.add.tween(yogotar).to({alpha:0}, 100, Phaser.Easing.Linear.Out, true)
		 var tweenLose = game.add.tween(buddy).to({y:buddy.y - 150}, 1000, Phaser.Easing.Cubic.Out, true)	
        tweenLose.onComplete.add(function(){
			game.add.tween(heartsText.scale).to({x:1, y:1}, 1000, Phaser.Easing.Back.Out, true);
            game.add.tween(buddy).to({y:buddy.y + game.world.height}, 500, Phaser.Easing.Cubic.In, true)
			yogotar.body.collideWorldBounds = false;

        })	
			
		}
	}
	
function update() {
	
	
	
	
		buddy.x = yogotar.x;
		buddy.y = yogotar.y + 45;	
	
		if(!gameStart){
			
		}else{
			//activeBar.body.rotation = game.physics.arcade.angleToPointer(activeBar);

		}

	if(yogotar.x >= game.world.width*0.5){
		yogotar.body.x = game.world.width*0.5;
		blockCollisionGroup.x -= 100; 
		if(count == 0){
		moveBars(times);
		}

	}	
	
	
	if(yogotar.y >= game.world.height*0.8){
		gameOver = true;
		count++;
		gameOverFunction();
	}
	


}
	
	return {
		assets: assets,
		name: "spinwheel",
		create: createScene,
        preload: preload,
		update:update,
		show: function(event){
			loadSounds()
			initialize()
		}
		
		
	}

}()