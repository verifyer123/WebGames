var spinwheel = function(){

	assets = {
        atlases: [                
			{
				name: "atlas.jump",
                json: "images/spinwheel/atlas.json",
                image: "images/spinwheel/atlas.png"
			}],
        images: [],
		sounds: [],
	}
    

	
    function preload() {
        
        //game.plugins.add(Fabrique.Plugins.Spine);
        //game.stage.disableVisibilityChange = true;
        //game.load.spine('men', "img/spines/skeleton.json");		
		game.load.image("fondo", "images/spinwheel/fondo-01.png");
		game.load.image("barra1", "images/spinwheel/barra1.png");
		game.load.image('yogotar', 'images/spinwheel/yogotar.png');
		game.load.physics('fisica', 'images/spinwheel/fisica2.json');
   
	
	
	}
	
	var bars = new Array;

	var pressButton = null;
	var moveBar = null;
	var yogotar;
	var bgSpine;
	var bgSpine2;
	var blockCollisionGroup;
	var activeBar;
	var gameStart = false;
	var bgGroup;	
	var times = 10;
	var lastBar;
	
	function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
	
	function initialize(){
        gameActive = false
        moveUp = false
        objectsGroup = null
        lives = 1 
	}	

    function createScene(){
	bgGroup = game.add.group();
		
	
	game.physics.startSystem(Phaser.Physics.ARCADE);	
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1000;
    
		
		
	bgSpine = bgGroup.create(0, 0,"fondo");
	bgSpine.anchor.setTo(0, 0);	
	
		
	bgSpine2 = bgGroup.create(0, 0,"fondo");
	bgSpine2.anchor.setTo(0, 0);	
	bgSpine2.x = bgSpine.x + bgSpine.width - 10;
		
    yogotar = game.add.sprite(140, 200,"yogotar");
	yogotar.anchor.setTo(0.5, 0.5);	
				
	blockCollisionGroup = game.physics.p2.createCollisionGroup();
		
	game.physics.p2.updateBoundsCollisionGroup();
    
    //  Enable the physics bodies on all the sprites
    game.physics.p2.enable(yogotar , false);
		
    yogotar.body.clearShapes();
    yogotar.body.loadPolygon('fisica', 'yogotar');
    yogotar.body.setCollisionGroup(blockCollisionGroup);
    yogotar.body.collides([blockCollisionGroup]);	
	yogotar.body.collideWorldBounds = true;
	yogotar.body.mass = 100;	
	
		
	function createBars(times){
		for(var i = 0;i<times;i++){
			bars[i] = game.add.sprite(0, 0,"barra1");
			bars[i].anchor.setTo(0.5, 0.5);		
			if(i != 0){
				bars[i].x = bars[i-1].x + bars[i-1].width + 20;
				bars[i].y = bars[0].y + getRandomArbitrary(-100, 100) ;	
			}else{
				bars[i].x = 140;
				bars[i].y = 400;		
			}
			game.physics.p2.enable(bars[i] , false);
			bars[i].body.clearShapes();
			bars[i].body.loadPolygon('fisica', 'barra1');
    		bars[i].body.setCollisionGroup(blockCollisionGroup);
    		bars[i].body.collides([blockCollisionGroup]);
			bars[i].body.static = true;
			//bars[i].body.data.gravityScale = 0;
			//bars[i].body.mass = 10000000;
			bars[i].inputEnabled = true;
    		bars[i].input.enableDrag(true);
			bars[i].events.onDragStart.add(dragStart,this);
			bars[i].input.setDragLock(false, false);			
		}
		
		activeBar = bars[0] 
	}
	
		
	createBars(times)	
	
	lastBar = bars.length-1;
		console.log(lastBar);

	function dragStart(object){
	activeBar = object
	gameStart = true;
		
	}	
	
		
	console.log(bars[0].x)	
	
	
    }
	

	function moveBars(times){
		for(var i = 0; i<=times -1 ; i++){
			
			bars[i].body.x = bars[i].body.x - yogotar.body.x/100;
			
			if(bars[i].body.x <= 0){
				bars[i].body.x = bars[lastBar].body.x + bars[lastBar].width + 20;
				bars[i].body.y = bars[0].body.y + getRandomArbitrary(-100, 100) 
				lastBar = i;
			}
			
		}
		

	}

function update() {
	
	if(!gameStart){
		activeBar.body.rotation = 0;
	}else{
		activeBar.body.rotation = game.physics.arcade.angleToPointer(activeBar);

	}
	if(yogotar.x >= game.world.width*0.5){
		yogotar.body.x = game.world.width*0.5;
		//bgGroup.x = -yogotar.x;
		blockCollisionGroup.x -= 100; 
		moveBars(times);
		

	}	
	

	

}
	
	return {
		assets: assets,
		name: "spinwheel",
		create: createScene,
        preload: preload,
		update:update
	}

}()