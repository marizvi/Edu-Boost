let url="/api";
var studemail = document.getElementById("studemail").value

pending=()=>{

    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){
        console.log(obj[0].studentCode[0].assignment.length);
        var today = new Date();
        var str="";
        var found=0;
        for(var i=0;i<obj[0].studentCode.length;i++)
        {
            for(var j=0;j<obj[0].studentCode[i].assignment.length;j++)
            {
                
                if(!obj[0].studentCode[i].assignment[j].isSubmitted)
                {   
                var temp=obj[0].studentCode[i].assignment[j];
                // var current=Date.parse(temp.deadline);
                var current = new Date(temp.deadline);
                if(current > today)
                {
                str+=`
                    <div class="list">
                    <h3 class="title"> ${temp.title}
                    </h3>
                    <h4 class = "subject">${obj[0].studentCode[i].subject}</h4>
                    <h5 class="deadline">${current.toString().substr(0,10)}
                    </h5>
                    </div>
                `
                }
            }
            }
        }
        document.getElementById("todolist").innerHTML=str;
    })
}
missing=()=>{

    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){
        console.log(obj.length);
        var today = new Date();
        var str="";
        for(var i=0;i<obj[0].studentCode.length;i++)
        {
            for(var j=0;j<obj[0].studentCode[i].assignment.length;j++)
            {
                
                if(!obj[0].studentCode[i].assignment[j].isSubmitted)
                {   
                var temp=obj[0].studentCode[i].assignment[j];
                // var current=Date.parse(temp.deadline);
                var current = new Date(temp.deadline);
                if(current < today)
                {
                // console.log(temp.title+" "+current);
                 str+=`
                    <div class="list">
                    <h3 class="title"> ${temp.title}
                    </h3>
                    <h4 class = "subject">${obj[0].studentCode[i].subject}</h4>
                    <h5 class="deadline">${current.toString().substr(0,10)}
                    </h5>
                    </div>
                `
                }
            }
            }
        }
        document.getElementById("todolist").innerHTML=str;
    })
}
done=()=>{

    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){
        console.log(obj.length);
        var today = new Date();
        var str="";
        var found=0;
        for(var i=0;i<obj[0].studentCode.length;i++)
        {
            for(var j=0;j<obj[0].studentCode[i].assignment.length;j++)
            {
                if(obj[0].studentCode[i].assignment[j].isSubmitted)
                {   
                var temp=obj[0].studentCode[i].assignment[j];
                // var current=Date.parse(temp.deadline);
                var current = new Date(temp.deadline);
                
                str+=`
                    <div class="list">
                    <h3 class="title"> ${temp.title}
                    </h3>
                    <h4 class = "subject">${obj[0].studentCode[i].subject}</h4>
                    <h5 class="deadline">${current.toString().substr(0,10)}
                    </h5>
                    </div>
                `
            }
            }
        }
        document.getElementById("todolist").innerHTML=str;
    })
}
pending();