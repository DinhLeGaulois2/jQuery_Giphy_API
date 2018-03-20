var giphyAPI_Homework = {
	topics:["wildlife+forest", "manta+ray", "funny+animals", 
		"animals-camouflage", "macaw", "flying-fish", "polar+bear",
	    "flying+seagull", "africa+zebras", "koi+pond"],

	isFixedImages:[true, true, true, true, true, true, true, true, true, true],

	giphyObj:null,

	displayListWords:function(){
	    for(var i=0 ; i<giphyAPI_Homework.topics.length ; i++){
	        $(".wordsSearch").append(
	            "<div class='searchExpr' value='" + i + "'>" + 
	            giphyAPI_Homework.topics[i].replace(/\+/gm, " ") + "</div>"
	        );
	        $(".searchExpr").on("click", function(){
	            giphyAPI_Homework.requestGiphy(giphyAPI_Homework.topics[$(this).attr("value")]);
	        });
	    }    
	    // display one topic (selected randomly) for the very first time
	    giphyAPI_Homework.requestGiphy(giphyAPI_Homework.topics[Math.floor(Math.random()*giphyAPI_Homework.topics.length)]);
	},	

	requestGiphy:function(name){
	    $.ajax({
	        url:"http://api.giphy.com/v1/gifs/search?q=" + name + "&limit=10&api_key=dc6zaTOxFJmzC",  
	        method:'GET'
	    }).done(function(response){
	        if(response.meta.status==200){ // the request is OK
	            giphyAPI_Homework.giphyObj = response;
	            giphyAPI_Homework.showImages(response);
	        }
	        else
	            alert("Error code: " + response.meta.status);
	    });
	},

	showImages:function(){
	    var colNum = 4;   // 4 pictures per row
    	$(".result").children().remove();
	    $(".result").append("<table align='center'><tr>");
	    var num = giphyAPI_Homework.giphyObj.data.length%colNum + giphyAPI_Homework.giphyObj.data.length;
	    for(var i=0 ; i<=num ; i++){
	        if(i&&(i%colNum==0)) {  // end of the row of "colNum" columns ...
	            if(i<num) $(".result").append("</tr><tr>");
	            else $(".result").append("</tr>");
	        }
	        if(i<giphyAPI_Homework.giphyObj.data.length){
	            $(".result").append("<td><span class='portrait myimg" + i.toString() + "' value=" + i + "></span></td>");
	            $(".myimg" + i.toString()).append(" Rating: &quot;" + giphyAPI_Homework.giphyObj.data[i].rating + 
	            	"&quot;<br><img class='aImg" + i.toString() + "' src='" + 
	            	giphyAPI_Homework.giphyObj.data[i].images.fixed_width_still.url + 
	            	"' data-state='still' data-still='" + 	            	
	            	giphyAPI_Homework.giphyObj.data[i].images.fixed_width_still.url
	            	+"' data-animate='" +
	            	giphyAPI_Homework.giphyObj.data[i].images.downsized.url
	            	+ "' width='260px'>");
	            $(".aImg" + i.toString()).on("click", function(){
	            	var state = $(this).attr("data-state");
	            	if(state == "still"){
	            		$(this).attr("src", $(this).data("animate"));
	            		$(this).attr("data-state", "animate");
	            	}
	            	else if (state == "animate"){
	            		$(this).attr("src", $(this).data("still"));
	            		$(this).attr("data-state", "still");
	            	}
	                $(".myimg" + $(this).attr("value")).html("");
	                $(".myimg" + $(this).attr("value")).append(giphyAPI_Homework.getFixedOrGifImg($(this).attr("value")));
	            });
	        }
	        else $(".result").append("<td></td>");
	    }
	    $(".result").append("<tr><td colspan='" + colNum + "'>&nbsp;<br></td></tr>");
	    $(".result").append("<tr><td colspan='" + colNum + "' align='center' bgcolor='#CCCCCC'><img src='assets/images/powered_by_giphy.png'></td></tr></table>");
	},

	getInputSearch:function(){
	    var expression = document.getElementById("myText").value;
	    if(expression.length){
	        expression = expression.replace(/\s/gim, "+"); // Regular Expression is used
	        document.getElementById("myText").value = "";
	        giphyAPI_Homework.topics.push(expression);
	        giphyAPI_Homework.requestGiphy(expression);
	        $(".wordsSearch").append("<span class='searchExpr' value='" + (giphyAPI_Homework.topics.length-1) + "'>" + expression.replace(/\+/gm, " ") +  "</span>");
	        $(".searchExpr").on("click", function(){
	        	giphyAPI_Homework.getInputSearch();
	            //giphyAPI_Homework.requestGiphy(giphyAPI_Homework.topics[$(this).attr("value")]);
	        });
	    }
	},		
};

giphyAPI_Homework.displayListWords();

window.addEventListener("keydown", function(e){
    if(e.keyCode==13) // the key Enter is down
        giphyAPI_Homework.getInputSearch();
});