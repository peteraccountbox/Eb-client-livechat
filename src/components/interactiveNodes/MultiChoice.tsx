import React from 'react'
import { InteractiveNodeProps } from '../InteractiveFlowUtils';

const MultiChoice: React.FC<InteractiveNodeProps> = ({ execution }: InteractiveNodeProps) => {
    return (
        <div>MultiChoice {JSON.stringify(execution)}</div>
    )
}
export default MultiChoice;

