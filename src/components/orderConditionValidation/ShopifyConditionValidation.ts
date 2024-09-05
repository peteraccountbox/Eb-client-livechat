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
}

export default function shopifyValidateRules(shopifyOrder: ShopifyOrderModel, predicates: PredicateType[], joinCondition: PredicateJoinCondition) {

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
                value = shopifyOrder.fulfillment_status
            }

            if (predicate.attribute == "shipment_status") {
                value = shopifyOrder.fulfillment_status
            }

            if (predicate.attribute == "order_status") {
                value = shopifyOrder.order_status
            }


        } catch (e) {
        }

        validationResults.push(validate(predicate, value));
    }

    return validatePrdicateStatus(validationResults, joinCondition);

}

