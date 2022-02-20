let url = "/subject_api";
function getData()
{
    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){

        str="";
        for(var i=0;i<obj[0].notice.length;i++)
        {
            str+=`
            <div class="row">
                     <div class="title">
                        <h3>${obj[0].notice[i].title}</h3>
                    </div>
                    <div class="content">
                        <p>${obj[0].notice[i].content}</p>
                    </div>
                    <div class="date">
                        <p>${obj[0].notice[i].date}</p>
                    </div>
                    </div>
                    `
            
        }
        document.getElementById("notice").innerHTML=str;
    }).catch(function(error){
        console.log(error);
    })
}
getData();