var columnWidth = 191;
var gutter = 5;
var placeholderSize = 650;

window.onload = function() {
  loadMedia();
};

function getUriFor(folderId)
{
	return "https://api.onedrive.com/v1.0/drive/items/" + folderId + "/children?authkey=!AHSX3KI1pTAe6BU";
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
	var folderView = $("<div>/", {"class":"contentTitle", html:folder.name});
	
	folderView.appendTo("#mediaContent");
	
	getFolderChildren(folder.id, function(items)
	{
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
		
		publishFolder(folder,folderView);
	});
}

function publishFolder(folder, folderView)
{
	var content = $("<div/>");
	
	
	folder.photos.forEach(function(photo)
	{
		var img = createImage(photo,folder,true);
		
		var div = $("<div/>", {"class":folder.name+ " gridImage" });
		
		img.appendTo(div);
		
		div.appendTo(content);
	});
	
	
	
	
	content.insertAfter(folderView);
	//
	content.masonry(
	{
		gutter:5,
		columnWidth: columnWidth,
		fitWidth: true,
		itemSelector: "."+folder.name,
		zoom: 
		{
			enabled: true,
		}
	});
	//*/
}

function createImage(photo, folder, resize)
{
	var height = photo.height;
	var width = photo.width;
	
	if(resize && photo.width > columnWidth)
	{
		height/=photo.width /columnWidth ;
		width = columnWidth;
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