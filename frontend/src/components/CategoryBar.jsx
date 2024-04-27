import React from "react";
import '../index.css';
import { Link } from 'react-router-dom';

function CategoryBar(){

    return(
        <div className='pt-3'>
        <ul className='d-flex justify-content-center gap-5' style={{listStyle:'none'}}>
         <li className='categoryBar'>
            <Link to='/Electronics'>
             Electronics
            </Link>
         </li>
         <li className='categoryBar'>
         <Link to='/Clothing'>
             Clothing
            </Link>
         </li>
         <li className='categoryBar'>
         <Link to='/Home'>
             Home
            </Link>
         </li>
         <li className='categoryBar'>
         <Link to='/Toys'>
             Toys
            </Link>
         </li>
         <li className='categoryBar'>
         <Link to='/Sports'>
             Sports
            </Link>
         </li>
         <li className='categoryBar'>
         <Link to='/Cosmetics'>
             Cosmetics
            </Link>
         </li>
       </ul> 
   </div>
    )
}

export default CategoryBar