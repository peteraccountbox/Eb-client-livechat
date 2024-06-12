import React, { FC, useContext, useEffect } from 'react'
import { AppContext } from '../appContext';
import { ChatMessagePaylodObj } from '../Models';
import { getOperator, getOperatorName } from '../Utils';

export interface OperatorNamePropsType {
  agent_id:number,
}

const OperatorName: FC<OperatorNamePropsType> = (props) => {

  const parentContext = useContext(AppContext);
  const getOperatorName = () => {
    if (!props.agent_id) return "";

    let operator = getOperator(props.agent_id, parentContext.agents);
    return operator?.name;
  }
  useEffect(() => {
    
  
        return () => {
          
        }
    }, []);
  return (
    <span>{getOperatorName()}</span>
  )
}

export default OperatorName