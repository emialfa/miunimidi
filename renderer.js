// Permisos
navigator.permissions.query({ name: "midi", sysex: true }).then(function(p) {
    p.onchange = function() {};
  });
  
  navigator.requestMIDIAccess({ sysex: true }).then(connect, notConnect);
  
  let inputs;
  let outputs;
  let inputIndex;
  let outputIndex;
  
  const prevConfig = [
    [144, 60, 100],
    [144, 61, 100],
    [144, 62, 100],
    [144, 63, 100],
    [144, 64, 100],
    [144, 65, 100]
  ];
  
  function connect(midiAccess) {
    inputs = Array.from(midiAccess.inputs.values());
    outputs = Array.from(midiAccess.outputs.values());
    showAlertMessage('No se ha encontrado ningún dispositivo MIDI.')
    midiAccess.onstatechange = (event) => {
         // Print information about the (dis)connected MIDI controller
         console.log(event.port.name, event.port.manufacturer, event.port.state);
         if(event.port.name === 'MiuliMIDI HexaBoard' && event.port.manufacturer === 'MiuliMidi' && event.port.state === 'connected') {
          inputIndex = event.port.id.includes('input') ? event.port.id.substring(event.port.id.indexOf('input')+6) : null
          outputIndex = event.port.id.includes('output') ? event.port.id.substring(event.port.id.indexOf('output')+6) : null
          showAlertMessage('Hexaboard conectado exitosamente!')
          setTimeout(() => {
            document.querySelector('.modal-background').style.display = 'none'
          }, 2000)
         } else {
          showAlertMessage('Algo ha fallado. No hemos podido conectarnos al dispositivo Hexaboard. Intente nuevamente porfavor.')
         }
       };
    
    for (var input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
    }
  };
  
  function getMIDIMessage(midiMessage) {
    midiMessageArray = Array.from(midiMessage.data)
    if(midiMessageArray[0] == 240 && midiMessageArray[1] == 45 && midiMessageArray[2] == 45 && midiMessageArray[3] == 45) {
      for (let i=1; i<7; i++) {
        if(midiMessage[4] == i) {
          prevConfig[i-1] = [midiMessageArray[5], midiMessageArray[6], midiMessageArray[7]]
        }
      }
    }
  }
  
  function setMIDIMessage(message) {
    if(!outputIndex) return showAlertMessage('Algo ha fallado. No hemos podido conectarnos al dispositivo Hexaboard. Intente nuevamente porfavor.')
    
    outputs[outputIndex].send(`240, 45, 45, 45, ${message.button} , ${message.type}, ${message.message}, ${message.value}, 240`)
  }
  
  function showAlertMessage(message) {
    const alertMessage = document.createElement('div')
    alertMessage.classList.add('modal-background')
    document.body.appendChild(alertMessage)
    alertMessage.innerHTML = `<div class='connected-toast'>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
    <svg class="logo" width="29" height="28" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="13.1923" height="47.1154" fill="black"/>
      <rect x="16.9615" y="10.3654" width="14.1346" height="36.75" fill="black"/>
      <rect x="34.8654" width="14.1346" height="47.1154" fill="black"/>
      </svg><h1 class="me-auto">MiuniMIDI</h1>
    </div>
    <div class="toast-body">
    ${message}
    </div>
    </div>
    </div>`
  }
  
  function notConnect() {
    const alertMessage = document.createElement('div')
    alertMessage.classList.add('modal-background')
    document.body.innerHTML = `<div class='connected-toast'>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
    <svg class="logo" width="29" height="28" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="13.1923" height="47.1154" fill="black"/>
      <rect x="16.9615" y="10.3654" width="14.1346" height="36.75" fill="black"/>
      <rect x="34.8654" width="14.1346" height="47.1154" fill="black"/>
      </svg><h1 class="me-auto">MiuniMIDI</h1>
    </div>
    <div class="toast-body">
    No se ha podido conectar al dispositivo MIDI.</br> Para volver a intentarlo puede volver a ingresar a la web.
    </div>
    </div>
    </div>`
  }
  
  var canal =  document.getElementById('Canal-id');
  var tipo = document.getElementById('Tipo-id');
  var mensaje = document.getElementById('Mensaje-id');
  var valores = document.getElementById('valores-id');
  var tipo1 = document.getElementById('Tipo1-id');
  var mensaje1 = document.getElementById('Mensaje1-id');
  var valores1 = document.getElementById('valores1-id');
  var boton = document.getElementById('cargarboton');
  var boton1 = document.getElementById('cargarboton1');
  var flechita = document.getElementById('flechita');
  var btnconfigurando = document.getElementById('btnconfigurando');
  
  const presetsButtons = [
    {
      type: 144,
      message: 60, 
      value: 100
    },
    {
      type: 144,
      message: 61, 
      value: 100
    },
    {
      type: 144,
      message: 62, 
      value: 100
    },
    {
      type: 144,
      message: 63, 
      value: 100
    },
    {
      type: 144,
      message: 64, 
      value: 100
    },
    {
      type: 144,
      message: 65, 
      value: 100
    }
  ]
  
  for (var i =1; i<17; i++) {
    var opcion = document.createElement("option");
    opcion.innerHTML = i;
    canal.appendChild(opcion);
  };
  
  
  var notes = ["do0", "do#0", "re0", "re#0", "mi0", "fa0", "fa#0", "sol0", "sol#0", "la0", "la#0", "si0", 
  "do1", "do#1", "re1", "re#1", "mi1", "fa1", "fa#1", "sol1", "sol#1", "la1", "la#1", "si1",
  "do2", "do#2", "re2", "re#2", "mi2", "fa2", "fa#2", "sol2", "sol#2", "la2", "la#2", "si2",
  "do3", "do#3", "re3", "re#3", "mi3", "fa3", "fa#3", "sol3", "sol#3", "la3", "la#3", "si3", 
  "do4", "do#4", "re4", "re#4", "mi4", "fa4", "fa#4", "sol4", "sol#4", "la4", "la#4", "si4", 
  "do5", "do#5", "re5", "re#5", "mi5", "fa5", "fa#5", "sol5", "sol#5", "la5", "la#5", "si5", 
  "do6", "do#6", "re6", "re#6", "mi6", "fa6", "fa#6", "sol6", "sol#6", "la6", "la#6", "si6", 
  "do7", "do#7", "re7", "re#7", "mi7", "fa7", "fa#7", "sol7", "sol#7", "la7", "la#7", "si7",
  "do8", "do#8", "re8", "re#8", "mi8", "fa8", "fa#8", "sol8", "sol#8", "la8", "la#8", "si8", 
  "do9", "do#9", "re9", "re#9", "mi9", "fa9", "fa#9", "sol9", "sol#9", "la9", "la#9", "si9", 
  "do10","do#10","re10","re#10", "mi10", "fa10", "fa#10", "sol10"]
  
  notes.forEach(function (elemento, indice) {
    var opcion = document.createElement("option");
    opcion.innerHTML = elemento;
    opcion.value = indice;
    document.getElementById('Mensaje-id').appendChild(opcion);
  });
  
  for (var i=0; i<128; i++) {
    var opcion = document.createElement("option");
    opcion.innerHTML = i;
    opcion.value = i;
    document.getElementById('valores-id').appendChild(opcion);
  };
  
  tipo.addEventListener('change', (event) => {
  var sel = tipo.options[tipo.selectedIndex];
  if (sel.text == "Note") {
    document.getElementById('Mensaje-id').innerHTML = "";
    notes.forEach(function (elemento, indice) {
  
      var opcion = document.createElement("option");
      opcion.innerHTML = elemento;
      opcion.value = indice;
      document.getElementById('Mensaje-id').appendChild(opcion);
    });
  }
  else if (sel.text == "CC") {
    document.getElementById('Mensaje-id').innerHTML = "";
    for (var i =0; i<128; i++) {
      var opcion = document.createElement("option");
      opcion.innerHTML = "CC" + i;
      opcion.value = i;
      document.getElementById('Mensaje-id').appendChild(opcion);
    };
  }
  });
  
  
  boton.addEventListener('click', function(){
    console.log('asdf')
      var selectedCanal = canal.options[canal.selectedIndex];
      var selectedOption = tipo.options[tipo.selectedIndex];
      var selectedOption1 = mensaje.options[mensaje.selectedIndex];
      var selectedOption2 = valores.options[valores.selectedIndex];
      for (let i=1; i<7; i++) {
        if (btnconfigurando.textContent == "Botón "+i) {
          presetsButtons[i-1].type = selectedOption.text === 'Note' ? 143+Number.parseInt(selectedCanal.text) : 175+Number.parseInt(selectedCanal.text);
          presetsButtons[i-1].message = selectedOption1.value;
          presetsButtons[i-1].value = selectedOption2.text;
          document.getElementById('btn-text'+i).textContent = selectedOption1.text;
          document.getElementById('btn-textt'+i).textContent = selectedOption2.text;
          document.getElementById('btn-texttt'+i).textContent = "(CH" + selectedCanal.text + ")";
          }
      }
  });
  
  document.getElementById('cargarboton2').addEventListener('click', function(){ 
    presetsButtons.forEach((preset,indice) => {
      setMIDIMessage({...preset, button: indice+1})
    })
  });
  
  
  document.getElementById('btn-text1').textContent = "Do5";
  document.getElementById('btn-text2').textContent = "Do#5";
  document.getElementById('btn-text3').textContent = "Re5";
  document.getElementById('btn-text4').textContent = "(CH1)";
  document.getElementById('btn-text5').textContent = "(CH1)";
  document.getElementById('btn-text6').textContent = "(CH1)";
  document.getElementById('btn-textt1').textContent = "100";
  document.getElementById('btn-textt2').textContent = "100";
  document.getElementById('btn-textt3').textContent = "100";
  document.getElementById('btn-textt4').textContent = "100";
  document.getElementById('btn-textt5').textContent = "100";
  document.getElementById('btn-textt6').textContent = "100";
  document.getElementById('btn-texttt1').textContent = "(CH1)";
  document.getElementById('btn-texttt2').textContent = "(CH1)";
  document.getElementById('btn-texttt3').textContent = "(CH1)";
  document.getElementById('btn-texttt4').textContent = "Re#5";
  document.getElementById('btn-texttt5').textContent = "Mi5";
  document.getElementById('btn-texttt6').textContent = "Fa5";
  
  document.getElementById('btnactual-text1').textContent = prevConfig[0][0] > 143 && prevConfig[0][0] < 160 ? notes[prevConfig[0][1]] : 'CC'+notes[prevConfig[0][1]];
  document.getElementById('btnactual-text2').textContent = prevConfig[1][0] > 143 && prevConfig[1][0] < 160 ? notes[prevConfig[1][1]] : 'CC'+notes[prevConfig[1][1]];
  document.getElementById('btnactual-text3').textContent = prevConfig[2][0] > 143 && prevConfig[2][0] < 160 ? notes[prevConfig[2][1]] : 'CC'+notes[prevConfig[2][1]];
  document.getElementById('btnactual-text4').textContent = prevConfig[3][0] > 143 && prevConfig[3][0] < 160 ? notes[prevConfig[3][1]] : 'CC'+notes[prevConfig[3][1]];
  document.getElementById('btnactual-text5').textContent = prevConfig[4][0] > 143 && prevConfig[4][0] < 160 ? notes[prevConfig[4][1]] : 'CC'+notes[prevConfig[4][1]];
  document.getElementById('btnactual-text6').textContent = prevConfig[5][0] > 143 && prevConfig[5][0] < 160 ? notes[prevConfig[5][1]] : 'CC'+notes[prevConfig[5][1]];
  
  for (let i=1; i<7; i++) {
    document.getElementById('clickbtn'+i).addEventListener('click', function(){
      document.getElementById("ledbtn1").className = "btnapagado";
      document.getElementById("ledbtn2").className = "btnapagado";
      document.getElementById("ledbtn3").className = "btnapagado";
      document.getElementById("ledbtn4").className = "btnapagado";
      document.getElementById("ledbtn5").className = "btnapagado";
      document.getElementById("ledbtn6").className = "btnapagado";
      document.getElementById("ledbtn"+i).className = "btnencendido";
      document.getElementById('btnconfigurando').textContent = "Botón "+i;
  });
  }
  
  
  