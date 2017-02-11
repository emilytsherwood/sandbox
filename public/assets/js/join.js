$(document).ready(function(){
    $('.join').on('click', function(event){
        event.preventDefault();
        var newMember = "<li class='member'><img src='/assets/img/person.svg'></li>";
        var target = $(this).first('.members');
		target.after(newMember);
	});

    $('member').on('click', function(){
        $(this).remove();
    });
});