function showImage() {
	$('.join').on('click', function(){
        var newMember = "<span class='member'><img src='/assets/img/person.svg'></span>";
		$('.members').after(newMember);
	});
    
}
function removeImage(){
    $('member').on('click', function(){
        $(this).remove();
    });
}
showImage();
removeImage();
