const mealTeble = document.getElementById("mealTable");

const deliciousKeywords = ["주꾸미","마라탕","감자탕","바베큐","국밥","대하", "칼국수","쌀국수", "설렁탕", "멘보샤","족발", "갈비탕","커리","삼계탕","탕수육","핫도그", "피자", "닭봉", "닭다리", "스테이크", "우동", "파스타", "치킨", "불고기", "부대찌개", "라면", "차슈덮밥", "아이스크림", "찜닭", "오리", "돈까스", "닭갈비", "닭죽", "떡볶이", "자장", "삼겹살"]

let schoolCode = ""
let officeCode = ""
let schoolName = ""

let deleciousCount = new Array(32).fill(0);
let allMenuCount = new Array(32).fill(-1);
let deleciousKeywordsCount = {};
let average = 0;
let variance = 0;
let score = 0;
let standardDevation = 0;
const today = new Date();
//today.setMonth(8);

function getScore(){
    return Math.round((average**1.5) * (1-(Math.log(standardDevation+0.5)/Math.log(10))) * 100)/100;
}

function setScoreText(){
    document.getElementById("scoreText").innerHTML = String(score) + "점";
}

function getAverage(){
    let sum = 0;
    let length = 0;
    for (var i = 0; i < deleciousCount.length; i++) {
        if(allMenuCount[i] == -1){
            continue;
        }
       sum += deleciousCount[i];
       length += 1;
    }
    return Math.round(sum/length*100)/100;
}

function getVariance(){
    let sum = 0;
    let length = 0;
    for (var i = 0; i < deleciousCount.length; i++) {
        if(allMenuCount[i] == -1){
            continue;
        }
       sum += deleciousCount[i] ** 2;
       length += 1;
    }
    return Math.round(((Math.round(sum/length*100)/100) - average**2)*100)/100;
}

function chartDrawer(){
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var chartData = new google.visualization.DataTable();
        chartData.addColumn('string', '일자');
        chartData.addColumn('number', '맛있는 메뉴 수');
        for (var i = 0; i < deleciousCount.length; i++) {
            if(allMenuCount[i] == -1){
                continue;
            }
            chartData.addRow([`${String(today.getFullYear())}/${String(today.getMonth() + 1)}/${String(i)}`, deleciousCount[i]]);
        }
        var options = {
            title: '맛있는 메뉴 수, 평균: ' + String(average) + ", 표준편차: " + String(standardDevation),
            bars: 'vertical',
            vAxis: {
                format: 'decimal'
            }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(chartData, options);
    }
}

function smallDataAlert(dataLength){
    if(dataLength < 10){
        alert("급식 데이터가 충분하지 않아요, 다음을 확인해 보세요!\n\n1. 식단표가 NEIS에 등록되지 않았어요!\n2. 아직 급식표가 나오지 않았어요!\n3. 특수한 고등학교(ex.한국과학영재학교)는 조회가 불가능해요!\n\n충분하지 않은 급식 데이터는 점수, 메뉴에 오류를 발생시킬 수 있어요!")
    }
}

function keywordChartDrawer(){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var chartData = new google.visualization.DataTable();
        chartData.addColumn('string', '키워드 종류');
        chartData.addColumn('number', '키워드 수');
        for (const [key, value] of Object.entries(deleciousKeywordsCount)) {
            chartData.addRow([key, value]);
        }

        var options = {
            title: '맛있는 키워드'
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_pie_div'));
        chart.draw(chartData, options);
    }


}

function addCount(dateString, keyword){
    if(deleciousCount[dateString] != -1){
        deleciousCount[dateString] = deleciousCount[dateString] + 1;
    }
    else{
        deleciousCount[dateString] = 1;
    }

    if(Object.keys(deleciousKeywordsCount).includes(keyword)){
        deleciousKeywordsCount[keyword] += 1;
    }
    else{
        deleciousKeywordsCount[keyword] = 1;
    }
}

function addAllMenuCount(dateString){
    if(allMenuCount[dateString] != -1){
        allMenuCount[dateString] = allMenuCount[dateString] + 1;
    }
    else{
        allMenuCount[dateString] = 1;
    }
}


