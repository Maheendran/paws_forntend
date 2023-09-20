import React, { useEffect, useRef, useState } from 'react'
import { toast, Toaster } from "react-hot-toast";
import mapboxgl, { Marker } from "mapbox-gl";
import './Map.css'
const Map = ({ handleGeolocation,longitude,latitude }: any) => {

mapboxgl.accessToken = 'pk.eyJ1IjoibWFoZWVuZHJhbmtwIiwiYSI6ImNsbGJ5d2Z1MjBlYXkzY3Fzd24zaGlxeHIifQ.bF2lVOg3sAFjI--Gms6C5A'

const mapContainer = useRef<HTMLDivElement | null>(null);
const map = useRef<mapboxgl.Map | null>(null);

const [lng, setLng] = useState(longitude ? longitude:  77.5946);
    const [lat, setLat] = useState(latitude ? latitude : 12.9716);

const [zoom, setZoom] = useState(12);


useEffect(() => {
    map.current = new mapboxgl.Map({
        container: mapContainer.current || "",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
    });

    map.current.on("dblclick",handleMapDoubleClick)

    const marker = new mapboxgl.Marker()
        .setLngLat([lng,lat])
        .addTo(map.current)
}, [lng, lat, zoom]);


const handleMapDoubleClick = (e:mapboxgl.MapMouseEvent) =>{

    const {lng,lat} = e.lngLat
    setLng(lng)
    setLat(lat)
    setZoom(15)
    handleGeolocation(lat, lng, true);
}

useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
        container: mapContainer.current || "",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
    });
});
  return (
    <>
<h4>Location mark</h4>
     <Toaster toastOptions={{ duration: 3000 }} />
    <div ref={mapContainer} className="map-container" ></div>
    
    </>
  )
}

export default Map