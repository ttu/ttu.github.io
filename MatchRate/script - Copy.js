$(document).ready(function() {
    $('#menu').toggleClass('hide');
    //$('#container').load('events.html .event', function() {
    //    initializeEvent();
    //});
	// Get initial data
	$.getJSON('data.json', function(data) {
		processContent(data, true);		
		initializeEvent();
	});
});

function processContent(data, fullData){
// Go through all events in JSON data
		$.each(data.events, function(event) {
			var fights = [];
			var arrowImage = '';
			// Not the most elegant solution to modify DOM in the days of jquery..
			var fightsContent = '';
			
			// Fights might be null when just bringing titles of events
			if (this.fights != null){
				// If has fights then arrows is pointing down, cos div will be open by default
				arrowImage = '<img src="images/arrow_up.gif" />';
				
				var contentBeginning = '<div class="content"><ul>';
				if (!fullData)
					contentBeginning = '<div class="content"><ul style="display: none;">';
					
				fightsContent += contentBeginning;
				
				$.each(this.fights, function(fight) {
					var fightBeginning = '<li><div id="'+ this.id +'" class="fight">';
					fightsContent += fightBeginning;
					
					var fightTitle = '<span class="fighttitle"><a href="'+this.fighter1.url+'">'+this.fighter1.name+'</a> - <a href="'+this.fighter2.url+'">'+this.fighter2.name+'</a></span>'
					fightsContent += fightTitle;
					
					var likeDislike = '<span class="dislike" ><img src="images/dislike.png"/><span class="clickcount">'+ this.down +'</span></span><span class="like" ><img src="images/like.png"/><span class="clickcount">'+ this.up +'</span></span>';
					fightsContent += likeDislike;
					
					var fightEnd = '</div></li>';
					fightsContent += fightEnd;					
					//fights.push(this.id);
				});
				
				var contentEnd = '</ul></div>';
				
				fightsContent += contentEnd;
			}
			else{
				arrowImage = '<img src="images/arrow_down.gif" />';
				// Create link to get data
			}
						
			if (fullData){
				var title = '<label class="eventname">' + this.name + '</label>';
				var date = '<label class="eventdate">('+ this.date +')</label>';
				
				var eventBeginning = '<div class="header" onclick="hideContent('+this.id+')">'
				var eventEnd = '</div>';
				
				var fullHtml = eventBeginning + title + date + arrowImage + eventEnd + fightsContent;// + fights.join('');
				
				// All should be done more like this
				$('<div/>',{
					'id': this.id,
					'class': 'event',
					html: fullHtml
				}).appendTo('#container');
			}
			else{
				$('#'+ this.id).append(fightsContent);
			}
		});
};

function initializeEvent(){
	$('.like img').click(function() {
            // First parent is span .like and second is div
            voteClick($(this).parent().parent(), true);
        });

        $('.dislike img').click(function() {
            voteClick($(this).parent().parent(), false);
        });

		// TODO: Change cursor switching to better
        $('.like img').hover(function() {
            $(this).css('cursor', 'pointer');
        });

        $('.dislike img').hover(function() {
            $(this).css('cursor', 'pointer');
        });

        $('.fighttitle a').mouseover(function() {
            // TODO: Show layer with fighter info
            //showInfoBox(this);
        });
}
$.ajaxSetup({
    // Disable caching of AJAX responses */
    cache: false
});

// Show info layer of fighter
function showInfoBox(link) {
    var linkUrl = $(link).attr('href');
};

// Change color of background and unbind events
// Voting just raises number by one
// TODO: Check if voting exception should be shown to user
function voteClick(div, up) {
    var id = $(div).attr('id');
    $(div).css('background-color', '#CECECE');

    // Change image
    if (up) {
        var src = $('.like > img', div).attr('src').replace("like.png", "like_green.png");
        $('.like > img', div).attr('src', src);
        var text = $('.like > .clickCount', div)[0].innerHTML;
        var value = parseInt(text);
        $('.like > .clickCount', div)[0].innerHTML = value + 1;
    }
    else {
        var src = $('.dislike > img', div).attr('src').replace("dislike.png", "dislike_red.png");
        $('.dislike > img', div).attr('src', src);
        var text = $('.dislike > .clickCount', div)[0].innerHTML;
        var value = parseInt(text);
        $('.dislike > .clickCount', div)[0].innerHTML = value + 1;
    }

    // Disable click
    $('.like > img', div).unbind('click');
    $('.dislike > img', div).unbind('click');

    // Unbind hover and clear style (takes pointer away)
	$('.like > img', div).unbind('mouseenter mouseleave');
	$('.dislike > img', div).unbind('mouseenter mouseleave');
    $('.like > img', div).attr('style', '');
    $('.dislike > img', div).attr('style', '');
};

// Hide/Show event content
function hideContent(id) {
	// Check if needs to get data from server
	if ($('#' + id + ' ul').length == 0){
		getNewContent(id);
		return;
	}
	
    if ($('#' + id + ' ul').is(":hidden")) {
			$('#' + id + ' ul').slideDown();
			var src = $('#' + id + ' .header img').attr('src').replace("_down", "_up");
			$('#' + id + ' .header img').attr('src', src);
		
    }
    else {
        $('#' + id + ' ul').slideUp();
        var src = $('#' + id + ' .header img').attr('src').replace("_up", "_down");
        $('#' + id + ' .header img').attr('src', src);
    }
};

function getNewContent(id){

	$.getJSON(id +'.json', function(data) {
		processContent(data, false);		
		initializeEvent();
				
		$('#' + id + ' ul').slideDown();
		var src = $('#' + id + ' .header img').attr('src').replace("_down", "_up");
		$('#' + id + ' .header img').attr('src', src);
	});
};

// Show hide menu
function toggleMenu() {
    $('#menu').toggleClass('hide');
    $('#header .leftButton').toggleClass('pressed');
};


	
	
	
