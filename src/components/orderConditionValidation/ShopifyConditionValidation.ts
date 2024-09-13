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
}

export default function shopifyValidateRules(shopifyOrder: ShopifyOrderModel, predicates: PredicateType[], joinCondition: PredicateJoinCondition, fulfillment: any) {

    if (!predicates || predicates.length == 0)
        return true;

    let validationResults: boolean[] = [];
    for (let index = 0; index < predicates.length; index++) {

        const predicate = predicates[index];

        let value = "";
        try {
            if (predicate.attribute == "financial_status") {
                value = shopifyOrder.financial_status;
            }

            if (predicate.attribute == "fulfillment_status") {
                value = fulfillment?.status
            }

            if(predicate.attribute == "order_status") {
                value = getShopifyOrderStatus(shopifyOrder, predicate.value);
            }

            if (predicate.attribute == "shipment_status") {
                value = fulfillment?.shipment_status
            }

            if (predicate.attribute == "order_status") {
                value = getOrderStatus(fulfillment, predicate.value);
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
    switch (rhs) {
        case "cancelled":
            return shopifyOrder.cancelled_at ? "cancelled" : ""
            break;
    
        default:
            break;
    }
    return "";
}