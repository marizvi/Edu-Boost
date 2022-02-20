let url="/api";

getcode=()=>{

    fetch(url).then(function(response){
        return response.json();
    }).then(function(obj){
        document.getElementById("sub_box").innerHTML=`<h2>${obj[0].teacherCode}</h2>`;
    })
}
getcode();