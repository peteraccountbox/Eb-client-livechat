import validate, { PredicateJoinCondition, PredicateType, validatePrdicateStatus } from "./ConditionValidation";

export default function shopifyValidateRules(shopifyOrder: any, predicates: PredicateType[], joinCondition: PredicateJoinCondition) {

    if (!predicates || predicates.length == 0)
        return true;

    let validationResults: boolean[] = [];
    for (let index = 0; index < predicates.length; index++) {

        const predicate = predicates[index];

        let value = "";
        try {
            if (predicate.attribute == "order_date") {
                value = shopifyOrder.items.val;
            }
        } catch (e) {
        }

        validationResults.push(validate(predicate, value));
    }

    return validatePrdicateStatus(validationResults, joinCondition);

}

