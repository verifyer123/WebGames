// var _Q = {
// 	getJoshe: (function(){
// 		//Propiedades
// 		var joshe ,
// 		rsa_key_server ,
// 		rsa_key_client ,
// 		alg ,
// 		cryptographer ,
// 		_public_rsa_key ,
// 		_private_rsa_key;
// 		//Metodos
// 		var init ,
// 		encrypt ,
// 		decrypt ;
// 		rsa_key_client = {
// 			"kty":"RSA",
// 			"e":"AQAB",
// 			"n":"98MmdIZssvEBSvel9FxJjI98HwbOYTGuZgnGLvyc23e5_YnpDMp6mKbA-WLR-sacD1RkSO6PGZlfraacIp6kytLI0jqVyDKY97dMa_bvSaCOVNKhaDyxg50gm26sLiYOga5RjYAk1uScw4rgn71jezsdHR7R9PMoy_igiPhF4LM"
// 		};
// 		rsa_key_server = {
// 			"p":"38kjc8pafstkPL_Q-14XOWvDQ7XCVOWpfHsxBHQCf0tCb08FinZs0sVQmoL-Do5xrcWORJWVx8RwMBKmRgUS_Q",
// 			"kty":"RSA",
// 			"q":"zFc8MAai32UXUsC3Kyh_E9tpOADoQsSbWJuzTAscFK6mBXfvw0SN3WEwKxvPWY8-KVj8DQsF0BFhvKFLRWE7UQ",
// 			"d":"CDLWJUEPfNvetPSxL9wUW2NQ8NjgMws6GewmE4GWoiOVnC8eBpMFKPbPEjxZMLhFiohGRhvzrQBvmhhuEZg-ic-jxlErnaZCsuJ2irm_LgP0Jk5n-xXaxmj1goXKWJYvEMf0rhnn533EVPi4fMNAS9mJ_2nUwtBAXMYsk2ufUAE",
// 			"e":"AQAB",
// 			"qi":"xhTzWOe90hof0pEecFcaLKNXrSnwHbRNCPEe_LF7BWikuYr_Gs3Sb-MPK4SmIm9ngsgpxwKX1a5l8Mi6XxOejg",
// 			"dp":"eMMsNIIQT7gmgXnpppxh4AS9PL7K_dFpotk_3G1WI6dTVInKLaw2kY8VLixeOTC5O9MOMQif6UuiVu7Zd5OpaQ",
// 			"dq":"CyDBDVh_LC1ELOSD1RzadslfHIaoH2K3lwa7p-t-9v1f2zJh4z9rfl_ZkK9uBlGPsA7BgzBTe7ZGnVAnWjrmUQ",
// 			"n":"sqCKOHFswlQMU1plJ0G4dx8Bt020wlWLVPUbNGWg_4IFbVan-UfOow-pnu3omf8r0CeO11aeuC4CQguWo_EIWgcnsGa0SyUHDFcc42i6_g7S8MkvTc_-YGJb9EFAV9CK11oCBuKqwfqwRJsw-J5VcK1nePFNQiW4-JvL6LXYUQ0"
// 		}
// 		alg = "RSA-OAEP-256",
// 		init = function () {
// 			cryptographer = new Jose.WebCryptographer();
// 			_public_rsa_key = Jose.Utils.importRsaPublicKey(rsa_key_client, alg);
// 			_private_rsa_key = Jose.Utils.importRsaPrivateKey(rsa_key_server, alg);
// 			jqueryAjax = $.ajax;
// 			var that = this;
// 			$.ajax = function(config){
// 				that._onSuccess = config.success;
// 				var flag = config.joshe;
// 				var callOrigin = function(data) {
// 					console.log(data);
// 					jqueryAjax({
// 						type: config.type,
// 						url: config.url,
// 						data: JSON.stringify({
// 							"data" : data
// 						}),
// 						dataType: config.dataType,
// 						contentType: config.contentType,
// 						success: function(data){
// 							if (flag) {
// 								that.decrypt(data.data);
// 							}
// 							else{
// 								config.success(data);
// 							}
// 						},
// 						error: function(data){
// 							config.error(data);
// 							console.log("Error AJAX");
// 						}
// 					});
// 				}
// 				if(config.joshe){
// 					console.log(config.data);
// 					var bodyData = '{"body" : ' + config.data + '}';
// 					that.encrypt(bodyData, callOrigin)
// 				}
// 				else
// 					callOrigin(config.data)
// 			}
// 		}
// 		encrypt = function (data, onSuccess) {
// 			var encrypter = new JoseJWE.Encrypter(cryptographer, _public_rsa_key);
// 			encrypter.encrypt(data).then(onSuccess).catch(function(err){
// 				console.warn(err)
// 			});
// 		},
// 		decrypt = function (response) {
// 			console.log(response);
// 			var that = this;
// 			var decrypter = new JoseJWE.Decrypter(cryptographer, _private_rsa_key);
// 			decrypter.decrypt(response).then(
// 				function(r){
// 					var data = JSON.parse(JSON.parse(r).body)
// 					that._onSuccess(data);
// 					console.log(data);
// 				}).catch(function(err) {
// 					console.warn(err)
// 				});
// 		},
// 		return function(){
// 			if(!joshe){
// 				joshe = {
// 					amethod : function(){
// 						console.log("metodo");
// 					}
// 				}
// 			}
// 			return joshe;
// 		}
// 	})()
// }
// Object.defineProperty(_Q, "getJoshe", {
//   enumerable: false,
//   configurable: false,
//   writable: false
// })

