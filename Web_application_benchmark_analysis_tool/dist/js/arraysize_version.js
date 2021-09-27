
// This function is a little different among three versions since the "Show-selection area" are different (different title rows).
function addOption(){
    var optionContainer = new Array(4)
    optionContainer[0] = document.getElementById("array_clauses")
    optionContainer[1] = document.getElementById("platforms")
    optionContainer[2] = document.getElementById("num_of_threads")
    optionContainer[3] = document.getElementById("compilers")
    var eleTR = document.createElement("tr")

    for (var index=0; index<4; index++) {
        var selectedIndex = optionContainer[index].selectedIndex
        if (selectedIndex != 0) {
            var eleTD = document.createElement("td")
            var content = document.createTextNode(optionContainer[index].options[selectedIndex].text)
            eleTD.appendChild(content)
            eleTR.appendChild(eleTD)
        } else {
            alert("Exist unselected options!")
            return
        }
    }


    var deleteButton = document.createElement("input")
    deleteButton.type = "button"
    deleteButton.value = "delete"
    deleteButton.class = "delete_button"
    deleteButton.onclick = function(){
        var parentNode = eleTR.parentElement
        parentNode.removeChild(eleTR)
        data_visualisation()
    }
    eleTD = document.createElement("td")
    eleTD.appendChild(deleteButton)
    eleTR.appendChild(eleTD)
    var optionsTable = document.getElementById("optionsTable")
    optionsTable.appendChild(eleTR)
    var radioButton = document.getElementsByName("scale method_y")
    data_visualisation()
}

