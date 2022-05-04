mapStore = L.map("mapkornerStore").setView(
  [4.715066682556442, -74.05887373389004],
  10
);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    center: [4.715066682556442, -74.05887373389004],
  }
).addTo(mapStore);

capaStore = L.layerGroup().addTo(mapStore);

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(mapStore);

mapStore.removeControl(mapStore.zoomControl);
mapStore.doubleClickZoom.disable();

//////////////////////CONTROLES MAPA/////////////////
//yearLayers = {
//2018: L.geoJson(sitiosInteres),
//};
OpenStreetMap_Mapnik = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);
basemaps = {
  OpenStreetMap: OpenStreetMap_Mapnik,
};
L.control
  .layers(basemaps, "", { position: "bottomright" }, { collapsed: true })
  .addTo(mapStore);
//////////////////////FIN CONTROLES MAPA/////////////////

////////// Leyenda. ELEMENTOS//////////////

desplegableStore = L.control({ position: "topleft" });

desplegableStore.onAdd = function (mapStore) {
  div = L.DomUtil.create("div", "container");

  div.innerHTML +=
    "<div class='row'  id='selectDivElementos'>" +
    "<div class='card  collapsed-card'>" +
    "<div class='card-header' style='background-color: #ffd600; font-size: 17px; color: #000;'><b>Seleccionar campaña</b>" +
    "<div class='card-tools'>" +
    "<button type='button' class='btn btn-tool' data-card-widget='collapse' title='Collapse'>" +
    "<i style= 'color: #000;' class='fas fa-plus'></i></button>" +
    "</div>" +
    "</div>" +
    "<div class='card-body p-3'>" +
    "<span><b>Mes</b></span>" +
    "<select class='form-control' name='idMesViaCiudades' id='idMesViaCiudades'>" +
    "<option value='13' selected>Seleccione un mes...</option>" +
    "<option value='1'>Enero</option>" +
    "<option value='2'>Febrero</option>" +
    "<option value='3'>Marzo</option>" +
    "<option value='4'>Abril</option>" +
    "<option value='5'>Mayo</option>" +
    "<option value='6'>Junio</option>" +
    "<option value='7'>Julio</option>" +
    "<option value='8'>Agosto</option>" +
    "<option value='9'>Septiembre</option>" +
    "<option value='10'>Octubre</option>" +
    "<option value='11'>Noviembre</option>" +
    "<option value='12'>Diciembre</option>" +
    "</select> </br>" +
    "<span><b>Ciudad</b></span>" +
    "<select class='form-control' name='idCiudades' id='idCiudades' onchange='seleccionCiudades()'>" +
    "<option value='17' selected>Seleccione una ciudad...</option>" +
    "<option value='1'>Bogotá</option>" +
    "</select> </br>" +
    "<span><b>Campaña</b></span>" +
    "<select class='form-control' name='idCampana' id='idCampana' onchange='mostrarCampana()'>" +
    "<option value='13' selected>Seleccione una campaña...</option>" +
    "<option value='1'>Leche Klim</option>" +
    "<option value='2'>Nestogeno</option>" +
    "<option value='3'>Campaña 3</option>" +
    "</select> </br>" +
    "<span><b>Vías</b></span>" +
    "<select class='form-control' name='idVias' id='idVias' onchange='seleccionVia()'>" +
    "<option value='' selected>Selecciona una vía...</option>" +
    "</select>" +
    "</div>" +
    "</div>" +
    "</div>";

  return div;
};

desplegableStore.addTo(mapStore);

/////////////////FIN LEYENDA ELEMENTOS/////////////////////////

/////////////////MOSTRAR CAMPAÑAS/////////////////////////////

iconoTienda = L.icon({
  iconUrl: "views/dist/images/tienda.png",
  iconSize: [40, 40],
  iconAnchor: [15, 40],
  shadowUrl: "",
  shadowSize: [35, 50],
  shadowAnchor: [0, 55],
  popupAnchor: [0, -40],
  opacity: 0.9,
});

iconoTienda2 = L.icon({
  iconUrl: "views/dist/images/tienda2.png",
  iconSize: [40, 40],
  iconAnchor: [15, 40],
  shadowUrl: "",
  shadowSize: [35, 50],
  shadowAnchor: [0, 55],
  popupAnchor: [0, -40],
  opacity: 0.9,
});

let carritoTiendas = [];

