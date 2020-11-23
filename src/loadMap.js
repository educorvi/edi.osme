import 'ol/ol.css';
import Map from "ol/Map";
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
import OSM from "ol/source/OSM";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import FullScreen from "ol/control/FullScreen";
import ScaleLine from "ol/control/ScaleLine";
import {Fill, Icon, Stroke, Style, Text} from "ol/style";
import icons from "./icons";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import {fromLonLat} from "ol/proj";
import axios from "axios";

const map = new Map({
    target: 'olmap',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: [0, 0],
        zoom: 0
    })
});
const vectorSource = new VectorSource({
    features: []
});

const vectorLayer = new VectorLayer({
    source: vectorSource
});

map.addLayer(vectorLayer)
map.addControl(new FullScreen());
map.addControl(new ScaleLine())

function featureListener(event, feature) {
    function mapsSelector() {
        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        const lat = feature.get("lat");
        const lon = feature.get("lon");
        if /* if we're on iOS, open in Apple Maps */
        ((navigator.platform.indexOf("iPhone") !== -1) ||
            (navigator.platform.indexOf("iPad") !== -1) ||
            (navigator.platform.indexOf("iPod") !== -1))
            window.open(`http://maps.apple.com/maps?q=${lat},${lon}`);
        else if (isAndroid) {
            window.open(`geo:${lat},${lon}`);
        } else {
            window.open(`https://maps.google.com/maps?daddr=${lat},${lon}&amp;ll=`);
        }

    }

    mapsSelector()


}


map.on('click', function (event) {
    map.forEachFeatureAtPixel(event.pixel, function (feature) {
        featureListener(event, feature);
    });
});

const descVisible = 20;


function getStyleFunction(color) {
    return function styleFunction(feature, resolution) {
        return [
            new Style({
                image: new Icon({
                    crossOrigin: 'anonymous',
                    imgSize: [512, 512],
                    scale: (3 / 50),
                    color:color,
                    src: icons.src
                }),
                text: new Text({
                    font: '16px Calibri,sans-serif',
                    fill: new Fill({color: '#000'}),
                    stroke: new Stroke({
                        color: '#fff', width: 2
                    }),
                    offsetY: 30,
                    // get the text from the feature - `this` is ol.Feature
                    // and show only under certain resolution
                    text: resolution > descVisible ? "" : feature.get('title'),
                    backgroundFill: new Fill({color: 'rgba(255,255,255,0.64)'})
                })
            })
        ];
    }
}


function addPoint(lon, lat, title, address, color) {
    const point = new Feature({
        geometry: new Point(fromLonLat([lon, lat]))
    })

    point.set('title', title);
    point.set('address', address);
    point.set("lon", lon);
    point.set("lat", lat);
    point.setStyle(getStyleFunction(color))

    vectorSource.addFeature(point);
    return point;

}
const points = [];

axios.get("locations.json").then(res => {
    for (let i = 0; i < res.data.length; i++) {
        let loc = res.data[i];
        points.push(addPoint(loc.lon, loc.lat, loc.title, loc.address, loc.color));
    }
    afterFilled()
});


function afterFilled() {
    const extent = vectorLayer.getSource().getExtent();
    map.getView().fit(extent);
    map.getView().setZoom(map.getView().getZoom() - 1)
    map.updateSize();
}
