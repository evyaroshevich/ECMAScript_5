var chk_n_score=chk_current_score = chk_min_refill = chk_max_refill = chk_min_balance = chk_date_score = false;
var g_id;
var score = [];
var create;
<<<<<<< HEAD
=======

>>>>>>> +deployd. release
function isCreate(bool){
	create = bool;
}

<<<<<<< HEAD
=======
function upload(){
	var xhr = new XMLHttpRequest();
	var upl = [];
	for (let i=0; i<Score.getCount(); i++){
		upl[i] = {
		number:score[i].getNumber(),
		type:score[i].getType(),
		podtip:score[i].getType()=="Расчетный"?score[i].getPodtip():"",
		status:score[i].getStatus(),
		current:score[i].getCurrent(),
		minbalance:score[i].getType()=="Расчетный"?score[i].getMinbalance():"",
		minrefill:score[i].getType()=="Накопительный"?score[i].getMinrefill():"",
		maxrefill:score[i].getType()=="Накопительный"?score[i].getMaxrefill():"",
		term:score[i].getTerm(),
		percent:score[i].getPercent(),
		date:score[i].getDate()
		};
	xhr.open('POST', '/homework3', false);
	xhr.setRequestHeader("Content-type","application/json");
	xhr.send(JSON.stringify(upl[i]));
	}
}

function download(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/homework3', false);
	xhr.send();
	if (xhr.status != 200) {
	  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
	} else {
	  console.log( xhr.responseText ); // responseText -- текст ответа.
	}
	var parse = JSON.parse(xhr.responseText, function(key, value){
		if (key == 'date') {
			var date = new Date(value);
			var m = date.getMonth() + 1;
			var d = date.getDate();
			var mm = (m>9?'':'0') + m;
			var dd = (d>9?'':'0') + d;
			value = date.getFullYear() + '-' + mm + '-' + dd;
		}
		return value;
	});
	for (let i=0; i<parse.length;i++){
		createTableFromDB(parse[i]);
		if (parse[i].type == "Расчетный"){
			score.push(new RSScore(parse[i].number, parse[i].type, parse[i].podtip, parse[i].status, parse[i].current, parse[i].minbalance, parse[i].term, parse[i].percent, parse[i].date));
		} else {
			score.push(new NScore(parse[i].number, parse[i].type, parse[i].status, parse[i].current, parse[i].minrefill, parse[i].maxrefill, parse[i].term, parse[i].percent, parse[i].date));
		}
		Score.counter++;
	}
}

>>>>>>> +deployd. release
function Score (number, type, status, current, term, percent, date){
	var _number = number;
	var _type = type;
	var _status = status;
	var _current = current;
	var _term = term;
	var _percent = percent;
	var _date = date;
	this.getNumber = function(){
		return _number;
	}
	this.setNumber = function(number){
		_number = number;
	}
	this.getType = function(){
		return _type;
	}
	this.setType = function(type){
		_type = type;
	}
	this.getStatus = function(){
		return _status;
	}
	this.setStatus = function(status){
		_status = status;
	}
	this.getCurrent = function(){
		return _current;
	}
	this.setCurrent = function(current){
		_current = current;
	}
	this.getTerm = function(){
		return _term;
	}
	this.setTerm = function(term){
		_term = term;
	}
	this.getPercent = function(){
		return _percent;
	}
	this.setPercent = function(percent){
		_percent = percent;
	}
	this.getDate = function(){
		return _date;
	}
	this.setDate = function(date){
		_date = date;
	}
}

Score.counter = 0;
Score.getCount = function(){
	return Score.counter;
}

function RSScore (number, type, podtip, status, current, minbalance, term, percent, date){
	Score.call(this);
	var _podtip = podtip;
	var _minbalance = minbalance;
	this.getPodtip = function(){
		return _podtip;
	}
	this.setPodtip = function(podtip){
		_podtip = podtip;
	}
	this.getMinbalance = function(){
		return _minbalance;
	}
	this.setMinbalance = function(minbalance){
		_minbalance = minbalance;
	}
	this.setNumber(number);
	this.setType(type);
	this.setStatus(status);
	this.setCurrent(current);
	this.setTerm(term);
	this.setPercent(percent);
	this.setDate(date);
}

