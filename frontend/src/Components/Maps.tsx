import React from 'react'
import axios from 'axios';
import { TileLayer, Marker, Popup, MapContainer, CircleMarker, Tooltip, Circle } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

const Maps = (prop: {scrollBool: boolean}) => {
    const rowanLocation: LatLngTuple = [39.7089, -75.1183]
    const anthony: LatLngTuple = [39.7051596, -75.11357028778912]
    
    return (
        <MapContainer center={rowanLocation} zoom={15} scrollWheelZoom={prop.scrollBool} style={{height: 550}}>
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={anthony} >
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                <Tooltip>This is a Marker</Tooltip>
            </Marker>
            <Circle
                center={anthony}
                pathOptions={{ fillColor: 'blue' }}
                radius={200}>
                <Tooltip>This is a Circle - It keeps its size</Tooltip>
            </Circle>
            <Circle
                center={[39.705, -75.112]}
                pathOptions={{ fillColor: 'green' }}
                radius={200}>
                <Tooltip sticky>This is a Circle - It's overlapping, and has a sticky Tooltip</Tooltip>
            </Circle>
            <CircleMarker
                center={rowanLocation}
                pathOptions={{ color: 'red' }}
                radius={50}>
                <Tooltip permanent>This is a CircleMarker - It changes size with zoom, and has a permanent Tooltip</Tooltip>
            </CircleMarker>
        </MapContainer>
    );
  }
  
  export default Maps