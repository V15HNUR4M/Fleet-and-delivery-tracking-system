import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'There are no items to display.',
  action,
  icon,
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      {icon || <PackageOpen size={48} strokeWidth={1} />}
    </div>
    <div className="empty-state-title">{title}</div>
    <div className="empty-state-desc">{description}</div>
    {action}
  </div>
);

export default EmptyState;
