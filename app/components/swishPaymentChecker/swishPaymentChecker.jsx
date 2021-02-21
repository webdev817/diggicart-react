import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import request from '../../utils/request';
import "./style.scss";

import logoImg from "../../assets/images/DiggiArt_png_1.png";

const SwishPaymentChecker = ({
  match: {
    params: {
      paymentRequestId
    } = {}
  } = {}
}) => {

  const [isLoading, setLoader] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("FAILED");
  const [order, setOrder] = useState({});

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    if (!paymentRequestId) {
      return;
    }
    const checkStatusUrl = `payment/request-callback/${paymentRequestId}`;
    setLoader(true);
    await request.getPublic(checkStatusUrl).then(response => {
      const { data } = response;
      setOrder(data.order || {});
      setPaymentStatus(data.status);
      setLoader(false);
    }).catch(error => {
      toast.error('Betalning misslyckades', { autoClose: 5000 });
      setPaymentStatus("FAILED");
      setLoader(false);
    });
  }

  const isPaid = (paymentStatus === "PAID");
  const headerClass = isPaid ? "success_block" : "failed";

  return (
    <div className="swish_pay_check">
      <div className={`header_block ${!isLoading ? headerClass : ""}`}>
        <div className="img_logo">
          <img src={logoImg} alt="logo" />
        </div>
        {
          !isLoading &&
          <div className="content_block">
              {
                isPaid &&
                <div>
                  <span style={{ color: `#fff`, fontSize: "35px" }}><i className="fa fa-thumbs-up"></i></span>
                </div>
              }
              <div className="text">
                { isPaid ? "TACK! BETALNING GENOMFÖRD" : "BETALNING MISSLYCKADES" }
              </div>
          </div>
        }
      </div>
      <h2 className="center-text">
        {/* Orderdetaljer */}
      </h2>
      <div className="center-text container">
          {
            !paymentRequestId &&
            <div className="error">
              Ogiltig orderinformation går till
            </div>
          }
          {
            order._id &&
            <div className="order_details">
              <h3>Ordernummer: {"  "} #{order.orderId}</h3>
              <div className="img_block">
                <img src={order.image} />
              </div>

              <div className="homePage_block">
                {/* <a href="/">Startsida</a> */}
                <Link to="/">Startsida</Link>
                <div><b>Leveranstid ca 5 arbetsdagar</b></div>
              </div>

              <div className="support_block">
                <div>
                  <div><b>EMAIL</b></div>
                  <div></div>
                  <div><a href="mailto:support@diggiart.com">support@diggiart.com</a></div>
                </div>
                <div>
                  <div><b>TELEFON</b></div>
                  <div><a href="tel:0854066640">08 540 666 40</a></div>
                </div>

              </div>

            </div>
          }
          {
            isLoading && <h3 className="loader"><span style={{ color: `#ccc`, fontSize: "80px" }}><i className="fa fa-spinner"></i></span></h3>
          }
      </div>
    </div>
  )
}

export default SwishPaymentChecker;
