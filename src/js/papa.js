$(function(argument) {
    console.log("---+++");
    var url = "/src/js/flying.csv";
    Papa.parse(url, {
        download: true,
        complete:function(data){
            var data = data.data;
            store("data",data);
            console.log("isOk");
        }
        // rest of config ...
    })
})