import {Jose} from "./jose"

export var _J = {
	JOSHE : {
		rsa_key_server : {
			"p":"4Xkw09YezwHveKp343swNdlXIldaW4rl48YrTGhBBaQCv0D7s1g6iC-w1swtyyymdm8nXnVpKiHrYhCcZksLae9fJ-MCVOY5Bk41rt_FEXCKdPGxXdOPNb14MlSEOZ-QFwh0XeOANs8h78Aj40F9LFz_F_lBQJqyucZxrnQreK0",
			"kty":"RSA",
			"q":"z2qHc8oK8rlZ7ufdAEyYjlLxKRLhgX88VjNfYVrR6G6Tgoqg-TPA3P1R8R0mVcxQXnK85LToNa3vpoAlJ92nr5lzNT8z1zvWG_pc07OzlfULO0V_DAQVaopQU997gFkfnzKyhJGuNx_PEopdUflF4CV4l5xjV95zNDbVnjXOPps",
			"d":"FftnTGztWZxxgGg4K7UawWUigqS2mXkGT_w8VrC3sdAmlS2sxrv5xXuH_lkqGUrPWelH075x-Px58MXwyjzRyIlilEk_EVWxklzXVFznOevsd6vBp_ekJRz8qM8abaBc-Z3RUGJ5lZ1eUfUNWnycL68JRh01mUzSiW_aHfLvTdy-qHhbSeL3VII8JDy0kuHhUpVYYfAopJHTM94vZvfF9VH084_cAX0OT7W-R1wdC9OUbsu3OBUnbCtqpDI0ojETmXuKXRwZ2Zw0YK3tz7dN2S5PB9IzervyYDjt5yskyQQIwlr99eh4feE4lR9qVTXdTF5mJALCkm3UQBba6AIikQ",
			"e":"AQAB",
			"qi":"E46yHIg6F5S9Jkb3j25MDTch6I7jxclHcs12s3pD5QO_CaJ-VsDt2eTMn6pwWc-eNxQS7VaPS3qsnWyDvfzvLCTbPNwnrMT8_226s0uQWkjhV9yTw51DPGzgTP9PQ0LPIyB9iywlgkwMezw0-qlCfNFxTU6qF_vi7OYl4nqYX2Q",
			"dp":"aby5xz4s6ItR0FaxLn8A1t_72uD4QOHceXrfp09k3s5Rc3t4Dl0b5e3nknPiLdvcnMH3xnZtQRLzHeQIVHhw-9cD2uK8ny_wIiLfTgkmk80hQUJvGT8zc9JM4d18vME1g3e1iqo74Hg2xAZpThPSLdHW11lO3ostsa18doGIOWk",
			"dq":"yUKtPIWIKg4AXflOUMQCI9gHebuAZY94lIw0uNrPY6IoMDskB6tYMRb9M-D9GbOvKHZdI-8Gg0_LgtxFMXG7DIDxcXFqdCbzkyJUgHeWgqPLyi-dH6O2xDKBz2DDDb9tF6Sx5EEXsxWCcJMiCjC-xMiXQ0XUf6ayUrACiAndnpE",
			"n":"tq7R9mX9fEKVnX_bP_4h15zrzRLNwQKnq2uXb4LFlaXET93Ib_SW7veK75yMk-3XgpXGHrfsgQVanHdA3bTyeYNQoFwK_cCY9y7-73OeUHrJQUHP8kcpYb_IF8FB7Dk39wBKN081LTgHP-5RZrXglfOx_00vzS1gnfnAsQUrdfotMh4TG-s1WKa5Ignc0e1kCKj_4juwAVGt69KXmFOPgxl6yLd5XVXUWkP3JdoEiIi6FJpgw7-JRvSj6zlvIzyKIgRqh4KOOcIyeoJ9Tjt68FW-cDvArXzti_9CnoKdNvnp_TSHdjvyZGG77Fz2Rb2clhCqiJ9KaCaZ1_t_ycH2vw"
		},
		rsa_key_client : {
			"kty":"RSA",
			"e":"AQAB",
			"n":"v58-ov8Wyu4pZKdrWe5RKyzA8fMrvdHzAf6xiWaReVUvxgxHLtYG4Dk6xMtshDToZA-twg9r1AlQjH76DowTDwBF9uMjpvk1MZEqT4IHR60tpkE-HYq3BCRdzEM3XG1T3MonfoLLK0S9nvkx-Wxg5NWmG55p-qgldlCH6vbQrlj7fARozpGNRK2Tq5En8T6Ab-n8jaKcZ629LT8AdAm7xo9ODhQhOoXKw47VLYXiCcBH0GPesHl3hhTvlrkVB9596-94EdoS908926CCgDRFDzfUaa28tpdlWvlM6JET-neskXZj2nhb1H1lhqaMSaXbn7YyLzC4KmmxS4Gr7sTSoQ"
		},
		alg : "RSA-OAEP-256",
	}
}

