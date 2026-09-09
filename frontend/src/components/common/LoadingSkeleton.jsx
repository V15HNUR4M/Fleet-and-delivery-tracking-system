import React from 'react';

const LoadingSkeleton = ({ rows = 8, columns = 6 }) => (
  <div className="table-container">
    <table className="table">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: columns }).map((_, j) => (
              <td key={j} style={{ padding: '11px 12px' }}>
                <div
                  className="skeleton"
                  style={{ height: 14, width: j === 0 ? '80%' : j === columns - 1 ? '60%' : '70%' }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LoadingSkeleton;
