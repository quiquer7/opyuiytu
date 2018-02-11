# LMSGI05 #
Modificación del examen con autocorrección (XPATH, XSLT)

## Enunciado de la tarea ##

1) Modifica l'accés a l'objecte xmlDoc (corresponent al document xml llegit) per obtenir les opcions de tipus select, select multiple, checkbox i radio. L'accés s'ha de fer mitjançant Xpath. Modifica les funcions posarDadesHtml per llegir els nodes que surten de la cerca amb Xpath. (Nivell: fàcil)
(fins a 3 punts)

2) Crea questions.xsl i modifica el fitxer (o fes una còpia) questions.xml per posar l'enllaç a questions.xsl de tal forma que si obris directament el fitxer questions.xml el navegador fa una transformació simple per presentar les preguntes, totes les opcions i les respostes a una taula. (Nivell: fàcil)
(fins a 3 punts)

3) Inclou codi per forçar a l'usuari a respondre totes les preguntes. (Veure aplicació d'exemple) (Nivell: mitjà)
(fins a 2 punts)

4) Modifica el codi per que l'aplicació faci la correcció personalitzada modificant l'objecte xmlDoc i mostrant-ho amb una XSLT al client. Js farà només el càlcul de la nota final i ho mostrará després dels resultats. (Nivell: difícil)
(fins a 2 punts)

5) Aprofita per millorar la presentació, especialment per donar estil a la taula resultant de la XSLT.
(fins a 2 punts)

Aplicació d'exemple que ho fa tot amb 3 preguntes: https://github.com/urbinapro/jsxml/tree/xpath

## Introducción ##

Se realiza un formulario con 10 preguntas, las cuales comprenden 5 tipos distintos de inputs de un formulario. Mi elección ha sido la siguiente (ordenados como en el formulario):

* 2 tipos texto.
* 2 tipos radio.
* 2 tipos multiple.
* 2 tipos select.
* 2 tipos checbox.

El tema seleccionado ha sido internet. La información se ha obtenido del siguiente enlace http://html.rincondelvago.com/internet_37.html.

**Se ha habilitado un tiempo de 2min y 30s para la realización del examen.**

## Resolución apartados ##

### Apartado 1 ###

Se ha realizado la modificación únicamente en la obtención de las opciones. Como se puede comprobar en el código:

```js
//---------------------------------------------------------------------------------------------------------
// Métodos que generan los tipos de datos. 
//---------------------------------------------------------------------------------------------------------

//Obtiene el título y lo carga.
function generarTipoTexto (idTag,idHtml){
  var tituloText = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
  ponerDatosText(tituloText, idHtml);
} 

//Obtiene el título y las opciones para cargarlo.
  function generarTipoRadio(idTag,idHtml, idXml, divId){
  var tituloRadio = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
  var opcionesRadio = [];
  var nopt = xmlDoc.getElementById(idXml).getElementsByTagName('option').length;
	for (i = 0; i < nopt; i++) {
	  opcionesRadio[i] = xmlDoc.getElementById(idXml).getElementsByTagName('option')[i].innerHTML;
	}
  ponerDatosRadio(tituloRadio, idHtml, opcionesRadio, divId);
}

/*
 * Se usa la función de generarTipoSelect ya que usa el mismo código que está comentado 
 * dentro de la función.
 */
function generarTipoMultiple (idTag, idHtml, idXml, numSelect){
  //var tituloSelect = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
  //var xpath = "/questions/question[@id=\'"+idXml+"\']/option";
  //var nodesSelect = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
	//ponerDatosMultiple(tituloMultiple, idHtml, nodesSelect, numSelect);
  generarTipoSelect (idTag, idHtml, idXml, numSelect);    
}

function generarTipoSelect (idTag, idHtml, idXml, numSelect){
  var tituloSelect = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
  var xpath = "/questions/question[@id=\'"+idXml+"\']/option";
  var nodesSelect = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
  ponerDatosSelect(tituloSelect, idHtml, nodesSelect, numSelect);
}

function generarTipoCheckbox (idTag, idHtml, idXml, divId){
  var tituloCheckbox = xmlDoc.getElementsByTagName("title")[idTag].innerHTML;
  var xpath = "/questions/question[@id=\'"+idXml+"\']/option";
  var nodesCB = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
  ponerDatosCheckbox(tituloCheckbox, idHtml, nodesCB, divId);
}
```

