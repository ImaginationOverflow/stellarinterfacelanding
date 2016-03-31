var gutter = 5;
var placeholderSize = 583;
var mediaKitLink;

window.onload = function() {
  loadMedia();
  //downloadMediaKit();
};

function getUriFor(folderId)
{
	return "https://api.onedrive.com/v1.0/drive/items/" + folderId + "/children?authkey=!AHSX3KI1pTAe6BU&orderby=lastModifiedDateTime%20desc";
}

function getFolderChildren(folderId, callback)
{
	$.getJSON(getUriFor(folderId), function(data)
	{
		callback(data.value);
	});
}

function loadMedia()
{
	var rootFolderId = "55963BCCC14A8EC4!219668";
	var uri = getUriFor(rootFolderId);
	
	
	getFolderChildren(rootFolderId, function(items)
	{

		items.sort(function(a, b){return b.name.localeCompare(a.name);})
		
		$.each(items, function(key,item)
		{
			if(!('folder' in item) || item.folder.childCount == 0)	
				return;
			
			var mediaFolder = { name:item.name, id:item.id };

			getFolderImages(mediaFolder)
		});
		
	});
	
	
}

function getFolderImages(folder)
{

	folder.photos = [];
	
	
	
	var folderView = $("<div>/", {"class":"contentTitle", "id":folder.name, html:folder.name});
		
	folderView.appendTo("#mediaContent");
	
	getFolderChildren(folder.id, function(items)
	{
		var nrOfImagesPerRow = 2;
		
		if(folder.name == "Banners")
			nrOfImagesPerRow = 3;
		
		if(folder.name == "PressKit")
		{
			HandleMediaKit(items);
			return;
		}
		
		
		$.each(items, function(key,item)
		{
			if(!('image' in item) )	
				return;
			
			var photo = 
			{ 
				name:item.name, 
				id:item.id, 
				url:item["@content.downloadUrl"],
				height:item.image.height,
				width:item.image.width
			};
			folder.photos.push(photo);
		});	
		
	
		
		publishFolder(folder,folderView,nrOfImagesPerRow);
	});
}

function HandleMediaKit(items)
{
	var latest = items[0];
	var link = latest["@content.downloadUrl"];
	$("#PressKit").attr("href",link + "/" + latest.name);
	//.click(function()
	//{
	//	window.downloadFile(link);
	//});
	
	
}

function publishFolder(folder, folderView, nrOfImagesPerRow)
{
	var content = $("<div/>");
	
	var size = (placeholderSize - gutter * (nrOfImagesPerRow-1))/nrOfImagesPerRow;
	
	folder.photos.forEach(function(photo)
	{
		var img = createImage(photo,folder,true,size);
		
		var div = $("<div/>", {"class":folder.name+ " gridImage" });
		
		img.appendTo(div);
		
		div.appendTo(content);
	});
	
	
	
	content.insertAfter(folderView);
	//
	content.masonry(
	{
		gutter:5,
		columnWidth: size,
		fitWidth: true,
		itemSelector: "."+folder.name,
		zoom: 
		{
			enabled: true,
		}
	});
	//*/
}

function createImage(photo, folder, resize, imageWidth)
{
	var height = photo.height;
	var width = photo.width;
	
	if(resize && photo.width > imageWidth)
	{
		height/=photo.width /imageWidth ;
		width = imageWidth;
	}
		
	var img  = $('<img />', 
	{ 
		src: photo.url,
		alt: photo.name,
		"height":height,
		"width":width
	});
	
	
	var fullScreenImg = $("<a/>", {"href":photo.url});
	
	img.appendTo(fullScreenImg);
	
	fullScreenImg.magnificPopup(
	{
		type: 'image',
		closeOnContentClick:true,

	});
	return fullScreenImg;
}

function downloadMediaKit()
{
	$.post("", 
	{
		
	}, function(result){
        
    });
	
	
	$.ajax({
		url: 'https://cid-55963bccc14a8ec4.users.storage.live.com/downloadfiles/V1/Zip?authkey=!AHSX3KI1pTAe6BU',
		type: 'post',
		data: {
			resIds: "55963BCCC14A8EC4!219668",
			authkey: "!AHSX3KI1pTAe6BU"
		},
		headers: {

			//"Origin": "https://onedrive.live.com",
			//"Referer": "https://onedrive.live.com",
			"Access-Control-Allow-Origin":"*"
		},
		success: function (data) {
			console.info(data);
		}	
	});
}






















window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
}

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
