import React from "react";
import ManageActions from "./ManageActions";

const OrderComponent = (props: any) => {
  const { order, headers } = props;
  const orderDetails = JSON.parse(order.meta);
  return (
    <>
      {orderDetails.fulfillments.length ? (
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
              fulfillment.line_items.map((item: any) => (
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
              ))}
          </>
        ))
      ) : (
        <>
          {headers && (
            <>
              <div className="orders__collections-list-fulfillment-header">
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
              </div>

              <ManageActions order={order} />
            </>
          )}

          {orderDetails.line_items &&
            orderDetails.line_items.map((item: any) => (
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
            ))}
        </>
      )}
    </>
  );
};

export default OrderComponent;
