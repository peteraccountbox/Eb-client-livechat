import React from "react";

const people = [1, 2, 3, 4, 5];

const OrderSelection = (props: any) => {
  return (
    <>
      <header className="collection-header">
        <h2 className="title">My orders </h2>
        <p className="desc">Order Selection message</p>
      </header>
      <ul className="help__collections-list">
        {people.map((orders: any) => (
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
              alignItems: "center",
            }}
          >
            <div className="" style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ width: "4rem", height: "4rem", borderRadius: "5px" }}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
              <div style={{ marginLeft: "10px" }}>
                <div>Order Number</div>
                <div>Date of creation</div>
              </div>
            </div>

            <div style={{ textAlign: "end" }}>
              <div>Amount</div>
              <span>Status</span>
            </div>
          </div>
        ))}
      </ul>
    </>
  );
};

export default OrderSelection;
