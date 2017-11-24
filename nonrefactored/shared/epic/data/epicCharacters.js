var epicCharacters = function () {
	var characters = [
		{name:"yogotarEagle", directory:"images/spines/Eagle/eagle.json"},//0
		{name:"yogotarArthurius", directory:"images/spines/Arthurius/arthurius.json"},//1
		{name:"yogotarDazzle", directory:"images/spines/Dazzle/dazzle.json"},//2
		{name:"yogotarDinamita", directory:"images/spines/Dinamita/dinamita.json"},//3
		{name:"yogotarEstrella", directory:"images/spines/Estrella/estrella.json"},//4
		{name:"yogotarJustice", directory:"images/spines/Justice/justice.json"},//5
		{name:"yogotarLuna", directory:"images/spines/Luna/luna.json"},//6
		{name:"yogotarNao", directory:"images/spines/Nao/nao.json"},//7
		{name:"yogotarOof", directory:"images/spines/Oof/oof.json"},//8
		{name:"yogotarOona", directory:"images/spines/Oona/oona.json"},//9
		{name:"yogotarRazzle", directory:"images/spines/Razzle/razzle.json"},//10
		{name:"yogotarTomiko", directory:"images/spines/Tomiko/tomiko.json"},//11
		{name:"bPirateEarth1", directory:"images/spines/bPirate/bPirateEarth1/bpirateEarth1.json"},//12
		{name:"bPirateFire1", directory:"images/spines/bPirate/bPirateFire1/bpirateFire1.json"},//13
		{name:"bPirateWater1", directory:"images/spines/bPirate/bPirateWater1/bpirateWater1.json"},//14
		{name:"bPirateWind1", directory:"images/spines/bPirate/bPirateWind1/bpirateWind1.json"},//15
		{name:"teddyEarth1", directory:"images/spines/Teddy/teddyEarth1/teddyEarth1.json"},//16
		{name:"teddyFire1", directory:"images/spines/Teddy/teddyFire1/teddyFire1.json"},//17
		{name:"teddyWater1", directory:"images/spines/Teddy/teddyWater1/teddyWater1.json"},//18
		{name:"teddyWind1", directory:"images/spines/Teddy/teddyWind1/teddyWind1.json"},//19
		{name:"ponyaEarth1", directory:"images/spines/Ponya/ponyaEarth1/ponyaEarth1.json"},//20
		{name:"ponyaFire1", directory:"images/spines/Ponya/ponyaFire1/ponyaFire1.json"},//21
		{name:"ponyaWater1", directory:"images/spines/Ponya/ponyaWater1/ponyaWater1.json"},//22
		{name:"ponyaWind1", directory:"images/spines/Ponya/ponyaWind1/ponyaWind1.json"},//23
		{name:"pigbotEarth1", directory:"images/spines/pigbot/pigbotEarth1/pigbotEarth1.json"},//24
		{name:"pigbotFire1", directory:"images/spines/pigbot/pigbotFire1/pigbotFire1.json"},//25
		{name:"pigbotWater1", directory:"images/spines/pigbot/pigbotWater1/pigbotWater1.json"},//26
		{name:"pigbotWind1", directory:"images/spines/pigbot/pigbotWind1/pigbotWind1.json"},//27
		{name:"monkeyEarth1", directory:"images/spines/Monkey/monkeyEarth1/monkeyEarth1.json"},//28
		{name:"monkeyFire1", directory:"images/spines/Monkey/monkeyFire1/monkeyFire1.json"},//29
		{name:"monkeyWater1", directory:"images/spines/Monkey/monkeyWater1/monkeyWater1.json"},//30
		{name:"monkeyWind1", directory:"images/spines/Monkey/monkeyWind1/monkeyWind1.json"},//31
		{name:"lizoEarth1", directory:"images/spines/Lizo/lizoEarth1/lizoEarth1.json"},//32
		{name:"lizoFire1", directory:"images/spines/Lizo/lizoFire1/lizoFire1.json"},//33
		{name:"lizoWater1", directory:"images/spines/Lizo/lizoWater1/lizoWater1.json"},//34
		{name:"lizoWind1", directory:"images/spines/Lizo/lizoWind1/lizoWind1.json"},//35
		/*{name:"emoEarth1", directory:"images/spines/emotiboy/emoEarth1/emoEarth1.json"},//36
		{name:"emoFire1", directory:"images/spines/emotiboy/emoFire1/emoFire1.json"},//37
		{name:"emoWater1", directory:"images/spines/emotiboy/emoWater1/emoWater1.json"},//38
		{name:"emoWind1", directory:"images/spines/emotiboy/emoWind1/emoWind1.json"},//39*/
		{name:"wifiEarth1", directory:"images/spines/wifimonster/wifiEarth1/wifiEarth1.json"},//40
		{name:"wifiFire1", directory:"images/spines/wifimonster/wifiFire1/wifiFire1.json"},//41
		{name:"wifiWater1", directory:"images/spines/wifimonster/wifiWater1/wifiWater1.json"},//42
		{name:"wifiWind1", directory:"images/spines/wifimonster/wifiWind1/wifiWind1.json"},//43
		{name:"beanEarth1", directory:"images/spines/Bean/beanEarth1/beanEarth1.json"},//44
		{name:"beanFire1", directory:"images/spines/Bean/beanFire1/beanFire1.json"},//45
		{name:"beanWater1", directory:"images/spines/Bean/beanWater1/beanWater1.json"},//46
		{name:"beanWind1", directory:"images/spines/Bean/beanWind1/beanWind1.json"},//47
	]

	return{
		getCharacters:function () {
			for(var epicCharIndex = 0; epicCharIndex < characters.length; epicCharIndex++){
				var character = characters[epicCharIndex]
				character.index = epicCharIndex
				characters[character.name] = character
			}
			return characters
		}
	}
}()