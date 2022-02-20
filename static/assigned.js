

reset=()=>{
    try{
    document.getElementById("editbtn").value=0;
    }
    catch{
        console.log("notfound");
    }
}

let url = "/teacher_api";

function getData()
{
    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){
        console.log("working");
        console.log("checking: "+obj[0].assignment.length);
        console.log("deadline: "+obj[0].assignment[0].title);
        str="";
        for(var i=0;i<obj[0].assignment.length;i++)
        {
            str+=` 
            <form action = "/edit" method="POST">
            <input type="text" name="email" id="email" value="${obj[0].email}" class=
            "hide">
            <div class="row">
            <div class="title">
            <input type="text" name="assign_id" class="hide" value="${obj[0].assignment[i].assign_id}"></h3>
            <input type="text" name="title" value="${obj[0].assignment[i].title}"></h3>
            </div>
            <div class="content">
            <textarea name="content" id="content" cols="30" rows="6">${obj[0].assignment[i].content}</textarea>
            </div>
            <div class="deadline">
            <input type="date" id = "deadline" name="deadline" value="${obj[0].assignment[i].deadline.substr(0,10)}">
            </div>
            <div class="btns">
            <button name = "edit" value="10" id="editbtn">Update</button>
            <button name = "edit" value=-1 id="deletbtn">delete</button>
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