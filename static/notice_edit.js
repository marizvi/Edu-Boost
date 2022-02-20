

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
        str="";
        for(var i=0;i<obj[0].notice.length;i++)
        {
            str+=` 
            <form action = "/notice_edit" method="POST">
            <input type="text" name="email" id="email" value="${obj[0].email}" class="hide">
            <div class="row">
            <div class="title">
            <input type="text" name="notice_id" class="hide" value="${obj[0].notice[i].notice_id}"></h3>
            <input type="text" name="title" value="${obj[0].notice[i].title}"></h3>
            </div>
            <div class="content">
            <textarea name="content" id="content" cols="30" rows="6">${obj[0].notice[i].content}</textarea>
            </div>
            <div class="date">
            <p>${obj[0].notice[i].date}</p>
            </div>
            <div class="btns">
            <button name = "edit" value="10" id="editbtn">Update</button>
            <button name = "edit" value=-1 id="deletbtn">delete</button>
            </div>
            </div>
            </form>`
        }
        document.getElementById("notice").innerHTML=str;
    }).catch(function(error){
        console.log(error);
    })
}
getData();