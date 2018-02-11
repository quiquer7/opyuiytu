var formElement=null;

//Variables para las preguntas.
var respuesta1 = null;
var respuesta2 = null;
var respuesta3 = null;
var respuesta4 = null;
var respuesta5 = [];
var respuesta6 = [];
var respuesta7 = null;
var respuesta8 = null;
var respuesta9 = [];
var respuesta10 = [];

//Variables para las respuestas.
var respuesta_1 = null;
var respuesta_2 = null;
var respuesta_3 = null;
var respuesta_4 = null;
var respuesta_5 = [];
var respuesta_6 = [];
var respuesta_7 = null;
var respuesta_8 = null;
var respuesta_9 = [];
var respuesta_10 = [];

//Resultados del examen.
var divResultados;

//Variable para la nota del examen.
var nota = 0; 

var xmlDoc = null;
var xslDoc = null;

window.onload = function(){ 
divResultados = document.getElementById("resultados");

//Temporizador de 10 minutos. Al terminar el tiempo muestra un alert diciendo que se ha terminado el tiempo. Bloquea el examen, muestra la nota y da la opción de volver a intentar. Si le das a corregir, el temporizador se detiene.
var salida = document.getElementById("tiempo"),
minutos = 10,
segundos = 00,
	intervalo = setInterval(function(){
		if (--segundos < 0){
		segundos = 59;
    	minutos--;
    	}
      
    salida.innerHTML = "<b>" + minutos + ":" + (segundos < 10 ? "0" + segundos : segundos)  + "</b>";
	if (!minutos && !segundos){
        clearInterval(intervalo);
        correction();
        presentarNota();
        enableReloadButton();
		alert("Se acabó el tiempo");
        }
		}, 1000);

//Corrección del examen.
    formElement = document.getElementById("myForm");
    formElement.onsubmit = function () {
        clearInterval(intervalo); //detiene el contador.
    	
//Abre un confirm para preguntar si se corrige el examen.
     if (confirm("¿Desea proceder a la corrección del examen?")) {
        if (comprobar()){
        	inicializar();
	        correction();
		 	presentarNota();
		 	enableReloadButton();
        	}
        }
        return false;
    }
 
//lee las preguntas del archivo xml/preguntas.xml
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            xmlDoc = this.responseXML;
            gestionarXml(xmlDoc);
        }
    };
    xhttp.open("GET", "xml/preguntas.xml", true);
    xhttp.send();

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            xslDoc=this.responseXML;
        }
    };
	
    xhttp2.open("GET", "xml/preguntas.xsl", true);
    xhttp2.send();
};

