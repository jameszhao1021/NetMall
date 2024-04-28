import Carousel from 'react-bootstrap/Carousel';
import Banner1 from '../assets/banner/Banner1.jpg';
import Banner2 from '../assets/banner/Banner2.jpg';
import Banner3 from '../assets/banner/Banner3.jpg';


export default function BannerCarousel() {
    return (
        <Carousel className='my-3'>
          <Carousel.Item>
            <img src={Banner1} className="d-block w-100 carousel-image" alt="slide image"/>
           
          </Carousel.Item>

          <Carousel.Item>
          <img src={Banner2} className="d-block w-100 carousel-image" alt="slide image"/>
            
          </Carousel.Item>

          <Carousel.Item>
          <img src={Banner3} className="d-block w-100 carousel-image" alt="slideimage"/>
           
          </Carousel.Item>
        </Carousel>
      );
};