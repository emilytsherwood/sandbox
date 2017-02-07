function showImage() {
	$('.join').on('click', 'button', function(){
		$(this).append("<span class='member'><img src='../img/person.svg'></span>");
	});
}