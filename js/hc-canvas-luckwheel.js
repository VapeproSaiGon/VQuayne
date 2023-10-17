(function() {
  var $,
    ele,
    container,
    canvas,
    num,
    prizes,
    btn,
    deg = 0,
    fnGetPrize,
    fnGotBack,
    optsPrize;

  var cssPrefix,
    eventPrefix,
    vendors = {
      "": "",
      Webkit: "webkit",
      Moz: "",
      O: "o",
      ms: "ms"
    },
    testEle = document.createElement("p"),
    cssSupport = {};

  Object.keys(vendors).some(function(vendor) {
    if (
      testEle.style[vendor + (vendor ? "T" : "t") + "ransitionProperty"] !==
      undefined
    ) {
      cssPrefix = vendor ? "-" + vendor.toLowerCase() + "-" : "";
      eventPrefix = vendors[vendor];
      return true;
    }
  });

  /**
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  function normalizeEvent(name) {
    return eventPrefix ? eventPrefix + name : name.toLowerCase();
  }

  /**
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  function normalizeCss(name) {
    name = name.toLowerCase();
    return cssPrefix ? cssPrefix + name : name;
  }

  cssSupport = {
    cssPrefix: cssPrefix,
    transform: normalizeCss("Transform"),
    transitionEnd: normalizeEvent("TransitionEnd")
  };

  var transform = cssSupport.transform;
  var transitionEnd = cssSupport.transitionEnd;

  // alert(transform);
  // alert(transitionEnd);

  function init(opts) {
    fnGetPrize = opts.getPrize;
    fnGotBack = opts.gotBack;
    opts.config(function(data) {
      prizes = opts.prizes = data;
      num = prizes.length;
      draw(opts);
    });
    events();
  }

  /**
   * @param  {String} id
   * @return {Object} HTML element
   */
  $ = function(id) {
    return document.getElementById(id);
  };

  function draw(opts) {
    opts = opts || {};
    if (!opts.id || num >>> 0 === 0) return;

    var id = opts.id,
      rotateDeg = 360 / num / 2 + 90,
      ctx,
      prizeItems = document.createElement("ul"),
      turnNum = 1 / num,
      html = [];

    ele = $(id);
    canvas = ele.querySelector(".hc-luckywheel-canvas");
    container = ele.querySelector(".hc-luckywheel-container");
    btn = ele.querySelector(".hc-luckywheel-btn");

    if (!canvas.getContext) {
      showMsg("Browser is not support");
      return;
    }

    ctx = canvas.getContext("2d");

    for (var i = 0; i < num; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(250, 250); // Center Point
      ctx.moveTo(0, 0);
      ctx.rotate((((360 / num) * i - rotateDeg) * Math.PI) / 180);
      ctx.arc(0, 0, 220, 0, (2 * Math.PI) / num, false); // Radius
      if (i % 2 == 0) {
        ctx.fillStyle = "#ffb820";
      } else {
        ctx.fillStyle = "#ffcb3f";
      }
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#e4370e";
      ctx.stroke();
      ctx.restore();
      var prizeList = opts.prizes;
      html.push('<li class="hc-luckywheel-item"> <span style="');
      html.push(transform + ": rotate(" + i * turnNum + 'turn)">');
      if (opts.mode == "both") {
       
        html.push('<img src="' + prizeList[i].img + '" />');
      } else if (prizeList[i].img) {
        html.push('<img src="' + prizeList[i].img + '" />');
      } 
      html.push("</span> </li>");
      if (i + 1 === num) {
        prizeItems.className = "hc-luckywheel-list";
        container.appendChild(prizeItems);
        prizeItems.innerHTML = html.join("");
      }
    }
  }

  /**
   * @param  {String} msg [description]
   */
  function showMsg(msg) {
    alert(msg);
  }

  /**
   * @param  {[type]} deg [description]
   * @return {[type]}     [description]
   */
  function runRotate(deg) {
    // runInit();
    // setTimeout(function() {
    container.style[transform] = "rotate(" + deg + "deg)";
    // }, 10);
  }

  /**
   * @return {[type]} [description]
   */
  let audio= null;
  function events() {
    bind(btn, "click", function() {
      if (audio){
        audio.pause();
        audio.currentTime=0;

      }
      else{
        audio= new Audio("nhac.mp3")
        audio.play();
        audio= null;
      }
      addClass(btn, "disabled");

      fnGetPrize(function(data) {
        if (data[0] == null && !data[1] == null) {
          return;
        }
        optsPrize = {
          prizeId: data[0],
          chances: data[1]
        };
        deg = deg || 0;
        deg = deg + (360 - (deg % 360)) + (360 * 10 - data[0] * (360 / num));
        runRotate(deg);
      });
      bind(container, transitionEnd, eGot);
    });
  }

  function eGot() {
    if (optsPrize.chances == null) {
      return fnGotBack(null);
    } else {
      removeClass(btn, "disabled");
      return fnGotBack(prizes[optsPrize.prizeId].text);
    }
  }

  /**
   * Bind events to elements
   * @param {Object}    ele    HTML Object
   * @param {Event}     event  Event to detach
   * @param {Function}  fn     Callback function
   */
  function bind(ele, event, fn) {
    if (typeof addEventListener === "function") {
      ele.addEventListener(event, fn, false);
    } else if (ele.attachEvent) {
      ele.attachEvent("on" + event, fn);
    }
  }

  /**
   * hasClass
   * @param {Object} ele   HTML Object
   * @param {String} cls   className
   * @return {Boolean}
   */
  function hasClass(ele, cls) {
    if (!ele || !cls) return false;
    if (ele.classList) {
      return ele.classList.contains(cls);
    } else {
      return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    }
  }

  // addClass
  function addClass(ele, cls) {
    if (ele.classList) {
      ele.classList.add(cls);
    } else {
      if (!hasClass(ele, cls)) ele.className += "" + cls;
    }
  }

  // removeClass
  function removeClass(ele, cls) {
    if (ele.classList) {
      ele.classList.remove(cls);
    } else {
      ele.className = ele.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
    }
  }

  var hcLuckywheel = {
    init: function(opts) {
      return init(opts);
    }
  };

  window.hcLuckywheel === undefined && (window.hcLuckywheel = hcLuckywheel);

  if (typeof define == "function" && define.amd) {
    define("HellCat-Luckywheel", [], function() {
      return hcLuckywheel;
    });
  }
})();



