export const TableLoading = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="text-center py-4">
            Loading...
        </td>
    </tr>
);