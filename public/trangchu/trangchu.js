$(document).ready(function(){
	$(".msg_send_btn").click(function(){

		var message = $("#message").val();
		if(message=="" || message == null){
			return ;
		}
		var date= new Date();
		var d1 =date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear() +" " +date.getHours()+":" +date.getMinutes();
		$(".msg_history").append("<div class='outgoing_msg'><div class='sent_msg'>"+"<p>"+message+"</p> "+"<span class='time_date'>" + d1+"    </span> </div></div>");          
		//alert(message);
		$("#message").val("");
		// $(".msg_history").scrollTop
		var height1;
		
     $(".msg_history").scrollTop($('#msg_history').height() + 1500);

	});
	
	
	

});