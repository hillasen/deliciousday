const mealTeble = document.getElementById("mealTable");
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const deliciousKeywords = ["치킨", "불고기", "부대찌개", "라면", "차슈덮밥", "아이스크림", "찜닭", "오리", "돈까스", "닭갈비"]

function merkDelecious(mealData){
    const slicedMealData = mealData.split("<br/>");
    let finalHTML = "<br\>";
    for(let i=0;i<slicedMealData.length;i++){
        let finded = false;
        for(let j=0;j<deliciousKeywords.length;j++){
            if(slicedMealData[i].includes(deliciousKeywords[j])){
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
    finalHTML = finalHTML
    console.log(finalHTML)
    return finalHTML;
}

function addMealTable(getedMeal){
    console.log(getedMeal);
    for(let i=0;i<getedMeal.length;i++){
        const mealDay = document.getElementById(getedMeal[i].MLSV_YMD);
        console.log(mealDay)
        mealDay.innerHTML = mealDay.innerHTML +  merkDelecious(getedMeal[i].DDISH_NM)
    }
}

async function getBapJson() {
    const response = await fetch("https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=M10&SD_SCHUL_CODE=8000075&KEY=7fbb26b3d29e40fca41338298752bb1f&Type=json&MLSV_FROM_YMD=20230901&MLSV_TO_YMD=20230931");
    const jsonData = await response.json();
    let getedMeal = jsonData.mealServiceDietInfo[1].row;
    console.log(jsonData.mealServiceDietInfo)
    addMealTable(getedMeal);
}

function generateCalendar() {
    const year = "2023";
    const month = "9";

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    console.log(daysInMonth)
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';

    // 요일 헤더 추가
    for (const dayName of WEEKDAYS) {
        const dayHeaderDiv = document.createElement('div');
        dayHeaderDiv.className = 'day day-header';
        dayHeaderDiv.innerText = dayName;
        calendarDiv.appendChild(dayHeaderDiv);
    }

    // 이전 달의 마지막 일자를 위한 공간 추가
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day';
        calendarDiv.appendChild(emptyDiv);
    }

    // 해당 월의 날짜 출력
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.id = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
        dayDiv.innerText = day;
        calendarDiv.appendChild(dayDiv);
    }
}

generateCalendar();
getBapJson();