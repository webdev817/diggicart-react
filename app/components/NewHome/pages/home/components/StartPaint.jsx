import React, { useState } from 'react';
import { Container, Row, Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import slide1 from '../../../assets/images/slide1.jpg';
import slide2 from '../../../assets/images/slide2.jpg';

import Logo from '../../../assets/images/vectors/Startsida bilder/Draft DiggiART logo.png'

const btnStyle = {
  display: 'block',
  backgroundColor: '#28a74f',
  width: '140px',
  height: '35px',
  lineHeight: '35px',
  color: 'white',
  margin: '10px 0',
  textAlign: 'center',
  borderRadius: '20px'
}

const CallToAction = (active, set) => (
  <Modal isOpen={active} role="dialog" autoFocus={true} centered={false}>
    <ModalHeader toggle={set}>Välj nivå</ModalHeader>
    <ModalBody>
      <div style={{ margin: '0 auto' }} className="age0modal d-flex flex-column align-items-center">
        <a href="/drawing" style={btnStyle} onClick={set}>Upp till 5 år </a>
        <a href="/professionaldrawing" style={btnStyle} onClick={set}>Från 6 år</a>
      </div>
    </ModalBody>
  </Modal>
);

const StartPaint = () => {
  const [actionModal, setActionModal] = useState(false);

  return (
    <section>
      { CallToAction(actionModal, () => setActionModal(!actionModal))}

      <Container className='section_container'>
        <Row>
          <Col md={4} className='paint_container'>
            <img src={Logo} className='paint_img' alt="paint" />
          </Col>
          <Col md={8} className='paint_descr my-black-text'>
            <div className="dropdown dropdown-mint">
              <a href="/drawing" role="button" className="btn--green mine-center">BÖRJA MÅLA!</a>
            </div>
            <p><span>DiggiArt är lika enkelt som roligt för ditt barn</span> att på egen hand kunna måla en tavla. Antingen helt på fri hand eller i kombination med färdiga bilder som kan färgläggas. I DiggiArt finns även möjligheten att ”Ta ett foto” eller ”Ladda upp bild”. <span>En kreativitet utan gränser för ditt barn.</span></p>
            <p><span>Helt säkert är - att det blir en unik tavla.</span> Fin att sätta på väggen i lekrummet eller varför inte ge bort den i present till någon som står barnet nära och värderar tavlan högre än en Picasso målning.</p>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <img className="slide-img m-auto" src={slide1}></img>
          </Col>
          <Col md={6}>
            <img className="slide-img m-auto" src={slide2}></img>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default StartPaint;
