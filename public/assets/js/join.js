function showImage() {
	$('.join').on('click', 'button', function(){
		$(this).append("<span class='member'><img src='../img/person.svg'></span>");
	});
}

function getGroupLimit() {

}
var groupLimit = $('join');
// for (var x <= $(groupLimit);