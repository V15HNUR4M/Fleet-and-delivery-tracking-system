import React from 'react';
import { labelify } from '../../utils';
import {
  ORDER_STATUS_BG,
  VEHICLE_STATUS_BG,
  DRIVER_AVAILABILITY_BG,
} from '../../constants';

const StatusBadge = ({ value, type = 'order' }) => {
  let className = 'status-badge';

  if (type === 'order') {
    className += ' ' + (ORDER_STATUS_BG[value] ?? 'status-badge--created');
  } else if (type === 'vehicle') {
    className += ' ' + (VEHICLE_STATUS_BG[value] ?? 'status-badge--created');
  } else if (type === 'driver') {
    className += ' ' + (DRIVER_AVAILABILITY_BG[value] ?? 'status-badge--created');
  }

  return <span className={className}>{labelify(value)}</span>;
};

export default StatusBadge;