function NScore (number, type, status, current, minrefill, maxrefill, term, percent, date){
	Score.call(this);
	var _minrefill = minrefill;
	var _maxrefill = maxrefill;
	this.getMinrefill = function(){
		return _minrefill;
	}
	this.setMinrefill = function(minrefill){
		_minrefill = minrefill;
	}
	this.getMaxrefill = function(){
		return _maxrefill;
	}
	this.setMaxrefill = function(maxrefill){
		_maxrefill = maxrefill;
	}
	this.setNumber(number);
	this.setType(type);
	this.setStatus(status);
	this.setCurrent(current);
	this.setTerm(term);
	this.setPercent(percent);
	this.setDate(date);
}

function selectT() {
	var selected = $('#t_score option:selected').val();
	var parentPodTip = document.getElementById("pt_score").parentNode.classList;
	var parentMinBalance = document.getElementById("min_balance").parentNode.classList;
	var parentMinRefill = document.getElementById("min_refill").parentNode.classList;
	var parentMaxRefill = document.getElementById("max_refill").parentNode.classList;
	if(selected==="Накопительный"){
		parentPodTip.add("hidden");
		parentMinBalance.add("hidden");
		parentMinRefill.remove("hidden");
		parentMaxRefill.remove("hidden");
	} else {
		parentPodTip.remove("hidden");
		parentMinBalance.remove("hidden");
		parentMinRefill.add("hidden");
		parentMaxRefill.add("hidden");
	}
	validData('n_score');
}

function computeTerm(){
	var selected = $('#term_score option:selected').val();
	switch(selected){
		case '3 месяца':
			$('#percent').val("1,5%");
			break;
		case '6 месяцев':
			$('#percent').val("2,5%");
			break;
		case '1 год':
			$('#percent').val("3,5%");
			break;
		case '3 года':
			$('#percent').val("5,5%");
			break;
	}
}

function validData(id){ 
	var obj = document.getElementById(id);
	var value = obj.value;
	var parent = obj.parentNode;
	var chk = false;
	var reg;
	switch(id){
		case 'n_score':
			reg = /^[1-9]\d{5}$/;
			chk_n_score=chk;
			break;
		case 'current_score':
			reg = /^[0-9]+$/;
			break;
		case 'min_refill':
			reg = /^[0-9]+$/;
			break;
		case 'max_refill':
			reg = /^[0-9]+$/;
			break;
		case 'min_balance':
			reg = /^[0-9]+$/;
			if (parseInt(value,10) > parseInt(document.getElementById("current_score").value,10)) {
				alert('Сумма больше вклада');
				value="";
			}			
			break;
		case 'date_score':
			reg = /^\d{4}-\d{2}-\d{2}$/;
			break;
	}
	if (reg.test(value)) {
		chk = true;
		drawBorder(parent, 'success');
	} else {
		drawBorder(parent, 'error');
		chk = false;
		obj.value="";
	}
	switch(id){
		case 'n_score':
			chk_n_score = chk;
			break;
		case 'current_score':
			chk_current_score = chk;
			break;
		case 'min_refill':
			chk_min_refill = chk;
			break;
		case 'max_refill':
			chk_max_refill = chk;
			break;
		case 'min_balance':
			chk_min_balance = chk;		
			break;
		case 'date_score':
			chk_date_score = chk;
			break;
	}
	var _create_score = document.getElementById('create_score');
	if($('#t_score option:selected').val()==="Накопительный"){
		if (chk_n_score && chk_current_score && chk_date_score && chk_min_refill && chk_max_refill){
			_create_score.disabled = false;
		} else {
			_create_score.disabled = true;
		}
	} else {
		if (chk_n_score && chk_current_score && chk_date_score && chk_min_balance){
			_create_score.disabled = false;
		} else {
			_create_score.disabled = true;
		}
	}
}

function drawBorder(parent, status){
	if (status==='success'){
		parent.classList.remove("has-error");
		parent.classList.add("has-success");
	} else {
		parent.classList.remove("has-success");
		parent.classList.add("has-error");
	}
<<<<<<< HEAD

=======
}

