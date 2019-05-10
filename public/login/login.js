// $("#registry").click(function() {
//   $("#formRegistry").submit(function(e) {

//       e.preventDefault(); // avoid to execute the actual submit of the form.

//       var form = $(this);
//       var url = form.attr('action');

//       $.ajax({
//             type: "POST",
//             url: url,
//             data: form.serialize(), // serializes the form's elements.
//             success: function(data)
//             {
//               if (data == "") {
//                 window.location.replace("http://localhost:3000");
//                 return;
//               }
//               $("#notification_regis").empty();
//               $("#notification_regis").append("<div class=\"alert alert-danger\"><strong>Danger!</strong> " + data + "</div>");
              
//             }
//           });
//   });
// });

// $("#loginbtn").click(function() {

//   $("#formLogin").submit(function(e) {

//     e.preventDefault(); // avoid to execute the actual submit of the form.

//     var form = $(this);
//     var url = form.attr('action');

//     $.ajax({
//           type: "POST",
//           url: url,
//           data: form.serialize(), // serializes the form's elements.
//           success: function(data)
//           {
//             if (data == "") {
//               window.location.replace("http://localhost:3000");
//               return;
//             }
//             $("#notification_login").empty();
//             $("#notification_login").append("<div class=\"alert alert-danger\"><strong>Danger!</strong> " + data + "</div>");
              
//           }
//         });
//   });

// });

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
              $("#formLogin").submit(function(e) {

                e.preventDefault(); // avoid to execute the actual submit of the form.
            
                var form = $(this);
                var url = form.attr('action');
                
                console.log(url);
                $.ajax({
                      type: "POST",
                      url: url,
                      data: form.serialize(), // serializes the form's elements.
                      success: function(data)
                      {
                        if (data == "") {
                          window.location.replace("http://localhost:3000");
                          return;
                        }
                        $("#notification_login").empty();
                        $("#notification_login").append("<div class=\"alert alert-danger\"><strong>Danger!</strong> " + data + "</div>");
                          
                      }
                    });
              });
             }
           });
         });
         


$(function() {
  
  $("form[name='registration']").validate({
    rules: {
      fullName: "required",
      userName: "required",
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 5
      },
      passwordCf: {
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
        // form.submit();
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
                    window.location.replace("http://localhost:3000");
                    return;
                  }
                  $("#notification_regis").empty();
                  $("#notification_regis").append("<div class=\"alert alert-danger\"><strong>Danger!</strong> " + data + "</div>");
                  
                }
              });
      });
    }
  });
});
