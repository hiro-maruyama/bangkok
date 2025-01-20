import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
    container: 'map',
    center: [100.51, 13.77],
    minZoom: 7,
    maxZoom:18,
    style:{
        version: 8,
        sources: {
            osm: {
                type: 'raster',
                tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                maxzoom:19,
                tileSize: 256,
                attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
        // 人口と駅までの距離レイヤ
            popsta: {
                type: 'geojson',
//                data: './bangkok/polygon1km_pop-dis.geojson',
                data: `${location.href.replace('index.html','')}bangkok/polygon1km_pop-dis.geojson`,
                attribution: '<a href=https://"https://data.humdata.org/dataset/worldpop-population-density-for-thailand">Thailand-Population Density</a>',
            },
        // railway data from OSM
            railway:{
                type: 'geojson',
 //               data: './bangkok/hotosm_tha_railways_lines.geojson',
                data: `${location.href.replace('index.html','')}bangkok/hotosm_tha_railways_lines.geojson`,
                attribution: '<a href=https://"https://data.humdata.org/dataset/hotosm_tha_railways">Thailand Railways (OpenStreetMap Export)</a>',
            },
            station:{
                type: 'geojson',
                data: `${location.href.replace('index.html','')}bangkok/hotosm_tha_railways_points.geojson`,
                attribution: '<a href=https://"https://data.humdata.org/dataset/hotosm_tha_railways">Thailand Railways (OpenStreetMap Export)</a>',
            }
        },

        layers: [
            {
                id:'osm-layer',
                source: 'osm',
                type: 'raster',
            },
            {
                id: 'pop-station-Layer',
                source: 'popsta',
                type: 'fill',
                paint:{
                    'fill-color':[
                        'interpolate',
                        ['linear'],
                        ['get', 'z'],
                        0,
                        '#ffffff',
                        100,
                        '#ffcccc',
                        1000,
                        '#ffaaaa',
                        5000,
                        '#ff8888',
                        10000,
                        '#ff6666',
                        30000,
                        '#ff0000'
                    ],
                    'fill-opacity': 0.4,
                },
                layout: {visibility: "visible"},
            },
            {
                id: 'railway-Layer',
                source: 'railway',
                type: 'line',
                paint: {
                    'line-color': '#b34059',
                    'line-width': 4,
                },
            },
            {
                id: 'station-Layer',
                source: 'station',
                type: 'circle',
                paint: {
                    'circle-color': '#0000ff',
                },
            },
        ],
    },

  });


  // action to the map
  map.on('load', () => {
      map.on('click',(e) => {
        // check whether pop data exists
          const features = map.queryRenderedFeatures(e.point,{
            layers: [
                'pop-station-Layer',
            ],
          });
          const popfeas =map.queryRenderedFeatures({layers: ['pop-station-Layer',]});
//          if (features.length == 0) return;

 
/*          var setcnt=[];
          let i;
          var id_num;var id_num2;
          var pop_d2;var dis22s;
          const thres=1000.0;
          var total_p=0;var ac_p=0;

            for (i=0;i < 1877;i++){
                setcnt[setcnt.length]=0;
            }; */
            if (features.length == 0) {
 /*               alert (popfeas.length);

 //               for (let i =0; i <popfeas.length;i++) {
 //               for (i =0; i < 3;i++) {
                    const popfea=popfeas[i];
//                    alert (popfea.properties.pid);
                    id_num=popfea.properties.pid-1;
                    pop_d2=popfea.properties.z;
                    dis22s=popfea.properties.dis2;
                    setcnt[id_num]=setcnt[id_num]+1;
 //                   alert (setcnt[id_num]+':'+id_num);
                    if (setcnt[id_num] < 2) {
                        total_p=total_p+pop_d2;
                        total_p=total_p;
                        if (dis22s < thres) { ac_p=ac_p+pop_d2;}
                    }
                    else if (setcnt[id_num] > 1) {
                        id_num2=id_num+1;
 //                       alert ('id:'+id_num2+setcnt[id_num]);
                    };


                    }; 
                var ratio=Math.round(1000*ac_p/total_p)/10;
                alert ('finish'+i);
                alert ('*** population who live less than '+thres+' m *** \n' +Math.round(ac_p) + '\n'+ '*** total population:*** \n'+Math.round(total_p)+'\n' +ratio+' %');
 */
                return;
            };
 //         else alert('clicked!');
          const feature = features[0];
          var pop_d=feature.properties.z;
          var rpop_d=Math.round(pop_d);
          var dis2s=feature.properties.dis2;
          var rdis2s=Math.round(dis2s);
          const popup = new maplibregl.Popup()
 //             .setLngLat(feature.geometry.coordinates)
              .setLngLat(e.lngLat)
              .setHTML(
                  `\
                <div> population density: ${pop_d}
                </div>\
                 <div> rounded population density: ${rpop_d} /km2
                </div>\   
               <div> distance to station: ${feature.properties.dis2}</div>\                          
              <div> rounded distance to station: ${rdis2s} m</div>`,
              )
              .addTo(map);
      });
  });

  /*
 * チェックボックスのオンオフを元に、レイヤの表示/非表示を切り替えます
 * @param {*} checkbox
 */