### Apartado 2 ###

Fichero transform.xsl:

```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
 <head>
  <link rel="stylesheet" type="text/css" href="../css/xml-transform.css"/>
 </head>
 <body>
  <h2>Preguntas Examen Tema Internet</h2>
  <table>
   <tr>
    <th>Title</th>
    <th>Option</th>
    <th>Answer</th>
   </tr>
   <xsl:for-each select="questions/question">
   <tr>
    <td><xsl:value-of select="title"/></td>
   <td>
    <xsl:for-each select="option">
    P<xsl:value-of select="position()"/>: <xsl:value-of select="text()"/><br/>
    </xsl:for-each>
   </td>
   <td class="respuesta">
    <xsl:for-each select="answer">
     <xsl:value-of select="text()"/><br/>
    </xsl:for-each> 
   </td>
   </tr>
   </xsl:for-each>
  </table>
 </body>
</html>
</xsl:template>

</xsl:stylesheet>
```

Fichero respuestas.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="transform.xsl"?>
<questions>
	<question id="AMRQ_001"> 
		<type>text</type>
		<title>¿Internet es público?</title>
		<answer>Sí</answer>
	</question>	

	<question id="AMRQ_002"> 
		<type>text</type>
		<title>¿Qué protocolo de comunicación usa internet?</title>
		<answer>TCP/IP</answer>
	</question>	
	
	<question id="AMRQ_003"> 
		<type>radio</type>
		<title>Significado de WWW</title>
		<option>Working World Web</option>
		<option>World Wide Web</option>
		<option>Web Wide World</option>
		<option>Wide World Web</option>
		<answer>2</answer>
	</question>
	
	<question id="AMRQ_004"> 
		<type>radio</type>
		<title>¿Cómo era conocido inicialmente Internet?</title>
		<option>ARPANET</option>
		<option>NET</option>
		<option>INTRANET</option>
		<option>DOCNET</option>
		<answer>1</answer>
	</question>
	
	<question id="AMRQ_005"> 
		<type>multiple</type>
		<title>Selecciona las afirmaciones verdaderas sobre WWW</title>
		<option>El WWW fue un proyecto iniciado desde el CERN</option>
		<option>Su principal objetivo era relacionar diferentes documentos mediante la técnica del hipertexto</option>
		<option>La exploración en el Web se realiza por medio de un software especial denominado Browser o Explorador.</option>
		<option>WWW es de pago.</option>
		<answer>1</answer>
		<answer>2</answer>
		<answer>3</answer>
	</question>
	
	<question id="AMRQ_006"> 
		<type>multiple</type>
		<title>Selecciona las afirmaciones incorrectas sobre las páginas web.</title>
		<option>Es un documento electrónico que contiene información específica de un tema en particular.</option>
		<option>Se almacenan en algún sistema que se encuentre conectado a la red mundial de información denominada Internet.</option>
		<option>Una página Web no es la unidad básica del World Wide Web.</option>
		<option>Una página web no puede contener contenido multimedia.</option>
		<answer>3</answer>
		<answer>4</answer>
	</question>	

	<question id="AMRQ_007"> 
		<type>select</type>
		<title>Selecciona un protocolo comunmente utilizado para enviar correo electrónico</title>
		<option>TSL</option>
		<option>POP3</option>
		<option>SMTP</option>
		<option>IMAP</option>
		<answer>3</answer>
	</question>
	
	<question id="AMRQ_008"> 
		<type>select</type>
		<title>Selecciona el formato correcto de una direccion de correo electrónico</title>
		<option>@dominio.nombre.organizacion</option>
		<option>nombre@organizacion.dominio</option>
		<option>nombre@dominio</option>
		<option>nombre.organizacion@dominio</option>
		<answer>2</answer>
	</question>
	
	<question id="AMRQ_009"> 
		<type>checkbox</type>
		<title>¿Qué significa FTP?</title>
		<option>File Transfer Protocol.</option>
		<option>File Transfer Photos.</option>
		<option>Files Transfering Protocols.</option>
		<option>Files Transfered Previously.</option>
		<answer>1</answer>
	</question>

	<question id="AMRQ_010"> 
		<type>checkbox</type>
		<title>¿Cúal no es una extensión de fichero comprimido correcta?</title>
		<option>.RAR</option>
		<option>.BMP</option>
		<option>.ZIP</option>
		<option>.MKV</option>
		<answer>2</answer>
		<answer>4</answer>
	</question>	