function mostrarCampana() {
  selectCampana = document.getElementById("idCampana").value;
  campanaSeleccionada = selectCampana;

  if (selectCampana == 1) {
    capaTiendas = L.geoJSON(sitiosTiendasCampana1, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: iconoTienda });
      },
      onEachFeature: popup_tiendas,
    });

    capaStore.addLayer(capaTiendas);

    agregarItemCampana(campanaSeleccionada);
  } else {
    if (selectCampana == 2) {
      capaTiendas2 = L.geoJSON(sitiosTiendasCampana2, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: iconoTienda2 });
        },
        onEachFeature: popup_tiendas,
      });

      capaStore.addLayer(capaTiendas2);

      agregarItemCampana(campanaSeleccionada);
    }
  }
}

function popup_tiendas(feature, layer) {
  //selectValla = document.querySelector('.vallasCheck:checked').value;
  seleccionItem = selectCampana;

  layer.bindPopup(
    "<div style='text-align:center; background-color: #ffd600'><h6 style='font-weight: bold'>" +
      "<b>Campaña: </b>" +
      feature.properties.NOMBRE_CAMPAMA +
      "<h2></div><hr><table><tr><td>" +
      "<img id='imgTienda' src='" +
      feature.properties.FOTO_TIENDA +
      "' style='width:300px;height:250px;'>" +
      "<hr>" +
      "</td></tr><tr><td><b>Localidad:</b> " +
      feature.properties.LOCALIDAD +
      "</td></tr><tr><td><b>Dirección:</b> " +
      feature.properties.DIRECCION +
      "</td></tr><tr><td><b>Impactos:</b> " +
      feature.properties.ALCANCE +
      "</td></tr><tr><td><b>Id:</b> " +
      feature.properties.ID_ELEMENTO +
      "</td></tr><tr><td><b>idTramo:</b> " +
      feature.properties.ID_TRAMO +
      "</td></tr><tr></tr></table>",
    { minWidth: 150, maxWidth: 300 }
  );
}

/////////////////FIN MOSTRAR CAMPAÑAS/////////////////////////////

function agregarItemCampana(idCampana) {
  carritoTiendas.push(idCampana);

  carritoTiendas = carritoTiendas.filter((item, index) => {
    return carritoTiendas.indexOf(item) === index;
  });

  renderizarCarritoTiendas();
}

///////////// LEYENDA CARRITO/////////
carroMapaCampanas = L.control({ position: "topright" });
carroMapaCampanas.onAdd = function (mapStore) {
  div = L.DomUtil.create("div", "container");

  div.innerHTML +=
    "<div class='row' id='divTiendas'>" +
    "<div class='row'  id='selectDivElementos'>" +
    "<div class='card collapsed-card' style=' height: 100%; width= 100%;'>" +
    "<div class='card-header' style='background-color:#ffd600; font-size: 17px; color: #000;'><b>Reporte tiendas: </b> <span style='font-size: 14px;' id='itemsSeleccionadosCampanas' class='badge badge-primary right font-weight-bold'></span> " +
    "<div class='card-tools'>" +
    "<button type='button' class='btn btn-tool' data-card-widget='collapse' title='Collapse'>" +
    "<i style= 'color: #000;' class='fas fa-plus'></i></button>" +
    "</div>" +
    "</div>" +
    "<div class='card-body p-0'>" +
    "<aside class='col-sm-12 ' style='background-color:#fff;'><hr/>" +
    "<h5>Campaña seleccionada: <span id='itemsSeleccionados' class='font-weight-bold'></span> </h5>" +
    "<main style='height:250px; overflow-y:scroll;'><ul id='carritoTiendasUL' class='list-group text-left'></ul></main>" +
    "<main style='display: grid; grid-gap: 2rem; grid-template-columns: 45px 45px 45px 45px 45px;'><div><button id='botonVaciarCampanas' class='btn btn-danger btn-sm'><i class='fas fa-trash'> Vaciar campañas</i></button></div>" +
    "</main><hr/></aside>" +
    "</div>";
  ("</div>");
  return div;
};
carroMapaCampanas.addTo(mapStore);

///////////// FIN LEYENDA CARRITO/////////

/////////////////MOSTRAR CAMPAÑAS CARRITO/////////////////////////////

