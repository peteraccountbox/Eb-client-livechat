import React from "react";

const OrderDetails = (props: any) => {
  const { order } = props;
  const orderDetails = JSON.parse(order.meta);
  const { address1, city, province_code, zip } = orderDetails.shipping_address;

  return (
    <>
      <br />
      Order number: {orderDetails.name}
      <br />
      Fulfillment: {orderDetails.name}.0
      <br />
      Item names:
      {orderDetails.line_items.map((item: any, index: number) =>
        index > 0 ? ", " : "" + item.name
      )}
      <br />
      Tracking Url: {orderDetails.fulfillments[0]?.tracking_url}
      <br />
      Order Created: {orderDetails.created_at}
      <br />
      Shipping address: {address1}, {city}, {province_code}, {zip}
    </>
  );
};

export default OrderDetails;