var diachi = document.querySelector('.diachi');
if (window.innerWidth < 700) {

diachi.classList.remove('hide-button');
}
const container = document.getElementById('container');

var checkButton = document.querySelector('.checkbtn');
checkButton.addEventListener('click', function() {
var phoneNumber = document.querySelector('input[name="SDT"]').value; // Lấy giá trị số điện thoại từ trường nhập liệu
var   phoneNumberr=phoneNumber-0
var lsdValues = []
var dqValues = []
fetch('https://sheetdb.io/api/v1/iqad2ee3ao21y', {
method: 'GET',
})
.then(response => response.json())
.then(data => {
var found = false;
var phoneNumberrIndex = -1
for (var i = 0; i < data.length; i++) {
var rowData = data[i];
var email = rowData['SDT']; // Trường email từ SheetDB
var lsd = rowData['LSD'];
var dq=rowData['DQ'];

if (email == phoneNumberr) {
lsdValues.push(lsd); // Thêm giá trị lsd vào mảng lsdValues
dqValues.push(dq); 


}
}
console.log(lsdValues)
for (var i = 0; i < data.length; i++) {
var rowData = data[i];
var email = rowData['SDT']; // Trường email từ SheetDB


if ( email == phoneNumberr) {
phoneNumberrIndex=i+
console.log(phoneNumberrIndex)
found = true;
psw = rowData['Ưu đãi áp dụng']; // Lấy giá trị của trường psw khi số điện thoại đúng
break;
}
} 

if (found) {
var hasValueLessThanOne = false;
var daquay = false;

for (var i = 0; i < lsdValues.length; i++) {
if (lsdValues[i] < 1) {
hasValueLessThanOne = true;
break;
}
}


if (hasValueLessThanOne) {
if ( phoneNumber>0){  alert("Bạn đã quay thưởng rồi, hẹn gặp bạn ở vòng quay sau nhaa. ");}
else {alert(" Nhớ nhập SDT nhaa. VapePro cảm ơn sử ủng hộ của bạn thời gian qua!! ");}

} else {



alert("VapePro trân trọng cảm ơn sự ủng hộ của bạn thời gian qua. Bạn có 2 lượt quay quà siêu khủng nhaa");}



} else{
alert("SDT chưa mua hàng ở VapePro. Vapepro rất vui nếu được hỗ trợ bạn nhaa.");
}
})
.catch(error => {
console.error(error); // In lỗi nếu có
});
var pushvoucherr = document.querySelector('.pushvoucher');
var diachi = document.querySelector('.diachi');

pushvoucherr.classList.add('hide-button');
diachi.classList.remove('hide-button');


});
const scriptURL = 'https://script.google.com/macros/s/AKfycbzw-4sQZcSUrIFynugYPLY5oxy6MsVo0iI66M1LDzQ2hSoLLF80HpTqCd29VoHx5I9Kmw/exec'
var isPercentage = true;
var prizes = [
{
  text: "Áo thun J2Team",
  img: "images/3.png",
  number: 1, // 1%,
  percentpage: 0.0 // 1%
},
{
  text: "Nón J2 Team",
  img: "images/1.png",
  number: 1,
  percentpage: 0.0 // 5%
},
{
  text: "Vòng Tay J2Team",
  img: "images/2.png",
  number : 1,
  percentpage: 0.0// 10%
},
{
  text: "J2Team Security",
  img: "images/4.png",
  number: 1,
  percentpage: 0 // 24%
},
{
  text: "Chúc bạn may mắn lần sau !",
  img: "images/miss.png",
  percentpage:1// 60%
},
];
function updatePrizes() {
// Thay đổi giá trị của biến prizes
prizes = [
{
text: "Áo thun J2Team",
img: "images/3.png",
number: 1, // 1%,
percentpage: 0.0 // 1%
},
{
text: "Nón J2 Team",
img: "images/1.png",
number: 1,
percentpage: 0.0 // 5%
},
{
text: "Vòng Tay J2Team",
img: "images/2.png",
number : 1,
percentpage: 0.0// 10%
},
{
text: "J2Team Security",
img: "images/4.png",
number: 1,
percentpage: 1 // 24%
},
{
text: "Chúc bạn may mắn lần sau !",
img: "images/miss.png",
percentpage: 0 // 60%
},
];

// Thực hiện các hành động khác sau khi thay đổi giá trị của biến prizes
}
document.addEventListener(
"DOMContentLoaded",
function() {

hcLuckywheel.init({
id: "luckywheel",
config: function(callback) {
callback &&
  callback(prizes);
},
mode : "both",
getPrize: function(callback) {
var rand = randomIndex(prizes);
var chances = rand;
callback && callback([rand, chances]);
},
gotBack: function(data) {

if(data == null){


 
} else if (data == 'Chúc bạn may mắn lần sau !'){
  Swal.fire({
title: 'Chưa trúng quà mất rồi, bạn còn 1 lượt quay nha.',
text: data,
icon: 'error',
showCancelButton: false,
confirmButtonColor: '#3085d6',
confirmButtonText: 'OK',
customClass: {
popup: 'custom-swal-popup',
title: 'custom-swal-title',
text: 'custom-swal-text',
confirmButton: 'custom-swal-confirm-button'
}
});
  updatePrizes();
  var phoneNumber = document.querySelector('input[name="SDT"]').value;
var formData = new FormData();
var currentTime = new Date().toLocaleString();
formData.append('SDT',phoneNumber);
  formData.append('TT', "CHUA TRUNG");

  formData.append('Time', currentTime);
  // Gửi POST request đến URL script với dữ liệu đã được đóng gói
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(function(response) {
    console.log('Gửi thành công!', response);
    // Xử lý phản hồi từ server nếu cần
    })
    .catch(function(error) {
    console.error('Lỗi:', error);
    // Xử lý lỗi nếu cần
    });

} else{

      var clickHereButton = document.querySelector('.clearfixx');
clickHereButton.classList.remove('hide-button');
document.querySelector('.Click-here').addEventListener('click', function() {
document.querySelector('.custom-model-main').classList.add('model-open');
setTimeout(function() {
document.querySelector('.custom-model-mainn').classList.add('model-openn');
}, 1000); // Delay 500 milliseconds before adding 'model-openn' class
});

document.querySelector('.close-btn').addEventListener('click', function() {
document.querySelector('.custom-model-main').classList.remove('model-open');

});

document.querySelector('.bg-overlay').addEventListener('click', function() {
document.querySelector('.custom-model-main').classList.remove('model-open');

});
document.querySelector('.close-btnn').addEventListener('click', function() {

document.querySelector('.custom-model-mainn').classList.remove('model-openn');
});

document.querySelector('.bg-overlayy').addEventListener('click', function() {

document.querySelector('.custom-model-mainn').classList.remove('model-openn');
});
var popUpContentWrap = document.querySelector('.pop-up-content-wrap');

var dataContent = psw;
console.log(dataContent);
popUpContentWrap.textContent = dataContent;
var phoneNumber = document.querySelector('input[name="SDT"]').value;
var currentTime = new Date().toLocaleString();
var formData = new FormData();
formData.append('SDT',phoneNumber);
  formData.append('TT', "DA TRUNG");
  formData.append('DQ',"1");
  formData.append('Time', currentTime);
  // Gửi POST request đến URL script với dữ liệu đã được đóng gói
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(function(response) {
    console.log('Gửi thành công!', response);
    // Xử lý phản hồi từ server nếu cần
    })
    .catch(function(error) {
    console.error('Lỗi:', error);
    // Xử lý lỗi nếu cần
    });
}
}
});
},
false
);
function randomIndex(prizes){
if(isPercentage){
var counter = 1;
for (let i = 0; i < prizes.length; i++) {
if(prizes[i].number == 0){
counter++
}
}
if(counter == prizes.length){
return null
}
let rand = Math.random();
let prizeIndex = null;
console.log(rand);
switch (true) {
case rand < prizes[4].percentpage:
prizeIndex = 4 ;
break;
case rand < prizes[4].percentpage + prizes[3].percentpage:
prizeIndex = 3;
break;
case rand < prizes[4].percentpage + prizes[3].percentpage + prizes[2].percentpage:
prizeIndex = 2;
break;
case rand < prizes[4].percentpage + prizes[3].percentpage + prizes[2].percentpage + prizes[1].percentpage:
prizeIndex = 1;
break;  
case rand < prizes[4].percentpage + prizes[3].percentpage + prizes[2].percentpage + prizes[1].percentpage  + prizes[0].percentpage:
prizeIndex = 0;
break;  
}
if(prizes[prizeIndex].number != 0){
prizes[prizeIndex].number = prizes[prizeIndex].number - 1
return prizeIndex
}else{
return randomIndex(prizes)
}
}else{
var counter = 0;
for (let i = 0; i < prizes.length; i++) {
if(prizes[i].number == 0){
counter++
}
}
if(counter == prizes.length){
return null
}
var rand = (Math.random() * (prizes.length)) >>> 0;
if(prizes[rand].number != 0){
prizes[rand].number = prizes[rand].number - 1
return rand
}else{
return randomIndex(prizes)
}
}
}