</questions>
```

### Apartado 3 ###

Este apartado ya se incluía en la tarea de LMSGI03.

### Apartado 4 ###

Fichero questions.xsl:

```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
	<div id="xsl_body">
		<table id="xsl_transform">
			<thead>
				<tr>
					<th>Title</th>
					<th>Option</th>
					<th>Answer</th>
				</tr>
			</thead>
			<tbody>
				<!-- Selecciona los nodos question -->
				<xsl:for-each select="questions/question">      
					<tr class="quest_row">
						<!-- Campo Title -->
						<td class="titulo">
							<xsl:value-of select="title"/>
						</td>
						<!-- Campo Option -->
						<td class="option">
						<!-- Opciones Tipo texto -->
							<xsl:for-each select="answer">
								<xsl:choose>
									<xsl:when test="../type = 'text'">
										<span>
											<xsl:value-of select="text()"/>
										</span>
									</xsl:when>
								</xsl:choose>         
							</xsl:for-each>
							<!-- Opciones diferentes a tipo texto -->
							<!-- Selecciona los nodos option -->
							<xsl:for-each select="option">
								<tr class="options_rows">
									<xsl:variable name="optposition" select="position()-1"/>
									<xsl:variable name="opttext" select="text()"/>
									<td class="opciones_text">
										O<xsl:value-of select="$optposition+1"/>: 
										<xsl:value-of select="$opttext"/>
									</td>
									<!-- Selecciona los nodos answer -->
									<xsl:for-each select="../answer">
										<xsl:variable name="correctanswer" select="text()-1"/>
										<xsl:if test="$optposition=$correctanswer">
											<td class = "correcta">
												<span>&#x2713;</span>
											</td>
										</xsl:if>
									</xsl:for-each>
								</tr>
							</xsl:for-each>
						</td>
						<!-- Campo Answer -->
						<td class="answer">
							<xsl:for-each select="useranswer">
								<tr class="answer_row">
									<xsl:variable name="useranswer" select="text()"/>
									<td class="respuesta">
										<xsl:value-of select="text()"/>
									</td>
									<xsl:for-each select="./correcto">
										<xsl:variable name="valido" select="text()"/>
										<xsl:choose>										
											<xsl:when test="$valido = '1'">
												<td class = "correcta">
													<span>&#x2713;</span>
												</td>
											</xsl:when>
											<xsl:otherwise>
												<td class = "incorrecta">
													<span>X</span>
												</td>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:for-each>
								</tr>
							</xsl:for-each>       
						</td>
					</tr>
				</xsl:for-each>
			</tbody>
		</table>
	</div>