// Send request to the back-end using AJAX. The configuration of ECharts only apply to the array size version.
function data_visualisation(){
    var allRows = []
    var tb = document.getElementById("optionsTable");
    var rows = tb.rows;
    for(var i=1;i<rows.length;i++){
        var eachRow = []
        var cells = rows[i].cells;
        for(var j=0;j<cells.length-1;j++){
            eachRow.push(cells[j].innerText)
        }
        allRows.push(eachRow)
    }
    $.ajax(
        {
            "type": "post",
            "url": "/api/arraysize/",
            "data": JSON.stringify(allRows),
            "success": function(data){
                var myChart = echarts.init(document.getElementById("visualisationArea"))
                var scale_x =document.getElementsByName("scale method_x")
                var scale_y = document.getElementsByName("scale method_y")
                if (scale_x[1].checked && scale_y[1].checked) { // log log
                    var option = {
                        grid:{
                            left: '3.8%',   //The distance of the chart from the border
                            right: '3%',
                            bottom: '5%',
                            top: "14%",
                            containLabel: true
                        },

                        toolbox: {
                            feature: {
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // Use axis to trigger tooltip
                                type: 'line'        // 'shadow' as default; can also be 'line' or 'shadow'
                            },
                            textStyle: {
                                fontSize: 12
                            },
                            formatter: function(params){
                                var res = '  Array size: '+params[0].value[0]
                                for(var i=0; i<params.length; i++){
                                    res+='<br>'+params[i].marker + params[i].seriesName+': '+'<b>'+params[i].value[1]+'</b>'+' (μs)'
                                }
                                return res
                            }
                        },
                        legend: {
                            /*type: "scroll",
                            top: "2%",*/
                            type: 'plain',
                            orient: 'horizontal',
                            data: data.legend_data,
                            textStyle: {
                                fontSize: 10.5,
                                fontStyle: 'italic'
                            },
                        },
                        xAxis: {
                            type: "category",
                            /*logBase: 3,*/
                            name:'Array size',
                            nameLocation:'middle',
                            nameGap: 21,
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                            boundaryGap: false,
                        },
                        yAxis: {
                            type:"log",
                            name:'Overhead (microseconds)',
                            nameLocation:'middle',
                            nameGap: 36,
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                        },
                        series: data.series,
                    };
                }
                else if (scale_x[1].checked && scale_y[0].checked){ // log value
                    var option = {
                        grid:{
                            left: '3.8%',   //The distance of the chart from the border
                            right: '3%',
                            bottom: '5%',
                            top: "14%",
                            containLabel: true
                        },

                        toolbox: {
                            feature: {
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // Use axis to trigger tooltip
                                type: 'line'        // 'shadow' as default; can also be 'line' or 'shadow'
                            },
                            textStyle: {
                                fontSize: 12
                            },
                            formatter: function(params){
                                var res = '  Array size: '+params[0].value[0]
                                for(var i=0; i<params.length; i++){
                                    res+='<br>'+params[i].marker + params[i].seriesName+': '+'<b>'+params[i].value[1]+'</b>'+' (μs)'
                                }
                                return res
                            }
                        },
                        legend: {
                            /*type: "scroll",
                            top: "2%",*/
                            type: 'plain',
                            orient: 'horizontal',
                            data: data.legend_data,
                            textStyle: {
                                fontSize: 10.5,
                                fontStyle: 'italic'
                            },
                        },
                        xAxis: {
                            type: "category",
                            name:'Array size',
                            nameLocation:'middle',
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                            nameGap: 21,
                            boundaryGap: false,
                        },
                        yAxis: {
                            type:"value",
                            name:'Overhead (microseconds)',
                            nameLocation:'middle',
                            nameGap: 36,
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                        },
                        series: data.series,
                    };
                } else if(scale_x[0].checked && scale_y[1].checked){ //value log
                    var option = {
                        grid:{
                            left: '3.8%',
                            right: '3%',
                            bottom: '12%',
                            top: "14%",
                            containLabel: true
                        },

                        toolbox: {
                            feature: {
                            }
                        },
                        dataZoom: [{type:"inside"}],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // Use axis to trigger tooltip
                                type: 'line'        // 'shadow' as default; can also be 'line' or 'shadow'
                            },
                            textStyle: {
                              fontSize: 12
                            },
                            formatter: function(params){
                                var res = '  Array size: '+params[0].value[0]
                                for(var i=0; i<params.length; i++){
                                    res+='<br>'+params[i].marker + params[i].seriesName+': '+'<b>'+params[i].value[1]+'</b>'+' (μs)'
                                }
                                return res
                            }
                        },
                        legend: {
                            /*type: "scroll",
                            top: "2%",*/
                            type: 'plain',
                            orient: 'horizontal',
                            data: data.legend_data,
                            textStyle: {
                                fontSize: 10.5,
                                fontStyle: 'italic'
                            },
                        },
                        xAxis: {
                            type: "value",
                            name:'Array size',
                            nameLocation:'middle',
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                            nameGap: 21,
                            boundaryGap: false,
                        },
                        yAxis: {
                            type:"log",
                            name:'Overhead (microseconds)',
                            nameLocation:'middle',
                            nameGap: 36,
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                        },
                        series: data.series,
                    };
                } else if (scale_x[0].checked && scale_y[0].checked){
                    var option = {
                        grid:{
                            left: '3.8%',
                            right: '3%',
                            bottom: '12%',
                            top: "14%",
                            containLabel: true
                        },

                        toolbox: {
                            feature: {
                            }
                        },
                        dataZoom: [{type:"inside"}],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // Use axis to trigger tooltip
                                type: 'line'        // 'shadow' as default; can also be 'line' or 'shadow'
                            },
                            textStyle: {
                                fontSize: 12
                            },
                            formatter: function(params){
                                var res = '  Array size: '+params[0].value[0]
                                for(var i=0; i<params.length; i++){
                                    res+='<br>'+params[i].marker + params[i].seriesName+': '+'<b>'+params[i].value[1]+'</b>'+' (μs)'
                                }
                                return res
                            }
                        },
                        legend: {
                            /*type: "scroll",
                            top: "2%",*/
                            type: 'plain',
                            orient: 'horizontal',
                            data: data.legend_data,
                            textStyle: {
                                fontSize: 10.5,
                                fontStyle: 'italic'
                            },
                        },
                        xAxis: {
                            type: "value",
                            name:'Array size',
                            nameLocation:'middle',
                            nameGap: 20,
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                            nameGap: 21,
                            boundaryGap: false,
                        },
                        yAxis: {
                            type:"value",
                            name:'Overhead (microseconds)',
                            nameLocation:'middle',
                            nameGap: 36,
                            nameTextStyle:{
                                color:"black",
                                fontSize:12,
                            },
                        },
                        series: data.series,
                    };
                }

                // Display the chart using the configuration items and data just specified.
                myChart.setOption(option, true)

                window.addEventListener("resize", function () {
                    myChart.resize();
                });

            }
        })
}
