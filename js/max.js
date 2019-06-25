//var token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjEzMDkyOTksInVzZXJuYW1lIjoiYWRtaW4ifQ.NdCW0XPF6eFa1Cqqdn1GDXw8oztNZIdBvnvUIbyICSc";
    var token = phone.getToken();
    var baseUrl = phone.getBaseUrl();
    var fSubid = phone.getfSubid();
    $("#selectCir").change(function(){
        getData($("#dateSelect").val());
    });
    var date = new Date();
    $("#dateSelect").val(date.getFullYear()+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1)));
    new Rolldate({
				el: '#dateSelect',
				format: 'YYYY-MM',
				beginYear: 2000,
				endYear: 2100,
				confirm: function(date) {
				    var d = new Date(),
					d1 = new Date(date.replace(/\-/g, "\/")),
					d2 = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/'); //如果非'YYYY-MM-DD'格式，需要另做调整
					if (d1 > d2) {
						return false;
					}else{
                    getData(date);
					}
                }
			});
	getCir();
	getData($("#dateSelect").val());
	function getCir(){
            var data={
                fSubid:fSubid
            };
            $.ajax({
                type:'GET',
                url:baseUrl+"/main/getfCircuitidsList",
                data:data,
                beforeSend:function(request){
                    request.setRequestHeader("Authorization",token)
                },
                success:function(result){
                    getTreeCir(result.data);
                    getOption(array);
                    //console.log(array);
                }
            });
	}
	var array=[];
	function getTreeCir(json){
	    $.each(json,function(key,value){
	        array.push({id:value.id,text:value.text});
	        if(value.hasOwnProperty("nodes")){
	            if(value.nodes.length>0){
	                getTreeCir(value.nodes);
	            }
	        }
	    });
	}
	function getOption(arr){
	    $("#selectCir").html("");
	    $.each(arr,function(key,value){
	        $("#selectCir").append("<option value='"+value.id+"'>"+value.text+"</option>");
	    });
	}

	function getData(date){
            var data={
                fSubid:fSubid,
                fCircuitid:$("#selectCir").val(),
                timeStart:date+"-01 00:00:00",
                timeEnd:date+"-31 23:59:59"
            };
            $.ajax({
                type:'GET',
                url:baseUrl+"/main/selectMaxMD",
                data:data,
                beforeSend:function(request){
                    request.setRequestHeader("Authorization",token)
                },
                success:function(result){
                $("#maxVal").html(result.data[0].f_MDMaxValue);
                var myDate = result.data[0].f_MDMaxTime;
                $("#timeP").html(myDate.slice(0,myDate.indexOf(".")));
                }
            });
	};