var languageArrayIndex = [
                { 
                    id:0,
                    NAME:"mainMenu0",
                    ES:"Voltea tu teléfono o dispositivo para una mejor experiencia",
                    EN:"Tilt your device for a better experience. ",
                    PT:"Flip your phone or device for a better experience",
                    ZH:"Flip your phone or device for a better experience",
                    JA:"Flip your phone or device for a better experience",
                    KO:"더 나은 학습 환경을 위해 기기를 기울여주세요."
                },
                { 
                    id:1,
                    NAME:"mainMenu1",
                    ES:"¿QUIERES GUARDAR TU AVANCE?",
                    EN:"Want to save your progress?",
                    PT:"Quer salvar seu progresso?",
                    ZH:"希望保存进度吗？",
                    JA:"進度を保存しますか？",
                    KO:"게임 완성도를 저장하고 싶은가요?"
                },
                { 
                    id:2,
                    NAME:"mainMenu2",
                    ES:"Dile a tus papás que agreguen su mail para que no pierdas tu progreso en el juego.",
                    EN:"Ask your parents to add their email so you don't lose your progress in the game.",
                    PT:"Peça para seus pais adicionarem o e-mail deles para você não perder seu progresso no jogo. ",
                    ZH:"请让家长添加电子邮件地址，以便您能够保存游戏进度。",
                    JA:"ゲームの進度を保存できるよう、保護者の方にEメールを登録するようお願いしてください。 ",
                    KO:"부모님이 이메일 주소를 입력하시면 게임을 저장해서 나중에도 이어서 할 수 있어요."
                },
                { 
                    id:3,
                    NAME:"mainMenu3",
                    ES:"Ok",
                    EN:"OK",
                    PT:"OK",
                    ZH:"确认",
                    JA:"OK",
                    KO:"확인"
                },
                { 
                    id:4,
                    NAME:"mainMenu4",
                    ES:"Iniciar Sesiòn",
                    EN:"Log In",
                    PT:"Login",
                    ZH:"岁",
                    JA:"ログイン",
                    KO:"로그인"
                },
                { 
                    id:5,
                    NAME:"mainMenu5",
                    ES:"Olvide mi contraseña",
                    EN:"I Forgot My Password",
                    PT:"I Forgot My Password",
                    ZH:"I Forgot My Password",
                    JA:"I Forgot My Password",
                    KO:"비밀번호를 잃어버렸어요"
                },
                { 
                    id:6,
                    NAME:"mainMenu6",
                    ES:"¿No tienes cuenta?",
                    EN:"¿Don't have an account?",
                    PT:"¿Don't have an account?",
                    ZH:"¿Don't have an account?",
                    JA:"¿Don't have an account?",
                    KO:"¿아직 가입하지 않으셨나요?"
                },
                { 
                    id:7,
                    NAME:"mainMenu7",
                    ES:"Regístrate",
                    EN:"Sign Up",
                    PT:"Inscrever-se",
                    ZH:"注册",
                    JA:"ご登録",
                    KO:"로그인"
                },
                { 
                    id:8,
                    NAME:"mainMenu8",
                    ES:"-Selecciona un perfil-",
                    EN:"- Select a profile -",
                    PT:"- Select a profile -",
                    ZH:"- Select a profile -",
                    JA:"- Select a profile -",
                    KO:"- 프로필 선택하기 -"
                },
                { 
                    id:9,
                    NAME:"mainMenu9",
                    ES:"Inicia sesión en Yogome ",
                    EN:"Login to Yogome",
                    PT:"Login to Yogome",
                    ZH:"Login to Yogome",
                    JA:"Login to Yogome",
                    KO:"요고미 로그인하기"
                },
        ]
                
        
        
        
        
function changeLanguage(){
    for(i=0;i<=languageArrayIndex.length-1;i++){
        if(language == "ES"){
            $(".text" + i).text(languageArrayIndex[i][language])
        }else if(language == "EN"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "PT"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "ZH"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "JA"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "KO"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else{
            $(".text" + i).text(languageArrayIndex[i].EN)    
        }
    }   
}

changeLanguage()