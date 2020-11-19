import React from 'react';

const CategoryDropdown = (prop: {categoryList: string[]}) => {
    return (
        <div>
            {prop.categoryList.map(categories => (
                <span><option>{categories}</option></span>
            ))}
            <option>{prop.categoryList}</option>
        </div>
    );
}

export default CategoryDropdown;