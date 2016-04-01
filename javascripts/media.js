var gutter = 5;
var placeholderSize = 583;
var mediaKitLink;

window.onload = function() 
{
  loadMedia();
  registerLogHooks();
 
  
  
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
			folderView.remove();
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
	
	attachClickEvent("."+folder.name+".gridImage" , 
		function(elem)
		{
			var pic = $(elem).find("img")[0];
			return pic.alt;
		},
		function(elem)
		{
			return 'mediaView';
		}
		);
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
