
function preventResub() {
    // console.log("prevents");
    // document.getElementById('prevSub').value = "";
}

let url = "/api";

function getData()
{
    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){
        console.log("working");
        // console.log("lengthh: "+obj.length);
        // console.log("checking: "+obj[0].subject);
        str=""
        for(var i=0;i<obj[0].studentCode.length;i++)
        {
            str +=`
            <div class="box" id = "box">
            <form action="/student" method="POST">
            <div class="title">
            <h3>${obj[0].studentCode[i].subject}</h3>
            </div>
            <div class="teacher">
            <p>${obj[0].studentCode[i].username}</p>
            </div>
            <input type="text" name="email" id="email" class="email" value="${obj[0].studentCode[i].email}">
            <div class="assign_btn" id="bttn">
            <button value="${obj[0].studentCode[i].email}" name="button" >Assignments</button>
            </form>
            <form action="/student_notice" method="POST">
            <button name="button" value="${obj[0].studentCode[i].email}">Notice</button>
            </form>
            </div>
            </div>`
        }
        document.getElementById("teachers").innerHTML=str;
    }).catch(function(error){
        console.log("inside catch");
    })
}
getData();
