/*
 * The file "js_base.js" contains the common functions used in all the three versions.
 * Modifying the following values according to collected data. If you have other hardware platforms,
 * besides adding the values based on the following format, you also need to modify the function "benchmark_compiler" and "benchmark_threads" based on their formats.
 * Function "benchmark_compiler" is to show what compiler users can choose when select a platform while
 * Function "benchmark_threads" is to show which number of threads users can choose when select a platform.
 * To modify the inside code of these two functions, you just need to copy an if-else statement and modify the old variables to your new variable names.
 * In addition, go the the "index.html" line 82 to change the available platforms users could choose.
 */
Cirrus_list = ['GNU 6.3', 'GNU 8.2', 'Intel 18.0', 'Intel 19.0', 'Intel 20.4']
ARCHER2_list = ['AOCC 2.1', 'Cray 10.0', 'GNU 10.1']
Fulhame_list = ['ARM 20.0', 'GNU 10.1', 'GNU 9.2']
Cirrus_threads = [1,2,4,8,16,32]
ARCHER2_threads = [1,2,4,8,16,32,64,128]
Fulhame_threads = [1,2,4,8,16,32,64]

// When choosing a platform, show the corresponding compilers.
function benchmark_compiler(value) {
    compilers = document.getElementById("compilers")
    compilers.innerHTML = "<option value=\"0\" class=\"defaultFont\">Compilers</option>"
    if (value == "Cirrus") {
        for (var i = 0; i < Cirrus_list.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = Cirrus_list[i]
            compilers.appendChild(inserted_option)
        }
    }
    else if (value == "ARCHER2") {
        for (var i = 0; i < ARCHER2_list.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = ARCHER2_list[i]
            compilers.appendChild(inserted_option)
        }
    }
    else if (value == "Fulhame") {
        for (var i = 0; i < Fulhame_list.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = Fulhame_list[i]
            compilers.appendChild(inserted_option)
        }
    }
}

// When choosing a platform, show the available number of threads.
function benchmark_threads(value){
    num_of_threads = document.getElementById("num_of_threads")
    num_of_threads.innerHTML = "<option value=\"0\" class=\"defaultFont\">Num of threads</option>"
    if (value == "Cirrus") {
        for (var i = 0; i < Cirrus_threads.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = Cirrus_threads[i]
            num_of_threads.appendChild(inserted_option)
        }
    }
    else if (value == "ARCHER2") {
        for (var i = 0; i < ARCHER2_threads.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = ARCHER2_threads[i]
            num_of_threads.appendChild(inserted_option)
        }
    }
    else if (value == "Fulhame") {
        for (var i = 0; i < Fulhame_threads.length;i++)
        {
            inserted_option = document.createElement("option")
            inserted_option.innerText = Fulhame_threads[i]
            num_of_threads.appendChild(inserted_option)
        }
    }
}


/*
 * Used for chunksize version and array size version. When choosing a platform, the options of corresponding compilers and number
 * of threads will be displayed.
 */
function benchmark_compiler_threads(value) {
    benchmark_compiler(value)
    benchmark_threads(value)
}

// Used for the "clear" button
function clearOption(){
    var tb = document.getElementById("optionsTable")
    while(tb.children[1]){
        tb.removeChild(tb.children[1])
    }
    var myChart = echarts.init(document.getElementById("visualisationArea"))
    myChart.clear()
}

// Used for changing scale methods on x or y axis
$(document).ready(function() {
    $("#checkLog_y").click(function (){
        data_visualisation();
    })
    $("#checkValue_y").click(function (){
        data_visualisation();
    });
    $("#checkLog_x").click(function (){
        data_visualisation();
    });
    $("#checkValue_x").click(function (){
        data_visualisation();
    });
});