function createTableFromDB(obj){
	var tbody = document.getElementsByTagName('tbody')[0];
	var row = document.createElement('tr');
	row.id = "id" + obj.number;
	var td = [];
	tbody.appendChild(row);
	for (var i = 0; i < 8; i++){
		td[i] = document.createElement('td');
		row.appendChild(td[i]);
	}
		var str = '\
			<div class="action" onclick="aboutForm(this)" style="color:blue;">Подробнее</div>\
			<div class="action" onclick="changeForm(this), isCreate(false)" style="color:green;">Редактировать</div>\
			<div class="action" onclick="deleteForm(this)" style="color:red;">Удалить</div>\
			';
		td[0].innerHTML = obj.number;
		td[1].innerHTML	= obj.type;
		td[2].innerHTML = obj.status == true ? "Заблокирован": "Активный";
		td[3].innerHTML = obj.current;
		td[4].innerHTML = obj.term;
		td[5].innerHTML = obj.percent;
		td[6].innerHTML = obj.date;
		td[7].innerHTML = str;
>>>>>>> +deployd. release
}

function createScore(){
	if (!create){
		var tr = document.getElementById(g_id);
		var td = document.getElementById(g_id).children;
		td[0].innerHTML = $('#n_score').val();
		td[1].innerHTML = $('#t_score').val();
		td[2].innerHTML = $('#b_score').is(':checked')? "Заблокирован": "Активный";
		td[3].innerHTML = $('#current_score').val();
		td[4].innerHTML = $('#term_score').val();
		td[5].innerHTML = $('#percent').val();
		td[6].innerHTML = $('#date_score').val();
		tr.id = "id"+$('#n_score').val();
		for (var i=0; i<Score.getCount(); i++){
			if (score[i].getNumber()==g_id.substring(2)){//
				score[i].setNumber($('#n_score').val());
				score[i].setCurrent($('#current_score').val());
				score[i].setType($('#t_score').val());
				score[i].setStatus($('#b_score').is(':checked'));
				score[i].setTerm($('#term_score').val());
				score[i].setPercent($('#percent').val());
				score[i].setDate($('#date_score').val());
				if (score[i].getType()==="Накопительный"){
					score[i].setMinrefill($('#min_refill').val());
					score[i].setMaxrefill($('#max_refill').val());
				} else {
					score[i].setPodtip($('#pt_score').val());
					score[i].setMinbalance($('#min_balance').val());
				}
			}
		}
	}
	var _number_score = document.getElementById('n_score').value;
	var _type_score = document.getElementById('t_score').value;
	var _status = document.getElementById('b_score').checked;
	var _current_score = document.getElementById('current_score').value;
	var _term_score = document.getElementById('term_score').value;
	var _percent = document.getElementById('percent').value;
	var _date_score = document.getElementById('date_score').value;
	var _podtip = document.getElementById('pt_score').value;
	var _minbalance = document.getElementById('min_balance').value;
	var _minrefill = document.getElementById('min_refill').value;
	var _maxrefill = document.getElementById('max_refill').value;
	var tbody = document.getElementsByTagName('tbody')[0];
	var arraytable = [_number_score, _type_score, _status, _current_score, _term_score, _percent, _date_score, ""];
	if (create){
		if (_type_score === "Расчетный"){
			score.push(new RSScore(_number_score, _type_score, _podtip, _status, _current_score, _minbalance, _term_score, _percent, _date_score));
		} else {
			score.push(new NScore(_number_score, _type_score, _status, _current_score, _minrefill, _maxrefill, _term_score, _percent, _date_score));
		}
		Score.counter++;
		var row = document.createElement('tr');
		row.id = "id" + _number_score;
		var td = [];
		tbody.appendChild(row);
		for (var i = 0; i < 8; i++){
			td[i] = document.createElement('td');
			td[i].innerHTML = arraytable[i];
			row.appendChild(td[i]);
		}
			var str = '\
				<div class="action" onclick="aboutForm(this)" style="color:blue;">Подробнее</div>\
				<div class="action" onclick="changeForm(this), isCreate(false)" style="color:green;">Редактировать</div>\
				<div class="action" onclick="deleteForm(this)" style="color:red;">Удалить</div>\
				';
			td[2].innerHTML = $('#b_score').is(':checked')? "Заблокирован": "Активный";
			td[7].innerHTML = str;
	}
	$("#modalrs").modal('hide');
}

