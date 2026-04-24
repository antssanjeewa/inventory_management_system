export const TableEmpty = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="text-center py-4">
            No data found
        </td>
    </tr>
);