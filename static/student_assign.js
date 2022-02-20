let url = "/subject_api";
var emailvalue = document.getElementById("teacher_email").value;
var studemail = document.getElementById("studemail").value
function getData()
{
    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){
        console.log("working: "+obj[0].assignment.length);
        console.log("working: "+obj[0].assignment[0].submission.length);

        str="";
        var found;
        for(var i=0;i<obj[0].assignment.length;i++)
        {
            found=0;
                for(var j=0;j<obj[0].assignment[i].submission.length;j++)
                {
               
                if(obj[0].assignment[i].submission[j].subemail===studemail){
                    console.log("inside found")
                found=1;
                }
            }
            console.log("found:  "+found);
        
            if(found==0)
            str+=`
            <form action="/submit" method="POST">
            <div class="row">
            <input type="text" name="email" id="teacher_email" value="${emailvalue}" class="hide">
                     <div class="title">
                        <h3>${obj[0].assignment[i].title}</h3>
                        <input type="text" name="assign_id" class="hide" value="${obj[0].assignment[i].assign_id}">
                        <input type="text" name="title" value="${obj[0].assignment[i].title}">
                    </div>
                    <div class="content">
                        <p>${obj[0].assignment[i].content}</p>
                    </div>
                    <div class="deadline">
                        <p>${obj[0].assignment[i].deadline}</p>
                    </div>
                    <div class = "submit">
                        <button name="submission">Submit</button>
                    </div>
                    </div>
                    </form>`
            
        }
        document.getElementById("assignments").innerHTML=str;
    }).catch(function(error){
        console.log(error);
    })
}
getData();