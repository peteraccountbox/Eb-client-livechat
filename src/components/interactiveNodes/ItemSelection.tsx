import React, { useContext, useEffect, useState } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import { getReq } from "../../request";
import { OPENED_FLOW, ORDER_FETCH_URL } from "../../globals";
import { AppContext } from "../../appContext";
import { getSessionStoragePrefs } from "../../Storage";

const ItemSelection: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
  executionMeta,
}: InteractiveNodeProps) => {
  const parentContext = useContext(AppContext);
  const { chatFlows } = parentContext;
  const chatFlow = chatFlows.find(
    (flow) => flow.id === getSessionStoragePrefs(OPENED_FLOW)
  );
  useEffect(() => {
    if (executionMeta && !executionMeta.isCompleted)
      getReq(ORDER_FETCH_URL, {
        customerId: executionMeta.info.customerId,
        storeId: chatFlow?.storeId,
        orderId: executionMeta.info.orderId,
      }).then((response) => {
        if (response.data.meta) {
          setItems(JSON.parse(response.data.meta)?.line_items);
          setOrderDetails(JSON.parse(response.data.meta));
        }
        console.log(response.data);
      });
  }, []);

  const [items, setItems] = useState<any>([]);

  const [orderDetails, setOrderDetails] = useState<any>();

  const [selectedItems, setSelectedItems] = useState<any>([]);

  const selectItems = () => {
    const total_price = selectedItems.reduce(
      (priceAccumulator: number, selectedItem: any) => {
        const total_tax = selectedItem.tax_lines.reduce(
          (taxAccumulator: number, tax_line: any) =>
            taxAccumulator + Number(tax_line.price),
          0
        );
        return (
          priceAccumulator +
          selectedItem.quantity * (total_tax + Number(selectedItem.price)) -
          Number(selectedItem.total_discount)
        );
      },
      0
    );

    execution.nodeId = execution.node.id;
    execution.executed = true;
    const response = {
      items: selectedItems.map((selectedItem: any) => {
        return {
          name: selectedItem.name,
          id: selectedItem.id,
          quantity: selectedItem.quantity,
        };
      }),
      total_price: total_price,
      currency: orderDetails.currency,
      created_at: orderDetails.created_at,
      order_id: orderDetails.id,
      order_number: orderDetails.order_number,
      name: orderDetails.name,
      shipping_address: orderDetails.shipping_address,
    };
    execution.responseAction = [
      {
        id: execution.node.id,
        type: "item_selection",
        data: JSON.stringify(response),
      },
    ];
    executeNodeOnUserInteraction(execution);
  };
  const onChecked = (checked: boolean, item: any) => {
    console.log(checked);
    if (checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem: any) => selectedItem.id != item.id)
      );
    }
  };

  const itemsDetails =
    execution.responseAction && execution.responseAction.length > 0
      ? JSON.parse(execution.responseAction[0].data)
      : null;
  const { address1, city, province_code, zip } = itemsDetails?.shipping_address;
  return execution.executed && itemsDetails ? (
    <div className="chat__messages-group--me">
      <div className="chat__messages-group">
        <ul className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                Order number: {itemsDetails.name}
                <br />
                Selected items:
                <br />
                {itemsDetails.items.map((item: any) => (
                  <>
                    {item.quantity} × {item.name} <br />
                  </>
                ))}
                <br />
                Total: {itemsDetails.currency}
                {itemsDetails.total_price}
                <br />
                Order Created: {itemsDetails.created_at}
                <br />
                Shipping address:{" "}
                {itemsDetails.shipping_address
                  ? `${address1},` +
                    `${city}, ` +
                    `${province_code}, ` +
                    `${zip}`
                  : "/"}
              </span>
            </div>
          </div>
        </ul>
      </div>
    </div>
  ) : orderDetails ? (
    <>
      <header className="collection-header">
        <h2 className="title">Select items</h2>
        <p className="desc">{execution.node.data.formData?.message}</p>
        <div
          className=""
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <div>
            <h2 className="title">Order {orderDetails.name} </h2>
            <p className="desc">{orderDetails.created_at} </p>
          </div>
          <div>
            <h2 className="title" style={{ textAlign: "end" }}>
              {orderDetails.currency}
              {orderDetails.current_total_price}
            </h2>
            <p className="desc">{selectedItems.length} selected Items</p>
          </div>
        </div>
      </header>
      <ul className="help__collections-list">
        {items.length > 0 &&
          items.map((item: any) => (
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 20px",
              }}
            >
              <input
                type="checkbox"
                className="chat__form-check-input"
                onChange={(e) => onChecked(e.currentTarget.checked, item)}
              />
              <div className="" style={{ display: "flex", width: "100%" }}>
                <img
                  style={{ width: "5rem", height: "5rem", borderRadius: "5px" }}
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
                <div style={{ marginLeft: "10px", width: "100%" }}>
                  <div>{item.name}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>
                        {orderDetails.currency}
                        {item.price}
                      </div>
                      <span>Quantity : {item.quantity}</span>
                    </div>
                    {/* <div onClick={() => selectItem()}>
                      {" "}
                      - {item.current_quantity} +{" "}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </ul>
      {selectedItems.length ? (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            className="chat__messages-btn"
            onClick={selectItems}
            style={{
              display: "flex",
              alignItems: "center",
              width: "auto",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Select Items
          </button>
        </span>
      ) : (
        <></>
      )}
    </>
  ) : (
    <></>
  );
};

export default ItemSelection;
