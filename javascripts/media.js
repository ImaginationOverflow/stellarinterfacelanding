
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

		$.each(items, function(key,item)
		{
			if(!('folder' in item))	
				return;
			
			var mediaFolder = { name:item.name, id:item.id };

			getFolderImages(mediaFolder)
		});
		
	});
	
	
}

function getFolderImages(folder)
{

	folder.photos = [];
	
	getFolderChildren(folder.id, function(items)
	{
		$.each(items, function(key,item)
		{
			if(!('photo' in item))	
				return;
			
			var photo = { name:item.name, id:item.id, url:item["@content.downloadUrl"] };
			folder.photos.push(photo);
		});	
		
		publishFolder(folder);
	});
}

function publishFolder(folder)
{
	var content = $("<div/>");
	
	$("<div>" + folder.name + "</div>").appendTo(content);
	
	folder.photos.forEach(function(photo)
	{
		$('<img />', 
		{ 
		  src: photo.url,
		  alt: photo.name
}		).appendTo(content);
	});
	
	content.appendTo("#content");
}