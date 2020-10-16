import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '500px',
    height: '500px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const TaskPage = () => {
    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(mapLoad) {
        const bounds = new window.google.maps.LatLngBounds();
        mapLoad.fitBounds(bounds);
        setMap(mapLoad)
    }, [setMap]);

    const onUnmount = useCallback(function callback() {
        setMap(null)
    }, [setMap]);

    return (
        <div>
            <LoadScript googleMapsApiKey="AIzaSyBcriJb-SLk7ljQmh1P_L9MaiNj8VbZj_o">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    { /* Child components, such as markers, info windows, etc. */}
                    <></>
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export default React.memo(TaskPage);