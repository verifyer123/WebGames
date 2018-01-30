export var localization = function(){

	const DEFAULT_LANG = "EN"

    function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return "EN";
		if (!results[2]) return "EN";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	var language = getParameterByName("language")

    var languageArrayIndex = {

		"tellYourParents": {
			ES: "Dile a tus papás que agreguen su mail para que no pierdas tu progreso en el juego.",
			EN: "Ask your parents to add their email so you don't lose your progress in the game.",
			PT: "Peça para seus pais adicionarem o e-mail deles para você não perder seu progresso no jogo. ",
			ZH: "请让家长添加电子邮件地址，以便您能够保存游戏进度。",
			JA: "ゲームの進度を保存できるよう、保護者の方にEメールを登録するようお願いしてください。 ",
			KO: "부모님이 이메일 주소를 입력하시면 게임을 저장해서 나중에도 이어서 할 수 있어요."
		},
		"ok": {
			id: 3,
			NAME: "mainMenu3",
			ES: "Ok",
			EN: "OK",
			PT: "OK",
			ZH: "确认",
			JA: "OK",
			KO: "확인"
		},
		"logIn": {
			id: 4,
			NAME: "mainMenu4",
			ES: "INICIAR SESIÓN",
			EN: "LOGIN",
			PT: "Login",
			ZH: "岁。",
			JA: "ログイン。",
			KO: "로그인。"
		},
		forgotPass: {
			id: 5,
			NAME: "mainMenu5",
			ES: "Olvidé mi contraseña.",
			EN: "I Forgot My Password.",
			PT: "Esqueci minha senha.",
			ZH: "我忘记了密码。",
			JA: "パスワードを忘れた場合。",
			KO: "비밀번호를 잃어버렸어요。"
		},
		dontHaveAccount: {
			id: 6,
			NAME: "mainMenu6",
			ES: "¿No tienes una cuenta?",
			EN: "¿Don't have an account?",
			PT: "Não tem uma conta?",
			ZH: "还没有帐户？",
			JA: "アカウント新規登録?",
			KO: "¿아직 가입하지 않으셨나요?"
		},
		signUp: {
			id: 7,
			NAME: "mainMenu7",
			ES: "Regístrate.",
			EN: "Sign Up.",
			PT: "Inscrever-se.",
			ZH: "注册。",
			JA: "ご登録。",
			KO: "로그인。"
		},
		selectProfile: {
			id: 8,
			NAME: "mainMenu8",
			ES: "- Selecciona un perfil -",
			EN: "- Select a profile -",
			PT: "- Selecione um perfil -",
			ZH: "- 选择个人资料 -",
			JA: "- プロフィールを選ぶ -",
			KO: "- 프로필 선택하기 -"
		},
		logInYogome: {
			id: 9,
			NAME: "mainMenu9",
			ES: "Inicia sesión en Yogome",
			EN: "Login to Yogome",
			PT: "Fazer login na Yogome",
			ZH: "登录Yogome。",
			JA: "Yogomeにログイン。",
			KO: "요고미 로그인하기。"
		},
		welcome: {
			id: 10,
			NAME: "mainMenu9",
			ES: "- ¡Bienvenido! -",
			EN: "- Welcome! -",
		},
		congrats: {
			id: 11,
			NAME: "mainMenu10",
			ES: "- ¡Felicidades! -",
			EN: "- Congrats! -",
		},
		nowFullAccess: {
			id: 12,
			NAME: "mainMenu11",
			ES: "Ya tienes acceso total a la Experiencia de Aprendizaje ",
			EN: "Now you have full access to the Yogome Learning Experience.",
		},
		keepAdventureContinue: {
			id: 13,
			NAME: "mainMenu12",
			ES: "¡Que la aventura continue!",
			EN: "Keep the adventure going!",
		},
		resetPassword: {
			id: 14,
			NAME: "mainMenu14",
			ES: "- Recuperar contraseña -",
			EN: "- Reset Password -",
		},
		enterYourEmail: {
			id: 15,
			NAME: "mainMenu15",
			ES: "Ingresa tu correo y te enviaremos instrucciones para restaurar tu contraseña",
			EN: "Enter your email address and we'll send you instructions to reset your password.",
		},
		send: {
			id: 16,
			NAME: "mainMenu16",
			ES: "Enviar",
			EN: "Send",
		},
		intrustionsToReset: {
			id: 17,
			NAME: "mainMenu17",
			ES: "Se han enviado instrucciones a tu correo para recuperar tu contraseña. Revisa tu corro porfavor",
			EN: "Instructions to reset your password have been emailed to you. Please check your email.",
			PT: "Instructions to reset your password have been emailed to you. Please check your email.",
			ZH: "Instructions to reset your password have been emailed to you. Please check your email.",
			JA: "Instructions to reset your password have been emailed to you. Please check your email.",
			KO: "Instructions to reset your password have been emailed to you. Please check your email."
		},
		success: {
			id: 18,
			NAME: "mainMenu18",
			ES: "¡Éxito!",
			EN: "Success!",
			PT: "Sucesso!",
			ZH: "大功告成！",
			JA: "完了しました。",
			KO: "완성!"
		},
		wantSaveProgress: {
			id: 19,
			NAME: "mainMenu19",
			ES: "¿Quieres guardar tu avance?",
			EN: "Want to save your progress?",
			PT: "Quer salvar seu progresso?",
			ZH: "希望保存进度吗？",
			JA: "進度を保存しますか？",
			KO: "게임 완성도를 저장하고 싶은가요?"
		},
		tellYourParents: {
			id: 20,
			NAME: "mainMenu20",
			ES: "Dile a tus papás que agreguen su mail para que no pierdas tu progreso en el juego.",
			EN: "Ask your parents to add their email so you don't lose your progress in the game.",
			PT: "Peça para seus pais adicionarem o e-mail deles para você não perder seu progresso no jogo.",
			ZH: "请让家长添加电子邮件地址，以便您能够保存游戏进度。",
			JA: "ゲームの進度を保存できるよう、保護者の方にEメールを登録するようお願いしてください。",
			KO: "부모님이 이메일 주소를 입력하시면 게임을 저장해서 나중에도 이어서 할 수 있어요。"
		},
		wantKeepPlaying: {
			id: 21,
			NAME: "mainMenu21",
			ES: "¿Quieres seguir jugando?",
			EN: "Want to keep playing?",
			PT: "Quer continuar jogando?",
			ZH: "希望继续游戏吗？",
			JA: "ゲームを続けますか？",
			KO: "게임을 계속 하고 싶은가요?"
		},
		endTest: {
			id: 22,
			NAME: "mainMenu22",
			ES: "Llegaste al final de la prueba. Dile a tus papás que agreguen su mail para que la aventura continue.",
			EN: "You're at the end of the test! Ask your parents to add their email so the adventure can continue.",
			PT: "Você já está no final do teste! Peça para seus pais adicionarem o e-mail deles para a aventura continuar.",
			ZH: "测试结束！请让家长添加电子邮件地址，以便您能继续探险。",
			JA: "テストの最後の問題です！ゲームを続けられるよう、保護者の方にEメールを登録するようお願いしてください。",
			KO: "이미 시험이 다 끝났어요! 부모님이 이메일 주소를 입력하시면 모험을 계속 이어갈 수 있어요。"
		},
		didYouKnow: {
			id: 23,
			NAME: "mainMenu23",
			ES: "¿Sabías qué...",
			EN: "Did you know...?",
		},
		bySubscribing: {
			id: 24,
			NAME: "mainMenu24",
			ES: "Al suscribirte tendrás acceso a más de 2000 actividades como juegos, videos y libros interactivos.",
			EN: "By subscribing you will have access to more than 2000 activities such as games, videos and interactive books.",
		},
		wantIt: {
			id: 25,
			NAME: "mainMenu25",
			ES: "¡Lo quiero!",
			EN: "I want it!",
		},
		play: {
			id: 26,
			NAME: "mainMenu26",
			ES: "¡Juega!",
			EN: "Play!",
			PT: "Jogar!",
			ZH: "开始游戏！",
			JA: "ゲーム開始！",
			KO: "게임 시작!"
		},
		chooseYourAge: {
			id: 27,
			NAME: "mainMenu27",
			ES: "- Elige su edad -",
			EN: "- Select your child's age -",
			PT: "- Selecione a idade do seu filho -",
			ZH: "- 选择你孩子的年龄 -",
			JA: "- お子様の年齢を選択してください -",
			KO: "- 자녀의 나이를 선택하세요. -"
		},
		setYourPin: {
			id: 28,
			NAME: "mainMenu28",
			ES: "INGRESA TU PIN",
			EN: "SET YOUR PIN"
		},
		selectCombination: {
			id: 29,
			NAME: "mainMenu29",
			ES: "- Selecciona la combinación -",
			EN: "- Select a combination sequence -",
		},
		next: {
			id: 30,
			NAME: "mainMenu30",
			ES: "SIGUIENTE",
			EN: "NEXT",
		},
		back: {
			id: 31,
			NAME: "mainMenu31",
			ES: "REGRESAR",
			EN: "BACK",
		},
		firstTimeLogin:{
			ES:"Primer inicio de sesión",
			EN:"First Time Login"
		},
		createAccount:{
			ES:"Crear Nueva cuenta",
			EN:"Create New Account"
		},
		invalidNickname:{
			ES:"Sobrenombre invalido.",
			EN:"Invalid nickname."
		},
		nickname:{
			ES:"Sobrenombre",
			EN:"Nickname"
		}
	}


    return {
	    getLanguage:function () {
            return language.toUpperCase()
		},
        getString:function (string, lang) {
			if(!languageArrayIndex[string]){
				console.log("text not found")
				return
			}

			if(!languageArrayIndex[string][lang]){
				return languageArrayIndex[string][DEFAULT_LANG]
			}

	    	return languageArrayIndex[string][lang]
		}
    }
}()