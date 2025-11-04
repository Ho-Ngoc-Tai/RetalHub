import React from "react";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface UsersTableProps {
    users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
    if (!users || users.length === 0) {
        return <p>Không có user nào.</p>;
    }

    return (
        <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
                <tr>
                    <th className="border border-gray-400 px-4 py-2">ID</th>
                    <th className="border border-gray-400 px-4 py-2">Email</th>
                    <th className="border border-gray-400 px-4 py-2">Name</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border border-gray-400 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-400 px-4 py-2">{user.name || "-"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