_J.Joshe = function (config) {
	var config  = _J.JOSHE;

	this._config = config;

	this._rsa_key_server = this._config.rsa_key_server;

	this._rsa_key_client = this._config.rsa_key_client;

	this._alg = this._config.alg;

	this.init()

}
var jqueryAjax;
_J.Joshe.prototype = {
	init : function () {
		this._cryptographer = new Jose.WebCryptographer();
		this._public_rsa_key = Jose.Utils.importRsaPublicKey(this._rsa_key_client, this._alg);
		this._private_rsa_key = Jose.Utils.importRsaPrivateKey(this._rsa_key_server, this._alg);
		jqueryAjax = $.ajax;
		var that = this;
		$.ajax = function(config){
			that._onSuccess = config.success;
			var flag = config.joshe;
			var callOrigin = function(data) {
				jqueryAjax({
					type: config.type,
					url: config.url,
					data: JSON.stringify({
						"data" : data
					}),
					dataType: config.dataType,
					contentType: config.contentType,
					success: function(data){
						if (flag) {
							that.decrypt(data.data);
						}
						else{
							config.success(data);
						}
					},
					error: function(data){
						config.error(data);
					}
				});
			}
			if(config.joshe){
				var bodyData = '{"body" : ' + JSON.stringify(config.data) + '}';
				that.encrypt(bodyData, callOrigin)
			}
			else
				callOrigin(config.data)
		}
	},
	encrypt: function (data, onSuccess) {
		var encrypter = new JoseJWE.Encrypter(this._cryptographer, this._public_rsa_key);
		encrypter.encrypt(data).then(onSuccess).catch(function(err){
			console.warn(err)
		});
	},
	decrypt: function (response) {
		var that = this;
		var decrypter = new JoseJWE.Decrypter(this._cryptographer, this._private_rsa_key);
		decrypter.decrypt(response).then(
			function(r){
				var data = JSON.parse(JSON.parse(r).body)
				that._onSuccess(data);
			}).catch(function(err) {
			console.warn(err)
		});
	},
	ajax: function (config) {
		var that = this;
		this._onSuccess = config.success;
		var callOrigin = function(data) {
			this.decrypt(data);
			$.jqueryAjax({
				type: config.type,
				url: config.url,
				data: {
					"data" : data
				},
				dataType: 'json',
				contentType: 'application/json',
				success: config.joshe ? this.decrypt : config.success,
				error: config.error
			});
		}
		if(config.joshe)
			this.encrypt(config.data, callOrigin)
		else
			callOrigin(config.data)
	}
}
_J.Joshe.prototype.constructor = _J.Joshe;
