import React from 'react'
import { InteractiveNodeProps } from '../InteractiveFlowUtils';

const End: React.FC<InteractiveNodeProps> = ({ execution }: InteractiveNodeProps) => {
    return (
        <div>End {JSON.stringify(execution)}</div>
    )
}
export default End;
