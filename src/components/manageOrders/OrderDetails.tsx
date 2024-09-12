import React from "react";

const OrderDetails = (props: any) => {
  const { order, returnItems } = props;
  const orderDetails = JSON.parse(order.meta);
  const { shipping_address } = orderDetails;
  var total = 0;
  const date = new Date(orderDetails.created_at);
  return (
    <>
      <br />
      Order number: {orderDetails.name}
      <br />
      {!returnItems && (
        <>
          Fulfillment: {orderDetails.name}.0 <br />
        </>
      )}
      {returnItems ? "Items requested for return" : "Item names"}:
      {orderDetails.line_items.map((item: any, index: number) => {
        const quantity = returnItems.find(
          (rItem: any) => rItem.id == item.id && rItem.isSelect
        )?.quantity;
        total += quantity ? quantity * item.price : 0;
        return quantity
          ? (index > 0 ? ", " : "") + (quantity + "x " + item.name)
          : "";
      })}
      <br />
      {returnItems
        ? "Total: " + orderDetails.currency + total
        : "Tracking Url: " + orderDetails.fulfillments[0]?.tracking_url}
      <br />
      Order Created:{" "}
      {`${date.toLocaleString()} ${date.getHours() >= 12 ? " PM" : " AM"}`}
      <br />
      Shipping address:{" "}
      {shipping_address
        ? shipping_address.address1 +
          ", " +
          shipping_address.city +
          ", " +
          shipping_address.province_code +
          ", " +
          shipping_address.zip
        : "/"}
    </>
  );
};

export default OrderDetails;