// Se recuperan los datos del fichero XML xml/preguntas.xml
	function gestionarXml(dataXml){

	//PREGUNTAS TEXT
	
	//PREGUNTA 1
	generarTipoTexto(0,"pregunta1");
	respuesta1 = getAnswerText("PREGUNTA1");
	respuesta_1 = respuesta1;
    
  	//PREGUNTA 2
    generarTipoTexto(1,"pregunta2");
	respuesta2 = getAnswerText("PREGUNTA2");
	respuesta_2 = respuesta2;

    //PREGUNTAS RADIO
	
    //PREGUNTA 3
    generarTipoRadio(2, "pregunta3", "PREGUNTA3", "radioDiv1");
    respuesta3 = getAnswerRadio("PREGUNTA3");
    respuesta_3 = getAnswerDataRadio("PREGUNTA3", respuesta3-1);
    
    //PREGUNTA 4
    generarTipoRadio(3, "pregunta4", "PREGUNTA4", "radioDiv2");
    respuesta4 = getAnswerRadio("PREGUNTA4");
    respuesta_4 = getAnswerDataRadio("PREGUNTA4", respuesta4-1);

    //PREGUNTAS SELECT MULTIPLE
	
    //PREGUNTA 5
    generarTipoMultiple (4, "pregunta5", "PREGUNTA5", 0);
   respuesta5 = getAnswerMultiple("PREGUNTA5");
    respuesta_5 = getAnswerDataMultiple("PREGUNTA5", respuesta5);
    
    //PREGUNTA 6
	generarTipoMultiple (5, "pregunta6", "PREGUNTA6", 1);
	respuesta6 = getAnswerMultiple("PREGUNTA6");
	respuesta_6 = getAnswerDataMultiple("PREGUNTA6", respuesta6);

    //PREGUNTAS SELECT
	
    //PREGUNTA 7
    generarTipoSelect (6, "pregunta7", "PREGUNTA7", 2);
    respuesta7 = getAnswerSelect("PREGUNTA7");
    respuesta_7 = getAnswerDataSelect("PREGUNTA7", respuesta7-1);

    //PREGUNTA 8
    generarTipoSelect (7, "pregunta8", "PREGUNTA8", 3);
    respuesta8 = getAnswerSelect("PREGUNTA8");
    respuesta_8 = getAnswerDataSelect("PREGUNTA8", respuesta8-1);

    //PREGUNTAS CHECKBOX
	
    //PREGUNTA 9
    generarTipoCheckbox (8, "pregunta9", "PREGUNTA9", "checkboxDiv1");
    respuesta9 = getAnswerCheckbox("PREGUNTA9");
    respuesta_9 = getAnswerDataCheckbox("PREGUNTA9", respuesta9);
	
	//PREGUNTA 10
	generarTipoCheckbox (9, "pregunta10", "PREGUNTA10", "checkboxDiv2");
	respuesta10 = getAnswerCheckbox("PREGUNTA10");
	respuesta_10 = getAnswerDataCheckbox("PREGUNTA10", respuesta10);

	
	//Funciones para cargar preguntas y opciones.
	
	//Recuparar de text.
	function generarTipoTexto (idTag,idHtml){
    	var tituloText = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
    	ponerDatosText(tituloText, idHtml);
    } 

    //Recuperar de radio.
    function generarTipoRadio(idTag,idHtml, idXml, divId){
    	var tituloRadio = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
	    var opcionesRadio = [];
	    var nopt = xmlDoc.getElementById(idXml).getElementsByTagName('option').length;
	    for (i = 0; i < nopt; i++) {
	        opcionesRadio[i] = xmlDoc.getElementById(idXml).getElementsByTagName('option')[i].innerHTML;
	    }
	    ponerDatosRadio(tituloRadio, idHtml, opcionesRadio, divId);
    }
	
	//Recuperar de select multiple.
    function generarTipoMultiple (idTag, idHtml, idXml, numSelect){
        generarTipoSelect (idTag, idHtml, idXml, numSelect);    
    }
	//Recuperar de select.
    function generarTipoSelect (idTag, idHtml, idXml, numSelect){
    	var tituloSelect = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
        var xpath = "/questions/question[@id=\'"+idXml+"\']/option";
        var nodesSelect = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
        ponerDatosSelect(tituloSelect, idHtml, nodesSelect, numSelect);
    }
	//Recuperar de Checkbox.
    function generarTipoCheckbox (idTag, idHtml, idXml, divId){
    	var tituloCheckbox = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
        var xpath = "/questions/question[@id=\'"+idXml+"\']/option";
        var nodesCB = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
		ponerDatosCheckbox(tituloCheckbox, idHtml, nodesCB, divId);
    }
	
    //getAnswer para tipo text.
    function getAnswerText(idXml){
    	return xmlDoc.getElementById(idXml).getElementsByTagName('answer')[0].innerHTML;
    }

    //getAnswer para tipo radio.
    function getAnswerRadio(idXml){
    	return parseInt(xmlDoc.getElementById(idXml).getElementsByTagName('answer')[0].innerHTML);
    }
	//getAnswer para tipo select multiple.
    function getAnswerMultiple (idXml){
    	var nres = xmlDoc.getElementById(idXml).getElementsByTagName('answer').length;
    	var answer = [];
	    for (i = 0; i < nres; i++) {
	       answer[i] = xmlDoc.getElementById(idXml).getElementsByTagName('answer')[i].innerHTML;
	    }
	    return answer;
    }
	//getAnswer para tipo select
    function getAnswerSelect (idXml){
    	return xmlDoc.getElementById(idXml).getElementsByTagName('answer')[0].innerHTML;
    }
	//getAnswer para tipo checkbox.
    function getAnswerCheckbox (idXml){
    	var nres = xmlDoc.getElementById(idXml).getElementsByTagName('answer').length;
    	var answer = [];
	    for (i = 0; i < nres; i++) {
	       answer[i] = xmlDoc.getElementById(idXml).getElementsByTagName('answer')[i].innerHTML;
	    }
	    return answer;
    }
	
    //Verificar respuestas correctas tipo text.
    function getAnswerDataRadio(idXml, id){
    	return xmlDoc.getElementById(idXml).getElementsByTagName('option')[id].innerHTML;
    }
	//Verificar respuestas correctas tipo select multiple.
    function getAnswerDataMultiple (idXml, id){
    	var answer = [];
	    for (i = 0; i < id.length; i++) {
		    answer[i] = xmlDoc.getElementById(idXml).getElementsByTagName('option')[id[i]-1].innerHTML;
	    }
	    return answer;
    }
	//Verificar respuestas correctas tipo select.
    function getAnswerDataSelect (idXml, id){
    	return xmlDoc.getElementById(idXml).getElementsByTagName('option')[id].innerHTML;
    }
	//Verificar respuestas correctas tipo checkbox.
    function getAnswerDataCheckbox (idXml, id){
    	var answer = [];
	    for (i = 0; i < id.length; i++) {
		    answer[i] = xmlDoc.getElementById(idXml).getElementsByTagName('option')[id[i]-1].innerHTML;
	    }
	    return answer;
    }

}

	//Insertar datos tipo text.
	function ponerDatosText(titulo, id) {
    document.getElementById(id).innerHTML = titulo;
}

	//Insertar datos tipo radio.
	function ponerDatosRadio(titulo, id, options, divId) {
    document.getElementById(id).innerHTML = titulo;
    var radioContainer = document.getElementById(divId);

    for (i = 0; i < options.length; i++) {
        var input = document.createElement("input");
        var label = document.createElement("label");
        label.innerHTML = options[i];
        label.setAttribute("for", divId + "_" + i);
        input.type = "radio";
        input.id = divId + "_" + i;
        input.className = "radio_opt";
        input.name = divId;
        input.value = i;
        radioContainer.appendChild(input);
        radioContainer.appendChild(label);
        radioContainer.appendChild(document.createElement("br"));
    }
}

	//Insertar datos tipo select.
	function ponerDatosSelect(titulo, id, options, numSelect) {
    document.getElementById(id).innerHTML = titulo;

    var select = document.getElementsByTagName("select")[numSelect];
    var result = options.iterateNext();

    i=0;
    while (result) {
        var option = document.createElement("option");
        option.text = result.innerHTML;
        option.value=i; i++;
        select.options.add(option);
        result = options.iterateNext();
    }
}
	//Insertar datos tipo checkbox.
	function ponerDatosCheckbox(titulo, id, options, divId){
 	var checkboxContainer=document.getElementById(divId);
 	document.getElementById(id).innerHTML = titulo;

    var result = options.iterateNext();

    i=0;
    while (result) {
        var input = document.createElement("input");
        var label = document.createElement("label");
        label.innerHTML=result.innerHTML;
        label.setAttribute("for", "opt_check_"+ divId + "_" + i);
        input.type="checkbox";
        input.name=divId;
        input.id="opt_check_" + i;
        input.value=i;
        i++;
        checkboxContainer.appendChild(input);
        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(document.createElement("br"));
        result = options.iterateNext();
    }
}

