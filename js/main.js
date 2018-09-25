let chk_n_score=chk_current_score = chk_min_refill = chk_max_refill = chk_min_balance = chk_date_score = false;
let g_id;
let score = [];
let create;

document.addEventListener('DOMContentLoaded', createHTML);

function createHTML(){
	const str = `<h1>((-(-_(-_-(<span style="color: #039be5">'</span>O _ O)-_-)_-)-))</h1>
	<button class="btn btn-primary" data-toggle="modal" data-target="#modalrs" onclick="document.getElementById('modal-title').innerHTML = 'Новый счет'; document.getElementById('create_score').innerHTML = 'Создать', refreshModal(), isCreate(true)">Создать</button>
	<button class="btn btn-primary" onclick="download()">Загрузить с БД</button>
	<button class="btn btn-primary" onclick="upload()">Выгрузить в БД</button>
	<div class="table-responsive"> 
		<table id="table "class="table table-hover table-bordered align-middle">
			<thead>
				<tr class="active success align-middle">
					<th>Номер<br/>счета</th>
					<th>Тип<br/>вклада</th>
					<th>Статус</th>
					<th>Текущий<br/>баланс</th>
					<th>Срок<br/>вклада</th>
					<th>Процентная<br/>ставка</th>
					<th>Дата<br/>вклада</th>				
					<th>Действия</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	
	<div id="modalrs" class="modal fade" tabindex="-1"> 
		<div class="modal-dialog modal-md" > 
			<div class="modal-content"> 
				<div class="modal-header"> 
					<button class="close" data-dismiss="modal">
						<i class="glyphicon glyphicon-remove"></i> 
					</button>
						<h4 id="modal-title" class="modal-title">Новый счет</h4>
				</div>
				<div class="modal-body">
					<form role="form">
						<div class="form-group">
							<label for="n_score">Номер счета</label>
							<input type="text" class="form-control" id="n_score" placeholder="Введите 6 цифр" onchange="validData('n_score')">
						</div>
						<div class="form-group">
							<label for="t_score">Тип вклада</label>
							<select class="form-control" id="t_score" onchange="selectT()">
								<option >Расчетный</option>
								<option >Накопительный</option>
							</select>
						</div>
						<div class="form-group">
							<label for="pt_score">Подтип вклада</label>
							<select class="form-control" id="pt_score">
								<option >Расходно-пополняемый</option>
								<option >Расходный</option>
							</select>
						</div>
						<div class="checkbox">
							<label><input type="checkbox" class="form-control" id="b_score" value="block">Заблокирован</label>
						</div>
						<div class="form-group">
							<label for="current_score">Сумма вклада</label>
							<input type="text" class="form-control" id="current_score" placeholder="BYN" 
							onchange="validData('current_score')">
						</div>
						<div class="form-group">
							<label for="min_balance">Минимальный остаток</label>
							<input type="text" class="form-control" id="min_balance" placeholder="BYN" 
							onchange="validData('min_balance')">
						</div>
						<div class="form-group hidden">
							<label for="min_refill">Минимальная сумма пополнения</label>
							<input type="text" class="form-control" id="min_refill" placeholder="BYN" 
							onchange="validData('min_refill')">
						</div>
						<div class="form-group hidden">
							<label for="max_refill">Максимальная сумма пополнения</label>
							<input type="text" class="form-control" id="max_refill" placeholder="BYN" 
							onchange="validData('max_refill')">
						</div>
						<div class="form-group">
							<label for="term_score">Срок вклада</label>
							<select class="form-control" id="term_score" onchange="computeTerm()">
								<option >3 месяца</option>
								<option >6 месяцев</option>
								<option >1 год</option>
								<option >3 года</option>
							</select>
						</div>
						<div class="form-group">
							<label for="percent">Процентная ставка</label>
							<input type="text" class="form-control" id="percent" value="1,5%" disabled>
						</div>
						<div class="form-group">
							<label for="date_score">Дата вклада</label>
							<input type="date" class="form-control" id="date_score" onchange="validData('date_score')">
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button class="btn btn-success" id="create_score" onclick="createScore()" disabled>
							Создать	
					</button>
				</div>
			</div>
		</div>
	</div>`
	const body = document.getElementsByTagName("body")[0];
	body.innerHTML =str;
}

