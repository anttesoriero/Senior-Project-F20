import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';


const StarRating = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const saveRating = (ratingVal) => {
        setRating(ratingVal)
        localStorage.setItem('rating', ratingVal);
    }

    return(
        <div>
            {[...Array(5)].map((star, i) => {
                const ratingVal = i + 1;

                return(
                    <label>
                        <input 
                            style={{display: 'none'}}
                            type='radio' 
                            name='rating' 
                            value={ratingVal} 
                            onClick={() => saveRating(ratingVal)}
                            />
                        <FaStar 
                            onMouseEnter={() => setHover(ratingVal)} 
                            onMouseLeave={() => setHover(0)}
                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                            size={50} 
                            color={ratingVal <= (hover || rating) ? '#ffc107' : '#e4e5e6'}
                        />
                    </label>
                )
            })}
        </div>
    )
}

export default StarRating;