//Métodos para la corrección del examen.

// Iniciar la corrección.
function inicializar(){
	divResultados.style.display = "block";
	document.getElementById('resultados').innerHTML = "";
	nota=0.0;
}

// Comprobar si el formulario ha sido rellenado del todo.
function comprobar(){
	var f=formElement;
	var checked=false;

	//Comprobar los tipo text
	if (document.getElementById("respuesta_text1").value.length == 0) {
        alert("¡Responde la pregunta 1!");
        document.getElementById("respuesta_text1").focus();
        return false;
    }

    if (document.getElementById("respuesta_text2").value.length == 0) {
        alert("¡Responde la pregunta 2!");
        document.getElementById("respuesta_text2").focus();
        return false;
    }

    //Comprobar los tipo radio.  
    for (var i = 0; i < f.radioDiv1.length; i++) {
	    if( f.radioDiv1[i].checked) checked = true;
	}

	if (!checked) {
        alert("¡Responde la 3 pregunta!");
        document.getElementById("radioDiv1").focus();
        return false;
    }

    checked = false;
    for (var i = 0; i < f.radioDiv2.length; i++) {
	    if( f.radioDiv2[i].checked) checked = true;
	}

	if (!checked) {
        alert("¡Responde la 4 pregunta!");
        document.getElementById("radioDiv2").focus();
        return false;
    }

    //Comprobar los tipo multiple.
    console.log(document.getElementById("multiple1").selectedIndex);
    if (document.getElementById("multiple1").selectedIndex == -1) {
        alert("¡Responde la 5 pregunta!");
        document.getElementById("multiple1").focus();
        return false;
    }
    if (document.getElementById("multiple2").selectedIndex == -1) {
        alert("¡Responde la 6 pregunta!");
        document.getElementById("multiple2").focus();
        return false;
    }

    //Comprobar los tipo select.
        if (document.getElementById("select1").selectedIndex == 0) {
        alert("Responde la 7 pregunta!");
        document.getElementById("select1").focus();
        return false;
    }


    if (document.getElementById("select2").selectedIndex == 0) {
        alert("Responde la 8 pregunta!");
        document.getElementById("select2").focus();
        return false;
    }

    //Comprobar los tipo checkbox.
    checked = false;
    for (var i = 0; i < f.checkboxDiv1.length; i++) {
	    if( f.checkboxDiv1[i].checked) checked = true;
	}

	if (!checked) {
        alert("¡Responde la 9 pregunta!");
        document.getElementById("checkboxDiv1").focus();
        return false;
    }

    checked = false;
    for (var i = 0; i < f.checkboxDiv2.length; i++) {
	    if( f.checkboxDiv2[i].checked) checked = true;
	}

	if (!checked) {
        alert("¡Responde la 10 pregunta!");
        document.getElementById("checkboxDiv2").focus();
        return false;
    }

    return true;
}

