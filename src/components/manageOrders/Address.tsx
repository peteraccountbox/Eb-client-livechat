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
      <header className="">
        <h2 className="title">{type} information</h2>
      </header>
      <div>
        {first_name} {last_name}
      </div>
      <div>
        {address1}, {city}, {province_code}, {zip}
      </div>
      <div>{country}</div>
    </>
  );
};

export default Address;
