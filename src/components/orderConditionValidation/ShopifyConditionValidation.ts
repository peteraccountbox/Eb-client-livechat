import validate, { PredicateJoinCondition, PredicateType, validatePrdicateStatus } from "./ConditionValidation";

export type ShopifyOrderModel = {
    id: string;
    email: string;
    name: string;
    cancelled_at: string;
    created_at: string;
    fulfillment_status: string;
    financial_status: string;
    shipment_status: string;
    order_status: string;
    status: string;
    meta: any;
}

export default function shopifyValidateRules(shopifyOrder: ShopifyOrderModel, predicates: PredicateType[], joinCondition: PredicateJoinCondition, fulfillment: any, type: string) {

    if (!predicates || predicates.length == 0)
        return true;
    const orderDetails = JSON.parse(shopifyOrder.meta);
    let validationResults: boolean[] = [];
    for (let index = 0; index < predicates.length; index++) {

        const predicate = predicates[index];

        let value = "";
        try {
            if(predicate.attribute == "order_created" || predicate.attribute == "order_delivered") {
                value = getOrderCreateOrDelivery(shopifyOrder, predicate, fulfillment);
            }
            if (predicate.attribute == "financial_status") {
                value = orderDetails.financial_status;
            }

            if (predicate.attribute == "fulfillment_status") {
                value = fulfillment?.status
            }

            if(predicate.attribute == "order_status") {
                value = type == "shopify" ? getShopifyOrderStatus(shopifyOrder, predicate.value) : getOrderStatus(fulfillment, predicate.value);
            }

            if (predicate.attribute == "shipment_status") {
                value = fulfillment?.shipment_status
            }



        } catch (e) {
        }

        validationResults.push(validate(predicate, value));
    }

    return validatePrdicateStatus(validationResults, joinCondition);

}

const getOrderStatus = (fulfillment: any, rhs: string) => {


    switch (rhs) {
        case "processing_fulfillment":
          return fulfillment && fulfillment.status == "open" ? "processing_fulfillment" : "";
          break;
        case "unfulfilled":
          return !fulfillment || (fulfillment && fulfillment.status == "pending") ? "unfulfilled" : "" ;
          break;
        case "pending_delivery":
          return fulfillment && fulfillment.status == "success" ?  "pending_delivery": "";
        default:
          break;
      }

      return "";
}

const getShopifyOrderStatus = (shopifyOrder: ShopifyOrderModel, rhs: string) => {
  const orderDetails = JSON.parse(shopifyOrder.meta);  
  switch (rhs) {
        case "cancelled":
            return orderDetails.cancelled_at ? "cancelled" : ""
            break;
    
        default:
            break;
    }
    return "";
}

const getOrderCreateOrDelivery = (shopifyOrder: ShopifyOrderModel, predicate: any, fulfillment: any) => {
    const orderDetails = JSON.parse(shopifyOrder.meta);
    const date = new Date(orderDetails.created_at);
    const fulfillmentDate = new Date(fulfillment?.created_at);
    switch (predicate.attribute) {
      case "order_created":
        return new Date().getDay() - date.getDay();
        break;
      case "order_delivered":
        return (
          fulfillment ?
          new Date().getDay() - fulfillmentDate.getDay() : predicate.value
        );
        break;
      default:
        break;
    }
    return predicate.value;
  };