function isCreate(bool){
	create = bool;
}


function upload(){
	const xhr = new XMLHttpRequest();
	let upl = [];
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
	const xhr = new XMLHttpRequest();
	xhr.open('GET', '/homework3', false);
	xhr.send();
	if (xhr.status != 200) {
	  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
	} else {
	  console.log( xhr.responseText ); // responseText -- текст ответа.
	}
	let parse = JSON.parse(xhr.responseText, function(key, value){
		if (key == 'date') {
			let date = new Date(value);
			let m = date.getMonth() + 1;
			let d = date.getDate();
			let mm = (m>9?'':'0') + m;
			let dd = (d>9?'':'0') + d;
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

function Score (number, type, status, current, term, percent, date){
	let _number = number;
	let _type = type;
	let _status = status;
	let _current = current;
	let _term = term;
	let _percent = percent;
	let _date = date;
	this.getNumber = () => _number;
	this.setNumber = function(number){
		_number = number;
	}
	this.getType = () => _type;
	this.setType = function(type){
		_type = type;
	}
	this.getStatus = () => _status;
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
Score.getCount = () => Score.counter;


function RSScore (number, type, podtip, status, current, minbalance, term, percent, date){
	Score.call(this);
	let _podtip = podtip;
	let _minbalance = minbalance;
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
	let _minrefill = minrefill;
	let _maxrefill = maxrefill;
	this.getMinrefill = () => _minrefill;
	this.setMinrefill = function(minrefill){
		_minrefill = minrefill;
	}
	this.getMaxrefill = () => _maxrefill;
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
	let selected = $('#t_score option:selected').val();
	let parentPodTip = document.getElementById("pt_score").parentNode.classList;
	let parentMinBalance = document.getElementById("min_balance").parentNode.classList;
	let parentMinRefill = document.getElementById("min_refill").parentNode.classList;
	let parentMaxRefill = document.getElementById("max_refill").parentNode.classList;
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
	let selected = $('#term_score option:selected').val();
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
	let obj = document.getElementById(id);
	let value = obj.value;
	const parent = obj.parentNode;
	let chk = false;
	let reg;
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
	let _create_score = document.getElementById('create_score');
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
}

function createTableFromDB(obj){
	const tbody = document.getElementsByTagName('tbody')[0];
	const row = document.createElement('tr');
	row.id = "id" + obj.number;
	let [...rest]=obj;
	alert(rest);
	let td = [];
	tbody.appendChild(row);
	for (let i = 0; i < 8; i++){
		td[i] = document.createElement('td');
		row.appendChild(td[i]);
	}
		const str = `
			<div class="action" onclick="aboutForm(this)" style="color:blue;">Подробнее</div>
			<div class="action" onclick="changeForm(this), isCreate(false)" style="color:green;">Редактировать</div>
			<div class="action" onclick="deleteForm(this)" style="color:red;">Удалить</div>
			`;
		td[0].innerHTML = obj.number;
		td[1].innerHTML	= obj.type;
		td[2].innerHTML = obj.status == true ? "Заблокирован": "Активный";
		td[3].innerHTML = obj.current;
		td[4].innerHTML = obj.term;
		td[5].innerHTML = obj.percent;
		td[6].innerHTML = obj.date;
		td[7].innerHTML = str;
}

function createScore(){
	if (!create){
		let tr = document.getElementById(g_id);
		let td = document.getElementById(g_id).children;
		td[0].innerHTML = $('#n_score').val();
		td[1].innerHTML = $('#t_score').val();
		td[2].innerHTML = $('#b_score').is(':checked')? "Заблокирован": "Активный";
		td[3].innerHTML = $('#current_score').val();
		td[4].innerHTML = $('#term_score').val();
		td[5].innerHTML = $('#percent').val();
		td[6].innerHTML = $('#date_score').val();
		tr.id = "id"+$('#n_score').val();
		for (let i=0; i<Score.getCount(); i++){
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
	//деструктуризация массива значений
	let _form_control = document.getElementsByClassName('form-control');
	let [_number_score,_type_score,_podtip,_status, _current_score, _minbalance, _minrefill, _maxrefill, _term_score, _percent,_date_score] = _form_control;
/*	let _number_score = document.getElementById('n_score').value;
	let _type_score = document.getElementById('t_score').value;
	let _status = document.getElementById('b_score').checked;
	let _current_score = document.getElementById('current_score').value;
	let _term_score = document.getElementById('term_score').value;
	let _percent = document.getElementById('percent').value;
	let _date_score = document.getElementById('date_score').value;
	let _podtip = document.getElementById('pt_score').value;
	let _minbalance = document.getElementById('min_balance').value;
	let _minrefill = document.getElementById('min_refill').value;
	let _maxrefill = document.getElementById('max_refill').value;*/
	const tbody = document.getElementsByTagName('tbody')[0];
	let arraytable = [_number_score.value, 
	_type_score.value, 
	_status.value, 
	_current_score.value, 
	_term_score.value, 
	_percent.value, 
	_date_score.value, ""];
	if (create){
		if (_type_score.value === "Расчетный"){
			score.push(new RSScore(_number_score.value, _type_score.value, _podtip.value, _status.value, _current_score.value, _minbalance.value, _term_score.value, _percent.value, _date_score.value));
		} else {
			score.push(new NScore(_number_score.value, _type_score.value, _status.value, _current_score.value, _minrefill.value, _maxrefill.value, _term_score.value, _percent.value, _date_score.value));
		}
		Score.counter++;
		let row = document.createElement('tr');
		row.id = "id" + _number_score.value;
		let td = [];
		tbody.appendChild(row);
		for (let i = 0; i < 8; i++){
			td[i] = document.createElement('td');
			td[i].innerHTML = arraytable[i];
			row.appendChild(td[i]);
		}
			const str = '\
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
}

function aboutForm(this_){
	g_id = $(this_).parent().parent().attr("id");	
	for (let i=0; i<Score.getCount(); i++){
			if (score[i].getNumber()==g_id.substring(2)){
				let stat = score[i].getStatus()?"Заблокирован":"Активный";
				const newWin = window.open();
				newWin.document.write("Номер счета: "+ score[i].getNumber()+"<br>");
				newWin.document.write("Тип счёта: "+ score[i].getType()+"<br>");
				if (score[i].getType()=="Расчетный"){	
					newWin.document.write("Подтип счета: "+ score[i].getPodtip()+"<br>");
					newWin.document.write("Минимальный баланс: "+ score[i].getMinbalance()+"<br>");
				}
				newWin.document.write("Статус: "+ stat +"<br>");
				newWin.document.write("Текущая сумма: "+ score[i].getCurrent()+"<br>");
				if (score[i].getType()=="Накопительный"){	
					newWin.document.write("Сумма минимального пополнения: "+ score[i].getMinrefill()+"<br>");
					newWin.document.write("Сумма максимального пополнения: "+ score[i].getMaxrefill()+"<br>");
				}
				newWin.document.write("Cрок вклада: "+ score[i].getTerm()+"<br>");
				newWin.document.write("Процентная ставка: "+ score[i].getPercent()+"<br>");
				newWin.document.write("Дата вклада: "+ score[i].getDate()+"<br>");
		}
	}
}

function changeForm(this_){
	const parent = $(this_).parent().parent().attr("id");
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
	const parent = $(this_).parent().parent().attr("id");
	elem = document.getElementById(parent);
	if(confirm('Вы уверены, что хотите удалить запись?')){
		elem.remove();
		for (let i=0; i<Score.getCount(); i++){
			if (score[i].getNumber()==parent.substring(2)){
				score.splice[i,1];
				Score.counter--;
			}
		}
	}
}