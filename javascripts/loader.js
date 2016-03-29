if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

window.onload = function() {
  loadNews();
};


function createNews(date, text, link)
{
	
	return String.format("<div><p class=\"newsDate\">{0}/{1}/{2}</p><p class=\"newsText\">{3}</p><p><a href=\"{4}\">more</a></p></div>",
		date.getDate(),
		date.getMonth()+1,
		date.getFullYear(),
		text,
		link
	);
	
}

function loadNews()
{
	var fbLink = "https://graph.facebook.com/v2.5/365215843618087/posts?fields=full_picture,message,created_time,link&access_token=CAAJftGuZCQDMBAH1N2pMTV9iPxi96ewky2ceg5DqPqTyhgJZAwum4ZCsyp0Sz4UIOL9A6Xlk5NnOGyCed4FWZBKyo6w8K02mSUuudcBmxqtTZB4gZCwKUZCdyvMQ2KQCOmUJHSb7oPM5BjDJSeqc9uUdUaaZAqeF56ZBZA57TEeN7ve6qChP5qvHf3dhuxBFkXlAZAZBZCGZAYGT1WRgZDZD"
	
	var maxChars = 200;
	var maxNews = 5;
	
	$.getJSON( fbLink, function( data ) 
	{
		var items = [];
		
		$.each( data.data, function( key, val ) 
		{
			var link = val.link?val.link : "https://www.facebook.com/"+val.id;
			if(val.message)
			{
				var text = val.message.substring(0,maxChars);
				
				if(val.message.length > maxChars)
					text+="...";
				
				
				items.push(createNews(new Date(val.created_time), text, link));
				/*
				items.push( "<p class=\"newsDate\">" + val.created_time + "'</p>" + 
				"<p class=\"newsText\">"+text + "</p>"+
				"<p><a href=\""+ link   + "\"> more </a> </p>"
				);
				*/
			}
		});
	 
		$( "<div/>", 
		{
			"class": "my-new-list",    html: items.join( "" )
		}).appendTo( "#news" );
	});
}