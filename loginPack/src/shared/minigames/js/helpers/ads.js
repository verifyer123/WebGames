var ads = function(){

	function show(id){

		var iframe = document.createElement("iframe")
		iframe.onload = function(obj){
			this.style.height = this.contentWindow.document.body.scrollHeight + 'px';

			var height = this.contentWindow.document.body.scrollHeight
			var clientHeight = window.innerHeight
			console.log(height, clientHeight)

			iframe.style.bottom = "0px"
		}

		iframe.src = "../../ads/2.html"

		iframe.style.position = "fixed"
		
		iframe.style.borderStyle = "none"

		iframe.style.width = "100%";
		iframe.style.transform = "scale(0.4, 0.4)"
		iframe.style.WebkitTransform = "scale(0.4, 0.4)"

		document.documentElement.appendChild(iframe)

		return iframe

	}

		return {
			show: show,
	}

}()