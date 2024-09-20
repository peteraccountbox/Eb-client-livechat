export type PredicateType = {
    attribute: string;
    dataType: FilterPredicateDataType;
    condition: FilterPredicateConditions;
    value: string
}


export enum PredicateJoinCondition {
    OR = "OR",
    AND = "AND",
}


export enum FilterPredicateConditions {
    is_one_of = "is_one_of",
    is_empty = "is_empty",
    less_than = "less_than",
    equals = "eq"
}

export enum FilterPredicateDataType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    DATE = "DATE",
    BOOLEAN = "BOOLEAN",
    LIST = "LIST",
}

export default function validate(predicate: PredicateType, value?: any) {

    switch (predicate.condition) {
        case FilterPredicateConditions.equals:
            return (predicate.value === value)
        case FilterPredicateConditions.is_one_of:
            return (value && predicate.value.indexOf(value) > -1)
        case FilterPredicateConditions.is_empty:
            return (!value) ? true : false;
        case FilterPredicateConditions.less_than:
            return (value != null && predicate.value && value < predicate.value)
        default:
            return false;
    }

}

export function validatePrdicateStatus(validateStates: boolean[], joinCondition: PredicateJoinCondition) {

    if (joinCondition == PredicateJoinCondition.OR) {
        let state = validateStates.find(state => (state));
        return (state) ? true : false;
    }
    if (joinCondition == PredicateJoinCondition.AND) {
        let state = validateStates.find(state => (!state));
        return (state) ? false : true;

    }
    return false;
}
