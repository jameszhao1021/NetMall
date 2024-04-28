import React from "react";
import { Link } from 'react-router-dom';
import '../styles/CategoryBar.css';
import { Button, Dropdown } from 'react-bootstrap';

function CategoryBar({ searchQuery, handleSearch, handleSearchQueryChange }) {

    return (
        <div className='pt-3 '>
            <div className="container">
                <div className="row">
                    <div className="col ">
                        <div className="d-none d-lg-block ">
                            <ul className="nav justify-content-evenly align-items-center">
                                <li className='nav-item categoryBar'>
                                    <Link to='/Electronics'>
                                        Electronics
                                    </Link>
                                </li>
                                <li className='nav-item categoryBar'>
                                    <Link to='/Clothing'>
                                        Clothing
                                    </Link>
                                </li>
                                <li className='nav-item categoryBar'>
                                    <Link to='/Home'>
                                        Home
                                    </Link>
                                </li>
                                <li className='nav-item categoryBar'>
                                    <Link to='/Toys'>
                                        Toys
                                    </Link>
                                </li>
                                <li className='nav-item categoryBar'>
                                    <Link to='/Sports'>
                                        Sports
                                    </Link>
                                </li>
                                <li className='nav-item categoryBar'>
                                    <Link to='/Cosmetics'>
                                        Cosmetics
                                    </Link>
                                </li>
                                <li>
                                    <div className="search-bar">
                                      <div className="d-flex align-items-center">
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={searchQuery}
                                                onChange={handleSearchQueryChange}
                                                className="searchBarInit"
                                            />
                                            <button className='searchButtonInit px-3' onClick={handleSearch}>Search</button>
                                            </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex d-lg-none justify-content-between collapsePart">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                                    Categories
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="/Electronics">Electronics</Dropdown.Item>
                                    <Dropdown.Item href="/Clothing">Clothing</Dropdown.Item>
                                    <Dropdown.Item href="/Home">Home</Dropdown.Item>
                                    <Dropdown.Item href="/Toys">Toys</Dropdown.Item>
                                    <Dropdown.Item href="/Sports">Sports</Dropdown.Item>
                                    <Dropdown.Item href="/Cosmetics">Cosmetics</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div className="d-flex searchCollapsePart">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchQueryChange}
                                    className="searchBar"
                                />
                                <Button className='searchButton' variant="primary" onClick={handleSearch}>Search</Button>
                            </div>
                        </div>
                       



                    </div>



                </div>
            </div>
        </div>
    );
}

export default CategoryBar;