</xsl:template>
</xsl:stylesheet>
```

Fichero questions.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="questions.xsl"?>
<questions>
	<question id="AMRQ_001"> 
		<type>text</type>
		<title>¿Internet es público?</title>
		<answer>Sí</answer>
	</question>	

	<question id="AMRQ_002"> 
		<type>text</type>
		<title>¿Qué protocolo de comunicación usa internet?</title>
		<answer>TCP/IP</answer>
	</question>	
	
	<question id="AMRQ_003"> 
		<type>radio</type>
		<title>Significado de WWW</title>
		<option>Working World Web</option>
		<option>World Wide Web</option>
		<option>Web Wide World</option>
		<option>Wide World Web</option>
		<answer>2</answer>
	</question>
	
	<question id="AMRQ_004"> 
		<type>radio</type>
		<title>¿Cómo era conocido inicialmente Internet?</title>
		<option>ARPANET</option>
		<option>NET</option>
		<option>INTRANET</option>
		<option>DOCNET</option>
		<answer>1</answer>
	</question>
	
	<question id="AMRQ_005"> 
		<type>multiple</type>
		<title>Selecciona las afirmaciones verdaderas sobre WWW</title>
		<option>El WWW fue un proyecto iniciado desde el CERN</option>
		<option>Su principal objetivo era relacionar diferentes documentos mediante la técnica del hipertexto</option>
		<option>La exploración en el Web se realiza por medio de un software especial denominado Browser o Explorador.</option>
		<option>WWW es de pago.</option>
		<answer>1</answer>
		<answer>2</answer>
		<answer>3</answer>
	</question>
	
	<question id="AMRQ_006"> 
		<type>multiple</type>
		<title>Selecciona las afirmaciones incorrectas sobre las páginas web.</title>
		<option>Es un documento electrónico que contiene información específica de un tema en particular.</option>
		<option>Se almacenan en algún sistema que se encuentre conectado a la red mundial de información denominada Internet.</option>
		<option>Una página Web no es la unidad básica del World Wide Web.</option>
		<option>Una página web no puede contener contenido multimedia.</option>
		<answer>3</answer>
		<answer>4</answer>
	</question>	

	<question id="AMRQ_007"> 
		<type>select</type>
		<title>Selecciona un protocolo comunmente utilizado para enviar correo electrónico</title>
		<option>TSL</option>
		<option>POP3</option>
		<option>SMTP</option>
		<option>IMAP</option>
		<answer>3</answer>
	</question>
	
	<question id="AMRQ_008"> 
		<type>select</type>
		<title>Selecciona el formato correcto de una direccion de correo electrónico</title>
		<option>@dominio.nombre.organizacion</option>
		<option>nombre@organizacion.dominio</option>
		<option>nombre@dominio</option>
		<option>nombre.organizacion@dominio</option>
		<answer>2</answer>
	</question>
	
	<question id="AMRQ_009"> 
		<type>checkbox</type>
		<title>¿Qué significa FTP?</title>
		<option>File Transfer Protocol.</option>
		<option>File Transfer Photos.</option>
		<option>Files Transfering Protocols.</option>
		<option>Files Transfered Previously.</option>
		<answer>1</answer>
	</question>

	<question id="AMRQ_010"> 
		<type>checkbox</type>
		<title>¿Cúal no es una extensión de fichero comprimido correcta?</title>
		<option>.RAR</option>
		<option>.BMP</option>
		<option>.ZIP</option>
		<option>.MKV</option>
		<answer>2</answer>
		<answer>4</answer>
	</question>	

</questions>
```

Modificación del apartado de corrección:

```js
function correction (){
	addTitulo("Corrección Examen");
	corregirTexto("answ_text_01", answerq01r, "quest01", "AMRQ_001");
	corregirTexto("answ_text_02", answerq02r, "quest02", "AMRQ_002");
	corregirRadio("radioDiv1", answerq03, answerq03r, "quest03", "AMRQ_003");
    corregirRadio("radioDiv2", answerq04, answerq04r, "quest04", "AMRQ_004");
    corregirMultiple("multiple1", answerq05, answerq05r, "quest05", "AMRQ_005");
    corregirMultiple("multiple2", answerq06, answerq06r, "quest06", "AMRQ_006");
    corregirSelect("select1", answerq07, answerq07r, "quest07", "AMRQ_007");
    corregirSelect("select2", answerq08, answerq08r, "quest08", "AMRQ_008");
    corregirCheckbox("checkboxDiv1", answerq09, answerq09r, "quest09", "AMRQ_009"); 
    corregirCheckbox("checkboxDiv2", answerq10, answerq10r, "quest10", "AMRQ_010");
}
```

Modificación de los apartados de corrección de tipo de campo. También modificación de presentarNota();

```js
// Método encargado de corregir las preguntas de tipo texto.
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

function presentarNota(){
	var div = document.createElement("div");
	var h2 = document.createElement("h2");

	document.getElementById('resultadosDiv').style.display = "block";
	if (document.implementation && document.implementation.createDocument) {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        var resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
        document.getElementById('resultadosDiv').appendChild(resultDocument);
    }

 	h2.innerHTML="NOTA: " + nota.toFixed(2);
	div.id = "nota";
	if (nota >= 5){
	   div.className = "aprobado";
	}else{
		div.className = "suspenso";
	}
	div.appendChild(h2);
	document.getElementById('resultadosDiv').appendChild(div);

	var f=formElement;
	var e = f.elements;
	for (var i = 0, len = e.length; i < len; ++i) {
		e[i].disabled = true;
	}
}
```

### Apartado 5 ###
Se ha aprovechado para pulir el css y añadir el timer.

## Observaciones ##
* En Firefox funciona correctamente cuando se realiza la corrección y se aplica el XSLT.
* En Chrome no funciona correctamente y no he podido resolverlo. Es problema a la hora de aplicar el XSL.
* En IE directamente no funciona. No carga las preguntas ni opciones. 
