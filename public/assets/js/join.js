function showImage() {
	$('.join').on('click', function(){
        var newMember = "<li class='member'><img src='/assets/img/person.svg'></li>";
		$(this).next('.members').after(newMember);
	});
    
}
function removeImage(){
    $('member').on('click', function(){
        $(this).remove();
    });
}
showImage();
removeImage();
