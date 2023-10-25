const FIND_SCHOOL_API_URL = "https://open.neis.go.kr/hub/schoolInfo?Type=json&KEY=7fbb26b3d29e40fca41338298752bb1f&SCHUL_NM=";
const schoolNameInput = document.getElementById("schoolName");
let today = new Date();
document.getElementById("monthInput").value = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");

async function getSchoolJson() {
    if(schoolNameInput.value == ""){
        alert("학교 이름을 입력해주세요!")
    }
    else{
    try{
    const response = await fetch(FIND_SCHOOL_API_URL + schoolNameInput.value);
    const jsonData = await response.json();
    console.log(jsonData.schoolInfo[1].row[0])
    const schoolData =  jsonData.schoolInfo[1].row[0];
    const searchPeriod = document.getElementById("monthInput").value;
    const searchYear = searchPeriod.slice(0, 4);
    const searchMonth = searchPeriod.slice(5, 7);
    window.location.href="menu.html?school=" + schoolData.SD_SCHUL_CODE + "&office=" + schoolData.ATPT_OFCDC_SC_CODE + "&name=" + schoolData.SCHUL_NM + "&month=" + searchMonth + "&year=" + searchYear;
    }
    catch(error){
        alert("존재하지 않는 학교입니다!")
    }
}
}

document.getElementById("schoolName").addEventListener('keyup', (e)=>{
    if (e.keyCode === 13) {
        getSchoolJson();
  }  
});
