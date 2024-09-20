import React from "react";
import ManageActions from "./ManageActions";

const OrderComponent = (props: any) => {
  const { order, headers, item } = props;
  const orderDetails = JSON.parse(order.meta);
  const itemMap = new Map();

  const items = item ? [item] : orderDetails.line_items;

  orderDetails.line_items.forEach((line_item: any) => {
    let fulfillment = orderDetails.fulfillments.find((fulfillment: any) => {
      return fulfillment.line_items.some(
        (item: any) => item.id == line_item.id
      );
    });
    if (fulfillment) {
      const fulfillmentObj = { status: fulfillment.status };
      itemMap.set(line_item.id, fulfillmentObj);
    }
  });

  // const getReachoOrderStatus = (fulfillment: any) => {
  //   switch (fulfillment.status) {
  //     case "pending":
  //       return "Unfulfilled";
  //       break;
  //     case "open":
  //       return "Processing Fulfillment";
  //     case "success":
  //       return fulfillment.shipment_status == "label_printed"	|| fulfillment.shipment_status == "label_purchased" ? "Pending Delivery" : ""
  //     default:
  //       break;
  //   }
  // };
  return (
    <>
      {/* {orderDetails.fulfillments.length ? (
        orderDetails.fulfillments.map((fulfillment: any) => (
          <>
            {headers && (
              <>
                <div className="orders__collections-list-fulfillment-header">
                  <div className="orders__collections-list-fulfillment-header-title">
                    Shipment
                  </div>
                  <div className="orders__collections-list-fulfillment-header-status">
                    {fulfillment.status && (
                      <span className="orders__collections-list-fulfillment-header-badge">
                        {fulfillment.status}
                      </span>
                    )}
                  </div>
                </div>
                <ManageActions order={order} fulfillment={fulfillment} />
              </>
            )}

            {fulfillment.line_items &&
              fulfillment.line_items.map((item: any) => {
                item = orderDetails.line_items.find(
                  (line_item: any) => line_item.id == item.id
                );
                return (
                  <div className="orders__collections-line-items-group">
                    <div className="orders__collections-line-items">
                      <div className="orders__collections-line-items-avatar">
                        <img
                          src={`${
                            item.product_image_url
                              ? item.product_image_url
                              : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          }`}
                        />
                      </div>
                      <div className="orders__collections-line-items-details">
                        <div className="orders__collections-line-items-name">
                          {item.name}
                        </div>
                        <div className="orders__collections-line-items-currency">
                          {orderDetails.currency}
                          {item.price} <span>x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        ))
      ) : (
        <> */}
      {headers && (
        <>
          {/* <div className="orders__collections-list-fulfillment-header">
                <div className="orders__collections-list-fulfillment-header-title">
                  Shipment
                </div>
                <div className="orders__collections-list-fulfillment-header-status">
                  {orderDetails.fulfillment_status && (
                  <span className="orders__collections-list-fulfillment-header-badge">
                    {orderDetails.fulfillment_status}
                  </span>
                  )}
                </div>
              </div> */}

          {/* <ManageActions order={order} /> */}
        </>
      )}

      {items &&
        items.map((item: any) => (
          <>
            {headers && (
              <>
                <div className="orders__collections-list-fulfillment-header">
                  <div className="orders__collections-list-fulfillment-header-title">
                    Shipment
                  </div>
                  <div className="orders__collections-list-fulfillment-header-status">
                    {item.fulfillment_status && (
                      <span className="orders__collections-list-fulfillment-header-badge">
                        {item.fulfillment_status}
                      </span>
                    )}
                  </div>
                </div>
                <ManageActions
                  order={order}
                  item={item}
                  itemfulfillment={itemMap.get(item.id)}
                />
              </>
            )}
            <div className="orders__collections-line-items-group">
              <div className="orders__collections-line-items">
                <div className="orders__collections-line-items-avatar">
                  <img
                    src={`${
                      item.product_image_url
                        ? item.product_image_url
                        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }`}
                  />
                </div>
                <div className="orders__collections-line-items-details">
                  <div className="orders__collections-line-items-name">
                    {item.name}
                  </div>
                  <div className="orders__collections-line-items-currency">
                    {orderDetails.currency}
                    {item.price} <span>x{item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      {/* </>
      )} */}
    </>
  );
};

export default OrderComponent;
