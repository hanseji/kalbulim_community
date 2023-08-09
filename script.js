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

  if (today_year - date_year > 0) {
    return String(today_year - date_year) + "년 전"
  } else if (today_month - date_month > 0) {
    return String(today_month - date_month) + "달 전"
  } else if (today_day - date_day > 7) {
    return String((today_day - date_day) / 7) + "주 전"
  } else if (today_day - date_day > 0) {
    return String(today_day - date_day) + "일 전"
  } else if (today_hour - date_hour > 0) {
    return String(today_hour - date_hour) + "시간 전"
  } else if (today_minute - date_minute > 0) {
    return String(today_minute - date_minute) + "분 전"
  } else {
    return String(today_second - date_second) + "초 전"
  }
}

function upload() {

  if (document.getElementById('report_box').checkVisibility() == true) {
    const chkInfoNodeList = document.querySelector('input[name="chk_info"]:checked').value
    const reportTypeNodeList = document.querySelector('input[name="report_type"]:checked').value

    let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (document.getElementById('location_input').value == "" || regex.test(document.getElementById('location_input').value) == true) {
      if (location_array[0] != null && location_array[1] != null) {
        db.collection('location')
          .add({
            check: false,
            danger_grade: chkInfoNodeList,
            location: location_array,
            source: document.getElementById('location_input').value,
            type: reportTypeNodeList,
            upload_time: new Date(),
            subcontent: document.getElementById('gitar_input').value
          });
        alert("제보 완료되었습니다.");
        removeMarker();
        document.getElementById('report_box').style.display = "none"
        document.getElementById('location_input').value = null;
      }
    } else {
      alert("출처는 웹주소로 적어주세요")
    }
  } else {
    document.getElementById('report_box').style.display = "block"
  }
}

function close_report_box(){
  document.getElementById('report_box').style.display = "none";
}

var locPosition = new kakao.maps.LatLng(37.4812845080678, 126.952713197762)

var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
  center: locPosition, //지도의 중심좌표.
  level: 10 //지도의 레벨(확대, 축소 정도)
};

function locationLoadSuccess(pos){
  // 현재 위치 받아오기
  var currentPos = new kakao.maps.LatLng(pos.coords.latitude,pos.coords.longitude);

  // 지도 이동(기존 위치와 가깝다면 부드럽게 이동)
  map.panTo(currentPos);
};

function locationLoadError(pos){
  //alert('위치 정보를 가져오는데 실패했습니다.');
};

// 위치 가져오기 버튼 클릭시
function getCurrentPosBtn(){
  navigator.geolocation.getCurrentPosition(locationLoadSuccess,locationLoadError);
};

getCurrentPosBtn();

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers_kalbulin = [];
var markers_typoon = [];
var markers_info_kalbulin = [];
var markers_info_typoon = [];
var result_markers = [];


var clusterer = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
  minLevel: 10 // 클러스터 할 최소 지도 레벨 
});

// 마커를 생성하고 지도위에 표시하는 함수입니다
function addKalbulimMarker(markerImage, position, content) {

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: position,
    image: markerImage // 마커이미지 설정 
  });

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.CustomOverlay({
    position: position,
    map: map,
    content: content
  });

  infowindow.setMap(null);

  /*
  kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
  kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
  */
  kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindow, "칼부림"));

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);

  //infowindow.open(map, marker);

  // 생성된 마커를 배열에 추가합니다
  markers_kalbulin.push(marker);
  markers_info_kalbulin.push(infowindow);
}

// 마커를 생성하고 지도위에 표시하는 함수입니다
function addTypoonMarker(markerImage, position, content) {

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: position,
    image: markerImage
  });

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.CustomOverlay({
    position: marker.getPosition() ,
    content: content
  });

  infowindow.setMap(null);

  //kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
  //kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
  kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindow, "태풍"));

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);

  //infowindow.open(map, marker);

  // 생성된 마커를 배열에 추가합니다
  markers_typoon.push(marker);
  markers_info_typoon.push(false);
}