function refreshModal(){
	chk_n_score=chk_current_score = chk_min_refill = chk_max_refill = chk_min_balance = chk_date_score = false;
	$('#n_score').val("").parent().removeClass("has-success");
	$('#b_score').prop("checked", false);
	$('#current_score').val("").parent().removeClass("has-success");
	$('#min_balance').val("").parent().removeClass("has-success");
	$('min_refill').val("").parent().removeClass("has-success");
	$('max_refill').val("").parent().removeClass("has-success");
	$('#date_score').val("").parent().removeClass("has-success");
	$('#create_score').prop("disabled", true);
	$('#t_score').prop("disabled", false);
	$("#modalrs").modal('hide');
<<<<<<< HEAD

=======
>>>>>>> +deployd. release
}

function aboutForm(this_){
	g_id = $(this_).parent().parent().attr("id");	
	for (let i=0; i<Score.getCount(); i++){
<<<<<<< HEAD
			if (score[i].getNumber()==g_id.substring(2)){
=======
		console.log(score[i].getNumber());
			if (score[i].getNumber()==g_id.substring(2)){
				var stat = score[i].getStatus()?"Заблокирован":"Активный";
>>>>>>> +deployd. release
				var newWin = window.open();
				newWin.document.write("Номер счета: "+ score[i].getNumber()+"<br>");
				newWin.document.write("Тип счёта: "+ score[i].getType()+"<br>");
				if (score[i].getType()=="Расчетный"){	
					newWin.document.write("Подтип счета: "+ score[i].getPodtip()+"<br>");
					newWin.document.write("Минимальный баланс: "+ score[i].getMinbalance()+"<br>");
				}
<<<<<<< HEAD
				newWin.document.write("Статус: "+ score[i].getStatus()?"Заблокирован":"Активный"+"<br>");
=======
				newWin.document.write("Статус: "+ stat +"<br>");
>>>>>>> +deployd. release
				newWin.document.write("Текущая сумма: "+ score[i].getCurrent()+"<br>");
				if (score[i].getType()=="Накопительный"){	
					newWin.document.write("Сумма минимального пополнения: "+ score[i].getMinrefill()+"<br>");
					newWin.document.write("Сумма максимального пополнения: "+ score[i].getMaxrefill()+"<br>");
				}
				newWin.document.write("Cрок вклада: "+ score[i].getTerm()+"<br>");
				newWin.document.write("Процентная ставка: "+ score[i].getPercent()+"<br>");
				newWin.document.write("Дата вклада: "+ score[i].getDate()+"<br>");
<<<<<<< HEAD

=======
>>>>>>> +deployd. release
		}
	}
}

function changeForm(this_){
	var parent = $(this_).parent().parent().attr("id");
	g_id = parent;
	document.getElementById('modal-title').innerHTML = "Редактирование счета: " + parent.substring(2);
	document.getElementById('create_score').innerHTML = "Сохранить";
	$("#modalrs").modal();
	$('#t_score').prop("disabled", true);
	for (let i=0; i<Score.getCount(); i++){
		if (score[i].getNumber()==parent.substring(2)){
			$('#n_score').val(score[i].getNumber());
			$('#current_score').val(score[i].getCurrent());
			$('#t_score').val(score[i].getType());
			$('#b_score').prop("checked", score[i].getStatus()).val(score[i].getStatus());
			$('#term_score').val(score[i].getTerm());
			$('#percent').val(score[i].getPercent());
			$('#date_score').val(score[i].getDate());
		}
	}
}

function deleteForm(this_){
	var parent = $(this_).parent().parent().attr("id");
	elem = document.getElementById(parent);
	if(confirm('Вы уверены, что хотите удалить запись?')){
		elem.remove();
<<<<<<< HEAD
		/*for (let i=0; i<Score.getCount(); i++){ //todo
=======
		for (let i=0; i<Score.getCount(); i++){
>>>>>>> +deployd. release
			if (score[i].getNumber()==parent.substring(2)){
				score.splice[i,1];
				Score.counter--;
			}
<<<<<<< HEAD
		}*/
=======
		}
>>>>>>> +deployd. release
	}
}