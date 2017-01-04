$(function(argument) {
    console.log("---+++");
    var url = "/src/js/flying.csv";
    Papa.parse(url, {
        download: true,
        complete:function(){
            console.log("isOk");
        }
        // rest of config ...
    })
})