// 마커를 생성하고 지도위에 표시하는 함수입니다
function addSearchMarker(position, idx, title) {
  var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage
    });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  result_markers.push(marker);  // 배열에 생성된 마커를 추가합니다

  return marker;
}

function makeClickListener(map, marker, infowindow, type) {
  return function() {
    if(type == "칼부림"){
      if(markers_info_kalbulin[markers_kalbulin.indexOf(marker)] == true) {
        infowindow.setMap(null);
        markers_info_kalbulin[markers_kalbulin.indexOf(marker)] = false;
      } else {
        infowindow.setMap(map);
        markers_info_kalbulin[markers_kalbulin.indexOf(marker)] = true;
      }
    }
    else if(type == "태풍"){
      if(markers_info_typoon[markers_typoon.indexOf(marker)] == true) {
        infowindow.setMap(null);
        markers_info_typoon[markers_typoon.indexOf(marker)] = false;
      } else {
        infowindow.setMap(map);
        markers_info_typoon[markers_typoon.indexOf(marker)] = true;
      }
    }
  }
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
  return function () {
    infowindow.open(map, marker);
  };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

function showKalbilimPoint() {
  db.collection('location') //원하는 컬렉션 선택하기, 지금은 product를 선택함
    //.orderBy('like', "desc") //정렬방식 최신자료 먼저 정렬 가능함
    //.limit(1) //가지고 오는 갯수를 제한 할 수 있다.
    .where("type", "==", "칼부림")
    .get() //이제까지 정보를 통해 자료를 가져오라는 의미
    .then((doc) => { // 결과를 then으로 받을 수 있다.
      doc.forEach((result) => {
        if (result.data().location != undefined) {
          var trust = "";
          if(result.data().check == true){
            var imageSrc = '/static/image/knife_True.png', // 마커이미지의 주소입니다    
                imageSize = new kakao.maps.Size(36, 50), // 마커이미지의 크기입니다
                imageOption = {offset: new kakao.maps.Point(16, 60)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                trust = '높음'
          } else {
            var imageSrc = '/static/image/knife_notTrue.png', // 마커이미지의 주소입니다    
                imageSize = new kakao.maps.Size(36, 50), // 마커이미지의 크기입니다
                imageOption = {offset: new kakao.maps.Point(16, 60)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                trust = '낮음'
          }
          var subcontent = result.data().subcontent
          if(result.data().subcontent == undefined) {subcontent = ""}
          var source = result.data().source
          if(result.data().source == undefined) {source = ""}
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
          var content = `<div id="info">
          <b>${result.data().type + " " + result.data().danger_grade}</b>
          ${calculate_date(result.data().upload_time.toDate())}<br>
          <a href=${source}>${source}</a><br>
          ${subcontent}<br>
          신뢰도 ${trust} 
          </div>`
          addKalbulimMarker(markerImage, new kakao.maps.LatLng(result.data().location[0], result.data().location[1]), content);
        }
      })
    });
  //clusterer.addMarkers(markers_kalbulin);
}

function showTypoonPoint() {
  db.collection('location') //원하는 컬렉션 선택하기, 지금은 product를 선택함
    //.orderBy('like', "desc") //정렬방식 최신자료 먼저 정렬 가능함
    //.limit(1) //가지고 오는 갯수를 제한 할 수 있다.
    .where("type", "==", "태풍")
    .get() //이제까지 정보를 통해 자료를 가져오라는 의미
    .then((doc) => { // 결과를 then으로 받을 수 있다.
      doc.forEach((result) => {
        if (result.data().location != undefined) {
          var trust = "";
          if(result.data().check == true){
            var imageSrc = '/static/image/typhoon_True.png', // 마커이미지의 주소입니다    
                imageSize = new kakao.maps.Size(36, 50), // 마커이미지의 크기입니다
                imageOption = {offset: new kakao.maps.Point(16, 60)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                trust = '높음'
          } else {
            var imageSrc = '/static/image/typhoon_notTrue.png', // 마커이미지의 주소입니다    
                imageSize = new kakao.maps.Size(36, 50), // 마커이미지의 크기입니다
                imageOption = {offset: new kakao.maps.Point(16, 60)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                trust = '낮음'
          }
          var subcontent = result.data().subcontent
          if(result.data().subcontent === "undefined" ) {subcontent = ""}
          var source = result.data().source
          if(result.data().source === "undefined" ) {source = ""}
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
          var content = `<div id="info">
          <b>${result.data().type + " " + result.data().danger_grade}</b>
          ${calculate_date(result.data().upload_time.toDate())}<br>
          <a href=${source}>${source}</a><br>
          ${subcontent}<br>
          신뢰도 ${trust} 
          </div>`
          addTypoonMarker(markerImage, new kakao.maps.LatLng(result.data().location[0], result.data().location[1]), content);
        }
      })
    });
  //clusterer.addMarkers(markers_typoon);
}


function showHighTrustTypoonPoint() {
  db.collection('location') //원하는 컬렉션 선택하기, 지금은 product를 선택함
    //.orderBy('like', "desc") //정렬방식 최신자료 먼저 정렬 가능함
    //.limit(1) //가지고 오는 갯수를 제한 할 수 있다.
    .where("check", "==", true)
    .where("type", "==", "태풍")
    .get() //이제까지 정보를 통해 자료를 가져오라는 의미
    .then((doc) => { // 결과를 then으로 받을 수 있다.
      doc.forEach((result) => {
        if (result.data().location != undefined) {
          var trust = "";
          var imageSrc = '/static/image/typhoon_True.png', // 마커이미지의 주소입니다    
              imageSize = new kakao.maps.Size(36, 50), // 마커이미지의 크기입니다
              imageOption = {offset: new kakao.maps.Point(16, 60)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
              trust = '높음'
          var subcontent = result.data().subcontent
          if(result.data().subcontent === "undefined" ) {subcontent = ""}
          var source = result.data().source
          if(result.data().source === "undefined" ) {source = ""}
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
          var content = `<div id="info">
          <b>${result.data().type + " " + result.data().danger_grade}</b>
          ${calculate_date(result.data().upload_time.toDate())}<br>
          <a href=${source}>${source}</a><br>
          ${subcontent}<br>
          신뢰도 ${trust} 
          </div>`
          addTypoonMarker(markerImage, new kakao.maps.LatLng(result.data().location[0], result.data().location[1]), content);
        }
      })
    });
  //clusterer.addMarkers(markers_typoon);
}

function showHighTrustKalbilimPoint() {
  console.log('갯수')
  db.collection('location') //원하는 컬렉션 선택하기, 지금은 product를 선택함
    //.orderBy('like', "desc") //정렬방식 최신자료 먼저 정렬 가능함
    //.limit(1) //가지고 오는 갯수를 제한 할 수 있다.
    .where("check", "==", true)
    .where("type", "==", "칼부림")
    .get() //이제까지 정보를 통해 자료를 가져오라는 의미
    .then((doc) => { // 결과를 then으로 받을 수 있다.
      doc.forEach((result) => {
        if (result.data().location != undefined) {
          var trust = "";
          var imageSrc = '/static/image/knife_True.png', // 마커이미지의 주소입니다    
              imageSize = new kakao.maps.Size(36, 50), // 마커이미지의 크기입니다
              imageOption = {offset: new kakao.maps.Point(16, 60)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
              trust = '높음'
          var subcontent = result.data().subcontent
          if(result.data().subcontent == undefined) {subcontent = ""}
          var source = result.data().source
          if(result.data().source == undefined) {source = ""}
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
          var content = `<div id="info">
          <b>${result.data().type + " " + result.data().danger_grade}</b>
          ${calculate_date(result.data().upload_time.toDate())}<br>
          <a href=${source}>${source}</a><br>
          ${subcontent}<br>
          신뢰도 ${trust} 
          </div>`
          addKalbulimMarker(markerImage, new kakao.maps.LatLng(result.data().location[0], result.data().location[1]), content);
        }
      })
    });
  //clusterer.addMarkers(markers_kalbulin);
}
var ps = new kakao.maps.services.Places();
// 키워드로 장소를 검색합니다
//searchPlaces();
// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {

  var keyword = document.getElementById('keyword').value;

  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요!');
    return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);
}


// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {

    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

    alert('검색 결과가 존재하지 않습니다.');
    return;

  } else if (status === kakao.maps.services.Status.ERROR) {

    alert('검색 결과 중 오류가 발생했습니다.');
    return;

  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {

  fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';
  removeMarker();

  // 마커를 생성하고 지도에 표시합니다
  var placePosition = new kakao.maps.LatLng(places[0].y, places[0].x)
  location_array[0] = places[0].y,
    location_array[1] = places[0].x,
    marker = addSearchMarker(placePosition, 0),
    result_markers.push(marker)

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
  // LatLngBounds 객체에 좌표를 추가합니다
  bounds.extend(placePosition);

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  if (removeMarker != undefined) {
    for (var i = 0; i < result_markers.length; i++) {
      result_markers[i].setMap(null);
    }
    result_markers = [];
  }
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeKalbilimPoint() {
  if (removeKalbilimPoint != undefined) {
    for (var i = 0; i < markers_kalbulin.length; i++) {
      markers_kalbulin[i].setMap(null);
    }
    markers_kalbulin = [];
    markers_info_kalbulin = [];
  }
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeTypoonPoint() {
  if (removeTypoonPoint != undefined) {
    for (var i = 0; i < markers_typoon.length; i++) {
      markers_typoon[i].setMap(null);
    }
    markers_typoon = [];
    markers_info_typoon = [];
  }
}

changeReportType()
function changeReportType(){
  const report_type = document.querySelector('input[name="report_type"]:checked').value;
  if(report_type == "칼부림") {
    document.getElementById('radio_1').value = "예고";
    document.getElementById('radio_2').value = "검거";
    document.getElementById('radio_3').value = "사건 종료";
    document.getElementById('radio_label_1').innerText = "예고";
    document.getElementById('radio_label_2').innerText = "검거";
    document.getElementById('radio_label_3').innerText = "사건 종료";
  }else if(report_type == "태풍") {
    document.getElementById('radio_1').value = "침수";
    document.getElementById('radio_2').value = "강풍";
    document.getElementById('radio_3').value = "구조물 붕괴";
    document.getElementById('radio_label_1').innerText = "침수";
    document.getElementById('radio_label_2').innerText = "강풍";
    document.getElementById('radio_label_3').innerText = "구조물 붕괴";
  }
}

showHighTrustKalbilimPoint()
showHighTrustTypoonPoint()
function getCheckboxValue() {

  // 선택된 목록 가져오기
  const query = 'input[name="filter_type"]:checked';
  const selectedEls = document.querySelectorAll(query);
  // 선택된 목록에서 value 찾기

  result = []
  selectedEls.forEach((el) => {
    result.push(el.value);
  });
  removeKalbilimPoint();
  removeTypoonPoint();
  
  if (result.indexOf("칼부림") == -1) {
    removeKalbilimPoint();
  } else {
    if (result.indexOf("높은 신뢰도") == -1) {
      showKalbilimPoint();
    } else {
      showHighTrustKalbilimPoint();
    }
  }

  if (result.indexOf("태풍") == -1) {
    removeTypoonPoint();
  } else {
    if (result.indexOf("높은 신뢰도") == -1) {
      showTypoonPoint();
    } else {
      showHighTrustTypoonPoint();
    }
  }
}