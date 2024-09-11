import React from "react";

const Address = (props: any) => {
  const {
    address: {
      first_name,
      last_name,
      address1,
      city,
      province_code,
      zip,
      country,
    },
    type,
  } = props;
  return (
    <>
      <hr className="line__dashed" />
      <div className="order__address-section">
        <header>
          <h2 className="order__address-section-title">{type} information</h2>
        </header>
        <p>
          {first_name} {last_name}
        </p>
        <p>
          {address1}, {city}, {province_code}, {zip}
        </p>
        <p>{country}</p>
      </div>
    </>
  );
};

export default Address;
