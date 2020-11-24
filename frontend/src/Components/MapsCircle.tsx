import React from 'react'
import { Popup, Circle } from 'react-leaflet';

const MapsCircle = (prop: {
    title: string,
    categoryId: number,
    amount: number,
    duration: number,
    latitude: number,
    longitute: number

}) => {

    const categoryNames = ["Yard Work", "Transportation", "Cleaning", "Moving", "Care-Taking", "Cooking"]
    const categoryColor = ["green", "gray", "blue", "red", "purple", "orange"]

    return (
        <Circle
            center={[prop.latitude, prop.longitute]}
            pathOptions={{ color: categoryColor[prop.categoryId-1], fillColor: categoryColor[prop.categoryId-1] }}
            radius={150}>
            <Popup>
                <h2>{prop.title}</h2>
                <h3>Category: {categoryNames[prop.categoryId-1]}</h3>
                <h4>${prop.amount} for {prop.duration} minutes</h4>
            </Popup>
        </Circle>
    );
}

export default MapsCircle