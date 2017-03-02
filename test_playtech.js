/**
* Search result content wrapper
* @type {Element|HTMLDivElement}
*/
var searchContent = document.querySelector(".result_content"),

	/**
	* Selected images gallery
	* @type {object}
	*/
	myGallery = {},

	/**
	* Flickr options
	* @type {{method: string, format: string, api_key: string, tags: string}}
	*/
	flickrOptions = {
	method: 'flickr.photos.search',
	format: 'json',
	api_key: 'b54580f369a7eeebecb2004dc429d08f',
	tags: ''
	},

	/**
	* Flickr API URL
	* @type {string}
	*/
	flickrApiUrl = 'https://api.flickr.com/services/rest/?';


/**
* Adds photo to photo container
* @param {object} photo
* @param {string} photo.id
* @param {number} photo.farm
* @param {string} photo.secret
* @param {string} photo.server
* @param {string} photo.title Image title
*/
function generateImage(photo, hideHover) {

	/**
	* Search result element (photo container)
	* @type {Element|HTMLDivElement}
	*/
	var resultEl = document.createElement("div");
	resultEl.setAttribute("class", "result_el");

	/**
	* Search result element photo
	* @type {Element|HTMLImageElement}
	*/
   	var resultPhoto = document.createElement("img");
   	resultPhoto.src = genUrl(photo);


   	/**
	* Checks for ability to add image
	*/
   	if (!hideHover) {

   		/**
		* Hover photo element
		* @type {Element|HTMLDivElement}
		*/
	   	var hoverEl = document.createElement("div");
	   	hoverEl.setAttribute("class", "hover_el");
		resultEl.appendChild(hoverEl);

		/**
		* Text for adding image
		* @type {Element|HTMLDivElement}
		*/
	   	var hoverText = document.createElement("a");
	   	hoverText.setAttribute("href", "#");
	   	hoverText.innerHTML="Click here to add this image to your gallery";

		/**
		* Checks for photo in image gallery
		*/
	   	hoverText.addEventListener("click", function(e) {
	   		if (!(photo.id in myGallery)) {
	   			myGallery[photo.id] = photo;
	   		}
	   		e.preventDefault();
	   	});

	   	hoverEl.appendChild(hoverText);
   }

   	resultEl.appendChild(resultPhoto);
   	searchContent.appendChild(resultEl);
}

/**
* Parses flickr response
* @param {object} response
* @param {string} response.stat Response status
* @param {object} response.photos Response photos data
* @param {object} response.photo Photo
*/
function jsonFlickrApi(response) {	
  	if (response.stat === 'ok') {
        if (response.photos && response.photos.photo) {
            searchContent.innerHTML = "";
		  	response.photos.photo.forEach(function(photo) {
		  		generateImage(photo);
		  	});
        } else {
            showError();
        }
    } else {
        showError();
    }
}

function reqListener () {
	//eval received text.
	//COMMENT FOR REVIEWERS: by Flickr I got not a JSON object, but function `jsonFlickrApi`. So I use eval()
  	eval(this.responseText);
}

/**
* Searches images at Flickr
*/
document.getElementById("search_button").addEventListener("click", function(e) {
	var searchName = document.getElementById("search_input").value;
	var searchRequest = new XMLHttpRequest();
	searchRequest.addEventListener("load", reqListener);
	searchRequest.open("GET", flickrApiUrl 
		+ "method=" + flickrOptions.method 
		+ "&api_key=" + flickrOptions.api_key 
		+ "&tags=" + searchName 
		+ "&format="+ flickrOptions.format);
	searchRequest.send();
	e.preventDefault();
})

/**
* Adds to images gallery
*/
document.getElementById("gallery_button").addEventListener("click", function(e) {
	searchContent.innerHTML = "";
	for (var imageId in myGallery) {
		generateImage(myGallery[imageId], true);
	}
});  

/**
* Returns URL of image
* @param {object} image
* @param {string} image.id
* @param {number} image.farm
* @param {string} image.secret
* @param {string} image.server
* @returns {string}
*/
function genUrl(photo) {
	return "https://farm"
		+ photo.farm + ".staticflickr.com/"
		+ photo.server + "/" 
		+ photo.id + "_" 
		+ photo.secret + "_q.jpg";  
}

/**
* Shows error when request status is not `ok`
*/
function showError() {
    searchContent.innerHTML = 'Request error';
}
