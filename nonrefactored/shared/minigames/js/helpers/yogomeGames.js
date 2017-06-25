var yogomeGames = {}

yogomeGames.getGames = function(){
	var games = [
	
		{name:'additionDojo',url:'http://yogome.com/epic/minigames/dojoSite/',sceneName:'dojo',subject:'math',review:true},
        {name:'spaceWords',url:'http://yogome.com/epic/minigames/spaceSite/',sceneName:'space',subject:'language',review:true},
        {name:'yogomeRunner',url:'http://yogome.com/epic/minigames/runnerSite/',sceneName:'runneryogome',subject:'math',review:true},
        {name:'waterMorphosis',url:'http://yogome.com/epic/minigames/waterSite/',sceneName:'water',subject:'science',review:true},
		{name:'numberIceCream',url:'http://yogome.com/epic/minigames/iceSite/',sceneName:'ice',subject:'math',review:true},
		{name:'magnetRide',url:'http://yogome.com/epic/minigames/magnetSite/',sceneName:'magnet',subject:'science',review:true},
		{name:'saladCards',url:'http://yogome.com/epic/minigames/tapsite/',sceneName:'tapcards',subject:'language',review:true},
		{name:'skyLanguage',url:'http://yogome.com/epic/minigames/skySite/',sceneName:'sky',subject:'language',review:true},
		{name:'flagRunner',url:'http://yogome.com/epic/minigames/flagSite/',sceneName:'flag',subject:'geography',review:true},
		{name:'riftLand',url:'http://yogome.com/epic/minigames/riftSite/',sceneName:'rift',subject:'coding',review:true},
		{name:'puzzleRoad',url:'http://yogome.com/epic/minigames/puzzleSite/',sceneName:'puzzle',subject:'creativity',review:true},
		{name:'geoJourney',url:'http://yogome.com/epic/minigames/geoSite/',sceneName:'geoJourney',subject:'geography',review:true},
		{name:'memoNumbers',url:'http://yogome.com/epic/minigames/memoSite/',sceneName:'memo',subject:'math',review:true},
		{name:'beachNinja',url:'http://yogome.com/epic/minigames/beachSite/',sceneName:'beach',subject:'math',review:true},
        {name:'flyingFractions',url:'http://yogome.com/epic/minigames/flyingFractionsSite/',sceneName:'flyingFractions',subject:'math',review:true},
		{name:'colorAttack',url:'http://yogome.com/epic/minigames/colorSite/',sceneName:'color',subject:'creativity',review:true},
		{name:'nutriCanon',url:'http://yogome.com/epic/minigames/nutriSite/',sceneName:'nutri',subject:'health',review:true},
		{name:'microdefender',url:'http://yogome.com/epic/minigames/microdefendersite/',sceneName:'microdefender',subject:'health',review:true},
		{name:'healthyCollector',url:'http://yogome.com/epic/minigames/healthySite/',sceneName:'healthyCollector',subject:'health',review:true},
        {name:'CroakSong',url:'http://yogome.com/epic/minigames/CroakSongSite/',sceneName:'CroakSong',subject:'creativity',review:true},
		{name:'tiltSprout',url:'http://yogome.com/epic/minigames/tiltSite/',sceneName:'tilt',subject:'science',review:true},
		{name:'cultureIcons',url:'http://yogome.com/epic/minigames/cultureSite/',sceneName:'culture',subject:'geography',review:true},
		{name:'dizzyBoat',url:'http://yogome.com/epic/minigames/dizzySite/',sceneName:'dizzy',subject:'geography',review:true},
		{name:'flagCollector',url:'http://yogome.com/epic/minigames/flagCollectorSite/',sceneName:'flag',subject:'geography',review:true},
		{name:'mediCatcher',url:'http://yogome.com/epic/minigames/mediSite/',sceneName:'medi',subject:'health',review:true},
        {name:'wildSnaps',url:'http://yogome.com/epic/minigames/wildSite/',sceneName:'wild',subject:'creativity',review:true},
		{name:'geMath',url:'http://yogome.com/epic/minigames/gemSite/',sceneName:'gem',subject:'math',review:true},
		{name:'hackaMole',url:'http://yogome.com/epic/minigames/hackSite/',sceneName:'hack',subject:'coding',review:true},		
		{name:'lizart',url:'http://yogome.com/epic/minigames/lizartsite/',sceneName:'lizart',subject:'language',review:true},
		{name:'snoozeCrater',url:'http://yogome.com/epic/minigames/snoozeSite/',sceneName:'snooze',subject:'health',review:true},//29
		{name:'mathFeed',url:'http://yogome.com/epic/minigames/feedSite/',sceneName:'feed',subject:'math',review:true},//30
		{name:'galaxyHeroes',url:'http://yogome.com/epic/minigames/galaxySite/',sceneName:'galaxy',subject:'geography',review:true},//31
		{name:'popFish',url:'http://yogome.com/epic/minigames/fishSite/',sceneName:'fish',subject:'math',review:true},//32
		{name:'bouncybath',url:'http://yogome.com/epic/minigames/bouncybathsite/',sceneName:'bouncybath',subject:'health',review:false},//33
        {name:'acornNumbers',url:'http://yogome.com/epic/minigames/acornSite/',sceneName:'acorn',subject:'math',review:true},//34
		{name:'popSteroids',url:'http://yogome.com/epic/minigames/popSite/',sceneName:'popScene',subject:'math',review:true},//35
		{name:'candyShapes',url:'http://yogome.com/epic/minigames/candySite/',sceneName:'candy',subject:'math',review:true},//36
		{name:'featherShelter',url:'http://yogome.com/epic/minigames/featherSite/',sceneName:'feather',subject:'math',review:true},//37
		{name:'mathCircus',url:'http://yogome.com/epic/minigames/circusSite/',sceneName:'circus',subject:'math',review:true},//38
		{name:'flightoclock',url:'http://yogome.com/epic/minigames/flightoclocksite/',sceneName:'flightoclock',subject:'math',review:true},//39
		{name:'clashCritters',url:'http://yogome.com/epic/minigames/clashSite/',sceneName:'clash',subject:'math',review:true},//40
		{name:'mathPort',url:'http://yogome.com/epic/minigames/portSite/',sceneName:'port',subject:'math',review:true},//41
		{name:'pizzafraction',url:'http://yogome.com/epic/minigames/pizzafractionsite/',sceneName:'pizzafraction',subject:'math',review:false},//42
		{name:'hungryToads',url:'http://yogome.com/epic/minigames/hungrySite/',sceneName:'hungry',subject:'math',review:false},//43
		{name:'skyTap',url:'http://yogome.com/epic/minigames/skyTapSite/',sceneName:'sky',subject:'math' ,review:false},//44
		{name:'evening',url:'http://yogome.com/epic/minigames/eveningSite/',sceneName:'evening',subject:'math', review:true},//45
		{name:'minmaxduel',url:'http://yogome.com/epic/minigames/minmaxduelsite/',sceneName:'minmaxduel',subject:'math', review:false},//46		
		{name:'mathInvader',url:'http://yogome.com/epic/minigames/invaderSite/',sceneName:'invader',subject:'math', review:false},//47
        {name:'locksmath',url:'http://yogome.com/epic/minigames/lockSite/',sceneName:'lock',=,subject:'math', review:false}//48
	]

	
	
	
    
    return games
}