// Hace la corrección de todas las preguntas.
	function correction (){
	addTitulo("Corrección Examen");
	corregirTexto("respuesta_text1", respuesta_1, "pregunta1", "PREGUNTA1");
	corregirTexto("respuesta_text2", respuesta_2, "pregunta2", "PREGUNTA2");
	corregirRadio("radioDiv1", respuesta3, respuesta_3, "pregunta3", "PREGUNTA3");
    corregirRadio("radioDiv2", respuesta4, respuesta_4, "pregunta4", "PREGUNTA4");
    corregirMultiple("multiple1", respuesta5, respuesta_5, "pregunta5", "PREGUNTA5");
    corregirMultiple("multiple2", respuesta6, respuesta_6, "pregunta6", "PREGUNTA6");
    corregirSelect("select1", respuesta7, respuesta_7, "pregunta7", "PREGUNTA7");
    corregirSelect("select2", respuesta8, respuesta_8, "pregunta8", "PREGUNTA8");
    corregirCheckbox("checkboxDiv1", respuesta9, respuesta_9, "pregunta9", "PREGUNTA9"); 
    corregirCheckbox("checkboxDiv2", respuesta10, respuesta_10, "pregunta10", "PREGUNTA10");
}

// Corregir tipo text
	function corregirTexto(elementId, answer, question, idXml){
	var texto = document.getElementById(elementId).value;
	var puntuacion = 0;
    var useranswer = xmlDoc.createElement("useranswer");
    useranswer.innerHTML = texto;
    var correcto = xmlDoc.createElement("correcto");
	if (texto == answer) {
		puntuacion = 1;
		nota += puntuacion;
        correcto.innerHTML = 1;
	} else {
		puntuacion = 0;
        correcto.innerHTML = 0;
	}
    useranswer.appendChild(correcto);
    xmlDoc.getElementById(idXml).appendChild(useranswer);
}

	function corregirRadio(elementName, answer, answer1, question, idXml){
	var rad = document.getElementsByName(elementName);
	var valida = false;
	var puntuacion = 0;
	for (var i = 0, length = rad.length; i < length; i++) {
	    if (rad[i].checked) {
            var useranswer = xmlDoc.createElement("useranswer");
            useranswer.innerHTML = "O" + (i+1);
            var correcto = xmlDoc.createElement("correcto");

	        if (rad[i].value == answer-1){
				valida = true;
				puntuacion = 1;
				nota += puntuacion;
                correcto.innerHTML = 1;
		 	} else {
		 		puntuacion = 0;
		 		valida = false;
                correcto.innerHTML = 0;
			}
            useranswer.appendChild(correcto);
            xmlDoc.getElementById(idXml).appendChild(useranswer);
	        break;
	    }
	}
}

// Corregir tipo select multiple.
	function corregirMultiple(elementId, answer, answer1, question, idXml){
	var f = formElement;
    var escorrecta = [];
    var mult = document.getElementById(elementId);
   	var puntuacion = 0;
    for (var i = 0; i < mult.options.length; i++) {
	    if(mult.options[i].selected){
            var useranswer = xmlDoc.createElement("useranswer");
            var valida = false;   
            useranswer.innerHTML = "O" + (i+1);
            
	    	for (var j = 0; j<answer.length; j++){
	    		if (mult.options[i].value == answer[j]-1){
	    			escorrecta.push(mult.options[i].value);
                    valida = true;
	    		}
	    	}
            var correcto = xmlDoc.createElement("correcto");
            if (valida){
                correcto.innerHTML = 1;
            }else{
                correcto.innerHTML = 0;
            }
            useranswer.appendChild(correcto);
            xmlDoc.getElementById(idXml).appendChild(useranswer);
	    }
	}
	if (escorrecta.length > 0) {
		puntuacion = escorrecta.length / answer.length;
		nota += puntuacion;
	} else {
		puntuacion = 0;
		nota += puntuacion;
	}
}

