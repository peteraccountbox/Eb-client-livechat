import React, { useState } from "react";
const people = [1, 2, 3, 4, 5];
const ItemSelection = () => {
  const [items, setItems] = useState<any>();

  const selectItem = () => {};

  return (
    <>
      <header className="collection-header">
        <h2 className="title">My items</h2>
        <p className="desc">Item Selection message</p>
        <div
          className=""
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <div>
            <h2 className="title">Order Number </h2>
            <p className="desc">Date of creation </p>
          </div>
          <div>
            <h2 className="title" style={{ textAlign: "end" }}>
              Amount
            </h2>
            <p className="desc">selected Items count</p>
          </div>
        </div>
      </header>
      <ul className="help__collections-list">
        {people.map((orders: any) => (
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
            }}
          >
            <div className="" style={{ display: "flex", width: "100%" }}>
              <img
                style={{ width: "5rem", height: "5rem", borderRadius: "5px" }}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
              <div style={{ marginLeft: "10px", width: "100%" }}>
                <div>Item Name</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div>Price</div>
                    <span>Quantity : 1</span>
                  </div>
                  <div onClick={() => selectItem()}> - 2 + </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          className="chat__messages-btn"
          // onClick={submitForm}
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
    </>
  );
};

export default ItemSelection;