function renderizarCarritoTiendas() {


  let divTiendas = document.getElementById("divTiendas");
  divTiendas.style.display = "block";
  const conteoItemsCampanas = document.querySelector(
    "#itemsSeleccionadosCampanas"
  );

  const DOMcarritoTiendas = document.querySelector("#carritoTiendasUL");
  // Vaciamos todo el html
  DOMcarritoTiendas.textContent = "";
  // Quitamos los duplicados
  const carritoVallaSinDuplicados = [...new Set(carritoTiendas)];
  conteoItemsCampanas.textContent = carritoVallaSinDuplicados.length;
  // Generamos los Nodos a partir de carrito
  carritoVallaSinDuplicados.forEach((itemTiendas) => {
    // Obtenemos el item que necesitamos de la variable base de datos
    if (itemTiendas == 1) {
      tiendasBta = L.geoJSON(sitiosTiendasCampana1, {
        filter: function (feature) {
          if (feature.properties.ID_ELEMENTO == itemTiendas)
            return (nombreCampana = feature.properties.NOMBRE_CAMPAMA);
          else return false;
        },
      });
    } else {
      if (itemTiendas == 2) {
        tiendasBta = L.geoJSON(sitiosTiendasCampana2, {
          filter: function (feature) {
            if (feature.properties.ID_ELEMENTO == itemTiendas)
              return (nombreCampana = feature.properties.NOMBRE_CAMPAMA);
            else return false;
          },
        });
      }
    }

    // Cuenta el número de veces que se repite el producto
    const numeroUnidadesItem = carritoTiendas.reduce((total, itemId) => {
      //¿Coincide las id? Incremento el contador, en caso contrario no mantengo
      return itemId === itemTiendas ? (total += 1) : total;
    }, 0);
    // Creamos el nodo del item del carrito
    const itemCampana = document.createElement("li");
    itemCampana.classList.add(
      "list-group-item",
      "py-2",
      "text-right",
      "mx-2",
      "font-weight-bold"
    );
    itemCampana.style["font-size"] = "12px";

    nombreElemento = "CAMPAÑA";

    itemCampana.textContent = nombreElemento + " - " + nombreCampana;

    const miBotonCampana = document.createElement("button");
    const iconoBoton = document.createElement("li");
    //iconoBoton.classList.add("fas", "fa-print", "font-weight-bold");
    //iconoBoton.textContent = " Reporte";
    miBotonCampana.classList.add("btn", "btn-success", "mx-2", "btn-sm");
    miBotonCampana.style.marginLeft = "1rem";
    miBotonCampana.dataset.item = itemTiendas;
    miBotonCampana.addEventListener("click", reporteCampana);
    miBotonCampana.textContent = "Reporte"
    itemCampana.appendChild(miBotonCampana);
    //miBotonCampana.appendChild(iconoBoton);
    DOMcarritoTiendas.appendChild(itemCampana);
  });
}

function reporteCampana(evento) {

  const idCampana = evento.target.dataset.item;

  divPrintCampana = document.getElementById("tablaReporteTiendas");

  divPrintCampana.innerHTML = "";


  if(idCampana == 1){
    campanaPrint = L.geoJSON(sitiosTiendasCampana1,{
      filter: function (feature) {
        if (feature.properties.ID_ELEMENTO == idCampana)
        return ( nombreCampanaReporte = feature.properties.NOMBRE_CAMPAMA, 
        document.getElementById("tablaReporteTiendas").innerHTML += "<tr><td>" + feature.properties.NOMBRE_CAMPAMA + "</td>" +
        "<td>" + feature.properties.NOMBRE + "</td>" +  
        "<td><img id='imgTienda' src='"+ feature.properties.FOTO_TIENDA +"'" +
        "style='width:450px;height:400px;'></td>" +
        "</tr>");
          
        else return false;
      }   
    });

    optCampana1 = {
      margin: 1,
      filename: "reporteKornerStore"+ "-" + nombreCampanaReporte +".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "tabloid", orientation: "portrait" },
    };
  
    html2pdf().set(optCampana1).from(divPrintCampana).save();

  }else{
    if(idCampana == 2){
      campanaPrint = L.geoJSON(sitiosTiendasCampana2,{
        filter: function (feature) {
          if (feature.properties.ID_ELEMENTO == idCampana)
          return ( nombreCampanaReporte2 = feature.properties.NOMBRE_CAMPAMA, 
            document.getElementById("tablaReporteTiendas").innerHTML += "<tr><td>" + feature.properties.NOMBRE_CAMPAMA + "</td>" +
            "<td>" + feature.properties.NOMBRE + "</td>" +  
            "<td><img id='imgTienda' src='"+ feature.properties.FOTO_TIENDA +"'" +
            "style='width:450px;height:400px;'></td>" +
            "</tr>");
            
          else return false;
        }   
      });

      optCampana2 = {
        margin: 1,
        filename: "reporteKornerStore"+ "-" + nombreCampanaReporte2 +".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "tabloid", orientation: "portrait" },
      };

      html2pdf().set(optCampana2).from(divPrintCampana).save();
    }
  }
 
}

function vaciarCarritoCampanas() {
  // Limpiamos los productos guardados
  carritoTiendas = [];
  // Renderizamos los cambios
  renderizarCarritoTiendas();
  localStorage.clear();

  capaStore.clearLayers();
}
/////////////////FIN MOSTRAR CAMPAÑAS CARRITO/////////////////////////////
