////GENERAL RESUMEN CIUDADES/////
carritoValla = [];
const miLocalStorage = window.localStorage;

$("#idMesPanel").on("change", function() {
    debugger;
    jornada = $.trim($("#idJornada").val());
    mes = $.trim($("#idMesPanel").val());
    clase = $.trim($("#idClase").val());

    $.ajax({
        data: { jornada: jornada, mes: mes, clase: clase },
        url: "models/metricas.php",
        type: "post",
        dataType: "json",
        beforeSend: function() {},
        success: function(json) {
            $("#totalPersonas").text(json.personas);
            $("#totalCarros").text(json.carros);
            $("#totalMotos").text(json.motos);
            $("#totalBicicletas").text(json.bicicletas);
            $("#totalMascotas").text(json.mascotas);
            $("#alcanceTotal").text(json.alcanse);

            $("#personasBogota").text(json.personasBogota);
            $("#personasMedellin").text(json.personasMedellin);
            $("#personasCali").text(json.personasCali);

            $("#carrosBogota").text(json.carrosBogota);
            $("#carrosMedellin").text(json.carrosMedellin);
            $("#carrosCali").text(json.carrosCali);

            $("#motosBogota").text(json.motosBogota);
            $("#motosMedellin").text(json.motosMedellin);
            $("#motosCali").text(json.motosCali);

            $("#bicicletasBogota").text(json.bicicletasBogota);
            $("#bicicletasMedellin").text(json.bicicletasMedellin);
            $("#bicicletasCali").text(json.bicicletasCali);

            $("#mascotasBogota").text(json.mascotasBogota);
            $("#mascotasMedellin").text(json.mascotasMedellin);
            $("#mascotasCali").text(json.mascotasCali);

            $("#avCali").text(json.personas);

            $("#jornadaMañana").text(json.alcanse);

            cargarGrafico(json);
            cargarJornadas(mes);
        },
        error: function() {
            alert("error");
        },
    });
});

/////MAPA///////////////////////

mymap = L.map("mapid").setView([4.715066682556442, -74.05887373389004], 9);

mymap.on('click', function() {
    if (mymap.scrollWheelZoom.enabled()) {
        mymap.scrollWheelZoom.disable();
    } else {
        mymap.scrollWheelZoom.enable();
    }
});

L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        center: [4.715066682556442, -74.05887373389004],
    }
).addTo(mymap);

mymap.removeControl(mymap.zoomControl);

capaEstratos = L.layerGroup().addTo(mymap);
capaVallas = L.layerGroup().addTo(mymap);
capaViasPrueba = L.layerGroup().addTo(mymap);
capaCiclorutas = L.layerGroup().addTo(mymap);
capaParquesBta = L.layerGroup().addTo(mymap);
capaEstacionesTrasmilenio = L.layerGroup().addTo(mymap);
capaRutasTroncalesTrasmilenio = L.layerGroup().addTo(mymap);

sidebarMapa = L.control.sidebar("sidebarMapa", {
    closeButton: true,
    position: "right",
});

sidebarMapaFiltro = L.control.sidebar("sidebarMapaFiltro", {
    closeButton: true,
    position: "right",
});

mymap.addControl(sidebarMapa);
mymap.addControl(sidebarMapaFiltro);

mymap.on("click", function() {
    //sidebarMapa.hide();
});

$("#idJornada").on("change", function() {
    jornadaS = $.trim($("#idJornada").val());
    mesS = $.trim($("#idMes").val());

    if (jornadaS == 1) {
        $.ajax({
            data: { jornadaS: jornadaS, mesS: mesS },
            url: "models/metricas.php",
            type: "post",
            dataType: "json",
            beforeSend: function() {},
            success: function(json) {
                $("#jornadaManana").text(json.alcanse);
            },
            error: function() {
                alert("error");
            },
        });
    } else {
        if (jornadaS == 2) {
            $.ajax({
                data: { jornadaS: jornadaS, mesS: mesS },
                url: "models/metricas.php",
                type: "post",
                dataType: "json",
                beforeSend: function() {},
                success: function(json) {
                    $("#jornadaTarde").text(json.alcanse);
                },
                error: function() {
                    alert("error");
                },
            });
        } else {
            $.ajax({
                data: { jornadaS: jornadaS, mesS: mesS },
                url: "models/metricas.php",
                type: "post",
                dataType: "json",
                beforeSend: function() {},
                success: function(json) {
                    $("#jornadaNoche").text(json.alcanse);
                },
                error: function() {
                    alert("error");
                },
            });
        }
    }
});

////////////////VIAS CIUDADES////////////////////

