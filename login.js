$("#registry").click(function() {
// $.post('/registry', {category: $('userNameR, type:'premium'}, function(response){ 
//       alert("success");
//       $("#mypar").html(response.amount);
// });

$("#formRegistry").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
           type: "POST",
           url: url,
           data: form.serialize(), // serializes the form's elements.
           success: function(data)
           {
            if (data == "") {
              window.location.replace("http://www.w3schools.com");
              return;
            }
            $("#notification").append("<div class=\"alert alert-danger\"><strong>Danger!</strong> " + data + "</div>");
               
           }
         });


});
});

$("#signup").click(function() {
$("#first").fadeOut("fast", function() {
$("#second").fadeIn("fast");
});
});

$("#signin").click(function() {
$("#second").fadeOut("fast", function() {
$("#first").fadeIn("fast");
});
});


  
         $(function() {
           $("form[name='login']").validate({
             rules: {
               
               email: {
                 required: true,
                 email: true
               },
               password: {
                 required: true,
                 
               }
             },
              messages: {
               email: "Please enter a valid email address",
              
               password: {
                 required: "Please enter password",
                
               }
               
             },
             submitHandler: function(form) {
               form.submit();
             }
           });
         });
         

/*
$(function() {
  
  $("form[name='registration']").validate({
    rules: {
      firstname: "required",
      lastname: "required",
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 5
      }
    },
    
    messages: {
      firstname: "Please enter your firstname",
      lastname: "Please enter your lastname",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      email: "Please enter a valid email address"
    },
  
    submitHandler: function(form) {
      form.submit();
    }
  });
});
*/
/*
$(function(){
  $("form[name='login']").validate(
    rules:{
      password: {
        required : true,
        minlength: 5
      }
    },
    messages:{
      password:{
        required: "please Enter Your password",
        minlength: "Your password must be at least 5 characters long"
      }
    },
    submitHandler: function(form){
      form.submit();
    }
    );
});
*/