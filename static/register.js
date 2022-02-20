tech=()=>{
document.getElementById("teacher").value = 1;
}
stud=()=>{
document.getElementById("student").value = 1;
}
getcode=()=>{

function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += 
          arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

document.getElementById("subjectcode").value=randomStr(12,'1234567890zsUefbhilmNqWeZKp');
}
getcode();