function cargarMapa(datos, ciudad, idVia) {
    container = L.DomUtil.get("mapid");
    if (container != null) {
        container._leaflet_id = null;
    }

    marker = L.marker([4.715066682556442, -74.05887373389004]).addTo(mymap);
    //marker.bounce();

    if (ciudad == 1) {
        personasBogota = [];
        carrosBogota = [];
        motosBogota = [];
        bicicletasBogota = [];
        mascotasBogota = [];
        ciudad = [];
        lat = [];
        lon = [];
        alcanceCiudad = [];

        //////////AUTONORTE/////////

        personasAutoNorte = [];
        CarrosAutoNorte = [];
        MotosAutoNorte = [];
        BicicletasAutoNorte = [];
        MascotasAutoNorte = [];
        totalAlcanceAutoNorte = [];

        ////////CRA7////////////////

        personasCra7 = [];
        CarrosCra7 = [];
        MotosCra7 = [];
        BicicletasCra7 = [];
        MascotasCra7 = [];
        totalAlcanceCra7 = [];

        ////////AvCali////////////////

        personasAvCali = [];
        CarrosAvCali = [];
        MotosAvCali = [];
        BicicletasAvCali = [];
        MascotasAvCali = [];
        totalAlcanceAvCali = [];

        ////////Calle68////////////////

        personasCalle68 = [];
        CarrosCalle68 = [];
        MotosCalle68 = [];
        BicicletasCalle68 = [];
        MascotasCalle68 = [];
        totalAlcanceCalle68 = [];

        ////////NQS////////////////

        personasNQS = [];
        CarrosNQS = [];
        MotosNQS = [];
        BicicletasNQS = [];
        MascotasNQS = [];
        totalAlcanceNQS = [];

        ////////Calle80////////////////

        personasCalle80 = [];
        CarrosCalle80 = [];
        MotosCalle80 = [];
        BicicletasCalle80 = [];
        MascotasCalle80 = [];
        totalAlcanceCalle80 = [];

        ////////AvBoyaca////////////////

        personasAvBoyaca = [];
        CarrosAvBoyaca = [];
        MotosAvBoyaca = [];
        BicicletasAvBoyaca = [];
        MascotasAvBoyaca = [];
        totalAlcanceAvBoyaca = [];

        ////////Calle100////////////////

        personasCalle100 = [];
        CarrosCalle100 = [];
        MotosCalle100 = [];
        BicicletasCalle100 = [];
        MascotasCalle100 = [];
        totalAlcanceCalle100 = [];

        ////////Cra15////////////////

        personasCra15 = [];
        CarrosCra15 = [];
        MotosCra15 = [];
        BicicletasCra15 = [];
        MascotasCra15 = [];
        totalAlcanceCra15 = [];

        ////////AvSuba////////////////

        personasAvSuba = [];
        CarrosAvSuba = [];
        MotosAvSuba = [];
        BicicletasAvSuba = [];
        MascotasAvSuba = [];
        totalAlcanceAvSuba = [];

        ////////Calle26////////////////

        personasCalle26 = [];
        CarrosCalle26 = [];
        MotosCalle26 = [];
        BicicletasCalle26 = [];
        MascotasCalle26 = [];
        totalAlcanceCalle26 = [];

        ///ASIGNAR VALOR///////////

        personasBogota.push(datos.personasBogota);
        carrosBogota.push(datos.carrosBogota);
        motosBogota.push(datos.motosBogota);
        bicicletasBogota.push(datos.bicicletasBogota);
        mascotasBogota.push(datos.mascotasBogota);
        ciudad.push(datos.ciudad);
        lat.push(datos.lat);
        lon.push(datos.lon);
        alcanceCiudad.push(datos.totalAlcanceCiudad);

        personasAutoNorte.push(datos.totalAutoNortePersonas);
        CarrosAutoNorte.push(datos.totalAutoNorteCarros);
        MotosAutoNorte.push(datos.totalAutoNorteMotos);
        BicicletasAutoNorte.push(datos.totalAutoNorteBicicletas);
        MascotasAutoNorte.push(datos.totalAutoNorteMascotas);
        totalAlcanceAutoNorte.push(datos.totalAlcanceAutoNorte);

        ////////CRA7////////////////

        personasCra7.push(datos.totalCra7Personas);
        CarrosCra7.push(datos.totalCra7Carros);
        MotosCra7.push(datos.totalCra7Motos);
        BicicletasCra7.push(datos.totalCra7Bicicletas);
        MascotasCra7.push(datos.totalCra7Mascotas);
        totalAlcanceCra7.push(datos.totalAlcanceCra7);

        ////////AvCali////////////////

        personasAvCali.push(datos.totalAvCaliPersonas);
        CarrosAvCali.push(datos.totalAvCaliCarros);
        MotosAvCali.push(datos.totalAvCaliMotos);
        BicicletasAvCali.push(datos.totalAvCaliBicicletas);
        MascotasAvCali.push(datos.totalAvCaliMascotas);
        totalAlcanceAvCali.push(datos.totalAlcanceAvCali);

        ////////Calle68////////////////

        personasCalle68.push(datos.totalCalle68Personas);
        CarrosCalle68.push(datos.totalCalle68Carros);
        MotosCalle68.push(datos.totalCalle68Motos);
        BicicletasCalle68.push(datos.totalCalle68Bicicletas);
        MascotasCalle68.push(datos.totalCalle68Mascotas);
        totalAlcanceCalle68.push(datos.totalAlcanceCalle68);

        ////////NQS////////////////

        personasNQS.push(datos.totalNQSPersonas);
        CarrosNQS.push(datos.totalNQSCarros);
        MotosNQS.push(datos.totalNQSMotos);
        BicicletasNQS.push(datos.totalNQSBicicletas);
        MascotasNQS.push(datos.totalNQSMascotas);
        totalAlcanceNQS.push(datos.totalAlcanceNQS);

        ////////Calle80////////////////

        personasCalle80.push(datos.totalCalle80Personas);
        CarrosCalle80.push(datos.totalCalle80Carros);
        MotosCalle80.push(datos.totalCalle80Motos);
        BicicletasCalle80.push(datos.totalCalle80Bicicletas);
        MascotasCalle80.push(datos.totalCalle80Mascotas);
        totalAlcanceCalle80.push(datos.totalAlcanceCalle80);

        ////////AvBoyaca////////////////

        personasAvBoyaca.push(datos.totalAvBoyacaPersonas);
        CarrosAvBoyaca.push(datos.totalAvBoyacaCarros);
        MotosAvBoyaca.push(datos.totalAvBoyacaMotos);
        BicicletasAvBoyaca.push(datos.totalAvBoyacaBicicletas);
        MascotasAvBoyaca.push(datos.totalAvBoyacaMascotas);
        totalAlcanceAvBoyaca.push(datos.totalAlcanceAvBoyaca);

        ////////Calle100////////////////

        personasCalle100.push(datos.totalCalle100Personas);
        CarrosCalle100.push(datos.totalCalle100Carros);
        MotosCalle100.push(datos.totalCalle100Motos);
        BicicletasCalle100.push(datos.totalCalle100Bicicletas);
        MascotasCalle100.push(datos.totalCalle100Mascotas);
        totalAlcanceCalle100.push(datos.totalAlcanceCalle100);

        ////////Cra15////////////////

        personasCra15.push(datos.totalCra15Personas);
        CarrosCra15.push(datos.totalCra15Carros);
        MotosCra15.push(datos.totalCra15Motos);
        BicicletasCra15.push(datos.totalCra15Bicicletas);
        MascotasCra15.push(datos.totalCra15Mascotas);
        totalAlcanceCra15.push(datos.totalAlcanceCra15);

        ////////AvSuba////////////////

        personasAvSuba.push(datos.totalAvSubaPersonas);
        CarrosAvSuba.push(datos.totalAvSubaCarros);
        MotosAvSuba.push(datos.totalAvSubaMotos);
        BicicletasAvSuba.push(datos.totalAvSubaBicicletas);
        MascotasAvSuba.push(datos.totalAvSubaMascotas);
        totalAlcanceAvSuba.push(datos.totalAlcanceAvSuba);

        ////////Calle26////////////////

        personasCalle26.push(datos.totalCalle26Personas);
        CarrosCalle26.push(datos.totalCalle26Carros);
        MotosCalle26.push(datos.totalCalle26Motos);
        BicicletasCalle26.push(datos.totalCalle26Bicicletas);
        MascotasCalle26.push(datos.totalCalle26Mascotas);
        totalAlcanceCalle26.push(datos.totalAlcanceCalle26);

        viasIcon = L.icon({
            iconUrl: "views/dist/images/markerMap.png",
            iconSize: [60, 60], // size of the icon
            iconAnchor: [37, 37],
            shadowUrl: "",
            shadowSize: [35, 50],
            shadowAnchor: [0, 55],
            popupAnchor: [0, -40],
        });

        //marker.setLatLng([lat[0], lon[0]]).update();
        marker.setLatLng([4.715066682556442, -74.05887373389004]).update();
        mymap.setView(new L.LatLng(lat[0], lon[0]), 14);
        mymap.dragging.enable();
        marker
            .bindPopup(
                ciudad[0] +
                " <br>" +
                "Alcance: " +
                alcanceCiudad[0] +
                "<br>" +
                "Personas: " +
                personasBogota +
                "<br>" +
                "Carros: " +
                carrosBogota +
                "<br>" +
                "Motos: " +
                motosBogota +
                "<br>" +
                "Bicicletas: " +
                bicicletasBogota +
                "<br>" +
                "Mascotas: " +
                mascotasBogota
            )
            .openPopup();

        ///////////////////////////////////////
        ///////////7MA////////////////////////
        //////////////////////////////////////

        polylinePoints7Ma = [
            [4.611941627515484, -74.07096472452137],
            [4.614332512873588, -74.06940815002537],
            [4.615960345105841, -74.06866813919942],
            [4.616672520533346, -74.0686936568141],
            [4.617130347216428, -74.06838744543784],
            [4.6205894727353645, -74.06736674074526],
            [4.631452769085992, -74.0641604478664],
            [4.631452769085992, -74.0641604478664],
            [4.636326528899698, -74.06356735480865],
            [4.6450374482481, -74.06123073360057],
            [4.65075393060103, -74.05798374048248],
            [4.654515049611189, -74.055431560596],
            [4.654515049611189, -74.055431560596],
            [4.660046279628369, -74.05150756857974],
            [4.665047492882758, -74.0471591974051],
            [4.673567523298389, -74.04277016751367],
            [4.675490855947268, -74.04066915239711],
            [4.677601767037955, -74.04010776487397],
            [4.6796618066660285, -74.03844911991922],
            [4.6796618066660285, -74.03844911991922],
            [4.693064189881765, -74.03349509991273],
            [4.698145161727039, -74.03052121847608],
            [4.700292466080045, -74.02885220338409],
            [4.703821740464256, -74.02879503993773],
            [4.708013266380848, -74.02858046323057],
            [4.711563212573654, -74.0292885663376],
            [4.711563212573654, -74.0292885663376],
            [4.713916705708483, -74.02911290345261],
            [4.716002069291862, -74.02880669207634],
            [4.717655096951934, -74.02867910400292],
            [4.720579674854302, -74.0267397652049],
            [4.721673209458137, -74.02628044814051],
            [4.723682256911624, -74.02612734245238],
            [4.725818452881842, -74.02492801456202],
            [4.7313114981622055, -74.02395834509545],
            [4.735271403644056, -74.02442500737041],
            [4.736853825960621, -74.02350477974207],
            [4.740108569506018, -74.02280107626969],
            [4.746941682826161, -74.02267477052217],
        ];

        antPath7Ma = L.polyline.antPath;

        path7ma = antPath7Ma(polylinePoints7Ma, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        path7ma.addTo(mymap);
        //polyline7Ma = L.polyline(polylinePoints7Ma, { className: 'my_polyline7Ma' }).addTo(mymap);

        marker7Ma = L.marker([4.693064189881765, -74.03349509991273])
            .addTo(mymap)
            //.bounce()
            .on("click", function() {
                //marker7Ma.bounce(10);
                mymap.setView(new L.LatLng(4.693064189881765, -74.03349509991273), 14);
                sidebarMapa.toggle();
                //path7ma.pause();
                //content = 'Auto Norte' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Carrea 7ma</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/carrera7.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasCra7 +
                    "</td>" +
                    "<td>" +
                    MotosCra7 +
                    "</td>" +
                    "<td>" +
                    motosBogota +
                    "</td>" +
                    "<td>" +
                    BicicletasCra7 +
                    "</td>" +
                    "<td>" +
                    MascotasCra7 +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceCra7 +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /* polyline7Ma.setStyle({
                                            color: '#922B21',
                                            weight: 7,
                                            //opacity: 0.7,
                                            smoothFactor: 1
                                        });*/

        ////////////////////////////////////////////
        ///////////FIN 7MA/////////////////////////
        ///////////////////////////////////////////

        ///////////////////////////////////////////
        //////////////AUTOPISTA NORTE//////////////
        ///////////////////////////////////////////

        polylinePointsAutoNorte = [
            [4.668053268735523, -74.06014748996371],
            [4.6701704205171515, -74.0598136869453],
            [4.674790679034276, -74.0591183384355],
            [4.679070302397802, -74.05834452234738],
            [4.679070302397802, -74.05834452234738],
            [4.68292647787406, -74.0576920891533],
            [4.683788443569053, -74.05749484191517],
            [4.685119195538149, -74.05735828613491],
            [4.686903608975595, -74.05697896452308],
            [4.686903608975595, -74.05697896452308],
            [4.694337947257069, -74.0557534539933],
            [4.701785938701553, -74.05454474912764],
            [4.70666881658494, -74.05383025591637],
            [4.70666881658494, -74.05383025591637],
            [4.712579575463108, -74.05305571067144],
            [4.718999362739981, -74.05195504622743],
            [4.718999362739981, -74.05195504622743],
            [4.728830297418366, -74.05011929956034],
            [4.737711666089502, -74.04870464888265],
            [4.737711666089502, -74.04870464888265],
            [4.743075403778688, -74.04769407288069],
            [4.746842599254824, -74.0470535222721],
            [4.7486048125092175, -74.04678286708034],
            [4.751427940676467, -74.04653927740267],
        ];

        antPathAutoNore = L.polyline.antPath;

        pathNorte = antPathAutoNore(polylinePointsAutoNorte, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathNorte.addTo(mymap);

        //polylineAutoNorte = L.polyline(polylinePointsAutoNorte, { className: 'my_polyline7Ma' }).addTo(mymap);

        markerNorte = L.marker([4.701785938701553, -74.05454474912764])
            .addTo(mymap)
            // .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.701785938701553, -74.05454474912764), 14);
                sidebarMapa.toggle();
                //content = 'Auto Norte' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Autopista Norte</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/autoNorte.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasAutoNorte +
                    "</td>" +
                    "<td>" +
                    CarrosAutoNorte +
                    "</td>" +
                    "<td>" +
                    MotosAutoNorte +
                    "</td>" +
                    "<td>" +
                    BicicletasAutoNorte +
                    "</td>" +
                    "<td>" +
                    MascotasAutoNorte +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceAutoNorte +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /*polylineAutoNorte.setStyle({
                                    color: '#922B21',
                                    weight: 7,
                                    //opacity: 0.7,
                                    smoothFactor: 1
                                });*/

        ///////////////////////////////////////////
        //////////////FIN AUTOPISTA NORTE//////////////
        ///////////////////////////////////////////

        ///////////////////////////////////////////
        ////////////CALLE 80 ///////////////////
        ////////////////////////////////////////////

        polylinePointsCalle80 = [
            [4.6667710342530295, -74.06144325978063],
            [4.668978925003193, -74.06315779346603],
            [4.671413645787956, -74.06519095730539],
            [4.674014704615246, -74.06752757843418],
            [4.674014704615246, -74.06752757843418],
            [4.676964053546286, -74.07189029333028],
            [4.679423464874195, -74.07534497831577],
            [4.684064243578597, -74.07899278233772],
            [4.684064243578597, -74.07899278233772],
            [4.688376583789519, -74.08249402363425],
            [4.693273931883658, -74.08622765848345],
            [4.695519429301657, -74.0890171556767],
            [4.695519429301657, -74.0890171556767],
            [4.698857432799128, -74.09530940724632],
            [4.703173347781176, -74.10101120961626],
            [4.703173347781176, -74.10101120961626],
            [4.706715974836702, -74.10835498765066],
            [4.711490206300968, -74.11353969188215],
            [4.711490206300968, -74.11353969188215],
            [4.7160720535087375, -74.1168909880005],
            [4.719258414746192, -74.11929424712085],
            [4.726101557291296, -74.12468012256059],
        ];

        antPathCalle80 = L.polyline.antPath;

        pathCalle80 = antPathCalle80(polylinePointsCalle80, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathCalle80.addTo(mymap);

        //polylineCalle80 = L.polyline(polylinePointsCalle80).addTo(mymap);
        markerCalle80 = L.marker([4.698857432799128, -74.09530940724632])
            .addTo(mymap)
            // .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.698857432799128, -74.09530940724632), 14);
                sidebarMapa.toggle();
                // content = '<h1>Auto Sur</h1>' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 80</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/calle80.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasCalle80 +
                    "</td>" +
                    "<td>" +
                    CarrosCalle80 +
                    "</td>" +
                    "<td>" +
                    MotosCalle80 +
                    "</td>" +
                    "<td>" +
                    BicicletasCalle80 +
                    "</td>" +
                    "<td>" +
                    MascotasCalle80 +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceCalle80 +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /*polylineCalle80.setStyle({
                                    color: '#922B21',
                                    weight: 7,
                                    //opacity: 0.7,
                                    smoothFactor: 1
                                });*/

        ///////////////////////////////////////////
        ////////////FIN CALLE 80 ///////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////BOYACA//////////////////////////
        ////////////////////////////////////////////

        polylinePointsBoyaca = [
            [4.5954384233176135, -74.1451390378603],
            [4.599189187359548, -74.14462316046824],
            [4.607992958342719, -74.14151503746514],
            [4.618586567705614, -74.13940440847355],
            [4.618586567705614, -74.13940440847355],
            [4.623575753996688, -74.13829047590166],
            [4.63051935927946, -74.13767805314913],
            [4.63051935927946, -74.13767805314913],
            [4.636594393936197, -74.13685229292142],
            [4.642349452219984, -74.13374878023903],
            [4.649111585842778, -74.12667565800294],
            [4.649111585842778, -74.12667565800294],
            [4.6569823656133895, -74.11955073047119],
            [4.666082326236434, -74.11189240907811],
            [4.666082326236434, -74.11189240907811],
            [4.670985241397018, -74.10701681399043],
            [4.674663693488021, -74.10384107872426],
            [4.674663693488021, -74.10384107872426],
            [4.679582523796698, -74.1003649355858],
            [4.687238721189497, -74.09497906006335],
            [4.687238721189497, -74.09497906006335],
            [4.690874316395253, -74.09238268165419],
            [4.694189107156004, -74.0906875256675],
            [4.695237005475957, -74.08907820036372],
            [4.695237005475957, -74.08907820036372],
            [4.696888661688281, -74.08369996737875],
            [4.697626187079516, -74.082449604259],
            [4.698630746271219, -74.08196476957991],
            [4.701288370618655, -74.08128855272564],
            [4.701288370618655, -74.08128855272564],
            [4.702862838796408, -74.08093345798295],
            [4.70507291582481, -74.0816171283733],
            [4.706068758570802, -74.08180119344573],
            [4.707090806168116, -74.08144182824056],
            [4.709816259127217, -74.08003066236506],
            [4.709816259127217, -74.08003066236506],
            [4.711501780460111, -74.07886713755514],
            [4.7148631421360925, -74.07682261047016],
            [4.715994351403252, -74.07605608249622],
            [4.719358586256332, -74.0751716271417],
            [4.722399605587236, -74.07405131692866],
            [4.726081960957103, -74.0710605939208],
            [4.726081960957103, -74.0710605939208],
            [4.729718675119858, -74.06860124858757],
            [4.736916327849774, -74.0662039360009],
            [4.742489639069735, -74.06509214670739],
            [4.742489639069735, -74.06509214670739],
            [4.747123913537714, -74.06478828033245],
            [4.754232472403068, -74.06537244146982],
            [4.757630244126492, -74.06594876460747],
            [4.759028896960854, -74.0662067033035],
            [4.760212244562475, -74.06584163663726],
        ];

        // polylineBoyaca = L.polyline(polylinePointsBoyaca, { className: 'my_polyline7Ma' }).addTo(mymap);

        antPathBoyaca = L.polyline.antPath;

        pathBoyaca = antPathCalle80(polylinePointsBoyaca, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathBoyaca.addTo(mymap);

        markerBoyaca = L.marker([4.674641562585807, -74.1038416828036])
            .addTo(mymap)
            // .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.674641562585807, -74.1038416828036), 14);
                sidebarMapa.toggle();
                //content = 'Américas' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Avenida Boyacá</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/avBoyaca.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasAvBoyaca +
                    "</td>" +
                    "<td>" +
                    CarrosAvBoyaca +
                    "</td>" +
                    "<td>" +
                    MotosAvBoyaca +
                    "</td>" +
                    "<td>" +
                    BicicletasAvBoyaca +
                    "</td>" +
                    "<td>" +
                    MascotasAvBoyaca +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceAvBoyaca +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /*polylineBoyaca.setStyle({
                                     color: '#922B21',
                                     weight: 7,
                                     //opacity: 0.7,
                                     smoothFactor: 1
                                 });*/

        /////////////////////////////////////////////
        ////////////FIN BOYACA//////////////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////CALLE 26//////////////////////////
        ////////////////////////////////////////////

        polylinePointsCalle26 = [
            [4.611714721350147, -74.06984279877713],
            [4.611933603155686, -74.06996257666039],
            [4.612072891542268, -74.07050656788013],
            [4.61240121405971, -74.07093577196176],
            [4.614256730910411, -74.07183410608074],
            [4.62149038756754, -74.07671069113424],
            [4.627272996379458, -74.08104281159295],
            [4.627272996379458, -74.08104281159295],
            [4.629192105171596, -74.08238551554619],
            [4.630227411600797, -74.08296819842005],
            [4.632171763482662, -74.08448824069968],
            [4.635100906872885, -74.09110042461614],
            [4.63568168394574, -74.09180977759164],
            [4.653868181380869, -74.10358916153443],
            [4.653868181380869, -74.10358916153443],
            [4.6668112855756565, -74.11172499236258],
            [4.679286340819578, -74.11923499007025],
            [4.679286340819578, -74.11923499007025],
            [4.67876655127508, -74.11949575388857],
            [4.67876655127508, -74.11949575388857],
            [4.682820899627214, -74.12179047536664],
            [4.68552378526401, -74.12554547426696],
        ];

        antPathCalle26 = L.polyline.antPath;

        pathCalle26 = antPathCalle26(polylinePointsCalle26, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathCalle26.addTo(mymap);

        //polylineCalle26 = L.polyline(polylinePointsCalle26, { className: 'my_polyline7Ma' }).bindPopup('Sur').openPopup().addTo(mymap);

        markerCalle26 = L.marker([4.632171763482662, -74.08448824069968])
            .addTo(mymap)
            //.bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.632171763482662, -74.08448824069968), 14);
                sidebarMapa.toggle();
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 26</h2></h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/calle26.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasCalle26 +
                    "</td>" +
                    "<td>" +
                    CarrosCalle26 +
                    "</td>" +
                    "<td>" +
                    MotosCalle26 +
                    "</td>" +
                    "<td>" +
                    BicicletasCalle26 +
                    "</td>" +
                    "<td>" +
                    MascotasCalle26 +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceCalle26 +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /////////////////////////////////////////////
        ////////////FIN CALLE 26//////////////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////CALLE 100//////////////////////////
        ////////////////////////////////////////////

        polylinePointsCalle100 = [
            [4.6798498316361865, -74.03825840484916],
            [4.682743314006706, -74.0433537721709],
            [4.682743314006706, -74.0433537721709],
            [4.683934920451122, -74.04578387633464],
            [4.683934920451122, -74.04578387633464],
            [4.685207812800805, -74.04855505638866],
            [4.685207812800805, -74.04855505638866],
            [4.685674926275072, -74.05037910709181],
            [4.686110477718551, -74.05284284228672],
            [4.686179913445833, -74.05367253199111],
            [4.686596527574687, -74.05573092257812],
            [4.686729086563598, -74.05587659329659],
            [4.687025766114359, -74.05716862923428],
            [4.687025766114359, -74.05716862923428],
            [4.687290883932121, -74.05836566248462],
            [4.688092549018114, -74.06115240666395],
            [4.6891593302920125, -74.06508551602695],
        ];

        antPathCalle100 = L.polyline.antPath;

        pathCalle100 = antPathCalle100(polylinePointsCalle100, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#2874A6",
            pulseColor: "#FFFFFF",
        });
        pathCalle100.addTo(mymap);

        //polylineCalle100 = L.polyline(polylinePointsCalle100, { className: 'my_polylineBlue' }).addTo(mymap);

        markerCalle100 = L.marker([4.686179913445833, -74.05367253199111])
            .addTo(mymap)
            // .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.686179913445833, -74.05367253199111), 14);
                sidebarMapa.toggle();
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 100</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/calle100.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasCalle100 +
                    "</td>" +
                    "<td>" +
                    CarrosCalle100 +
                    "</td>" +
                    "<td>" +
                    MotosCalle100 +
                    "</td>" +
                    "<td>" +
                    BicicletasCalle100 +
                    "</td>" +
                    "<td>" +
                    MascotasCalle100 +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceCalle100 +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /////////////////////////////////////////////
        ////////////FIN CALLE 100//////////////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////NQS//////////////////////////
        ////////////////////////////////////////////

        polylinePointsNqs = [
            [4.593462064707526, -74.12432585002071],
            [4.594828859186531, -74.11669283585645],
            [4.598108166273489, -74.10881289973422],
            [4.598016651554195, -74.10773412978192],
            [4.602226316470704, -74.10169760855943],
            [4.606550348534154, -74.09793339000245],
            [4.606550348534154, -74.09793339000245],
            [4.626890696657232, -74.08131615823105],
            [4.626890696657232, -74.08131615823105],
            [4.629591080918556, -74.07998305117032],
            [4.6425784979279285, -74.07899397146346],
            [4.6425784979279285, -74.07899397146346],
            [4.6579230591391285, -74.0774028432617],
            [4.664137939677794, -74.07559669771004],
            [4.66760967659221, -74.07314550017566],
            [4.66760967659221, -74.07314550017566],
            [4.6728815407855215, -74.06828610892035],
            [4.675967491531949, -74.06351272424811],
        ];

        antPathNqs = L.polyline.antPath;

        pathNqs = antPathNqs(polylinePointsNqs, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathNqs.addTo(mymap);

        //polylinePointsNqs = L.polyline(polylinePointsNqs).addTo(mymap);

        markerNQS = L.marker([4.6425784979279285, -74.07899397146346])
            .addTo(mymap)
            //  .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.6425784979279285, -74.07899397146346), 14);
                sidebarMapa.toggle();
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>NQS</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/nqs.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasNQS +
                    "</td>" +
                    "<td>" +
                    CarrosNQS +
                    "</td>" +
                    "<td>" +
                    MotosNQS +
                    "</td>" +
                    "<td>" +
                    BicicletasNQS +
                    "</td>" +
                    "<td>" +
                    MascotasNQS +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceNQS +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /* polylinePointsNqs.setStyle({
                                     color: '#922B21',
                                     weight: 7,
                                     // opacity: 0.7,
                                     smoothFactor: 1
                                 });*/

        /////////////////////////////////////////////
        ////////////FIN NQS//////////////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////CARRERA 15//////////////////////////
        ////////////////////////////////////////////

        polylinePointSCra15 = [
            [4.659362663399369, -74.06152660925342],
            [4.661798715040358, -74.0598321144929],
            [4.665886041306087, -74.05743476620279],
            [4.6699847277159, -74.05533125872593],
            [4.6699847277159, -74.05533125872593],
            [4.6778494064787255, -74.05138215982744],
            [4.6778494064787255, -74.05138215982744],
            [4.681060194959816, -74.04973907042903],
            [4.683453649012631, -74.04851553111737],
            [4.684134147820858, -74.04834104317594],
            [4.684474396976653, -74.0479768944286],
            [4.684655863125366, -74.04774171502928],
            [4.684655863125366, -74.04774171502928],
            [4.685093222469991, -74.0476643180995],
            [4.685307845592236, -74.04781892309768],
            [4.686072783919306, -74.0478410095112],
            [4.687613604328152, -74.04740081294725],
            [4.689781837347455, -74.04630753471199],
            [4.694988179502177, -74.04340520880484],
            [4.6961988560471495, -74.04311808520865],
            [4.6961988560471495, -74.04311808520865],
            [4.69993094405956, -74.04290770339533],
            [4.703983488348751, -74.04270385550814],
        ];

        antPathCra15 = L.polyline.antPath;

        pathCra15 = antPathCra15(polylinePointSCra15, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#2874A6",
            pulseColor: "#FFFFFF",
        });
        pathCra15.addTo(mymap);

        //polylinePointsCra15 = L.polyline(polylinePointSCra15, { className: 'my_polylineBlue' }).addTo(mymap);

        markerCra15 = L.marker([4.687613604328152, -74.04740081294725])
            .addTo(mymap)
            //  .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.687613604328152, -74.04740081294725), 14);
                sidebarMapa.toggle();
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Carrera 15</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/carrera15.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasCra15 +
                    "</td>" +
                    "<td>" +
                    CarrosCra15 +
                    "</td>" +
                    "<td>" +
                    MotosCra15 +
                    "</td>" +
                    "<td>" +
                    BicicletasCra15 +
                    "</td>" +
                    "<td>" +
                    MascotasCra15 +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceCra15 +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /* polylinePointsCra15.setStyle({
                                     color: '#2874A6',
                                     weight: 7,
                                     //opacity: 0.7,
                                     smoothFactor: 1
                                 });*/

        /////////////////////////////////////////////
        ////////////FIN CARRERA 15//////////////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////CALLE 68//////////////////////////
        ////////////////////////////////////////////

        polylinePointsCalle68 = [
            [4.595098910237614, -74.13796603283501],
            [4.60929199524421, -74.12872521583304],
            [4.6290513637505155, -74.12247274062042],
            [4.6290513637505155, -74.12247274062042],
            [4.636194188840821, -74.11942434758436],
            [4.637267448928066, -74.11846720611553],
            [4.637267448928066, -74.11846720611553],
            [4.64785089866294, -74.10784891802784],
            [4.653723899455334, -74.10333240676266],
            [4.653723899455334, -74.10333240676266],
            [4.665946738806431, -74.09352170679382],
            [4.665946738806431, -74.09352170679382],
            [4.672475436675965, -74.08882573153758],
            [4.6774539004065385, -74.08607394981469],
            [4.679182939411441, -74.08496725499134],
            [4.683863247784658, -74.0791645848738],
            [4.683863247784658, -74.0791645848738],
            [4.689199357368296, -74.07207575597019],
            [4.689615202079117, -74.06848309497659],
        ];

        antPathCall68 = L.polyline.antPath;

        pathCalle68 = antPathCall68(polylinePointsCalle68, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathCalle68.addTo(mymap);

        // polylinePointsCalle68 = L.polyline(polylinePointsCalle68, { className: 'my_polyline7Ma' }).addTo(mymap);

        markerCalle68 = L.marker([4.665946738806431, -74.09352170679382])
            .addTo(mymap)
            // .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.665946738806431, -74.09352170679382), 14);
                sidebarMapa.toggle();
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 68</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/calle68.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasCalle68 +
                    "</td>" +
                    "<td>" +
                    CarrosCalle68 +
                    "</td>" +
                    "<td>" +
                    MotosCalle68 +
                    "</td>" +
                    "<td>" +
                    BicicletasCalle68 +
                    "</td>" +
                    "<td>" +
                    MascotasCalle68 +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceCalle68 +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /*polylinePointsCalle68.setStyle({
                                    color: '#922B21',
                                    weight: 7,
                                    // opacity: 0.7,
                                    smoothFactor: 1
                                });*/

        /////////////////////////////////////////////
        ////////////FIN CALLE 68//////////////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////AV CALI//////////////////////////
        ////////////////////////////////////////////

        polylinePointsAvCali = [
            [4.640895432971052, -74.1560518018917],
            [4.656155390441956, -74.13979860633766],
            [4.659138809732586, -74.13595680664318],
            [4.659138809732586, -74.13595680664318],
            [4.67866316110416, -74.12005001497562],
            [4.67866316110416, -74.12005001497562],
            [4.68377844768857, -74.11456594259045],
            [4.68377844768857, -74.11456594259045],
            [4.689883942789022, -74.10915422023297],
            [4.695782057898985, -74.10584016573326],
            [4.695782057898985, -74.10584016573326],
            [4.702960839464267, -74.10103816846734],
            [4.702960839464267, -74.10103816846734],
            [4.710105844378054, -74.09457914395375],
            [4.711521355469079, -74.0934631868263],
            [4.71394793920488, -74.09349700370895],
            [4.715835276251866, -74.0926515816427],
            [4.717048561645442, -74.09278684917331],
            [4.722811638554449, -74.09796083218549],
            [4.727024383594626, -74.09998984514449],
            [4.73588791571666, -74.10012511267604],
            [4.74158343348707, -74.09846808543747],
            [4.746503783663763, -74.09650670624376],
        ];

        antPathCali = L.polyline.antPath;

        pathCali = antPathCali(polylinePointsAvCali, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathCali.addTo(mymap);

        //polylinePointsAvCali = L.polyline(polylinePointsAvCali).addTo(mymap);

        markerAvCali = L.marker([4.695782057898985, -74.10584016573326])
            .addTo(mymap)
            // .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.695782057898985, -74.10584016573326), 14);
                sidebarMapa.toggle();
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Av Ciudad de Cali</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/avCali.jpg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasAvCali +
                    "</td>" +
                    "<td>" +
                    CarrosAvCali +
                    "</td>" +
                    "<td>" +
                    MotosAvCali +
                    "</td>" +
                    "<td>" +
                    BicicletasAvCali +
                    "</td>" +
                    "<td>" +
                    MascotasAvCali +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceAvCali +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });

        /*polylinePointsAvCali.setStyle({
                                    color: '#922B21',
                                    weight: 7,
                                    // opacity: 0.7,
                                    smoothFactor: 1
                                });*/

        /////////////////////////////////////////////
        ////////////FIN AV CALI//////////////////////////
        ////////////////////////////////////////////

        /////////////////////////////////////////////
        ////////////AV SUBA//////////////////////////
        ////////////////////////////////////////////

        polylinePointsAvSuba = [
            [4.745589874126129, -74.09529414577177],
            [4.741917311243669, -74.09074369576561],
            [4.741166323026945, -74.08943561692337],
            [4.738091513702233, -74.08646400303176],
            [4.738091513702233, -74.08646400303176],
            [4.736929600509619, -74.08263929431048],
            [4.735739346066315, -74.0815587074408],
            [4.734464071175423, -74.079724553412],
            [4.7338406025953494, -74.07830272858348],
            [4.732820379968073, -74.07699464982264],
            [4.7326420247388885, -74.07581399382671],
            [4.732103573216848, -74.07508886316418],
            [4.727640077371133, -74.07484715294332],
            [4.720998973416764, -74.07479412537367],
            [4.720998973416764, -74.07479412537367],
            [4.710940066461966, -74.07219371312394],
            [4.710940066461966, -74.07219371312394],
            [4.700013130475883, -74.07023352891004],
            [4.700013130475883, -74.07023352891004],
            [4.695333023608183, -74.06852713809789],
            [4.691272511072446, -74.06609321632628],
            [4.688939023981756, -74.06525986268196],
        ];

        antPathSuba = L.polyline.antPath;

        pathSuba = antPathSuba(polylinePointsAvSuba, {
            paused: false,
            reverse: false,
            delay: 3000,
            dashArray: [10, 20],
            weight: 7,
            opacity: 0.9,
            color: "#922B21",
            pulseColor: "#FFFFFF",
        });
        pathSuba.addTo(mymap);

        //polylinePointsAvSuba = L.polyline(polylinePointsAvSuba).addTo(mymap);

        markerAvSuba = L.marker([4.7326420247388885, -74.07581399382671])
            .addTo(mymap)
            // .bounce()
            .on("click", function() {
                mymap.setView(new L.LatLng(4.7326420247388885, -74.07581399382671), 14);
                sidebarMapa.toggle();
                content =
                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Avenida Suba</h2></div>' +
                    '<img style="width: 100%; height: 35%;" src="views/dist/images/avenidaSuba.jpeg"></img>' +
                    "<br><br>" +
                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                    "</tr>" +
                    '<tr style="font-size:15px; font-weight:bold">' +
                    "<td>" +
                    personasAvSuba +
                    "</td>" +
                    "<td>" +
                    CarrosAvSuba +
                    "</td>" +
                    "<td>" +
                    MotosAvSuba +
                    "</td>" +
                    "<td>" +
                    BicicletasAvSuba +
                    "</td>" +
                    "<td>" +
                    MascotasAvSuba +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                    totalAlcanceAvSuba +
                    "</h3></div>";
                sidebarMapa.setContent(content);
            });
    } else {
        if (ciudad == 2) {
            personasMedellin = [];
            carrosMedellin = [];
            motosMedellin = [];
            bicicletasMedellin = [];
            mascotasMedellin = [];
            ciudad = [];
            lat = [];
            lon = [];
            alcanceCiudad = [];

            personasMedellin.push(datos.personasMedellin);
            carrosMedellin.push(datos.carrosMedellin);
            motosMedellin.push(datos.motosMedellin);
            bicicletasMedellin.push(datos.bicicletasMedellin);
            mascotasMedellin.push(datos.mascotasMedellin);
            ciudad.push(datos.ciudad);
            lat.push(datos.lat);
            lon.push(datos.lon);
            alcanceCiudad.push(datos.totalAlcanceCiudad);

            marker.setLatLng([lat[0], lon[0]]).update();
            mymap.setView(new L.LatLng(lat[0], lon[0]), 12);
            // marker = L.marker([lat[0], lon[0]]).addTo(mymap);
            marker
                .bindPopup(
                    ciudad[0] +
                    " <br>" +
                    "Alcance: " +
                    alcanceCiudad[0] +
                    "<br>" +
                    "Personas: " +
                    personasMedellin +
                    "<br>" +
                    "Carros: " +
                    carrosMedellin +
                    "<br>" +
                    "Motos: " +
                    motosMedellin +
                    "<br>" +
                    "Bicicletas: " +
                    bicicletasMedellin +
                    "<br>" +
                    "Mascotas: " +
                    mascotasMedellin
                )
                .openPopup();
        } else {
            if (ciudad == 3) {
                personasCali = [];
                carrosCali = [];
                motosCali = [];
                bicicletasCali = [];
                mascotasCali = [];
                ciudad = [];
                lat = [];
                lon = [];
                alcanceCiudad = [];

                personasCali.push(datos.personasCali);
                carrosCali.push(datos.carrosCali);
                motosCali.push(datos.motosCali);
                bicicletasCali.push(datos.bicicletasCali);
                mascotasCali.push(datos.mascotasCali);
                ciudad.push(datos.ciudad);
                lat.push(datos.lat);
                lon.push(datos.lon);
                alcanceCiudad.push(datos.totalAlcanceCiudad);

                marker.setLatLng([lat[0], lon[0]]).update();
                mymap.setView(new L.LatLng(lat[0], lon[0]), 12);
                // marker = L.marker([lat[0], lon[0]]).addTo(mymap);
                marker
                    .bindPopup(
                        ciudad[0] +
                        " <br>" +
                        "Alcance: " +
                        alcanceCiudad[0] +
                        "<br>" +
                        "Personas: " +
                        personasCali +
                        "<br>" +
                        "Carros: " +
                        carrosCali +
                        "<br>" +
                        "Motos: " +
                        motosCali +
                        "<br>" +
                        "Bicicletas: " +
                        bicicletasCali +
                        "<br>" +
                        "Mascotas: " +
                        mascotasCali
                    )
                    .openPopup();
            }
        }
    }
}

$("#idCiudades").on("change", function() {
    ciudades = $.trim($("#idCiudades").val());
    mesViaCiudad = $.trim($("#idMesViaCiudades").val());

    if (mesViaCiudad == 13) {
        Swal.fire({
            //title: "!",
            text: "¡Por favor seleccionar un mes!",
            type: "info",
        }).then(function() {
            window.location = "ciudadesVias";
        });
    } else {
        if (ciudades == 1) {
            $.ajax({
                data: { ciudades: ciudades, mesViaCiudad: mesViaCiudad },
                url: "models/metricas.php",
                type: "post",
                dataType: "json",
                beforeSend: function() {},
                success: function(json) {
                    $("#totalPersonasCiudad").text(json.personasBogota);
                    $("#totalCarrosCiudad").text(json.carrosBogota);
                    $("#totalMotosCiudad").text(json.motosBogota);
                    $("#totalBicicletasCiudad").text(json.bicicletasBogota);
                    $("#totalMascotasCiudad").text(json.mascotasBogota);
                    $("#alcanceTotalCiudad").text(json.totalAlcanceCiudad);
                    $("#jornadaMananaCiudadVias").text(json.mananaCiudadVias);
                    $("#jornadaTardeCiudadVias").text(json.tardeCiudadVias);
                    $("#jornadaNocheCiudadVias").text(json.nocheCiudadVias);

                    personasBogotaInicial = json.personasBogota;
                    carrosBogotaInicial = json.carrosBogota;
                    motosBogotaInicial = json.motosBogota;
                    bicicletasBogotaInicial = json.bicicletasBogota;
                    mascotasBogotaInicial = json.mascotasBogota;
                    alcanceTotalBogotaInicial = json.totalAlcanceCiudad;

                    mananaCiudadViasInicial = json.mananaCiudadVias;
                    tardeCiudadViasInicial = json.tardeCiudadVias;
                    nocheCiudadViasInicial = json.nocheCiudadVias;

                    $("#alcanceTotalCiudad").text(json.totalAlcanceCiudad);
                    $("#jornadaMananaCiudadVias").text(mananaCiudadViasInicial);
                    $("#jornadaTardeCiudadVias").text(tardeCiudadViasInicial);
                    $("#jornadaNocheCiudadVias").text(nocheCiudadViasInicial);

                    cargarMapa(json, ciudades);
                    cargarVias(ciudades);
                    cargarGraficoCiudadVias(mesViaCiudad, ciudades);
                },
                error: function() {
                    alert("error");
                },
            });
        } else {
            if (ciudades == 2) {
                $.ajax({
                    data: { ciudades: ciudades, mesViaCiudad: mesViaCiudad },
                    url: "models/metricas.php",
                    type: "post",
                    dataType: "json",
                    beforeSend: function() {},
                    success: function(json) {
                        $("#totalPersonasCiudad").text(json.personasMedellin);
                        $("#totalCarrosCiudad").text(json.carrosMedellin);
                        $("#totalMotosCiudad").text(json.motosMedellin);
                        $("#totalBicicletasCiudad").text(json.bicicletasMedellin);
                        $("#totalMascotasCiudad").text(json.mascotasMedellin);
                        $("#alcanceTotalCiudad").text(json.totalAlcanceCiudad);
                        cargarMapa(json, ciudades);
                        cargarVias(ciudades);
                    },
                    error: function() {
                        alert("error");
                    },
                });
            } else {
                if (ciudades == 3) {
                    $.ajax({
                        data: { ciudades: ciudades, mesViaCiudad: mesViaCiudad },
                        url: "models/metricas.php",
                        type: "post",
                        dataType: "json",
                        beforeSend: function() {},
                        success: function(json) {
                            $("#totalPersonasCiudad").text(json.personasCali);
                            $("#totalCarrosCiudad").text(json.carrosCali);
                            $("#totalMotosCiudad").text(json.motosCali);
                            $("#totalBicicletasCiudad").text(json.bicicletasCali);
                            $("#totalMascotasCiudad").text(json.mascotasCali);
                            $("#alcanceTotalCiudad").text(json.totalAlcanceCiudad);

                            cargarMapa(json, ciudades);
                            cargarVias(ciudades);
                        },
                        error: function() {
                            alert("error");
                        },
                    });
                }
            }
        }
    }
});

function cargarGrafico(datos) {
    personasBogota = [];
    carrosBogota = [];
    motosBogota = [];
    bicicletasBogota = [];
    mascotasBogota = [];

    personasMedellin = [];
    carrosMedellin = [];
    motosMedellin = [];
    bicicletasMedellin = [];
    mascotasMedellin = [];

    personasCali = [];
    carrosCali = [];
    motosCali = [];
    bicicletasCali = [];
    mascotasCali = [];

    personasBogota.push(datos.personasBogota);
    carrosBogota.push(datos.carrosBogota);
    motosBogota.push(datos.motosBogota);
    bicicletasBogota.push(datos.bicicletasBogota);
    mascotasBogota.push(datos.mascotasBogota);

    personasMedellin.push(datos.personasMedellin);
    carrosMedellin.push(datos.carrosMedellin);
    motosMedellin.push(datos.motosMedellin);
    bicicletasMedellin.push(datos.bicicletasMedellin);
    mascotasMedellin.push(datos.mascotasMedellin);

    personasCali.push(datos.personasCali);
    carrosCali.push(datos.carrosCali);
    motosCali.push(datos.motosCali);
    bicicletasCali.push(datos.bicicletasCali);
    mascotasCali.push(datos.mascotasCali);

    chartdata = {
        labels: [
            "Bogotá",
            "Medellín",
            "Cali",
            "Barranquilla",
            "Bucaramanga",
            "Cartagena",
            "Armenia",
            "Pereira",
            "Manizales",
            "Cundinamarca",
            "Ibague",
            "Tunja",
            "Santa Marta",
            "Cucuta",
            "Pasto",
        ],
        datasets: [{
                label: "Personas",
                backgroundColor: "#c8b6e8",
                borderColor: "#3E50F6",
                hoverBackgroundColor: "#ff0000",
                hoverBorderColor: "#c8b6e8",
                data: [personasBogota, personasMedellin, personasCali],
            },

            {
                label: "Carros",
                backgroundColor: "#91e1fb",
                borderColor: "#3E50F6",
                hoverBackgroundColor: "#ff0000",
                hoverBorderColor: "#91e1fb",
                data: [carrosBogota, carrosMedellin, carrosCali],
            },

            {
                label: "Motos",
                backgroundColor: "#DF8035",
                borderColor: "#3E50F6",
                hoverBackgroundColor: "#ff0000",
                hoverBorderColor: "#feff8f",
                data: [motosBogota, motosMedellin, motosCali],
            },

            {
                label: "Bicicletas",
                backgroundColor: "#ffd700",
                borderColor: "#3E50F6",
                hoverBackgroundColor: "#ff0000",
                hoverBorderColor: "#69abc0",
                data: [bicicletasBogota, bicicletasMedellin, bicicletasMedellin],
            },

            {
                label: "Mascotas",
                backgroundColor: "#54A30F",
                borderColor: "#3E50F6",
                hoverBackgroundColor: "#ff0000",
                hoverBorderColor: "#89fb89",
                data: [mascotasBogota, mascotasMedellin, mascotasCali],
            },
        ],
    };

    graphTarget = $("#barChartCiudades");

    barGraph = new Chart(graphTarget, {
        type: "bar",
        data: chartdata,
    });
}

function cargarGraficoCiudadVias(idMesViaGrafico, IdCiudadViaGrafico) {
    $.ajax({
        data: {
            idMesViaGrafico: idMesViaGrafico,
            IdCiudadViaGrafico: IdCiudadViaGrafico,
        },
        url: "models/metricas.php",
        type: "post",
        dataType: "json",
        beforeSend: function() {},
        success: function(json) {
            personasAutonorteGrafico = json.totalpersonasAutonorteGrafico;
            CarrosAutonorteGrafico = json.totalCarrosAutonorteGrafico;
            MotosAutonorteGrafico = json.totalMotosAutonorteGrafico;
            BicicletasAutonorteGrafico = json.totalBicicletasAutonorteGrafico;
            MascotasAutonorteGrafico = json.totalMascotasAutonorteGrafico;

            personasCra7Grafico = json.totalpersonasCra7Grafico;
            CarrosCra7Grafico = json.totalCarrosCra7Grafico;
            MotosCra7Grafico = json.totalMotosCra7Grafico;
            BicicletasCra7Grafico = json.totalBicicletasCra7Grafico;
            MascotasCra7Grafico = json.totalMascotasCra7Grafico;

            personasAvCaliGrafico = json.totalPersonasAvCaliGrafico;
            CarrosAvCaliGrafico = json.totalCarrosAvCaliGrafico;
            MotosAvCaliGrafico = json.totalMotosAvCaliGrafico;
            BicicletasAvCaliGrafico = json.totalBicicletasAvCaliGrafico;
            MascotasAvCaliGrafico = json.totalMascotasAvCaliGrafico;

            personasCalle68Grafico = json.totalPersonasCalle68Grafico;
            CarrosCalle68Grafico = json.totalCarrosCalle68Grafico;
            MotosCalle68Grafico = json.totalMotosCalle68Grafico;
            BicicletasCalle68Grafico = json.totalBicicletasCalle68Grafico;
            MascotasCalle68Grafico = json.totalMascotasCalle68Grafico;

            personasNQSGrafico = json.totalPersonasNQSGrafico;
            CarrosNQSGrafico = json.totalCarrosNQSGrafico;
            MotosNQSGrafico = json.totalMotosNQSGrafico;
            BicicletasNQSGrafico = json.totalBicicletasNQSGrafico;
            MascotasNQSGrafico = json.totalMascotasNQSGrafico;

            personasCalle80Grafico = json.totalPersonasCalle80Grafico;
            CarrosCalle80Grafico = json.totalCarrosCalle80Grafico;
            MotosCalle80Grafico = json.totalMotosCalle80Grafico;
            BicicletasCalle80Grafico = json.totalBicicletasCalle80Grafico;
            MascotasCalle80Grafico = json.totalMascotasCalle80Grafico;

            personasAvBoyacaGrafico = json.totalPersonasAvBoyacaGrafico;
            CarrosAvBoyacaGrafico = json.totalCarrosAvBoyacaGrafico;
            MotosAvBoyacaGrafico = json.totalMotosAvBoyacaGrafico;
            BicicletasAvBoyacaGrafico = json.totalBicicletasAvBoyacaGrafico;
            MascotasAvBoyacaGrafico = json.totalMascotasAvBoyacaGrafico;

            personasCalle100Grafico = json.totalPersonasCalle100Grafico;
            CarrosCalle100Grafico = json.totalCarrosCalle100Grafico;
            MotosCalle100Grafico = json.totalMotosCalle100Grafico;
            BicicletasCalle100Grafico = json.totalBicicletasCalle100Grafico;
            MascotasCalle100Grafico = json.totalMascotasCalle100Grafico;

            personasCra15Grafico = json.totalPersonasCra15Grafico;
            CarrosCra15Grafico = json.totalCarrosCra15Grafico;
            MotosCra15Grafico = json.totalMotosCra15Grafico;
            BicicletasCra15Grafico = json.totalBicicletasCra15Grafico;
            MascotasCra15Grafico = json.totalMascotasCra15Grafico;

            personasAvSubaGrafico = json.totalPersonasAvSubaGrafico;
            CarrosAvSubaGrafico = json.totalCarrosAvSubaGrafico;
            MotosAvSubaGrafico = json.totalMotosAvSubaGrafico;
            BicicletasAvSubaGrafico = json.totalBicicletasAvSubaGrafico;
            MascotasAvSubaGrafico = json.totalMascotasAvSubaGrafico;

            personasCalle26Grafico = json.totalPersonasCalle26Grafico;
            CarrosCalle26Grafico = json.totalCarrosCalle26Grafico;
            MotosCalle26Grafico = json.totalMotosCalle26Grafico;
            BicicletasCalle26Grafico = json.totalBicicletasCalle26Grafico;
            MascotasCalle26Grafico = json.totalMascotasCalle26Grafico;

            chartdata = {
                labels: [
                    "AutoNorte",
                    "AvCali",
                    "AvCra68",
                    "Cra7Ma",
                    "NQS",
                    "Cll80",
                    "AvBoyacá",
                    "Cll100",
                    "Cra15",
                    "AvSuba",
                    "Calle26",
                ],
                datasets: [{
                        label: "Personas",
                        backgroundColor: "#c8b6e8",
                        borderColor: "#3E50F6",
                        hoverBackgroundColor: "#ff0000",
                        hoverBorderColor: "#c8b6e8",
                        data: [
                            personasAutonorteGrafico,
                            personasAvCaliGrafico,
                            personasCalle68Grafico,
                            personasCra7Grafico,
                            personasNQSGrafico,
                            personasCalle80Grafico,
                            personasAvBoyacaGrafico,
                            personasCalle100Grafico,
                            personasCra15Grafico,
                            personasAvSubaGrafico,
                            personasCalle26Grafico,
                        ],
                    },

                    {
                        label: "Carros",
                        backgroundColor: "#91e1fb",
                        borderColor: "#3E50F6",
                        hoverBackgroundColor: "#ff0000",
                        hoverBorderColor: "#91e1fb",
                        data: [
                            CarrosAutonorteGrafico,
                            CarrosAvCaliGrafico,
                            CarrosCalle68Grafico,
                            CarrosCra7Grafico,
                            CarrosNQSGrafico,
                            CarrosCalle80Grafico,
                            CarrosAvBoyacaGrafico,
                            CarrosCalle100Grafico,
                            CarrosCra15Grafico,
                            CarrosAvSubaGrafico,
                            CarrosCalle26Grafico,
                        ],
                    },

                    {
                        label: "Motos",
                        backgroundColor: "#DF8035",
                        borderColor: "#3E50F6",
                        hoverBackgroundColor: "#ff0000",
                        hoverBorderColor: "#feff8f",
                        data: [
                            MotosAutonorteGrafico,
                            MotosAvCaliGrafico,
                            MotosCalle68Grafico,
                            MotosCra7Grafico,
                            MotosNQSGrafico,
                            MotosCalle80Grafico,
                            MotosAvBoyacaGrafico,
                            MotosCalle100Grafico,
                            MotosCra15Grafico,
                            MotosAvSubaGrafico,
                            MotosCalle26Grafico,
                        ],
                    },

                    {
                        label: "Bicicletas",
                        backgroundColor: "#ffd700",
                        borderColor: "#3E50F6",
                        hoverBackgroundColor: "#ff0000",
                        hoverBorderColor: "#69abc0",
                        data: [
                            BicicletasCra7Grafico,
                            BicicletasAvCaliGrafico,
                            BicicletasCalle68Grafico,
                            BicicletasCra7Grafico,
                            BicicletasNQSGrafico,
                            BicicletasCalle80Grafico,
                            BicicletasAvBoyacaGrafico,
                            BicicletasCalle100Grafico,
                            BicicletasCra15Grafico,
                            BicicletasAvSubaGrafico,
                            BicicletasCalle26Grafico,
                        ],
                    },

                    {
                        label: "Mascotas",
                        backgroundColor: "#54A30F",
                        borderColor: "#3E50F6",
                        hoverBackgroundColor: "#ff0000",
                        hoverBorderColor: "#89fb89",
                        data: [
                            MascotasAutonorteGrafico,
                            MascotasAvCaliGrafico,
                            MascotasCalle68Grafico,
                            MascotasCra7Grafico,
                            MascotasNQSGrafico,
                            MascotasCalle80Grafico,
                            MascotasAvBoyacaGrafico,
                            MascotasCalle100Grafico,
                            MascotasCra15Grafico,
                            MascotasAvSubaGrafico,
                            MascotasCalle26Grafico,
                        ],
                    },
                ],
            };

            graphTarget = $("#barChartVias");

            barGraph = new Chart(graphTarget, {
                type: "bar",
                data: chartdata,
            });
        },
        error: function() {
            alert("error");
        },
    });

    //personasBogota = [];
    //carrosBogota = [];

    // personasBogota.push(datos.personasBogota);
    // carrosBogota.push(datos.carrosBogota);
}

function cargarJornadas(idMes) {
    $.ajax({
        data: { idMes: idMes },
        url: "models/metricas.php",
        type: "post",
        dataType: "json",
        beforeSend: function() {},
        success: function(json) {
            $("#jornadaManana").text(json.manana);
            $("#jornadaTarde").text(json.tarde);
            $("#jornadaNoche").text(json.noche);
        },
        error: function() {
            alert("error");
        },
    });
}

function cargarVias(idCiudad) {
    $.ajax({
        data: { idCiudad: idCiudad },
        url: "models/metricas.php",
        type: "post",
        beforeSend: function() {},
        success: function(response) {
            $("#idVias").html(response);
        },
        error: function() {
            alert("error");
        },
    });
}

////////////////CARGAR DATOS POR VIA////////////////////

$("#idVias").on("change", function() {
    idCiudadViaFiltro = $("#idCiudades").val();
    idViaFiltro = $("#idVias").val();
    idMesViaFiltro = $.trim($("#idMesViaCiudades").val());

    idCiudadVia = $("#idCiudades").val();
    idVia = $("#idVias").val();

    if (idCiudadViaFiltro == 17) {
        Swal.fire({
            //title: "!",
            text: "¡Por favor seleccionar una ciudad!",
            type: "info",
        }).then(function() {
            window.location = "ciudadesVias";
        });
    } else {
        if (idViaFiltro == 1) {
            $("#totalPersonasCiudad").text(personasBogotaInicial);
            $("#totalCarrosCiudad").text(carrosBogotaInicial);
            $("#totalMotosCiudad").text(motosBogotaInicial);
            $("#totalBicicletasCiudad").text(bicicletasBogotaInicial);
            $("#totalMascotasCiudad").text(mascotasBogotaInicial);
            $("#alcanceTotalCiudad").text(alcanceTotalBogotaInicial);
            $("#jornadaMananaCiudadVias").text(mananaCiudadViasInicial);
            $("#jornadaTardeCiudadVias").text(tardeCiudadViasInicial);
            $("#jornadaNocheCiudadVias").text(nocheCiudadViasInicial);

            path7ma.addTo(mymap);
            marker7Ma.addTo(mymap);
            pathNorte.addTo(mymap);
            markerNorte.addTo(mymap);
            pathCalle80.addTo(mymap);
            markerCalle80.addTo(mymap);
            pathBoyaca.addTo(mymap);
            markerBoyaca.addTo(mymap);
            pathCalle26.addTo(mymap);
            markerCalle26.addTo(mymap);
            pathCalle100.addTo(mymap);
            markerCalle100.addTo(mymap);
            pathNqs.addTo(mymap);
            markerNQS.addTo(mymap);
            pathCra15.addTo(mymap);
            markerCra15.addTo(mymap);
            pathCalle68.addTo(mymap);
            markerCalle68.addTo(mymap);
            pathCali.addTo(mymap);
            markerAvCali.addTo(mymap);
            pathSuba.addTo(mymap);
            markerAvSuba.addTo(mymap);
            sidebarMapaFiltro.hide();
            markerNorteFiltro.remove(mymap);
            pathNorteFiltro.remove(mymap);
            pathCra7Filtro.remove(mymap);
            markerCra7Filtro.remove(mymap);
            pathAvCaliFiltro.remove(mymap);
            markerAvCaliFiltro.remove(mymap);
            pathCalle68Filtro.remove(mymap);
            markerCalle68Filtro.remove(mymap);
            pathNQSFiltro.remove(mymap);
            markerNQSFiltro.remove(mymap);
            pathCalle80Filtro.remove(mymap);
            markerCalle80Filtro.remove(mymap);
            pathAvBoyacaFiltro.remove(mymap);
            markerAvBoyacaFiltro.remove(mymap);
            pathCalle100Filtro.remove(mymap);
            markerCalle100Filtro.remove(mymap);
            pathCra15Filtro.remove(mymap);
            markerCra15Filtro.remove(mymap);
            pathAvSubaFiltro.remove(mymap);
            markerAvSubaFiltro.remove(mymap);
            pathCalle26Filtro.remove(mymap);
            markerCalle26Filtro.remove(mymap);
        } else {
            if (idViaFiltro == 2) {
                //AUTOPISTA NORTE

                $.ajax({
                    //TABLA VIAS
                    data: { idVia: idVia, idCiudadVia: idCiudadVia },
                    url: "models/metricas.php",
                    type: "post",
                    beforeSend: function() {},
                    success: function(response) {
                        $("#idTramoCiudadVias").html(response);
                        cargartablaVias(idCiudadVia, idVia);
                        cargartablaTramos();
                    },
                    error: function() {
                        alert("error");
                    },
                });

                $.ajax({
                    ///JORNADAS
                    data: {
                        idCiudadViaFiltro: idCiudadViaFiltro,
                        idMesViaFiltro: idMesViaFiltro,
                        idViaFiltro: idViaFiltro,
                    },
                    url: "models/metricas.php",
                    type: "post",
                    dataType: "json",
                    beforeSend: function() {},
                    success: function(data) {
                        mf = data.totalMananaFiltro;
                        tf = data.totalTardeFiltro;
                        nf = data.totalNocheFiltro;

                        $("#jornadaMananaCiudadVias").text(mf);
                        $("#jornadaTardeCiudadVias").text(tf);
                        $("#jornadaNocheCiudadVias").text(nf);
                    },
                    error: function() {
                        alert("error");
                    },
                });

                path7ma.remove(mymap);
                marker7Ma.remove(mymap);
                pathNorte.remove(mymap);
                markerNorte.remove(mymap);
                pathCalle80.remove(mymap);
                markerCalle80.remove(mymap);
                pathBoyaca.remove(mymap);
                markerBoyaca.remove(mymap);
                pathCalle26.remove(mymap);
                markerCalle26.remove(mymap);
                pathCalle100.remove(mymap);
                markerCalle100.remove(mymap);
                pathNqs.remove(mymap);
                markerNQS.remove(mymap);
                pathCra15.remove(mymap);
                markerCra15.remove(mymap);
                pathCalle68.remove(mymap);
                markerCalle68.remove(mymap);
                pathCali.remove(mymap);
                markerAvCali.remove(mymap);
                pathSuba.remove(mymap);
                markerAvSuba.remove(mymap);

                polylinePointsAutoNorteFiltro = [
                    [4.668053268735523, -74.06014748996371],
                    [4.6701704205171515, -74.0598136869453],
                    [4.674790679034276, -74.0591183384355],
                    [4.679070302397802, -74.05834452234738],
                    [4.679070302397802, -74.05834452234738],
                    [4.68292647787406, -74.0576920891533],
                    [4.683788443569053, -74.05749484191517],
                    [4.685119195538149, -74.05735828613491],
                    [4.686903608975595, -74.05697896452308],
                    [4.686903608975595, -74.05697896452308],
                    [4.694337947257069, -74.0557534539933],
                    [4.701785938701553, -74.05454474912764],
                    [4.70666881658494, -74.05383025591637],
                    [4.70666881658494, -74.05383025591637],
                    [4.712579575463108, -74.05305571067144],
                    [4.718999362739981, -74.05195504622743],
                    [4.718999362739981, -74.05195504622743],
                    [4.728830297418366, -74.05011929956034],
                    [4.737711666089502, -74.04870464888265],
                    [4.737711666089502, -74.04870464888265],
                    [4.743075403778688, -74.04769407288069],
                    [4.746842599254824, -74.0470535222721],
                    [4.7486048125092175, -74.04678286708034],
                    [4.751427940676467, -74.04653927740267],
                ];

                antPathAutoNorteFiltro = L.polyline.antPath;

                pathNorteFiltro = antPathAutoNore(polylinePointsAutoNorteFiltro, {
                    paused: false,
                    reverse: false,
                    delay: 3000,
                    dashArray: [10, 20],
                    weight: 7,
                    opacity: 0.9,
                    color: "#922B21",
                    pulseColor: "#FFFFFF",
                });
                pathNorteFiltro.addTo(mymap);

                markerNorteFiltro = L.marker([4.701785938701553, -74.05454474912764])
                    .addTo(mymap)
                    .on("click", function() {
                        mymap.setView(
                            new L.LatLng(4.701785938701553, -74.05454474912764),
                            14
                        );
                        sidebarMapaFiltro.toggle();
                        //content = 'Auto Norte' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                        contentAutonorteFiltro =
                            '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Autopista Norte</h2></div>' +
                            '<img style="width: 100%; height: 35%;" src="views/dist/images/autoNorte.jpg"></img>' +
                            "<br><br>" +
                            '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                            '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                            '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                            "</tr>" +
                            '<tr style="font-size:15px; font-weight:bold">' +
                            "<td>" +
                            personasAutoNorte +
                            "</td>" +
                            "<td>" +
                            CarrosAutoNorte +
                            "</td>" +
                            "<td>" +
                            MotosAutoNorte +
                            "</td>" +
                            "<td>" +
                            BicicletasAutoNorte +
                            "</td>" +
                            "<td>" +
                            MascotasAutoNorte +
                            "</td>" +
                            "</tr>" +
                            "</table>" +
                            '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance vía: ' +
                            totalAlcanceAutoNorte +
                            "</h3></div>";
                        sidebarMapaFiltro.setContent(contentAutonorteFiltro);
                    });

                $("#totalPersonasCiudad").text(personasAutoNorte);
                $("#totalCarrosCiudad").text(CarrosAutoNorte);
                $("#totalMotosCiudad").text(MotosAutoNorte);
                $("#totalBicicletasCiudad").text(BicicletasAutoNorte);
                $("#totalMascotasCiudad").text(MascotasAutoNorte);
                $("#alcanceTotalCiudad").text(totalAlcanceAutoNorte);
            } else {
                if (idViaFiltro == 6) {
                    //CARRERA 7MA

                    $.ajax({
                        //TABLAVIAS
                        data: { idVia: idVia, idCiudadVia: idCiudadVia },
                        url: "models/metricas.php",
                        type: "post",
                        beforeSend: function() {},
                        success: function(response) {
                            $("#idTramoCiudadVias").html(response);
                            cargartablaVias(idCiudadVia, idVia);
                            cargartablaTramos();
                        },
                        error: function() {
                            alert("error");
                        },
                    });

                    ///JORNADAS

                    $.ajax({
                        data: {
                            idCiudadViaFiltro: idCiudadViaFiltro,
                            idMesViaFiltro: idMesViaFiltro,
                            idViaFiltro: idViaFiltro,
                        },
                        url: "models/metricas.php",
                        type: "post",
                        dataType: "json",
                        beforeSend: function() {},
                        success: function(data) {
                            mf = data.totalMananaFiltro;
                            tf = data.totalTardeFiltro;
                            nf = data.totalNocheFiltro;

                            $("#jornadaMananaCiudadVias").text(mf);
                            $("#jornadaTardeCiudadVias").text(tf);
                            $("#jornadaNocheCiudadVias").text(nf);
                        },
                        error: function() {
                            alert("error");
                        },
                    });

                    path7ma.remove(mymap);
                    marker7Ma.remove(mymap);
                    pathNorte.remove(mymap);
                    markerNorte.remove(mymap);
                    pathCalle80.remove(mymap);
                    markerCalle80.remove(mymap);
                    pathBoyaca.remove(mymap);
                    markerBoyaca.remove(mymap);
                    pathCalle26.remove(mymap);
                    markerCalle26.remove(mymap);
                    pathCalle100.remove(mymap);
                    markerCalle100.remove(mymap);
                    pathNqs.remove(mymap);
                    markerNQS.remove(mymap);
                    pathCra15.remove(mymap);
                    markerCra15.remove(mymap);
                    pathCalle68.remove(mymap);
                    markerCalle68.remove(mymap);
                    pathCali.remove(mymap);
                    markerAvCali.remove(mymap);
                    pathSuba.remove(mymap);
                    markerAvSuba.remove(mymap);
                    sidebarMapa.hide();

                    polylinePointsCra7Filtro = [
                        [4.611941627515484, -74.07096472452137],
                        [4.614332512873588, -74.06940815002537],
                        [4.615960345105841, -74.06866813919942],
                        [4.616672520533346, -74.0686936568141],
                        [4.617130347216428, -74.06838744543784],
                        [4.6205894727353645, -74.06736674074526],
                        [4.631452769085992, -74.0641604478664],
                        [4.631452769085992, -74.0641604478664],
                        [4.636326528899698, -74.06356735480865],
                        [4.6450374482481, -74.06123073360057],
                        [4.65075393060103, -74.05798374048248],
                        [4.654515049611189, -74.055431560596],
                        [4.654515049611189, -74.055431560596],
                        [4.660046279628369, -74.05150756857974],
                        [4.665047492882758, -74.0471591974051],
                        [4.673567523298389, -74.04277016751367],
                        [4.675490855947268, -74.04066915239711],
                        [4.677601767037955, -74.04010776487397],
                        [4.6796618066660285, -74.03844911991922],
                        [4.6796618066660285, -74.03844911991922],
                        [4.693064189881765, -74.03349509991273],
                        [4.698145161727039, -74.03052121847608],
                        [4.700292466080045, -74.02885220338409],
                        [4.703821740464256, -74.02879503993773],
                        [4.708013266380848, -74.02858046323057],
                        [4.711563212573654, -74.0292885663376],
                        [4.711563212573654, -74.0292885663376],
                        [4.713916705708483, -74.02911290345261],
                        [4.716002069291862, -74.02880669207634],
                        [4.717655096951934, -74.02867910400292],
                        [4.720579674854302, -74.0267397652049],
                        [4.721673209458137, -74.02628044814051],
                        [4.723682256911624, -74.02612734245238],
                        [4.725818452881842, -74.02492801456202],
                        [4.7313114981622055, -74.02395834509545],
                        [4.735271403644056, -74.02442500737041],
                        [4.736853825960621, -74.02350477974207],
                        [4.740108569506018, -74.02280107626969],
                        [4.746941682826161, -74.02267477052217],
                    ];

                    antPathCra7Filtro = L.polyline.antPath;

                    pathCra7Filtro = antPathCra7Filtro(polylinePointsCra7Filtro, {
                        paused: false,
                        reverse: false,
                        delay: 3000,
                        dashArray: [10, 20],
                        weight: 7,
                        opacity: 0.9,
                        color: "#922B21",
                        pulseColor: "#FFFFFF",
                    });
                    pathCra7Filtro.addTo(mymap);

                    markerCra7Filtro = L.marker([4.693064189881765, -74.03349509991273])
                        .addTo(mymap)
                        .on("click", function() {
                            mymap.setView(
                                new L.LatLng(4.693064189881765, -74.03349509991273),
                                14
                            );
                            sidebarMapaFiltro.toggle();
                            contentCra7Filtro =
                                '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Carrea 7ma</h2></div>' +
                                '<img style="width: 100%; height: 35%;" src="views/dist/images/carrera7.jpg"></img>' +
                                "<br><br>" +
                                '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                "</tr>" +
                                '<tr style="font-size:15px; font-weight:bold">' +
                                "<td>" +
                                personasCra7 +
                                "</td>" +
                                "<td>" +
                                CarrosCra7 +
                                "</td>" +
                                "<td>" +
                                MotosCra7 +
                                "</td>" +
                                "<td>" +
                                BicicletasCra7 +
                                "</td>" +
                                "<td>" +
                                MascotasCra7 +
                                "</td>" +
                                "</tr>" +
                                "</table>" +
                                '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                totalAlcanceCra7 +
                                "</h3></div>";
                            sidebarMapaFiltro.setContent(contentCra7Filtro);
                        });

                    $("#totalPersonasCiudad").text(personasCra7);
                    $("#totalCarrosCiudad").text(CarrosCra7);
                    $("#totalMotosCiudad").text(MotosCra7);
                    $("#totalBicicletasCiudad").text(BicicletasCra7);
                    $("#totalMascotasCiudad").text(MascotasCra7);
                    $("#alcanceTotalCiudad").text(totalAlcanceCra7);
                } else {
                    if (idViaFiltro == 4) {
                        //AV CIUDAD DE CALI

                        $.ajax({
                            //TABLAVIAS
                            data: { idVia: idVia, idCiudadVia: idCiudadVia },
                            url: "models/metricas.php",
                            type: "post",
                            beforeSend: function() {},
                            success: function(response) {
                                $("#idTramoCiudadVias").html(response);
                                cargartablaVias(idCiudadVia, idVia);
                                cargartablaTramos();
                            },
                            error: function() {
                                alert("error");
                            },
                        });

                        ///JORNADAS

                        $.ajax({
                            data: {
                                idCiudadViaFiltro: idCiudadViaFiltro,
                                idMesViaFiltro: idMesViaFiltro,
                                idViaFiltro: idViaFiltro,
                            },
                            url: "models/metricas.php",
                            type: "post",
                            dataType: "json",
                            beforeSend: function() {},
                            success: function(data) {
                                mf = data.totalMananaFiltro;
                                tf = data.totalTardeFiltro;
                                nf = data.totalNocheFiltro;

                                $("#jornadaMananaCiudadVias").text(mf);
                                $("#jornadaTardeCiudadVias").text(tf);
                                $("#jornadaNocheCiudadVias").text(nf);
                            },
                            error: function() {
                                alert("error");
                            },
                        });

                        path7ma.remove(mymap);
                        marker7Ma.remove(mymap);
                        pathNorte.remove(mymap);
                        markerNorte.remove(mymap);
                        pathCalle80.remove(mymap);
                        markerCalle80.remove(mymap);
                        pathBoyaca.remove(mymap);
                        markerBoyaca.remove(mymap);
                        pathCalle26.remove(mymap);
                        markerCalle26.remove(mymap);
                        pathCalle100.remove(mymap);
                        markerCalle100.remove(mymap);
                        pathNqs.remove(mymap);
                        markerNQS.remove(mymap);
                        pathCra15.remove(mymap);
                        markerCra15.remove(mymap);
                        pathCalle68.remove(mymap);
                        markerCalle68.remove(mymap);
                        pathCali.remove(mymap);
                        markerAvCali.remove(mymap);
                        pathSuba.remove(mymap);
                        markerAvSuba.remove(mymap);
                        sidebarMapa.hide();

                        polylinePointsAvCaliFiltro = [
                            [4.640895432971052, -74.1560518018917],
                            [4.656155390441956, -74.13979860633766],
                            [4.659138809732586, -74.13595680664318],
                            [4.659138809732586, -74.13595680664318],
                            [4.67866316110416, -74.12005001497562],
                            [4.67866316110416, -74.12005001497562],
                            [4.68377844768857, -74.11456594259045],
                            [4.68377844768857, -74.11456594259045],
                            [4.689883942789022, -74.10915422023297],
                            [4.695782057898985, -74.10584016573326],
                            [4.695782057898985, -74.10584016573326],
                            [4.702960839464267, -74.10103816846734],
                            [4.702960839464267, -74.10103816846734],
                            [4.710105844378054, -74.09457914395375],
                            [4.711521355469079, -74.0934631868263],
                            [4.71394793920488, -74.09349700370895],
                            [4.715835276251866, -74.0926515816427],
                            [4.717048561645442, -74.09278684917331],
                            [4.722811638554449, -74.09796083218549],
                            [4.727024383594626, -74.09998984514449],
                            [4.73588791571666, -74.10012511267604],
                            [4.74158343348707, -74.09846808543747],
                            [4.746503783663763, -74.09650670624376],
                        ];

                        antPathAvCaliFiltro = L.polyline.antPath;

                        pathAvCaliFiltro = antPathAvCaliFiltro(polylinePointsAvCaliFiltro, {
                            paused: false,
                            reverse: false,
                            delay: 3000,
                            dashArray: [10, 20],
                            weight: 7,
                            opacity: 0.9,
                            color: "#922B21",
                            pulseColor: "#FFFFFF",
                        });
                        pathAvCaliFiltro.addTo(mymap);

                        markerAvCaliFiltro = L.marker([
                                4.695782057898985, -74.10584016573326,
                            ])
                            .addTo(mymap)
                            .on("click", function() {
                                mymap.setView(
                                    new L.LatLng(4.695782057898985, -74.10584016573326),
                                    14
                                );
                                sidebarMapaFiltro.toggle();
                                contentAvCaliFiltro =
                                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Av Ciudad de Cali</h2></div>' +
                                    '<img style="width: 100%; height: 35%;" src="views/dist/images/avCali.jpg"></img>' +
                                    "<br><br>" +
                                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                    "</tr>" +
                                    '<tr style="font-size:15px; font-weight:bold">' +
                                    "<td>" +
                                    personasAvCali +
                                    "</td>" +
                                    "<td>" +
                                    CarrosAvCali +
                                    "</td>" +
                                    "<td>" +
                                    MotosAvCali +
                                    "</td>" +
                                    "<td>" +
                                    BicicletasAvCali +
                                    "</td>" +
                                    "<td>" +
                                    MascotasAvCali +
                                    "</td>" +
                                    "</tr>" +
                                    "</table>" +
                                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                    totalAlcanceAvCali +
                                    "</h3></div>";
                                sidebarMapaFiltro.setContent(contentAvCaliFiltro);
                            });

                        $("#totalPersonasCiudad").text(personasAvCali);
                        $("#totalCarrosCiudad").text(CarrosAvCali);
                        $("#totalMotosCiudad").text(MotosAvCali);
                        $("#totalBicicletasCiudad").text(BicicletasAvCali);
                        $("#totalMascotasCiudad").text(MascotasAvCali);
                        $("#alcanceTotalCiudad").text(totalAlcanceAvCali);
                    } else {
                        if (idViaFiltro == 5) {
                            //CALLE 68

                            $.ajax({
                                //TABLAVIAS
                                data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                url: "models/metricas.php",
                                type: "post",
                                beforeSend: function() {},
                                success: function(response) {
                                    $("#idTramoCiudadVias").html(response);
                                    cargartablaVias(idCiudadVia, idVia);
                                    cargartablaTramos();
                                },
                                error: function() {
                                    alert("error");
                                },
                            });

                            ///JORNADAS

                            $.ajax({
                                data: {
                                    idCiudadViaFiltro: idCiudadViaFiltro,
                                    idMesViaFiltro: idMesViaFiltro,
                                    idViaFiltro: idViaFiltro,
                                },
                                url: "models/metricas.php",
                                type: "post",
                                dataType: "json",
                                beforeSend: function() {},
                                success: function(data) {
                                    mf = data.totalMananaFiltro;
                                    tf = data.totalTardeFiltro;
                                    nf = data.totalNocheFiltro;

                                    $("#jornadaMananaCiudadVias").text(mf);
                                    $("#jornadaTardeCiudadVias").text(tf);
                                    $("#jornadaNocheCiudadVias").text(nf);
                                },
                                error: function() {
                                    alert("error");
                                },
                            });

                            path7ma.remove(mymap);
                            marker7Ma.remove(mymap);
                            pathNorte.remove(mymap);
                            markerNorte.remove(mymap);
                            pathCalle80.remove(mymap);
                            markerCalle80.remove(mymap);
                            pathBoyaca.remove(mymap);
                            markerBoyaca.remove(mymap);
                            pathCalle26.remove(mymap);
                            markerCalle26.remove(mymap);
                            pathCalle100.remove(mymap);
                            markerCalle100.remove(mymap);
                            pathNqs.remove(mymap);
                            markerNQS.remove(mymap);
                            pathCra15.remove(mymap);
                            markerCra15.remove(mymap);
                            pathCalle68.remove(mymap);
                            markerCalle68.remove(mymap);
                            pathCali.remove(mymap);
                            markerAvCali.remove(mymap);
                            pathSuba.remove(mymap);
                            markerAvSuba.remove(mymap);
                            sidebarMapa.hide();

                            polylinePointsCalle68Filtro = [
                                [4.595098910237614, -74.13796603283501],
                                [4.60929199524421, -74.12872521583304],
                                [4.6290513637505155, -74.12247274062042],
                                [4.6290513637505155, -74.12247274062042],
                                [4.636194188840821, -74.11942434758436],
                                [4.637267448928066, -74.11846720611553],
                                [4.637267448928066, -74.11846720611553],
                                [4.64785089866294, -74.10784891802784],
                                [4.653723899455334, -74.10333240676266],
                                [4.653723899455334, -74.10333240676266],
                                [4.665946738806431, -74.09352170679382],
                                [4.665946738806431, -74.09352170679382],
                                [4.672475436675965, -74.08882573153758],
                                [4.6774539004065385, -74.08607394981469],
                                [4.679182939411441, -74.08496725499134],
                                [4.683863247784658, -74.0791645848738],
                                [4.683863247784658, -74.0791645848738],
                                [4.689199357368296, -74.07207575597019],
                                [4.689615202079117, -74.06848309497659],
                            ];

                            antPathCalle68Filtro = L.polyline.antPath;

                            pathCalle68Filtro = antPathCalle68Filtro(
                                polylinePointsCalle68Filtro, {
                                    paused: false,
                                    reverse: false,
                                    delay: 3000,
                                    dashArray: [10, 20],
                                    weight: 7,
                                    opacity: 0.9,
                                    color: "#922B21",
                                    pulseColor: "#FFFFFF",
                                }
                            );
                            pathCalle68Filtro.addTo(mymap);

                            markerCalle68Filtro = L.marker([
                                    4.665946738806431, -74.09352170679382,
                                ])
                                .addTo(mymap)
                                .on("click", function() {
                                    mymap.setView(
                                        new L.LatLng(4.665946738806431, -74.09352170679382),
                                        14
                                    );
                                    sidebarMapaFiltro.toggle();
                                    contentCalle68Filtro =
                                        '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 68</h2></div>' +
                                        '<img style="width: 100%; height: 35%;" src="views/dist/images/calle68.jpg"></img>' +
                                        "<br><br>" +
                                        '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                        '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                        '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                        "</tr>" +
                                        '<tr style="font-size:15px; font-weight:bold">' +
                                        "<td>" +
                                        personasCalle68 +
                                        "</td>" +
                                        "<td>" +
                                        CarrosCalle68 +
                                        "</td>" +
                                        "<td>" +
                                        MotosCalle68 +
                                        "</td>" +
                                        "<td>" +
                                        BicicletasCalle68 +
                                        "</td>" +
                                        "<td>" +
                                        MascotasCalle68 +
                                        "</td>" +
                                        "</tr>" +
                                        "</table>" +
                                        '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                        totalAlcanceCalle68 +
                                        "</h3></div>";
                                    sidebarMapaFiltro.setContent(contentCalle68Filtro);
                                });

                            $("#totalPersonasCiudad").text(personasCalle68);
                            $("#totalCarrosCiudad").text(CarrosCalle68);
                            $("#totalMotosCiudad").text(MotosCalle68);
                            $("#totalBicicletasCiudad").text(BicicletasCalle68);
                            $("#totalMascotasCiudad").text(MascotasCalle68);
                            $("#alcanceTotalCiudad").text(totalAlcanceCalle68);
                        } else {
                            if (idViaFiltro == 7) {
                                //NQS

                                $.ajax({
                                    //TABLAVIAS
                                    data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                    url: "models/metricas.php",
                                    type: "post",
                                    beforeSend: function() {},
                                    success: function(response) {
                                        $("#idTramoCiudadVias").html(response);
                                        cargartablaVias(idCiudadVia, idVia);
                                        cargartablaTramos();
                                    },
                                    error: function() {
                                        alert("error");
                                    },
                                });

                                ///JORNADAS

                                $.ajax({
                                    data: {
                                        idCiudadViaFiltro: idCiudadViaFiltro,
                                        idMesViaFiltro: idMesViaFiltro,
                                        idViaFiltro: idViaFiltro,
                                    },
                                    url: "models/metricas.php",
                                    type: "post",
                                    dataType: "json",
                                    beforeSend: function() {},
                                    success: function(data) {
                                        mf = data.totalMananaFiltro;
                                        tf = data.totalTardeFiltro;
                                        nf = data.totalNocheFiltro;

                                        $("#jornadaMananaCiudadVias").text(mf);
                                        $("#jornadaTardeCiudadVias").text(tf);
                                        $("#jornadaNocheCiudadVias").text(nf);
                                    },
                                    error: function() {
                                        alert("error");
                                    },
                                });

                                path7ma.remove(mymap);
                                marker7Ma.remove(mymap);
                                pathNorte.remove(mymap);
                                markerNorte.remove(mymap);
                                pathCalle80.remove(mymap);
                                markerCalle80.remove(mymap);
                                pathBoyaca.remove(mymap);
                                markerBoyaca.remove(mymap);
                                pathCalle26.remove(mymap);
                                markerCalle26.remove(mymap);
                                pathCalle100.remove(mymap);
                                markerCalle100.remove(mymap);
                                pathNqs.remove(mymap);
                                markerNQS.remove(mymap);
                                pathCra15.remove(mymap);
                                markerCra15.remove(mymap);
                                pathCalle68.remove(mymap);
                                markerCalle68.remove(mymap);
                                pathCali.remove(mymap);
                                markerAvCali.remove(mymap);
                                pathSuba.remove(mymap);
                                markerAvSuba.remove(mymap);
                                sidebarMapa.hide();

                                polylinePointNQSFiltro = [
                                    [4.593462064707526, -74.12432585002071],
                                    [4.594828859186531, -74.11669283585645],
                                    [4.598108166273489, -74.10881289973422],
                                    [4.598016651554195, -74.10773412978192],
                                    [4.602226316470704, -74.10169760855943],
                                    [4.606550348534154, -74.09793339000245],
                                    [4.606550348534154, -74.09793339000245],
                                    [4.626890696657232, -74.08131615823105],
                                    [4.626890696657232, -74.08131615823105],
                                    [4.629591080918556, -74.07998305117032],
                                    [4.6425784979279285, -74.07899397146346],
                                    [4.6425784979279285, -74.07899397146346],
                                    [4.6579230591391285, -74.0774028432617],
                                    [4.664137939677794, -74.07559669771004],
                                    [4.66760967659221, -74.07314550017566],
                                    [4.66760967659221, -74.07314550017566],
                                    [4.6728815407855215, -74.06828610892035],
                                    [4.675967491531949, -74.06351272424811],
                                ];

                                antPathNQSFiltro = L.polyline.antPath;

                                pathNQSFiltro = antPathNQSFiltro(polylinePointNQSFiltro, {
                                    paused: false,
                                    reverse: false,
                                    delay: 3000,
                                    dashArray: [10, 20],
                                    weight: 7,
                                    opacity: 0.9,
                                    color: "#922B21",
                                    pulseColor: "#FFFFFF",
                                });
                                pathNQSFiltro.addTo(mymap);

                                markerNQSFiltro = L.marker([
                                        4.6425784979279285, -74.07899397146346,
                                    ])
                                    .addTo(mymap)
                                    .on("click", function() {
                                        mymap.setView(
                                            new L.LatLng(4.6425784979279285, -74.07899397146346),
                                            14
                                        );
                                        sidebarMapaFiltro.toggle();
                                        contentAvNQSFiltro =
                                            '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>NQS</h2></div>' +
                                            '<img style="width: 100%; height: 35%;" src="views/dist/images/nqs.jpg"></img>' +
                                            "<br><br>" +
                                            '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                            '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                            '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                            "</tr>" +
                                            '<tr style="font-size:15px; font-weight:bold">' +
                                            "<td>" +
                                            personasNQS +
                                            "</td>" +
                                            "<td>" +
                                            CarrosNQS +
                                            "</td>" +
                                            "<td>" +
                                            MotosNQS +
                                            "</td>" +
                                            "<td>" +
                                            BicicletasNQS +
                                            "</td>" +
                                            "<td>" +
                                            MascotasNQS +
                                            "</td>" +
                                            "</tr>" +
                                            "</table>" +
                                            '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                            totalAlcanceNQS +
                                            "</h3></div>";
                                        sidebarMapaFiltro.setContent(contentAvNQSFiltro);
                                    });

                                $("#totalPersonasCiudad").text(personasNQS);
                                $("#totalCarrosCiudad").text(CarrosNQS);
                                $("#totalMotosCiudad").text(MotosNQS);
                                $("#totalBicicletasCiudad").text(BicicletasNQS);
                                $("#totalMascotasCiudad").text(MascotasNQS);
                                $("#alcanceTotalCiudad").text(totalAlcanceNQS);
                            } else {
                                if (idViaFiltro == 8) {
                                    //CALLE 80

                                    $.ajax({
                                        //TABLAVIAS
                                        data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                        url: "models/metricas.php",
                                        type: "post",
                                        beforeSend: function() {},
                                        success: function(response) {
                                            $("#idTramoCiudadVias").html(response);
                                            cargartablaVias(idCiudadVia, idVia);
                                            cargartablaTramos();
                                        },
                                        error: function() {
                                            alert("error");
                                        },
                                    });

                                    ///JORNADAS

                                    $.ajax({
                                        data: {
                                            idCiudadViaFiltro: idCiudadViaFiltro,
                                            idMesViaFiltro: idMesViaFiltro,
                                            idViaFiltro: idViaFiltro,
                                        },
                                        url: "models/metricas.php",
                                        type: "post",
                                        dataType: "json",
                                        beforeSend: function() {},
                                        success: function(data) {
                                            mf = data.totalMananaFiltro;
                                            tf = data.totalTardeFiltro;
                                            nf = data.totalNocheFiltro;

                                            $("#jornadaMananaCiudadVias").text(mf);
                                            $("#jornadaTardeCiudadVias").text(tf);
                                            $("#jornadaNocheCiudadVias").text(nf);
                                        },
                                        error: function() {
                                            alert("error");
                                        },
                                    });

                                    path7ma.remove(mymap);
                                    marker7Ma.remove(mymap);
                                    pathNorte.remove(mymap);
                                    markerNorte.remove(mymap);
                                    pathCalle80.remove(mymap);
                                    markerCalle80.remove(mymap);
                                    pathBoyaca.remove(mymap);
                                    markerBoyaca.remove(mymap);
                                    pathCalle26.remove(mymap);
                                    markerCalle26.remove(mymap);
                                    pathCalle100.remove(mymap);
                                    markerCalle100.remove(mymap);
                                    pathNqs.remove(mymap);
                                    markerNQS.remove(mymap);
                                    pathCra15.remove(mymap);
                                    markerCra15.remove(mymap);
                                    pathCalle68.remove(mymap);
                                    markerCalle68.remove(mymap);
                                    pathCali.remove(mymap);
                                    markerAvCali.remove(mymap);
                                    pathSuba.remove(mymap);
                                    markerAvSuba.remove(mymap);
                                    sidebarMapa.hide();

                                    polylinePointCalle80Filtro = [
                                        [4.6667710342530295, -74.06144325978063],
                                        [4.668978925003193, -74.06315779346603],
                                        [4.671413645787956, -74.06519095730539],
                                        [4.674014704615246, -74.06752757843418],
                                        [4.674014704615246, -74.06752757843418],
                                        [4.676964053546286, -74.07189029333028],
                                        [4.679423464874195, -74.07534497831577],
                                        [4.684064243578597, -74.07899278233772],
                                        [4.684064243578597, -74.07899278233772],
                                        [4.688376583789519, -74.08249402363425],
                                        [4.693273931883658, -74.08622765848345],
                                        [4.695519429301657, -74.0890171556767],
                                        [4.695519429301657, -74.0890171556767],
                                        [4.698857432799128, -74.09530940724632],
                                        [4.703173347781176, -74.10101120961626],
                                        [4.703173347781176, -74.10101120961626],
                                        [4.706715974836702, -74.10835498765066],
                                        [4.711490206300968, -74.11353969188215],
                                        [4.711490206300968, -74.11353969188215],
                                        [4.7160720535087375, -74.1168909880005],
                                        [4.719258414746192, -74.11929424712085],
                                        [4.726101557291296, -74.12468012256059],
                                    ];

                                    antPathCalle80Filtro = L.polyline.antPath;

                                    pathCalle80Filtro = antPathCalle80Filtro(
                                        polylinePointCalle80Filtro, {
                                            paused: false,
                                            reverse: false,
                                            delay: 3000,
                                            dashArray: [10, 20],
                                            weight: 7,
                                            opacity: 0.9,
                                            color: "#922B21",
                                            pulseColor: "#FFFFFF",
                                        }
                                    );
                                    pathCalle80Filtro.addTo(mymap);

                                    markerCalle80Filtro = L.marker([
                                            4.698857432799128, -74.09530940724632,
                                        ])
                                        .addTo(mymap)
                                        .on("click", function() {
                                            mymap.setView(
                                                new L.LatLng(4.698857432799128, -74.09530940724632),
                                                14
                                            );
                                            sidebarMapaFiltro.toggle();
                                            // content = '<h1>Auto Sur</h1>' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                                            contentCalle80Filtro =
                                                '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 80</h2></div>' +
                                                '<img style="width: 100%; height: 35%;" src="views/dist/images/calle80.jpg"></img>' +
                                                "<br><br>" +
                                                '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                                '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                                '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                                "</tr>" +
                                                '<tr style="font-size:15px; font-weight:bold">' +
                                                "<td>" +
                                                personasCalle80 +
                                                "</td>" +
                                                "<td>" +
                                                CarrosCalle80 +
                                                "</td>" +
                                                "<td>" +
                                                MotosCalle80 +
                                                "</td>" +
                                                "<td>" +
                                                BicicletasCalle80 +
                                                "</td>" +
                                                "<td>" +
                                                MascotasCalle80 +
                                                "</td>" +
                                                "</tr>" +
                                                "</table>" +
                                                '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                                totalAlcanceCalle80 +
                                                "</h3></div>";
                                            sidebarMapaFiltro.setContent(contentCalle80Filtro);
                                        });

                                    $("#totalPersonasCiudad").text(personasCalle80);
                                    $("#totalCarrosCiudad").text(CarrosCalle80);
                                    $("#totalMotosCiudad").text(MotosCalle80);
                                    $("#totalBicicletasCiudad").text(BicicletasCalle80);
                                    $("#totalMascotasCiudad").text(MascotasCalle80);
                                    $("#alcanceTotalCiudad").text(totalAlcanceCalle80);
                                } else {
                                    if (idViaFiltro == 9) {
                                        //AVBOYACA

                                        $.ajax({
                                            //TABLAVIAS
                                            data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                            url: "models/metricas.php",
                                            type: "post",
                                            beforeSend: function() {},
                                            success: function(response) {
                                                $("#idTramoCiudadVias").html(response);
                                                cargartablaVias(idCiudadVia, idVia);
                                                cargartablaTramos();
                                            },
                                            error: function() {
                                                alert("error");
                                            },
                                        });

                                        ///JORNADAS

                                        $.ajax({
                                            data: {
                                                idCiudadViaFiltro: idCiudadViaFiltro,
                                                idMesViaFiltro: idMesViaFiltro,
                                                idViaFiltro: idViaFiltro,
                                            },
                                            url: "models/metricas.php",
                                            type: "post",
                                            dataType: "json",
                                            beforeSend: function() {},
                                            success: function(data) {
                                                mf = data.totalMananaFiltro;
                                                tf = data.totalTardeFiltro;
                                                nf = data.totalNocheFiltro;

                                                $("#jornadaMananaCiudadVias").text(mf);
                                                $("#jornadaTardeCiudadVias").text(tf);
                                                $("#jornadaNocheCiudadVias").text(nf);
                                            },
                                            error: function() {
                                                alert("error");
                                            },
                                        });

                                        path7ma.remove(mymap);
                                        marker7Ma.remove(mymap);
                                        pathNorte.remove(mymap);
                                        markerNorte.remove(mymap);
                                        pathCalle80.remove(mymap);
                                        markerCalle80.remove(mymap);
                                        pathBoyaca.remove(mymap);
                                        markerBoyaca.remove(mymap);
                                        pathCalle26.remove(mymap);
                                        markerCalle26.remove(mymap);
                                        pathCalle100.remove(mymap);
                                        markerCalle100.remove(mymap);
                                        pathNqs.remove(mymap);
                                        markerNQS.remove(mymap);
                                        pathCra15.remove(mymap);
                                        markerCra15.remove(mymap);
                                        pathCalle68.remove(mymap);
                                        markerCalle68.remove(mymap);
                                        pathCali.remove(mymap);
                                        markerAvCali.remove(mymap);
                                        pathSuba.remove(mymap);
                                        markerAvSuba.remove(mymap);
                                        sidebarMapa.hide();

                                        polylinePointAvBoyacaFiltro = [
                                            [4.5954384233176135, -74.1451390378603],
                                            [4.599189187359548, -74.14462316046824],
                                            [4.607992958342719, -74.14151503746514],
                                            [4.618586567705614, -74.13940440847355],
                                            [4.618586567705614, -74.13940440847355],
                                            [4.623575753996688, -74.13829047590166],
                                            [4.63051935927946, -74.13767805314913],
                                            [4.63051935927946, -74.13767805314913],
                                            [4.636594393936197, -74.13685229292142],
                                            [4.642349452219984, -74.13374878023903],
                                            [4.649111585842778, -74.12667565800294],
                                            [4.649111585842778, -74.12667565800294],
                                            [4.6569823656133895, -74.11955073047119],
                                            [4.666082326236434, -74.11189240907811],
                                            [4.666082326236434, -74.11189240907811],
                                            [4.670985241397018, -74.10701681399043],
                                            [4.674663693488021, -74.10384107872426],
                                            [4.674663693488021, -74.10384107872426],
                                            [4.679582523796698, -74.1003649355858],
                                            [4.687238721189497, -74.09497906006335],
                                            [4.687238721189497, -74.09497906006335],
                                            [4.690874316395253, -74.09238268165419],
                                            [4.694189107156004, -74.0906875256675],
                                            [4.695237005475957, -74.08907820036372],
                                            [4.695237005475957, -74.08907820036372],
                                            [4.696888661688281, -74.08369996737875],
                                            [4.697626187079516, -74.082449604259],
                                            [4.698630746271219, -74.08196476957991],
                                            [4.701288370618655, -74.08128855272564],
                                            [4.701288370618655, -74.08128855272564],
                                            [4.702862838796408, -74.08093345798295],
                                            [4.70507291582481, -74.0816171283733],
                                            [4.706068758570802, -74.08180119344573],
                                            [4.707090806168116, -74.08144182824056],
                                            [4.709816259127217, -74.08003066236506],
                                            [4.709816259127217, -74.08003066236506],
                                            [4.711501780460111, -74.07886713755514],
                                            [4.7148631421360925, -74.07682261047016],
                                            [4.715994351403252, -74.07605608249622],
                                            [4.719358586256332, -74.0751716271417],
                                            [4.722399605587236, -74.07405131692866],
                                            [4.726081960957103, -74.0710605939208],
                                            [4.726081960957103, -74.0710605939208],
                                            [4.729718675119858, -74.06860124858757],
                                            [4.736916327849774, -74.0662039360009],
                                            [4.742489639069735, -74.06509214670739],
                                            [4.742489639069735, -74.06509214670739],
                                            [4.747123913537714, -74.06478828033245],
                                            [4.754232472403068, -74.06537244146982],
                                            [4.757630244126492, -74.06594876460747],
                                            [4.759028896960854, -74.0662067033035],
                                            [4.760212244562475, -74.06584163663726],
                                        ];

                                        antPathAvBoyacaFiltro = L.polyline.antPath;

                                        pathAvBoyacaFiltro = antPathAvBoyacaFiltro(
                                            polylinePointAvBoyacaFiltro, {
                                                paused: false,
                                                reverse: false,
                                                delay: 3000,
                                                dashArray: [10, 20],
                                                weight: 7,
                                                opacity: 0.9,
                                                color: "#922B21",
                                                pulseColor: "#FFFFFF",
                                            }
                                        );
                                        pathAvBoyacaFiltro.addTo(mymap);

                                        markerAvBoyacaFiltro = L.marker([
                                                4.674641562585807, -74.1038416828036,
                                            ])
                                            .addTo(mymap)
                                            .on("click", function() {
                                                mymap.setView(
                                                    new L.LatLng(4.674641562585807, -74.1038416828036),
                                                    14
                                                );
                                                sidebarMapaFiltro.toggle();
                                                //content = 'Américas' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                                                contentAvBoyacaFiltro =
                                                    '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Avenida Boyacá</h2></div>' +
                                                    '<img style="width: 100%; height: 35%;" src="views/dist/images/avBoyaca.jpg"></img>' +
                                                    "<br><br>" +
                                                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                                    "</tr>" +
                                                    '<tr style="font-size:15px; font-weight:bold">' +
                                                    "<td>" +
                                                    personasAvBoyaca +
                                                    "</td>" +
                                                    "<td>" +
                                                    CarrosAvBoyaca +
                                                    "</td>" +
                                                    "<td>" +
                                                    MotosAvBoyaca +
                                                    "</td>" +
                                                    "<td>" +
                                                    BicicletasAvBoyaca +
                                                    "</td>" +
                                                    "<td>" +
                                                    MascotasAvBoyaca +
                                                    "</td>" +
                                                    "</tr>" +
                                                    "</table>" +
                                                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                                    totalAlcanceAvBoyaca +
                                                    "</h3></div>";
                                                sidebarMapaFiltro.setContent(contentAvBoyacaFiltro);
                                            });

                                        $("#totalPersonasCiudad").text(personasAvBoyaca);
                                        $("#totalCarrosCiudad").text(CarrosAvBoyaca);
                                        $("#totalMotosCiudad").text(MotosAvBoyaca);
                                        $("#totalBicicletasCiudad").text(BicicletasAvBoyaca);
                                        $("#totalMascotasCiudad").text(MascotasAvBoyaca);
                                        $("#alcanceTotalCiudad").text(totalAlcanceAvBoyaca);
                                    } else {
                                        if (idViaFiltro == 11) {
                                            //CALLE100

                                            $.ajax({
                                                //TABLAVIAS
                                                data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                                url: "models/metricas.php",
                                                type: "post",
                                                beforeSend: function() {},
                                                success: function(response) {
                                                    $("#idTramoCiudadVias").html(response);
                                                    cargartablaVias(idCiudadVia, idVia);
                                                    cargartablaTramos();
                                                },
                                                error: function() {
                                                    alert("error");
                                                },
                                            });

                                            ///JORNADAS

                                            $.ajax({
                                                data: {
                                                    idCiudadViaFiltro: idCiudadViaFiltro,
                                                    idMesViaFiltro: idMesViaFiltro,
                                                    idViaFiltro: idViaFiltro,
                                                },
                                                url: "models/metricas.php",
                                                type: "post",
                                                dataType: "json",
                                                beforeSend: function() {},
                                                success: function(data) {
                                                    mf = data.totalMananaFiltro;
                                                    tf = data.totalTardeFiltro;
                                                    nf = data.totalNocheFiltro;

                                                    $("#jornadaMananaCiudadVias").text(mf);
                                                    $("#jornadaTardeCiudadVias").text(tf);
                                                    $("#jornadaNocheCiudadVias").text(nf);
                                                },
                                                error: function() {
                                                    alert("error");
                                                },
                                            });

                                            path7ma.remove(mymap);
                                            marker7Ma.remove(mymap);
                                            pathNorte.remove(mymap);
                                            markerNorte.remove(mymap);
                                            pathCalle80.remove(mymap);
                                            markerCalle80.remove(mymap);
                                            pathBoyaca.remove(mymap);
                                            markerBoyaca.remove(mymap);
                                            pathCalle26.remove(mymap);
                                            markerCalle26.remove(mymap);
                                            pathCalle100.remove(mymap);
                                            markerCalle100.remove(mymap);
                                            pathNqs.remove(mymap);
                                            markerNQS.remove(mymap);
                                            pathCra15.remove(mymap);
                                            markerCra15.remove(mymap);
                                            pathCalle68.remove(mymap);
                                            markerCalle68.remove(mymap);
                                            pathCali.remove(mymap);
                                            markerAvCali.remove(mymap);
                                            pathSuba.remove(mymap);
                                            markerAvSuba.remove(mymap);
                                            sidebarMapa.hide();

                                            polylinePointCalle100Filtro = [
                                                [4.6798498316361865, -74.03825840484916],
                                                [4.682743314006706, -74.0433537721709],
                                                [4.682743314006706, -74.0433537721709],
                                                [4.683934920451122, -74.04578387633464],
                                                [4.683934920451122, -74.04578387633464],
                                                [4.685207812800805, -74.04855505638866],
                                                [4.685207812800805, -74.04855505638866],
                                                [4.685674926275072, -74.05037910709181],
                                                [4.686110477718551, -74.05284284228672],
                                                [4.686179913445833, -74.05367253199111],
                                                [4.686596527574687, -74.05573092257812],
                                                [4.686729086563598, -74.05587659329659],
                                                [4.687025766114359, -74.05716862923428],
                                                [4.687025766114359, -74.05716862923428],
                                                [4.687290883932121, -74.05836566248462],
                                                [4.688092549018114, -74.06115240666395],
                                                [4.6891593302920125, -74.06508551602695],
                                            ];

                                            antPathCalle100Filtro = L.polyline.antPath;

                                            pathCalle100Filtro = antPathCalle100Filtro(
                                                polylinePointCalle100Filtro, {
                                                    paused: false,
                                                    reverse: false,
                                                    delay: 3000,
                                                    dashArray: [10, 20],
                                                    weight: 7,
                                                    opacity: 0.9,
                                                    color: "#2874A6",
                                                    pulseColor: "#FFFFFF",
                                                }
                                            );
                                            pathCalle100Filtro.addTo(mymap);

                                            markerCalle100Filtro = L.marker([
                                                    4.686179913445833, -74.05367253199111,
                                                ])
                                                .addTo(mymap)
                                                .on("click", function() {
                                                    mymap.setView(
                                                        new L.LatLng(4.686179913445833, -74.05367253199111),
                                                        14
                                                    );
                                                    sidebarMapaFiltro.toggle();
                                                    //content = 'Américas' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                                                    contentCalle100Filtro =
                                                        '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 100</h2></div>' +
                                                        '<img style="width: 100%; height: 35%;" src="views/dist/images/calle100.jpg"></img>' +
                                                        "<br><br>" +
                                                        '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                                        '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                                        '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                                        "</tr>" +
                                                        '<tr style="font-size:15px; font-weight:bold">' +
                                                        "<td>" +
                                                        personasCalle100 +
                                                        "</td>" +
                                                        "<td>" +
                                                        CarrosCalle100 +
                                                        "</td>" +
                                                        "<td>" +
                                                        MotosCalle100 +
                                                        "</td>" +
                                                        "<td>" +
                                                        BicicletasCalle100 +
                                                        "</td>" +
                                                        "<td>" +
                                                        MascotasCalle100 +
                                                        "</td>" +
                                                        "</tr>" +
                                                        "</table>" +
                                                        '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                                        totalAlcanceCalle100 +
                                                        "</h3></div>";
                                                    sidebarMapaFiltro.setContent(contentCalle100Filtro);
                                                });

                                            $("#totalPersonasCiudad").text(personasCalle100);
                                            $("#totalCarrosCiudad").text(CarrosCalle100);
                                            $("#totalMotosCiudad").text(MotosCalle100);
                                            $("#totalBicicletasCiudad").text(BicicletasCalle100);
                                            $("#totalMascotasCiudad").text(MascotasCalle100);
                                            $("#alcanceTotalCiudad").text(totalAlcanceCalle100);
                                        } else {
                                            if (idViaFiltro == 13) {
                                                //CRA15

                                                $.ajax({
                                                    //TABLAVIAS
                                                    data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                                    url: "models/metricas.php",
                                                    type: "post",
                                                    beforeSend: function() {},
                                                    success: function(response) {
                                                        $("#idTramoCiudadVias").html(response);
                                                        cargartablaVias(idCiudadVia, idVia);
                                                        cargartablaTramos();
                                                    },
                                                    error: function() {
                                                        alert("error");
                                                    },
                                                });

                                                ///JORNADAS

                                                $.ajax({
                                                    data: {
                                                        idCiudadViaFiltro: idCiudadViaFiltro,
                                                        idMesViaFiltro: idMesViaFiltro,
                                                        idViaFiltro: idViaFiltro,
                                                    },
                                                    url: "models/metricas.php",
                                                    type: "post",
                                                    dataType: "json",
                                                    beforeSend: function() {},
                                                    success: function(data) {
                                                        mf = data.totalMananaFiltro;
                                                        tf = data.totalTardeFiltro;
                                                        nf = data.totalNocheFiltro;

                                                        $("#jornadaMananaCiudadVias").text(mf);
                                                        $("#jornadaTardeCiudadVias").text(tf);
                                                        $("#jornadaNocheCiudadVias").text(nf);
                                                    },
                                                    error: function() {
                                                        alert("error");
                                                    },
                                                });

                                                path7ma.remove(mymap);
                                                marker7Ma.remove(mymap);
                                                pathNorte.remove(mymap);
                                                markerNorte.remove(mymap);
                                                pathCalle80.remove(mymap);
                                                markerCalle80.remove(mymap);
                                                pathBoyaca.remove(mymap);
                                                markerBoyaca.remove(mymap);
                                                pathCalle26.remove(mymap);
                                                markerCalle26.remove(mymap);
                                                pathCalle100.remove(mymap);
                                                markerCalle100.remove(mymap);
                                                pathNqs.remove(mymap);
                                                markerNQS.remove(mymap);
                                                pathCra15.remove(mymap);
                                                markerCra15.remove(mymap);
                                                pathCalle68.remove(mymap);
                                                markerCalle68.remove(mymap);
                                                pathCali.remove(mymap);
                                                markerAvCali.remove(mymap);
                                                pathSuba.remove(mymap);
                                                markerAvSuba.remove(mymap);
                                                sidebarMapa.hide();

                                                polylinePointCra15Filtro = [
                                                    [4.659362663399369, -74.06152660925342],
                                                    [4.661798715040358, -74.0598321144929],
                                                    [4.665886041306087, -74.05743476620279],
                                                    [4.6699847277159, -74.05533125872593],
                                                    [4.6699847277159, -74.05533125872593],
                                                    [4.6778494064787255, -74.05138215982744],
                                                    [4.6778494064787255, -74.05138215982744],
                                                    [4.681060194959816, -74.04973907042903],
                                                    [4.683453649012631, -74.04851553111737],
                                                    [4.684134147820858, -74.04834104317594],
                                                    [4.684474396976653, -74.0479768944286],
                                                    [4.684655863125366, -74.04774171502928],
                                                    [4.684655863125366, -74.04774171502928],
                                                    [4.685093222469991, -74.0476643180995],
                                                    [4.685307845592236, -74.04781892309768],
                                                    [4.686072783919306, -74.0478410095112],
                                                    [4.687613604328152, -74.04740081294725],
                                                    [4.689781837347455, -74.04630753471199],
                                                    [4.694988179502177, -74.04340520880484],
                                                    [4.6961988560471495, -74.04311808520865],
                                                    [4.6961988560471495, -74.04311808520865],
                                                    [4.69993094405956, -74.04290770339533],
                                                    [4.703983488348751, -74.04270385550814],
                                                ];

                                                antPathCra15Filtro = L.polyline.antPath;

                                                pathCra15Filtro = antPathCra15Filtro(
                                                    polylinePointCra15Filtro, {
                                                        paused: false,
                                                        reverse: false,
                                                        delay: 3000,
                                                        dashArray: [10, 20],
                                                        weight: 7,
                                                        opacity: 0.9,
                                                        color: "#2874A6",
                                                        pulseColor: "#FFFFFF",
                                                    }
                                                );
                                                pathCra15Filtro.addTo(mymap);

                                                markerCra15Filtro = L.marker([
                                                        4.687613604328152, -74.04740081294725,
                                                    ])
                                                    .addTo(mymap)
                                                    .on("click", function() {
                                                        mymap.setView(
                                                            new L.LatLng(
                                                                4.687613604328152, -74.04740081294725
                                                            ),
                                                            14
                                                        );
                                                        sidebarMapaFiltro.toggle();
                                                        //content = 'Américas' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                                                        contentCra15Filtro =
                                                            '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Carrera 15</h2></div>' +
                                                            '<img style="width: 100%; height: 35%;" src="views/dist/images/carrera15.jpg"></img>' +
                                                            "<br><br>" +
                                                            '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                                            '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                                            '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                                            "</tr>" +
                                                            '<tr style="font-size:15px; font-weight:bold">' +
                                                            "<td>" +
                                                            personasCra15 +
                                                            "</td>" +
                                                            "<td>" +
                                                            CarrosCra15 +
                                                            "</td>" +
                                                            "<td>" +
                                                            MotosCra15 +
                                                            "</td>" +
                                                            "<td>" +
                                                            BicicletasCra15 +
                                                            "</td>" +
                                                            "<td>" +
                                                            MascotasCra15 +
                                                            "</td>" +
                                                            "</tr>" +
                                                            "</table>" +
                                                            '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                                            totalAlcanceCra15 +
                                                            "</h3></div>";
                                                        sidebarMapaFiltro.setContent(contentCra15Filtro);
                                                    });

                                                $("#totalPersonasCiudad").text(personasCra15);
                                                $("#totalCarrosCiudad").text(CarrosCra15);
                                                $("#totalMotosCiudad").text(MotosCra15);
                                                $("#totalBicicletasCiudad").text(BicicletasCra15);
                                                $("#totalMascotasCiudad").text(MascotasCra15);
                                                $("#alcanceTotalCiudad").text(totalAlcanceCra15);
                                            } else {
                                                if (idViaFiltro == 20) {
                                                    //AvSuba

                                                    $.ajax({
                                                        //TABLAVIAS
                                                        data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                                        url: "models/metricas.php",
                                                        type: "post",
                                                        beforeSend: function() {},
                                                        success: function(response) {
                                                            $("#idTramoCiudadVias").html(response);
                                                            cargartablaVias(idCiudadVia, idVia);
                                                            cargartablaTramos();
                                                        },
                                                        error: function() {
                                                            alert("error");
                                                        },
                                                    });

                                                    ///JORNADAS

                                                    $.ajax({
                                                        data: {
                                                            idCiudadViaFiltro: idCiudadViaFiltro,
                                                            idMesViaFiltro: idMesViaFiltro,
                                                            idViaFiltro: idViaFiltro,
                                                        },
                                                        url: "models/metricas.php",
                                                        type: "post",
                                                        dataType: "json",
                                                        beforeSend: function() {},
                                                        success: function(data) {
                                                            mf = data.totalMananaFiltro;
                                                            tf = data.totalTardeFiltro;
                                                            nf = data.totalNocheFiltro;

                                                            $("#jornadaMananaCiudadVias").text(mf);
                                                            $("#jornadaTardeCiudadVias").text(tf);
                                                            $("#jornadaNocheCiudadVias").text(nf);
                                                        },
                                                        error: function() {
                                                            alert("error");
                                                        },
                                                    });

                                                    path7ma.remove(mymap);
                                                    marker7Ma.remove(mymap);
                                                    pathNorte.remove(mymap);
                                                    markerNorte.remove(mymap);
                                                    pathCalle80.remove(mymap);
                                                    markerCalle80.remove(mymap);
                                                    pathBoyaca.remove(mymap);
                                                    markerBoyaca.remove(mymap);
                                                    pathCalle26.remove(mymap);
                                                    markerCalle26.remove(mymap);
                                                    pathCalle100.remove(mymap);
                                                    markerCalle100.remove(mymap);
                                                    pathNqs.remove(mymap);
                                                    markerNQS.remove(mymap);
                                                    pathCra15.remove(mymap);
                                                    markerCra15.remove(mymap);
                                                    pathCalle68.remove(mymap);
                                                    markerCalle68.remove(mymap);
                                                    pathCali.remove(mymap);
                                                    markerAvCali.remove(mymap);
                                                    pathSuba.remove(mymap);
                                                    markerAvSuba.remove(mymap);
                                                    sidebarMapa.hide();

                                                    polylinePointAvSubaFiltro = [
                                                        [4.745589874126129, -74.09529414577177],
                                                        [4.741917311243669, -74.09074369576561],
                                                        [4.741166323026945, -74.08943561692337],
                                                        [4.738091513702233, -74.08646400303176],
                                                        [4.738091513702233, -74.08646400303176],
                                                        [4.736929600509619, -74.08263929431048],
                                                        [4.735739346066315, -74.0815587074408],
                                                        [4.734464071175423, -74.079724553412],
                                                        [4.7338406025953494, -74.07830272858348],
                                                        [4.732820379968073, -74.07699464982264],
                                                        [4.7326420247388885, -74.07581399382671],
                                                        [4.732103573216848, -74.07508886316418],
                                                        [4.727640077371133, -74.07484715294332],
                                                        [4.720998973416764, -74.07479412537367],
                                                        [4.720998973416764, -74.07479412537367],
                                                        [4.710940066461966, -74.07219371312394],
                                                        [4.710940066461966, -74.07219371312394],
                                                        [4.700013130475883, -74.07023352891004],
                                                        [4.700013130475883, -74.07023352891004],
                                                        [4.695333023608183, -74.06852713809789],
                                                        [4.691272511072446, -74.06609321632628],
                                                        [4.688939023981756, -74.06525986268196],
                                                    ];

                                                    antPathAvSubaFiltro = L.polyline.antPath;

                                                    pathAvSubaFiltro = antPathAvSubaFiltro(
                                                        polylinePointAvSubaFiltro, {
                                                            paused: false,
                                                            reverse: false,
                                                            delay: 3000,
                                                            dashArray: [10, 20],
                                                            weight: 7,
                                                            opacity: 0.9,
                                                            color: "#922B21",
                                                            pulseColor: "#FFFFFF",
                                                        }
                                                    );
                                                    pathAvSubaFiltro.addTo(mymap);

                                                    markerAvSubaFiltro = L.marker([
                                                            4.7326420247388885, -74.07581399382671,
                                                        ])
                                                        .addTo(mymap)
                                                        .on("click", function() {
                                                            mymap.setView(
                                                                new L.LatLng(
                                                                    4.7326420247388885, -74.07581399382671
                                                                ),
                                                                14
                                                            );
                                                            sidebarMapaFiltro.toggle();
                                                            //content = 'Américas' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                                                            contentAvSubaFiltro =
                                                                '<br><br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Avenida Suba</h2></div>' +
                                                                '<img style="width: 100%; height: 35%;" src="views/dist/images/avenidaSuba.jpeg"></img>' +
                                                                "<br><br>" +
                                                                '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                                                '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                                                '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                                                "</tr>" +
                                                                '<tr style="font-size:15px; font-weight:bold">' +
                                                                "<td>" +
                                                                personasAvSuba +
                                                                "</td>" +
                                                                "<td>" +
                                                                CarrosAvSuba +
                                                                "</td>" +
                                                                "<td>" +
                                                                MotosAvSuba +
                                                                "</td>" +
                                                                "<td>" +
                                                                BicicletasAvSuba +
                                                                "</td>" +
                                                                "<td>" +
                                                                MascotasAvSuba +
                                                                "</td>" +
                                                                "</tr>" +
                                                                "</table>" +
                                                                '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                                                totalAlcanceAvSuba +
                                                                "</h3></div>";
                                                            sidebarMapaFiltro.setContent(contentAvSubaFiltro);
                                                        });

                                                    $("#totalPersonasCiudad").text(personasAvSuba);
                                                    $("#totalCarrosCiudad").text(CarrosAvSuba);
                                                    $("#totalMotosCiudad").text(MotosAvSuba);
                                                    $("#totalBicicletasCiudad").text(BicicletasAvSuba);
                                                    $("#totalMascotasCiudad").text(MascotasAvSuba);
                                                    $("#alcanceTotalCiudad").text(totalAlcanceAvSuba);
                                                } else {
                                                    if (idViaFiltro == 21) {
                                                        //Calle26

                                                        $.ajax({
                                                            //TABLAVIAS
                                                            data: { idVia: idVia, idCiudadVia: idCiudadVia },
                                                            url: "models/metricas.php",
                                                            type: "post",
                                                            beforeSend: function() {},
                                                            success: function(response) {
                                                                $("#idTramoCiudadVias").html(response);
                                                                cargartablaVias(idCiudadVia, idVia);
                                                                cargartablaTramos();
                                                            },
                                                            error: function() {
                                                                alert("error");
                                                            },
                                                        });

                                                        ///JORNADAS

                                                        $.ajax({
                                                            data: {
                                                                idCiudadViaFiltro: idCiudadViaFiltro,
                                                                idMesViaFiltro: idMesViaFiltro,
                                                                idViaFiltro: idViaFiltro,
                                                            },
                                                            url: "models/metricas.php",
                                                            type: "post",
                                                            dataType: "json",
                                                            beforeSend: function() {},
                                                            success: function(data) {
                                                                mf = data.totalMananaFiltro;
                                                                tf = data.totalTardeFiltro;
                                                                nf = data.totalNocheFiltro;

                                                                $("#jornadaMananaCiudadVias").text(mf);
                                                                $("#jornadaTardeCiudadVias").text(tf);
                                                                $("#jornadaNocheCiudadVias").text(nf);
                                                            },
                                                            error: function() {
                                                                alert("error");
                                                            },
                                                        });

                                                        path7ma.remove(mymap);
                                                        marker7Ma.remove(mymap);
                                                        pathNorte.remove(mymap);
                                                        markerNorte.remove(mymap);
                                                        pathCalle80.remove(mymap);
                                                        markerCalle80.remove(mymap);
                                                        pathBoyaca.remove(mymap);
                                                        markerBoyaca.remove(mymap);
                                                        pathCalle26.remove(mymap);
                                                        markerCalle26.remove(mymap);
                                                        pathCalle100.remove(mymap);
                                                        markerCalle100.remove(mymap);
                                                        pathNqs.remove(mymap);
                                                        markerNQS.remove(mymap);
                                                        pathCra15.remove(mymap);
                                                        markerCra15.remove(mymap);
                                                        pathCalle68.remove(mymap);
                                                        markerCalle68.remove(mymap);
                                                        pathCali.remove(mymap);
                                                        markerAvCali.remove(mymap);
                                                        pathSuba.remove(mymap);
                                                        markerAvSuba.remove(mymap);
                                                        sidebarMapa.hide();

                                                        polylinePointCalle26Filtro = [
                                                            [4.611714721350147, -74.06984279877713],
                                                            [4.611933603155686, -74.06996257666039],
                                                            [4.612072891542268, -74.07050656788013],
                                                            [4.61240121405971, -74.07093577196176],
                                                            [4.614256730910411, -74.07183410608074],
                                                            [4.62149038756754, -74.07671069113424],
                                                            [4.627272996379458, -74.08104281159295],
                                                            [4.627272996379458, -74.08104281159295],
                                                            [4.629192105171596, -74.08238551554619],
                                                            [4.630227411600797, -74.08296819842005],
                                                            [4.632171763482662, -74.08448824069968],
                                                            [4.635100906872885, -74.09110042461614],
                                                            [4.63568168394574, -74.09180977759164],
                                                            [4.653868181380869, -74.10358916153443],
                                                            [4.653868181380869, -74.10358916153443],
                                                            [4.6668112855756565, -74.11172499236258],
                                                            [4.679286340819578, -74.11923499007025],
                                                            [4.679286340819578, -74.11923499007025],
                                                            [4.67876655127508, -74.11949575388857],
                                                            [4.67876655127508, -74.11949575388857],
                                                            [4.682820899627214, -74.12179047536664],
                                                            [4.68552378526401, -74.12554547426696],
                                                        ];

                                                        antPathCalle26Filtro = L.polyline.antPath;

                                                        pathCalle26Filtro = antPathCalle26Filtro(
                                                            polylinePointCalle26Filtro, {
                                                                paused: false,
                                                                reverse: false,
                                                                delay: 3000,
                                                                dashArray: [10, 20],
                                                                weight: 7,
                                                                opacity: 0.9,
                                                                color: "#922B21",
                                                                pulseColor: "#FFFFFF",
                                                            }
                                                        );
                                                        pathCalle26Filtro.addTo(mymap);

                                                        markerCalle26Filtro = L.marker([
                                                                4.632171763482662, -74.08448824069968,
                                                            ])
                                                            .addTo(mymap)
                                                            .on("click", function() {
                                                                mymap.setView(
                                                                    new L.LatLng(
                                                                        4.632171763482662, -74.08448824069968
                                                                    ),
                                                                    14
                                                                );
                                                                sidebarMapaFiltro.toggle();
                                                                //content = 'Américas' + ' <br>' + 'Alcance: ' + alcanceCiudad[0] + '<br>' + 'Personas: ' + personasAutoNorte + '<br>' + 'Carros: ' + carrosBogota + '<br>' + 'Motos: ' + motosBogota + '<br>' + 'Bicicletas: ' + bicicletasBogota + '<br>' + 'Mascotas: ' + mascotasBogota;
                                                                contentCalle26Filtro =
                                                                    '< br > <br><div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h2>Calle 26</h2></h2></div>' +
                                                                    '<img style="width: 100%; height: 35%;" src="views/dist/images/calle26.jpg"></img>' +
                                                                    "<br><br>" +
                                                                    '<table style="text-align: center;" class="table table-bordered table table-sm" >' +
                                                                    '<tr style="background: #3E50F6; color: #fff; ; font-size:15px;">' +
                                                                    '<th><i class="fas fa-walking"></i> Personas</th><th><i class="fas fa-car-side"></i> Carros</th><th> <i class="fas fa-motorcycle"></i> Motos</th><th><i class="fas fa-bicycle"></i> Bicicletas</th><th><i class="fas fa-paw"></i> Mascotas</th>' +
                                                                    "</tr>" +
                                                                    '<tr style="font-size:15px; font-weight:bold">' +
                                                                    "<td>" +
                                                                    personasCalle26 +
                                                                    "</td>" +
                                                                    "<td>" +
                                                                    CarrosCalle26 +
                                                                    "</td>" +
                                                                    "<td>" +
                                                                    MotosCalle26 +
                                                                    "</td>" +
                                                                    "<td>" +
                                                                    BicicletasCalle26 +
                                                                    "</td>" +
                                                                    "<td>" +
                                                                    MascotasCalle26 +
                                                                    "</td>" +
                                                                    "</tr>" +
                                                                    "</table>" +
                                                                    '<div class="form-group text-center" style="background: #3E50F6; color: #fff;"><h3>Alcance: ' +
                                                                    totalAlcanceCalle26 +
                                                                    "</h3></div>";
                                                                sidebarMapaFiltro.setContent(
                                                                    contentCalle26Filtro
                                                                );
                                                            });

                                                        $("#totalPersonasCiudad").text(personasCalle26);
                                                        $("#totalCarrosCiudad").text(CarrosCalle26);
                                                        $("#totalMotosCiudad").text(MotosCalle26);
                                                        $("#totalBicicletasCiudad").text(BicicletasCalle26);
                                                        $("#totalMascotasCiudad").text(MascotasCalle26);
                                                        $("#alcanceTotalCiudad").text(totalAlcanceCalle26);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

function cargartablaVias(idCiudadVia, idViaCiudadS) {
    tablaVias = $("#tablaVias").DataTable();
    tablaVias.destroy();

    $("#tablaVias").DataTable({
        ajax: {
            processing: true,
            method: "POST",
            url: "models/metricas.php",
            data: { idCiudadVia: idCiudadVia, idViaCiudadS: idViaCiudadS },
            dataSrc: "",
        },

        columns: [{
                data: "Via",
            },

            {
                data: "totalPersonasVias",
            },

            {
                data: "totalCarrosVias",
            },

            {
                data: "totalMotosVias",
            },

            {
                data: "totalBicicletasVias",
            },

            {
                data: "totalMascotasVias",
            },
        ],

        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sSearch: "Buscar:",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior",
                decimal: ".", //separador decimales
                thousands: ",", //Separador miles
            },
        },

        columnDefs: [{ className: "dt-center", targets: "_all" }],

        sLengthMenu: false,
        dom: "Bfrtip",
        buttons: ["excel", "pdf", "print"],
    });
}

function cargartablaTramos() {
    tablaVias = $("#tablaTramos").DataTable();
    tablaVias.destroy();

    $("#tablaTramos").DataTable({
        /* ajax: {
             "processing": true,
             method: "POST",
             url: "models/metricas.php",
             data: { idCiudadVia: idCiudadVia, idViaCiudadS: idViaCiudadS },
             dataSrc: "",
         },
 
         columns: [
 
             {
                 data: "Via"
             },
 
             {
                 data: "totalPersonasVias"
             },
 
             {
                 data: "totalCarrosVias"
             },
 
             {
                 data: "totalMotosVias"
             },
 
             {
                 data: "totalBicicletasVias"
             },
 
             {
                 data: "totalMascotasVias"
             }
 
         ],*/

        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sSearch: "Buscar:",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior",
                decimal: ".", //separador decimales
                thousands: ",", //Separador miles
            },
        },

        columnDefs: [{ className: "dt-center", targets: "_all" }],

        sLengthMenu: false,
        dom: "Bfrtip",
        buttons: ["excel", "pdf", "print"],
    });
}

$("#idMesViaCiudades").on("change", function() {
    ciudades = $.trim($("#idCiudades").val());
    mesViaCiudad = $.trim($("#idMesViaCiudades").val());

    if (mesViaCiudad == 13) {
        Swal.fire({
            //title: "!",
            text: "¡Por favor seleccionar un mes!",
            type: "info",
        }).then(function() {
            window.location = "ciudadesVias";
        });
    } else {
        if (ciudades == 1) {
            $.ajax({
                data: { ciudades: ciudades, mesViaCiudad: mesViaCiudad },
                url: "models/metricas.php",
                type: "post",
                dataType: "json",
                beforeSend: function() {},
                success: function(json) {
                    $("#totalPersonasCiudad").text(json.personasBogota);
                    $("#totalCarrosCiudad").text(json.carrosBogota);
                    $("#totalMotosCiudad").text(json.motosBogota);
                    $("#totalBicicletasCiudad").text(json.bicicletasBogota);
                    $("#totalMascotasCiudad").text(json.mascotasBogota);
                    $("#alcanceTotalCiudad").text(json.totalAlcanceCiudad);

                    cargarMapa(json, ciudades);
                    cargarVias(ciudades);
                },
                error: function() {
                    alert("error");
                },
            });
        } else {
            if (ciudades == 2) {
                $.ajax({
                    data: { ciudades: ciudades, mesViaCiudad: mesViaCiudad },
                    url: "models/metricas.php",
                    type: "post",
                    dataType: "json",
                    beforeSend: function() {},
                    success: function(json) {
                        $("#totalPersonasCiudad").text(json.personasMedellin);
                        $("#totalCarrosCiudad").text(json.carrosMedellin);
                        $("#totalMotosCiudad").text(json.motosMedellin);
                        $("#totalBicicletasCiudad").text(json.bicicletasMedellin);
                        $("#totalMascotasCiudad").text(json.mascotasMedellin);
                        $("#alcanceTotalCiudad").text(json.totalAlcanceCiudad);
                        cargarMapa(json, ciudades);
                        cargarVias(ciudades);
                    },
                    error: function() {
                        alert("error");
                    },
                });
            } else {
                if (ciudades == 3) {
                    $.ajax({
                        data: { ciudades: ciudades, mesViaCiudad: mesViaCiudad },
                        url: "models/metricas.php",
                        type: "post",
                        dataType: "json",
                        beforeSend: function() {},
                        success: function(json) {
                            $("#totalPersonasCiudad").text(json.personasCali);
                            $("#totalCarrosCiudad").text(json.carrosCali);
                            $("#totalMotosCiudad").text(json.motosCali);
                            $("#totalBicicletasCiudad").text(json.bicicletasCali);
                            $("#totalMascotasCiudad").text(json.mascotasCali);
                            $("#alcanceTotalCiudad").text(json.totalAlcanceCiudad);

                            cargarMapa(json, ciudades);
                            cargarVias(ciudades);
                        },
                        error: function() {
                            alert("error");
                        },
                    });
                }
            }
        }
    }
});

///////////FIN VIAS CIUDADES////////////////////////

///////////LEFT SIDEBAR////////////////////////

// create the sidebar instance and add it to the map
/*sidebarleft = L.control.sidebar({ container: 'sidebarLeft' })
    .addTo(mymap)
    .open('home');

// add panels dynamically to the sidebar
sidebarleft
    .addPanel({
        id: 'js-api',
        tab: '<i class="fas fa-layer-group"></i>',
        title: 'JS API',
        pane: '<p>The Javascript API allows to dynamically create or modify the panel state.<p/><p><button onclick="sidebar.enablePanel(\'mail\')">enable mails panel</button><button onclick="sidebar.disablePanel(\'mail\')">disable mails panel</button></p><p><button onclick="addUser()">add user</button></b>',
    })
    // add a tab with a click callback, initially disabled
    .addPanel({
        id: 'mail',
        tab: '<i class="fa fa-envelope"></i>',
        title: 'Messages',
        button: function () { alert('opened via JS callback') },
        disabled: true,
    })

// be notified when a panel is opened
sidebarleft.on('content', function (ev) {
    switch (ev.id) {
        case 'autopan':
            sidebarleft.options.autopan = true;
            break;
        default:
            sidebarleft.options.autopan = false;
    }
});
*/

///////////ESTRATIFICACION////////////////////////

function colorPuntosEstratos(d) {
    return d == "0" ?
        "#808080" :
        d == "1" ?
        "#50e4ea" :
        d == "2" ?
        "#57d658" :
        d == "3" ?
        "#B939EC" :
        d == "4" ?
        "#656600" :
        d == "5" ?
        "#2b5480" :
        d == "6" ?
        "#FFFF00" :
        "#000000";
}

function estiloEstratos(feature) {
    return {
        radius: 8,
        fillColor: colorPuntosEstratos(feature.properties.Estrato),
        color: colorPuntosEstratos(feature.properties.Estrato),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
    };
}

function estilosCicloRutasBta(feature) {
    return {
        radius: 8,
        fillColor: "#009321",
        color: "#009321",
        weight: 5,
        opacity: 1,
        fillOpacity: 0.8,
    };
}

function estilosRutasTM(feature) {
    return {
        radius: 8,
        fillColor: "#FF9633",
        color: "#FF9633",
        weight: 3.5,
        opacity: 1,
        fillOpacity: 0.9,
    };
}

function popup_monumentos(feature, layer) {
    layer.bindPopup(
        "<div style=text-align:center><h3>Estrato: " + feature.properties.Estrato,

        { minWidth: 150, maxWidth: 200 }
    );
}

var MarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

var MarkerOptionsEstacionesTM = {
    radius: 8,
    fillColor: "#FF3333 ",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

function myFunction() {
    estratos = L.geoJSON(estratoMapa, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, MarkerOptions);
        },
        style: estiloEstratos,
        onEachFeature: popup_monumentos,
    });

    capaEstratos.addLayer(estratos);
}

function estratoSelect() {
    miSelect = document.getElementById("idEstratos").value;

    estratos = L.geoJSON(estratoMapa, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, MarkerOptions);
        },
        filter: function(feature, layer) {
            if (miSelect != "7") return feature.properties.Estrato == miSelect;
            else return false;
        },
        style: estiloEstratos,
        onEachFeature: popup_monumentos,
    });

    if (miSelect == "7") {
        capaEstratos.clearLayers();
    }

    capaEstratos.addLayer(estratos);
}

///////////FIN ESTRATIFICACION////////////////////////

///////////VALLAS////////////////////////////////////

function colorPuntos(d) {
    return d == "0" ?
        "#FF0000" :
        d == "1" ?
        "#fdcd5a" :
        d == "2" ?
        "#57d658" :
        d == "3" ?
        "#B939EC" :
        d == "4" ?
        "#4cc5c8" :
        d == "5" ?
        "#2b5480" :
        d == "6" ?
        "#FFFF00" :
        "#000000";
}

function estiloVallas(feature) {
    return {
        radius: 1,
        fillColor: colorPuntos(feature.properties.Nombre),
        color: colorPuntos(feature.properties.Nombre),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
    };
}

function popup_vallas(feature, layer) {
    seleccionItem = selectValla;

    if (seleccionItem == 1) {
        layer.bindPopup(
            "<div style=text-align:center><h6 style='font-weight: bold'>" +
            feature.properties.DIRECCION +
            "<h2></div><hr><table><tr><td>Número de caras: " +
            feature.properties.NUMERO_CARAS +
            "</td></tr><tr><td>Sentido de la valla: " +
            feature.properties.SENTIDO +
            "</td></tr><tr><td>Propietario: " +
            feature.properties.PROVEEDOR +
            "</td></tr><tr><td>Impactos: " +
            feature.properties.ALCANCE +
            "</td></tr><tr><td>Id: " +
            feature.properties.ID_ELEMENTO +
            "</td></tr><tr><td>idTramo: " +
            feature.properties.ID_TRAMO +
            "</td></tr><tr><td> <button id='prueba' onclick='agregarItems(" +
            feature.properties.ID_ELEMENTO +
            " )' class='btn btn-primary'>Añadir</button>" +
            "</td></tr></table>", { minWidth: 150, maxWidth: 200 }
        );
    } else {
        if (seleccionItem == 2) {
            layer.bindPopup(
                "<div style=text-align:center><h6 style='font-weight: bold'>" +
                feature.properties.NOMBRE +
                "<h2></div><hr><table><tr><td>Localidad: " +
                feature.properties.LOCALIDAD +
                "</td></tr><tr><td>Dirección: " +
                feature.properties.DIRECCION +
                "</td></tr><tr><td>Impactos: " +
                feature.properties.ALCANCE +
                "</td></tr><tr><td>Id: " +
                feature.properties.ID_ELEMENTO +
                "</td></tr><tr><td>idTramo: " +
                feature.properties.ID_TRAMO +
                "</td></tr><tr><td> <button id='prueba' onclick='agregarItems(" +
                feature.properties.ID_ELEMENTO +
                " )' class='btn btn-primary'>Añadir</button>" +
                "</td></tr></table>", { minWidth: 150, maxWidth: 200 }
            );
        } else {
            if (seleccionItem == 3) {
                layer.bindPopup(
                    "<div style=text-align:center><h6 style='font-weight: bold'>" +
                    feature.properties.NOMBRE +
                    "<h2></div><hr><table><tr><td>Dirección: " +
                    feature.properties.DIRECCION +
                    "</td></tr><tr><td>Vía: " +
                    feature.properties.VIA +
                    "</td></tr><tr><td>Tramo: " +
                    feature.properties.TRAMO +
                    "</td></tr><tr><td>No. Vagones: " +
                    feature.properties.NUMERO_VAGONES +
                    "</td></tr><tr><td>No. Accesos: " +
                    feature.properties.NUMERO_ACCESOS +
                    "</td></tr><tr><td>Impactos: " +
                    feature.properties.ALCANCE +
                    "</td></tr><tr><td>Id: " +
                    feature.properties.ID_ELEMENTO +
                    "</td></tr><tr><td>idTramo: " +
                    feature.properties.ID_TRAMO +
                    "</td></tr><tr><td> <button id='prueba' onclick='agregarItems(" +
                    feature.properties.ID_ELEMENTO +
                    " )' class='btn btn-primary'>Añadir</button>" +
                    "</td></tr></table>", { minWidth: 150, maxWidth: 200 }
                );
            }
        }
    }
}

function popup_ciclorutas(feature, layer) {
    layer.bindPopup(
        "<div style=text-align:center><h6>" +
        feature.properties.NOMB_TRAMO +
        "<h2></div><hr><table><tr><td>Dirección: " +
        feature.properties.DIRECCION +
        "</td></tr><tr><td>Horario: " +
        feature.properties.HORARIO +
        "</td></tr></table>", { minWidth: 150, maxWidth: 200 }
    );
}

function popup_estacionesTM(feature, layer) {
    layer.bindPopup(
        "<div style=text-align:center><h6>" +
        feature.properties.nombre_estacion +
        "<h2></div><hr><table><tr><td>Ubicación: " +
        feature.properties.ubicacion_estacion +
        "</td></tr><tr><td>Troncal: " +
        feature.properties.troncal_estacion +
        "</td></tr><tr><td>No. Vagones: " +
        feature.properties.numero_vagones_estacion +
        "</td></tr></table>", { minWidth: 150, maxWidth: 200 }
    );
}

function popup_rutasTroncalesTM(feature, layer) {
    layer.bindPopup(
        "<div style=text-align:center><h6>" +
        feature.properties.route_name_ruta_troncal +
        "<h2></div><hr><table><tr><td>Origen: " +
        feature.properties.origen_ruta_troncal +
        "</td></tr><tr><td>Destino: " +
        feature.properties.destino_ruta_troncal +
        "</td></tr></table>", { minWidth: 150, maxWidth: 200 }
    );
}

MarkerOptionsVallas = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#2b5480",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

iconoVallas = L.icon({
    iconUrl: "views/dist/images/vallaPrueba4.png",
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    shadowUrl: "",
    shadowSize: [35, 50],
    shadowAnchor: [0, 55],
    popupAnchor: [0, -40],
    opacity: 0.9,
});

iconoCentroComercial = L.icon({
    iconUrl: "views/dist/images/ico_cc.png",
    iconSize: [45, 45],
    iconAnchor: [15, 40],
    shadowUrl: "",
    shadowSize: [35, 50],
    shadowAnchor: [0, 55],
    popupAnchor: [0, -40],
    opacity: 0.9,
});

iconoParaderos = L.icon({
    iconUrl: "views/dist/images/ico_transmi.png",
    iconSize: [48, 48],
    iconAnchor: [15, 40],
    shadowUrl: "",
    shadowSize: [35, 50],
    shadowAnchor: [0, 55],
    popupAnchor: [0, -40],
    opacity: 0.9,
});

iconoTroncal = L.icon({
    iconUrl: "views/dist/images/ico_transmi.png",
    iconSize: [48, 48],
    iconAnchor: [15, 40],
    shadowUrl: "",
    shadowSize: [35, 50],
    shadowAnchor: [0, 55],
    popupAnchor: [0, -40],
    opacity: 0.9,
});

iconoTienda = L.icon({
    iconUrl: "views/dist/images/tienda.png",
    iconSize: [45, 45],
    iconAnchor: [15, 40],
    shadowUrl: "",
    shadowSize: [35, 50],
    shadowAnchor: [0, 55],
    popupAnchor: [0, -40],
    opacity: 0.9,
});

function mostrarVallas() {


    selectValla = document.getElementById("idVallas").value;

    itemSeleccionado = L.geoJSON(sitiosInteres, {
        pointToLayer: function(feature, latlng) {
            if (selectValla == 1) {
                return L.marker(latlng, { icon: iconoVallas });
            } else {
                if (selectValla == 2) {
                    return L.marker(latlng, { icon: iconoCentroComercial });
                } else {
                    if (selectValla == 3) {
                        return L.marker(latlng, { icon: iconoTroncal });
                    }
                }
            }

        },
        filter: function(feature, layer) {
            if (selectValla != "6") return feature.properties.ID_TIPO == selectValla;
            else return false;
        },

        onEachFeature: popup_vallas,
    });

    capaVallas.addLayer(itemSeleccionado);

    if (selectValla == "6") {
        capaVallas.clearLayers(itemSeleccionado);
    }


}



function vallaSelect() {
    miSelect = document.getElementById("idVallas").value;

    vallasB = L.geoJSON(vallasPunto, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, { icon: Icono });
        },
        filter: function(feature, layer) {
            if (miSelect != "TODOS")
                return L.marker(feature.properties.Estrato == miSelect);
            else return false;
        },
        style: estiloEstratos,
        onEachFeature: popup_monumentos,
    });

    //capaEstratos.clearLayers();
    capaEstratos.addLayer(estratos);
}

//////PUNTOS DE INTERES/////////////////////

function mostrarPuntosInteres() {
    idPuntoInteres = document.getElementById("idPuntosInteres").value;

    if (idPuntoInteres == 1) {
        cicloruta = L.geoJSON(cicloviasBogota, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: Icono });
            },
            style: estilosCicloRutasBta,
            onEachFeature: popup_ciclorutas,
        });
        capaCiclorutas.addLayer(cicloruta);
    } else {
        if (idPuntoInteres == 2) {
            parquesBta = L.geoJSON(parquesBogota, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, MarkerOptions);
                },
                onEachFeature: popup_ciclorutas,
            });
            capaParquesBta.addLayer(parquesBta);
        } else {
            if (idPuntoInteres == 3) {
                estacionesTM = L.geoJSON(estacionesTrasmilenio, {
                    pointToLayer: function(feature, latlng) {
                        return L.circleMarker(latlng, MarkerOptionsEstacionesTM);
                    },
                    onEachFeature: popup_estacionesTM,
                });
                capaEstacionesTrasmilenio.addLayer(estacionesTM);
            } else {
                if (idPuntoInteres == 4) {
                    rutasTM = L.geoJSON(rutasTroncalesTransmilenio, {
                        pointToLayer: function(feature, latlng) {
                            return L.circleMarker(latlng, MarkerOptions);
                        },
                        style: estilosRutasTM,
                        onEachFeature: popup_rutasTroncalesTM,
                    });
                    capaRutasTroncalesTrasmilenio.addLayer(rutasTM);
                } else {
                    if (idPuntoInteres == 5) {
                        capaCiclorutas.clearLayers();
                        capaParquesBta.clearLayers();
                        capaEstacionesTrasmilenio.clearLayers();
                        capaRutasTroncalesTrasmilenio.clearLayers();
                    }
                }
            }
        }
    }
}

//////FIN PUNTOS DE INTERES/////////////////////

//////////////AGREGAR ITEMS VALLAS/////////////

function agregarItems(idValla) {
    carritoValla.push(idValla);

    carritoValla = carritoValla.filter((item, index) => {
        return carritoValla.indexOf(item) === index;
    });

    calcularTotalVallas();
    renderizarCarritoVallas();
    guardarCarritoEnLocalStorage();
}

function renderizarCarritoVallas() {
    let divValla = document.getElementById("divVallas");
    divValla.style.display = "block";

    const DOMcarritoValla = document.querySelector("#carritoVallauL");
    // Vaciamos todo el html
    DOMcarritoValla.textContent = "";
    // Quitamos los duplicados
    const carritoVallaSinDuplicados = [...new Set(carritoValla)];
    // Generamos los Nodos a partir de carrito
    carritoVallaSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos

        vallasBta = L.geoJSON(sitiosInteres, {
            filter: function(feature) {
                if (feature.properties.ID_ELEMENTO == item)
                    return (
                        (nombreValla = feature.properties.NOMBRE),
                        (direccion = feature.properties.DIRECCION),
                        (alcanceVallaCreada = feature.properties.ALCANCE),
                        (idTipoElemento = feature.properties.ID_TIPO)
                    );
                else return false;
            },
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carritoValla.reduce((total, itemId) => {
            //¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? (total += 1) : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const itemValla = document.createElement("li");
        itemValla.classList.add(
            "list-group-item",
            "py-2",
            "text-right",
            "mx-2",
            "font-weight-bold"
        );
        itemValla.style["font-size"] = "12px";

        if (idTipoElemento == 1) {
            nombreElemento = "Valla";
        } else {
            if (idTipoElemento == 2) {
                nombreElemento = "Centro Comercial";
            } else {
                if (idTipoElemento == 3) {
                    nombreElemento = "Estacion Transmilenio";
                }
            }
        }

        itemValla.textContent =
            nombreElemento +
            " - " +
            nombreValla +
            " - " +
            direccion +
            " - " +
            "Alcance: " +
            alcanceVallaCreada;

        const miBotonValla = document.createElement("button");
        miBotonValla.classList.add("btn", "btn-danger", "mx-2", "btn-sm");
        miBotonValla.textContent = "X";
        miBotonValla.style.marginLeft = "1rem";
        miBotonValla.dataset.item = item;
        miBotonValla.addEventListener("click", borrarItemValla);

        itemValla.appendChild(miBotonValla);
        DOMcarritoValla.appendChild(itemValla);
    });
}

function borrarItemValla(evento) {
    const id = evento.target.dataset.item;
    carritoValla = carritoValla.filter((idValla) => {
        return !(idValla == id);
    });

    renderizarCarritoVallas();
    calcularTotalVallas();
    guardarCarritoEnLocalStorage();
}

function calcularTotalVallas() {
    const DOMtotal = document.querySelector("#totalAlcance");
    const conteoItems = document.querySelector("#itemsSeleccionados");
    total = 0;
    carritoValla.forEach((item) => {
        valorValla = L.geoJSON(sitiosInteres, {
            filter: function(feature) {
                if (feature.properties.ID_ELEMENTO == item)
                    return (
                        (valor = feature.properties.ALCANCE),
                        (idTramo = feature.properties.ID_TRAMO)
                    );
                else return false;
            },
        });

        if (idTramo == idTramo) {
            total = total + valor;
        }
    });
    // Renderizamos el precio en el HTML
    DOMtotal.textContent = total;
    conteoItems.textContent = carritoValla.length;
}

function vaciarCarrito() {
    // Limpiamos los productos guardados
    carritoValla = [];
    // Renderizamos los cambios
    renderizarCarritoVallas();
    calcularTotalVallas();

    localStorage.clear();
}

//EXPORTAR A EXCEL/////////////////

function exportarExcel() {
    totalVallas = 0;

    let myTable =
        "<table id='tablaVallas' class='display compact table table-striped table-bordered dt-responsive nowrap stripe' style='width:100%'><tr><td style='width: 100px; color: red;'>Nombre valla</td>";
    myTable +=
        "<td style='width: 100px; color: red; text-align: right;'>Propietario</td>";
    myTable +=
        "<td style='width: 100px; color: red; text-align: right;'>Numero de caras</td>";
    myTable +=
        "<td style='width: 100px; color: red; text-align: right;'>Sentido</td>";
    myTable +=
        "<td style='width: 100px; color: red; text-align: right;'>Alcance</td>";

    carritoValla.forEach((item) => {
        vallasExp = L.geoJSON(sitiosInteres, {
            filter: function(feature) {
                if (feature.properties.ID_ELEMENTO == item)
                    return (
                        (nombreVallaExp = feature.properties.NOMBRE),
                        (alcanceVallaCreadaExp = feature.properties.ALCANCE),
                        (carasValla = feature.properties.NUMERO_CARAS),
                        (sentidoValla = feature.properties.SENTIDO),
                        (propietario = feature.properties.PROVEEDOR),
                        (alcanceVallas = feature.properties.ALCANCE),
                        (totalVallas = totalVallas + alcanceVallas),
                        (myTable +=
                            "<tr><td style='width: 100px;text-align: right;'>" +
                            nombreVallaExp +
                            "</td>"),
                        (myTable +=
                            "<td style='width: 100px;text-align: right;'>" +
                            propietario +
                            "</td>"),
                        (myTable +=
                            "<td style='width: 100px;text-align: right;'>" +
                            carasValla +
                            "</td>"),
                        (myTable +=
                            "<td style='width: 100px;text-align: right;'>" +
                            sentidoValla +
                            "</td>"),
                        (myTable +=
                            "<td style='width: 100px;text-align: right;'>" +
                            alcanceVallaCreadaExp +
                            "</td>"),
                        (myTable += "</tr>")
                    );
                else return false;
            },
        });
    });
    (myTable +=
        "<tfoot<tr><th>Total</th><th>" + totalVallas + "</th></tr></tfoot>"),
    (myTable += "</table>");
    document.getElementById("items2").innerHTML = myTable;

    //exporta archivo excel

    // Variable to store the final csv data
    var csv_data = [];

    // Get each row data
    var div2 = document.getElementById("tablaVallas");
    var rows = div2.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        // Get each column data
        var cols = rows[i].querySelectorAll("td,th");

        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
            // Get the text data of each cell
            // of a row and push it to csvrow
            csvrow.push(cols[j].innerHTML);
        }

        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }

    // Combine each row data with new line character
    csv_data = csv_data.join("\n");

    // Call this function to download csv file
    downloadCSVFile(csv_data);
}

function downloadCSVFile(csv_data) {
    // Create CSV file object and feed
    // our csv_data into it
    CSVFile = new Blob([csv_data], {
        type: "text/csv",
    });

    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement("a");

    // Download csv file
    temp_link.download = "reporteKornerPlus.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem("carritoValla", JSON.stringify(carritoValla));
}

function cargarCarritoDeLocalStorage() {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem("carritoValla") !== null) {
        // Carga la información
        carritoValla = JSON.parse(miLocalStorage.getItem("carritoValla"));
    }
}

function cerrarCarrito() {
    let divValla = document.getElementById("divVallas");
    divValla.style.display = "none";
    //vaciarCarrito();
}
//////////////FIN AGREGAR ITEMS VALLAS/////////////
/////////////////LEYENDA/////////////////////////
// Leyenda.
leyenda = L.control({ position: "bottomleft" });
leyenda.onAdd = function(mymap) {
    div = L.DomUtil.create("div", "info leyenda");
    div.innerHTML +=
        '<img alt="legend" src=" views/dist/images/leyenda.png " width="125" height="150" />';
    return div;
};
leyenda.addTo(mymap);

// Leyenda. CARRITO
carroMapa = L.control({ position: "topright" });
carroMapa.onAdd = function(mymap) {
    div = L.DomUtil.create("div", "container");

    div.innerHTML +=
        "<div class='row' id='divVallas'>" +

        "<div class='row'  id='selectDivElementos'>" +
        "<div class='card collapsed-card' style=' height: 100%; width= 100%;'>" +
        "<div class='card-header' style='background-color: #3E50F6; color: #fff;'><b>ITEMS SELECCIONADOS: </b> <span style='font-size: 12px;' id='itemsSeleccionados' class='badge badge-warning right font-weight-bold'></span> " +
        "<div class='card-tools'>" +
        "<button type='button' class='btn btn-tool' data-card-widget='collapse' title='Collapse'>" +
        "<i style= 'color: #fff;' class='fas fa-plus'></i></button>" +
        "</div>" +
        "</div>" +
        "<div class='card-body p-0'>" +
        "<aside class='col-sm-12 ' style='background-color:#fff;'><hr/>" +
        "<h5>Items seleccionados: <span id='itemsSeleccionados' class='font-weight-bold'></span> </h5>" +
        "<main style='height:250px; overflow-y:scroll;'><ul id='carritoVallauL' class='list-group text-left'></ul></main>" +
        "<hr/> <p class= 'text-left font-weight-bold'>TOTAL IMPACTOS: <span id='totalAlcance' class='font-weight-bold'></span></p>" +
        "<main style='display: grid; grid-gap: 2rem; grid-template-columns: 45px 45px 45px 45px 45px;'><div><button id='boton-vaciar' class='btn btn-danger btn-sm'>Vaciar</button></div>" +
        "<div><button id='exportarExcel' class='btn btn-success btn-sm' onclick='exportarExcel()'>Exportar</button></div>" +
        "</main><hr/></aside>" +
        "</div>";
    "</div>";
    return div;
};
carroMapa.addTo(mymap);

// Leyenda. ELEMENTOS
desplegable = L.control({ position: "topleft" });
desplegable.onAdd = function(mymap) {
    div = L.DomUtil.create("div", "container");

    div.innerHTML +=
        "<div class='row'  id='selectDivElementos'>" +
        "<div class='card  collapsed-card'>" +
        "<div class='card-header' style='background-color: #3E50F6; color: #fff;'><b>CAPAS</b></h3>" +
        "<div class='card-tools'>" +
        "<button type='button' class='btn btn-tool' data-card-widget='collapse' title='Collapse'>" +
        "<i style= 'color: #fff;' class='fas fa-plus'></i></button>" +
        "</div>" +
        "</div>" +

        "<div class='card-body p-3'>" +

        "<div class='inputs' id='years' style='display: inline-block; white-space: normal;'> " +
        "<span><b>ELEMENTOS</b></span><hr/>" +

        "<input type='checkbox' class='year' name='1890' value='1' >     " +
        "<label for='Vallas'>Vallas</label></br>" +
        "<input type='checkbox' class='year' value='2' >     " +
        "<label for='Centros comerciales'>Centros comerciales</label> </br>" +
        "<input type='checkbox' class='year' value='3' >     " +
        "<label for='Estaciones troncales Trasmilenio'>Estaciones troncales Trasmilenio</label>" +
        "</div><hr/>" +

        "<select class='form-control' name='idVallas' id='idVallas' onchange='mostrarVallas()'>" +
        "<option value='8'>Seleccionar elemento...</option>" +
        "<option value='1'>Mostrar vallas</option><option value='2'>Mostrar Centros comerciales</option>" +
        "<option value='3'>Estaciones troncales Transmilenio</option>" +
        "<option value='6'>Remover</option></select>  <br>" +
        "<span><b>ESTRATIFICACIÓN</b></span>" +
        "<select class='form-control' name='idEstratos' id='idEstratos' onchange='estratoSelect()'><option value='TODOS'>Seleccione un estrato</option>" +
        "<option value='1'>Estrato 1</option>" +
        "<option value='2'>Estrato 2</option>" +
        "<option value='3'>Estrato 3</option>" +
        "<option value='4'>Estrato 4</option>" +
        "<option value='5'>Estrato 5</option>" +
        "<option value='6'>Estrato 6</option>" +
        "<option value='7'>Remover capa</option></select>  <br>" +
        "<span><b>PUNTOS DE INTERES</b></span>" +
        "<select class='form-control' name='idPuntosInteres' id='idPuntosInteres' onchange='mostrarPuntosInteres()'>" +
        "<option value='7' selected>Seleccionar punto de interes...</option>" +
        "<option value='1'>Ciclorutas</option>" +
        "<option value='4'>Rutas troncales Transmilenio</option>" +
        "<option value='5'>Remover capas</option></select>" +
        "</div>" +
        "</div>" +
        "</div>";

    return div;

};
desplegable.addTo(mymap);

/////////////////FIN LEYENDA/////////////////////////