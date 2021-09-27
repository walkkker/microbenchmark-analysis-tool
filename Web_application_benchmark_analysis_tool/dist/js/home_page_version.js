
// This function is a little different among three versions since the "Show-selection area" is different (different title rows).
function addOption(){
    var optionContainer = new Array(4)
    optionContainer[0] = document.getElementById("benchTypes")
    optionContainer[1] = document.getElementById("directives")
    optionContainer[2] = document.getElementById("platforms")
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


// Send request to the back-end server. The configurations of ECharts are different among the three versions.
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
            "url": "/api/num_of_threads/",
            "data": JSON.stringify(allRows),
            "success": function(data){
                var myChart = echarts.init(document.getElementById("visualisationArea"))
                var scale_x =document.getElementsByName("scale method_x")
                var scale_y = document.getElementsByName("scale method_y")
                if (scale_x[1].checked && scale_y[1].checked) { // log log
                    var option = {
                        grid:{
                            left: '3.8%',
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
                            axisPointer: {
                                type: 'line'        // 'shadow' as default; can also be 'line' or 'shadow'
                            },
                            textStyle: {
                                fontSize: 12
                            },
                            // Use callback function to show our designed format in tip box
                            formatter: function(params){
                                var res = '  '+params[0].value[0]+' thread(s)'
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
                            type: "log",
                            logBase: 2,
                            name:'Number of threads',
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
                            left: '3.8%',
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
                                var res = '  '+params[0].value[0]+' thread(s)'
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
                            type: "log",
                            logBase: 2,
                            name:'Number of threads',
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
                            bottom: '5%',
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
                                var res = '  '+params[0].value[0]+' thread(s)'
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
                            name:'Number of threads',
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
                            bottom: '5%',
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
                                var res = '  '+params[0].value[0]+' thread(s)'
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
                            name:'Number of threads',
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

// Show corresponding directive/construct options when users choose a benchmark type.
function benchmark_directive(value) {
    sync_list = ['PARALLEL', 'FOR', 'PARALLEL FOR', 'BARRIER', 'SINGLE', 'CRITICAL', 'LOCK/UNLOCK', 'ORDERED', 'ATOMIC', 'REDUCTION']
    task_list = ['PARALLEL TASK', 'MASTER TASK', 'MASTER TASK BUSY SLAVES', 'CONDITIONAL TASK', 'TASK WAIT', 'TASK BARRIER', 'NESTED TASK', 'NESTED MASTER TASK', 'BRANCH TASK TREE', 'LEAF TASK TREE']
    loop_list = ['STATIC', 'STATIC 1', 'STATIC 2', 'STATIC 4', 'STATIC 8', 'STATIC 16', 'STATIC 32', 'STATIC 64', 'STATIC 128', 'DYNAMIC 1', 'DYNAMIC 2', 'DYNAMIC 4', 'DYNAMIC 8', 'DYNAMIC 16', 'DYNAMIC 32', 'DYNAMIC 64', 'DYNAMIC 128', 'GUIDED 1', 'GUIDED 2', 'GUIDED 4', 'GUIDED 8', 'GUIDED 16', 'GUIDED 32', 'GUIDED 64']
    array_list = ["PRIVATE 1","PRIVATE 3","PRIVATE 9","PRIVATE 27","PRIVATE 81","PRIVATE 243","PRIVATE 729","PRIVATE 2187","PRIVATE 6561","PRIVATE 19683","PRIVATE 59049","FIRSTPRIVATE 1","FIRSTPRIVATE 3","FIRSTPRIVATE 9","FIRSTPRIVATE 27","FIRSTPRIVATE 81","FIRSTPRIVATE 243","FIRSTPRIVATE 729","FIRSTPRIVATE 2187","FIRSTPRIVATE 6561","FIRSTPRIVATE 19683","FIRSTPRIVATE 59049","COPYPRIVATE 1","COPYPRIVATE 3","COPYPRIVATE 9","COPYPRIVATE 27","COPYPRIVATE 81","COPYPRIVATE 243","COPYPRIVATE 729","COPYPRIVATE 2187","COPYPRIVATE 6561","COPYPRIVATE 19683","COPYPRIVATE 59049","COPYIN 1","COPYIN 3","COPYIN 9","COPYIN 27","COPYIN 81","COPYIN 243","COPYIN 729","COPYIN 2187","COPYIN 6561","COPYIN 19683","COPYIN 59049"]
    directive = document.getElementById("directives")
    directive.innerHTML = "<option value=\"0\" class=\"defaultFont\">Directives</option>"
    if (value == "sync") {
        for (var i = 0; i < sync_list.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = sync_list[i]
            directive.appendChild(inserted_option)
        }
    }
    else if (value == "task") {
        for (var i = 0; i < task_list.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = task_list[i]
            directive.appendChild(inserted_option)
        }
    }
    else if (value == "loop") {
        for (var i = 0; i < loop_list.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = loop_list[i]
            directive.appendChild(inserted_option)
        }
    }
    else if (value == "array") {
        for (var i = 0; i < array_list.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = array_list[i]
            directive.appendChild(inserted_option)
        }
    }
}
