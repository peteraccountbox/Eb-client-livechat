import React from 'react'
import { InteractiveNodeProps } from '../InteractiveFlowUtils';

const Start: React.FC<InteractiveNodeProps> = ({ execution }: InteractiveNodeProps) => {
    return (
        <div>Start {JSON.stringify(execution)}</div>
    )
}
export default Start;
