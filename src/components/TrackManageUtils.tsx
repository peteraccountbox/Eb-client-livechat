import Cancel from "./manageOrders/Cancel";
import CustomerLogin from "./manageOrders/CustomerLogin";
import Order from "./manageOrders/Order";
import Orders from "./manageOrders/Orders";
import RaisedIssue from "./manageOrders/RaisedIssue";
import ReportIssue from "./manageOrders/ReportIssue";
import Return from "./manageOrders/Return";
import Track from "./manageOrders/Track";

export enum OrderManageTypes {
  ORDERS = "ORDERS",
  ORDER = "ORDER",
  TRACK = "TRACK",
  CANCEL = "CANCEL",
  REPORT_ISSUE = "REPORT_ISSUE",
  CUSTOMER_IDENTIFICATION = "CUSTOMER_IDENTIFICATION",
  RAISED_ISSUE = "RAISED_ISSUE",
  RETURN = "RETURN",
}

export const OrderManagementComponents: {
  [key: string]: React.FC<any>;
} = {
  [OrderManageTypes[OrderManageTypes.ORDERS]]: Orders,
  [OrderManageTypes[OrderManageTypes.ORDER]]: Order,
  [OrderManageTypes[OrderManageTypes.TRACK]]: Track,
  [OrderManageTypes[OrderManageTypes.CANCEL]]: Cancel,
  [OrderManageTypes[OrderManageTypes.REPORT_ISSUE]]: ReportIssue,
  [OrderManageTypes[OrderManageTypes.CUSTOMER_IDENTIFICATION]]: CustomerLogin,
  [OrderManageTypes[OrderManageTypes.RAISED_ISSUE]]: RaisedIssue,
  [OrderManageTypes[OrderManageTypes.RETURN]]: Return,
};