const layonoff1=document.getElementById("osm-layer");
const layonoff2=document.getElementById("pop-station-Layer");
const layonoff3=document.getElementById("railway-Layer");
const layonoff4=document.getElementById("station-Layer");


layonoff1.addEventListener('click',() => {
    if(layonoff1.checked==true) {
        map.setLayoutProperty("osm-layer", "visibility", "visible");
 //       alert(" check box of chenged to on");
    } else {
        map.setLayoutProperty("osm-layer", "visibility", "none");
//        alert(" check box chenged to off");    
    }   
});
layonoff2.addEventListener('click', () => {
    if (layonoff2.checked==true) {
        map.setLayoutProperty("pop-station-Layer", "visibility", "visible");
    } else {
  // チェックボックスのチェックが外れた場合、レイヤを非表示にする
        map.setLayoutProperty("pop-station-Layer", "visibility", "none");
    }
});
layonoff3.addEventListener('click', () => {
    if (layonoff3.checked==true) {
        map.setLayoutProperty("railway-Layer", "visibility", "visible");
    } else {
        map.setLayoutProperty("railway-Layer", "visibility", "none");
    }
});
layonoff4.addEventListener('click', () => {
    if (layonoff4.checked==true) {
        map.setLayoutProperty("station-Layer", "visibility", "visible");
    } else {
        map.setLayoutProperty("station-Layer", "visibility", "none");
    }
});

// % popultion for set distance level 

const calButton=document.getElementById('calculation');
calButton.addEventListener('click', () => {
 //   alert('Button pushed');
    const popfeas =map.queryRenderedFeatures({layers: ['pop-station-Layer',]});
 //   alert (popfeas.length);

    const thrnumber=parseInt(document.getElementById('thr-number').value); //Threshold
//    alert ('thr-number='+thrnumber);

    var setcnt=[];
    let i;
    var id_num;var id_num2;
    var pop_d2;var dis22s;
    var total_p=0;var ac_p=0;

    for (i=0;i < 1877;i++){
        setcnt[setcnt.length]=0;
    };
    for (i =0; i <popfeas.length;i++) {
            //               for (i =0; i < 3;i++) {
        const popfea=popfeas[i];
        id_num=popfea.properties.pid-1;
        pop_d2=popfea.properties.z;
        dis22s=popfea.properties.dis2;
        setcnt[id_num]=setcnt[id_num]+1;
//          alert (setcnt[id_num]+':'+id_num);
        if (setcnt[id_num] < 2) {
            total_p=total_p+pop_d2;
            total_p=total_p;
                if (dis22s < thrnumber) { ac_p=ac_p+pop_d2;}
        }
        else if (setcnt[id_num] > 1) {
                id_num2=id_num+1;
//                      alert ('id:'+id_num2+setcnt[id_num]);
        };
    }; 

    var ratio=Math.round(1000*ac_p/total_p)/10;
    document.getElementById('tot-pop').value = Math.round(total_p) ;
    document.getElementById('acc-pop').value = Math.round(ac_p) ;
    document.getElementById('per-pop').value= ratio ;

 //   alert ('finish'+i);
 //   alert ('*** population who live less than '+thrnumber+' m *** \n' +Math.round(ac_p) + '\n'+ '*** total population:*** \n'+Math.round(total_p)+'\n' +ratio+' %');

});
