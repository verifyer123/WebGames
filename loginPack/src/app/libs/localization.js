import React from 'react';

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
		welcomeYogome: {
			id: 10,
			NAME: "mainMenu9",
			ES: "Bienvenido a Yogome",
			EN: "Welcome to Yogome",
			PT: "Bem-vindo à Yogome",
			ZH: "欢迎使用Yogome",
			JA: "Yogome へようこそ",
			KO: "요고미에 오신걸 환영합니다"
		},
		youHaveFree:{
			EN: "You have %s days of free Trial Remaining.",
			ES: "Te quedan %s dias de prueba Gratis Restantes."
		},
		remindParents:{
			EN:"Please remind your parents to check their email to confirm your information.",
			ES:"Recuerda a tus padres que revisen su correo para confirmar tu información.",
			PT:"Lembre seus pais de conferir o e-mail deles para confirmar suas informações.",
			ZH:"请提醒您的父母查看他们的电子邮件以确认您的信息。",
			JA:"おうちの人にEメールをかくにんしてもらってください。",
			KO:"어린이가 입력한 정보를 확인하려면 부모님이 이메일을 확인하셔야 해요. 지금 바로 부모님께 말씀드리세요.",

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
			PT: "- Redefinir senha -",
			ZH: "- 重置密码 -",
			JA: "- パスワードのリセット -",
			KO: "- 비밀번호 변경 -"

		},
		enterYourEmail: {
			id: 15,
			NAME: "mainMenu15",
			ES: "Ingresa el correo de tu padre/madre y te enviaremos instrucciones para restaurar tu contraseña",
			EN: "Please enter your parent's email address and we'll send you instructions to reset your password.",
			ZH: "请输入您父母的电子邮件地址，我们将向您发送重置密码的说明。",
			JA: "保護者の方のEメールアドレスを入力してください。パスワードをリセットする方法をお送りします。",
			KO: "부모님의 이메일 주소를 입력해주세요. 부모님 이메일 주소로 비밀번호 변경 방법을 보내드립니다."
		},
		send: {
			id: 16,
			NAME: "mainMenu16",
			ES: "Enviar",
			EN: "Send",
		},
		submitRequest:{
			EN:"Submit a Request",
			ES:"Enviar pedido",
			PT:"Enviar pedido",
			ZH:"提交请求",
			JA:"リクエスト送信",
			KO:"요청하기"
		},
		intrustionsToReset: {
			id: 17,
			NAME: "mainMenu17",
			ES: "Se han enviado instrucciones a tu correo para recuperar tu contraseña. Revisa tu correo porfavor.",
			EN: "Instructions to reset your password have been emailed to you. Please check your email.",
			PT: "As instruções para redefinir sua senha foram enviadas com sucesso para seu pai/mãe. Confira o e-mail.",
			ZH: "重置密码的说明已成功通过电子邮件发送给您的父母。请查看电子邮件。",
			JA: "パスワードのリセット方法を保護者の方に送信しました。Eメールを確認してください。",
			KO: "부모님의 이메일 주소로 비밀번호 변경 방법이 담긴 이메일을 전송했습니다. 이메일을 확인해주세요."

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
			EN: "SET YOUR PIN",
			PT: "DEFINIR CÓDIGO",
			ZH: "设置您的PIN",
			JA: "PIN の設定",
			KO: "비밀번호 설정"
		},
		selectCombination: {
			id: 29,
			NAME: "mainMenu29",
			ES: "- Selecciona la combinación -",
			EN: "- Select a combination sequence -",
			PT: "- selecione uma sequência -",
			ZH: "- 选择组合顺序 -",
			JA: "- ロックのパターンを選んでください -",
			KO: "- 비밀번호 조합을 선택해주세요 -"
		},
		next: {
			id: 30,
			NAME: "mainMenu30",
			ES: "SIGUIENTE",
			EN: "NEXT",
			PT: "AVANÇAR",
			ZH: "下一步",
			JA: "次へ",
			KO: "다음으로"

		},
		back: {
			id: 31,
			NAME: "mainMenu31",
			ES: "REGRESAR",
			EN: "BACK",
		},
		firstTimeLogin:{
			ES:"Primer inicio de sesión",
			EN:"First Time Login",
			PT:"Primeiro login",
			ZH:"首次登录",
			JA:"初回ログイン",
			KO:"처음으로 로그인해요"
		},
		createAccount:{
			ES:"Crear Nueva Cuenta",
			EN:"Create New Account",
			PT:"Criar nova conta",
			ZH:"创建新帐户",
			JA:"新しいアカウントを作成",
			KO:"새로 가입하기"
		},
		invalidNickname:{
			ES:"Sobrenombre invalido.",
			EN:"Invalid nickname."
		},
		nickname:{
			ES:"Sobrenombre",
			EN:"Nickname",
			PT:"Apelido",
			ZH:"昵称",
			JA:"ニックネーム",
			KO:"별명"
		},
		setNickname:{
			ES:"PON TU SOBRENOMBRE.",
			EN:"SET YOUR NICKNAME.",
			PT:"DEFINIR APELIDO",
			ZH:"设置您的昵称",
			JA:"ニックネームの設定",
			KO:"별명 선택하기"
		},
		chooseYourNickname:{
			ES:"Escoge to sobrenombre",
			EN:"Choose your nickname",
			PT:"Escolha seu apelido",
			ZH:"选择您的昵称",
			JA:"ニックネームをつけてください",
			KO:"별명을 입력해주세요"
		},
		anotherNickname:{
			EN:"Please use another nickname.",
			ES:"Favor de usar otro sobrenombre."
		},
		enterParentsMail: {
			EN: "Please enter your parent's email",
			ES: "Ingresa el correo del padre",
			PT: "Insira o endereço de e-mail de seu pai/mãe",
			ZH: "请输入您父母的电子邮件地址",
			JA: "保護者のEメールアドレスを入力してください",
			KO: "부모님의 이메일 주소를 입력해주세요"
		},
		kidAccount:{
			ES:"CUANTA DEL NIÑO.",
			EN:"KID ACCOUNT.",
			PT:"CONTA DA CRIANÇA",
			ZH:"孩子帐户",
			JA:"キッズアカウント",
			KO:"어린이 계정"
		},
		byRegistringAgree:{
			EN:<div className="privacy">By registering you agree to the <a href="//yogome.com/en/privacy/">Terms of Service</a> and <a href="//yogome.com/en/privacy/">Privacy Policy</a></div>,
			ES:<div className="privacy">Registrandote estas de acuerdo a los <a href="//yogome.com/es/privacy/">Términos y Condiciones</a> y a la <a href="//yogome.com/en/privacy/">Política de Privacidad</a></div>,
			PT:<div className="privacy">Ao se inscrever, você concorda com os <a href="//yogome.com/pt/privacy/">Termos de Serviço</a> e a <a href="//yogome.com/pt/privacy/">Política de Privacidade</a></div>,
			ZH:<div className="privacy">注册即表明，您同意<a href="//yogome.com/cn/privacy/">服务条款</a>和<a href="//yogome.com/cn/privacy/">隐私政策</a></div>,
			JA:<div className="privacy">登録することで、<a href="//yogome.com/jp/privacy/">サービス規約</a>および<a href="//yogome.com/jp/privacy/">プライバシーポリシー</a>に同意されるものとします。</div>,
			KO:<div className="privacy">가입을 하면 요고미의 <a href="//yogome.com/kr/privacy/">서비스 이용 약관</a>과 <a href="//yogome.com/kr/privacy/">개인정보 보호정책</a>에 동의하게 됩니다.</div>
		},
		enterParentPass:{
			EN:"Now enter your parent's password.",
			ES:"Ahora ingresa la contraseña del padre."
		},
		noAccountRegistered:{
			EN:"There is no account registered with this email.",
			ES:"No hay cuenta registrada con este correo."
		},
		accountRegisteredError:{
			EN:"There is already an account registered with this email.",
			ES:"Ya hay una cuenta registrada con este correo."
		},
		invalidEmail:{
			EN:"Please enter a valid email.",
			ES:"Favor de ingresar un correo valido.",
		},
		invalidPassword:{
			EN:"Invalid password.",
			ES:"Contraseña invalida."
		},
		password:{
			ES:"Contraseña",
			EN:"Password"
		},
		parentsMail:{
			EN:"Your Parent's Email",
			ES:"Correo del Padre",
			PT:"E-mail de seu pai/mãe",
			ZH:"您父母的电子邮件",
			JA:"保護者のEメールアドレス",
			KO:"부모님 이메일 주소"
		},
		pinNicknameError:{
			EN:"Nickname or pin incorrect.",
			ES:"Sobrenombre o pin incorrecto."
		},
		accountCreated:{
			EN:"ACCOUNT CREATED",
			ES:"CUENTA CREADA",
			PT:"CONTA CRIADA",
			ZH:"已创建帐户",
			JA:"アカウントを作成しました",
			KO:"계정이 생성되었습니다"

		},
		saveLoginInfo:{
			EN:"Make sure to save your login information.",
			ES:"Asegurate de guardar la información de inicio de sesión.",
			PT:"Certifique-se de salvar suas informações de login.",
			ZH:"一定要记住您的登录信息",
			JA:"ログイン情報を忘れないようにしてください",
			KO:"로그인 정보를 잊지 말고 기억해주세요"
		},
		pin:{
			EN:"Pin",
			ES:"Pin",
			PT:"Código",
			ZH:"Pin",
			JA:"Pin",
			KO:"비밀번호"
		},

	}


    return {
	    getLanguage:function () {
            return language.toUpperCase()
		},
        getString:function (string, lang) {
			lang = lang || language.toUpperCase()

	    	if(!languageArrayIndex[string]){
				console.log("text not found")
				return
			}

			if(!languageArrayIndex[string][lang]){
				return languageArrayIndex[string][DEFAULT_LANG]
			}

	    	return languageArrayIndex[string][lang]
		},
		replace:function (string, toReplace) {
			return string.replace(/%s/i, toReplace);
		}
    }
}()