// Corregir tipo select
function corregirSelect(elementId, answer, answer1, question, idXml){
	var sel = document.getElementById(elementId);
	var puntuacion = 0;
    var valida = false;
	if (sel.selectedIndex == answer) {
		puntuacion = 1;
		nota += puntuacion;
        valida = true;
	} else {
        valida = false;
		puntuacion = 0;
	}

    var useranswer = xmlDoc.createElement("useranswer");   
    var correcto = xmlDoc.createElement("correcto");
    if (valida){
        correcto.innerHTML = 1;
    }else{
        correcto.innerHTML = 0;
    }
    useranswer.innerHTML = "O" + sel.selectedIndex;
    useranswer.appendChild(correcto);
    xmlDoc.getElementById(idXml).appendChild(useranswer);
}

// Corregir tipo checkbox
function corregirCheckbox(elementName, answer, answer1, question, idXml){
	var f = formElement;
    var escorrecta = [];
    var check = document.getElementsByName(elementName);
    var respuestas = answer.length;
    var puntuacion = 0;
    for (var i = 0; i < check.length; i++) {
	    if(check[i].checked){
            var useranswer = xmlDoc.createElement("useranswer");
            var valida = false;   
            useranswer.innerHTML = "O" + (i+1);
            
    		for (var j = 0; j<answer.length; j++){
		 		if (check[i].value == answer[j]-1){
	 				escorrecta.push(check[i].value);
                    valida = true;
	 			}
	 		}
            var correcto = xmlDoc.createElement("correcto");
            if (valida){
                correcto.innerHTML = 1;
            }else{
                correcto.innerHTML = 0;
            }
            useranswer.appendChild(correcto);
            xmlDoc.getElementById(idXml).appendChild(useranswer);
	    }
	}

	if (escorrecta.length > 0) {
		puntuacion = escorrecta.length / answer.length;
		nota += puntuacion;
	} else {
		puntuacion = 0;
		nota += puntuacion;
	}
}

//Mostrar nota final.
function presentarNota(){
	var div = document.createElement("div");
	var h2 = document.createElement("h2");

	document.getElementById('resultados').style.display = "block";
	if (document.implementation && document.implementation.createDocument) {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        var resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
        document.getElementById('resultados').appendChild(resultDocument);
    }

 	h2.innerHTML= "&nbsp;&nbsp;&nbsp;" + "Puntuación: " + nota.toFixed(2);
	div.id = "nota";
	if (nota >= 5){
	   div.className = "aprobado";
	}else{
		div.className = "suspenso";
	}
	div.appendChild(h2);
	document.getElementById('resultados').appendChild(div);

	var f=formElement;
	var e = f.elements;
	for (var i = 0, len = e.length; i < len; ++i) {
		e[i].disabled = true;
	}
}

//Título corrección.
function addTitulo(str){
	var div = document.createElement("div");
	var h1 = document.createElement("h1");
 	var node = document.createTextNode(str);

	div.id = "titulo_correccion";
	div.appendChild(h1);
	h1.appendChild(node); 
	document.getElementById('resultados').appendChild(div);
}

//botón para recargar el examen.
function enableReloadButton(){
	var div = document.createElement("div");
	var buttonReload = document.createElement("button");
	var buttonReload= document.createElement('input');
	buttonReload.setAttribute('type','button');
	buttonReload.setAttribute('name','reload');
	buttonReload.setAttribute('value','Volver a intentar');
	buttonReload.setAttribute('class','boton');
	buttonReload.onclick = function(){
		window.location.reload(true);
	};
	div.id = "reload";
	div.appendChild(buttonReload);
	document.getElementById('resultados').appendChild(div);
}

//Las opciones del select multiple se marcan o desmarcan sin pulsar la tecla ctrl.

todos = new Array();
function marcar(s) {
cual=s.selectedIndex;
for(y=0;y<s.options.length;y++){
if(y==cual){
s.options[y].selected=(todos[y]==true)?false:true;
todos[y]=(todos[y]==true)?false:true;
}else{
s.options[y].selected=todos[y];
}
}
} 

// Abrir popup cuando el usuario hace click.
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("mostrar");
}