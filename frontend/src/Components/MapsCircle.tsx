import React from 'react'
import axios from 'axios';
import { TileLayer, Marker, Popup, MapContainer, CircleMarker, Tooltip, Circle } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import { Container } from 'reactstrap';

const MapsCircle = (prop: {categoryId: number, title: string}) => {
    
    const circleFields = {
        // TODO: associate categories with their respective category ID's
        // Default initial values for the task fields
        // categoryId: 1,
        categoryId: prop.categoryId,
        // title: "",
        title: prop.title,
        description: "",
        recommendedPrice: undefined,
        estimatedDurationMinutes: undefined,
        locationALongitude: 39.7087,
        locationALatitude: -75.110,
        locationBLongitude: 15,
        locationBLatitude: 15
    }
    
    return (
        <Circle
            center={[circleFields.locationALatitude, circleFields.locationALongitude]}
            pathOptions={{ color:'orange', fillColor: 'orange' }}
            radius={100}>
            <Popup>
                <img src={PlaceholderImage} width="100%vw"/>
                <h1>{circleFields.title}</h1>
                <h2>{circleFields.categoryId}</h2>
                <h3>${circleFields.recommendedPrice} for {circleFields.estimatedDurationMinutes} minutes</h3>
            </Popup>
        </Circle>
    );
  }
  
  export default MapsCircle