function searchStartFormatter(){
    if(today.getMonth()+1 < 10){
        return String(today.getFullYear()) + "0"+String(today.getMonth()+1) + "01";
    }
    return String(today.getFullYear()) +String(today.getMonth()+1) + "01";
}

function searchEndFormatter(){
    console.log(today.getMonth())
    if(today.getMonth()+1 < 10){
        return String(today.getFullYear()) + "0"+String(today.getMonth()+1 + "31");
    }
    return String(today.getFullYear()) +String(today.getMonth()+1) + "31";
}

function merkDelecious(mealData, mealDay, mealName){
    const slicedMealData = mealData.split("<br/>");
    let finalHTML = '<p style="float:left; margin-right:20px;">' + mealName + "<br/>";
    for(let i=0;i<slicedMealData.length;i++){
        addAllMenuCount(mealDay);
        let finded = false;
        for(let j=0;j<deliciousKeywords.length;j++){
            if(slicedMealData[i].includes(deliciousKeywords[j])){
                addCount(mealDay, deliciousKeywords[j]);
                finded = true;
                break;
            }
        }
        if(finded){
            //finalHTML = finalHTML + slicedMealData[i] + "<br>";
            finalHTML = finalHTML + "<mark>" + slicedMealData[i] + "</mark><br/>";
            
        }
        else{
            finalHTML = finalHTML + slicedMealData[i] + "<br>";
        }
    }
    finalHTML = finalHTML + "</p>"
    console.log(finalHTML)
    return finalHTML;
}

async function getParam(){
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    schoolCode = urlParams.get('school');
    officeCode = urlParams.get('office');
    today.setMonth(Number(urlParams.get('month'))-1)
    today.setYear(Number(urlParams.get('year')))
    document.getElementById("schoolNameText").innerHTML = urlParams.get('name');
    document.getElementById("searchPeriod").innerHTML = today.getFullYear() + "년 " + String(today.getMonth() + 1) + "월 급식"
    console.log(schoolCode)
}

function addMealTable(getedMeal){
    console.log(getedMeal);
    smallDataAlert(getedMeal.length);
    for(let i=0;i<getedMeal.length;i++){
        const mealDay = document.getElementById(String(Number(getedMeal[i].MLSV_YMD.slice(6, 8)))).children[1];
        if(allMenuCount[Number(getedMeal[i].MLSV_YMD.slice(6, 8))] == -1){
            mealDay.innerHTML = ""
        }
        console.log(mealDay)
        mealDay.innerHTML = mealDay.innerHTML +  merkDelecious(getedMeal[i].DDISH_NM, String(Number(getedMeal[i].MLSV_YMD.slice(6, 8))), getedMeal[i].MMEAL_SC_NM)
    }
    console.log(deleciousCount)
    average = getAverage();
    variance = getVariance();
    standardDevation = Math.round((variance ** (0.5)) * 100) / 100;
    score = getScore();
    setScoreText();
    chartDrawer();
    keywordChartDrawer()
}

async function getBapJson() {
    await getParam();
    const response = await fetch("https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=" + officeCode + "&SD_SCHUL_CODE=" + schoolCode + "&KEY=7fbb26b3d29e40fca41338298752bb1f&Type=json&MLSV_FROM_YMD="+searchStartFormatter() + "&MLSV_TO_YMD=" + searchEndFormatter());
    console.log(searchEndFormatter());
    const jsonData = await response.json();
    try{
    let getedMeal = jsonData.mealServiceDietInfo[1].row;
    console.log(jsonData.mealServiceDietInfo)
    addMealTable(getedMeal);
    }
    catch(error){
        smallDataAlert(0);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const originalDiv = container.querySelector('.datedata');

    // Remove existing datedata divs
    container.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
        // Clone the original div and update its ID and date
        const clonedDiv = originalDiv.cloneNode(true);
        clonedDiv.id = i;
        clonedDiv.querySelector('.date').textContent = `${String(today.getFullYear())}/${String(today.getMonth() + 1)}/${String(i).padStart(2, '0')}`;
        clonedDiv.querySelector('.menu').textContent = "급식이 제공되지 않아요!"
        // Append to the container
        container.appendChild(clonedDiv);
    }
});


getBapJson();