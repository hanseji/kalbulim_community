/*
*파이어 베이스 초기화
*/
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQ_frXREaRCufSdZPnjAESOqjCZLCONtc",
    authDomain: "secret-ea319.firebaseapp.com",
    projectId: "secret-ea319",
    storageBucket: "secret-ea319.appspot.com",
    messagingSenderId: "926671541890",
    appId: "1:926671541890:web:4f67359a4ae5a0aa19069b",
    measurementId: "G-G7ZB88KV0P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.getAnalytics(app);

let location_array = [0, 0];

const db = firebase.firestore();

map.on('click', function(f) { 
  document.getElementById('location').innerText = "위치 : " + f.latlng['lat'] + " " + f.latlng['lng'];
  location_array[0] = f.latlng['lat']
  location_array[1] = f.latlng['lng']
});

function calculate_date(date) {
  var today = new Date();

  var today_second = today.getSeconds();
  var today_minute = today.getMinutes();
  var today_hour = today.getHours();
  var today_year = today.getFullYear();
  var today_month = today.getMonth() + 1;
  var today_day = today.getDate();

  var date_second = date.getSeconds();
  var date_minute = date.getMinutes();
  var date_hour = date.getHours();
  var date_year = date.getFullYear();
  var date_month = date.getMonth() + 1;
  var date_day = date.getDate();

  if(today_year-date_year>0) {
      return String(today_year-date_year)+"년 전"
  } else if(today_month-date_month>0) {
      return String(today_month-date_month)+"달 전"
  } else if(today_day-date_day > 7) {
      return String((today_day-date_day)/7)+"주 전"
  } else if(today_day-date_day > 0) {
      return String(today_day-date_day)+"일 전"
  } else if(today_hour-date_hour>0) {
      return String(today_hour-date_hour)+"시간 전"
  } else if(today_minute-date_minute>0) {
      return String(today_minute-date_minute)+"분 전"
  } else {
      return String(today_second-date_second)+"초 전"
  }
}

db.collection('location') //원하는 컬렉션 선택하기, 지금은 product를 선택함
  //.orderBy('like', "desc") //정렬방식 최신자료 먼저 정렬 가능함
  //.limit(1) //가지고 오는 갯수를 제한 할 수 있다.
  .get() //이제까지 정보를 통해 자료를 가져오라는 의미
  .then((doc) => { // 결과를 then으로 받을 수 있다.
    doc.forEach((result)=>{
      if (result.data().check == true){
        var marker = L.marker(result.data().location, {
          icon: L.mapquest.icons.incident({
            shadow: true,
            size: 'md'
          })
        }).addTo(map);
        marker.bindPopup(`<b>${result.data().type + " " + result.data().danger_grade}</b><br>
        <a herf=${result.data().source}>${result.data().source}</a><br>
        신뢰도 높음<br>
        ${calculate_date(result.data().upload_time.toDate())}`).openPopup();
      } else {
        var marker = L.marker(result.data().location, {
          icon: L.mapquest.icons.flag({
            primaryColor: '#22407F',
            secondaryColor: '#3B5998',
            shadow: true,
            size: 'md'
          })
        }).addTo(map);
        marker.bindPopup(`<b>${result.data().type + " " + result.data().danger_grade}</b><br>
        <a herf=${result.data().source}>${result.data().source}</a><br>
        신뢰도 낮음<br>
        ${calculate_date(result.data().upload_time.toDate())}`).openPopup();
      }
    })
  });
 
function upload() {
  const genderNodeList = document.getElementsByName('chk_info');

  let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if(regex.test(document.getElementById('location_input').value) == true){
  genderNodeList.forEach((node) => {
    if(node.checked)  {
      if (location_array[0] != null && location_array[1] != null){
        db.collection('location')
        .add({
            check : false,
            danger_grade : "예고",
            location : location_array,
            source : document.getElementById('location_input').value,
            type : "칼부림",
            upload_time : new Date(),
            danger_grade : node.value
        });
        alert("제보 완료되었습니다.")
        document.getElementById('location_input').value = null;
      }
    }
  }) 
  } else {
    alert("출처는 웹주소로 적어주세요")
  }
}

var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
	level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