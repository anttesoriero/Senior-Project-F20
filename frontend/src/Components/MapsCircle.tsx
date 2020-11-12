import React from 'react'
import axios from 'axios';
import { TileLayer, Marker, Popup, MapContainer, CircleMarker, Tooltip, Circle } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import { Container } from 'reactstrap';

const MapsCircle = (prop: {
    title: string,
    categoryId: number, 
    amount: number,
    duration: number,
    latitude: number,
    longitute: number

}) => {
    
    return (
        <Circle
            center={[prop.latitude, prop.longitute]}
            pathOptions={{ color:'blue', fillColor: 'blue' }}
            radius={100}>
            <Popup>
                {/* Stretch Goal - <img src={PlaceholderImage} width="100%vw"/> */}
                <h1>{prop.title}</h1>
                <h2>Category: {prop.categoryId}</h2>
                <h3>${prop.amount} for {prop.duration} minutes</h3>
            </Popup>
        </Circle>
    );
  }
  
  export default MapsCircle