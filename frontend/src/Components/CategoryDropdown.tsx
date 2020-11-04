import React, { useContext, useState } from 'react';
import { Button } from 'reactstrap';
import { isNoSubstitutionTemplateLiteral } from 'typescript';

{/*import { MdPerson } from 'react-icons/md';
import { IconContext } from 'react-icons'; */}

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