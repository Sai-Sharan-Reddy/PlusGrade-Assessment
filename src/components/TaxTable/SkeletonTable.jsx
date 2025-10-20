
import "./SkeletonTable.css";

const SkeletonTable = () => {
  return (
    <div className="skeletonTable">
      <table>
        <thead>
          <tr>
            {[...Array(4)].map((_, i) => (
              <th key={i}>
                <div className="skeletonCell header"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(4)].map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="skeletonCell"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
